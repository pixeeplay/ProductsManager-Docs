---
title: Performance et Optimisation
nextjs:
  metadata:
    title: Performance et Optimisation - Products Manager APP
    description: Architecture de performance, metriques systeme, compression, cache warming et optimisation des requetes SQL.
---

Products Manager integre une architecture de performance multicouche : compression GZip, cache Redis L1/L2, warming automatique, optimisation des requetes SQL et monitoring en temps reel via Prometheus. {% .lead %}

---

## Vue d'ensemble

L'architecture de performance repose sur plusieurs composants complementaires :

| Composant | Fichier source | Role |
|-----------|----------------|------|
| Cache Redis | `services/cache_service.py` | Cache L2 multi-DB avec TTL par domaine |
| Cache Warming | `services/cache_warming.py` | Pre-chargement automatique des caches critiques |
| Database Optimizer | `services/database_optimizer/` | Analyse des requetes lentes, suggestions d'index |
| Compression GZip | `middleware/compression.py` | Compression des reponses > 500 octets |
| Prometheus | `middleware/metrics.py` | Collecte de metriques HTTP |
| Performance Router | `routers/performance.py` | Endpoints de metriques systeme en temps reel |

---

## Compression GZip

Le middleware GZip compresse automatiquement les reponses dont la taille depasse 500 octets. Cette compression reduit significativement la bande passante, en particulier pour les listes de produits volumineux.

```python
# middleware/compression.py
MINIMUM_SIZE = 500  # octets

app.add_middleware(GZipMiddleware, minimum_size=MINIMUM_SIZE)
```

### Configuration

| Variable d'environnement | Valeur par defaut | Description |
|--------------------------|-------------------|-------------|
| `ENABLE_GZIP_COMPRESSION` | `true` | Active/desactive la compression |

{% callout type="info" title="Reverse proxy" %}
Si un reverse proxy (Traefik, nginx) gere deja la compression, desactivez le middleware avec `ENABLE_GZIP_COMPRESSION=false` pour eviter la double compression.
{% /callout %}

---

## Metriques systeme en temps reel

Le router `/api/v1/performance` expose les metriques systeme en temps reel via `psutil` :

### Metriques systeme

| Metrique | Description | Source |
|----------|-------------|--------|
| CPU usage | Pourcentage d'utilisation CPU | `psutil.cpu_percent()` |
| Memory usage | Utilisation memoire (RAM) | `psutil.virtual_memory()` |
| Disk usage | Espace disque utilise | `psutil.disk_usage()` |
| Network I/O | Octets envoyes/recus | `psutil.net_io_counters()` |

### Metriques API

| Metrique | Description |
|----------|-------------|
| Requetes par seconde | Debit de l'API |
| Temps de reponse moyen | Latence moyenne des endpoints |
| Taux d'erreur | Pourcentage de reponses 4xx/5xx |
| Connexions actives | Nombre de connexions ouvertes |

### Metriques base de donnees

| Metrique | Description |
|----------|-------------|
| Connexions actives | Nombre de connexions au pool |
| Performance des requetes | Temps moyen des requetes SQL |
| Requetes lentes | Nombre de requetes > seuil |
| Cache hit rate | Taux de succes du cache PostgreSQL |

---

## Database Optimizer

Le service `DatabaseOptimizer` est un systeme modulaire refactorise en 10 composants :

| Module | Description |
|--------|-------------|
| `MetricsRecorder` | Enregistrement des metriques de requetes |
| `QueryAnalyzer` | Analyse des patterns de requetes |
| `IndexSuggester` | Suggestions d'index optimaux |
| `QueryOptimizer` | Optimisation automatique des requetes |
| `PerformanceReporter` | Generation de rapports de performance |
| `CacheManager` | Gestion du cache au niveau DB |
| `PoolOptimizer` | Optimisation des pools de connexions |
| `MaintenanceManager` | Planification des taches de maintenance |

### Utilisation

```python
from services.database_optimizer import db_optimizer

# Initialisation au demarrage
await db_optimizer.initialize()

# Obtenir un rapport de performance
report = await db_optimizer.get_performance_report()
print(f"Requetes lentes: {report['slow_queries']}")
print(f"Index suggeres: {report['index_suggestions']}")
```

---

## Cache Warming

Le service de cache warming pre-charge automatiquement les donnees les plus consultees pour eviter les cache miss :

### Cycle de vie

1. **Demarrage** : Pre-chargement de tous les caches critiques
2. **Periodique** : Rafraichissement toutes les 5 minutes (configurable)
3. **Arret** : Nettoyage propre des taches en cours

### Taches enregistrees par defaut

```python
from services.cache_warming import cache_warming_service

# Enregistrement d'une tache personnalisee
cache_warming_service.register_task(
    name="products_count",
    task=warm_products_count,
    critical=True  # Log en warning si echec
)

# Demarrage du warming periodique
await cache_warming_service.start_periodic_warming(interval_seconds=300)
```

### Statistiques

Chaque tache de warming maintient des compteurs :

| Compteur | Description |
|----------|-------------|
| `execution_count` | Nombre total d'executions |
| `success_count` | Nombre de succes |
| `failure_count` | Nombre d'echecs |
| `last_run` | Derniere execution |
| `last_success` | Dernier succes |

---

## Prometheus et Monitoring

Le middleware `PrometheusMiddleware` collecte les metriques HTTP exposees sur `/metrics` :

```
# Metriques disponibles sur /metrics
http_requests_total{method="GET", path="/api/v1/products", status="200"}
http_request_duration_seconds{method="GET", path="/api/v1/products"}
http_requests_in_progress{method="GET"}
```

---

## Bonnes pratiques de performance

### Frontend

```typescript
// Separation donnees volatiles / stables
loadVolatileData()   // metriques + imports recents -> rafraichissement 60s
loadStableData()     // graphiques + categories -> rafraichissement manuel uniquement

// Ne pas bloquer le rendu sur les stats
loadProducts().then(() => setIsLoading(false))  // bloquant
loadStats().finally(() => setStatsLoading(false))  // arriere-plan
```

### Backend

- Utiliser `outerjoin` quand les enregistrements peuvent etre absents (cross-database)
- Toujours gerer les champs nullable avec des valeurs par defaut
- Placer les routes statiques AVANT les routes dynamiques dans FastAPI
- Utiliser les sessions asynchrones (`AsyncSession`) pour eviter le blocage

{% callout type="success" title="Resultats mesures" %}
L'architecture multi-bases a permis de reduire les requetes lentes de **-85%** et d'eliminer completement les problemes de contention de tables et de pool exhaustion.
{% /callout %}
