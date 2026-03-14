---
title: Intégration SAP Commerce Cloud (Hybris)
nextjs:
  metadata:
    title: Intégration SAP Commerce Cloud (Hybris)
    description: Guide complet pour intégrer Products Manager avec SAP Commerce Cloud via OCC API v2 et OAuth2
---

Synchronisez vos produits entre Products Manager et SAP Commerce Cloud (anciennement Hybris) via l'OCC API v2 avec authentification OAuth2. {% .lead %}

---

## Vue d'ensemble

L'intégration SAP Commerce Cloud utilise l'OCC API v2 (Omni Commerce Connect) pour la lecture de produits, et l'**ImpEx** pour les imports bulk en écriture. SAP Commerce Cloud est une plateforme enterprise avec une architecture de catalogue complexe (online/staged).

### Fonctionnalités principales

- **Pull produits** : import depuis OCC API (catalogue online)
- **Push via ImpEx** : exports bulk compatibles avec le format ImpEx Hybris
- **Gestion des catalogues** : support de la structure online/staged
- **OAuth2** : authentification sécurisée via le OAuth2 server Hybris

{% callout type="note" title="Write via OCC limité" %}
L'OCC API v2 de SAP Commerce Cloud est principalement conçue pour la **lecture** côté storefront. Les opérations d'écriture en masse doivent utiliser **ImpEx** (Hybris Import Framework). Products Manager génère des fichiers ImpEx XML/CSV compatibles pour les imports bulk.
{% /callout %}

---

## Prérequis

- Instance SAP Commerce Cloud active (Cloud ou on-premise)
- Accès **HAC** (Hybris Administration Console) ou **Backoffice**
- **API Client** configuré dans HAC → Platform → OAuth2
- Informations nécessaires :
  - `base_url` : URL OCC de votre instance (ex: `https://api.c1234-xxxx.commercecloud.powertools.cx/occ/v2`)
  - `client_id` : ID client OAuth2
  - `client_secret` : secret OAuth2
  - `catalog_id` : identifiant du catalogue (ex: `electronicsProductCatalog`)

---

## Configuration

### 1. Configurer un client OAuth2 dans HAC

1. Connectez-vous à la **Hybris Administration Console** (HAC) : `https://votre-instance/hac`
2. Allez dans **Platform** → **OAuth2**
3. Cliquez sur **Add OAuth client**
4. Renseignez :
   - **Client ID** : `products-manager`
   - **Client Secret** : générez un secret sécurisé
   - **Authorized Grant Types** : `client_credentials`
   - **Authorities** : `ROLE_CLIENT, ROLE_TRUSTED_CLIENT`
   - **Scope** : `basic, extended`
5. Cliquez sur **Save**

### 2. Configurer dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → SAP Commerce Cloud** (v4.9.0+) :

```json
{
  "platform_id": "sap-commerce",
  "name": "SAP Commerce Production",
  "credentials": {
    "base_url": "https://api.c1234-xxxx.commercecloud.powertools.cx/occ/v2",
    "client_id": "products-manager",
    "client_secret": "votre_secret",
    "catalog_id": "electronicsProductCatalog"
  }
}
```

### 3. Authentification OAuth2

```http
POST https://votre-instance/authorizationserver/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=products-manager&client_secret=votre_secret
```

Le token est valide 43200 secondes (12h) par défaut.

---

## Fonctionnalités

### Pull produits (OCC → PM)

```http
GET /occ/v2/{catalog_id}/products?fields=FULL&pageSize=100&currentPage=0
Authorization: Bearer {access_token}
```

**Structure de la réponse :**

```json
{
  "products": [
    {
      "code": "SKU-001",
      "name": "Produit Test",
      "description": "Description...",
      "price": { "value": 29.99, "currencyIso": "EUR" },
      "stock": { "stockLevel": 50, "stockLevelStatus": "inStock" },
      "ean": "3760170631989"
    }
  ],
  "pagination": {
    "totalPages": 5,
    "currentPage": 0
  }
}
```

### Champs synchronisés

| Products Manager | SAP Commerce OCC | Direction |
|-----------------|-----------------|-----------|
| `manufacturer_reference` | `code` | ↔ Bidirectionnelle |
| `title` | `name` | ↔ Bidirectionnelle |
| `description` | `description` | ← SAP → PM |
| `ean` | `ean` (feature) | ← SAP → PM |
| `price_ttc` | `price.value` | ← SAP → PM |
| `stock` | `stock.stockLevel` | ← SAP → PM |
| `brand_name` | `manufacturer` | ← SAP → PM |

### Push via ImpEx (recommandé pour bulk)

Products Manager génère des fichiers ImpEx CSV pour l'import bulk :

```
INSERT_UPDATE Product;code[unique=true];name[lang=fr];description[lang=fr];ean;catalogVersion(catalog(id),version)[unique=true]
;SKU-001;Produit Test;Description du produit;3760170631989;electronicsProductCatalog:Staged
;SKU-002;Autre Produit;Autre description;1234567890128;electronicsProductCatalog:Staged
```

Ce fichier peut être uploadé dans **Backoffice** → **System** → **Import** ou via l'API HAC.

### Architecture catalogue Hybris (online/staged)

SAP Commerce Cloud utilise deux versions de catalogue :

| Version | Description | Usage |
|---------|-------------|-------|
| **Staged** | Catalogue de travail | Imports, modifications |
| **Online** | Catalogue publié | Lecture par OCC/storefront |

Products Manager importe en **Staged** et vous devez synchroniser (`sync`) vers Online depuis le Backoffice.

---

## Limites et quotas

- **OCC API** : rate limits configurables par instance (en général 100-500 req/min)
- **ImpEx** : pas de limite stricte, idéal pour >1000 produits
- **Pagination OCC** : max 100 produits par page (`pageSize=100`)

---

## Troubleshooting

### 401 invalid_token

Le token OAuth2 a expiré. Products Manager renouvelle automatiquement. Si l'erreur persiste, vérifiez que le client OAuth2 est actif dans HAC.

### Produits non visibles sur le storefront

Les produits pushés via ImpEx sont en version **Staged**. Déclenchez une synchronisation catalog dans le Backoffice pour les rendre visibles en **Online**.

### OCC retourne des données vides

Vérifiez que le `catalog_id` est correct et que le catalogue est **Online**. Les catalogues Staged ne sont pas exposés via OCC.

---

## Ressources

- [SAP Commerce Cloud OCC API](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/9d346683b0164423a3bb5e45b8f2e0a2/8c9f3305866910149d40b151a9196543.html)
- [ImpEx Import Framework](https://help.sap.com/docs/SAP_COMMERCE/50c996852b32456c96d3161a95544cdb/1b6a5826da624399b4a94f001ad7b44c.html)
- [OAuth2 Configuration](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/9d346683b0164423a3bb5e45b8f2e0a2/627c92db29ce4fce8b01ffbe478a8b3b.html)
