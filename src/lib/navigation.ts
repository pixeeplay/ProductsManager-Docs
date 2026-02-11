export type NavigationGroup = {
  group: string
}

export type NavigationSection = {
  title: string
  links: Array<{ title: string; href: string }>
}

export type NavigationItem = NavigationGroup | NavigationSection

export function isGroup(item: NavigationItem): item is NavigationGroup {
  return 'group' in item
}

export const navigation: NavigationItem[] = [
  // ── Guide Utilisateur ──────────────────────────────
  { group: 'Guide Utilisateur' },
  {
    title: 'Demarrage',
    links: [
      { title: 'Bienvenue', href: '/docs/guide/bienvenue' },
      { title: 'Premiers Pas', href: '/docs/guide/premiers-pas' },
      { title: 'Tour de l\'Interface', href: '/docs/guide/interface' },
    ],
  },
  {
    title: 'Produits',
    links: [
      { title: 'Gestion des Produits', href: '/docs/guide/produits' },
      { title: 'Score de Completude', href: '/docs/guide/completude' },
      { title: 'Recherche Produits', href: '/docs/guide/recherche' },
    ],
  },
  {
    title: 'Imports & Fournisseurs',
    links: [
      { title: 'Gestion des Fournisseurs', href: '/docs/guide/fournisseurs' },
      { title: 'Importer des Produits', href: '/docs/guide/imports' },
      { title: 'Formats Supportes', href: '/docs/guide/formats-import' },
    ],
  },
  {
    title: 'Exports & Integrations',
    links: [
      { title: 'Exporter vos Produits', href: '/docs/guide/exports' },
      { title: 'Export Shopify', href: '/docs/guide/export-shopify' },
      { title: 'Export WooCommerce', href: '/docs/guide/export-woocommerce' },
      { title: 'Export PrestaShop', href: '/docs/guide/export-prestashop' },
      { title: 'Export Amazon', href: '/docs/guide/export-amazon' },
      { title: 'Synchronisation Odoo', href: '/docs/guide/sync-odoo' },
    ],
  },
  {
    title: 'Outils Avances',
    links: [
      { title: 'Enrichissement IA', href: '/docs/guide/enrichissement-ia' },
      { title: 'Price Monitor', href: '/docs/guide/price-monitor' },
      { title: 'Code2ASIN', href: '/docs/guide/code2asin' },
      { title: 'EAN Lookup', href: '/docs/guide/ean-lookup' },
      { title: 'Tableau de Bord', href: '/docs/guide/tableau-de-bord' },
    ],
  },
  {
    title: 'Administration',
    links: [
      { title: 'Utilisateurs et Roles', href: '/docs/guide/administration' },
      { title: 'Securite et Mot de Passe', href: '/docs/guide/securite' },
      { title: 'Configuration des Modules', href: '/docs/guide/modules' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { title: 'FAQ', href: '/docs/guide/faq' },
      { title: 'Resolution de Problemes', href: '/docs/guide/depannage' },
    ],
  },

  // ── Documentation Technique ────────────────────────
  { group: 'Documentation Technique' },
  {
    title: 'Getting Started',
    links: [
      { title: 'Introduction', href: '/docs/getting-started/introduction' },
      { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
    ],
  },
  {
    title: 'Features',
    links: [
      { title: 'Import Centralisation', href: '/docs/features/import-centralisation' },
      { title: 'AI Enrichment', href: '/docs/features/ai-enrichment' },
      { title: 'EAN Manager', href: '/docs/features/ean-manager' },
      { title: 'Market Intelligence', href: '/docs/features/market-intelligence' },
      { title: 'Odoo Integration', href: '/docs/features/odoo-integration' },
      { title: 'Code2ASIN', href: '/docs/features/code2asin' },
      { title: 'Thumbnail System', href: '/docs/features/thumbnails-system' },
    ],
  },
  {
    title: 'Modules',
    links: [
      { title: 'Systeme de Modules', href: '/docs/modules/module-system' },
      { title: 'Fournisseurs', href: '/docs/modules/suppliers' },
      { title: 'Imports', href: '/docs/modules/imports' },
      { title: 'Exports', href: '/docs/modules/exports' },
      { title: 'AI Enrichment', href: '/docs/modules/ai-enrichment' },
      { title: 'Price Monitor', href: '/docs/modules/price-monitor' },
      { title: 'Brand Manager', href: '/docs/modules/brand-manager' },
      { title: 'Categories Manager', href: '/docs/modules/categories-manager' },
      { title: 'Search Engine', href: '/docs/modules/search-engine' },
      { title: 'Completude', href: '/docs/modules/completeness' },
      { title: 'File Explorer', href: '/docs/modules/file-explorer' },
    ],
  },
  {
    title: 'API Reference',
    links: [
      { title: 'Overview', href: '/docs/api/overview' },
      { title: 'Authentication', href: '/docs/api/authentication' },
      { title: 'Rate Limiting', href: '/docs/api/rate-limiting' },
      { title: 'Permissions', href: '/docs/api/permissions' },
      { title: 'Endpoints', href: '/docs/api/endpoints' },
      { title: 'Webhooks', href: '/docs/api/webhooks' },
      { title: 'Errors', href: '/docs/api/errors' },
      { title: 'Examples', href: '/docs/api/examples' },
    ],
  },
  {
    title: 'Technical',
    links: [
      { title: 'Architecture', href: '/docs/technical/architecture' },
      { title: 'Database', href: '/docs/technical/database' },
      { title: 'Performance', href: '/docs/technical/performance' },
      { title: 'Caching', href: '/docs/technical/caching' },
      { title: 'Media Storage', href: '/docs/technical/media-storage' },
      { title: 'Deployment', href: '/docs/technical/deployment' },
      { title: 'Security', href: '/docs/technical/security' },
    ],
  },
  {
    title: 'MCP & AI',
    links: [
      { title: 'MCP Overview', href: '/docs/mcp/overview' },
      { title: 'MCP Servers', href: '/docs/mcp/servers' },
      { title: 'AI Providers', href: '/docs/mcp/ai-providers' },
    ],
  },
  {
    title: 'Data Model',
    links: [
      { title: 'Product Model', href: '/docs/data-model/product' },
    ],
  },
  {
    title: 'Integrations',
    links: [
      { title: 'Odoo ERP', href: '/docs/integrations/odoo' },
      { title: 'Amazon PA-API', href: '/docs/integrations/amazon-pa-api' },
      { title: 'MinIO', href: '/docs/integrations/minio' },
      { title: 'Shopify', href: '/docs/integrations/shopify' },
      { title: 'PrestaShop', href: '/docs/integrations/prestashop' },
      { title: 'WooCommerce', href: '/docs/integrations/woocommerce' },
      { title: 'Email Imports', href: '/docs/integrations/email-imports' },
    ],
  },
  {
    title: 'Releases',
    links: [
      { title: 'Changelog', href: '/docs/releases/changelog' },
      { title: 'v4.5.0', href: '/docs/releases/v4-5-0' },
      { title: 'v3.3.0', href: '/docs/releases/v3-3-0' },
      { title: 'v3.2.0', href: '/docs/releases/v3-2-0' },
      { title: 'Migration Guides', href: '/docs/releases/migration-guides' },
      { title: 'Roadmap', href: '/docs/releases/roadmap' },
    ],
  },
]
