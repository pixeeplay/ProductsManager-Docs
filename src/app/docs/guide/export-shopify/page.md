---
title: Export Shopify
nextjs:
  metadata:
    title: Export Shopify - Guide Utilisateur Products Manager APP
    description: "Exportez vos produits vers Shopify depuis Products Manager APP. Configuration, mapping des champs, gestion des variantes et des images."
---

Exportez et synchronisez vos produits depuis Products Manager APP vers votre boutique Shopify en quelques etapes. {% .lead %}

---

## Introduction

L'export vers Shopify vous permet de publier vos produits directement sur votre boutique en ligne Shopify depuis Products Manager APP. Le systeme gere la creation de nouveaux produits, la mise a jour des produits existants, ainsi que la synchronisation des variantes, des images et des stocks.

Ce guide vous accompagne dans la configuration de la connexion, le mapping des champs et le lancement de votre premier export vers Shopify.

---

## Prerequis

Avant de commencer, assurez-vous de disposer des elements suivants :

- Un **compte Shopify** actif (plans Basic, Shopify, Advanced ou Plus)
- Un acces **administrateur** a votre boutique Shopify
- Une **cle API Shopify** (Access Token) configuree dans Products Manager APP
- La connexion Shopify configuree dans **Parametres** > **Integrations**

