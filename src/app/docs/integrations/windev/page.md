---
title: Intégration WinDev
nextjs:
  metadata:
    title: Intégration WinDev - Products Manager APP
    description: Guide complet pour connecter WinDev à Products Manager via l'API dédiée X-API-Key avec format de réponse WinDev-friendly.
---

Connectez vos applications WinDev à Products Manager pour une synchronisation bidirectionnelle des produits, stocks et prix via une API dédiée. {% .lead %}

---

## Vue d'Ensemble

L'intégration WinDev expose un ensemble d'endpoints optimisés pour les clients WinDev :

- **Format de réponse unifié** adapté à la gestion WinDev
- **Authentification X-API-Key** (pas de refresh token à gérer)
- **Bidirectionnel complet** : lecture ET écriture depuis WinDev
- **Rate limiting configurable** par clé avec headers `X-RateLimit-*`
- **Webhooks** : notifications temps réel vers WinDev lors des mises à jour PM

### Architecture

```
WinDev ──────── GET /windev/products ──────────▶ ProductsManager
WinDev ◀─────── Réponse 65 champs ────────────── ProductsManager

WinDev ──────── PATCH /windev/products/{ref} ──▶ ProductsManager
WinDev ──────── POST /windev/stock/update ─────▶ ProductsManager

ProductsManager ─── POST webhook ──────────────▶ URL WinDev
                    (product.updated, stock.updated, price.updated...)
```

---

## Prérequis

1. **Créer une clé API** dans ProductsManager (`/settings/api-keys` ou via API)
2. Attribuer les scopes `windev:read`, `windev:write`, `windev:sync`
3. (Optionnel) Configurer un webhook vers votre URL WinDev

---

## Création d'une Clé API WinDev

```bash
POST https://staging-api.productsmanager.app/api/v1/api-keys
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "WinDev ERP Production",
  "scopes": ["windev:read", "windev:write", "windev:sync"],
  "rate_limit_per_minute": 300,
  "expires_at": null
}
```

Réponse (conservez `key` — affiché une seule fois) :

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "WinDev ERP Production",
  "key": "pm_live_a1b2c3d4e5f6...",
  "scopes": ["windev:read", "windev:write", "windev:sync"],
  "rate_limit_per_minute": 300
}
```

---

## Endpoints Disponibles

| Endpoint | Méthode | Scope | Description |
|----------|---------|-------|-------------|
| `/api/v1/windev/status` | GET | — | Health check public |
| `/api/v1/windev/products` | GET | windev:read | Liste paginée (sync initiale) |
| `/api/v1/windev/products/since/{ts}` | GET | windev:read | Modifiés depuis timestamp Unix |
| `/api/v1/windev/products/{ref}` | GET | windev:read | Par EAN ou référence |
| `/api/v1/windev/products/{ref}` | PATCH | windev:write | Mise à jour individuelle |
| `/api/v1/windev/products/{ref}/activate` | POST | windev:write | Réactivation |
| `/api/v1/windev/products/{ref}/deactivate` | POST | windev:write | Désactivation |
| `/api/v1/windev/products/sync` | POST | windev:sync | Sync batch (max 1000) |
| `/api/v1/windev/stock/update` | POST | windev:write | MAJ stocks (max 5000) |
| `/api/v1/windev/prices/update` | POST | windev:write | MAJ prix (max 5000) |
| `/api/v1/windev/categories` | GET | windev:read | Arbre catégories |
| `/api/v1/windev/suppliers` | GET | windev:read | Liste fournisseurs |

---

## Format de Réponse

Tous les endpoints retournent ce format unifié :

```json
{
  "success": true,
  "code": 200,
  "message": "OK",
  "data": [...],
  "count": 42
}
```

### Champs Produit Disponibles (65 champs)

Les réponses produit exposent l'ensemble du catalogue de champs :

```json
{
  "id": "uuid",
  "ean": "3700685406001",
  "manufacturer_reference": "REF-WD-001",
  "external_id": "WD-12345",
  "name": "Câble HDMI 2m",
  "brand": "LogiTech",
  "status": "active",
  "is_active": true,
  "description": "Câble HDMI haute vitesse...",
  "weight": 0.15,
  "width": null,
  "height": null,
  "depth": null,
  "tax_rate": 20.0,
  "price_ht": 8.50,
  "price_ttc": 10.20,
  "stock": 250,
  "created_at": "2025-01-15T09:00:00Z",
  "updated_at": "2026-03-06T08:30:00Z",
  "... 35+ autres champs"
}
```

---

## Synchronisation Initiale (WinDev → PM)

Pour importer l'ensemble des produits WinDev dans ProductsManager :

```bash
POST https://staging-api.productsmanager.app/api/v1/windev/products/sync
X-API-Key: pm_live_...
Content-Type: application/json

