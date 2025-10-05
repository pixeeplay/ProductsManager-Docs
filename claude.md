# Claude.md - Context for ProductsManager-Docs

> **Documentation officielle de Products Manager APP v3.3.0**
> Site statique Next.js hébergé sur Coolify avec déploiement automatique via GitHub

---

## Vue d'Ensemble du Projet

### Qu'est-ce que ProductsManager-Docs ?

ProductsManager-Docs est le **site de documentation officiel** de Products Manager APP, une plateforme SaaS pour e-commerçants qui centralise les imports fournisseurs, enrichit les produits avec l'IA, et optimise la gestion e-commerce.

Ce repository est un site statique Next.js basé sur le template **Syntax by Tailwind CSS**, adapté et personnalisé pour Products Manager APP.

### Informations Clés

- **Repository** : https://github.com/pixeeplay/ProductsManager-Docs
- **URL Production** : https://docs.productsmanager.app
- **Application principale** : https://productsmanager.app
- **API** : https://api.productsmanager.app
- **Version** : v1.0.0 (Documentation v3.3.0 de Products Manager APP)
- **Contact** : webmaster@pixeeplay.com

---

## Structure du Projet

### Arborescence

```
ProductsManager-Docs/
├── public/
│   └── logo.png                    # Logo Products Manager APP (38KB PNG)
├── src/
│   ├── app/
│   │   ├── page.md                 # Homepage avec hero et quick links
│   │   ├── layout.tsx              # Layout global
│   │   └── docs/                   # Documentation pages (Markdoc .md)
│   │       ├── getting-started/
│   │       │   ├── introduction/
│   │       │   ├── quick-start/
│   │       │   └── installation/
│   │       ├── features/
│   │       │   ├── import-centralisation/
│   │       │   ├── ai-enrichment/
│   │       │   ├── ean-manager/
│   │       │   └── market-intelligence/
│   │       ├── user-guides/
│   │       │   ├── getting-started/
│   │       │   ├── import-workflow/
│   │       │   └── dashboard-usage/
│   │       ├── api/
│   │       │   ├── authentication/
│   │       │   ├── endpoints/
│   │       │   └── webhooks/
│   │       ├── technical/
│   │       │   ├── architecture/
│   │       │   ├── database/
│   │       │   ├── deployment/
│   │       │   └── security/
│   │       ├── integrations/
│   │       │   ├── odoo/
│   │       │   ├── shopify/
│   │       │   ├── prestashop/
│   │       │   └── woocommerce/
│   │       └── releases/
│   │           ├── changelog/
│   │           ├── v3-2-0/
│   │           └── v3-3-0/
│   ├── components/
│   │   ├── Layout.tsx              # Header + Navigation sidebar
│   │   ├── Logo.tsx                # Logo components (PNG image)
│   │   ├── Navigation.tsx          # Sidebar navigation
│   │   ├── Callout.tsx             # Markdoc callout component
│   │   └── QuickLinks.tsx          # Markdoc quick-links component
│   ├── lib/
│   │   └── navigation.ts           # Navigation structure (7 sections)
│   └── markdoc/
│       └── tags.js                 # Markdoc custom tags config
├── docker-compose.yml              # Coolify deployment config
├── Dockerfile.simple               # Single-stage Dockerfile (Node 20 Alpine)
├── package.json                    # Next.js 15 + dependencies
└── claude.md                       # Ce fichier (contexte du projet)
```

### Pages de Documentation (24 pages)

**Getting Started (3 pages)**
- Introduction : Vue d'ensemble Products Manager APP
- Quick Start : Démarrage en 10 minutes
- Installation : Setup complet avec Docker

**Features (4 pages)**
- Import Centralisation : Excel/CSV/XML/JSON, FTP/API, planification
- AI Enrichment : GPT-4o, descriptions SEO, extraction attributs
- EAN Manager : Amazon API, matching automatique codes-barres
- Market Intelligence : 16+ plateformes, surveillance prix

**User Guides (3 pages)**
- Getting Started : Utilisation interface
- Import Workflow : Workflow complet d'import
- Dashboard Usage : Analytics et rapports

**API (3 pages)**
- Authentication : JWT tokens, RBAC
- Endpoints : REST API complète
- Webhooks : Events, signatures, retry

**Technical (4 pages)**
- Architecture : Multi-DB, Redis, MinIO, Celery
- Database : 5 bases PostgreSQL, Database Optimizer
- Deployment : Docker, Coolify, Traefik
- Security : RBAC, JWT, 87/100 score

**Integrations (4 pages)**
- Odoo : ERP XML-RPC
- Shopify : E-commerce webhooks
- PrestaShop : Multi-store
- WooCommerce : WordPress

**Releases (3 pages)**
- Changelog : Historique versions
- v3.2.0 : Performance & Security
- v3.3.0 : Frontend Excellence (Health Score 83/100)

