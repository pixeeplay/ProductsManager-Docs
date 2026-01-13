# Plan de Mise à Jour du Site Documentation
## ProductsManager-Docs - Décembre 2025

**Date:** 31 Décembre 2025
**Version Cible:** v4.5.12
**Analyse Complétée:** 5 agents d'analyse parallèles

---

## 1. Résumé Exécutif

### État Actuel du Site Docs

| Métrique | Valeur |
|----------|--------|
| Framework | Next.js 16.0.7, React 19 |
| Pages existantes | 24 pages |
| Système de contenu | Markdoc 0.5.2 |
| Recherche | FlexSearch |
| Thème | Dark/Light avec next-themes |
| Sécurité | 10/10 headers |

### Gap Analysis

| Domaine | État Actuel | Gap Identifié |
|---------|-------------|---------------|
| Getting Started | 3 pages | ✅ Complet |
| Features | 4 pages | ❌ Manque: Odoo, Code2ASIN, Thumbnails |
| API Reference | 3 pages | ❌ Manque: 150+ endpoints détaillés |
| User Guides | 3 pages | ❌ Manque: 9 guides dans l'app |
| Technical | 4 pages | ⚠️ Mise à jour multi-DB nécessaire |
| Integrations | 4 pages | ❌ Manque: Odoo, Amazon PA-API |
| Releases | 2 pages | ❌ Manque: v4.0.0 → v4.5.12 |

---

## 2. Nouvelles Pages à Créer

### 2.1 Section Features (Priorité Haute)

```
/src/app/docs/features/
├── odoo-integration/page.md      # NOUVEAU - Odoo ERP sync
├── code2asin/page.md             # NOUVEAU - Amazon ASIN mapping
├── thumbnails-system/page.md     # NOUVEAU - Media thumbnails
├── settings-persistence/page.md  # NOUVEAU - App settings
├── periodic-reports/page.md      # NOUVEAU - Reports feature
└── archive-support/page.md       # NOUVEAU - Import archives
```

**Contenu Clé:**

1. **Odoo Integration** (basé sur `/docs/odoo/`)
   - Configuration de connexion
   - Field mapping
   - Sync bidirectionnel
   - Scheduled syncs
   - 80 tests passés

2. **Code2ASIN**
   - Job management (8 tiles statistiques)
   - Amazon PA-API configuration
   - Image download automatique
   - Timeline d'exécution

3. **Thumbnail System** (v4.5.12)
   - 3 tailles: 150x150, 300x300, 800x800
   - UUID sharding (256 subdirectories)
   - API avec eager loading
   - Frontend utilities

### 2.2 Section API Reference (Priorité Haute)

```
/src/app/docs/api/
├── overview/page.md              # Restructurer
├── authentication/page.md        # Mettre à jour
├── rate-limiting/page.md         # NOUVEAU - 23 tiers documentés
├── permissions/page.md           # NOUVEAU - RBAC avec 25+ permissions
├── endpoints/
│   ├── products/page.md          # NOUVEAU - CRUD, bulk, search
│   ├── suppliers/page.md         # NOUVEAU - CRUD, history
│   ├── imports/page.md           # NOUVEAU - Jobs, configs, templates
│   ├── exports/page.md           # NOUVEAU - Platforms, schedules
│   ├── code2asin/page.md         # NOUVEAU - Jobs, mappings
│   ├── media/page.md             # NOUVEAU - Images, thumbnails
│   ├── analytics/page.md         # NOUVEAU - Dashboard, KPIs
│   ├── settings/page.md          # NOUVEAU - App settings
│   ├── admin/page.md             # NOUVEAU - User mgmt, audit
│   └── odoo/page.md              # NOUVEAU - Odoo sync
├── webhooks/page.md              # Mettre à jour
├── errors/page.md                # NOUVEAU - Error codes & handling
└── examples/page.md              # Mettre à jour avec plus d'exemples
```

### 2.3 Section User Guides (Priorité Moyenne)

```
/src/app/docs/user-guides/
├── getting-started/page.md       # Mettre à jour
├── products/page.md              # NOUVEAU - Product management
├── suppliers/page.md             # NOUVEAU - Supplier setup
├── imports/page.md               # NOUVEAU - Import workflows
├── exports/page.md               # NOUVEAU - Export configuration
├── ai-enrichment/page.md         # NOUVEAU - AI features
├── admin-panel/page.md           # NOUVEAU - Admin features
├── faq/page.md                   # NOUVEAU - From app docs
└── troubleshooting/page.md       # NOUVEAU - From app docs
```

