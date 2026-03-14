---
title: Intégration BigCommerce
nextjs:
  metadata:
    title: Intégration BigCommerce
    description: Guide complet pour intégrer Products Manager avec BigCommerce via l'API V3
---

Synchronisez vos produits, stocks et prix entre Products Manager et BigCommerce via l'API V3 avec authentification X-Auth-Token. {% .lead %}

---

## Vue d'ensemble

L'intégration BigCommerce exploite l'API V3 de BigCommerce, nativement conçue pour la gestion de catalogues produits. BigCommerce supporte nativement le champ `gtin` pour les EAN, ce qui simplifie la synchronisation.

### Fonctionnalités principales

- **Push/pull produits** : synchronisation bidirectionnelle du catalogue
- **EAN natif** : champ `gtin` BigCommerce = EAN Products Manager
- **Push stock** : mise à jour des `inventory_level` par variante
- **Push prix** : synchronisation des prix de vente
- **Webhooks entrants** : réception des événements `store/product/*`
- **Variants** : support des produits avec variantes

---

## Prérequis

- Compte BigCommerce actif (Standard, Plus, Pro ou Enterprise)
- Accès aux paramètres de développement BigCommerce
- **API Credentials** :
  - `store_hash` : identifiant unique de votre boutique
  - `client_id` : ID de l'API account
  - `access_token` : token d'authentification

---

## Obtenir les credentials BigCommerce

1. Connectez-vous à votre **Control Panel BigCommerce** (`store-{hash}.mybigcommerce.com/manage`)
2. Allez dans **Advanced Settings** → **API Accounts**
3. Cliquez sur **Create API Account** → **Create V2/V3 API Token**
4. Donnez un nom : `Products Manager`
5. Sélectionnez les scopes OAuth :
   - **Products** : Read-Write
   - **Information & Settings** : Read-Only
   - **Store Inventory** : Read-Write
6. Cliquez sur **Save**
7. Copiez les credentials affichés (**une seule fois**) :
   - `store_hash` (visible dans l'URL : `store-XXXXX`)
   - `client_id`
   - `access_token`

---

## Configuration dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → BigCommerce** (v4.9.0+) :

```json
{
  "platform_id": "bigcommerce",
  "name": "BigCommerce Production",
  "credentials": {
    "store_hash": "abc123xyz",
    "client_id": "xxxxxxxxxxxxxxxxxxxxxx",
    "access_token": "yyyyyyyyyyyyyyyyyyyyyy"
  }
}
```

L'API BigCommerce est accessible à l'URL : `https://api.bigcommerce.com/stores/{store_hash}/v3/`

---

## Fonctionnalités

### Champs synchronisés

| Products Manager | BigCommerce | Direction |
|-----------------|-------------|-----------|
| `title` | `name` | ↔ Bidirectionnelle |
| `ean` | `gtin` | ↔ Bidirectionnelle |
| `manufacturer_reference` | `mpn` | ↔ Bidirectionnelle |
| `price_ttc` | `price` | ↔ Bidirectionnelle |
| `price_ht` | `cost_price` | → PM → BigCommerce |
| `brand_name` | `brand_name` | → PM → BigCommerce |
| `description` | `description` | ↔ Bidirectionnelle |
| `stock` | `inventory_level` | ↔ Bidirectionnelle |
| `weight` | `weight` | ↔ Bidirectionnelle |
| `is_active` | `is_visible` | ↔ Bidirectionnelle |

### Push produits (PM → BigCommerce)

```http
POST https://api.bigcommerce.com/stores/{store_hash}/v3/catalog/products
X-Auth-Token: {access_token}
Content-Type: application/json
```

### Pull produits (BigCommerce → PM)

```http
GET https://api.bigcommerce.com/stores/{store_hash}/v3/catalog/products?include=images,variants
X-Auth-Token: {access_token}
```

### Push stock

```http
PUT https://api.bigcommerce.com/stores/{store_hash}/v3/catalog/products/{product_id}/variants/{variant_id}
X-Auth-Token: {access_token}
Content-Type: application/json

{
  "inventory_level": 50
}
```

---

## Webhooks entrants

BigCommerce peut notifier Products Manager lors d'événements produits.

### Configurer les webhooks dans BigCommerce

```http
POST https://api.bigcommerce.com/stores/{store_hash}/v2/hooks
X-Auth-Token: {access_token}
Content-Type: application/json

{
  "scope": "store/product/created",
  "destination": "https://api.productsmanager.app/api/v1/connectors/bigcommerce/webhook",
  "is_active": true
}
```

### Événements supportés

| Événement BigCommerce | Action Products Manager |
|----------------------|------------------------|
| `store/product/created` | Importe le nouveau produit |
| `store/product/updated` | Met à jour le produit |
| `store/product/deleted` | Archive le produit |
| `store/product/inventory/updated` | Met à jour le stock |

### Endpoint webhook PM

```http
POST /api/v1/connectors/bigcommerce/webhook
```

Les webhooks BigCommerce sont signés avec un `client_secret` — Products Manager vérifie la signature automatiquement.

---

## Limites et quotas

BigCommerce impose des rate limits selon le plan :

| Plan | Limite | Burst |
|------|--------|-------|
| **Standard** | 150 req / 30s | oui |
| **Plus** | 150 req / 30s | oui |
| **Pro** | 400 req / 30s | oui |
| **Enterprise** | Configurable | oui |

**Gestion par Products Manager :**
- Respect automatique des headers `X-Rate-Limit-Requests-Left` et `X-Rate-Limit-Time-Reset-Ms`
- Retry avec backoff exponentiel en cas de `429 Too Many Requests`
- Synchronisation en batch de 10 produits par appel (endpoint bulk BigCommerce V3)

---

## Troubleshooting

### 401 Unauthorized

Vérifiez que votre `access_token` est correct et non révoqué dans BigCommerce → Advanced Settings → API Accounts.

### Produit créé sans stock

BigCommerce dissocie la gestion stock du produit principal. Assurez-vous que l'option **Inventory Tracking** est activée sur le produit (`inventory_tracking: "product"` ou `"variant"`).

### GTIN non accepté

BigCommerce valide le format GTIN (EAN-8, EAN-13, UPC-12). Vérifiez que vos EAN sont valides avant push via le module EAN Lookup de Products Manager.

---

## Ressources

- [BigCommerce API V3 Reference](https://developer.bigcommerce.com/api-reference)
- [BigCommerce Webhooks](https://developer.bigcommerce.com/api-docs/store-management/webhooks/overview)
- [BigCommerce OAuth Scopes](https://developer.bigcommerce.com/api-docs/getting-started/authentication#oauth-scopes)
