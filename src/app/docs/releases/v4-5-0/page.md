---
title: Release Notes v4.5.x
nextjs:
  metadata:
    title: Release Notes v4.5.x - Products Manager
    description: Notes de version pour ProductsManager v4.5.0 a v4.5.12 - Odoo Integration, Code2ASIN, Thumbnails, Settings Persistence
---

Notes de version detaillees pour la serie v4.5.x de Products Manager. {% .lead %}

**Version actuelle:** v4.5.12 (30 Decembre 2025)

---

## Highlights v4.5.x

Cette serie de versions apporte des fonctionnalites majeures :

- **Odoo ERP Integration** - Synchronisation bidirectionnelle complete avec Odoo
- **Code2ASIN Media Integration** - Images Amazon directement dans le systeme Media
- **Thumbnail System** - Generation automatique de miniatures (150x150, 300x300, 800x800)
- **UUID Sharding** - Scalabilite pour 200k+ produits
- **Settings Persistence** - Configuration persistee en base de donnees
- **Google Drive Integration** - Import/Export via Google Drive
- **EAN Lookup Providers** - Configuration des fournisseurs de recherche EAN

---

## v4.5.12 - Performance & Scalability

**Date:** 30 Decembre 2025 | **Type:** Performance & Scalability

### UUID Prefix Sharding for Media Files

Nouvelle structure de stockage pour supporter 200k+ produits sans problemes de performance sur les repertoires.

**Avant:**
```
media-images/products/{product_id}/{hash}.jpg
```

**Apres:**
```
media-images/products/{uuid[0:2]}/{product_id}/{hash}.jpg
```

- Cree 256 sous-repertoires (00-ff) bases sur les 2 premiers caracteres de l'UUID
- Evite les problemes de performance avec des repertoires contenant trop de fichiers
- Migration automatique des 17,827 fichiers existants vers la nouvelle structure

### Thumbnail System Implementation

Systeme complet de generation et d'utilisation des thumbnails pour optimiser les performances d'affichage.

**Tailles generees:**

| Taille | Dimensions | Usage |
|--------|------------|-------|
| `small` | 150x150 px | Grilles de produits |
| `medium` | 300x300 px | Previews |
| `large` | 800x800 px | Details produit |

**Resultats de la generation batch:**
- Total traites: 17,827 images
- Succes: 17,827 (100%)
- Echecs: 0
- Thumbnails crees: 53,481 (3 par image)

### API Thumbnail Support

L'endpoint `/products` retourne maintenant les URLs des thumbnails dans la reponse.

```json
{
  "images": [{
    "id": "uuid",
    "file_name": "image.jpg",
    "file_url": "https://.../original.jpg",
    "is_primary": true,
    "thumbnails": {
      "small": "https://.../small.jpg",
      "medium": "https://.../medium.jpg",
      "large": "https://.../large.jpg"
    }
  }]
}
```

### Frontend Thumbnail Integration

Le composant `ProductCard` utilise automatiquement les thumbnails pour un affichage plus rapide.

```typescript
// Utilisation automatique des thumbnails
getProductThumbnailUrl(product)  // Retourne small thumbnail

// Selection de taille specifique
getProductImageUrl(product, 'small')   // 150x150
getProductImageUrl(product, 'medium')  // 300x300
getProductImageUrl(product, 'large')   // 800x800
getProductImageUrl(product)            // Image originale
```

### Performance Benefits

- **Reduction bande passante:** Thumbnails small ~10-20x plus legers que les originaux
- **Temps de chargement:** Page /products significativement plus rapide
- **Scalabilite:** Structure prete pour 200k+ produits sans degradation

---

## v4.5.8 - Quick Wins Release

**Date:** 17 Decembre 2025 | **Type:** Features + API

### EAN Lookup Provider API

Configuration complete des fournisseurs EAN via API.

**Endpoints ajoutes:**
- `GET /api/v1/ean-lookup/providers` - Liste des providers
- `GET /api/v1/ean-lookup/providers/{id}` - Config d'un provider
- `PUT /api/v1/ean-lookup/providers/{id}` - Sauvegarder config
- `POST /api/v1/ean-lookup/providers/{id}/test` - Tester connexion

**Providers supportes:**

| Provider | Confidence |
|----------|------------|
| EAN-Search.org | 0.95 |
| Barcode Lookup | 0.90 |
| Go-UPC | 0.85 |

### Email Reset Password

Reinitialisation de mot de passe par email fonctionnelle.

