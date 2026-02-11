---
title: Export Platform
nextjs:
  metadata:
    title: Export Platform - Products Manager APP
    description: Plateforme d'export complete avec support CSV, Excel et JSON, streaming, planification et stockage MinIO.
---

Exportez vos donnees produits et fournisseurs dans les formats CSV, Excel et JSON. La plateforme d'export offre le streaming pour les grands volumes, la planification automatique et le stockage dans MinIO. {% .lead %}

---

## Vue d'Ensemble

Le module **Exports** permet d'extraire vos donnees du catalogue Products Manager dans differents formats pour les integrer a vos systemes tiers, marketplaces ou outils d'analyse.

L'architecture repose sur des taches asynchrones (Celery) pour les exports volumineux, avec suivi de progression en temps reel et stockage des fichiers generes dans MinIO.

---

## Formats d'Export

### CSV

- Export avec BOM UTF-8 pour compatibilite Excel
- Selection de champs (inclusion/exclusion)
- Filtres optionnels sur les produits
- Mode streaming pour les grands volumes (pas de limite memoire)

### Excel (.xlsx)

- Support multi-feuilles (produits, fournisseurs, categories)
- Formatage automatique (en-tetes, couleurs, largeurs de colonnes)
- Selection de champs configurable

### JSON

- Mode standard ou JSON Lines (un objet par ligne)
- Pretty-printing optionnel
- Inclusion optionnelle des relations imbriquees (fournisseurs, categories)
- Mode streaming disponible

---

## Streaming

Pour les grands catalogues, le mode streaming permet d'exporter sans contrainte memoire :

- **CSV streaming** : `GET /api/v1/exports/stream/csv/products` — genere le CSV ligne par ligne
- **JSON streaming** : `GET /api/v1/exports/stream/json/products` — genere le JSON en flux

Le streaming utilise des `StreamingResponse` FastAPI avec des batches de 500 produits charges depuis la base de donnees.

{% callout type="note" title="Performance" %}
Le mode streaming est recommande pour les exports de plus de 10 000 produits. Il evite les problemes de memoire et permet le telechargement progressif.
{% /callout %}

---

## Export en Arriere-Plan

Les exports lances via `POST` sont executes en arriere-plan par Celery :

1. L'utilisateur configure l'export (format, filtres, champs)
2. Une tache Celery est creee et retourne un `task_id`
3. La progression est consultable via `GET /progress/{task_id}`
4. Le fichier genere est stocke dans MinIO
5. Le telechargement est disponible via `GET /download/{task_id}`

---

## Planification

Les exports planifies permettent de generer automatiquement des fichiers a intervalles reguliers :

### Configuration

- **Expression cron** : Par exemple `0 2 * * *` pour un export chaque nuit a 2h
- **Intervalle en minutes** : Export periodique
- **Timezone** : Configurable (defaut : Europe/Paris)
- **Retry** : Nombre maximum de tentatives et delai entre tentatives

### Gestion des Schedules

Chaque schedule d'export est lie a une plateforme d'export et contient :

- Le nom du schedule
- Le type de schedule (cron ou intervalle)
- La configuration d'export (filtres, format, champs)
- Les statistiques d'execution (nombre de runs, succes, echecs)
- La date du prochain run calcule automatiquement

---

## Plateformes d'Export

Le systeme de plateformes (`ExportPlatform`) permet de definir des destinations d'export preconfigures :

- Nom et type de plateforme
- Configuration par defaut (format, filtres)
- Association avec des schedules d'export

---

## API Endpoints

### Export Immediat

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/v1/exports/csv/products` | Export CSV produits |
| `POST` | `/api/v1/exports/csv/suppliers` | Export CSV fournisseurs |
| `POST` | `/api/v1/exports/excel/products` | Export Excel produits |
| `POST` | `/api/v1/exports/excel/suppliers` | Export Excel fournisseurs |
| `POST` | `/api/v1/exports/json/products` | Export JSON produits |
| `POST` | `/api/v1/exports/json/suppliers` | Export JSON fournisseurs |

### Streaming

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/exports/stream/csv/products` | Streaming CSV produits |
| `GET` | `/api/v1/exports/stream/json/products` | Streaming JSON produits |

### Gestion des Jobs

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/exports` | Liste des jobs d'export |
| `GET` | `/api/v1/exports/{id}` | Detail d'un job |
| `GET` | `/api/v1/exports/progress/{task_id}` | Progression d'un export |
| `GET` | `/api/v1/exports/download/{task_id}` | Telecharger le fichier |
| `POST` | `/api/v1/exports/create` | Creer un job d'export |
| `DELETE` | `/api/v1/exports/{id}` | Supprimer un job |

### Planification

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/exports/schedules` | Liste des schedules |
| `POST` | `/api/v1/exports/schedules` | Creer un schedule |
| `GET` | `/api/v1/exports/schedules/{id}` | Detail d'un schedule |
| `PUT` | `/api/v1/exports/schedules/{id}` | Modifier un schedule |
| `POST` | `/api/v1/exports/schedules/{id}/toggle` | Activer/desactiver |
| `DELETE` | `/api/v1/exports/schedules/{id}` | Supprimer un schedule |

### Permissions Requises

- **Lecture** : `READ_EXPORTS`
- **Ecriture** : `WRITE_EXPORTS`

---

## Audit

Chaque export est trace dans les logs d'audit (`db_analytics`) avec :

- L'utilisateur qui a declenche l'export
- Le format et les filtres utilises
- Le nombre de produits exportes
- Le niveau de risque (medium pour les exports de donnees)

---

## Prochaines Etapes

- [Imports](/docs/modules/imports) : Importez des donnees dans votre catalogue
- [Fournisseurs](/docs/modules/suppliers) : Gerez vos fournisseurs
- [API Endpoints](/docs/api/endpoints) : Reference complete de l'API REST
