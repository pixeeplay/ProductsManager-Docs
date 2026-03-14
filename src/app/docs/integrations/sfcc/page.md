---
title: Intégration Salesforce Commerce Cloud (SFCC)
nextjs:
  metadata:
    title: Intégration Salesforce Commerce Cloud
    description: Guide complet pour intégrer Products Manager avec Salesforce Commerce Cloud via OCAPI Data API v24.5
---

Synchronisez vos produits entre Products Manager et Salesforce Commerce Cloud (anciennement Demandware) via l'OCAPI Data API v24.5 avec OAuth2 client_credentials. {% .lead %}

---

## Vue d'ensemble

L'intégration Salesforce Commerce Cloud (SFCC) utilise l'Open Commerce API (OCAPI) Data API v24.5. L'authentification repose sur le flux OAuth2 `client_credentials` via Account Manager Salesforce.

### Fonctionnalités principales

- **Pull produits** : import depuis le catalogue SFCC (master products + variants)
- **Push produits** : création et mise à jour de produits via OCAPI
- **Push stock** : synchronisation des inventory lists
- **Push prix** : mise à jour des price books
- **Gestion des catalogues** : support de la structure master/variant SFCC

{% callout type="note" title="Architecture SFCC" %}
SFCC utilise une architecture de catalogue complexe : **Master Products** (produits parents) avec des **Variants** (combinaisons d'attributs). Products Manager mappe automatiquement cette structure lors de la synchronisation.
{% /callout %}

---

## Prérequis

- Instance SFCC active (sandbox ou production)
- Accès à **Business Manager** avec droits `Administrator`
- **API Client** configuré dans Account Manager Salesforce
- Informations :
  - `instance_url` : URL de votre instance SFCC (ex: `https://xxxx-001.dx.commercecloud.salesforce.com`)
  - `client_id` : ID du client API
  - `client_secret` : secret du client API
  - `site_id` : identifiant du site (ex: `SiteGenesis`)

---

## Configuration

### 1. Créer un API Client dans Business Manager

1. Connectez-vous à votre Business Manager
2. Allez dans **Administration** → **Site Development** → **Open Commerce API Settings**
3. Sélectionnez **Data** dans le type d'API
4. Ajoutez la configuration OCAPI pour autoriser Products Manager :

```json
{
  "clients": [
    {
      "client_id": "votre-client-id",
      "allowed_origins": ["https://api.productsmanager.app"],
      "resources": [
        {
          "resource_id": "/products",
          "methods": ["get", "patch", "post", "put"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/products/*",
          "methods": ["get", "patch", "put"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/catalogs/*",
          "methods": ["get"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        },
        {
          "resource_id": "/inventory_lists/*",
          "methods": ["get", "put"],
          "read_attributes": "(**)",
          "write_attributes": "(**)"
        }
      ]
    }
  ]
}
```

5. Dans **Account Manager Salesforce** (`https://account.demandware.com`), créez un API Client avec :
   - `client_id` (à définir)
   - `client_secret` (à générer)
   - Grant type : `client_credentials`

### 2. Configurer dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → Salesforce Commerce Cloud** (v4.9.0+) :

```json
{
  "platform_id": "sfcc",
  "name": "SFCC Production",
  "credentials": {
    "instance_url": "https://xxxx-001.dx.commercecloud.salesforce.com",
    "client_id": "aaaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    "client_secret": "votre_secret",
    "site_id": "RefArch"
  }
}
```

### 3. Authentification OAuth2

Products Manager obtient un token via :

```http
POST https://account.demandware.com/dwsso/oauth2/access_token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}
```

Le token est mis en cache et renouvelé automatiquement (durée de vie : 1800 secondes par défaut).

---

## Fonctionnalités

### Champs synchronisés

| Products Manager | SFCC OCAPI | Direction |
|-----------------|-----------|-----------|
| `title` | `name.default` | ↔ Bidirectionnelle |
| `description` | `long_description.default` | ↔ Bidirectionnelle |
| `manufacturer_reference` | `id` (product ID) | ↔ Bidirectionnelle |
| `brand_name` | `brand` | ↔ Bidirectionnelle |
| `ean` | `upc` | ↔ Bidirectionnelle |
| `price_ttc` | price book `list` | → PM → SFCC |
| `stock` | inventory list `allocation` | → PM → SFCC |
| `is_active` | `online_flag` | ↔ Bidirectionnelle |

### Endpoints OCAPI utilisés

```
GET  /s/{site_id}/dw/data/v24_5/products/{product_id}
POST /s/{site_id}/dw/data/v24_5/products/{product_id}
GET  /s/{site_id}/dw/data/v24_5/catalogs/{catalog_id}/products
PUT  /s/{site_id}/dw/data/v24_5/inventory_lists/{list_id}/product_inventory_records/{product_id}
PUT  /s/{site_id}/dw/data/v24_5/sites/{site_id}/price_books/{book_id}/price_tables/{product_id}
```

### Push stock (Inventory Lists)

```http
PUT /s/{site_id}/dw/data/v24_5/inventory_lists/{list_id}/product_inventory_records/{product_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "allocation": 50,
  "ats": 50,
  "perpetual": false
}
```

### Push prix (Price Books)

```http
PUT /s/{site_id}/dw/data/v24_5/price_books/{price_book_id}/price_tables/{product_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 29.99
}
```

---

## Limites et quotas

- **OCAPI rate limits** : dépend du contrat SFCC (en général 1000 req/min en production)
- **Taille de response** : pagination obligatoire (max 200 produits par page via `count` et `start`)
- **Write via OCAPI** : limité — Salesforce recommande **ImpEx** pour les imports bulk (>1000 produits)

{% callout type="warning" title="ImpEx pour les grands catalogues" %}
Pour les catalogues de plus de 1000 produits, Salesforce recommande d'utiliser **SFCC ImpEx** (import/export XML) plutôt que l'OCAPI. Products Manager peut générer des fichiers ImpEx XML compatibles — activez cette option dans les paramètres avancés de l'intégration.
{% /callout %}

---

## Troubleshooting

### invalid_client (401)

Vérifiez que votre `client_id` et `client_secret` sont corrects dans Account Manager. Assurez-vous que le grant type `client_credentials` est autorisé.

### 403 Forbidden sur les endpoints produits

Vérifiez la configuration OCAPI dans Business Manager. L'`allowed_client_id` doit correspondre à votre `client_id`.

### Produits master non trouvés

SFCC distingue les **master products** (parents) des **variant products** (enfants). Assurez-vous que vous ciblez le bon type de catalogue et que l'identifiant de site (`site_id`) est correct.

---

## Ressources

- [SFCC OCAPI Data API](https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/OCAPI/current/usage/OpenCommerceAPI.html)
- [Account Manager Salesforce](https://account.demandware.com)
- [Salesforce Commerce Cloud Developer Center](https://developer.salesforce.com/developer-centers/commerce-cloud)
