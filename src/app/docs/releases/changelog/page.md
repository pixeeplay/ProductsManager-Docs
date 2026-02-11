---
title: Changelog
nextjs:
  metadata:
    title: Changelog - Products Manager
    description: Historique complet des versions et changements de Products Manager
---

Tous les changements notables de Products Manager sont documentes sur cette page. {% .lead %}

Le format est base sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhere au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Versions recentes

### [v4.5.58] - 11 Fevrier 2026

**Sprint 9 : 100% Tests Backend**

- Correction des 25 derniers echecs de tests backend
- **8 553 tests passent, 0 echecs (100%)**
- 2 bugfixes production supplementaires
- Mise a jour audit et tracking de couverture

---

### [v4.5.56] - Fevrier 2026

**Sprint 7+8 : Tests Backend + Refactoring Frontend**

- 290 nouveaux tests backend (5 services)
- Refactoring 87 fichiers tests frontend (MSW vers vi.fn())
- 8 278 tests frontend passent (100%)
- 96 echecs backend repares (Sprint 8)
- 5 bugfixes production (Sprint 8)

---

### [v4.5.55] - Janvier 2026

**Sprint 6 : Tests Services Backend**

- 409 tests pour 7 services backend (settings, completeness, reports, search, batch enrichment, PrestaShop, Odoo)
- Couverture tests etendue

---

### [v4.5.54] - Janvier 2026

**Sprint 5 : Tests Frontend Composants**

- 76 tests frontend (PremiumSidebar + PremiumDataTable)
- Amelioration couverture composants critiques

---

### [v4.5.53] - Janvier 2026

**Sprint 4 : Tests Pipeline Import/Export**

- 169 tests pipeline import/export
- Tests orchestrator, job service, error archive, EAN lookup

---

### [v4.5.52] - Janvier 2026

**Sprint 3 : Tests Cache & Performance**

- 153 tests cache et performance
- Tests warming, invalidation, transaction, L1, slow query
- Bugfix Lock vers RLock

---

### [v4.5.51] - Janvier 2026

**Sprint 2 : Tests Securite Backend**

- 178 tests securite backend
- Tests account lockout, permissions, password reset, alertes, email

---

### [v4.5.50] - Janvier 2026

**Sprint 1 Complet : Corrections Tests**

- Correction 29 fichiers tests supplementaires (lib/, hooks/, backend)
- ScheduleManager null-safety

---

### [v4.5.49] - Janvier 2026

**Sprint 1 : Corrections Tests + Celery Beat**

- 22 fichiers corriges, 1052 tests
- Fiabilite Celery Beat amelioree

---

### [v4.5.48] - Janvier 2026

**Demos Connectees : Reports + Batch Enrichment**

- ReportsManager/ReportBuilder (CRUD + generation multi-DB)
- BatchEnrichmentPanel (batch reel + pause/resume)

---

### [v4.5.47] - Janvier 2026

**Demos Connectees : AI Dashboard + KPI + Export**

- AIDashboard connecte (ai_usage_logs)
- KPICards (multi-DB)
- ExportProductDialog (produits API + export reel)

---

### [v4.5.46] - Janvier 2026

**AI Enrichment : Moteur Reel Connecte**

- Moteur d enrichissement IA reel connecte (OpenAI/Anthropic)
- Batch asynchrone avec suivi budgetaire
- Module AI Enrichment separe

---

### [v4.5.45] - Decembre 2025

**Auto-Rules : Pipeline Import**

- Auto-complete HT/TTC dans pipeline import
- Auto-conversion unites/devises

---

### [v4.5.44] - Decembre 2025

**Computed Attributes : Mapping Templates**

- Attributs calcules dans mapping templates
- Command Palette width fix

---

### [v4.5.43] - Decembre 2025

**Audit Mock/Demo : Cleanup Frontend**

- Cleanup 15 composants frontend
- Wizard fournisseur fixes
- Bannieres demo

---

### [v4.5.42] - Decembre 2025

**Price Monitor : Surveillance Prix Concurrents**

- Module Price Monitor complet (SerpAPI/SearXNG)
- Tiers de surveillance (4h/24h/7j)
- File de validation prix
- 15 endpoints sous /api/v1/prices

---

### [v4.5.41] - Decembre 2025

**Cleanup Repository**

- Archive fichiers obsoletes
- Reorganisation scripts et docs

---

### [v4.5.40] - Decembre 2025

**Search Engine : Meilisearch**

- Integration Meilisearch (moteur de recherche full-text)
- SearchBar dans le header
- Module search_engine activable
- Fallback PostgreSQL ILIKE

---

