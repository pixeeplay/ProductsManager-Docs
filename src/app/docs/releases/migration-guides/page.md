---
title: Guides de Migration
nextjs:
  metadata:
    title: Guides de Migration - Products Manager APP
    description: Guides de migration v3 vers v4 (architecture multi-DB), v4.0 vers v4.5 (systeme de modules), procedures de sauvegarde.
---

Ce guide couvre les migrations majeures de Products Manager : le passage a l'architecture multi-bases de donnees (v3 vers v4) et l'introduction du systeme de modules (v4.0 vers v4.5). {% .lead %}

---

## Migration v3 vers v4 : Architecture Multi-DB

### Changements majeurs

La version 4.0 a introduit une refonte complete de l'architecture de base de donnees, passant d'une base monolithique a 7 bases specialisees.

| Aspect | v3 (monolithique) | v4 (multi-DB) |
|--------|-------------------|---------------|
| Bases de donnees | 1 (PostgreSQL) | 7 (PostgreSQL) |
| ORM | SQLAlchemy sync | SQLAlchemy async |
| Driver | psycopg2 | asyncpg |
| Identifiants | Integer auto-increment | UUID v4 |
| EAN | Float ou Integer | String (defense-in-depth) |
| References cross-DB | Foreign keys | UUID references |
| Sessions | Globale | Par domaine (session_scope) |

### Les 7 bases de donnees

| Base | Contenu migre depuis v3 |
|------|------------------------|
| `db_core` | Users, roles, permissions, app_settings |
| `db_catalog` | Products, suppliers, categories, brands |
| `db_imports` | Import jobs, configs, schedules, mapping templates |
| `db_analytics` | Reports, audit_logs, ai_usage_logs |
| `db_media` | Product images (MediaFile records) |
| `db_code2asin` | Code2ASIN mapping jobs et resultats |
| `db_suppliers` | Extended supplier data, EAN resolutions |

### Etapes de migration

{% callout type="danger" title="Sauvegarde obligatoire" %}
Avant toute migration, effectuez une sauvegarde complete de la base de donnees et des fichiers de l'application.
{% /callout %}

#### 1. Sauvegarde de la base v3

```bash
# Sauvegarde complete de la base monolithique
pg_dump -h localhost -U postgres -d productsmanager_v3 \
  --format=custom --file=backup_v3_$(date +%Y%m%d).dump

# Sauvegarde des fichiers media
tar czf media_backup_$(date +%Y%m%d).tar.gz /app/uploads/
```

#### 2. Creation des 7 bases v4

```bash
# Script de creation des bases (execute par Docker init)
for db in db_core db_catalog db_imports db_analytics db_media db_code2asin db_suppliers; do
    createdb -U postgres "staging_${db}"
done
```

#### 3. Migration des schemas (Alembic)

```bash
# Appliquer les migrations Alembic
DATABASE_URL="postgresql://user:pass@host:5432/staging_db_core" \
  alembic upgrade head
```

#### 4. Migration des donnees

La migration des donnees se fait par domaine fonctionnel :

```sql
-- Exemple : migration des produits vers db_catalog
INSERT INTO db_catalog.products (id, ean, name, brand, ...)
SELECT gen_random_uuid(), ean::text, name, brand, ...
FROM v3_database.products;

-- Conversion des EAN : Float -> String
UPDATE db_catalog.products
SET ean = lpad(cast(ean_numeric as text), 13, '0')
WHERE ean IS NOT NULL;
```

#### 5. Mise a jour des sessions

```python
# Ancien code v3
from database import get_db

@app.get("/products")
async def get_products(db: Session = Depends(get_db)):
    ...

# Nouveau code v4
from core.database_router import get_catalog_db

@app.get("/products")
async def get_products(db: AsyncSession = Depends(get_catalog_db)):
    ...
```

### Breaking changes v3 -> v4

| Changement | Impact | Action requise |
|------------|--------|----------------|
| IDs Integer -> UUID | URLs, references frontend | Mettre a jour les liens et references |
| EAN Float -> String | Comparaisons, imports | Utiliser `normalize_ean()` partout |
| Session sync -> async | Tous les endpoints | Ajouter `await` aux operations DB |
| Foreign keys -> UUID refs | Jointures cross-DB | Utiliser `outerjoin` avec UUID match |
| Single DB -> Multi-DB | Configuration | 7 `DB_*_URL` au lieu de 1 `DATABASE_URL` |

---

## Migration v4.0 vers v4.5 : Systeme de Modules

### Changements majeurs

La version 4.5 a introduit un systeme de modules activables/desactivables qui controle la visibilite et l'acces aux fonctionnalites.

| Aspect | v4.0 | v4.5 |
|--------|------|------|
| Fonctionnalites | Toujours actives | Activables par module |
| Navigation | Statique | Dynamique (filtree par modules) |
| Routes API | Toujours accessibles | Bloquees si module desactive (403) |
| Configuration | Variables d'environnement | DB + Env + Default (3 niveaux) |

### Les 17 modules

Chaque fonctionnalite est enregistree comme module dans `api/core/modules.py` :

