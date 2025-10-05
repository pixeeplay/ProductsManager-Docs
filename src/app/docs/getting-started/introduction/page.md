---
title: Introduction
nextjs:
  metadata:
    title: Introduction - Products Manager APP
    description: Découvrez Products Manager APP, la plateforme tout-en-un pour gérer vos données produits e-commerce.
---

Bienvenue dans Products Manager APP - votre solution complète pour **centraliser les imports fournisseurs**, **enrichir vos produits avec l'IA**, et **optimiser votre gestion e-commerce**. {% .lead %}

---

## Qu'est-ce que Products Manager APP ?

Products Manager APP est une plateforme SaaS conçue pour les e-commerçants qui souhaitent automatiser et optimiser la gestion de leurs données produits.

### Fonctionnalités Principales

{% quick-links %}

{% quick-link title="Centralisation des Imports" icon="installation" href="/docs/features/import-centralisation" description="Importez automatiquement vos catalogues fournisseurs depuis Excel, CSV, FTP, ou API." /%}

{% quick-link title="Enrichissement IA" icon="presets" href="/docs/features/ai-enrichment" description="Générez descriptions, titres SEO et attributs produits automatiquement avec l'IA." /%}

{% quick-link title="Gestionnaire EAN" icon="plugins" href="/docs/features/ean-manager" description="Recherchez et associez les codes EAN/ASIN Amazon en un clic." /%}

{% quick-link title="Market Intelligence" icon="theming" href="/docs/features/market-intelligence" description="Surveillez les prix concurrents et optimisez vos marges en temps réel." /%}

{% /quick-links %}

---

## Pour qui ?

Products Manager APP est conçu pour :

- **E-commerçants** gérant des catalogues multi-fournisseurs
- **Marketplaces** nécessitant de la normalisation de données
- **Distributeurs** avec des imports quotidiens complexes
- **Agences e-commerce** gérant plusieurs clients

---

## Avantages Clés

### ⏱️ Gain de Temps

Automatisez jusqu'à **95% de vos tâches manuelles** d'import et enrichissement de produits.

### 🎯 Qualité des Données

Obtenez des fiches produits **complètes et optimisées SEO** grâce à l'IA générative.

### 📊 Intelligence Économique

Surveillez **+16 plateformes e-commerce** (Amazon, Boulanger, Fnac, Darty...) pour ajuster vos prix.

### 🔌 Connectivité

Synchronisez avec **Odoo, Shopify, PrestaShop, WooCommerce** et plus encore.

---

## Architecture Technique

Products Manager APP v3.3.0 repose sur une architecture moderne :

- **Backend**: FastAPI (Python 3.11)
- **Frontend**: Next.js 15 + React 19
- **Base de données**: PostgreSQL multi-DB (catalog, imports, analytics, code2asin, media)
- **Cache**: Redis
- **Files**: MinIO (S3-compatible)
- **Workers**: Celery + Beat

**Health Score**: 83/100 (A-) | **Test Coverage**: 78% (6,842 tests)

---

## Prochaines Étapes

{% quick-links %}

{% quick-link title="Démarrage Rapide" icon="installation" href="/docs/getting-started/quick-start" description="Commencez en 10 minutes avec notre guide rapide." /%}

{% quick-link title="Installation" icon="presets" href="/docs/getting-started/installation" description="Installez Products Manager APP en local ou en production." /%}

{% quick-link title="Guide Utilisateur" icon="plugins" href="/docs/user-guides/getting-started" description="Découvrez l'interface et les fonctionnalités principales." /%}

{% quick-link title="API Reference" icon="theming" href="/docs/api/authentication" description="Intégrez Products Manager APP à votre stack." /%}

{% /quick-links %}

---

## Support

- **Documentation**: [docs.productsmanager.app](https://docs.productsmanager.app)
- **Application**: [productsmanager.app](https://productsmanager.app)
- **API**: [api.productsmanager.app](https://api.productsmanager.app)
- **Contact**: webmaster@pixeeplay.com