---

## Stack Technique

### Frontend

- **Framework** : Next.js 15.0.3 (App Router)
- **React** : 19.0.0
- **Styling** : Tailwind CSS 4
- **Markdown** : Markdoc (custom tags : callout, quick-links)
- **TypeScript** : 5.6.3
- **Template** : Syntax by Tailwind CSS (adapté)

### Backend / Build

- **Runtime** : Node.js 20 (Alpine Linux)
- **Package Manager** : npm
- **Build** : Static Site Generation (SSG)
- **Output** : Standalone build (~113 MB)

### Infrastructure

- **Hosting** : Coolify (auto-deploy)
- **Container** : Docker (single-stage Dockerfile)
- **Reverse Proxy** : Traefik
- **SSL** : Let's Encrypt (automatique)
- **Port** : 3000 (interne container)

### Déploiement

- **CI/CD** : GitHub → Coolify webhook (auto-deploy on push)
- **Build Time** : ~2-3 minutes
- **Health Check** : curl http://localhost:3000/

---

## Configuration Markdoc

### Tags Personnalisés

Le site utilise des composants Markdoc personnalisés :

#### 1. Lead Paragraph
```markdown
Votre paragraphe d'introduction mis en évidence. {% .lead %}
```
Applique la classe CSS `.lead` pour un style d'intro.

#### 2. Callout (Notes et Warnings)
```markdown
{% callout type="note" %}
Ceci est une note informative.
{% /callout %}

{% callout type="warning" %}
Ceci est un avertissement.
{% /callout %}
```

#### 3. Quick Links (Homepage uniquement)
```markdown
{% quick-links %}

{% quick-link title="Guide" icon="installation" href="/docs/guide" description="Description" /%}

{% /quick-links %}
```

### Configuration

**Fichier** : `src/markdoc/tags.js`

Les tags sont définis avec leurs attributs et composants React associés :
- `callout` → `Callout.tsx`
- `quick-links` → `QuickLinks.tsx`
- `quick-link` → `QuickLink.tsx` (self-closing)

---

## Déploiement avec Coolify

### Configuration

**Fichier** : `docker-compose.yml`

```yaml
services:
  docs:
    build:
      context: .
      dockerfile: Dockerfile.simple
      args:
        - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://docs.productsmanager.app}
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://api.productsmanager.app}
    container_name: docs-productsmanager
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Variables d'Environnement

Configurées dans Coolify UI :
- `NEXT_PUBLIC_SITE_URL` : https://docs.productsmanager.app
- `NEXT_PUBLIC_API_URL` : https://api.productsmanager.app

### Workflow de Déploiement

1. **Développement local** → Modifications des fichiers .md
2. **Commit & Push** → `git push` vers GitHub
3. **Webhook GitHub** → Coolify détecte le push
4. **Build Docker** → `docker build -f Dockerfile.simple`
5. **Deploy** → Remplacement du container
6. **Health Check** → Vérification que le site répond
7. **Live** → Accessible sur https://docs.productsmanager.app

### Build Process

Le Dockerfile.simple effectue :
1. Installation de `curl` pour healthcheck
2. `npm ci` (install dépendances)
3. Copy source code
4. `npm run build` (Next.js static generation)
5. `npm start` (serveur production)

---

## Navigation et Structure

### Configuration Navigation

**Fichier** : `src/lib/navigation.ts`

7 sections principales :

```typescript
export const navigation = [
  { title: 'Getting Started', links: [...] },
  { title: 'Features', links: [...] },
  { title: 'User Guides', links: [...] },
  { title: 'API Reference', links: [...] },
  { title: 'Technical', links: [...] },
  { title: 'Integrations', links: [...] },
  { title: 'Releases', links: [...] },
]
```

Chaque lien contient :
- `title` : Titre affiché
- `href` : URL relative (ex: `/docs/getting-started/introduction`)

### Logo

**Fichier** : `src/components/Logo.tsx`

Utilise une image PNG statique (`/public/logo.png`) au lieu d'un SVG.

**Raison** : Le template Syntax utilise des props SVG (`fill-slate-700`) qui ne fonctionnent pas avec Next.js Image. La solution est d'utiliser une balise `<img>` native avec filtrage des classes SVG.

---

## Workflow de Contribution

### Ajouter une Nouvelle Page

1. **Créer le fichier** : `src/app/docs/section/page-name/page.md`

2. **Frontmatter obligatoire** :
```markdown
---
title: Titre de la Page
nextjs:
  metadata:
    title: Titre SEO - Products Manager APP
    description: Description courte pour SEO
---
```

3. **Structure recommandée** :
```markdown
Paragraphe d'introduction avec contexte. {% .lead %}

---

## Section 1

Contenu...

{% callout type="note" %}
Note importante
{% /callout %}

---

## Section 2