- Token securise (secrets.token_urlsafe)
- Expiration 15 minutes
- Usage unique (token consomme apres utilisation)
- Email HTML responsive avec bouton reset
- Validation force mot de passe (8+ chars, maj, min, chiffre)
- Protection enumeration emails
- Stockage Redis avec TTL

**Endpoints:**
- `POST /api/v1/auth/forgot-password` - Demande reset
- `POST /api/v1/auth/reset-password/verify` - Verification et changement

### Export des Imports (CSV)

Export CSV des jobs d'import avec filtres.

- Export CSV compatible Excel (UTF-8 BOM)
- Filtres: status, supplier_code, start_date, end_date
- Telechargement automatique avec timestamp
- Donnees completes: statistiques, durees, erreurs

### Thumbnails Automatiques (Celery)

Generation automatique de thumbnails pour les images media.

- Task Celery asynchrone
- Integration automatique apres import Code2ASIN
- Endpoint manuel: `POST /api/v1/media/files/{id}/generate-thumbnails`
- Qualite LANCZOS, JPEG 85%
- Stockage MinIO: `products/{id}/thumbs/{size}/{hash}.jpg`

### EAN Lookup Page Refactoring

Refonte complete de la page /ean-lookup.

- 5 tuiles colorees avec statistiques
- Bouton refresh dans le header (PremiumLayout)
- Layout full width
- Onglet Providers avec configuration des 3 fournisseurs
- Design coherent avec /ai-services

---

## v4.5.7 - Code2ASIN Enhancement

**Date:** 17 Decembre 2025 | **Type:** Feature Enhancement + UX

### Code2ASIN - Images vers Media System

Les images telechargees depuis Amazon sont maintenant stockees directement dans le bucket `medias-images` et enregistrees dans `db_media.media_files` avec liaison au `product_id`.

**Avant:** Images stockees dans `code2asin/images/` puis copiees manuellement

**Apres:** Import direct vers `medias-images/products/{product_id}/{hash}.{ext}`

**Avantages:**
- Deduplication par hash SHA-256
- Liaison immediate produit-media
- Pas de copie entre buckets
- Images exploitables dans db_catalog

### Page Details Job Amelioree

Nouvelle page `/code2asin/[id]/details` avec statistiques completes:

- Header avec titre, statut, timestamps
- 8 tuiles colorees de statistiques
- Timeline de progression
- Onglets: Statistiques / Resultats / Erreurs / Amazon Data
- Preview images et donnees Amazon
- Export resultats en CSV

### Module Exports - Destination MinIO

- Nouvelle destination "MinIO Storage" pour exports
- Auto-creation plateforme MinIO au demarrage
- Configuration via `MINIO_ENDPOINT` env var
- Upload direct vers bucket configurable

### PremiumSidebar Fix

Correction chevron duplique dans le lien cliquable. Seul le bouton toggle affiche maintenant le chevron expand/collapse.

---

## v4.5.6 - Odoo Integration Complete

**Date:** 16 Decembre 2025 | **Type:** Feature Complete + Testing

### Integration Odoo ERP (Complete)

| Composant | Description |
|-----------|-------------|
| **Modeles SQLAlchemy** | OdooConfiguration, OdooFieldMapping, OdooSyncSchedule, OdooSyncLog |
| **Migrations** | 038 (tables db_core), 039 (products.odoo_product_id), 052 (category/tax mappings) |
| **OdooService** | Communication XML-RPC, encryption Fernet des credentials |
| **API REST** | Config, sync, import, mappings (fields/categories/taxes), schedules, logs |
| **Celery Tasks** | process_scheduled_odoo_syncs, sync_product_to_odoo, bulk_sync_to_odoo, import_from_odoo |
| **Beat Schedule** | Verification toutes les 5 minutes des syncs planifies |

### Frontend Pages Odoo

| Page | Description |
|------|-------------|
| `/odoo-sync` | Dashboard avec status connexion et statistiques |
| `/odoo-sync/config` | Configuration credentials Odoo |
| `/odoo-sync/export` | Export produits vers Odoo |
| `/odoo-sync/import` | Import produits depuis Odoo |
| `/odoo-sync/mappings` | Mappings fields, categories, taxes (avec tabs) |
| `/odoo-sync/schedules` | CRUD schedules, toggle enable, run now |
| `/odoo-sync/history` | Logs de sync, details erreurs, bulk retry |

### API Endpoints Odoo

