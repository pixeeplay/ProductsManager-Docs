---
title: Base de Données
description: Architecture multi-DB, optimisations et Database Optimizer
---

# Base de Données

Le système Suppliers-Import utilise une architecture multi-bases de données PostgreSQL haute performance, avec un optimiseur intelligent qui a généré un ROI de 2,257% et des économies de €66,000/an.

{% .lead %}

---

## Architecture Multi-DB

L'architecture repose sur **5 bases PostgreSQL spécialisées**, chacune optimisée pour son domaine fonctionnel avec des pools de connexions dédiés.

{% callout type="success" title="Impact Performance" %}
Migration vers multi-DB : **-85% requêtes lentes** (16,370 → 2,500/jour), **0% pool exhaustion** (vs 92% avant)
{% /callout %}

### Vue d'ensemble des bases

| Base | Tables | Pool | Usage Principal |
|------|--------|------|-----------------|
| **db_catalog** | 9 | 30 | Produits, fournisseurs, catégories |
| **db_imports** | 8 | 20 | Jobs d'import, logs, configurations |
| **db_media** | 4 | 15 | Fichiers média, métadonnées |
| **db_code2asin** | 5 | 12 | Mapping Amazon ASIN |
| **db_analytics** | 6 | 10 | Métriques, rapports, analytics |

**Total : 32 tables, 87 connexions base, 282 connexions max**

---

## db_catalog - Catalogue Produits

### Schéma

**Tables principales** :
- `products` : 133,149 produits actifs
- `suppliers` : Fournisseurs et configurations
- `categories` : Arborescence de catégories
- `brands` : Marques produits
- `product_images` : Références images MinIO
- `product_variants` : Variantes et déclinaisons
- `price_history` : Historique des prix
- `stock_history` : Historique des stocks

### Index Critiques

```sql
-- Index composite pour listes produits actifs
CREATE INDEX CONCURRENTLY idx_products_active_created_desc
  ON products(is_active, created_at DESC)
  WHERE is_active = true;

-- Index recherche par SKU
CREATE INDEX CONCURRENTLY idx_products_sku_active_title
  ON products(sku, is_active, title)
  WHERE is_active = true;

-- Index fournisseur
CREATE INDEX idx_products_supplier_id
  ON products(supplier_id);
```

### Performances

**Avant optimisation** :
- Requête liste produits : **850ms**
- Sequential scans : 8,450/jour

**Après optimisation** :
- Requête liste produits : **45ms** (-95%)
- Sequential scans : 950/jour (-89%)
- Hit rate cache : 75-85%

**Pool de connexions** :
- Size : 30 (le plus important)
- Max overflow : 40
- Total capacity : 70 connexions
- Utilization moyenne : 50-60%

---

## db_imports - Gestion des Imports

### Schéma

**Tables principales** :
- `import_configs` : Configurations par fournisseur
- `import_jobs` : Jobs avec statuts (pending, running, completed, failed)
- `import_logs` : Logs détaillés **partitionnés par mois**
- `import_errors` : Erreurs et warnings
- `import_files` : Métadonnées fichiers (référence MinIO)
- `import_mappings` : Mappings colonnes CSV → champs produits
- `import_schedules` : Planifications CRON
- `import_statistics` : Statistiques agrégées par job

### Index Critiques

```sql
-- Index le plus sollicité : statut des jobs
CREATE INDEX CONCURRENTLY idx_import_jobs_status_created
  ON import_jobs(status, created_at DESC);
  -- Gain : 620ms → 50ms (-92%)
  -- Fréquence : 120 req/min (le plus haut)

-- Index logs par job
CREATE INDEX CONCURRENTLY idx_import_logs_job_created_level
  ON import_logs(job_id, created_at DESC, log_level);
  -- Gain : 395ms → 40ms (-90%)
  -- Fréquence : 200 req/min
```

### Partitionnement

**Table `import_logs` partitionnée par mois** :