### 2.4 Section Technical (Priorité Moyenne)

```
/src/app/docs/technical/
├── architecture/page.md          # Mettre à jour - 7 databases
├── database/page.md              # Mettre à jour - Multi-DB schema
├── deployment/page.md            # ✅ Actuel
├── security/page.md              # ✅ Actuel
├── performance/page.md           # NOUVEAU - Optimizations
├── caching/page.md               # NOUVEAU - L1 + Redis
├── media-storage/page.md         # NOUVEAU - MinIO, thumbnails
└── celery-tasks/page.md          # NOUVEAU - Background jobs
```

### 2.5 Section Integrations (Priorité Moyenne)

```
/src/app/docs/integrations/
├── odoo/page.md                  # Mettre à jour
├── amazon-pa-api/page.md         # NOUVEAU - Code2ASIN
├── minio/page.md                 # NOUVEAU - Object storage
├── shopify/page.md               # ✅ Actuel
├── prestashop/page.md            # ✅ Actuel
├── woocommerce/page.md           # ✅ Actuel
├── google-drive/page.md          # NOUVEAU - File imports
└── email-imports/page.md         # NOUVEAU - Gmail, IMAP
```

### 2.6 Section Releases (Priorité Haute)

```
/src/app/docs/releases/
├── changelog/page.md             # Mettre à jour - v4.5.12
├── v4.5.0/page.md                # NOUVEAU - Major release notes
├── v4.0.0/page.md                # NOUVEAU - EAN-centric architecture
├── v3.2.0/page.md                # ✅ Actuel
├── migration-guides/
│   ├── v3-to-v4/page.md          # NOUVEAU - Breaking changes
│   └── v4.0-to-v4.5/page.md      # NOUVEAU - Feature updates
└── roadmap/page.md               # NOUVEAU - 2026 roadmap
```

---

## 3. Pages à Mettre à Jour

### 3.1 Homepage (`/src/app/page.md`)

**Mises à jour requises:**
- Version: 4.5.12 (était v3.3.0)
- Health Score: 9.5/10 (était 83/100)
- Features highlights: Odoo, Code2ASIN, Thumbnails
- Quick links vers nouvelles sections

### 3.2 Introduction (`/docs/getting-started/introduction/page.md`)

**Mises à jour:**
- Architecture 7-database (était 5)
- RBAC avec 62 permissions (était 31)
- Nouvelles features v4.x
- Screenshots actualisés

### 3.3 Architecture (`/docs/technical/architecture/page.md`)

**Contenu à ajouter:**
- Diagramme C4 (from `/docs/architecture/diagrams/`)
- Multi-database routing
- UUID sharding explanation
- Service layer pattern
- Cross-DB linking strategy

### 3.4 Database (`/docs/technical/database/page.md`)

**Contenu à mettre à jour:**
```
7 Databases:
- db_core: Users, roles, permissions, app_settings, odoo_*
- db_catalog: Products, suppliers, categories (40+ tables)
- db_imports: Jobs, configs, schedules, templates
- db_analytics: Reports, report_history
- db_media: MediaFile, MediaThumbnail
- db_code2asin: Jobs, mappings
- db_suppliers: History, sourcing
```

### 3.5 API Authentication (`/docs/api/authentication/page.md`)

**Contenu à ajouter:**
- JWT flow diagram
- Account lockout (5 attempts = 15 min)
- Password reset flow
- CSRF token usage
- Code examples (Python, JavaScript, cURL)

---

## 4. Mise à Jour de la Navigation

### 4.1 Fichier: `/src/lib/navigation.ts`