```
Configuration:
  GET    /api/v1/odoo/config          - Get configuration
  PUT    /api/v1/odoo/config          - Update configuration
  POST   /api/v1/odoo/test-connection - Test connection
  GET    /api/v1/odoo/status          - Get status

Sync Operations:
  POST   /api/v1/odoo/sync/{id}       - Sync single product
  POST   /api/v1/odoo/bulk-sync       - Bulk sync
  POST   /api/v1/odoo/import          - Import from Odoo

Field Mappings:
  GET    /api/v1/odoo/field-mappings      - List
  POST   /api/v1/odoo/field-mappings      - Create/Update
  DELETE /api/v1/odoo/field-mappings/{id} - Delete
  GET    /api/v1/odoo/odoo-fields         - Get Odoo fields

Schedules:
  GET    /api/v1/odoo/schedules           - List
  POST   /api/v1/odoo/schedules           - Create
  PUT    /api/v1/odoo/schedules/{id}      - Update
  DELETE /api/v1/odoo/schedules/{id}      - Delete
  PATCH  /api/v1/odoo/schedules/{id}/toggle - Toggle
  POST   /api/v1/odoo/schedules/{id}/run  - Run now

Logs & Stats:
  GET    /api/v1/odoo/logs            - List logs
  GET    /api/v1/odoo/stats           - Get statistics
```

### Tests Odoo (80 tests)

- **Unit Tests:** 51 tests (OdooService, Celery tasks)
- **Integration Tests:** 29 tests (Schemas Pydantic)

---

## v4.5.5 - Settings & Notifications

**Date:** 16 Decembre 2025 | **Type:** Features + Bug Fixes

### Persistance des Settings en Base de Donnees

Les parametres de l'application sont maintenant persistes en PostgreSQL au lieu d'etre stockes en memoire.

**Architecture:**
- Nouvelle table `app_settings` dans `db_core`
- Scope 100% global (pas par utilisateur)
- Cache en memoire pour acces rapide
- Migration automatique des valeurs par defaut

### Notifications Globales d'Import

Les notifications configurees dans Settings > Notifications s'appliquent maintenant a TOUS les imports.

- `emailImportComplete` - Envoie un email pour chaque import reussi
- `emailImportError` - Envoie un email pour chaque erreur ou import avec erreurs
- `completed_with_errors` est traite comme une erreur (pas comme succes)

### Filtres Complets sur /products

Implementation backend de tous les filtres produits.

| Filtre | Description |
|--------|-------------|
| `has_asin` | Produits avec/sans ASIN |
| `has_price` | Produits avec/sans prix actif |
| `in_stock` | Produits en stock/rupture |
| `has_multiple_suppliers` | Multi-fournisseurs |
| `has_images` | Produits avec/sans images |

### Support Archives Compressees

Les imports supportent maintenant les fichiers compresses.

- `.gz` - Fichiers gzip (decompression automatique)
- `.zip` - Archives ZIP (extraction premier fichier)

### Bug Fixes (10+)

- Fix Migration FK vers Users
- Fix Asyncio Event Loop dans Celery
- Fix EAN Quotes et VARCHAR(12)
- Fix Email Mode 'today'
- Fix FTP Passive Mode
- Fix HTML Entities dans Passwords
- Fix is_primary Multi-Suppliers
- Fix File Pattern Normalization
- Fix Notification Emails
- Fix Failed Job Creation

---

## v4.5.0 - Google Drive Integration

**Date:** 10 Decembre 2025 | **Type:** Major Feature

### Google Drive as Data Source

- **OAuth 2.0 Authentication**: Secure Google sign-in avec popup-based flow
- **Folder Navigation**: Interactive folder browser avec breadcrumb navigation
- **File Pattern Filtering**: Support for glob patterns (e.g., `*.csv`, `*catalog*.xlsx`)
- **Token Management**: Automatic token refresh avec secure storage

### Google Drive Export Platform

- **New Platform Type**: `gdrive` added to export platforms
- **Export Formats**: CSV and JSON avec configurable options
- **Bulk Export**: Export multiple products as a single file
- **File Versioning**: Automatic timestamped filenames

### API Endpoints Google Drive

- `GET /api/v1/integrations/google/authorize` - Get OAuth authorization URL
- `GET /api/v1/integrations/google/callback` - OAuth callback handler
- `GET /api/v1/integrations/google/status` - Check connection status
- `POST /api/v1/integrations/google/disconnect` - Revoke and remove token
- `GET /api/v1/integrations/google/test` - Test connection
- `GET /api/v1/integrations/google/folders` - List folders
- `GET /api/v1/integrations/google/files/{folder_id}` - List files in folder
- `GET /api/v1/integrations/google/download/{file_id}` - Download file
- `POST /api/v1/integrations/google/upload` - Upload file

