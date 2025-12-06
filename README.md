# Products Manager APP - Documentation

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](LICENSE)

Site de documentation officiel de **Products Manager APP**, construit avec [Next.js 16](https://nextjs.org/) et le template [Syntax](https://tailwindcss.com/templates/syntax) de Tailwind CSS.

## Apercu

Ce site de documentation fournit des guides complets, des references API et des instructions d'integration pour Products Manager APP - la plateforme tout-en-un pour la gestion des donnees produits e-commerce.

**URL Production**: https://docs.productsmanager.app

## Stack Technique

| Technologie | Version | Description |
|-------------|---------|-------------|
| Next.js | 16.0.7 | Framework React avec App Router |
| React | 19.2.1 | Bibliotheque UI |
| TypeScript | 5.9.3 | Typage statique |
| Tailwind CSS | 4.1.17 | Framework CSS utility-first |
| Markdoc | 0.5.2 | Systeme de documentation Markdown |
| FlexSearch | 0.8.205 | Recherche full-text cote client |
| Node.js | 22 LTS | Runtime JavaScript |

## Fonctionnalites

- **Stack Moderne**: Next.js 16, React 19, TypeScript strict, Tailwind CSS 4
- **Recherche Rapide**: Recherche FlexSearch dans toute la documentation
- **Design Responsive**: Interface mobile-first et accessible
- **Markdoc**: Documentation en Markdown avec composants React
- **Coloration Syntaxique**: Blocs de code avec Prism.js
- **Mode Sombre**: Theme clair/sombre avec next-themes
- **Security Headers**: 10 headers de securite configures

## Structure de la Documentation

```
/docs/getting-started/
  ├─ introduction       # Qu'est-ce que Products Manager APP
  ├─ quick-start        # Guide de demarrage en 10 minutes
  └─ installation       # Instructions d'installation completes

/docs/features/
  ├─ import-centralisation  # Imports fournisseurs automatises
  ├─ ai-enrichment          # Generation de contenu par IA
  ├─ ean-manager            # Gestion des codes-barres & recherche ASIN
  └─ market-intelligence    # Suivi des prix & analytics

/docs/guides/
  ├─ getting-started        # Guide de demarrage
  ├─ import-workflow        # Workflow d'import
  └─ dashboard-usage        # Utilisation du tableau de bord

/docs/api/
  ├─ authentication     # Authentification JWT
  ├─ endpoints          # Reference API REST
  └─ webhooks           # Notifications d'evenements

/docs/integrations/
  ├─ odoo              # Integration ERP Odoo
  ├─ shopify           # Synchronisation Shopify
  ├─ prestashop        # Connecteur PrestaShop
  └─ woocommerce       # Integration WooCommerce

/docs/technical/
  ├─ architecture      # Architecture technique
  ├─ database          # Schema de base de donnees
  ├─ deployment        # Guide de deploiement
  └─ security          # Securite et conformite
```

## Demarrage Rapide

### Prerequis

- Node.js 18+ (recommande: 22 LTS)
- npm 8+

### Installation

```bash
# Cloner le repository
git clone git@github.com:pixeeplay/ProductsManager-Docs.git
cd ProductsManager-Docs

# Installer les dependances
npm install

# Demarrer le serveur de developpement (Turbopack)
npm run dev

# Ou avec Webpack (fallback)
npm run dev:webpack
```

### Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur dev avec Turbopack |
| `npm run dev:webpack` | Serveur dev avec Webpack |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Verification ESLint |
| `npm run type-check` | Verification TypeScript |

### URLs

- **Developpement**: http://localhost:3000
- **Production**: https://docs.productsmanager.app

## Ajouter une Nouvelle Page

1. Creer un nouveau dossier dans `src/app/docs/[section]/[page]/`
2. Ajouter un fichier `page.md` avec frontmatter:

```md
---
title: Titre de la Page
nextjs:
  metadata:
    title: Titre SEO
    description: Description SEO
---

Votre contenu ici. {% .lead %}
```

3. Mettre a jour `src/lib/navigation.ts` pour ajouter le lien

## Composants Markdoc

Utilisez les composants integres pour un contenu riche:

```md
{% quick-links %}
{% quick-link title="Lien" icon="installation" href="/docs/page" description="Description" /%}
{% /quick-links %}

{% callout type="warning" title="Attention" %}
Information importante ici.
{% /callout %}

{% callout type="note" title="Note" %}
Information utile.
{% /callout %}
```

## Configuration

### Variables d'Environnement

Creer `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://docs.productsmanager.app
NEXT_PUBLIC_API_URL=https://api.productsmanager.app
```

### Personnalisation

| Element | Fichier |
|---------|---------|
| Theme/Layout | `src/app/layout.tsx` |
| Navigation | `src/lib/navigation.ts` |
| Logo | `src/components/Logo.tsx` |
| Styles | `src/styles/tailwind.css` |

## Deploiement

### Coolify (Production)

Le deploiement est automatique via push sur la branche `main`.

**Configuration Coolify**:
- Repository: `https://github.com/pixeeplay/ProductsManager-Docs.git`
- Branch: `main`
- Dockerfile: `Dockerfile`
- Port: `3000`
- Domain: `docs.productsmanager.app`

### Docker (Local)

```bash
# Build
docker build -t productsmanager-docs .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://docs.productsmanager.app \
  -e NEXT_PUBLIC_API_URL=https://api.productsmanager.app \
  productsmanager-docs
```

### Docker Compose

```bash
docker-compose up -d
```

## Securite

Le site implemente les headers de securite suivants:

| Header | Valeur |
|--------|--------|
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload |
| Content-Security-Policy | Configured |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |

## Performance

Optimisations incluses:

- Optimisation d'images avec Next.js Image (AVIF/WebP)
- Code splitting automatique
- Prefetching des routes
- Generation statique (SSG) pour toutes les pages
- Compression gzip activee
- Build standalone optimise pour Docker

## Audit & Roadmap

Voir les fichiers suivants pour plus de details:

- [`ROADMAP.md`](ROADMAP.md) - Plan d'action et roadmap
- [`audits/`](audits/) - Rapports d'audit de securite

## Contribuer

### Guidelines de Contenu

- Utiliser un langage clair et concis
- Inclure des exemples de code
- Ajouter des callouts pour les informations importantes
- Lier aux pages connexes
- Tester tous les extraits de code

### Style de Code

- Prettier pour le formatage
- Suivre les best practices TypeScript
- Ecrire du HTML semantique
- Utiliser les utilitaires Tailwind CSS

## Support

- **Documentation**: https://docs.productsmanager.app
- **Reference API**: https://docs.productsmanager.app/api/authentication
- **Application**: https://productsmanager.app
- **Support**: support@productsmanager.app

## Licence

Cette documentation fait partie de Products Manager APP - Logiciel proprietaire.

---

Construit avec [Syntax](https://tailwindcss.com/templates/syntax) par Tailwind CSS
