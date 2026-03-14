---
title: Intégration WiziShop
nextjs:
  metadata:
    title: Intégration WiziShop
    description: Guide complet pour intégrer Products Manager avec WiziShop via l'API REST v3
---

Synchronisez vos produits, stocks et prix entre Products Manager et votre boutique WiziShop via l'API REST v3. {% .lead %}

---

## Vue d'ensemble

L'intégration WiziShop utilise l'API REST v3 avec authentification par `X-Wizishop-Access-Token`. WiziShop est une solution e-commerce française tout-en-un, idéale pour les marchands souhaitant une intégration simple avec leur ERP/PIM.

### Fonctionnalités principales

- **Push/pull produits** : synchronisation bidirectionnelle du catalogue
- **Push stock** : mise à jour des quantités en temps réel
- **Push prix** : synchronisation du prix de vente HT et TTC
- **Push images** : transfert des images depuis MinIO vers WiziShop
- **Sync périodique** : WiziShop ne supporte pas les webhooks natifs, la sync est planifiée

{% callout type="note" title="Pas de webhooks WiziShop" %}
WiziShop ne propose pas de webhooks sortants natifs. La synchronisation est donc **périodique** (toutes les 15 minutes par défaut via Celery Beat) plutôt qu'en temps réel. Vous pouvez déclencher une sync manuelle depuis Products Manager.
{% /callout %}

---

## Prérequis

- Abonnement WiziShop actif (plan Essential ou supérieur)
- Accès API activé (disponible à partir du plan Pro)
- **Access Token** WiziShop

---

## Obtenir l'Access Token

1. Connectez-vous à votre back-office WiziShop
2. Allez dans **Administration** → **Développeurs** (ou **API**)
3. Activez l'accès API si ce n'est pas déjà fait
4. Copiez votre **Access Token** affiché dans cette section

{% callout type="warning" title="Accès API" %}
L'accès à l'API WiziShop peut nécessiter un plan spécifique. Contactez le support WiziShop si l'option n'est pas visible dans votre back-office.
{% /callout %}

---

## Configuration dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → WiziShop** (v4.9.0+) :

```json
{
  "platform_id": "wizishop",
  "name": "WiziShop Production",
  "credentials": {
    "access_token": "ws_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

L'API est accessible à l'URL : `https://api.wizishop.com/v3/`

---

## Fonctionnalités

### Champs synchronisés

| Products Manager | WiziShop | Direction |
|-----------------|----------|-----------|
| `title` | `name` | ↔ Bidirectionnelle |
| `ean` | `barcode` | ↔ Bidirectionnelle |
| `manufacturer_reference` | `reference` | ↔ Bidirectionnelle |
| `price_ht` | `purchase_price` | → PM → WiziShop |
| `price_ttc` | `price` | ↔ Bidirectionnelle |
| `stock` | `stock` | ↔ Bidirectionnelle |
| `brand_name` | `brand_name` | → PM → WiziShop |
| `description` | `description` | ↔ Bidirectionnelle |
| `weight` | `weight` (en grammes) | ↔ Bidirectionnelle |
| `is_active` | `status` (1=actif, 0=inactif) | ↔ Bidirectionnelle |

### Push produits (PM → WiziShop)

```http
POST https://api.wizishop.com/v3/products
X-Wizishop-Access-Token: {access_token}
Content-Type: application/json

{
  "name": "Produit Test",
  "reference": "REF-001",
  "barcode": "3760170631989",
  "price": 29.99,
  "stock": 50,
  "status": 1
}
```

Pour mettre à jour un produit existant :

```http
PUT https://api.wizishop.com/v3/products/{product_id}
X-Wizishop-Access-Token: {access_token}
```

### Pull produits (WiziShop → PM)

```http
GET https://api.wizishop.com/v3/products?page=1&per_page=100
X-Wizishop-Access-Token: {access_token}
```

### Push images

```http
POST https://api.wizishop.com/v3/products/{product_id}/images
X-Wizishop-Access-Token: {access_token}
Content-Type: application/json

{
  "url": "https://minio.productsmanager.app/media-images/product.jpg"
}
```

Products Manager envoie l'URL publique MinIO — WiziShop télécharge l'image directement.

---

## Synchronisation périodique

En l'absence de webhooks natifs, Products Manager planifie une synchronisation automatique :

| Fréquence | Contenu |
|-----------|---------|
| Toutes les 15 min | Stock + Prix |
| Toutes les heures | Produits complets |
| Manuelle | Sync forcée via interface PM |

Pour déclencher une sync manuelle : **Paramètres → Connecteurs → WiziShop → Synchroniser maintenant**

---

## Limites et quotas

WiziShop limite les appels API selon votre plan :

| Plan | Limite |
|------|--------|
| **Pro** | 200 req / min |
| **Business** | 500 req / min |
| **Enterprise** | Sur demande |

Products Manager respecte automatiquement ces limites et met en file d'attente les requêtes si nécessaire.

**Autres limites :**
- Images : max 8 images par produit
- Taille image : max 5 MB
- Description : max 65 000 caractères

---

## Troubleshooting

### 401 Unauthorized

L'Access Token est invalide ou expiré. Régénérez-le dans WiziShop → Administration → Développeurs.

### Produit non créé (EAN invalide)

WiziShop peut rejeter des codes-barres invalides. Utilisez le module **EAN Lookup** de Products Manager pour valider vos codes avant push.

### Images non synchronisées

Vérifiez que les URLs MinIO sont publiquement accessibles (bucket policy `s3:GetObject`). WiziShop doit pouvoir télécharger l'image depuis l'URL fournie.

---

## Ressources

- [Documentation API WiziShop](https://www.wizishop.fr/api-documentation)
- [WiziShop Support](https://support.wizishop.com)
