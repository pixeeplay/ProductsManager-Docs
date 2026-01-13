---
title: Base de Donnees
description: Architecture 7 bases de donnees, modeles cles et optimisations
---

# Base de Donnees

Le systeme ProductsManager utilise une architecture multi-bases de donnees PostgreSQL haute performance avec 7 bases specialisees, chacune optimisee pour son domaine fonctionnel.

{% .lead %}

---

## Architecture 7 Bases de Donnees

L'architecture repose sur **7 bases PostgreSQL specialisees**, avec des pools de connexions dedies via asyncpg.

{% callout type="success" title="Impact Performance" %}
Migration vers multi-DB : **-85% requetes lentes**, **0% pool exhaustion**, isolation des pannes par domaine
{% /callout %}

### Vue d'ensemble

| Base | Tables | Pool | Temps Moyen | Usage Principal |
|------|--------|------|-------------|-----------------|
| **db_core** | 5+ | 5 | <10ms | Auth, users, permissions, config |
| **db_catalog** | 40+ | 20 | <50ms | Produits, fournisseurs, categories |
| **db_imports** | 15+ | 15 | <40ms | Jobs d'import, configs, logs |
| **db_exports** | 3+ | 10 | <20ms | Plateformes export, jobs |
| **db_media** | 10+ | 10 | <30ms | Fichiers media, thumbnails |
| **db_code2asin** | 8+ | 10 | <30ms | Mapping EAN/ASIN Amazon |
| **db_analytics** | 12+ | 10 | <60ms | Metriques, rapports |

---

## db_core - Systeme Central

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_core`

**Pool** : 5 connexions (faible volume, haute criticite)

### Modeles Cles

#### users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    permissions JSONB NOT NULL DEFAULT '{}',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
```

#### roles & permissions

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100),  -- 'product', 'supplier', 'import'
    action VARCHAR(50)      -- 'create', 'read', 'update', 'delete'
);

CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

#### notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'info', 'success', 'warning', 'error'
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

---

## db_catalog - Catalogue Produits

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_catalog`

**Pool** : 20 connexions (trafic le plus eleve)

### Modeles Cles

#### products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identifiants
    ean VARCHAR(20),
    asin VARCHAR(20),
    sku VARCHAR(100),
    upc VARCHAR(12),
    gtin VARCHAR(14),
    manufacturer_reference VARCHAR(100),
    external_id VARCHAR(255),

    -- Info de base
    title VARCHAR(500) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Relations
    supplier_id UUID REFERENCES suppliers(id),
    category_id UUID,
    brand_id UUID REFERENCES brands(id),

    -- Statut
    status VARCHAR(50) DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,

    -- Dimensions & Poids
    weight NUMERIC(10, 3),
    width NUMERIC(10, 2),
    height NUMERIC(10, 2),
    depth NUMERIC(10, 2),

    -- Specs techniques (JSONB flexible)
    technical_specs JSONB,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_ean ON products(ean);
CREATE INDEX idx_products_asin ON products(asin);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at);
```

#### suppliers

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    country VARCHAR(2) DEFAULT 'FR',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_suppliers_is_active ON suppliers(is_active);
```

#### product_prices

```sql
CREATE TABLE product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id),
    price_type VARCHAR(50) NOT NULL DEFAULT 'retail',
    price NUMERIC(10, 2) NOT NULL,
    cost NUMERIC(10, 2),
    margin NUMERIC(5, 2),
    currency VARCHAR(3) DEFAULT 'EUR',
    min_quantity INTEGER DEFAULT 1,
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX idx_product_prices_is_active ON product_prices(is_active);
```

#### product_stocks

```sql
CREATE TABLE product_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    min_stock INTEGER DEFAULT 0,
    last_update TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_stocks_product_id ON product_stocks(product_id);
```

#### categories & brands

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## db_imports - Operations d'Import

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_imports`

**Pool** : 15 connexions (batch processing)

### Modeles Cles

#### import_configs

```sql
CREATE TABLE import_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(50) NOT NULL,
    import_type VARCHAR(50) NOT NULL,
    config_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    -- Configuration (JSONB)
    connection_config JSONB NOT NULL,  -- FTP, SFTP, Email, HTTP
    schedule_config JSONB,

    -- File handling
    file_pattern VARCHAR(255),
    file_format VARCHAR(50),  -- 'csv', 'xlsx', 'xml', 'json'
    encoding VARCHAR(50) DEFAULT 'UTF-8',
    delimiter VARCHAR(10) DEFAULT ';',

    -- Mapping & Rules (JSONB)
    field_mapping JSONB,
    transformation_rules JSONB,
    validation_rules JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_import_configs_supplier_code ON import_configs(supplier_code);
CREATE INDEX idx_import_configs_is_active ON import_configs(is_active);
```

#### import_jobs