### [v4.5.39] - Decembre 2025

**UX/UI : Sidebar + Command Palette + Performance**

- Sidebar compacte + icons-only mode
- Command Palette (~55 entrees)
- Optimisation performance
- Module completude catalogue

---

### [v4.5.38] - Decembre 2025

**Completude Catalogue**

- Scoring fixes + ASIN/cost_price
- Frontend completude

---

### [v4.5.36] - Decembre 2025

**MCP Servers**

- 8 serveurs MCP, 42 outils pour agents IA
- Categories (6), Icecat (5), Brands (7), AI (6), Products (5), Suppliers (5), Code2ASIN (4), Imports (4)

---

### [v4.5.35] - Decembre 2025

**Categories Manager + PrestaShop/Security**

- Categories Manager complet
- Corrections PrestaShop et securite

---

### [v4.5.34] - Decembre 2025

**Import System Fixes + EAN**

- Corrections systeme d import
- Gestion EAN float (defense-in-depth)

---

### [v4.5.33] - Decembre 2025

**Brand Manager**

- Harmonisation de marques, aliases, doublons, fusion
- Interface complete de gestion des marques

---


### [v4.5.12](/docs/releases/v4-5-0) - 30 Decembre 2025

**Performance & Scalability Release**

- UUID Prefix Sharding for Media Files (256 subdirectories)
- Thumbnail System Implementation (small/medium/large)
- API Thumbnail Support with eager loading
- Frontend thumbnail integration in ProductCard
- Scalability for 200k+ products

[Voir les notes completes v4.5.x](/docs/releases/v4-5-0)

---

### [v4.5.8](/docs/releases/v4-5-0) - 17 Decembre 2025

**Quick Wins Release**

- EAN Lookup: API endpoints pour configuration providers (EAN-Search, Barcode Lookup, Go-UPC)
- Password Reset: Reinitialisation par email avec token securise (15 min, usage unique)
- Export Imports: Export CSV des jobs d'import avec filtres
- Thumbnails: Task Celery generation automatique (150x150, 300x300, 800x800)
- EAN Lookup: Refonte page avec tuiles colorees et config providers

---

### [v4.5.7](/docs/releases/v4-5-0) - 17 Decembre 2025

**Code2ASIN Enhancement Release**

- Code2ASIN: Images stockees dans Media System (MinIO)
- Page details Code2ASIN amelioree (8 statistiques, timeline, tabs)
- Export CSV des resultats Code2ASIN
- Exports: MinIO comme destination (remplace Odoo direct)
- PremiumSidebar: Correction chevron duplique

---

### [v4.5.6](/docs/releases/v4-5-0) - 16 Decembre 2025

**Odoo Integration Complete**

- Integration Odoo complete avec 80 tests
- Schemas Pydantic separes (`api/schemas/odoo.py`)
- Full API REST: Config, sync, import, mappings, schedules, logs
- Celery Tasks: process_scheduled_odoo_syncs, bulk_sync_to_odoo

---

### [v4.5.5](/docs/releases/v4-5-0) - 16 Decembre 2025

**Settings & Notifications Release**

- Persistence settings en base de donnees (app_settings)
- Notifications globales imports
- Filtres produits complets (has_asin, has_price, in_stock, etc.)
- Support archives imports (.gz, .zip)
- Rapports periodiques

---

### [v4.5.0](/docs/releases/v4-5-0) - 10 Decembre 2025

**Google Drive Integration Release**

- Integration Google Drive complete (OAuth 2.0)
- Import supplier files depuis Google Drive
- Export product catalogs vers Google Drive
- Token management avec automatic refresh

[Voir les notes completes v4.5.x](/docs/releases/v4-5-0)

---

### [v4.4.0] - 7 Decembre 2025

**Email & Code2ASIN Release**

- Email Service unifie (SMTP/SendGrid/SES)
- Code2ASIN pause/resume fonctionnel
- Fill Mode avec DB lookup
- GZip Middleware compression
- Technical Debt: 49 -> 3 TODO/FIXME (-94%)
- Score global: 9.4/10 -> 9.5/10

---

### [v4.3.2] - 7 Decembre 2025

**Quality & Testing Release**

- 12 rapports d'audit complets
- Frontend test coverage: 25% -> 70%
- TypeScript strict mode active
- Score global: 9.4/10 (Grade A+)
- Bundle optimise -40%

---

### [v4.0.0] - 17 Novembre 2025

**Major Architecture Release - EAN-Centric**

