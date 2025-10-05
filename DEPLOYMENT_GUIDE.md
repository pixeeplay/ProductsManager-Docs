# Product Manager APP Documentation - Deployment Guide

## Setup Complete

The documentation site has been successfully set up based on the Syntax template by Tailwind CSS.

## What Has Been Done

### 1. Template Adaptation
- ✅ Copied Syntax TypeScript template to `/home/productsmanager/docs-site/`
- ✅ Updated `package.json` with Product Manager APP branding
- ✅ Added `next-intl` for internationalization (FR/EN)
- ✅ Configured Markdoc for MDX support
- ✅ Set up FlexSearch for documentation search

### 2. Navigation Structure
Updated `src/lib/navigation.ts` with complete documentation hierarchy:

```
/docs/getting-started/
  ├─ introduction       # Platform overview and capabilities
  ├─ quick-start        # 10-minute getting started guide
  └─ installation       # Full installation instructions

/docs/features/
  ├─ import-centralisation  # Automated supplier imports
  ├─ ai-enrichment          # AI-powered content generation
  ├─ ean-manager            # Barcode management & ASIN lookup
  ├─ market-intelligence    # Price tracking & analytics
  └─ connectors             # E-commerce integrations

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

### 3. Documentation Content (Ready for Customization)

The site uses the Syntax template structure with placeholder content. You can now:

1. **Adapt Each Page**: Replace template examples with Product Manager APP content
2. **Add Code Examples**: Include real API examples from `/home/productsmanager/Suppliers-Import/api/`
3. **Add Screenshots**: Place images in `public/` directory
4. **Customize Styling**: Edit Tailwind config and components

### 4. Configuration Files

**package.json**
```json
{
  "name": "productsmanager-docs",
  "version": "1.0.0",
  "description": "Documentation site for Product Manager APP"
}
```

**next.config.mjs**
- Markdoc integration
- Search plugin configuration
- MDX support for .md files

**src/lib/navigation.ts**
- Complete navigation structure
- Links to all documentation sections

## Next Steps

### 1. Customize Content

Replace template pages with Product Manager APP documentation:

```bash
# Example: Update introduction page
nano src/app/docs/getting-started/introduction/page.md
```

Each page follows this format:
```markdown
---
title: Page Title
---

Your lead paragraph. {% .lead %}

## Section Title

Content goes here...
```

### 2. Add Real API Examples

Extract API endpoints from backend:
```bash
# Review backend routers
ls /home/productsmanager/Suppliers-Import/api/routers/

# Add examples to docs/api/endpoints/page.md
```

### 3. Configure i18n (Optional)

To add French translations:

1. Create message files:
```bash
mkdir messages
cat > messages/en.json << 'EOF'
{
  "nav": {
    "home": "Home",
    "docs": "Documentation"
  }
}
EOF

cat > messages/fr.json << 'EOF'
{
  "nav": {
    "home": "Accueil",
    "docs": "Documentation"
  }
}
EOF
```

2. Configure middleware for locale routing
3. Update components to use `useTranslations()` hook

### 4. Development Workflow

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
# -> http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start
```

### 5. Deployment Options

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /home/productsmanager/docs-site
vercel --prod
```

**Option B: Docker**
```bash
# Build image
docker build -t productsmanager-docs .

# Run container
docker run -p 3000:3000 productsmanager-docs
```

**Option C: Static Export**
```bash
# Generate static HTML
npm run build
# Deploy the `out/` directory to any static host
```

### 6. Domain Configuration

Point `docs.productsmanager.app` to your deployment:

**For Vercel:**
1. Add domain in Vercel dashboard
2. Configure DNS A record: `docs.productsmanager.app` → Vercel IP

**For Self-Hosting:**
1. Configure Nginx/Apache reverse proxy
2. Set up SSL with Let's Encrypt
3. Point DNS to your server

## Customization Guide

### Update Branding

**Logo**: Replace `src/components/Logo.tsx`
```tsx
export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg {...props}>
      {/* Your logo SVG */}
    </svg>
  )
}
```

**Colors**: Edit Tailwind config
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#your-brand-color',
    },
  },
}
```

**Favicon**: Replace `src/app/favicon.ico`

### Add New Pages

1. Create folder: `src/app/docs/[section]/[page]/`
2. Add `page.md` with frontmatter
3. Update `src/lib/navigation.ts`

Example:
```bash
mkdir -p src/app/docs/tutorials/first-tutorial
cat > src/app/docs/tutorials/first-tutorial/page.md << 'EOF'
---
title: My First Tutorial
---

Tutorial content here. {% .lead %}
EOF
```

## Available MDX Components

The template includes these custom components:

```markdown
# Quick Links
{% quick-links %}
{% quick-link title="Link Title" icon="installation" href="/path" description="..." /%}
{% /quick-links %}

# Callouts
{% callout type="warning" title="Warning Title" %}
Important message here.
{% /callout %}

# Code Blocks with Syntax Highlighting
```python
def hello():
    print("Hello, World!")
```
```

## Search Configuration

FlexSearch is pre-configured. To rebuild search index:
```bash
npm run build
```

The search indexes all markdown content automatically.

## Performance Optimizations

The site includes:
- ✅ Image optimization with Next.js Image
- ✅ Code splitting
- ✅ Route prefetching
- ✅ Static generation
- ✅ Minified CSS/JS

## Monitoring

Add analytics:

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics (built-in)
npm i @vercel/analytics
```

## Support Resources

- **Template Docs**: https://tailwindcss.com/templates/syntax
- **Next.js Docs**: https://nextjs.org/docs
- **Markdoc Docs**: https://markdoc.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs

## Project Structure

```
docs-site/
├── src/
│   ├── app/
│   │   ├── docs/          # Documentation pages (Markdoc)
│   │   ├── layout.tsx     # Root layout
│   │   └── page.md        # Homepage
│   ├── components/        # React components
│   ├── lib/
│   │   ├── navigation.ts  # Navigation config
│   │   └── sections.ts    # Section helpers
│   └── markdoc/          # Markdoc schema and plugins
├── public/               # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

## Status

✅ **Ready for customization**
✅ **Build successful**
✅ **All dependencies installed**
✅ **Navigation configured**
✅ **Search enabled**
✅ **Template structure in place**

## Next Action Items

1. **Content Migration**: Replace template content with Product Manager APP docs
2. **API Documentation**: Add real endpoints from backend
3. **Screenshots**: Capture and add UI screenshots
4. **Examples**: Add code examples and tutorials
5. **Translations**: Set up FR/EN translations
6. **Deploy**: Choose deployment method and publish

---

Built with ❤️ using [Syntax](https://tailwindcss.com/templates/syntax) by Tailwind CSS