```sql
CREATE TABLE import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES import_configs(id),
    supplier_code VARCHAR(50) NOT NULL,
    import_type VARCHAR(50) NOT NULL,

    -- Statut
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,

    -- Statistiques
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    successful_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    products_created INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,

    -- Erreurs
    error_count INTEGER DEFAULT 0,
    last_error TEXT,

    created_by UUID,  -- Reference cross-DB vers users
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_import_jobs_status ON import_jobs(status);
CREATE INDEX idx_import_jobs_created_at ON import_jobs(created_at);
CREATE INDEX idx_import_jobs_supplier_code ON import_jobs(supplier_code);
```

#### import_schedules

```sql
CREATE TABLE import_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES import_configs(id),
    cron_expression VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_run TIMESTAMP,
    next_run TIMESTAMP
);
```

#### mapping_templates

```sql
CREATE TABLE mapping_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    supplier_code VARCHAR(50),
    field_mapping JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## db_exports - Operations d'Export

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_exports`

**Pool** : 10 connexions (batch processing)

### Modeles Cles

#### export_platforms

```sql
CREATE TABLE export_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    platform_type VARCHAR(50) NOT NULL,  -- 'shopify', 'woocommerce', 'minio'
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB NOT NULL,
    field_mappings JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### export_jobs

```sql
CREATE TABLE export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_id UUID REFERENCES export_platforms(id),
    job_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_items INTEGER DEFAULT 0,
    success_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### export_job_items

```sql
CREATE TABLE export_job_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES export_jobs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,  -- Reference cross-DB
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    exported_data JSONB,
    response_data JSONB,
    processed_at TIMESTAMP
);
```

---

## db_media - Gestion Media

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_media`

**Pool** : 10 connexions

### Modeles Cles

#### media_files

```sql
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,  -- Reference cross-DB (pas de FK)

    -- Info fichier
    file_name VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64) UNIQUE,  -- SHA-256 deduplication
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,

    -- Stockage MinIO
    storage_type VARCHAR(50),  -- 'minio', 's3', 'local'
    bucket_name VARCHAR(100),
    object_key TEXT,
    storage_url TEXT,

    -- Metadonnees image
    width INTEGER,
    height INTEGER,
    format VARCHAR(20),
    image_type VARCHAR(50),

    -- Display
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    alt_text TEXT,

    -- Statut
    processing_status VARCHAR(50) DEFAULT 'pending',
    is_valid BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_media_files_product_id ON media_files(product_id);
CREATE INDEX idx_media_files_file_hash ON media_files(file_hash);
CREATE INDEX idx_media_files_is_primary ON media_files(is_primary);
```

#### media_thumbnails

```sql
CREATE TABLE media_thumbnails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_file_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
    size_name VARCHAR(20) NOT NULL,  -- 'small', 'medium', 'large'
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    object_key TEXT NOT NULL,
    storage_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_media_thumbnails_media_file_id ON media_thumbnails(media_file_id);
```

---

## db_code2asin - Mapping Amazon

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_code2asin`

**Pool** : 10 connexions (API-intensive)

### Modeles Cles

#### code2asin_jobs

```sql
CREATE TABLE code2asin_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) DEFAULT 'Code2ASIN Job',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    supplier_code VARCHAR(100),

    -- Statistiques
    total_codes INTEGER DEFAULT 0,
    processed_codes INTEGER DEFAULT 0,
    successful_conversions INTEGER DEFAULT 0,
    failed_conversions INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,

    -- Match Quality
    exact_matches INTEGER DEFAULT 0,
    fuzzy_matches INTEGER DEFAULT 0,
    no_matches INTEGER DEFAULT 0,

    -- Configuration
    batch_size INTEGER DEFAULT 100,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 5,
    search_config JSONB,

    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_code2asin_jobs_status ON code2asin_jobs(status);
CREATE INDEX idx_code2asin_jobs_supplier_code ON code2asin_jobs(supplier_code);
```

#### code2asin_results

```sql
CREATE TABLE code2asin_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES code2asin_jobs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,  -- Reference cross-DB
    product_ean VARCHAR(255),
    product_title VARCHAR(500),

    -- Amazon Match
    asin VARCHAR(20),
    amazon_title TEXT,
    match_confidence NUMERIC(5, 2),
    match_type VARCHAR(50),  -- 'exact', 'partial', 'fuzzy', 'manual'

    -- Amazon Data (JSONB)
    amazon_data JSONB,
    amazon_images JSONB,
    amazon_price NUMERIC(10, 2),
    amazon_currency VARCHAR(3) DEFAULT 'EUR',

    -- Category & Ratings
    amazon_category VARCHAR(255),
    amazon_rating NUMERIC(3, 2),
    amazon_review_count INTEGER,

    processed_at TIMESTAMP DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_code2asin_results_job_id ON code2asin_results(job_id);
CREATE INDEX idx_code2asin_results_product_id ON code2asin_results(product_id);
CREATE INDEX idx_code2asin_results_asin ON code2asin_results(asin);
```

---

## db_analytics - Analytics & Metriques

**Connection** : `postgresql+asyncpg://user:pass@host:5432/db_analytics`