```typescript
export const navigation = [
  {
    title: 'Getting Started',
    links: [
      { title: 'Introduction', href: '/docs/getting-started/introduction' },
      { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
    ],
  },
  {
    title: 'Features',
    links: [
      { title: 'Import Centralization', href: '/docs/features/import-centralisation' },
      { title: 'AI Enrichment', href: '/docs/features/ai-enrichment' },
      { title: 'EAN Manager', href: '/docs/features/ean-manager' },
      { title: 'Market Intelligence', href: '/docs/features/market-intelligence' },
      // NOUVELLES PAGES
      { title: 'Odoo Integration', href: '/docs/features/odoo-integration' },
      { title: 'Code2ASIN', href: '/docs/features/code2asin' },
      { title: 'Thumbnail System', href: '/docs/features/thumbnails-system' },
      { title: 'Settings Persistence', href: '/docs/features/settings-persistence' },
    ],
  },
  {
    title: 'User Guides',
    links: [
      { title: 'Getting Started', href: '/docs/user-guides/getting-started' },
      { title: 'Products', href: '/docs/user-guides/products' },
      { title: 'Suppliers', href: '/docs/user-guides/suppliers' },
      { title: 'Imports', href: '/docs/user-guides/imports' },
      { title: 'Exports', href: '/docs/user-guides/exports' },
      { title: 'AI Enrichment', href: '/docs/user-guides/ai-enrichment' },
      { title: 'Admin Panel', href: '/docs/user-guides/admin-panel' },
      { title: 'Dashboard', href: '/docs/user-guides/dashboard-usage' },
    ],
  },
  {
    title: 'API Reference',
    links: [
      { title: 'Overview', href: '/docs/api/overview' },
      { title: 'Authentication', href: '/docs/api/authentication' },
      { title: 'Rate Limiting', href: '/docs/api/rate-limiting' },
      { title: 'Permissions', href: '/docs/api/permissions' },
      { title: 'Endpoints', href: '/docs/api/endpoints' },
      { title: 'Webhooks', href: '/docs/api/webhooks' },
      { title: 'Error Handling', href: '/docs/api/errors' },
      { title: 'Code Examples', href: '/docs/api/examples' },
    ],
  },
  {
    title: 'Technical',
    links: [
      { title: 'Architecture', href: '/docs/technical/architecture' },
      { title: 'Database Schema', href: '/docs/technical/database' },
      { title: 'Performance', href: '/docs/technical/performance' },
      { title: 'Caching', href: '/docs/technical/caching' },
      { title: 'Media Storage', href: '/docs/technical/media-storage' },
      { title: 'Deployment', href: '/docs/technical/deployment' },
      { title: 'Security', href: '/docs/technical/security' },
    ],
  },
  {
    title: 'Integrations',
    links: [
      { title: 'Odoo ERP', href: '/docs/integrations/odoo' },
      { title: 'Amazon PA-API', href: '/docs/integrations/amazon-pa-api' },
      { title: 'MinIO Storage', href: '/docs/integrations/minio' },
      { title: 'Shopify', href: '/docs/integrations/shopify' },
      { title: 'PrestaShop', href: '/docs/integrations/prestashop' },
      { title: 'WooCommerce', href: '/docs/integrations/woocommerce' },
      { title: 'Email Imports', href: '/docs/integrations/email-imports' },
    ],
  },
  {
    title: 'FAQ & Support',
    links: [
      { title: 'FAQ', href: '/docs/support/faq' },
      { title: 'Troubleshooting', href: '/docs/support/troubleshooting' },
    ],
  },
  {
    title: 'Releases',
    links: [
      { title: 'Changelog', href: '/docs/releases/changelog' },
      { title: 'v4.5.x Notes', href: '/docs/releases/v4.5.0' },
      { title: 'v4.0.0 Notes', href: '/docs/releases/v4.0.0' },
      { title: 'Migration Guides', href: '/docs/releases/migration-guides' },
      { title: 'Roadmap 2026', href: '/docs/releases/roadmap' },
    ],
  },
]
```

---

## 5. Contenu Source (App Docs)

### 5.1 Documents à Migrer

| Source (App) | Destination (Docs Site) | Priorité |
|--------------|-------------------------|----------|
| `/docs/api/API_INTEGRATION_GUIDE.md` | `/docs/api/overview/` | Haute |
| `/docs/api/ENDPOINT_REFERENCE.md` | `/docs/api/endpoints/` | Haute |
| `/docs/api/CODE_EXAMPLES.md` | `/docs/api/examples/` | Haute |
| `/docs/user-guide/products.md` | `/docs/user-guides/products/` | Haute |
| `/docs/user-guide/imports.md` | `/docs/user-guides/imports/` | Haute |
| `/docs/user-guide/exports.md` | `/docs/user-guides/exports/` | Moyenne |
| `/docs/user-guide/suppliers.md` | `/docs/user-guides/suppliers/` | Moyenne |
| `/docs/user-guide/admin.md` | `/docs/user-guides/admin-panel/` | Moyenne |
| `/docs/user-guide/faq.md` | `/docs/support/faq/` | Moyenne |
| `/docs/user-guide/troubleshooting.md` | `/docs/support/troubleshooting/` | Moyenne |
| `/docs/architecture/ARCHITECTURE_OVERVIEW.md` | `/docs/technical/architecture/` | Haute |
| `/docs/architecture/DATABASE_SCHEMA.md` | `/docs/technical/database/` | Haute |
| `/docs/architecture/adr/` | `/docs/technical/adr/` | Basse |
| `/docs/odoo/ODOO_INTEGRATION_PLAN.md` | `/docs/features/odoo-integration/` | Haute |
| `/docs/releases/v4.x/*.md` | `/docs/releases/` | Haute |
| `/docs/ROADMAP_2026.md` | `/docs/releases/roadmap/` | Moyenne |

