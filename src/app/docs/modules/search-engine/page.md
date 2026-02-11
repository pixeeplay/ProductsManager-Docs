---
title: Search Engine
nextjs:
  metadata:
    title: Search Engine - Products Manager APP
    description: Moteur de recherche Meilisearch avec fallback PostgreSQL, recherche multi-index, autocompletion et facettes.
---

Recherchez instantanement dans votre catalogue avec Meilisearch. Le module Search Engine offre une recherche multi-index (produits, marques, categories), l'autocompletion, les facettes et un fallback PostgreSQL ILIKE quand Meilisearch est indisponible. {% .lead %}

---

## Vue d'Ensemble

Le module **Search Engine** abstrait le moteur de recherche derriere une interface unifiee. Deux providers sont disponibles :

| Provider | Technologie | Performance | Disponibilite |
|----------|-------------|-------------|---------------|
| **Meilisearch** (primaire) | Rust, index inversee | < 50ms | Container Docker separe |
| **PostgreSQL** (fallback) | ILIKE + trigrams | < 200ms | Toujours disponible |

Le systeme detecte automatiquement la disponibilite de Meilisearch et bascule sur le fallback PostgreSQL si necessaire, sans interruption de service.

---

## Fonctionnalites

### Recherche Multi-Index

La recherche globale interroge simultanement plusieurs index :

- **products** : Titre, EAN, ASIN, description, marque, reference fabricant
- **brands** : Nom de marque et aliases
- **categories** : Noms de categories dans toutes les taxonomies
- **suppliers** : Noms et codes fournisseurs

Les resultats sont fusionnes et tries par pertinence.

### Autocompletion

L'endpoint `/suggestions` fournit des suggestions en temps reel pendant la saisie :

- Reponse en < 20ms
- Indication du type de resultat (produit, marque, categorie)
- Limite a 10 suggestions par defaut

### Recherche a Facettes

La recherche produit supporte les facettes :

| Facette | Type | Description |
|---------|------|-------------|
| `brand_name` | string | Filtrage par marque |
| `is_active` | boolean | Produits actifs uniquement |
| `has_asin` | boolean | Produits avec ASIN Amazon |

### Indexation

L'indexation est geree par le `SearchIndexingService` :

- **Full reindex** : Reindexation complete de tous les index (lancee manuellement ou par cron)
- **Incremental sync** : Mise a jour automatique apres chaque CRUD produit/marque/categorie
- **Taches Celery** : L'indexation est asynchrone pour ne pas bloquer l'API

{% callout type="note" title="Activation du module" %}
Le moteur Meilisearch est deploye dans un container Docker separe (`deploy/staging/docker-compose-meilisearch.yml`). Le module `search_engine` doit etre active dans `/settings/modules` pour que la SearchBar du header utilise Meilisearch. Quand le module est desactive, la recherche utilise le fallback PostgreSQL.
{% /callout %}

---

## API Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/search` | Recherche globale multi-index |
| `GET` | `/api/v1/search/products` | Recherche produits avec facettes |
| `GET` | `/api/v1/search/suggestions` | Autocompletion (typeahead) |
| `POST` | `/api/v1/search/reindex` | Lancer une reindexation complete (admin) |
| `GET` | `/api/v1/search/stats` | Statistiques des index (documents par index) |
| `GET` | `/api/v1/search/health` | Etat de sante du moteur (public, sans auth) |
| `GET` | `/api/v1/search/indexing-status` | Stats Meilisearch + config (admin) |
| `PATCH` | `/api/v1/search/indexing-config` | Modifier la configuration d'indexation (admin) |

---

## Architecture des Services

```
api/services/
  search_service.py            Interface de recherche (multi-search, suggest, health)
  search_indexing_service.py   Stats Meilisearch, full reindex
  search_sync.py               Declenchement sync (non-bloquant)
  search_tasks.py              Taches Celery async pour indexation
```

### Configuration Meilisearch

Le container Meilisearch est configure dans `deploy/staging/docker-compose-meilisearch.yml` avec :

- **Port** : 7700 (par defaut)
- **Master Key** : Cle secrete pour l'acces admin
- **Indexes** : products, brands, categories, suppliers

---

## Frontend

Le composant **SearchBar** dans le header de l'application :

- Raccourci clavier `Cmd+K` / `Ctrl+K`
- Affichage des suggestions en temps reel
- Navigation directe vers le resultat selectionne
- Distinct de la **Command Palette** (qui gere la navigation entre pages)

---

## Prochaines Etapes

- [Architecture](/docs/technical/architecture) : Infrastructure technique complete
- [Performance](/docs/technical/performance) : Metriques de performance
- [Modules](/docs/modules/module-system) : Activation/desactivation du module search_engine
