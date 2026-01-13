---
title: Architecture Technique
description: Architecture multi-bases de données et infrastructure du système ProductsManager
---

# Architecture Technique

L'architecture du systeme ProductsManager repose sur une approche moderne et scalable, concue pour gerer efficacement de gros volumes de donnees produits tout en maintenant d'excellentes performances.

{% .lead %}

---

## Vue d'ensemble

Le systeme utilise une **architecture multi-bases de donnees** avec 7 bases PostgreSQL specialisees, permettant une optimisation fine des performances et une scalabilite horizontale par domaine fonctionnel.

### Stack Technique

**Backend**
- **Framework** : FastAPI (Python 3.11+)
- **ORM** : SQLAlchemy 2.0 (async avec asyncpg)
- **API** : REST + WebSocket pour temps reel
- **Workers** : Celery + Beat pour taches asynchrones

**Frontend**
- **Framework** : Next.js 15 (App Router)
- **UI Library** : React 18
- **Language** : TypeScript
- **Styling** : Tailwind CSS, Shadcn UI

**Infrastructure**
- **Bases de donnees** : 7 x PostgreSQL (asyncpg connection pooling)
- **Cache** : Redis 7.x (L1 + L2 caching)
- **Stockage** : MinIO (S3-compatible)
- **Reverse Proxy** : Traefik
- **Deployment** : Docker, Coolify

---

## Architecture 7-Databases

{% callout type="success" title="Performance Multi-DB" %}
L'architecture multi-bases a permis de reduire les requetes lentes de **-85%** et d'eliminer completement les problemes de contention de tables et de pool exhaustion.
{% /callout %}

### Pourquoi 7 bases de donnees ?

**Problemes avec une base monolithique :**
- Contention de verrous (imports bloquant les requetes catalogue)
- Patterns de charge mixtes (OLTP vs OLAP)
- Difficulte a scaler des domaines specifiques
- Strategies de backup/restore complexes
- Point unique de defaillance

**Solution : Separation par domaine fonctionnel**

### Les 7 bases specialisees

| Base | Tables | Pool | Temps Moyen | Usage Principal |
|------|--------|------|-------------|-----------------|
| **db_core** | 5+ | 5 | <10ms | Auth, users, permissions, config systeme |
| **db_catalog** | 40+ | 20 | <50ms | Produits, fournisseurs, categories, marques |
| **db_imports** | 15+ | 15 | <40ms | Jobs d'import, configs, logs, schedules |
| **db_exports** | 3+ | 10 | <20ms | Plateformes export, jobs, items |
| **db_media** | 10+ | 10 | <30ms | Fichiers media, thumbnails, metadonnees |
| **db_code2asin** | 8+ | 10 | <30ms | Mapping EAN/ASIN, donnees Amazon |
| **db_analytics** | 12+ | 10 | <60ms | Metriques, rapports, analytics |

---

## db_core - Systeme Central

**Purpose:** Authentication, authorization, configuration systeme, notifications

**Pool de connexions : 5** (volume faible, haute criticite)

**Tables principales :**
- `users` - Comptes utilisateurs et profils
- `roles` - Definitions de roles (RBAC)
- `permissions` - Definitions de permissions
- `user_roles` - Associations utilisateur-role
- `role_permissions` - Associations role-permission
- `notifications` - Notifications utilisateurs
- `amazon_api_configs` - Credentials Amazon PA-API
- `app_settings` - Parametres globaux application

**Caracteristiques :**
- Faible volume d'ecriture (gestion utilisateurs)
- Haut volume de lecture (authentification JWT)
- Critique pour la disponibilite systeme

---

## db_catalog - Catalogue Produits

**Purpose:** Produits, fournisseurs, categories, marques, prix, stocks

**Pool de connexions : 20** (trafic le plus eleve)

**Tables principales :**
- `products` - Donnees produits principales (EAN, ASIN, SKU, titre, specs)
- `suppliers` - Information fournisseurs
- `categories` - Hierarchie de categories
- `brands` - Information marques
- `product_prices` - Prix produits (multi-type, multi-devise)
- `product_stocks` - Niveaux de stock
- `product_attributes` - Attributs flexibles
- `product_categories` - Categories multi-taxonomie
- `product_seo` - Metadonnees SEO
- `product_variants` - Variantes produits
- `supplier_products` - Associations fournisseur-produit
- `product_bundles` - Bundles produits
- `product_bundle_items` - Items de bundle

**Caracteristiques :**
- Plus haut volume de lecture (requetes produits)
- Volume d'ecriture modere (imports, mises a jour)
- Performance critique pour l'API