- EAN obligatoire - Identifiant metier unique normalise (13 chiffres)
- Architecture normalisee - Multi-fournisseurs via junction table
- Base nettoyee - 135,242 produits migres, backups crees
- Imports optimises - Logique EAN-centrique avec gestion produits sans EAN
- Architecture Multi-DB (7 bases PostgreSQL)
- RBAC complet (62 permissions, 4 roles)

#### Breaking Changes

1. **Colonnes supprimees**:
   - `products.sku` -> Utiliser `supplier_products.supplier_sku`
   - `products.supplier_id` -> Utiliser junction table `supplier_products`

2. **Contraintes ajoutees**:
   - `products.ean` : Maintenant **NOT NULL** et **UNIQUE**
   - Format EAN strict : 8 ou 13 chiffres uniquement

3. **Migration code**:
   - Code Python accedant a `product.sku` -> Migrer vers `supplier_product.supplier_sku`
   - Code SQL avec `WHERE sku = ?` -> Migrer vers `WHERE ean = ?`

#### Migration Guide

```bash
# Standard upgrade
git pull origin main

# Docker deployment
docker-compose down
docker-compose up -d --build
```

---

### [v3.3.0](/docs/releases/v3-3-0) - Octobre 2025

**Frontend Excellence & Test Coverage Release**

- Frontend test coverage +483% (12% -> 70%)
- Bundle size -83.7% (2.4 MB -> 391 KB)
- RBAC coverage 93.4% avec tests complets
- 15 composite indexes pour optimisation requetes
- Error boundaries React pour isolation erreurs
- Lazy loading optimise
- Dashboard load time : 850ms -> 45ms (-95%)
- API p95 latency < 370ms
- 0 CVE critiques
- Health Score: 83/100

[Voir les notes completes](/docs/releases/v3-3-0)

---

### [v3.2.0](/docs/releases/v3-2-0) - 2 Octobre 2025

**Performance & Security Release**

