---
title: Intégration CDiscount Marketplace
nextjs:
  metadata:
    title: Intégration CDiscount Marketplace
    description: Guide complet pour gérer vos offres CDiscount Marketplace depuis Products Manager
---

Gérez vos offres CDiscount Marketplace (prix + stock) par EAN depuis Products Manager, sans avoir à recréer les fiches produits. {% .lead %}

---

## Vue d'ensemble

CDiscount Marketplace est une **marketplace pure** : vous ne créez pas de fiches produits, vous publiez des **offres** sur des fiches existantes dans le catalogue CDiscount, identifiées par leur EAN.

### Fonctionnement

```
Catalogue CDiscount (fiches produits) ← EAN → Products Manager (vos offres)
```

1. La fiche produit existe déjà dans le catalogue CDiscount (créée par la marque ou un autre vendeur)
2. Products Manager publie votre **offre** (prix + stock + condition) en s'appuyant sur l'EAN
3. CDiscount associe votre offre à la fiche existante

### Fonctionnalités principales

- **Push offres** : publication de prix + stock par EAN
- **Pull offres** : récupération de vos offres existantes
- **Mise à jour prix/stock** : synchronisation périodique ou en temps réel
- **Gestion des conditions** : neuf, reconditionné, occasion

{% callout type="warning" title="Pas de fiches produits" %}
Products Manager **ne crée pas** de fiches produits sur CDiscount. Si une fiche n'existe pas dans le catalogue CDiscount pour un EAN donné, l'offre sera rejetée. Vérifiez préalablement l'existence de la fiche via l'outil de recherche CDiscount.
{% /callout %}

---

## Prérequis

- Compte vendeur CDiscount Marketplace actif
- Contrat API Marketplace signé avec CDiscount
- Informations nécessaires :
  - `login` : identifiant vendeur
  - `password` : mot de passe API Marketplace
  - `seller_login` : code vendeur unique (différent du login)

---

## Obtenir les accès API CDiscount

1. Connectez-vous à votre espace vendeur CDiscount
2. Contactez votre compte commercial CDiscount pour activer l'accès API Marketplace
3. Vous recevrez vos credentials API par email :
   - `ApiLogin` (= votre `login`)
   - `ApiPassword` (= votre `password`)
   - `SellerLogin` (= votre `seller_login`, ex: `MONENSEIGNEXX`)

---

## Configuration dans Products Manager

Dans **Paramètres → Connecteurs Plateformes → CDiscount** (v4.9.0+) :

```json
{
  "platform_id": "cdiscount",
  "name": "CDiscount Marketplace",
  "credentials": {
    "login": "votre_api_login",
    "password": "votre_api_password",
    "seller_login": "MONENSEIGNEXX"
  }
}
```

---

## Structure d'une offre CDiscount

Une offre CDiscount contient :

| Champ | Description | Exemple |
|-------|-------------|---------|
| `EAN` | Code-barres du produit | `3760170631989` |
| `SellerProductId` | Votre référence interne | `REF-001` |
| `Price` | Prix de vente TTC | `29.99` |
| `Stock` | Quantité disponible | `50` |
| `ProductCondition` | Condition (1=Neuf, 2=Très bon état, 3=Bon état, 4=État correct) | `1` |
| `DeaProductId` | ID interne DEA CDiscount | auto |
| `PreparationTime` | Délai avant expédition (jours) | `1` |

### Mapping Products Manager → Offre CDiscount

| Products Manager | CDiscount Offer | Notes |
|-----------------|-----------------|-------|
| `ean` | `EAN` | Clé de correspondance |
| `manufacturer_reference` | `SellerProductId` | Votre référence |
| `price_ttc` | `Price` | Prix de vente TTC |
| `stock` | `Stock` | Quantité disponible |
| condition (config) | `ProductCondition` | Configurable par règle |

---

## Fonctionnalités

### Push offres (PM → CDiscount)

Products Manager utilise l'API SOAP CDiscount Marketplace :

```xml
<SubmitOfferPackage>
  <headerOfferMessage>
    <login>votre_login</login>
    <password>votre_password</password>
    <sellerLogin>MONENSEIGNEXX</sellerLogin>
  </headerOfferMessage>
  <offerPackage>
    <offers>
      <OfferElement>
        <Ean>3760170631989</Ean>
        <SellerProductId>REF-001</SellerProductId>
        <Price>29.99</Price>
        <Stock>50</Stock>
        <ProductCondition>1</ProductCondition>
        <PreparationTime>1</PreparationTime>
      </OfferElement>
    </offers>
  </offerPackage>
</SubmitOfferPackage>
```

Les offres sont soumises par **packages** (lots) pour optimiser les performances.

### Pull offres existantes

```xml
<GetOfferList>
  <headerMessage>
    <login>votre_login</login>
    <password>votre_password</password>
    <sellerLogin>MONENSEIGNEXX</sellerLogin>
  </headerMessage>
  <offerFilter>
    <SellerProductIdList />
    <PageNumber>1</PageNumber>
    <PageSize>100</PageSize>
  </offerFilter>
</GetOfferList>
```

---

## Workflow recommandé

1. **Vérifier l'EAN** : Utilisez le module EAN Lookup de PM pour valider vos EAN
2. **Vérifier la fiche** : Cherchez l'EAN sur cdiscount.com pour confirmer l'existence de la fiche produit
3. **Configurer l'offre** : Définissez vos règles de prix et conditions dans PM
4. **Push initial** : Envoyez vos offres depuis PM
5. **Synchronisation automatique** : Le Celery Beat met à jour prix + stock toutes les heures

---

## Erreurs fréquentes

### EAN non reconnu dans le catalogue CDiscount

**Symptôme :** L'offre est rejetée avec `EAN non présent dans le catalogue`

**Cause :** La fiche produit n'existe pas encore dans le catalogue CDiscount pour cet EAN.

**Solution :**
1. Vérifiez l'EAN sur [cdiscount.com](https://www.cdiscount.com)
2. Si la fiche n'existe pas, contactez votre compte commercial CDiscount pour création de fiche
3. Certains EAN peuvent être soumis via le processus de création de fiche CDiscount

### Format EAN invalide

**Symptôme :** Rejet avec `EAN invalide`

**Solution :** Vérifiez que l'EAN est un code-barres valide EAN-13 ou UPC-12. Utilisez le module **EAN Lookup** de Products Manager pour validation.

### Offre créée mais non visible

**Cause :** Les offres CDiscount peuvent prendre 2-4h à apparaître après soumission (processus de modération).

### Prix non mis à jour

Vérifiez que le `SellerProductId` dans l'offre correspond bien à votre référence interne. CDiscount identifie vos offres par ce champ.

---

## Ressources

- [CDiscount Marketplace API](https://dev.cdiscount.com)
- [Documentation vendeur CDiscount](https://seller.cdiscount.com)
