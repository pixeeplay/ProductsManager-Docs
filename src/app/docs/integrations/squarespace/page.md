---
title: Intégration Squarespace Commerce
nextjs:
  metadata:
    title: Intégration Squarespace Commerce
    description: Guide complet pour synchroniser le stock entre Products Manager et Squarespace Commerce
---

Synchronisez votre stock entre Products Manager et votre boutique Squarespace Commerce via l'API v1 avec Bearer Token. {% .lead %}

---

## Vue d'ensemble

L'intégration Squarespace Commerce utilise l'API Inventory de Squarespace v1 pour synchroniser les stocks. L'API Squarespace Commerce est **limitée en écriture** : la création de produits n'est pas supportée via API, mais la mise à jour des stocks est possible.

### Cas d'usage principal

```
Products Manager (stock réel) → Squarespace (affichage disponibilité)
```

**Squarespace Commerce est idéal pour :**
- Synchroniser le stock de vos produits depuis PM vers Squarespace
- Maintenir la disponibilité à jour sur votre vitrine Squarespace
- Récupérer la liste de vos produits Squarespace dans PM

### Fonctionnalités supportées

- **Pull produits** : import de votre catalogue Squarespace dans PM
- **Push stock** : mise à jour des quantités via inventory delta
- **Push prix** : mise à jour des prix (limitée — certains plans seulement)

### Fonctionnalités non supportées

- **Push produits** (création) : l'API Squarespace ne permet pas la création de produits
- **Webhooks entrants** : Squarespace ne notifie pas de changements de catalogue via webhooks standards

{% callout type="note" title="Limitation API Squarespace" %}
L'API Squarespace Commerce v1 est principalement conçue pour **lire les commandes et gérer le stock**. La création et modification complète de produits via API n'est pas disponible. Utilisez l'interface Squarespace pour créer vos fiches produits, puis PM pour gérer le stock.
{% /callout %}

---

## Prérequis

- **Plan Squarespace** : Business ou Commerce (Basic ou Advanced)
- **API Key** : générée depuis les paramètres avancés Squarespace
- Accès admin à votre site Squarespace

---

## Obtenir l'API Key Squarespace

1. Connectez-vous à votre site Squarespace en tant qu'administrateur
2. Allez dans **Paramètres** → **Avancé** → **Clés API** (ou **Developer API Keys**)
3. Cliquez sur **Générer une clé**
4. Donnez un nom : `Products Manager`
5. Sélectionnez les permissions :
   - **Inventory** : Read + Write
   - **Products** : Read
6. Cliquez sur **Enregistrer**
7. Copiez la clé API générée (elle ne sera plus visible ensuite)

---

## Configuration dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → Squarespace** (v4.9.0+) :

```json
{
  "platform_id": "squarespace",
  "name": "Squarespace Boutique",
  "credentials": {
    "api_key": "squarespace_api_key_xxxxxxxxxxxxxxxxxx"
  }
}
```

L'API est accessible à : `https://api.squarespace.com/1.0/commerce/`

---

## Fonctionnalités

### Pull produits (Squarespace → PM)

```http
GET https://api.squarespace.com/1.0/commerce/products
Authorization: Bearer {api_key}
```

**Réponse :**

```json
{
  "products": [
    {
      "id": "product-uuid",
      "name": "T-Shirt Classique",
      "variants": [
        {
          "id": "variant-uuid",
          "sku": "TSH-001-BL-M",
          "pricing": { "basePrice": { "value": "29.99", "currency": "EUR" } },
          "stock": { "quantity": 15, "unlimited": false }
        }
      ]
    }
  ],
  "pagination": { "nextPageUrl": "..." }
}
```

### Push stock (PM → Squarespace)

Squarespace utilise un système de **delta** pour les mises à jour de stock :

```http
POST https://api.squarespace.com/1.0/commerce/inventory
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "incrementOrSetValue": [
    {
      "variantId": "variant-uuid",
      "quantity": 50,
      "isInfinite": false
    }
  ]
}
```

`quantity: 50` signifie **définir le stock à 50** (pas ajouter 50 au stock actuel).

### Push prix (PM → Squarespace)

La mise à jour de prix via API Squarespace est disponible sur les plans Commerce uniquement :

```http
POST https://api.squarespace.com/1.0/commerce/products/{product_id}/variants/{variant_id}
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "pricing": {
    "basePrice": {
      "value": "24.99",
      "currency": "EUR"
    }
  }
}
```

{% callout type="warning" title="Disponibilité push prix" %}
La modification de prix via API Squarespace peut être limitée selon votre plan. Vérifiez la documentation Squarespace pour les permissions exactes de votre clé API.
{% /callout %}

### Mapping champs

| Products Manager | Squarespace | Direction |
|-----------------|-------------|-----------|
| `title` | `name` | ← Squarespace → PM |
| `manufacturer_reference` | `variants[].sku` | ← Squarespace → PM |
| `price_ttc` | `variants[].pricing.basePrice.value` | ↔ Bidirectionnelle |
| `stock` | `variants[].stock.quantity` | → PM → Squarespace |
| `is_active` | (non synchronisé) | — |

---

## Synchronisation planifiée

Squarespace ne propose pas de webhooks standards pour les changements de produits. La synchronisation stock est planifiée par Celery Beat :

| Fréquence | Contenu |
|-----------|---------|
| Toutes les 30 min | Stock de tous les produits actifs |
| Toutes les 24h | Pull complet du catalogue Squarespace |
| Manuelle | Via l'interface PM |

---

## Limites et quotas

Squarespace impose des rate limits sur son API :

| Endpoint | Limite |
|----------|--------|
| Lecture produits | 300 req / min |
| Mise à jour stock | 300 req / min |
| Lecture commandes | 300 req / min |

**Autres limites :**
- Max 10 000 produits par boutique
- Max 100 variants par produit
- Pagination : 50 produits par page

---

## Troubleshooting

### 401 Unauthorized

La clé API est invalide ou révoquée. Régénérez une clé dans Squarespace → Paramètres → Avancé → Clés API.

### Stock non mis à jour

Vérifiez que le `variantId` est correct. Les products Squarespace peuvent avoir plusieurs variants — chaque variant a son propre UUID pour la gestion de stock.

### Produits non visibles après pull

Squarespace peut avoir des produits en brouillon (non publiés). Le pull PM importe uniquement les produits actifs et publiés.

### Plan insuffisant

Certaines fonctionnalités API (modification de prix, accès complet inventory) nécessitent le plan Commerce Advanced. Vérifiez votre abonnement Squarespace.

---

## Ressources

- [Squarespace API Developer Docs](https://developers.squarespace.com/commerce-apis)
- [Squarespace Inventory API](https://developers.squarespace.com/commerce-apis/inventory)
- [Squarespace API Keys](https://developers.squarespace.com/commerce-apis/authentication)
