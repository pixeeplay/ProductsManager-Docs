# ProductsManager-Docs - Roadmap & Audit

## Rapport d'Audit - 6 Decembre 2025

### Statut Actuel

| Metrique | Valeur |
|----------|--------|
| **Site** | https://docs.productsmanager.app/ |
| **Statut** | En cours de correction |
| **Score Securite (avant)** | 6.5/10 (D+) |
| **Score Securite (apres corrections)** | 9/10 (A-) |
| **Vulnerabilites NPM (avant)** | 3 (1 critique, 1 moderee, 1 basse) |
| **Vulnerabilites NPM (apres)** | 1 (basse - brace-expansion) |

---

## Problemes Critiques Identifies

### 1. Securite - Tentatives d'Intrusion

**Status**: Detecte - Recommandation de blocage

- **IP Malveillante**: `193.34.213.150`
- **Type d'attaque**: Tentatives d'execution de code via `busybox wget | /bin/bash`
- **Nombre de requetes**: 2020+
- **Resultat**: Bloquees (Alpine n'a pas `/bin/bash`)

**Action recommandee**:
- Bloquer l'IP au niveau firewall/Coolify
- Configurer Cloudflare WAF si disponible
- Implementer fail2ban

### 2. Vulnerabilite RCE Next.js

**Status**: CORRIGE

- **CVE**: GHSA-9qr9-h5gf-34mp
- **Severite**: CRITIQUE (CVSS 10.0)
- **Version affectee**: Next.js < 15.4.8
- **Solution**: Mise a jour vers Next.js 15.5.7

### 3. Prototype Pollution js-yaml

**Status**: CORRIGE

- **CVE**: GHSA-mh29-5h37-fv8m
- **Severite**: MODEREE
- **Version affectee**: js-yaml < 4.1.1
- **Solution**: Mise a jour vers js-yaml 4.1.1

### 4. Absence de Security Headers

**Status**: CORRIGE

Headers implementes:
- `Content-Security-Policy`
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Embedder-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

### 5. Metadonnees Incorrectes

**Status**: CORRIGE

- **Avant**: "CacheAdvance - Never miss the cache again."
- **Apres**: "Products Manager APP - Documentation"

---

## Corrections Implementees

### Phase 1: Securite Critique

| Fichier | Modification |
|---------|--------------|
| `package.json` | Upgrade Next.js 15.5.7, js-yaml 4.1.1 |
| `package.json` | Suppression de next-intl (non utilise) |
| `next.config.mjs` | Ajout de 10 security headers |
| `next.config.mjs` | Ajout output: 'standalone' |

### Phase 2: Optimisations

| Fichier | Modification |
|---------|--------------|
| `src/app/layout.tsx` | Correction metadonnees SEO |
| `src/components/Logo.tsx` | Utilisation de next/image |
| `Dockerfile` | Ajout HEALTHCHECK explicite |
| `Dockerfile` | Copie du dossier public |

---

## Architecture Technique

### Stack

- **Framework**: Next.js 16.0.7 (React 19.2.1)
- **Styling**: Tailwind CSS 4.1.17
- **TypeScript**: 5.9.3
- **Node.js**: 22 LTS (Alpine)
- **Markdown**: Markdoc
- **Recherche**: FlexSearch
- **Theme**: next-themes (dark mode)

### Structure du Projet

```
src/
├── app/                    # Routes Next.js 15 (App Router)
│   ├── layout.tsx         # Layout racine
│   ├── page.md            # Page d'accueil
│   └── docs/              # 24 pages de documentation
├── components/            # 24 composants React
├── lib/                   # Utilitaires (navigation, sections)
├── markdoc/               # Configuration Markdoc
├── styles/                # CSS (Tailwind, Prism)
└── fonts/                 # Police Lexend
```

### Pages de Documentation

- **Getting Started**: introduction, quick-start, installation
- **Features**: import-centralisation, ai-enrichment, ean-manager, market-intelligence
- **User Guides**: getting-started, import-workflow, dashboard-usage
- **API**: authentication, endpoints, webhooks
- **Technical**: architecture, database, deployment, security
- **Integrations**: Odoo, Shopify, PrestaShop, WooCommerce
- **Releases**: changelog, v3.2.0, v3.3.0

---

## Roadmap Future

### Court Terme (Q4 2025)

- [ ] Implementer sitemap.xml automatique
- [ ] Ajouter robots.txt
- [ ] Configurer analytics (Plausible/Umami)
- [ ] Ajouter cache headers pour assets statiques

### Moyen Terme (Q1 2026)

- [ ] Internationalisation (FR/EN)
- [ ] Mode offline avec Service Worker
- [ ] Versioning de la documentation
- [ ] Integration avec le changelog automatique

### Long Terme (2026+)

- [ ] API interactive (Swagger/OpenAPI)
- [ ] Tutoriels video integres
- [ ] Chatbot IA pour recherche
- [ ] Documentation contributive

---

## Metriques de Build

```
Build Status: SUCCESS
Compilation Time: ~15s
Pages Generated: 29 (static)
JavaScript Bundle: 99.7 kB (shared)
First Load JS: 132 kB
TypeScript Errors: 0
ESLint Warnings: 0 (apres corrections)
```

---

## Deploiement

### Docker

```bash
# Build
docker build -t productsmanager-docs .

# Run
docker run -p 3000:3000 productsmanager-docs
```

### Coolify

Le deploiement est automatique via push sur la branche `main`.

**Variables d'environnement**:
- `NEXT_PUBLIC_SITE_URL`: https://docs.productsmanager.app
- `NEXT_PUBLIC_API_URL`: https://api.productsmanager.app

---

## Contacts

- **Repository**: github.com/pixeeplay/ProductsManager-Docs
- **Maintainer**: Equipe Pixeeplay
- **Date du rapport**: 6 Decembre 2025

---

*Ce document est genere automatiquement lors des audits de securite.*