Contenu...
```

4. **Ajouter au navigation.ts** :
```typescript
{
  title: 'Ma Section',
  links: [
    { title: 'Ma Page', href: '/docs/section/page-name' },
  ],
}
```

5. **Tester localement** :
```bash
npm run dev
# Ouvrir http://localhost:3000
```

6. **Commit et push** :
```bash
git add .
git commit -m "feat(docs): Add new page"
git push
```

### Modifier une Page Existante

1. Éditer le fichier `.md` dans `src/app/docs/`
2. Vérifier la syntaxe Markdoc (callouts, lead)
3. Commit et push (déploiement auto)

### Modifier le Logo

1. Remplacer `/public/logo.png`
2. Recommandé : PNG transparent, ~400x100px
3. Commit et push

### Modifier le Header/Footer

- **Header** : `src/components/Layout.tsx` (ligne 37-65)
- **Footer** : Pas de footer actuellement
- **Lien GitHub** : Ligne 60 de Layout.tsx

---

## Erreurs Courantes et Solutions

### 1. Build Failed - Markdoc Error

**Erreur** : `TypeError: Cannot read properties of undefined (reading 'toLowerCase')`

**Cause** : Syntaxe Markdoc invalide (tag non fermé, attributs incorrects)

**Solutions** :
- Vérifier que tous les callouts sont fermés : `{% /callout %}`
- Utiliser `type="note"` ou `type="warning"` uniquement
- Ne pas imbriquer les callouts

### 2. Logo ne s'affiche pas

**Cause** : Chemin incorrect ou format non supporté

**Solutions** :
- Vérifier que le fichier existe : `/public/logo.png`
- Utiliser PNG, JPG ou WebP (pas SVG inline)
- Vérifier les permissions fichier

### 3. Navigation ne se met pas à jour

**Cause** : Cache Next.js ou erreur dans navigation.ts

**Solutions** :
- Rebuild complet : `npm run build`
- Vérifier la syntaxe TypeScript dans navigation.ts
- Supprimer `.next/` en local

### 4. Déploiement Coolify échoue

**Cause** : Erreur Docker build, dépendances manquantes, timeout

**Solutions** :
- Vérifier logs Coolify : `docker logs docs-productsmanager`
- Tester build localement : `docker build -f Dockerfile.simple .`
- Augmenter timeout dans Coolify (Settings → Build)

### 5. Container unhealthy

**Cause** : Healthcheck échoue (curl non installé ou port incorrect)

**Solutions** :
- Vérifier que curl est installé dans Dockerfile : `RUN apk add --no-cache curl`
- Vérifier le port : `3000` (interne container)
- Tester manuellement : `docker exec -it docs-productsmanager curl http://localhost:3000`

---

## Métriques et Performances

### Build Metrics

- **Build Time** : ~2-3 minutes (Coolify)
- **Bundle Size** : ~113 MB (image Docker optimisée)
- **Pages** : 24 pages statiques pré-générées
- **Assets** : Logo PNG (38 KB)

### Performance

- **Time to First Byte (TTFB)** : <100ms
- **First Contentful Paint (FCP)** : <500ms
- **Lighthouse Score** : 95+ (Performance, SEO, Accessibility)

### SEO

- Metadata OpenGraph configuré
- Sitemap automatique (Next.js)
- URLs sémantiques (`/docs/section/page`)

---

## Liens Importants

### URLs de Production

- **Documentation** : https://docs.productsmanager.app
- **Application** : https://productsmanager.app
- **API** : https://api.productsmanager.app

### Repositories GitHub

- **Documentation** : https://github.com/pixeeplay/ProductsManager-Docs
- **Application principale** : https://github.com/pixeeplay/Suppliers-Import

### Ressources Template

- **Syntax Template** : https://tailwindui.com/templates/syntax
- **Next.js Docs** : https://nextjs.org/docs
- **Markdoc Docs** : https://markdoc.dev

---

## Historique du Projet

### Création (Octobre 2025)

- Migration depuis `Suppliers-Import/docs-site`
- Création repository standalone
- Adaptation template Syntax
- Branding Products Manager APP

### v1.0.0 (Octobre 2025)

- 24 pages de documentation complètes
- Réactivation syntaxe Markdoc
- Intégration Coolify avec auto-deploy
- Logo PNG custom
- Navigation 7 sections

### Contenu Documenté

- Health Score : 83/100 (A-)
- Test Coverage : 78% (6,842 tests)
- Architecture Multi-DB (5 bases PostgreSQL)
- RBAC : 93.4% endpoints protégés
- Performance : API p95 < 370ms

---

## Support et Contact

- **Email** : webmaster@pixeeplay.com
- **GitHub Issues** : https://github.com/pixeeplay/ProductsManager-Docs/issues
- **Documentation** : https://docs.productsmanager.app

---

**Dernière mise à jour** : Octobre 2025
**Version** : v1.0.0
