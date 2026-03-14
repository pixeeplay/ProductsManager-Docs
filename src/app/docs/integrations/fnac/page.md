---
title: Intégration Fnac Marketplace
nextjs:
  metadata:
    title: Intégration Fnac Marketplace
    description: Guide complet pour gérer vos offres Fnac Marketplace depuis Products Manager
---

Publiez et mettez à jour vos offres sur Fnac Marketplace par EAN ou ISBN depuis Products Manager. {% .lead %}

---

## Vue d'ensemble

Fnac Marketplace (Fnac-Darty) fonctionne comme une marketplace : vous publiez des **offres** sur des fiches produits existantes, identifiées par leur EAN (produits physiques) ou ISBN (livres, musique, films).

### Fonctionnalités principales

- **Push offres** : publication de prix + stock par EAN/ISBN
- **Pull offres** : récupération de vos offres existantes
- **Mise à jour prix/stock** : synchronisation périodique
- **Support ISBN** : fonctionne également pour les livres et produits culturels
- **Gestion des conditions** : neuf, très bon état, bon état, état correct

---

## Prérequis

- Compte vendeur Fnac Marketplace actif
- Accès API Marketplace Fnac activé
- Informations nécessaires :
  - `shop_id` : identifiant de votre boutique Fnac
  - `api_key` : clé API Marketplace

---

## Obtenir les credentials Fnac

1. Connectez-vous à votre espace vendeur Fnac Marketplace
2. Allez dans **Mon Compte** → **API** ou **Paramètres développeurs**
3. Récupérez votre `shop_id` et `api_key`

Si vous n'avez pas encore d'accès API, contactez votre responsable compte Fnac Marketplace.

---

## Configuration dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → Fnac Marketplace** (v4.9.0+) :

```json
{
  "platform_id": "fnac",
  "name": "Fnac Marketplace",
  "credentials": {
    "shop_id": "MONSHOP001",
    "api_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "api_url": "https://ws.fnacdarty.com/api"
  }
}
```

L'URL par défaut de l'API Fnac est `https://ws.fnacdarty.com/api`.

---

## Structure d'une offre Fnac

| Champ | Description | Exemple |
|-------|-------------|---------|
| `EAN` | Code-barres EAN-13 ou ISBN-13 | `9782744015656` |
| `SellerRef` | Votre référence interne | `REF-001` |
| `Price` | Prix de vente en centimes ou EUR | `29.99` |
| `Quantity` | Stock disponible | `50` |
| `State` | Condition (1=Neuf, 2=Très bon état, 3=Bon état, 6=État correct) | `1` |
| `Comment` | Commentaire sur l'état (pour occasion) | `Emballage d'origine` |

### Mapping Products Manager → Offre Fnac

| Products Manager | Fnac Offer | Notes |
|-----------------|------------|-------|
| `ean` | `EAN` | Clé principale |
| `manufacturer_reference` | `SellerRef` | Votre référence |
| `price_ttc` | `Price` | Prix TTC en EUR |
| `stock` | `Quantity` | Quantité disponible |
| condition (config) | `State` | Configurable par règle |

---

## Fonctionnalités

### Push offres (PM → Fnac)

Products Manager appelle l'API Fnac en XML :

```http
POST https://ws.fnacdarty.com/api/{shop_id}/offers_update
Content-Type: application/xml
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<offers>
  <shop_id>MONSHOP001</shop_id>
  <token>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</token>
  <offer>
    <product_ean>9782744015656</product_ean>
    <seller_ref>REF-001</seller_ref>
    <price>29.99</price>
    <quantity>50</quantity>
    <state>1</state>
  </offer>
</offers>
```

Les offres sont soumises par batch (jusqu'à 500 offres par appel).

### Pull offres existantes

```http
GET https://ws.fnacdarty.com/api/{shop_id}/offers_query
```

Récupère la liste de vos offres actives avec leur statut (active, inactive, en attente de modération).

### Mise à jour prix uniquement

```xml
<offer>
  <product_ean>9782744015656</product_ean>
  <seller_ref>REF-001</seller_ref>
  <price>24.99</price>
</offer>
```

### Mise à jour stock uniquement

```xml
<offer>
  <product_ean>9782744015656</product_ean>
  <seller_ref>REF-001</seller_ref>
  <quantity>35</quantity>
</offer>
```

---

## Support livres et produits culturels

L'intégration Fnac fonctionne aussi pour :

| Type | Identifiant | Exemple |
|------|-------------|---------|
| Livres | ISBN-13 | `9782744015656` |
| Musique (CD) | EAN-13 | `0190295628857` |
| Films (DVD/Blu-ray) | EAN-13 | `3700301046726` |
| Jeux vidéo | EAN-13 | `0045496477158` |
| Produits tech | EAN-13 | `3760170631989` |

---

## Synchronisation automatique

Celery Beat planifie les mises à jour Fnac :

| Fréquence | Contenu |
|-----------|---------|
| Toutes les 30 min | Stock + Prix |
| Toutes les 24h | Vérification complète des offres |
| Manuelle | Via interface PM |

---

## Troubleshooting

### Offre rejetée — EAN/ISBN non trouvé

**Cause :** La fiche produit n'existe pas dans le catalogue Fnac pour cet EAN/ISBN.

**Solution :** Recherchez le produit sur [fnac.com](https://www.fnac.com). Si la fiche n'existe pas, le produit ne peut pas être vendu sur Fnac Marketplace pour le moment.

### Prix non mis à jour

Vérifiez que le champ `seller_ref` correspond bien à votre référence interne dans PM. Fnac Marketplace associe vos offres à cette référence.

### Offre en attente de modération

Les nouvelles offres passent par une validation Fnac (quelques heures). C'est normal pour les premières publications.

### Quantité à 0 — offre désactivée automatiquement

Fnac Marketplace désactive automatiquement les offres avec `quantity=0`. Products Manager synchronise le stock pour réactiver l'offre dès que le stock remonte.

---

## Ressources

- [Fnac Darty API Marketplace](https://ws.fnacdarty.com)
- [Documentation vendeur Fnac](https://marketplace.fnac.com/seller)