### 5.2 Statistiques Documentation App

```
Total: 533 fichiers markdown, 11 MB
- /docs/user-guide/: 9 fichiers (113 KB)
- /docs/api/: 6 fichiers (80 KB)
- /docs/architecture/: 27+ fichiers
- /docs/releases/: 40+ fichiers
- /docs/audits/: 12+ rapports
```

---

## 6. API Endpoints à Documenter

### 6.1 Routers Principaux (26+)

| Router | Prefix | Endpoints | Priorité |
|--------|--------|-----------|----------|
| auth_fixed | `/api/v1/auth` | 11 | Haute |
| users | `/api/v1/users` | 9 | Haute |
| products | `/api/v1/products` | 15+ | Haute |
| suppliers | `/api/v1/suppliers` | 12 | Haute |
| imports | `/api/v1/imports` | 20+ | Haute |
| exports | `/api/v1/exports` | 15 | Moyenne |
| code2asin | `/api/v1/code2asin` | 12 | Haute |
| media | `/api/v1/media` | 8 | Moyenne |
| analytics | `/api/v1/analytics` | 8 | Moyenne |
| dashboard | `/api/v1/dashboard` | 4 | Basse |
| settings | `/api/v1/settings` | 5 | Moyenne |
| odoo | `/api/v1/odoo-*` | 20+ | Haute |
| notifications | `/api/v1/notifications` | 10 | Basse |
| ai-providers | `/api/v1/ai-providers` | 12 | Moyenne |
| enrichment | `/api/v1/enrichment` | 6 | Moyenne |
| admin | `/api/v1/admin` | 15+ | Moyenne |

### 6.2 Permissions RBAC (25+)

```
Products: read:products, write:products, delete:products
Suppliers: read:suppliers, write:suppliers, delete:suppliers
Imports: read:imports, write:imports, delete:imports, start:imports, cancel:imports, manage:imports
Exports: read:exports, write:exports, manage:exports
Analytics: read:analytics
Cache: read:cache, write:cache, manage:cache
Media: read:media, write:media, delete:media
Files: read:files, write:files, upload:files
Code2ASIN: read:code2asin, write:code2asin, manage:code2asin
Templates: read:templates, write:templates, delete:templates
System: read:system, read:monitoring
```

### 6.3 Rate Limits (23 tiers)

| Tier | Limit | Usage |
|------|-------|-------|
| AUTH_LOGIN | 5/min | Brute force protection |
| BULK_IMPORT | 500/min | Data imports |
| BULK_EXPORT | 500/min | Data exports |
| WRITE_STANDARD | 100/min | POST/PUT/DELETE |
| READ_STANDARD | 1000/min | GET operations |
| AI_SINGLE | 20/min | AI enrichment |
| AI_BATCH | 1/hour | Batch AI jobs |

---

## 7. Frontend Features à Documenter

### 7.1 Pages Principales (50+)

| Page | Route | Priorité Doc |
|------|-------|--------------|
| Products List | `/products` | Haute |
| Product Detail | `/products/[id]` | Haute |
| Suppliers | `/suppliers` | Haute |
| Imports Dashboard | `/imports` | Haute |
| Import Wizard | `/imports/new` | Haute |
| Exports | `/exports` | Moyenne |
| Code2ASIN | `/code2asin` | Haute |
| Odoo Sync | `/odoo-sync` | Haute |
| AI Enrichment | `/ai-enrichment` | Moyenne |
| EAN Lookup | `/ean-lookup` | Moyenne |
| Settings | `/settings` | Moyenne |
| Admin Users | `/admin/users` | Moyenne |
| Dashboard | `/dashboard` | Haute |
| Analytics | `/analytics` | Basse |

### 7.2 Composants Clés

- `ProductCard` - Affichage produit avec thumbnails
- `ProductFilters` - Filtres avancés (has_asin, in_stock, etc.)
- `ColumnMegaMenu` - Sélection colonnes table
- `ImportProgress` - Progression import en temps réel
- `PremiumDataTable` - Table avec TanStack
- `PremiumSidebar` - Navigation principale
- `ProductImageGallery` - Galerie images e-commerce