{
  "items": [
    {
      "reference": "REF-WD-001",
      "ean": "3700685406001",
      "name": "Câble HDMI 2m",
      "brand": "LogiTech",
      "description": "Câble HDMI haute vitesse 4K",
      "weight": 0.15,
      "price_ht": 8.50,
      "price_ttc": 10.20,
      "stock": 250,
      "supplier_code": "KIMEX"
    }
  ]
}
```

Réponse :

```json
{
  "success": true,
  "code": 200,
  "message": "OK",
  "data": [
    {"ref": "REF-WD-001", "status": "created", "id": "uuid", "ean": "3700685406001"},
    {"ref": "REF-WD-002", "status": "updated", "id": "uuid", "ean": null}
  ],
  "count": 2
}
```

**Matching** (par priorité) :
1. EAN normalisé (GTIN-13)
2. `manufacturer_reference`
3. Création si aucun match

---

## Synchronisation Incrémentale

Pour récupérer uniquement les produits modifiés depuis la dernière sync :

```bash
GET https://staging-api.productsmanager.app/api/v1/windev/products/since/1741219200
X-API-Key: pm_live_...
```

`1741219200` = timestamp Unix de la dernière synchronisation.

Réponse paginée :

```json
{
  "success": true,
  "code": 200,
  "data": {
    "products": [...],
    "total": 15,
    "page": 1,
    "limit": 100,
    "pages": 1
  }
}
```

---

## Mise à Jour Stock Batch

```bash
POST https://staging-api.productsmanager.app/api/v1/windev/stock/update
X-API-Key: pm_live_...
Content-Type: application/json

{
  "items": [
    {"ean": "3700685406001", "stock": 250, "supplier_code": "KIMEX"},
    {"ean": "3700685406018", "stock": 0}
  ]
}
```

- Si `supplier_code` fourni et fournisseur reconnu : mise à jour `SupplierProduct.stock_quantity`
- Sinon : mise à jour `ProductStock.quantity`

---

## Mise à Jour Prix Batch

```bash
POST https://staging-api.productsmanager.app/api/v1/windev/prices/update
X-API-Key: pm_live_...
Content-Type: application/json

{
  "items": [
    {"ean": "3700685406001", "price_ttc": 12.50, "price_ht": 10.42},
    {"ean": "3700685406018", "price_ttc": 8.99}
  ]
}
```

- Stocké dans `ProductPrice` (type `retail`, actif)
- `price_ttc` → `ProductPrice.price`, `price_ht` → `ProductPrice.cost`

---

## Activation / Désactivation

```bash
# Désactiver un produit
POST https://staging-api.productsmanager.app/api/v1/windev/products/REF-WD-001/deactivate
X-API-Key: pm_live_...

# Réactiver
POST https://staging-api.productsmanager.app/api/v1/windev/products/REF-WD-001/activate
X-API-Key: pm_live_...
```

{% callout type="note" title="Produits inactifs accessibles" %}
`GET /windev/products/{ref}` retourne les produits actifs ET inactifs, ce qui permet à WinDev de lire un produit désactivé avant de le réactiver.
{% /callout %}

---

## Webhooks vers WinDev

Pour recevoir des notifications ProductsManager dans WinDev, configurez un webhook :

```bash
POST https://staging-api.productsmanager.app/api/v1/webhooks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "url": "https://votre-serveur-windev.com/pm-webhook",
  "events": ["product.updated", "stock.updated", "price.updated", "import.completed"],
  "secret": "votre_secret_hmac",
  "active": true
}
```

### Événements Utiles pour WinDev

| Événement | Quand |
|-----------|-------|
| `product.updated` | Modification produit (depuis l'UI, imports, PATCH API) |
| `product.batch_sync` | Fin de sync batch WinDev |
| `stock.updated` | MAJ stock batch (source WinDev) |
| `price.updated` | MAJ prix batch (source WinDev) |
| `import.completed` | Import fournisseur terminé |
| `supplier.created` | Nouveau fournisseur |

Chaque payload est signé : `X-PM-Signature: sha256=<hmac>`. Voir [Webhooks](/docs/api/webhooks) pour la vérification.

---

## Rate Limiting

Les headers `X-RateLimit-*` sont présents sur chaque réponse :

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 284
X-RateLimit-Reset: 1741302060
```

En cas de dépassement :

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

Voir [Rate Limiting par Clé API](/docs/api/rate-limiting#rate-limiting-par-cle-api).

---

## Codes d'Erreur

| Code | Signification | Action |
|------|--------------|--------|
| `401` | Clé API invalide ou expirée | Vérifier la clé / rotation |
| `403` | Scope insuffisant | Ajouter le scope manquant à la clé |
| `404` | Produit introuvable | Vérifier EAN ou reference |
| `422` | Données invalides | Vérifier le format du body |
| `429` | Rate limit dépassé | Attendre `Retry-After` secondes |
| `503` | Serveur indisponible | Retry avec backoff exponentiel |

---

## Ressources Associées

- [Authentification API Keys](/docs/api/authentication#authentification-par-cle-api-x-api-key)
- [Rate Limiting par Clé](/docs/api/rate-limiting#rate-limiting-par-cle-api)
- [Webhooks Sortants](/docs/api/webhooks)
- [Intégration Odoo](/docs/integrations/odoo)
- [Intégration PrestaShop](/docs/integrations/prestashop)