---

## db_imports - Operations d'Import

**Purpose:** Configurations d'import, jobs, logs, schedules

**Pool de connexions : 15** (traitement batch)

**Tables principales :**
- `import_configs` - Configurations sources par fournisseur
- `import_jobs` - Tracking des jobs d'import
- `import_logs` - Logs detailles (partitionnes par mois)
- `import_errors` - Enregistrements d'erreurs
- `import_files` - Metadonnees fichiers importes
- `import_schedules` - Imports planifies (CRON)
- `import_statistics` - Statistiques agregees
- `mapping_templates` - Templates de mapping reutilisables

**Caracteristiques :**
- Haut volume d'ecriture pendant les imports
- Volume de lecture modere (monitoring)
- Append-only pour les logs

---

## db_exports - Operations d'Export

**Purpose:** Configurations plateformes export, jobs, items

**Pool de connexions : 10** (batch processing)

**Tables principales :**
- `export_platforms` - Configurations plateformes (Shopify, WooCommerce, etc.)
- `export_jobs` - Tracking des jobs d'export
- `export_job_items` - Statut export par produit

**Caracteristiques :**
- Volume d'ecriture modere (jobs export)
- Faible volume de lecture (checks statut)
- Focus sur le traitement batch

---

## db_media - Gestion Media

**Purpose:** Metadonnees fichiers media, thumbnails, jobs de traitement

**Pool de connexions : 10** (upload/download)

**Tables principales :**
- `media_files` - Metadonnees fichiers (reference vers MinIO)
- `media_thumbnails` - Vignettes generees (small, medium, large)
- `media_metadata` - EXIF et metadonnees techniques
- `media_processing_jobs` - Taches de traitement background
- `product_qrcodes` - QR codes produits

**Caracteristiques :**
- Volume lecture/ecriture modere
- References vers stockage MinIO (pas de blobs en DB)
- Traitement async des images

---

## db_code2asin - Mapping Amazon

**Purpose:** Conversion EAN vers ASIN, cache donnees Amazon

**Pool de connexions : 10** (API-intensive)

**Tables principales :**
- `code2asin_jobs` - Jobs de conversion batch
- `code2asin_results` - Mappings ASIN et donnees Amazon
- `code2asin_suppliers` - Configurations par fournisseur
- `code2asin_statistics` - Statistiques de performance
- `code2asin_logs` - Logs de traitement

**Caracteristiques :**
- Operations intensives en API externe
- Haute valeur de cache (TTL 24h)
- Rate limiting sur API Amazon

---

## db_analytics - Analytics & Metriques

**Purpose:** Metriques, rapports, business intelligence

**Pool de connexions : 10** (reporting)

**Tables principales :**
- `product_metrics` - Metriques performance produits
- `supplier_metrics` - Performance fournisseurs
- `import_metrics` - KPIs d'import
- `search_analytics` - Analytics de recherche
- `user_activity` - Logs d'activite utilisateurs
- `performance_metrics` - Donnees performance systeme

**Caracteristiques :**
- Faible volume d'ecriture (jobs d'agregation)
- Volume de lecture modere (dashboards)
- Requetes analytiques (plus lentes)

---

## Database Router

Le **DatabaseRouter** gere automatiquement le routage vers la bonne base de donnees selon le contexte.

### Pattern Service Layer

**Architecture : Router -> Service -> Database**

```python
# ROUTER LAYER: Concerns HTTP, validation, serialisation
@router.get("/products/{product_id}")
async def get_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_catalog_db)
):
    product = await product_service.get_product(db, product_id)
    return ProductResponse.model_validate(product)

# SERVICE LAYER: Logique metier, caching, error handling
class ProductService:
    async def get_product(self, db: AsyncSession, product_id: UUID):
        # Try cache first
        cached = await cache_service.get(f"product:{product_id}")
        if cached:
            return cached

        # Query database
        product = await self._query_product(db, product_id)

        # Store in cache
        await cache_service.set(f"product:{product_id}", product, ttl=3600)
        return product
```

### Injection de Dependances

```python
from core.database_router import get_catalog_db, get_imports_db, get_media_db

@router.get("/products")
async def get_products(db: AsyncSession = Depends(get_catalog_db)):
    # Utilise automatiquement db_catalog
    products = await db.execute(select(Product))
    return products

@router.get("/imports")
async def get_imports(db: AsyncSession = Depends(get_imports_db)):
    # Utilise automatiquement db_imports
    jobs = await db.execute(select(ImportJob))
    return jobs
```

### Mapping Automatique des Modeles