```sql
CREATE TABLE import_logs (
    id SERIAL,
    job_id INTEGER NOT NULL,
    log_level VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Partitions mensuelles
CREATE TABLE import_logs_2025_01 PARTITION OF import_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE import_logs_2025_02 PARTITION OF import_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

**Avantages** :
- Requêtes sur période récente ultra-rapides
- Suppression anciens logs par DROP partition
- Maintenance VACUUM ciblée par partition

### Performances

**Dashboard imports** :
- Avant : 620ms (p95)
- Après : 50ms (p95) **-92%**
- Cache TTL : 30 min (statuts changent souvent)

**Pool de connexions** :
- Size : 20
- Max overflow : 40
- Total capacity : 60 connexions
- Batch processing optimisé

---

## Database Optimizer

Le **DatabaseOptimizer** est un service d'optimisation automatique qui analyse et améliore les performances des 5 bases de données.

{% callout type="success" title="ROI Exceptionnel" %}
**ROI : 2,257%** | **Économies : €66,000/an** | **Requêtes lentes : -85%**
{% /callout %}

### Fonctionnalités

#### 1. Analyse des Requêtes Lentes

```python
from api.services.database_optimizer import db_optimizer

# Analyser les requêtes lentes d'une base
slow_queries = await db_optimizer.analyze_slow_queries("catalog", limit=10)

for query in slow_queries:
    print(f"Query: {query.query}")
    print(f"Avg time: {query.avg_time}s")
    print(f"Call count: {query.call_count}")
    print(f"Total time: {query.total_time}s")
```

**Métriques collectées** :
- Temps d'exécution moyen
- Nombre d'appels
- Temps total cumulé
- Execution plan PostgreSQL

#### 2. Suggestions d'Index

```python
# Obtenir des suggestions d'index
suggestions = await db_optimizer.suggest_indexes("catalog", table_name="products")

for suggestion in suggestions:
    print(f"Table: {suggestion.table_name}")
    print(f"Columns: {suggestion.columns}")
    print(f"SQL: {suggestion.create_sql}")
    print(f"Benefit: {suggestion.estimated_benefit}")
```

**Heuristiques** :
- Analyse des clauses WHERE fréquentes
- Détection des foreign keys non indexées
- Patterns ORDER BY + LIMIT
- Jointures coûteuses

#### 3. Statistiques de Tables

```python
# Statistiques détaillées d'une table
stats = await db_optimizer.get_table_stats("catalog", "products")

print(f"Rows: {stats.row_count}")
print(f"Size: {stats.size_bytes // (1024*1024)} MB")
print(f"Sequential scans: {stats.seq_scan}")
print(f"Index scans: {stats.idx_scan}")
print(f"Live tuples: {stats.n_live_tup}")
print(f"Dead tuples: {stats.n_dead_tup}")
```

#### 4. Maintenance PostgreSQL

```python
# Exécuter VACUUM ANALYZE
result = await db_optimizer.vacuum_analyze("catalog", table_name="products")
print(f"Success: {result['success']}")
print(f"Execution time: {result['execution_time']}s")

# Pour toute la base
result = await db_optimizer.vacuum_analyze("catalog")
```

**Opérations** :
- VACUUM : Récupère espace dead tuples
- ANALYZE : Met à jour statistiques
- REINDEX : Reconstruit index fragmentés

### Impact Mesurable

**Migration 005 : 15 index critiques**

| Index | DB | Gain Temps | Fréquence | Impact/Jour |
|-------|----|-----------:|-----------:|------------:|
| idx_products_active_created_desc | catalog | -95% | 45/min | -36,000 ms |
| idx_import_jobs_status_created | imports | -92% | 120/min | -82,080 ms |
| idx_notifications_user_unread | analytics | -95% | 300/min | -81,000 ms |
| idx_products_sku_active | catalog | -90% | 30/min | -16,200 ms |
| idx_import_logs_job_created | imports | -90% | 200/min | -71,000 ms |

**Total économisé/jour** : **-286,280 ms** (4h 46min)

---

## Connection Pooling

### Configuration par Base

```python
# api/core/config_multidb.py

# Global defaults
DATABASE_POOL_SIZE = 20
DATABASE_MAX_OVERFLOW = 40
DATABASE_POOL_TIMEOUT = 30  # secondes
DATABASE_POOL_RECYCLE = 3600  # 1h
DATABASE_POOL_PRE_PING = True  # test connexions

