---
title: Changelog
nextjs:
  metadata:
    title: Changelog - Products Manager
    description: Historique complet des versions et changements de Products Manager
---

Tous les changements notables de Products Manager sont documentés sur cette page. {% .lead %}

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Versions récentes

### [v3.3.0](/docs/releases/v3-3-0) - Octobre 2025

🚀 **Frontend Excellence & Test Coverage Release**

- ✨ Frontend test coverage +483% (12% → 70%)
- ✨ Bundle size -83.7% (2.4 MB → 391 KB)
- ✨ RBAC coverage 93.4% avec tests complets
- ✨ 15 composite indexes pour optimisation requêtes
- ✨ Error boundaries React pour isolation erreurs
- ✨ Lazy loading optimisé
- 🔧 Dashboard load time : 850ms → 45ms (-95%)
- 🔧 API p95 latency < 370ms
- 🔒 0 CVE critiques
- 📊 Health Score: 83/100

[Voir les notes complètes →](/docs/releases/v3-3-0)

---

### [v3.2.0](/docs/releases/v3-2-0) - 2 Octobre 2025

🔒 **Performance & Security Release**

- ✨ Système RBAC complet (4 rôles, 31 permissions)
- ✨ 15 index composites pour optimisation base de données
- ✨ 4 Error Boundaries frontend pour isolation erreurs
- ✨ Lazy loading de react-markdown (-45KB bundle)
- 🔧 CATALOG_POOL_SIZE augmenté (25 → 30)
- 🔧 Build ID stable (fin du cache busting aléatoire)
- 🔧 Protection routes /admin/* avec permissions granulaires
- 🔧 Eager loading optimisé (N+1 queries fixés)
- 🚀 Requêtes lentes -85% (16,370/jour → 2,455/jour)
- 🚀 Latence API -80% (1,850ms → 370ms p95)
- 🚀 Bundle frontend -45KB
- 🔐 12 routes admin protégées par RBAC
- 🔐 31 permissions granulaires

[Voir les notes complètes →](/docs/releases/v3-2-0)

---

### [v2.0.0] - 18 Septembre 2025

🎉 **Architecture Multi-DB - Nouvelle Version Majeure**

- ✨ Architecture Multi-DB avec 5 bases PostgreSQL spécialisées
  - `db_catalog` : Catalogue produits et fournisseurs
  - `db_media` : Gestion médias et fichiers
  - `db_imports` : Jobs et historique imports
  - `db_code2asin` : Mapping codes vers ASIN
  - `db_analytics` : Métriques et analyses
- ✨ 12 Buckets MinIO pour stockage organisé
- ✨ Database Router intelligent avec mapping automatique
- ✨ Database Optimizer (1545 lignes) pour performance
- ✨ Cache Service complet avec Redis
- ✨ Support Français : locale fr_FR.UTF-8, timezone Europe/Paris
- ✨ 45+ Modèles ORM avec `__bind_key__` pour routing
- 🔧 Migration complète de 133,149 produits
- 🔧 Refactoring modèles avec séparation par domaine
- 🐛 Import Decimal depuis sqlalchemy.sql.sqltypes
- 🐛 Attribut metadata renommé en meta_data
- 🐛 Erreur Sentry FastApiIntegration corrigée

---

### [v1.5.0] - 15 Août 2025

✨ **Interface Next.js 14 & WebSocket**

- ✨ Interface Next.js 14 avec TypeScript
- ✨ Dashboard temps réel
- ✨ WebSocket pour notifications
- ✨ Export multi-format (CSV, Excel, JSON)
- 🔧 API REST refactorisée avec FastAPI
- 🔧 Performances import améliorées (3x plus rapide)
- 🐛 Problèmes encodage UTF-8 corrigés
- 🐛 Gestion mémoire sur gros fichiers optimisée
- 🐛 Timeout sur imports volumineux résolu

---

### [v1.0.0] - 1 Juin 2025

🎉 **Version Initiale - Production Ready**

- ✨ Import CSV/Excel basique
- ✨ Mapping manuel des colonnes
- ✨ Gestion mono-fournisseur
- ✨ API REST simple
- ✨ Interface web basique
- ✨ Stockage PostgreSQL unique
- ✨ Upload fichiers local
- 📚 Documentation README
- 📚 Guide installation Docker
- 📚 Guide utilisateur

---

## Versions Beta & Alpha

### [v0.5.0-beta] - 15 Avril 2025

🧪 **Beta Release**

- POC fonctionnel
- Tests sur données réelles
- Feedback utilisateurs collectés

### [v0.1.0-alpha] - 1 Mars 2025

🚧 **Alpha Release**

- Structure projet initiale
- Import CSV simple
- Tests basiques

---

## Types de changements

Les changements sont catégorisés selon les conventions suivantes :

- **✨ Added** : Nouvelles fonctionnalités
- **🔧 Changed** : Changements dans fonctionnalités existantes
- **⚠️ Deprecated** : Fonctionnalités qui seront supprimées
- **🗑️ Removed** : Fonctionnalités supprimées
- **🐛 Fixed** : Corrections de bugs
- **🔒 Security** : Corrections de vulnérabilités
- **🚀 Performance** : Améliorations de performance
- **📚 Documentation** : Mises à jour documentation

---

## Semantic Versioning

Products Manager suit le [Semantic Versioning 2.0.0](https://semver.org/) :

- **MAJOR (X.0.0)** : Changements incompatibles avec l'API
- **MINOR (0.X.0)** : Ajout de fonctionnalités rétrocompatibles
- **PATCH (0.0.X)** : Corrections de bugs rétrocompatibles

---

## Roadmap

### v3.4.0 - Prévue Q4 2025

Fonctionnalités planifiées :

- [ ] Sécurisation complète des secrets (Vault integration)
- [ ] Connection pooling optimisé (monitoring avancé)
- [ ] Suite de tests étendue (>85% coverage)
- [ ] Monitoring complet (Prometheus/Grafana)
- [ ] Performance améliorée (API p95 <200ms)
- [ ] GraphQL API (optionnel)
- [ ] Synchronisation multi-canaux (Amazon, eBay)
- [ ] Module AI avancé (classification automatique produits)

### v4.0.0 - Prévue Q1 2026

Breaking changes et refonte majeure :

- [ ] Architecture microservices
- [ ] Event sourcing pour audit complet
- [ ] Support multi-tenant
- [ ] API GraphQL native
- [ ] Interface mobile (iOS/Android)
- [ ] Internationalisation complète (i18n)

---

## Support des versions

| Version | Statut | Support jusqu'à | Notes |
|---------|--------|----------------|-------|
| **v3.3.0** | ✅ Stable | Oct 2026 | Version actuelle |
| **v3.2.0** | ✅ Stable | Oct 2026 | LTS |
| **v3.1.0** | ⚠️ Obsolète | Immédiat | Migrer vers v3.2.0+ |
| **v2.0.0** | ⚠️ Obsolète | Jan 2026 | Migrer vers v3.x |
| **v1.x** | ❌ Non supporté | - | Migration obligatoire |

### Politique de support

- **Stable** : Support complet (bugs, sécurité, features)
- **LTS (Long Term Support)** : Support sécurité uniquement (2 ans)
- **Obsolète** : Support limité (bugs critiques uniquement)
- **Non supporté** : Aucun support, migration obligatoire

---

## Migration

### De v3.2.0 vers v3.3.0

Aucun breaking change. Migration automatique :

```bash
git pull origin main
git checkout v3.3.0
cd api && alembic upgrade head
docker-compose restart
```

### De v3.1.0 vers v3.2.0

Migration Alembic requise (005 & 006) :

```bash
cd api
alembic upgrade head
# Applique migrations 005 (indexes) et 006 (RBAC)
```

Voir [Guide de migration v3.2.0](/docs/releases/v3-2-0#installation--upgrade)

### De v2.0.0 vers v3.x

Migration majeure avec changements de schéma. Consulter la documentation dédiée.

---

## Historique complet

Pour l'historique complet des commits et changements détaillés, consultez :

- **GitHub Releases** : [https://github.com/pixeeplay/Products-Manager/releases](https://github.com/pixeeplay/Products-Manager/releases)
- **Changelog source** : [CHANGELOG.md](https://github.com/pixeeplay/Products-Manager/blob/main/CHANGELOG.md)
- **Pull Requests** : [https://github.com/pixeeplay/Products-Manager/pulls](https://github.com/pixeeplay/Products-Manager/pulls)

---

## Newsletter

Recevez les notifications de nouvelles versions :

- **Email** : Abonnez-vous à [releases@productsmanager.com](mailto:releases@productsmanager.com?subject=Subscribe)
- **RSS Feed** : [https://github.com/pixeeplay/Products-Manager/releases.atom](https://github.com/pixeeplay/Products-Manager/releases.atom)
- **Twitter** : [@ProductsManager](https://twitter.com/ProductsManager)

---

## Contribuer

Vous avez trouvé un bug ou souhaitez proposer une fonctionnalité ?

- **Issues** : [https://github.com/pixeeplay/Products-Manager/issues](https://github.com/pixeeplay/Products-Manager/issues)
- **Discussions** : [https://github.com/pixeeplay/Products-Manager/discussions](https://github.com/pixeeplay/Products-Manager/discussions)
- **Email** : [support@productsmanager.com](mailto:support@productsmanager.com)
