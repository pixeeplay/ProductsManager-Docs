---
title: Intégration Sylius
nextjs:
  metadata:
    title: Intégration Sylius
    description: Guide complet pour intégrer Products Manager avec Sylius via API Platform (JSON-LD/Hydra) et JWT
---

Synchronisez vos produits, stocks et prix entre Products Manager et votre boutique Sylius via API Platform (JSON-LD/Hydra) avec authentification JWT. {% .lead %}

---

## Vue d'ensemble

Sylius est une plateforme e-commerce open source PHP basée sur Symfony. Son API est construite avec API Platform et expose des ressources en JSON-LD/Hydra. L'authentification utilise JWT Bearer.

### Fonctionnalités principales

- **Push/pull produits** : synchronisation bidirectionnelle
- **Push stock** : mise à jour des quantités `onHand`
- **Push prix** : synchronisation en centimes via `ChannelPricing`
- **Gestion des channels** : Sylius supporte plusieurs canaux de vente
- **Pagination Hydra** : navigation automatique via `hydra:next`

{% callout type="warning" title="Prix en centimes" %}
Sylius stocke les prix en **centimes** (entiers). Products Manager convertit automatiquement : 19.99€ → 1999 centimes lors du push, et 1999 → 19.99€ lors du pull.
{% /callout %}

---

## Prérequis

- **Sylius** : 1.12 ou supérieur
- **API Platform** : activé (inclus par défaut dans Sylius 1.12+)
- **JWT** : bundle JWT configuré (`lexik/jwt-authentication-bundle`)
- Accès admin Sylius
- Informations nécessaires :
  - `base_url` : URL de votre instance Sylius (ex: `https://www.maboutique.com`)
  - `email` : email admin Sylius
  - `password` : mot de passe admin
  - `channel_code` : code du canal de vente (ex: `FASHION_WEB`)

---

## Configuration dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → Sylius** (v4.9.0+) :

```json
{
  "platform_id": "sylius",
  "name": "Sylius Production",
  "credentials": {
    "base_url": "https://www.maboutique.com",
    "email": "admin@maboutique.com",
    "password": "votre_mot_de_passe",
    "channel_code": "FASHION_WEB"
  }
}
```

### Authentification JWT

Products Manager obtient un token JWT via :

```http
POST https://www.maboutique.com/api/v2/shop/authentication-token
Content-Type: application/json

{
  "email": "admin@maboutique.com",
  "password": "votre_mot_de_passe"
}
```

Le token JWT est valide 3600 secondes (1h) et est renouvelé automatiquement.

---

## Fonctionnalités

### Champs synchronisés

| Products Manager | Sylius | Notes |
|-----------------|--------|-------|
| `title` | `translations[fr_FR].name` | Localisé par langue |
| `ean` | `code` (product code) | Identifiant unique Sylius |
| `manufacturer_reference` | `code` | Alternative comme code produit |
| `stock` | `onHand` (ProductVariant) | Via StockMovement |
| `price_ttc` | `channelPricings[CHANNEL].price` | En centimes × 100 |
| `price_ht` | `channelPricings[CHANNEL].originalPrice` | En centimes × 100 |
| `brand_name` | attribute `brand` | Via ProductAttribute |
| `description` | `translations[fr_FR].description` | Localisé |
| `is_active` | `enabled` | Booléen |

### Push produits (PM → Sylius)

```http
POST https://www.maboutique.com/api/v2/admin/products
Authorization: Bearer {jwt_token}
Content-Type: application/ld+json

{
  "@context": "/api/v2/contexts/Product",
  "code": "PROD-001",
  "enabled": true,
  "translations": {
    "fr_FR": {
      "name": "Produit Test",
      "slug": "produit-test",
      "description": "Description du produit"
    }
  },
  "channels": ["/api/v2/admin/channels/FASHION_WEB"]
}
```

### Push stock

```http
PUT https://www.maboutique.com/api/v2/admin/product-variants/{code}
Authorization: Bearer {jwt_token}
Content-Type: application/ld+json

{
  "onHand": 50,
  "tracked": true
}
```

### Push prix (ChannelPricing)

```http
PATCH https://www.maboutique.com/api/v2/admin/channel-pricings/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/merge-patch+json

{
  "price": 1999,
  "originalPrice": 2499
}
```

`price: 1999` = 19.99€ (en centimes)

### Pull produits (Sylius → PM)

```http
GET https://www.maboutique.com/api/v2/admin/products?page=1&itemsPerPage=30
Authorization: Bearer {jwt_token}
```

**Pagination Hydra :**

```json
{
  "@context": "/api/v2/contexts/Product",
  "@type": "hydra:Collection",
  "hydra:member": [...],
  "hydra:totalItems": 1500,
  "hydra:view": {
    "@type": "hydra:PartialCollectionView",
    "hydra:next": "/api/v2/admin/products?page=2&itemsPerPage=30"
  }
}
```

Products Manager suit automatiquement les liens `hydra:next` pour récupérer toutes les pages.

---

## Structure canal (Channel) obligatoire

Sylius requiert un **channel** pour les prix. Chaque canal a son propre jeu de prix. Configurez le code canal correct dans les paramètres de l'intégration :

```http
GET https://www.maboutique.com/api/v2/admin/channels
Authorization: Bearer {jwt_token}
```

Réponse :
```json
{
  "hydra:member": [
    {
      "code": "FASHION_WEB",
      "name": "Boutique Web Mode",
      "hostname": "www.maboutique.com",
      "baseCurrency": { "code": "EUR" }
    }
  ]
}
```

---

## Limites et quotas

- **JWT expiration** : 3600 secondes (configurable dans `lexik_jwt_authentication.token_ttl`)
- **API Platform** : pas de rate limit par défaut, configurable via ApiPlatform RateLimit
- **itemsPerPage** : max 100 par défaut (configurable dans `api_platform.collection.pagination.maximum_items_per_page`)

---

## Troubleshooting

### 401 Expired JWT Token

Products Manager renouvelle le JWT automatiquement. Si l'erreur persiste, vérifiez que les credentials (email/password) sont corrects et que le compte admin n'est pas désactivé.

### Prix à 0 après push

Vérifiez que le `channel_code` configuré correspond bien au canal Sylius. Un prix associé au mauvais canal ne sera pas visible.

### Produit créé sans variant

Sylius nécessite au moins un **ProductVariant** pour vendre un produit. Products Manager crée automatiquement un variant par défaut avec le code produit.

### hydra:next manquant — pagination incomplète

Si la réponse ne contient pas `hydra:next`, la dernière page a été atteinte. C'est le comportement normal.

---

## Ressources

- [Sylius API Documentation](https://docs.sylius.com/en/latest/api/index.html)
- [API Platform Documentation](https://api-platform.com/docs/)
- [LexikJWT Bundle](https://github.com/lexik/LexikJWTAuthenticationBundle)
- [Sylius GitHub](https://github.com/Sylius/Sylius)