### Configuration Requise

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-domain/api/v1/integrations/google/callback
```

---

## Migration Notes

### De v4.4.x vers v4.5.x

Aucun breaking change. Migration automatique :

```bash
git pull origin main
cd api && alembic upgrade head
docker-compose restart
```

### Nouvelles Tables

- `app_settings` - Parametres application
- `oauth_tokens` - Tokens OAuth (Google Drive)
- `gdrive_folders` - Cache folders Google Drive
- `odoo_configuration` - Configuration Odoo
- `odoo_field_mapping` - Mappings champs Odoo
- `odoo_sync_schedule` - Planifications sync Odoo
- `odoo_sync_log` - Historique syncs Odoo

### Configuration Celery

Pour les thumbnails, verifier que les workers ecoutent la queue `media`:

```bash
celery -A api.core.celery_app worker -Q media -l info
```

---

## Files Changed (v4.5.x)

### Backend

```
api/
├── models/
│   ├── core.py                  # AppSetting model
│   ├── media.py                 # MediaThumbnail model
│   └── oauth_tokens.py          # OAuth models
├── schemas/
│   ├── auth.py                  # Password reset schemas
│   ├── ean_lookup.py            # EAN provider schemas
│   ├── exports.py               # GDRIVE platform
│   └── odoo.py                  # Odoo schemas
├── services/
│   ├── settings_service.py      # Settings persistence
│   ├── password_reset_service.py # Token management
│   ├── odoo_service.py          # Odoo integration
│   ├── odoo_tasks.py            # Celery tasks Odoo
│   └── code2asin/
│       └── image_service.py     # Media integration, sharding
├── routers/
│   ├── odoo.py                  # Odoo endpoints
│   ├── ean_lookup.py            # EAN providers
│   ├── settings.py              # Settings endpoints
│   ├── products/
│   │   ├── helpers.py           # Thumbnails support
│   │   └── schemas.py           # ThumbnailsDict
│   └── integrations/
│       └── google_oauth.py      # Google Drive
├── tasks/
│   └── media_tasks.py           # Thumbnail generation
└── storage/backends/
    └── gdrive_repository.py     # Google Drive service
```

### Frontend

```
frontend/
├── app/(authenticated)/
│   ├── code2asin/
│   │   ├── [id]/details/        # Job details page
│   │   └── export/              # Export refactored
│   ├── ean-lookup/              # Refactored with tiles
│   ├── odoo-sync/               # All Odoo pages
│   └── exports/                 # MinIO destination
├── components/
│   ├── products/
│   │   └── ProductCard.tsx      # Thumbnails
│   └── tailwind-plus/
│       └── layout/
│           └── PremiumSidebar.tsx # Chevron fix
├── lib/
│   └── image-utils.ts           # Thumbnail utilities
└── services/
    └── products.ts              # Thumbnails interface
```

---

## Testing Checklist

### Performance Tests

- [ ] UUID sharding fonctionne pour les nouveaux uploads
- [ ] Thumbnails generees correctement (small/medium/large)
- [ ] API retourne les URLs de thumbnails
- [ ] Frontend ProductCard affiche les thumbnails
- [ ] Page /products charge plus rapidement

### Odoo Tests

- [ ] Configuration credentials
- [ ] Test connexion
- [ ] Export produit vers Odoo
- [ ] Import depuis Odoo
- [ ] Mappings fields/categories/taxes
- [ ] Schedules CRUD
- [ ] History logs

### Google Drive Tests

- [ ] OAuth flow complet
- [ ] Navigation folders
- [ ] File pattern filtering
- [ ] Download/Upload files
- [ ] Token refresh automatique

### Settings Tests

- [ ] Persistance apres restart API
- [ ] Notifications globales envoyees
- [ ] Filtres produits fonctionnels

---

## Known Issues

### Imports bloques (staging)

Etat actuel : 6 imports bloques
- 2 x pending (SECOMP: 19,450 + 0 lignes)
- 3 x failed
- 1 x processing

**Solution** : Utiliser l'endpoint retry
```bash
POST /api/v1/imports/{job_id}/retry
```

### Produits sans EAN

Les produits sans EAN dans les imports sont stockes pour traitement ulterieur dans `import_errors`.

**Resolution** : Module EAN Finder (a venir)

---

## Roadmap

### v4.6.0 - Planifie Q1 2026

- [ ] Module EAN Finder - Resolution automatique produits sans EAN
- [ ] AI field mapping suggestions (Odoo)
- [ ] WebSocket pour progress temps reel
- [ ] Frontend Password Reset Page
- [ ] Webhooks Odoo (push notifications)
- [ ] Support multi-instance Odoo

---

**Version:** 4.5.12
**Released:** 30 Decembre 2025
**Branch:** staging
