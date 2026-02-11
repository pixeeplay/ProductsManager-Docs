---
title: Export WooCommerce
nextjs:
  metadata:
    title: Export WooCommerce - Guide Utilisateur Products Manager APP
    description: "Exportez vos produits vers WooCommerce depuis Products Manager APP. Configuration de l'API REST, mapping des champs, gestion des categories et des images."
---

Exportez et synchronisez vos produits depuis Products Manager APP vers votre boutique WordPress/WooCommerce via l'API REST. {% .lead %}

---

## Introduction

L'export vers WooCommerce vous permet de publier vos produits directement sur votre boutique WordPress equipee du plugin WooCommerce. Products Manager APP utilise l'API REST WooCommerce v3 pour creer et mettre a jour vos produits, gerer les stocks, les categories et les images.

Ce guide vous accompagne dans la configuration de la connexion, le mapping des champs et le processus d'export complet vers WooCommerce.

---

## Prerequis

Avant de commencer, assurez-vous de disposer des elements suivants :

- Un **site WordPress** avec le plugin **WooCommerce** installe et active (version 4.0 ou superieure)
- L'**API REST WooCommerce** activee (activee par defaut depuis WooCommerce 3.0)
- Les **permaliens WordPress** configures (tout format sauf "Simple")
- Le protocole **HTTPS** active sur votre site
- Les **cles API WooCommerce** (Consumer Key et Consumer Secret) generees avec permissions Lecture/Ecriture

