---
title: Endpoints API
nextjs:
  metadata:
    title: Endpoints API - Products Manager APP
    description: Documentation complète des endpoints REST de l'API Products Manager.
---

L'API Products Manager expose des endpoints REST pour gérer produits, fournisseurs, imports et analytics. Tous les endpoints nécessitent une authentification JWT. {% .lead %}

---

## Base URL

```
Production: https://api.productsmanager.app/api/v1
Staging: https://api-staging.productsmanager.app/api/v1
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

```
GET /products?status=active&supplier_id=42&price_min=10&price_max=100
```

### Tri

Utilisez `sort_by` et `order` :

```
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

L'API applique des limites de requêtes pour garantir la stabilité :

| Endpoint Pattern | Limite |
|------------------|--------|
| /auth/* | 10 requêtes/minute |
| /imports/create | 5 requêtes/minute |
| /products/bulk | 5 requêtes/minute |
| /analytics/report | 10 requêtes/heure |
| Autres endpoints | 100 requêtes/minute |

### Headers de Rate Limit

Chaque réponse inclut :

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1728134400
```

{% callout type="warning" %}
Si vous dépassez la limite, vous recevrez une erreur **429 Too Many Requests**. Attendez jusqu'au timestamp de `X-RateLimit-Reset` avant de réessayer.
{% /callout %}

---

## Ressources Associées

- [Authentification API](/docs/api/authentication)
- [Webhooks](/docs/api/webhooks)
- [Sécurité](/docs/technical/security)