{% callout type="note" %}
Si vous n'avez pas encore configure la connexion Shopify dans Products Manager APP, consultez d'abord la [documentation technique de l'integration Shopify](/docs/integrations/shopify) pour les instructions de configuration initiale.
{% /callout %}

---

## Configuration de la connexion

### Verifier la connexion Shopify

1. Accedez a **Parametres** > **Integrations** dans Products Manager APP
2. Localisez votre integration Shopify dans la liste
3. Cliquez sur **Tester la connexion** pour verifier que tout fonctionne

Le test de connexion verifie :

- L'accessibilite de votre boutique Shopify
- La validite de votre Access Token
- Les permissions accordees a l'application
- Le nombre de produits existants sur la boutique

### Parametres de publication

Avant de lancer un export, configurez les parametres de publication par defaut :

- **Statut des produits** : Publie (visible immediatement), Brouillon ou Archive
- **Emplacement de stock** : selectionnez l'emplacement Shopify a utiliser pour les stocks
- **Canal de vente** : choisissez si les produits doivent etre visibles sur la boutique en ligne, le POS, etc.

---

## Champs requis par Shopify

Shopify exige un ensemble minimal de champs pour creer un produit. Assurez-vous que ces champs sont renseignes dans Products Manager avant de lancer l'export :

| Champ Shopify | Description | Obligatoire |
|---------------|-------------|-------------|
| **Title** | Nom du produit | Oui |
| **Body HTML** | Description du produit (HTML) | Non, mais recommande |
| **Vendor** | Nom du fournisseur ou de la marque | Non |
| **Product Category** | Categorie du produit | Non |
| **Type** | Type de produit | Non |
| **Tags** | Etiquettes pour le filtrage | Non |
| **Variant SKU** | Reference unique de la variante | Non, mais recommande |
| **Variant Barcode** | Code-barres EAN/UPC | Non |
| **Variant Price** | Prix de vente | Oui |
| **Image Src** | URL de l'image principale | Non, mais recommande |

---

## Mapping des champs

Le tableau ci-dessous presente la correspondance par defaut entre les champs Products Manager et les champs Shopify :

| Products Manager | Shopify | Notes |
|-----------------|---------|-------|
| `title` | `Title` | Nom du produit |
| `description` | `Body HTML` | Description complete, HTML preserve |
| `supplier.name` | `Vendor` | Nom du fournisseur |
| `category.name` | `Product Category` | Categorie principale |
| `product_type` | `Type` | Type de produit |
| `tags` | `Tags` | Etiquettes separees par virgule |
| `sku` | `Variant SKU` | Reference unique |
| `ean` | `Variant Barcode` | Code-barres EAN13 ou UPC |
| `price` | `Variant Price` | Prix de vente TTC |
| `original_price` | `Variant Compare At Price` | Ancien prix (barre) |
| `weight` | `Variant Grams` | Poids en grammes |
| `stock_quantity` | `Variant Inventory Qty` | Quantite en stock |
| `images[0].url` | `Image Src` | URL de l'image principale |
| `is_active` | `Status` | active / draft / archived |

{% callout type="note" %}
Vous pouvez personnaliser ce mapping lors de la creation de l'export. Sauvegardez votre mapping personnalise en template pour le reutiliser lors des prochains exports.
{% /callout %}

---

## Gestion des variantes

Shopify organise les produits en produit parent et variantes. Chaque variante correspond a une combinaison d'options (taille, couleur, matiere, etc.).

### Fonctionnement

- Shopify autorise un maximum de **3 options** par produit (ex : Couleur, Taille, Matiere)
- Chaque combinaison d'options genere une **variante** distincte
- Chaque variante possede son propre SKU, prix, stock et code-barres
- Shopify autorise un maximum de **100 variantes** par produit

### Configuration dans Products Manager

Lors de l'export, Products Manager peut gerer les variantes de deux manieres :

1. **Produits individuels** : chaque variante est un produit distinct dans Products Manager, lie au produit parent. A l'export, ils sont regroupes en un seul produit Shopify avec plusieurs variantes.

2. **Produit avec variations** : un seul produit dans Products Manager contient toutes ses variations. A l'export, les variations sont converties en variantes Shopify.

### Exemple de mapping des variantes

| Products Manager | Shopify Variant |
|-----------------|-----------------|
| `variant_option_1` | Option 1 (ex : Couleur) |
| `variant_option_2` | Option 2 (ex : Taille) |
| `variant_sku` | Variant SKU |
| `variant_price` | Variant Price |
| `variant_stock` | Variant Inventory Qty |

---

## Export pas a pas

1. Depuis le menu lateral, accedez a **Exports**
2. Cliquez sur **Nouvel export** et selectionnez **Shopify** comme destination
3. Selectionnez les produits a exporter (tous, par categorie, par selection)
4. Verifiez et ajustez le mapping des champs si necessaire
5. Configurez les options de publication (statut, emplacement de stock)
6. Cliquez sur **Lancer l'export**
7. Suivez la progression dans le tableau de bord des exports

{% callout type="warning" %}
Pour les catalogues de plus de 500 produits, l'export est traite en arriere-plan. Vous recevrez une notification une fois l'export termine. Respectez les limites de taux de l'API Shopify pour eviter les erreurs.
{% /callout %}

---

## Gestion des images

### Exigences Shopify

- Les images doivent etre accessibles via une **URL publique**
- Formats acceptes : JPG, PNG, WebP, GIF
- Taille maximale : **20 Mo** par image
- Limite : **250 images** par produit

### Comportement a l'export

Lors de l'export, Products Manager transfere les images vers Shopify de la maniere suivante :

1. Les URLs des images stockees dans MinIO sont transmises a Shopify
2. Shopify telecharge les images et les heberge sur son propre CDN
3. Les URLs Shopify CDN sont enregistrees dans Products Manager pour reference

### Optimisation recommandee

- Redimensionnez les images a 2048x2048 pixels maximum avant l'export
- Privilegiez le format JPEG pour les photos de produits
- Utilisez une qualite de compression de 85% pour un bon compromis poids/qualite
- Nommez vos fichiers images de maniere descriptive (le nom est utilise comme texte alternatif)

---

## Verification apres export

Apres un export vers Shopify, effectuez les verifications suivantes :

1. **Tableau de bord des exports** : verifiez que le statut de l'export est "Termine" sans erreurs
2. **Admin Shopify** : connectez-vous a votre back-office Shopify et verifiez que les produits apparaissent dans **Produits**
3. **Donnees produit** : ouvrez quelques produits au hasard et verifiez le titre, la description, le prix et les images
4. **Variantes** : si vous avez exporte des produits avec variantes, verifiez que les options et les SKU sont corrects
5. **Stock** : verifiez que les quantites en stock correspondent a celles de Products Manager
6. **Boutique en ligne** : si les produits sont publies, verifiez leur affichage sur votre boutique

---

## Erreurs courantes et solutions

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| "Access token invalid" | Token Shopify expire ou revoque | Regenerez le token dans Shopify et mettez a jour l'integration |
| "Product title can't be blank" | Champ titre vide dans Products Manager | Renseignez le titre pour tous les produits a exporter |
| "Variant price must be positive" | Prix absent ou egal a zero | Verifiez que le prix est renseigne et superieur a zero |
| "Image could not be downloaded" | URL image inaccessible | Verifiez que l'URL de l'image est publique et valide |
| "Too Many Requests (429)" | Depassement du rate limit API | L'export reprendra automatiquement apres un delai |
| "SKU already exists" | SKU en doublon sur Shopify | Verifiez les doublons dans votre catalogue ou activez la mise a jour des produits existants |

---

## Prochaines etapes

- [Documentation technique Shopify](/docs/integrations/shopify) : reference complete de l'integration Shopify
- [Exporter vos Produits](/docs/guide/exports) : vue d'ensemble de toutes les options d'export
- [Export WooCommerce](/docs/guide/export-woocommerce) : exporter vers une autre plateforme
- [Gestion des Produits](/docs/guide/produits) : preparer vos produits avant l'export