```python
class DatabaseRouter:
    db_mappings = {
        "core": ["User", "Role", "Permission", "Notification", ...],
        "catalog": ["Product", "Supplier", "Category", "Brand", ...],
        "media": ["MediaFile", "MediaThumbnail", ...],
        "imports": ["ImportConfig", "ImportJob", "ImportLog", ...],
        "exports": ["ExportPlatform", "ExportJob", ...],
        "code2asin": ["Code2ASINJob", "Code2ASINResult", ...],
        "analytics": ["ProductMetrics", "SupplierMetrics", ...],
    }
```

---

## Strategie Cross-Database

### Pas de Foreign Keys entre Bases

Les bases de donnees sont isolees - **pas de contraintes de cle etrangere entre DBs**.

```sql
-- Dans db_media
CREATE TABLE media_files (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,  -- Reference cross-DB (pas de FK)
    ...
);
```

### Linking par UUID

Les entites sont liees par references UUID :
- `MediaFile.product_id` -> `Product.id` (db_media -> db_catalog)
- `ImportJob.created_by` -> `User.id` (db_imports -> db_core)
- `Code2ASINResult.product_id` -> `Product.id` (db_code2asin -> db_catalog)

### Consistance Eventuelle

```python
# Operations cross-DB sequentielles avec transactions compensatoires
try:
    # Step 1: Update catalog
    async with db_router.session_scope("catalog") as catalog_db:
        product.title = new_title
        await catalog_db.commit()

    # Step 2: Update media
    async with db_router.session_scope("media") as media_db:
        media.alt_text = new_title
        await media_db.commit()
except Exception:
    # Transaction compensatoire: rollback catalog
    async with db_router.session_scope("catalog") as catalog_db:
        product.title = old_title
        await catalog_db.commit()
```

---

## Connection Pooling (asyncpg)

### Configuration par Base

```python
# Pool sizes optimises par charge
pool_sizes = {
    "core": 5,       # Faible volume
    "catalog": 20,   # Haut volume lecture
    "media": 10,     # Volume modere
    "imports": 15,   # Haut volume ecriture pendant imports
    "exports": 10,   # Operations batch
    "code2asin": 10, # API-intensive
    "analytics": 10  # Requetes analytiques
}

# Parametres de pool
DATABASE_POOL_TIMEOUT = 30       # 30s max attente connexion
DATABASE_POOL_RECYCLE = 3600     # Recycler connexions apres 1h
DATABASE_POOL_PRE_PING = True    # Tester connexions avant utilisation
DATABASE_MAX_OVERFLOW = 10       # 10 connexions extra autorisees
```

### Avantages

- Tailles de pool optimisees par charge
- Pannes de connexion isolees
- Meilleure utilisation des ressources
- Overhead de connexion reduit

---

## Cache Strategy (Redis L1 + L2)

### Architecture 3 Niveaux

```text
[API Request]
     |
     v
[L1: In-Memory Cache] -- TTL: 60s, Taille limitee
     |
     v (Cache Miss)
[L2: Redis Cache] -- TTL: Variable, Partage entre instances
     |
     v (Cache Miss)
[PostgreSQL Database]
```

### Cache-Aside Pattern

```python
async def get_categories(db: AsyncSession) -> List[Category]:
    # 1. Check cache
    cache_key = "categories:all"
    cached = await cache_service.get(cache_key)
    if cached:
        return cached

    # 2. Query database
    result = await db.execute(select(Category).where(Category.is_active == True))
    categories = result.scalars().all()

    # 3. Store in cache (1h TTL)
    await cache_service.set(cache_key, categories, ttl=3600)
    return categories
```

### TTL par Type de Donnees

```python
DEFAULT_TTLS = {
    # Donnees haute-frequence, faible changement
    "categories": 3600,        # 1 heure
    "taxonomies": 7200,        # 2 heures
    "brands": 3600,            # 1 heure

    # Donnees frequence moyenne
    "products": 1800,          # 30 minutes
    "suppliers": 1800,         # 30 minutes

    # Donnees haute-frequence, changement frequent
    "enrichment_stats": 300,   # 5 minutes
    "import_jobs": 300,        # 5 minutes
    "export_jobs": 300,        # 5 minutes

    # Donnees longue duree
    "code2asin_mappings": 86400,  # 24 heures
    "amazon_product_data": 43200, # 12 heures

    # Donnees courte duree
    "search_results": 300,     # 5 minutes
    "api_rate_limits": 60,     # 1 minute
}
```

---

## Celery Background Tasks

### Architecture des Queues

