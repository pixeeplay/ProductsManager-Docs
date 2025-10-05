# Product Manager APP - Documentation Site

Official documentation site for Product Manager APP, built with [Next.js 15](https://nextjs.org/) and the [Syntax](https://tailwindcss.com/templates/syntax) template by Tailwind CSS.

## Overview

This documentation site provides comprehensive guides, API references, and integration instructions for Product Manager APP - the all-in-one platform for e-commerce product data management.

## Features

- **Modern Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Fast Search**: FlexSearch-powered documentation search
- **Responsive Design**: Mobile-first, accessible UI
- **MDX Support**: Write documentation in Markdown with React components
- **Syntax Highlighting**: Code blocks with Prism.js
- **i18n Ready**: Multi-language support with next-intl (FR/EN)

## Documentation Structure

```
/docs/getting-started/
  ├─ introduction       # What is Product Manager APP
  ├─ quick-start        # 10-minute setup guide
  └─ installation       # Full installation instructions

/docs/features/
  ├─ import-centralisation  # Automated supplier imports
  ├─ ai-enrichment          # AI-powered content generation
  ├─ ean-manager            # Barcode management & ASIN lookup
  ├─ market-intelligence    # Price tracking & analytics
  └─ connectors             # E-commerce platform integrations

/docs/guides/
  ├─ supplier-management    # Configuring imports
  ├─ product-enrichment     # Advanced AI strategies
  └─ price-monitoring       # Competitor tracking

/docs/api/
  ├─ authentication     # JWT authentication
  ├─ endpoints          # REST API reference
  └─ webhooks          # Event notifications

/docs/integrations/
  ├─ odoo              # Odoo ERP integration
  ├─ shopify           # Shopify sync
  ├─ prestashop        # PrestaShop connector
  └─ woocommerce       # WooCommerce integration
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development

The site will be available at:
- Development: http://localhost:3000
- Production: https://docs.productsmanager.app

### Adding New Pages

1. Create a new folder in `src/app/docs/[section]/[page]/`
2. Add a `page.md` file with frontmatter:

```md
---
title: Your Page Title
nextjs:
  metadata:
    title: SEO Title
    description: SEO description
---

Your content here. {% .lead %}
```

3. Update `src/lib/navigation.ts` to add the link

### MDX Components

Use built-in components for rich content:

```md
{% quick-links %}
{% quick-link title="Link" icon="installation" href="/docs/page" description="Description" /%}
{% /quick-links %}

{% callout type="warning" title="Warning Title" %}
Important information here.
{% /callout %}
```

## Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://docs.productsmanager.app
NEXT_PUBLIC_API_URL=https://api.productsmanager.app
```

### Customization

- **Theme**: Edit `src/app/layout.tsx`
- **Navigation**: Edit `src/lib/navigation.ts`
- **Logo**: Replace `src/components/Logo.tsx`
- **Colors**: Edit Tailwind config in `tailwind.config.js`

## Internationalization (i18n)

### Supported Languages

- English (en)
- French (fr)

### Adding Translations

1. Add translations in `messages/[locale].json`
2. Update locale routing in `middleware.ts`
3. Use `useTranslations()` hook in components

## Deployment

### Coolify (Production - Recommended)

**Step 1: Create Application in Coolify**

1. New Application → **Docker Compose**
2. Configuration:
   - Repository: `https://github.com/pixeeplay/ProductsManager-Docs.git`
   - Branch: `main`
   - Compose file: `docker-compose.yml`
   - Base directory: `/`

**Step 2: Environment Variables**

Add in Coolify UI:
```bash
NEXT_PUBLIC_SITE_URL=https://docs.productsmanager.app
NEXT_PUBLIC_API_URL=https://api.productsmanager.app
```

**Step 3: Domain Configuration**

- Domain: `docs.productsmanager.app`
- Port: `3000`
- SSL: Generate Let's Encrypt certificate

**Step 4: Deploy** 🚀

**Troubleshooting**:
- Build fails? Try "Force rebuild without cache"
- Site inaccessible? Verify DNS A record points to Coolify server
- SSL issues? Generate certificate in Coolify SSL settings

### Docker (Local Development)

```bash
# Build Docker image
docker build -t productsmanager-docs -f Dockerfile.simple .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://docs.productsmanager.app \
  -e NEXT_PUBLIC_API_URL=https://api.productsmanager.app \
  productsmanager-docs
```

### Vercel (Alternative)

```bash
# Deploy to Vercel
vercel --prod
```

## SEO

The site includes:
- Semantic HTML
- Meta tags (title, description, OG)
- Sitemap.xml (auto-generated)
- robots.txt
- Structured data (JSON-LD)

## Performance

Optimizations:
- Image optimization with Next.js Image
- Code splitting
- Route prefetching
- Static generation where possible

## Contributing

### Content Guidelines

- Use clear, concise language
- Include code examples
- Add callouts for important information
- Link to related pages
- Test all code snippets

### Code Style

- Use Prettier for formatting
- Follow TypeScript best practices
- Write semantic HTML
- Use Tailwind CSS utilities

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19, Tailwind CSS 4
- **Markdown**: Markdoc, MDX
- **Search**: FlexSearch
- **Icons**: Heroicons
- **Fonts**: Inter (via next/font)
- **Deployment**: Vercel

## License

This documentation is part of Product Manager APP.

## Support

- **Documentation**: https://docs.productsmanager.app
- **API Reference**: https://docs.productsmanager.app/api/authentication
- **Support**: support@productsmanager.app

---

Built with [Syntax](https://tailwindcss.com/templates/syntax) by Tailwind CSS