**Pool** : 10 connexions (reporting)

### Modeles Cles

#### product_metrics

```sql
CREATE TABLE product_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,  -- Reference cross-DB
    date DATE NOT NULL,
    view_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5, 4),
    revenue NUMERIC(12, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### supplier_metrics

```sql
CREATE TABLE supplier_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL,
    date DATE NOT NULL,
    products_count INTEGER DEFAULT 0,
    imports_count INTEGER DEFAULT 0,
    success_rate NUMERIC(5, 2),
    avg_processing_time INTEGER
);
```

#### import_metrics

```sql
CREATE TABLE import_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_imports INTEGER DEFAULT 0,
    successful_imports INTEGER DEFAULT 0,
    failed_imports INTEGER DEFAULT 0,
    total_products_processed INTEGER DEFAULT 0,
    avg_processing_time INTEGER
);
```

---

## Connection Pooling (asyncpg)

### Configuration

```python
# Parametres globaux
DATABASE_POOL_TIMEOUT = 30       # 30s max attente
DATABASE_POOL_RECYCLE = 3600     # Recycler apres 1h
DATABASE_POOL_PRE_PING = True    # Tester connexions
DATABASE_MAX_OVERFLOW = 10       # Connexions extra

# Pools par base
CORE_POOL_SIZE = 5
CATALOG_POOL_SIZE = 20
IMPORTS_POOL_SIZE = 15
EXPORTS_POOL_SIZE = 10
MEDIA_POOL_SIZE = 10
CODE2ASIN_POOL_SIZE = 10
ANALYTICS_POOL_SIZE = 10
```

### Capacite Totale

| Database | Pool Base | Overflow | Max |
|----------|-----------|----------|-----|
| db_core | 5 | 10 | 15 |
| db_catalog | 20 | 10 | 30 |
| db_imports | 15 | 10 | 25 |
| db_exports | 10 | 10 | 20 |
| db_media | 10 | 10 | 20 |
| db_code2asin | 10 | 10 | 20 |
| db_analytics | 10 | 10 | 20 |

**Total** : 80 base, 150 max

---

## Strategie Cross-Database

### Pas de Foreign Keys entre Bases

```sql
-- Dans db_media
CREATE TABLE media_files (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,  -- Reference cross-DB, PAS de FK
    ...
);
```

### Validation Cross-DB

```python
@celery_app.task
async def validate_cross_db_references():
    """Verifier les enregistrements orphelins entre bases."""
    async with db_router.session_scope("media") as media_db:
        orphaned_media = await find_orphaned_media(media_db)

    async with db_router.session_scope("imports") as imports_db:
        orphaned_jobs = await find_orphaned_jobs(imports_db)

    return {
        "orphaned_media": len(orphaned_media),
        "orphaned_jobs": len(orphaned_jobs)
    }
```

---

## Bonnes Pratiques

### 1. Eviter les N+1 Queries

```python
# Mauvais - N+1
products = await db.execute(select(Product))
for product in products:
    supplier = await db.execute(select(Supplier).where(Supplier.id == product.supplier_id))

# Bon - Eager loading
products = await db.execute(
    select(Product).options(joinedload(Product.supplier))
)
```

### 2. Utiliser les Index Composites

```sql
-- Index composite pour filtre + tri
CREATE INDEX idx_products_active_created
ON products(is_active, created_at DESC)
WHERE is_active = true;
```

### 3. Cache Intelligent

```python
@cache(ttl=3600, key="products:active")
async def get_active_products(db: AsyncSession):
    return await db.execute(
        select(Product).where(Product.is_active == True)
    )
```

### 4. Batch Operations

```python
# Bon - bulk insert
products = [Product(name=f"Product {i}") for i in range(1000)]
db.bulk_save_objects(products)
await db.commit()

# Mauvais - 1000 INSERT individuels
for i in range(1000):
    product = Product(name=f"Product {i}")
    db.add(product)
    await db.commit()
```

---

## Migration & Backup

### Migrations Alembic

```bash
# Generer migration
alembic revision --autogenerate -m "Add product_variants"

# Appliquer migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Structure des Migrations

```text
migrations/
├── catalog/
│   ├── 001_initial_schema.sql
│   ├── 002_add_product_indexes.sql
├── core/
│   ├── 001_create_users.sql
├── media/
│   ├── 001_create_media_files.sql
├── imports/
│   ├── 001_create_import_tables.sql
├── exports/
│   ├── 001_create_export_tables.sql
├── code2asin/
│   ├── 001_create_code2asin_tables.sql
└── analytics/
    ├── 001_create_analytics_tables.sql
```

---

## Ressources

- [Architecture Technique](/docs/technical/architecture)
- [Deployment Guide](/docs/technical/deployment)
- [Security Architecture](/docs/technical/security)

{% callout type="info" title="Database en Production" %}
Actuellement : **7 bases PostgreSQL**, pools optimises par domaine, connexions asyncpg, cache Redis L1+L2
{% /callout %}