```text
[Celery Beat Scheduler]
         |
         v
[Redis Broker] --> [imports queue] --> [Import Workers x4]
         |
         +--> [exports queue] --> [Export Workers x2]
         |
         +--> [code2asin queue] --> [Code2ASIN Workers x3]
         |
         +--> [catalog queue] --> [Catalog Workers x2]
         |
         +--> [media queue] --> [Media Workers x2]
```

### Routage des Taches

```python
app.conf.task_routes = {
    "api.services.import_tasks.*": {"queue": "imports"},
    "api.services.export_tasks.*": {"queue": "exports"},
    "api.services.catalog_service.*": {"queue": "catalog"},
    "api.services.media_service.*": {"queue": "media"},
    "api.services.code2asin_service.*": {"queue": "code2asin"},
}
```

### Taches Planifiees (Beat)

```python
app.conf.beat_schedule = {
    "poll-ftp-imports": {
        "task": "api.services.import_tasks.poll_ftp_imports",
        "schedule": 3600.0,  # Toutes les heures
    },
    "poll-email-imports": {
        "task": "api.services.import_tasks.poll_email_imports",
        "schedule": 900.0,  # Toutes les 15 minutes
    },
    "check-scheduled-imports": {
        "task": "api.services.import_tasks.process_scheduled_imports",
        "schedule": 300.0,  # Toutes les 5 minutes
    },
    "cleanup-orphaned-files": {
        "task": "api.services.export_tasks.cleanup_orphaned_exports",
        "schedule": 86400.0,  # Quotidien
    },
}
```

### Retry avec Backoff Exponentiel

```python
@celery_app.task(bind=True, max_retries=5, default_retry_delay=60)
def process_import_file(self, job_id: str):
    try:
        result = import_service.process(job_id)
        return result
    except RecoverableError as exc:
        # Backoff: 1min, 5min, 15min, 1h, 4h
        delay = min(60 * (5 ** self.request.retries), 14400)
        raise self.retry(exc=exc, countdown=delay)
```

---

## MinIO Object Storage

### Organisation des Buckets

```text
product-images/          --> Images produits
  └── products/{uuid[0:2]}/{product_id}/{hash}.jpg

imports/                 --> Fichiers import CSV/Excel
  └── YYYY/MM/DD/

exports/                 --> Fichiers export generes
  └── YYYY/MM/DD/

code2asin-cache/         --> Cache resultats Amazon
  └── YYYY/MM/
```

### UUID Sharding pour Media

**Structure** : `products/{uuid[0:2]}/{product_id}/{hash}.jpg`

- 256 sous-repertoires (00-ff) pour scalabilite
- Support de 200k+ produits
- Acces direct via presigned URLs

### Systeme de Thumbnails

3 tailles generees automatiquement :
- **small** : 150x150 px
- **medium** : 300x300 px
- **large** : 800x800 px

---

## Performances

### Metriques Cles

**Frontend**
- Bundle size : optimise avec code splitting
- Build time : ~2 minutes
- First Load JS : <500 kB

**Backend**
- Requetes lentes : -85% apres migration multi-DB
- Dashboard p95 : ~400ms
- Pool exhaustion : 0%

**Database**
- N+1 queries : 100% eliminees (eager loading)
- Index composites : 15+ critiques
- Cache hit rate : 70-85%

### Cibles de Temps de Reponse

| Operation | Cible | P95 | P99 |
|-----------|-------|-----|-----|
| Product read (cached) | <10ms | <20ms | <50ms |
| Product read (DB) | <50ms | <100ms | <200ms |
| Product write | <100ms | <200ms | <500ms |
| Search query | <100ms | <300ms | <1s |
| Bulk import (1000 produits) | <30s | <60s | <120s |

---

## Monitoring & Observabilite

### Health Checks

- `/health` - Liveness API
- `/health/db` - Connectivite base de donnees (7 DBs)
- `/health/redis` - Connectivite Redis
- `/health/celery` - Statut workers

### Metriques

- Prometheus metrics endpoint
- Histogrammes duree requetes
- Performance queries database
- Taux de cache hit
- Longueurs queues Celery

---

## Ressources

- [Database Schema](/docs/technical/database)
- [Deployment Guide](/docs/technical/deployment)
- [Security Architecture](/docs/technical/security)
- [Performance Baseline](/docs/technical/performance)

{% callout type="info" title="Architecture en Production" %}
Cette architecture supporte actuellement des dizaines de milliers de produits avec des temps de reponse p95 < 500ms et un taux de disponibilite de 99.9%.
{% /callout %}
