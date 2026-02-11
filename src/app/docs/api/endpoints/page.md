---
title: Endpoints API
nextjs:
  metadata:
    title: Endpoints API - Products Manager APP
    description: Documentation complète des endpoints REST de l'API Products Manager.
---

L'API Products Manager v4.5.58 expose 47+ routeurs REST pour gérer produits, fournisseurs, imports, IA, prix et analytics. La plupart des endpoints nécessitent une authentification JWT (sauf health checks et modules status). {% .lead %}

---

## Base URL

```text
Production: https://api.productsmanager.app/api/v1
Staging: https://staging-api.productsmanager.app/api/v1
```

---

## Produits

### GET /products

Liste tous les produits avec pagination et filtres.

#### Paramètres Query

| Paramètre | Type | Description |
|-----------|------|-------------|
| page | integer | Numéro de page (défaut: 1) |
| page_size | integer | Éléments par page (défaut: 20, max: 100) |
| search | string | Recherche textuelle (nom, SKU, description) |
| supplier_id | integer | Filtrer par fournisseur |
| status | string | Filtrer par statut (active, inactive, draft) |
| sort_by | string | Champ de tri (name, price, created_at) |
| order | string | Ordre de tri (asc, desc) |

#### Exemple de requête

```bash
curl -X GET "https://api.productsmanager.app/api/v1/products?page=1&page_size=50&status=active&sort_by=created_at&order=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Réponse

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1234,
        "sku": "PROD-001",
        "name": "Produit Exemple",
        "description": "Description du produit",
        "price": 29.99,
        "stock": 150,
        "supplier_id": 42,
        "status": "active",
        "images": ["https://cdn.example.com/img1.jpg"],
        "created_at": "2025-10-01T10:30:00Z",
        "updated_at": "2025-10-05T14:20:00Z"
      }
    ],
    "total": 1250,
    "page": 1,
    "page_size": 50,
    "total_pages": 25
  }
}
```

---

### GET /products/{product_id}

Récupère les détails d'un produit spécifique.

#### Exemple de requête

```bash
curl -X GET "https://api.productsmanager.app/api/v1/products/1234" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST /products

Crée un nouveau produit.

#### Body (JSON)

```json
{
  "sku": "PROD-NEW-001",
  "name": "Nouveau Produit",
  "description": "Description complète",
  "price": 49.99,
  "stock": 100,
  "supplier_id": 42,
  "images": ["https://example.com/image.jpg"],
  "attributes": {
    "color": "blue",
    "size": "M"
  }
}
```

#### Exemple de requête

```bash
curl -X POST "https://api.productsmanager.app/api/v1/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD-NEW-001",
    "name": "Nouveau Produit",
    "price": 49.99,
    "stock": 100,
    "supplier_id": 42
  }'
```

---

### PUT /products/{product_id}

Met à jour un produit existant.

#### Exemple de requête

```bash
curl -X PUT "https://api.productsmanager.app/api/v1/products/1234" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 39.99, "stock": 200}'
```

---

### DELETE /products/{product_id}

Supprime un produit.

```bash
curl -X DELETE "https://api.productsmanager.app/api/v1/products/1234" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST /products/bulk

Import en masse de produits (max 10 000 produits par requête).

#### Body (JSON)

```json
{
  "products": [
    {"sku": "SKU-001", "name": "Produit 1", "price": 19.99},
    {"sku": "SKU-002", "name": "Produit 2", "price": 29.99}
  ],
  "update_existing": true
}
```

---

## Fournisseurs

### GET /suppliers

Liste tous les fournisseurs.

#### Paramètres Query

| Paramètre | Type | Description |
|-----------|------|-------------|
| page | integer | Numéro de page |
| page_size | integer | Éléments par page |
| status | string | Filtrer par statut (active, inactive) |

#### Exemple de requête

```bash
curl -X GET "https://api.productsmanager.app/api/v1/suppliers" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST /suppliers

Crée un nouveau fournisseur.

#### Body (JSON)

```json
{
  "name": "Fournisseur XYZ",
  "email": "contact@fournisseur.com",
  "import_type": "csv",
  "import_config": {
    "delimiter": ";",
    "encoding": "utf-8",
    "mapping": {
      "ref": "sku",
      "nom": "name",
      "prix": "price"
    }
  }
}
```

---

### GET /suppliers/{supplier_id}/products

Liste les produits d'un fournisseur spécifique.

```bash
curl -X GET "https://api.productsmanager.app/api/v1/suppliers/42/products" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Imports

### GET /imports/jobs

Liste tous les jobs d'import.

#### Paramètres Query

