---
title: Products Manager APP - Documentation
nextjs:
  metadata:
    title: Documentation - Products Manager APP
    description: Documentation complète pour Products Manager APP - Centralisez vos imports, enrichissez avec l'IA, et optimisez votre e-commerce.
---

Bienvenue dans la documentation **Products Manager APP** - votre plateforme tout-en-un pour **centraliser les imports fournisseurs**, **enrichir vos produits avec l'IA**, et **optimiser votre gestion e-commerce**. {% .lead %}

{% quick-links %}

{% quick-link title="Démarrage Rapide" icon="installation" href="/docs/getting-started/quick-start" description="Commencez en 10 minutes avec notre guide pas-à-pas." /%}

{% quick-link title="Fonctionnalités" icon="presets" href="/docs/features/import-centralisation" description="Découvrez les imports centralisés, l'enrichissement IA, le gestionnaire EAN, et plus." /%}

{% quick-link title="API Reference" icon="plugins" href="/docs/api/authentication" description="Documentation API complète avec authentification, endpoints, et webhooks." /%}

{% quick-link title="Intégrations" icon="theming" href="/docs/integrations/odoo" description="Connectez-vous à Odoo, Shopify, PrestaShop, WooCommerce, et plus." /%}

{% /quick-links %}

---

## Qu'est-ce que Products Manager APP ?

Products Manager APP est une **solution SaaS** conçue pour les e-commerçants qui souhaitent **automatiser** et **optimiser** la gestion de leurs données produits.

### 🎯 Problèmes Résolus

- **Imports manuels chronophages** → Automatisation complète des imports fournisseurs
- **Fiches produits incomplètes** → Enrichissement IA avec descriptions et attributs SEO
- **Gestion multi-fournisseurs complexe** → Centralisation et normalisation des données
- **Prix non compétitifs** → Veille concurrentielle sur +16 plateformes e-commerce
- **Codes EAN manquants** → Recherche automatique via Amazon Product Advertising API

### 📊 Métriques Système (v3.3.0)

- **Health Score**: 83/100 (A-)
- **Test Coverage**: 78% (6,842 tests)
- **Performance**: API p95 < 370ms
- **Security**: 0 CVE critiques
- **RBAC**: 93.4% endpoints protégés

---

## Fonctionnalités Principales

### 🔄 Centralisation des Imports

Connectez tous vos fournisseurs en un seul endroit :

- **Formats supportés**: Excel, CSV, XML, JSON
- **Sources**: Upload manuel, FTP/SFTP, HTTP, API REST
- **Planification**: Quotidien, hebdomadaire, temps réel
- **Validation**: Règles métier configurables

[En savoir plus →](/docs/features/import-centralisation)

### 🤖 Enrichissement IA

Générez automatiquement du contenu optimisé :

- **Descriptions produits** marketing et SEO
- **Titres optimisés** avec mots-clés
- **Extraction d'attributs** (couleur, taille, matière)
- **Traduction** multi-langues

**Modèles supportés**: GPT-4o, GPT-4-turbo, Claude 3.5 Sonnet

[En savoir plus →](/docs/features/ai-enrichment)

### 🏷️ Gestionnaire EAN

Trouvez et associez les codes-barres EAN/UPC/ASIN :

- **Recherche Amazon** via Product Advertising API
- **Cache intelligent** pour réduire les coûts
- **Matching automatique** sur références fournisseurs
- **Export codes** pour marketplace

[En savoir plus →](/docs/features/ean-manager)

### 📈 Market Intelligence

Surveillez vos concurrents en temps réel :

- **16+ plateformes** surveillées (Amazon, Fnac, Darty, Boulanger...)
- **Alertes prix** par email/SMS
- **Calcul de marges** automatique
- **Rapports PDF/Excel** personnalisables

[En savoir plus →](/docs/features/market-intelligence)

---

## Intégrations E-commerce

Synchronisez vos données avec vos outils existants :

| Plateforme | Type | Statut |
|------------|------|--------|
| **Odoo** | ERP | ✅ Production |
| **Shopify** | E-commerce | ✅ Production |
| **PrestaShop** | E-commerce | ✅ Production |
| **WooCommerce** | E-commerce | ✅ Production |
| **API REST** | Custom | ✅ Production |

[Voir toutes les intégrations →](/docs/integrations/odoo)

---

## Stack Technique

Products Manager APP v3.3.0 utilise une architecture moderne et scalable :

**Backend**:
- FastAPI (Python 3.11)
- PostgreSQL multi-DB (5 bases de données)
- Redis (cache + Celery)
- MinIO (stockage S3-compatible)
- Celery + Beat (tâches asynchrones)

**Frontend**:
- Next.js 15 + React 19
- Tailwind CSS 4
- TypeScript
- SWR (data fetching)

**Infrastructure**:
- Docker + Docker Compose
- Coolify (déploiement)
- Let's Encrypt (SSL)
- Traefik (reverse proxy)

[Architecture détaillée →](/docs/technical/architecture)

---

## Démarrer Maintenant

### Pour les Utilisateurs

{% quick-links %}

{% quick-link title="Introduction" icon="installation" href="/docs/getting-started/introduction" description="Découvrez Products Manager APP et ses avantages." /%}

{% quick-link title="Guide Utilisateur" icon="presets" href="/docs/user-guides/getting-started" description="Apprenez à utiliser l'interface et les fonctionnalités." /%}

{% /quick-links %}

### Pour les Développeurs

{% quick-links %}

{% quick-link title="API Authentication" icon="plugins" href="/docs/api/authentication" description="Authentification JWT et gestion des tokens." /%}

{% quick-link title="Deployment" icon="theming" href="/docs/technical/deployment" description="Déployer Products Manager APP en production." /%}

{% /quick-links %}

---

## Support & Contact

- **Documentation**: [docs.productsmanager.app](https://docs.productsmanager.app)
- **Application**: [productsmanager.app](https://productsmanager.app)
- **API**: [api.productsmanager.app](https://api.productsmanager.app)
- **Email**: webmaster@pixeeplay.com
- **GitHub**: [Suppliers-Import](https://github.com/pixeeplay/Suppliers-Import)
