---
title: Introduction
nextjs:
  metadata:
    title: Introduction - Products Manager APP
    description: "Découvrez Products Manager APP, la plateforme tout-en-un pour gérer vos données produits e-commerce."
---

Bienvenue dans Products Manager APP - votre solution complète pour **centraliser les imports fournisseurs**, **enrichir vos produits avec l’IA**, et **optimiser votre gestion e-commerce**. {% .lead %}

---

## Qu’est-ce que Products Manager APP ?

Products Manager APP est une plateforme SaaS conçue pour les e-commerçants qui souhaitent automatiser et optimiser la gestion de leurs données produits.

### Fonctionnalités Principales

**Centralisation des Imports**
- Importez automatiquement vos catalogues fournisseurs depuis Excel, CSV, FTP, ou API
- [En savoir plus →](/docs/features/import-centralisation)

**Enrichissement IA**
- Générez descriptions, titres SEO et attributs produits automatiquement avec l’IA (OpenAI, Anthropic)
- Moteur réel connecté avec traitement batch, pause/resume et suivi budgétaire
- [En savoir plus →](/docs/features/ai-enrichment)

**Gestionnaire EAN**
- Recherchez et associez les codes EAN/ASIN Amazon en un clic
- [En savoir plus →](/docs/features/ean-manager)

**Market Intelligence**
- Surveillez les prix concurrents et optimisez vos marges en temps réel (SerpAPI + SearXNG)
- [En savoir plus →](/docs/features/market-intelligence)

**17 Modules Activables**
- Fournisseurs, Imports, Icecat, Odoo ERP, PrestaShop, Amazon, Code2ASIN, EAN Lookup, AI Services, IA Enrichment, Exports, File Explorer, Brand Manager, Categories Manager, Complétude Catalogue, Moteur de Recherche, Price Monitor
- Chaque module peut être activé/désactivé et réordonné via `/settings/modules`

---

## Pour qui ?

Products Manager APP est conçu pour :

- E-commerçants gérant des catalogues multi-fournisseurs
- Marketplaces nécessitant de la normalisation de données
- Distributeurs avec des imports quotidiens complexes
- Agences e-commerce gérant plusieurs clients

---

## Avantages Clés

### Gain de Temps

Automatisez jusqu’à 95% de vos tâches manuelles d’import et enrichissement de produits.

### Qualité des Données

Obtenez des fiches produits complètes et optimisées SEO grâce à l’IA générative (GPT-4o, Claude 4.5 Sonnet).

### Intelligence Économique

Surveillez +16 plateformes e-commerce (Amazon, Boulanger, Fnac, Darty...) pour ajuster vos prix.

### Connectivité

Synchronisez avec Odoo, PrestaShop, et plus encore. 8 serveurs MCP avec 42 outils pour agents IA.

---

## Architecture Technique

Products Manager APP v4.5.58 repose sur une architecture moderne et performante :

- **Backend** : FastAPI (Python 3.11+), SQLAlchemy async
- **Frontend** : Next.js 15 (App Router) + React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Base de données** : PostgreSQL multi-DB (7 bases spécialisées : db_core, db_catalog, db_imports, db_analytics, db_media, db_code2asin, db_suppliers)
- **Cache** : Redis 7.x (L1 + L2 caching)
- **Stockage** : MinIO (S3-compatible)
- **Recherche** : Meilisearch (moteur de recherche full-text)
- **Workers** : Celery + Beat
- **Déploiement** : Docker, Coolify (auto-deploy on push)
- **17 modules** enregistrés et activables
- **8 serveurs MCP** avec 42 outils pour agents IA
- **47+ routeurs API** REST

**Tests** : 8 553 tests backend passent (100% taux de réussite) | **0 échecs**

---

## Prochaines Étapes

- [Démarrage Rapide](/docs/getting-started/quick-start) - Commencez en 10 minutes
- [Installation](/docs/getting-started/installation) - Installation complète
- [Guide Utilisateur](/docs/user-guides/getting-started) - Interface et fonctionnalités
- [API Reference](/docs/api/authentication) - Intégration technique

---

## Support

- **Documentation**: [docs.productsmanager.app](https://docs.productsmanager.app)
- **Application**: [productsmanager.app](https://productsmanager.app)
- **API**: [api.productsmanager.app](https://api.productsmanager.app)
- **Contact**: webmaster@pixeeplay.com