| Paramètre | Type | Description |
|-----------|------|-------------|
| status | string | Filtrer par statut (pending, running, completed, failed) |
| supplier_id | integer | Filtrer par fournisseur |
| date_from | string | Date de début (ISO 8601) |
| date_to | string | Date de fin (ISO 8601) |

---

### POST /imports/create

Crée un nouveau job d'import.

#### Body (JSON)

```json
{
  "supplier_id": 42,
  "import_type": "full",
  "file_url": "https://cdn.example.com/import.csv",
  "scheduled_at": "2025-10-06T02:00:00Z"
}
```

---

### POST /imports/{job_id}/start

Démarre un import manuel.

```bash
curl -X POST "https://api.productsmanager.app/api/v1/imports/789/start" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /imports/{job_id}/logs

Récupère les logs d'un import.

#### Réponse

```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "timestamp": "2025-10-05T10:30:15Z",
        "level": "info",
        "message": "Import started: 5000 products to process"
      },
      {
        "timestamp": "2025-10-05T10:32:45Z",
        "level": "warning",
        "message": "Duplicate SKU detected: PROD-123"
      }
    ]
  }
}
```

---

## Utilisateurs

### GET /admin/users

Liste tous les utilisateurs (admin uniquement).

#### Exemple de requête

```bash
curl -X GET "https://api.productsmanager.app/api/v1/admin/users" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### POST /admin/users

Crée un nouvel utilisateur (admin uniquement).

#### Body (JSON)

```json
{
  "email": "newuser@example.com",
  "name": "John Doe",
  "role": "user",
  "password": "SecurePass123!"
}
```

---

## Analytics

### GET /analytics/dashboard

Récupère les métriques du dashboard principal.

#### Réponse

```json
{
  "status": "success",
  "data": {
    "total_products": 12500,
    "active_suppliers": 45,
    "imports_today": 8,
    "imports_success_rate": 98.5,
    "recent_activity": [
      {
        "type": "import.completed",
        "timestamp": "2025-10-05T14:30:00Z",
        "details": "Import from Supplier XYZ: 1200 products"
      }
    ]
  }
}
```

---

### GET /analytics/imports

Métriques détaillées des imports.

#### Paramètres Query

| Paramètre | Type | Description |
|-----------|------|-------------|
| date_from | string | Date de début (ISO 8601) |
| date_to | string | Date de fin (ISO 8601) |
| supplier_id | integer | Filtrer par fournisseur |

---

## Pagination

Tous les endpoints paginés retournent une structure standard :

```json
{
  "items": [...],
  "total": 1000,
  "page": 1,
  "page_size": 20,
  "total_pages": 50
}
```

### Limites

- **Page size max**: 100 éléments
- **Page size par défaut**: 20 éléments

---

## Filtres et Tri

### Filtrage Multiple

Combinez plusieurs filtres avec `&` :

```text
GET /products?status=active&supplier_id=42&price_min=10&price_max=100
```

### Tri

Utilisez `sort_by` et `order` :

```text
GET /products?sort_by=price&order=desc
```

Champs triables courants : `name`, `price`, `stock`, `created_at`, `updated_at`

---

## Codes d'Erreur HTTP

| Code | Nom | Description |
|------|-----|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Paramètres invalides |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Ressource introuvable |
| 409 | Conflict | Conflit (ex: SKU dupliqué) |
| 422 | Unprocessable Entity | Validation échouée |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Internal Server Error | Erreur serveur |