- Systeme RBAC complet (4 roles, 31 permissions)
- 15 index composites pour optimisation base de donnees
- 4 Error Boundaries frontend pour isolation erreurs
- Lazy loading de react-markdown (-45KB bundle)
- CATALOG_POOL_SIZE augmente (25 -> 30)
- Build ID stable (fin du cache busting aleatoire)
- Protection routes /admin/* avec permissions granulaires
- Eager loading optimise (N+1 queries fixes)
- Requetes lentes -85% (16,370/jour -> 2,455/jour)
- Latence API -80% (1,850ms -> 370ms p95)
- Bundle frontend -45KB
- 12 routes admin protegees par RBAC
- 31 permissions granulaires

[Voir les notes completes](/docs/releases/v3-2-0)

---

### [v2.0.0] - 18 Septembre 2025

**Architecture Multi-DB - Nouvelle Version Majeure**

- Architecture Multi-DB avec 5 bases PostgreSQL specialisees
  - `db_catalog` : Catalogue produits et fournisseurs
  - `db_media` : Gestion medias et fichiers
  - `db_imports` : Jobs et historique imports
  - `db_code2asin` : Mapping codes vers ASIN
  - `db_analytics` : Metriques et analyses
- 12 Buckets MinIO pour stockage organise
- Database Router intelligent avec mapping automatique
- Database Optimizer (1545 lignes) pour performance
- Cache Service complet avec Redis
- Support Francais : locale fr_FR.UTF-8, timezone Europe/Paris
- 45+ Modeles ORM avec `__bind_key__` pour routing
- Migration complete de 133,149 produits
- Refactoring modeles avec separation par domaine

---

### [v1.5.0] - 15 Aout 2025

**Interface Next.js 14 & WebSocket**

- Interface Next.js 14 avec TypeScript
- Dashboard temps reel
- WebSocket pour notifications
- Export multi-format (CSV, Excel, JSON)
- API REST refactorisee avec FastAPI
- Performances import ameliorees (3x plus rapide)
- Problemes encodage UTF-8 corriges
- Gestion memoire sur gros fichiers optimisee
- Timeout sur imports volumineux resolu

---

### [v1.0.0] - 1 Juin 2025

**Version Initiale - Production Ready**

- Import CSV/Excel basique
- Mapping manuel des colonnes
- Gestion mono-fournisseur
- API REST simple
- Interface web basique
- Stockage PostgreSQL unique
- Upload fichiers local
- Documentation README
- Guide installation Docker
- Guide utilisateur

---

## Versions Beta & Alpha

### [v0.5.0-beta] - 15 Avril 2025

**Beta Release**

- POC fonctionnel
- Tests sur donnees reelles
- Feedback utilisateurs collectes

### [v0.1.0-alpha] - 1 Mars 2025

**Alpha Release**

- Structure projet initiale
- Import CSV simple
- Tests basiques

---

## Types de changements

Les changements sont categorises selon les conventions suivantes :

- **Added** : Nouvelles fonctionnalites
- **Changed** : Changements dans fonctionnalites existantes
- **Deprecated** : Fonctionnalites qui seront supprimees
- **Removed** : Fonctionnalites supprimees
- **Fixed** : Corrections de bugs
- **Security** : Corrections de vulnerabilites
- **Performance** : Ameliorations de performance
- **Documentation** : Mises a jour documentation

---

## Semantic Versioning

Products Manager suit le [Semantic Versioning 2.0.0](https://semver.org/) :

- **MAJOR (X.0.0)** : Changements incompatibles avec l'API
- **MINOR (0.X.0)** : Ajout de fonctionnalites retrocompatibles
- **PATCH (0.0.X)** : Corrections de bugs retrocompatibles

---

## Roadmap

### v4.6.0 - Prevue Q1 2026

Fonctionnalites planifiees :

- [ ] Phase 2 Recherche : Qdrant (recherche semantique)
- [ ] Frontend Password Reset Page
- [ ] EAN Lookup provider integration
- [ ] Import Export Filters UI
- [ ] Brand Manager: Odoo brand import

### v5.0.0 - Prevue Q2 2026

Breaking changes et refonte majeure :

- [ ] Architecture microservices
- [ ] Event sourcing pour audit complet
- [ ] Support multi-tenant
- [ ] API GraphQL native
- [ ] Interface mobile (iOS/Android)
- [ ] Internationalisation complete (i18n)

---

## Support des versions

| Version | Statut | Support jusqu'a | Notes |
|---------|--------|----------------|-------|
| **v4.5.58** | Stable | Dec 2026 | Version actuelle |
| **v4.0.0** | Stable | Dec 2026 | LTS |
| **v3.3.0** | Obsolete | Mar 2026 | Migrer vers v4.x |
| **v3.2.0** | Obsolete | Jan 2026 | Migrer vers v4.x |
| **v2.0.0** | Non supporte | - | Migration obligatoire |
| **v1.x** | Non supporte | - | Migration obligatoire |

### Politique de support

- **Stable** : Support complet (bugs, securite, features)
- **LTS (Long Term Support)** : Support securite uniquement (2 ans)
- **Obsolete** : Support limite (bugs critiques uniquement)
- **Non supporte** : Aucun support, migration obligatoire

---

## Migration

### De v4.0.0 vers v4.5.x

Aucun breaking change. Migration automatique :

```bash
git pull origin main
git checkout v4.5.58
cd api && alembic upgrade head
docker-compose restart
```

### De v3.x vers v4.0.0

Migration majeure avec changements de schema :

1. **Backup** : Sauvegarder la base de donnees
2. **Code** : Mettre a jour les references `product.sku` vers `supplier_product.supplier_sku`
3. **SQL** : Mettre a jour les requetes `WHERE sku = ?` vers `WHERE ean = ?`
4. **Deploy** : Deployer et executer les migrations

```bash
git pull origin main
alembic upgrade head
```

### De v3.1.0 vers v3.2.0

Migration Alembic requise (005 & 006) :

```bash
cd api
alembic upgrade head
# Applique migrations 005 (indexes) et 006 (RBAC)
```

---

## Historique complet

Pour l'historique complet des commits et changements detailles, consultez :

- **GitHub Releases** : [https://github.com/pixeeplay/Products-Manager/releases](https://github.com/pixeeplay/Products-Manager/releases)
- **Changelog source** : [CHANGELOG.md](https://github.com/pixeeplay/Products-Manager/blob/main/CHANGELOG.md)
- **Pull Requests** : [https://github.com/pixeeplay/Products-Manager/pulls](https://github.com/pixeeplay/Products-Manager/pulls)

---

## Newsletter

Recevez les notifications de nouvelles versions :

- **Email** : Abonnez-vous a [releases@productsmanager.com](mailto:releases@productsmanager.com?subject=Subscribe)
- **RSS Feed** : [https://github.com/pixeeplay/Products-Manager/releases.atom](https://github.com/pixeeplay/Products-Manager/releases.atom)

---

## Contribuer

Vous avez trouve un bug ou souhaitez proposer une fonctionnalite ?

- **Issues** : [https://github.com/pixeeplay/Products-Manager/issues](https://github.com/pixeeplay/Products-Manager/issues)
- **Discussions** : [https://github.com/pixeeplay/Products-Manager/discussions](https://github.com/pixeeplay/Products-Manager/discussions)
- **Email** : [support@productsmanager.com](mailto:support@productsmanager.com)