| Module ID | Nom | Ordre |
|-----------|-----|-------|
| `suppliers` | Fournisseurs | -2 |
| `imports` | Imports | -1 |
| `icecat` | Icecat Enrichment | 1 |
| `odoo_sync` | Odoo ERP Sync | 2 |
| `prestashop` | PrestaShop Sync | 3 |
| `amazon` | Amazon | 4 |
| `code2asin` | Code2ASIN | 5 |
| `ean_lookup` | EAN/Barcode Lookup | 6 |
| `ai_services` | AI Services | 7 |
| `ai_enrichment` | IA Enrichment | 8 |
| `exports` | Export Platform | 9 |
| `file_explorer` | File Explorer | 10 |
| `brand_manager` | Brand Manager | 11 |
| `category_manager` | Categories Manager | 12 |
| `completeness` | Completude Catalogue | 13 |
| `search_engine` | Moteur de Recherche | 14 |
| `price_monitor` | Price Monitor | 15 |

### Priorite de configuration (3 niveaux)

1. **Base de donnees** (priorite maximale) : Table `AppSetting` avec `category='modules'` dans `db_core`
2. **Variables d'environnement** : `MODULE_{ID}_ENABLED=true/false`
3. **Defaut** : Tous les modules actifs

### Etapes de migration

#### 1. Enregistrer les modules existants

Chaque module doit etre enregistre dans trois fichiers :

```python
# api/core/modules.py
class ModuleID(str, Enum):
    SUPPLIERS = "suppliers"
    IMPORTS = "imports"
    # ...

MODULE_REGISTRY = {
    ModuleID.SUPPLIERS: ModuleConfig(
        id=ModuleID.SUPPLIERS,
        name="Fournisseurs",
        description="Gestion des fournisseurs",
        icon="users",
        default_enabled=True,
        order=-2,
        routes=["/suppliers"]
    ),
    # ...
}
```

#### 2. Ajouter le ModuleGateMiddleware

Le middleware bloque automatiquement les requetes vers les routes de modules desactives :

```python
# core/middleware_setup.py
from middleware.module_gate import ModuleGateMiddleware
app.add_middleware(ModuleGateMiddleware)
```

#### 3. Mettre a jour la sidebar

```typescript
// frontend/components/PremiumSidebar.tsx
{
  label: "Fournisseurs",
  href: "/suppliers",
  icon: Users,
  moduleId: "suppliers"  // Nouveau : lie au systeme de modules
}
```

#### 4. Mettre a jour la Command Palette

```typescript
// frontend/components/CommandPalette.tsx
{
  label: "Fournisseurs",
  href: "/suppliers",
  moduleId: "suppliers"  // Nouveau : filtre par module actif
}
```

### Breaking changes v4.0 -> v4.5

| Changement | Impact | Action requise |
|------------|--------|----------------|
| ModuleGateMiddleware | Routes bloquees si module desactive | Enregistrer chaque module |
| useModules() hook | Sidebar dynamique | Ajouter `moduleId` aux items de navigation |
| API `/modules/status` | Nouveau endpoint public | Aucune (retrocompatible) |
| `MODULE_*_ENABLED` vars | Nouvelle configuration | Optionnel (defaut: tous actifs) |

---

## Procedures de sauvegarde

### Sauvegarde complete

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/${DATE}"
mkdir -p ${BACKUP_DIR}

# 1. Sauvegarder les 7 bases PostgreSQL
for db in staging_db_core staging_db_catalog staging_db_imports \
          staging_db_analytics staging_db_media staging_db_code2asin \
          staging_db_suppliers; do
    pg_dump -h postgres -U postgresuser -d ${db} \
      --format=custom > ${BACKUP_DIR}/${db}.dump
done

# 2. Sauvegarder MinIO
docker run --rm -v minio_data:/data -v ${BACKUP_DIR}:/backup alpine \
  tar czf /backup/minio_data.tar.gz /data

# 3. Sauvegarder la configuration
cp .env ${BACKUP_DIR}/env.backup
cp docker-compose.yml ${BACKUP_DIR}/

echo "Sauvegarde complete dans ${BACKUP_DIR}"
```

### Restauration

```bash
# Restaurer une base specifique
pg_restore -h postgres -U postgresuser -d staging_db_catalog \
  --clean --if-exists backup/staging_db_catalog.dump

# Restaurer MinIO
docker run --rm -v minio_data:/data -v $(pwd)/backup:/backup alpine \
  tar xzf /backup/minio_data.tar.gz -C /
```

{% callout type="danger" title="Test de restauration" %}
Testez regulierement vos procedures de restauration sur un environnement de staging avant toute migration en production.
{% /callout %}

---

## Checklist de migration

### Avant la migration

- [ ] Sauvegarde complete (bases + fichiers + config)
- [ ] Test de restauration sur environnement de test
- [ ] Communication aux utilisateurs (fenetre de maintenance)
- [ ] Verification de l'espace disque disponible
- [ ] Preparation des scripts de rollback

### Pendant la migration

- [ ] Arreter les services (frontend, API, workers)
- [ ] Executer les migrations Alembic
- [ ] Migrer les donnees par domaine
- [ ] Verifier l'integrite des donnees
- [ ] Redemarrer les services

### Apres la migration

- [ ] Verifier les endpoints critiques
- [ ] Tester l'authentification
- [ ] Verifier les imports/exports
- [ ] Monitorer les logs d'erreur pendant 24h
- [ ] Communiquer la fin de maintenance