---

## 8. Plan d'Exécution

### Phase 1: Fondations (Semaine 1-2)

**Priorité: Haute**

1. ☐ Mettre à jour homepage (version 4.5.12, features)
2. ☐ Mettre à jour introduction (7-DB, 62 permissions)
3. ☐ Créer `/docs/api/rate-limiting/page.md`
4. ☐ Créer `/docs/api/permissions/page.md`
5. ☐ Mettre à jour `/docs/api/authentication/page.md`
6. ☐ Mettre à jour navigation.ts

### Phase 2: Features Nouvelles (Semaine 2-3)

**Priorité: Haute**

1. ☐ Créer `/docs/features/odoo-integration/page.md`
2. ☐ Créer `/docs/features/code2asin/page.md`
3. ☐ Créer `/docs/features/thumbnails-system/page.md`
4. ☐ Mettre à jour `/docs/integrations/odoo/page.md`
5. ☐ Créer `/docs/integrations/amazon-pa-api/page.md`

### Phase 3: User Guides (Semaine 3-4)

**Priorité: Moyenne**

1. ☐ Créer `/docs/user-guides/products/page.md`
2. ☐ Créer `/docs/user-guides/suppliers/page.md`
3. ☐ Créer `/docs/user-guides/imports/page.md`
4. ☐ Créer `/docs/user-guides/exports/page.md`
5. ☐ Créer `/docs/user-guides/ai-enrichment/page.md`
6. ☐ Créer `/docs/support/faq/page.md`
7. ☐ Créer `/docs/support/troubleshooting/page.md`

### Phase 4: API Reference Complète (Semaine 4-5)

**Priorité: Haute**

1. ☐ Créer pages par endpoint (products, suppliers, imports, etc.)
2. ☐ Ajouter exemples code (Python, JavaScript, cURL)
3. ☐ Créer `/docs/api/errors/page.md`
4. ☐ Mettre à jour `/docs/api/webhooks/page.md`

### Phase 5: Technical & Architecture (Semaine 5-6)

**Priorité: Moyenne**

1. ☐ Mettre à jour `/docs/technical/architecture/page.md` avec C4
2. ☐ Mettre à jour `/docs/technical/database/page.md` (7 DBs)
3. ☐ Créer `/docs/technical/performance/page.md`
4. ☐ Créer `/docs/technical/caching/page.md`
5. ☐ Créer `/docs/technical/media-storage/page.md`

### Phase 6: Release Notes & Roadmap (Semaine 6)

**Priorité: Moyenne**

1. ☐ Mettre à jour changelog (v4.0.0 → v4.5.12)
2. ☐ Créer pages release notes (v4.0.0, v4.5.0)
3. ☐ Créer `/docs/releases/migration-guides/`
4. ☐ Créer `/docs/releases/roadmap/page.md` (2026)

---

## 9. Métriques de Succès

### Objectifs

| Métrique | Actuel | Cible |
|----------|--------|-------|
| Pages totales | 24 | 50+ |
| Coverage API | ~30% | 90%+ |
| User Guides | 3 | 9+ |
| Features documentées | 4 | 10+ |
| Integrations | 4 | 8+ |
| Release Notes | 2 | 10+ |
| FAQ entries | 0 | 20+ |

### Qualité

- [ ] Tous les endpoints API documentés avec exemples
- [ ] Screenshots actualisés (v4.5.12)
- [ ] Navigation cohérente et intuitive
- [ ] Recherche fonctionnelle sur tout le contenu
- [ ] Mobile responsive vérifié
- [ ] Liens internes vérifiés (pas de 404)

---

## 10. Ressources

### Sources de Contenu

- `/home/productsmanager/ProductsManager-App/docs/` - 533 fichiers, 11 MB
- `/home/productsmanager/ProductsManager-App/api/` - Code source backend
- `/home/productsmanager/ProductsManager-App/frontend/` - Code source frontend
- `/home/productsmanager/ProductsManager-App/CLAUDE.md` - Context file

### Outils

- Markdoc pour le contenu
- FlexSearch pour la recherche
- Mermaid pour les diagrammes
- Prism pour le syntax highlighting

---

**Document généré le:** 31 Décembre 2025
**Par:** Claude Analysis Agents (5 agents parallèles)
**Pour:** ProductsManager v4.5.12
