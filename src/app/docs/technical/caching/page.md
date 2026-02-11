---
title: Systeme de Cache
nextjs:
  metadata:
    title: Systeme de Cache - Products Manager APP
    description: Architecture de cache Redis multi-DB, TTL par domaine, invalidation, warming et bonnes pratiques.
---

Products Manager utilise un systeme de cache Redis multi-niveaux avec des prefixes par base de donnees, des TTL adaptes a chaque domaine fonctionnel, une invalidation ciblee et un warming automatique au demarrage. {% .lead %}

---

## Architecture du cache

Le systeme de cache est structure en deux niveaux :

| Niveau | Technologie | TTL | Usage |
|--------|-------------|-----|-------|
| L1 | Memoire locale (dict Python) | Court (secondes) | Hot data au sein d'un worker |
| L2 | Redis 7.x | Variable (30 min - 24h) | Cache distribue partage entre workers |

Le service principal est `CacheService` dans `services/cache_service.py`, qui encapsule toutes les operations Redis avec gestion d'erreurs robuste et reconnexion automatique.

---

## Configuration Redis

### Connexion

```python
# La connexion est configuree via la variable d'environnement REDIS_URL
# Format : redis://host:port/db_number
REDIS_URL = "redis://staging-redis:6379/0"
```

| Parametre | Valeur | Description |
|-----------|--------|-------------|
| `socket_connect_timeout` | 5s | Timeout de connexion |
| `socket_timeout` | 5s | Timeout des operations |
| `retry_on_timeout` | `True` | Reconnexion automatique |
| `health_check_interval` | 30s | Verification de sante periodique |
| `decode_responses` | `True` | Decodage UTF-8 automatique |

### Prefixes par base de donnees

Chaque base de donnees dispose d'un prefixe distinct pour eviter les collisions de cles :

| Base de donnees | Prefixe | Exemple de cle |
|----------------|---------|----------------|
| Catalogue | `catalog_` | `catalog_products_count` |
| Media | `media_` | `media_file_abc123` |
| Imports | `imports_` | `imports_job_status_xyz` |
| Code2ASIN | `code2asin_` | `code2asin_mapping_ean123` |
| Analytics | `analytics_` | `analytics_daily_report` |
| Default | `default_` | `default_app_settings` |

---

## TTL par domaine

Chaque type de donnee a un TTL adapte a sa volatilite :

| Domaine | TTL | Justification |
|---------|-----|---------------|
| Catalogue | 2 heures (7200s) | Donnees relativement stables |
| Media | 1 heure (3600s) | Metadonnees media |
| Imports | 30 minutes (1800s) | Statuts de jobs en cours de changement |
| Code2ASIN | 24 heures (86400s) | Mappings EAN-ASIN rarement modifies |
| Analytics | 1 heure (3600s) | Rapports recalcules periodiquement |
| Default | Configurable | Variable REDIS_CACHE_TTL |

---

## Operations de cache

### Lecture

```python
from services.cache_service import cache_service

# Lecture avec prefixe automatique
value = await cache_service.get("products_count", db_type="catalog")
# Cle Redis reelle : catalog_products_count
```

### Ecriture

```python
# Ecriture avec TTL automatique (2h pour catalog)
await cache_service.set("products_count", 1500, db_type="catalog")

# Ecriture avec TTL personnalise
await cache_service.set("temp_data", data, ttl=300, db_type="default")
```

### Suppression

```python
# Suppression d'une cle
await cache_service.delete("products_count", db_type="catalog")

# Suppression par pattern
await cache_service.delete_pattern("products_*", db_type="catalog")
```

---

## Invalidation du cache

L'invalidation est geree par le service `cache_invalidation.py` avec des fonctions ciblees :

```python
from services.cache_invalidation import (
    invalidate_media_cache,
    invalidate_dashboard_cache,
)

# Apres une operation media
await invalidate_media_cache()

# Apres une modification de produit
await invalidate_dashboard_cache()
```

### Strategies d'invalidation

| Strategie | Quand | Portee |
|-----------|-------|--------|
| Ciblee | Apres CRUD sur une entite | Cle specifique |
| Par pattern | Apres import massif | Toutes les cles d'un domaine |
| Dashboard | Apres toute modification | Caches du tableau de bord |
| Totale | Deployment, migration | Flush complet Redis |

---

## Cache Warming

Le service `CacheWarmingService` pre-charge les caches critiques pour eviter les cache miss apres un redemarrage.

### Fonctionnement

1. **Au demarrage** de l'application : `warm_critical_caches()` est lance en arriere-plan
2. **Toutes les 5 minutes** : rafraichissement periodique via `start_periodic_warming()`
3. **Protection anti-concurrence** : un seul warming a la fois grace au flag `warming_in_progress`

### Enregistrement de taches

```python
from services.cache_warming import cache_warming_service

cache_warming_service.register_task(
    name="dashboard_stats",
    task=warm_dashboard_stats,
    critical=True  # Erreur logguee en warning
)

cache_warming_service.register_task(
    name="supplier_list",
    task=warm_supplier_list,
    critical=False  # Erreur logguee en debug
)
```

### Metriques de warming

| Metrique | Description |
|----------|-------------|
| `execution_count` | Nombre total d'executions |
| `success_count` | Executions reussies |
| `failure_count` | Executions echouees |
| `last_run` | Horodatage de la derniere execution |
| `last_success` | Horodatage du dernier succes |

---

## Router Cache

Le router `/api/v1/cache` expose des endpoints d'administration du cache :

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/cache/stats` | GET | Statistiques du cache Redis |
| `/api/v1/cache/clear` | POST | Vider le cache (admin uniquement) |
| `/api/v1/cache/keys` | GET | Lister les cles en cache |

---

## Gestion des erreurs

Le service de cache est concu pour etre **non-bloquant** : une erreur Redis ne doit jamais faire echouer une requete API.

```python
# Les erreurs Redis retournent None (get) ou False (set/delete)
value = await cache_service.get("key")  # None si Redis down
success = await cache_service.set("key", data)  # False si Redis down
```

{% callout type="warning" title="Resilience" %}
Le `CacheService` gere automatiquement les reconnexions. Si Redis devient indisponible, l'application continue de fonctionner normalement en accedant directement a la base de donnees. Les performances sont degradees mais le service reste disponible.
{% /callout %}

---

## Bonnes pratiques

1. **Toujours specifier le `db_type`** pour beneficier du bon prefixe et du bon TTL
2. **Utiliser l'invalidation ciblee** plutot que le flush global
3. **Ne jamais stocker de donnees sensibles** (mots de passe, tokens) dans le cache
4. **Monitorer le hit rate** via les metriques Prometheus pour ajuster les TTL
5. **Preferer les operations atomiques** (`setex`) pour garantir la coherence TTL