{% callout type="note" %}
Si vous n'avez pas encore configure la connexion WooCommerce dans Products Manager APP, consultez d'abord la [documentation technique de l'integration WooCommerce](/docs/integrations/woocommerce) pour les instructions de configuration initiale.
{% /callout %}

---

## Configuration de la connexion

### Verifier la connexion WooCommerce

1. Accedez a **Parametres** > **Integrations** dans Products Manager APP
2. Localisez votre integration WooCommerce dans la liste
3. Cliquez sur **Tester la connexion** pour verifier que tout fonctionne

Le test de connexion verifie :

- L'accessibilite de votre site WordPress
- La validite des cles API (Consumer Key et Consumer Secret)
- La version de l'API REST WooCommerce
- Le nombre de produits existants sur la boutique

### Parametres de publication

Configurez les parametres de publication par defaut avant de lancer un export :

- **Statut des produits** : Publie (visible), Brouillon ou Prive
- **Gestion des stocks** : activer ou desactiver le suivi des stocks pour les produits exportes
- **Catalogue uniquement** : rendre les produits visibles dans le catalogue mais non achetables

---

## Champs requis par WooCommerce

WooCommerce exige un ensemble minimal de champs pour creer un produit. Voici les champs principaux :

| Champ WooCommerce | Description | Obligatoire |
|-------------------|-------------|-------------|
| **post_title** (name) | Nom du produit | Oui |
| **post_content** (description) | Description complete du produit | Non, mais recommande |
| **_sku** (sku) | Reference unique du produit | Non, mais recommande |
| **_regular_price** (regular_price) | Prix de vente regulier | Oui |
| **_sale_price** (sale_price) | Prix promotionnel | Non |
| **_stock** (stock_quantity) | Quantite en stock | Non |
| **_stock_status** (stock_status) | Statut du stock (instock, outofstock) | Non |
| **product_cat** (categories) | Categories du produit | Non, mais recommande |

---

## Mapping des champs

Le tableau ci-dessous presente la correspondance par defaut entre les champs Products Manager et les champs WooCommerce :

| Products Manager | WooCommerce | Notes |
|-----------------|-------------|-------|
| `title` | `name` | Nom du produit |
| `description` | `description` | Description complete (HTML preserve) |
| `short_description` | `short_description` | Description courte |
| `sku` | `sku` | Reference unique |
| `ean` | `meta:_barcode` | Code-barres EAN13 (champ meta) |
| `price` | `regular_price` | Prix de vente regulier |
| `sale_price` | `sale_price` | Prix promotionnel |
| `stock_quantity` | `stock_quantity` | Quantite en stock |
| `category.name` | `categories` | Categories (hierarchiques) |
| `tags` | `tags` | Etiquettes du produit |
| `weight` | `weight` | Poids en kg |
| `images[].url` | `images` | URLs des images |
| `is_active` | `status` | publish / draft / private |

{% callout type="note" %}
Le mapping est entierement personnalisable. Vous pouvez associer n'importe quel champ Products Manager a un champ WooCommerce, y compris les champs meta personnalises.
{% /callout %}

---

## Gestion des categories hierarchiques

WooCommerce prend en charge les categories hierarchiques (categories parentes et sous-categories). Products Manager gere cette hierarchie lors de l'export :

### Fonctionnement

- Les categories Products Manager sont mappees aux categories WooCommerce existantes par correspondance de nom
- Si une categorie n'existe pas dans WooCommerce, elle est creee automatiquement
- La hierarchie est preservee : une sous-categorie dans Products Manager sera creee sous la bonne categorie parente dans WooCommerce

### Exemple de mapping

| Products Manager | WooCommerce |
|-----------------|-------------|
| Electronique | Electronique |
| Electronique > Smartphones | Electronique > Smartphones |
| Vetements > Hommes > T-shirts | Vetements > Hommes > T-shirts |

### Gestion des produits dans plusieurs categories

Un produit peut appartenir a plusieurs categories dans WooCommerce. Dans Products Manager, associez plusieurs categories a un produit pour qu'elles soient toutes exportees.

---

## Export pas a pas

1. Depuis le menu lateral, accedez a **Exports**
2. Cliquez sur **Nouvel export** et selectionnez **WooCommerce** comme destination
3. Selectionnez les produits a exporter (tous, par categorie, par fournisseur, par selection)
4. Verifiez et ajustez le mapping des champs si necessaire
5. Configurez les options de publication (statut, gestion des stocks)
6. Cliquez sur **Lancer l'export**
7. Suivez la progression dans le tableau de bord des exports

{% callout type="warning" %}
Si votre hebergement WordPress a des limites de resources (memoire PHP, timeout), privilegiez les exports par lots de 200 a 500 produits pour eviter les erreurs de timeout.
{% /callout %}

---

## Gestion des images

### Exigences WooCommerce

- Les images doivent etre accessibles via une **URL publique**
- Formats acceptes : JPG, PNG, WebP, GIF
- Taille maximale : depend de la configuration WordPress (8 Mo par defaut)
- Recommandation : moins de 10 images par produit pour la performance

### Comportement a l'export

Lors de l'export, Products Manager transmet les images a WooCommerce :

1. Les URLs des images sont envoyees via l'API REST WooCommerce
2. WordPress telecharge les images et les ajoute a la bibliotheque de medias
3. Les images sont automatiquement associees au produit
4. WordPress genere les miniatures selon votre configuration de theme

### Conseils d'optimisation

- Redimensionnez les images a 1200x1200 pixels maximum
- Compressez les images avant l'export (qualite 85%)
- Installez un plugin de compression d'images sur WordPress (Imagify, ShortPixel)
- Verifiez que le dossier `wp-content/uploads/` dispose des permissions d'ecriture

---

## Verification apres export

Apres un export vers WooCommerce, effectuez les verifications suivantes :

1. **Tableau de bord des exports** : verifiez que l'export est "Termine" sans erreurs
2. **Admin WordPress** : accedez a **Produits** dans le back-office WooCommerce
3. **Donnees produit** : verifiez le titre, la description, le prix et le SKU sur quelques produits
4. **Categories** : verifiez que les produits sont assignes aux bonnes categories
5. **Images** : verifiez que les images sont correctement affichees
6. **Stock** : verifiez les quantites en stock dans l'onglet Inventaire de chaque produit
7. **Boutique** : visitez votre boutique en ligne pour verifier l'affichage des produits publies

---

## Erreurs courantes et solutions

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| "woocommerce_rest_cannot_view" | Permissions API insuffisantes | Regenerez les cles API avec permissions Lecture/Ecriture |
| "Invalid or duplicated SKU" | SKU deja existant dans WooCommerce | Verifiez les doublons ou activez la mise a jour des produits existants |
| "Sorry, you are not allowed" | Utilisateur WordPress sans droits admin | Associez les cles API a un compte administrateur |
| "cURL error 28: Timeout" | Hebergement trop lent ou export trop volumineux | Reduisez la taille du lot ou augmentez le timeout PHP |
| "Image upload failed" | Image trop volumineuse ou format non supporte | Compressez l'image (max 8 Mo) et utilisez JPG ou PNG |
| "Invalid product category" | Categorie introuvable dans WooCommerce | Verifiez l'orthographe ou laissez Products Manager creer la categorie automatiquement |

{% callout type="note" %}
Si un plugin de securite WordPress (Wordfence, iThemes Security) bloque les requetes API, ajoutez l'adresse IP de Products Manager a la liste blanche.
{% /callout %}

---

## Prochaines etapes

- [Documentation technique WooCommerce](/docs/integrations/woocommerce) : reference complete de l'integration WooCommerce
- [Exporter vos Produits](/docs/guide/exports) : vue d'ensemble de toutes les options d'export
- [Export Shopify](/docs/guide/export-shopify) : exporter vers une autre plateforme
- [Gestion des Produits](/docs/guide/produits) : preparer vos produits avant l'export
