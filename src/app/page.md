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

{% quick-link title="Code2ASIN" icon="lightbulb" href="/docs/features/code2asin" description="Mapping automatique des codes EAN vers Amazon ASIN." /%}

{% quick-link title="Architecture" icon="plugins" href="/docs/technical/architecture" description="Architecture 7 bases de données et système de médias." /%}

{% /quick-links %}

---

## Qu'est-ce que Products Manager APP ?

Products Manager APP est une **solution SaaS** conçue pour les e-commerçants qui souhaitent **automatiser** et **optimiser** la gestion de leurs données produits.

### Problèmes Résolus

- **Imports manuels chronophages** : Automatisation complète des imports fournisseurs
- **Fiches produits incomplètes** : Enrichissement IA avec descriptions et attributs SEO
- **Gestion multi-fournisseurs complexe** : Centralisation et normalisation des données
- **Prix non compétitifs** : Veille concurrentielle sur +16 plateformes e-commerce
- **Codes EAN manquants** : Recherche automatique via Amazon Product Advertising API

### Métriques Système (v4.5.12)

- **Health Score**: 9.5/10 (Grade A+)
- **Test Coverage**: 78% (6,842 tests)
- **Performance**: API p95 < 370ms
- **Security**: 0 CVE critiques
- **RBAC**: 62 permissions granulaires

---

## Nouvelles Fonctionnalités v4.5.12

### Odoo ERP Integration

Synchronisation bidirectionnelle complète avec Odoo :

- **Import/Export produits** en temps réel
- **Synchronisation stocks** automatique
- **Mapping catégories** configurable
- **Gestion multi-sociétés** supportée

[En savoir plus : Odoo Integration](/docs/integrations/odoo)

### Code2ASIN

Mapping automatique des codes produits vers Amazon ASIN :

- **Recherche par EAN/UPC** via Amazon PA-API 5.0
- **Cache intelligent** pour optimiser les quotas
- **Matching multi-marketplace** (FR, DE, IT, ES, UK, US)
- **Base dédiée** pour performances optimales

[En savoir plus : Code2ASIN](/docs/features/code2asin)

### Thumbnail System

Système de miniatures optimisé pour les médias :

- **3 tailles disponibles** : 150x150, 300x300, 800x800 pixels
- **Génération automatique** à l'upload
- **Format WebP** pour performances web
- **Cache CDN** intégré

### UUID Sharding

Architecture de stockage distribuée pour les médias :

- **256 sous-répertoires** basés sur les 2 premiers caractères UUID
- **Distribution uniforme** des fichiers
- **Performances I/O optimisées** sur grands volumes
- **Compatible MinIO/S3**

### Settings Persistence

Persistance des paramètres en base de données :

- **Configuration centralisée** par tenant
- **Historique des modifications** traçable
- **API de gestion** complète
- **Cache Redis** pour performances

### Architecture 7 Bases de Données

Séparation optimisée des données :

| Base | Usage |
|------|-------|
| **db_core** | Utilisateurs, tenants, authentification |
| **db_catalog** | Produits, catégories, attributs |
| **db_suppliers** | Fournisseurs, imports, mappings |
| **db_media** | Médias, thumbnails, métadonnées |
| **db_analytics** | Statistiques, logs, métriques |
| **db_imports** | Files d'attente, historique imports |
| **db_code2asin** | Cache ASIN, résultats Amazon |

### RBAC Avancé

Système de permissions granulaires :

- **62 permissions** couvrant toutes les fonctionnalités
- **Rôles prédéfinis** : Super Admin, Admin, Manager, User, Viewer
- **Permissions par ressource** : products, suppliers, media, settings...
- **Audit trail** complet des actions

---

## Fonctionnalités Principales

### Centralisation des Imports

Connectez tous vos fournisseurs en un seul endroit :

- **Formats supportés**: Excel, CSV, XML, JSON
- **Sources**: Upload manuel, FTP/SFTP, HTTP, API REST
- **Planification**: Quotidien, hebdomadaire, temps réel
- **Validation**: Règles métier configurables

[En savoir plus](/docs/features/import-centralisation)

### Enrichissement IA

Générez automatiquement du contenu optimisé :

- **Descriptions produits** marketing et SEO
- **Titres optimisés** avec mots-clés
- **Extraction d'attributs** (couleur, taille, matière)
- **Traduction** multi-langues

**Modèles supportés**: GPT-4o, GPT-4-turbo, Claude 3.5 Sonnet

[En savoir plus](/docs/features/ai-enrichment)

### Gestionnaire EAN

Trouvez et associez les codes-barres EAN/UPC/ASIN :

- **Recherche Amazon** via Product Advertising API
- **Cache intelligent** pour réduire les coûts
- **Matching automatique** sur références fournisseurs
- **Export codes** pour marketplace

[En savoir plus](/docs/features/ean-manager)

### Market Intelligence

Surveillez vos concurrents en temps réel :

- **16+ plateformes** surveillées (Amazon, Fnac, Darty, Boulanger...)
- **Alertes prix** par email/SMS
- **Calcul de marges** automatique
- **Rapports PDF/Excel** personnalisables

[En savoir plus](/docs/features/market-intelligence)

---

## Intégrations E-commerce

Synchronisez vos données avec vos outils existants :

| Plateforme | Type | Statut | Sync |
|------------|------|--------|------|
| **Odoo** | ERP | Production | Bidirectionnel |
| **Shopify** | E-commerce | Production | Bidirectionnel |
| **PrestaShop** | E-commerce | Production | Bidirectionnel |
| **WooCommerce** | E-commerce | Production | Bidirectionnel |
| **API REST** | Custom | Production | Bidirectionnel |

[Voir toutes les intégrations](/docs/integrations/odoo)

---

## Stack Technique

Products Manager APP v4.5.12 utilise une architecture moderne et scalable :

**Backend**:
- FastAPI (Python 3.11)
- PostgreSQL multi-DB (7 bases de données)
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

[Architecture détaillée](/docs/technical/architecture)

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

{% quick-link title="RBAC & Permissions" icon="presets" href="/docs/technical/rbac" description="62 permissions granulaires et rôles utilisateur." /%}

{% quick-link title="Media System" icon="lightbulb" href="/docs/technical/media" description="Thumbnails, UUID sharding, et stockage MinIO." /%}

{% /quick-links %}

---

## Support & Contact

- **Documentation**: [docs.productsmanager.app](https://docs.productsmanager.app)
- **Application**: [productsmanager.app](https://productsmanager.app)
- **API**: [api.productsmanager.app](https://api.productsmanager.app)
- **Email**: webmaster@pixeeplay.com
- **GitHub**: [Suppliers-Import](https://github.com/pixeeplay/Suppliers-Import)
