---
title: Intégration Magento 2 / Adobe Commerce
nextjs:
  metadata:
    title: Intégration Magento 2 / Adobe Commerce
    description: Guide complet pour intégrer Products Manager avec Magento 2 ou Adobe Commerce via REST API v1
---

Synchronisez vos produits, stocks et prix entre Products Manager et Magento 2 / Adobe Commerce via l'API REST v1 avec Bearer Token. {% .lead %}

---

## Vue d'ensemble

L'intégration Magento 2 permet une synchronisation bidirectionnelle entre Products Manager et votre instance Magento 2 ou Adobe Commerce. Elle repose sur l'API REST Magento v1 avec authentification Bearer Token.

### Fonctionnalités principales

- **Synchronisation bidirectionnelle** : Products Manager ↔ Magento 2
- **Push produits** : titre, description, EAN, marque, prix TTC, SKU
- **Pull produits** : import depuis le catalogue Magento
- **Stock MSI** : mise à jour des quantités via Magento Multi-Source Inventory
- **Push prix** : synchronisation des prix de vente
- **Renouvellement automatique** : le token Bearer est renouvelé toutes les 4h

---

## Prérequis

- **Magento** : 2.4.x ou supérieur (Adobe Commerce inclus)
- **Droits admin** : accès à l'administration Magento
- **Module PM** : module Magento Products Manager installé (optionnel pour push externe)
- **HTTPS** : obligatoire pour sécuriser les appels API

---

## Configuration

### 1. Générer un Access Token dans Magento Admin

1. Connectez-vous à l'administration Magento (`/admin`)
2. Allez dans **System** → **Integrations**
3. Cliquez sur **Add New Integration**
4. Donnez un nom : `Products Manager`
5. Dans l'onglet **API**, sélectionnez les ressources :
   - `Catalog > Products` (lecture + écriture)
   - `Inventory` (lecture + écriture)
   - `Stores` (lecture)
6. Cliquez sur **Save**
7. Cliquez sur **Activate** puis **Allow**
8. Copiez l'**Access Token** généré

### 2. Configurer dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → Magento 2** (v4.9.0+), renseignez :

```json
{
  "platform_id": "magento2",
  "name": "Magento 2 Production",
  "credentials": {
    "base_url": "https://www.maboutique.com",
    "access_token": "abc123xyz...",
    "store_code": "default"
  }
}
```

### 3. Tester la connexion

Cliquez sur **Tester la connexion** — Products Manager interroge `GET /rest/V1/store/storeConfigs` pour valider les credentials.

{% callout type="note" title="Token Bearer Magento" %}
Le token Bearer Magento expire par défaut après **4 heures**. Products Manager renouvelle automatiquement le token via les credentials de l'intégration. Si vous utilisez un token admin personnel, pensez à configurer sa durée de vie dans **Stores → Configuration → Services → OAuth**.
{% /callout %}

---

## Fonctionnalités

### Champs synchronisés

| Products Manager | Magento 2 | Direction |
|-----------------|-----------|-----------|
| `title` | `name` | ↔ Bidirectionnelle |
| `ean` | `custom_attr_ean` (attribut custom) | ↔ Bidirectionnelle |
| `brand_name` | `manufacturer` (attribut) | → PM → Magento |
| `price_ttc` | `price` | ↔ Bidirectionnelle |
| `manufacturer_reference` | `sku` | ↔ Bidirectionnelle |
| `description` | `description` | ↔ Bidirectionnelle |
| `stock` (quantité) | `qty` (MSI source item) | ↔ Bidirectionnelle |
| `weight` | `weight` | ↔ Bidirectionnelle |
| `is_active` | `status` (1=Enabled, 2=Disabled) | ↔ Bidirectionnelle |

### Push produits (PM → Magento)

```http
POST /rest/V1/products
Authorization: Bearer {access_token}
Content-Type: application/json
```

Products Manager envoie les produits en batch. Les produits existants (par SKU) sont mis à jour via `PUT /rest/V1/products/{sku}`.

### Pull produits (Magento → PM)

```http
GET /rest/V1/products?searchCriteria[pageSize]=100&searchCriteria[currentPage]=1
Authorization: Bearer {access_token}
```

### Push stock MSI

Si vous utilisez Magento Multi-Source Inventory :

```http
POST /rest/V1/inventory/source-items
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "sourceItems": [
    {
      "sku": "REF-001",
      "source_code": "default",
      "quantity": 50,
      "status": 1
    }
  ]
}
```

{% callout type="warning" title="MSI désactivé ?" %}
Si votre installation Magento n'utilise pas MSI (Single Source Inventory), le stock est mis à jour via `PUT /rest/V1/products/{sku}/stockItems/1`. Configurez ce mode dans les paramètres de l'intégration.
{% /callout %}

### Endpoint push externe (module PHP)

Pour recevoir des données depuis votre module Magento vers PM :

```http
POST /api/v1/connectors/magento/push
X-API-Key: {votre_cle_api}
Content-Type: application/json

{
  "products": [
    {
      "sku": "REF-001",
      "name": "Produit Test",
      "price": 29.99,
      "qty": 100
    }
  ]
}
```

---

## Limites et quotas

- **Rate limit Magento** : pas de limite officielle, mais les instances mutualisées peuvent être limitées à ~100 req/min
- **Token Bearer** : expire après 4h (configurable dans `oauth/access_token_lifetime/admin`)
- **Batch size** : Products Manager envoie les produits par lots de 50 pour éviter les timeouts

---

## Troubleshooting

### Token expiré (401 Unauthorized)

**Symptôme :** `{"message": "The consumer isn't authorized to access %resources."}`

**Solution :**
1. Vérifiez la durée de vie du token dans Magento Admin → Stores → Configuration → Services → OAuth
2. Régénérez l'intégration ou augmentez la durée de vie à 86400 secondes (24h)
3. Activez le renouvellement automatique dans les paramètres PM

### MSI désactivé — stock non mis à jour

**Symptôme :** Erreur `404` sur `/rest/V1/inventory/source-items`

**Solution :** Passez en mode "Single Source" dans les paramètres de l'intégration PM. Le stock sera mis à jour via l'API legacy `stockItems`.

### Droits insuffisants (403 Forbidden)

**Symptôme :** `{"message": "Access denied."}`

**Solution :**
1. Dans Magento Admin → System → Integrations, vérifiez que l'intégration est **Active**
2. Vérifiez que toutes les ressources API sont accordées
3. Réactivez l'intégration si nécessaire

### Attribut EAN introuvable

Si `custom_attr_ean` n'existe pas dans votre Magento :
1. Créez l'attribut dans Magento Admin → Stores → Attributes → Product
2. Code attribut : `ean`, Type : Text, utilisé en catalogue
3. Ou configurez le code attribut dans les paramètres PM

---

## Ressources

- [Magento REST API Documentation](https://developer.adobe.com/commerce/webapi/rest/)
- [Magento Inventory API](https://developer.adobe.com/commerce/webapi/rest/inventory/)
- [Adobe Commerce API Reference](https://developer.adobe.com/commerce/webapi/reference/)