### Exemple de Réponse d'Erreur

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ 'price' doit être un nombre positif",
    "details": {
      "field": "price",
      "value": -10,
      "constraint": "positive"
    }
  }
}
```

---

## Rate Limiting

L'API applique des limites de requêtes par tiers pour garantir la stabilité :

| Tier | Limite | Exemples |
|------|--------|----------|
| Critical (Auth) | 5/minute | /auth/login, /auth/register |
| Critical (Bulk) | 500/minute | /imports, /exports bulk |
| Critical (AI) | 1/heure (batch), 20/min (single) | /enrichment |
| High (Write) | 100/minute | POST/PUT/DELETE operations |
| Medium (Read) | 1000/minute | GET operations |
| Low (Public) | 1000/minute | /health, /modules/status |

Voir [Rate Limiting](/docs/api/rate-limiting) pour la documentation complete.

### Headers de Rate Limit

Chaque réponse inclut :

```text
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1728134400
```

{% callout type="warning" %}
Si vous dépassez la limite, vous recevrez une erreur **429 Too Many Requests**. Attendez jusqu'au timestamp de `X-RateLimit-Reset` avant de réessayer.
{% /callout %}

---

---

## Modules API Complets (47+ routeurs)

Products Manager v4.5.58 expose 47+ routeurs API organises par domaine fonctionnel. Voici la liste complete :

### Authentification & Utilisateurs

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `auth` | `/api/v1/auth` | Login, register, refresh, logout, password reset |
| `users` | `/api/v1/users` | Gestion utilisateurs (CRUD, profils) |
| `admin` | `/api/v1/admin` | Panel administration |

### Produits & Catalogue

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `products` | `/api/v1/products` | CRUD produits, recherche, filtres, bulk operations |
| `brands` | `/api/v1/brands` | Gestion marques (harmonisation, aliases, doublons, fusion) |
| `categories` | `/api/v1/categories` | Categories produits |
| `categories_manager` | `/api/v1/categories-manager` | Gestionnaire avance de taxonomies |
| `tags` | `/api/v1/tags` | Tags produits |

### Fournisseurs

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `suppliers` | `/api/v1/suppliers` | CRUD fournisseurs |
| `supplier_history` | `/api/v1/supplier-history` | Historique fournisseurs |

### Imports & Exports

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `imports` | `/api/v1/imports` | Jobs d'import, upload, traitement |
| `import_configs` | `/api/v1/import-configs` | Configurations d'import par fournisseur |
| `mapping_templates` | `/api/v1/mapping-templates` | Templates de mapping reutilisables |
| `exports` | `/api/v1/exports` | Jobs d'export |
| `export_platforms` | `/api/v1/export-platforms` | Configuration plateformes export |

### Media & Fichiers

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `media` | `/api/v1/media` | Gestion fichiers media (MinIO) |
| `product_images` | `/api/v1/product-images` | Images produits |
| `files` | `/api/v1/files` | File explorer |
| `storage` | `/api/v1/storage` | Operations stockage MinIO |

### Amazon & Code2ASIN

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `code2asin` | `/api/v1/code2asin` | Jobs Code2ASIN, resultats, statistiques |
| `amazon_api` | `/api/v1/amazon` | Configuration API Amazon |

### EAN & Barcode

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `ean_lookup` | `/api/v1/ean-lookup` | Recherche EAN/barcode |
| `ean_lookup_search` | `/api/v1/ean-search` | Recherche EAN avancee |

### Intelligence Artificielle

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `enrichment` | `/api/v1/enrichment` | Enrichissement IA (batch, unitaire) |
| `ai_providers` | `/api/v1/ai-providers` | Configuration fournisseurs IA (OpenAI, Anthropic) |

### Icecat

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `icecat` | `/api/v1/icecat` | Enrichissement Icecat |

### Integrations ERP

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `odoo` | `/api/v1/odoo` | Synchronisation Odoo ERP |
| `prestashop` | `/api/v1/prestashop` | Synchronisation PrestaShop |

### Prix & Concurrence

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `price_monitor` | `/api/v1/prices` | Price Monitor (dashboard, monitored, competitors, validation, history) |
| `price_tracking` | `/api/v1/price-tracking` | Suivi prix |

### Analytics & Rapports

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `analytics` | `/api/v1/analytics` | Metriques et analytics |
| `dashboard` | `/api/v1/dashboard` | Donnees dashboard |
| `reports` | `/api/v1/reports` | Generation rapports |

### Recherche

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `search` | `/api/v1/search` | Recherche Meilisearch (avec fallback PostgreSQL) |

### Systeme & Configuration

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `settings` | `/api/v1/settings` | Parametres application |
| `modules` | `/api/v1/modules` | Gestion des 17 modules (status, enable/disable, order) |
| `notifications` | `/api/v1/notifications` | Notifications utilisateur |
| `email_settings` | `/api/v1/email-settings` | Configuration email |

### Monitoring & Performance

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `health` | `/health` | Health checks (API, DB, Redis, Celery) |
| `monitoring` | `/api/v1/monitoring` | Metriques systeme |
| `performance` | `/api/v1/performance` | Metriques performance |
| `error_monitoring` | `/api/v1/errors` | Monitoring erreurs |
| `cache` | `/api/v1/cache` | Gestion cache Redis |
| `security_dashboard` | `/api/v1/security` | Dashboard securite |

### Divers

| Routeur | Prefix | Description |
|---------|--------|-------------|
| `business` | `/api/v1/business` | Logique metier |
| `multidb` | `/api/v1/multidb` | Operations cross-database |
| `product_sourcing` | `/api/v1/sourcing` | Sourcing produits |
| `bucket_config` | `/api/v1/buckets` | Configuration buckets MinIO |

## Ressources Associées

- [Authentification API](/docs/api/authentication)
- [Webhooks](/docs/api/webhooks)
- [Sécurité](/docs/technical/security)