# Database-specific pools
CATALOG_POOL_SIZE = 30      # Highest traffic
MEDIA_POOL_SIZE = 15        # Upload/download
IMPORTS_POOL_SIZE = 20      # Batch jobs
CODE2ASIN_POOL_SIZE = 12    # External API
ANALYTICS_POOL_SIZE = 10    # Reporting
```

### Capacité Totale

**Base** : 87 connexions
**Max (with overflow)** : 282 connexions

| Database | Pool | Overflow | Max | Utilization |
|----------|------|----------|-----|-------------|
| catalog | 30 | 40 | 70 | 50-60% |
| imports | 20 | 40 | 60 | 40-50% |
| media | 15 | 40 | 55 | 30-40% |
| code2asin | 12 | 40 | 52 | 20-30% |
| analytics | 10 | 40 | 50 | 30-40% |

### Health Metrics

**Avant optimisation** :
- Pool exhaustion risk : **92%**
- Connection wait time : 500-1000ms
- Timeouts : 15-20/jour

**Après optimisation** :
- Pool exhaustion risk : **0%**
- Connection wait time : < 10ms
- Timeouts : 0/jour
- Utilization : 40-60% (sain)

---

## Bonnes Pratiques

### 1. Éviter les N+1 Queries

{% callout type="warning" title="Anti-pattern N+1" %}
Le problème N+1 est la **cause #1** de lenteur dans les applications ORM. Toujours utiliser eager loading.
{% /callout %}

**Mauvais** :
```python
# 1 + N queries (1 + 250 = 251 queries)
products = await db.execute(select(Product))
for product in products:
    supplier = await db.execute(
        select(Supplier).where(Supplier.id == product.supplier_id)
    )
```

**Bon** :
```python
# 1 query avec JOIN
products = await db.execute(
    select(Product).options(joinedload(Product.supplier))
)
```

### 2. Utiliser les Index Composites

```sql
-- Bon : index composite pour filtre + tri
CREATE INDEX idx_products_active_created
ON products(is_active, created_at DESC)
WHERE is_active = true;

-- Moins bon : 2 index séparés
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_created ON products(created_at);
```

### 3. Optimiser les Count()

**Mauvais** :
```python
# SELECT * puis COUNT en Python
products = await db.execute(select(Product))
count = len(products.all())
```

**Bon** :
```python
# COUNT() en SQL
count = await db.scalar(
    select(func.count()).select_from(Product).where(Product.is_active)
)
```

### 4. Cache Intelligent

```python
from api.services.cache_service import cache

# Cache avec TTL adapté
@cache(ttl=7200, db="catalog", key="products:active")
async def get_active_products(db: AsyncSession):
    return await db.execute(
        select(Product).where(Product.is_active == True)
    )
```

### 5. Batch Operations

```python
# Bon : bulk insert
products = [Product(name=f"Product {i}") for i in range(1000)]
db.bulk_save_objects(products)
await db.commit()

# Mauvais : 1000 INSERT individuels
for i in range(1000):
    product = Product(name=f"Product {i}")
    db.add(product)
    await db.commit()
```

---

## Monitoring

### Métriques Clés

**Performance queries** :
- Slow queries count (> 1s)
- Average query time par table
- N+1 query detections
- Missing index warnings

**Connection pools** :
- Pool utilization (%)
- Connection wait time
- Pool exhaustion events
- Idle connections

**Cache** :
- Hit rate par DB
- Miss rate
- Eviction rate
- Memory usage

### Dashboards Grafana

**Database Performance** :
- Query latency (p50, p95, p99)
- Slow queries trends
- Index usage statistics
- Table sizes evolution

**Connection Pools** :
- Active connections par DB
- Pool utilization (%)
- Wait time histogram
- Exhaustion alerts

---

## Migration & Backup

### Migrations Alembic

```bash
# Générer migration
alembic revision --autogenerate -m "Add product_variants"

# Appliquer migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Backup Strategy

**Automatique** :
- Dump quotidien de chaque DB
- Rétention : 30 jours
- Stockage MinIO (bucket `backups`)

```bash
# Backup manuel d'une DB
docker exec postgres-xxx pg_dump -U user db_catalog > backup_catalog.sql

# Restore
docker exec -i postgres-xxx psql -U user db_catalog < backup_catalog.sql
```

---

## Ressources

- [Architecture Multi-DB](/docs/technical/architecture)
- [Deployment Guide](/docs/technical/deployment)
- [Security Architecture](/docs/technical/security)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

{% callout type="info" title="Database en Production" %}
Actuellement : **5 bases PostgreSQL**, **133,149 produits**, **282 connexions max**, **2,500 requêtes lentes/jour** (-85% vs v3.0.0)
{% /callout %}
