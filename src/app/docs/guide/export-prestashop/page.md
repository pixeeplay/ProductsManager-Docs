---
title: Export PrestaShop
nextjs:
  metadata:
    title: Export PrestaShop - Guide Utilisateur Products Manager APP
    description: "Exportez vos produits vers PrestaShop depuis Products Manager APP. Configuration du Webservice, mapping des champs, gestion multi-langues et des declinaisons."
---

Exportez et synchronisez vos produits depuis Products Manager APP vers votre boutique PrestaShop via l'API Webservice. {% .lead %}

---

## Introduction

L'export vers PrestaShop vous permet de publier vos produits directement sur votre boutique PrestaShop. Products Manager APP utilise le Webservice PrestaShop pour creer et mettre a jour vos produits, gerer les stocks, les categories, les images et les declinaisons (combinaisons de variantes).

Ce guide vous accompagne dans la configuration de la connexion, le mapping des champs et le processus d'export complet vers PrestaShop, y compris la gestion du multi-langues.

---

## Prerequis

Avant de commencer, assurez-vous de disposer des elements suivants :

- Une **boutique PrestaShop** operationnelle (version 1.7.x, 8.0.x ou 8.1.x)
- Le **Webservice PrestaShop** active dans le back-office
- Une **cle API Webservice** generee avec les permissions necessaires
- La connexion PrestaShop configuree dans **Parametres** > **Integrations** de Products Manager APP

{% callout type="warning" %}
Le Webservice PrestaShop est desactive par defaut. Vous devez l'activer manuellement dans **Parametres avances** > **Webservice** du back-office PrestaShop avant de pouvoir configurer l'export.
{% /callout %}

---

## Configuration de la connexion

### Verifier la connexion PrestaShop

1. Accedez a **Parametres** > **Integrations** dans Products Manager APP
2. Localisez votre integration PrestaShop dans la liste
3. Cliquez sur **Tester la connexion** pour verifier que tout fonctionne

Le test de connexion verifie :

- L'accessibilite de votre boutique PrestaShop
- La validite de la cle API Webservice
- Les permissions accordees (produits, stocks, categories, images, declinaisons)
- Le nombre de produits existants dans la boutique

### Parametres de configuration

Lors de la configuration, precisez les parametres suivants :

- **URL de la boutique** : l'adresse complete de votre site PrestaShop (avec https://)
- **Cle API** : la cle Webservice de 32 caracteres
- **Langue par defaut** : l'identifiant de la langue principale (generalement 1 pour le francais)
- **Boutique par defaut** : l'identifiant de la boutique (1 si vous avez une seule boutique)

{% callout type="note" %}
Si vous n'avez pas encore configure la connexion PrestaShop, consultez la [documentation technique de l'integration PrestaShop](/docs/integrations/prestashop) pour les instructions detaillees de configuration.
{% /callout %}

---

## Champs requis par PrestaShop

PrestaShop exige un ensemble minimal de champs pour creer un produit. Voici les champs principaux :

| Champ PrestaShop | Description | Obligatoire |
|------------------|-------------|-------------|
| **Name** | Nom du produit (multi-langue) | Oui |
| **Description** | Description complete du produit | Non, mais recommande |
| **Description Short** | Description courte | Non, mais recommande |
| **Price** | Prix de vente (HT par defaut) | Oui |
| **Reference** | Reference unique (SKU) | Non, mais recommande |
| **EAN13** | Code-barres EAN13 | Non |
| **Quantity** | Quantite en stock | Non |
| **id_category_default** | Categorie principale | Oui |
| **Active** | Statut actif/inactif | Non (actif par defaut) |

---

## Mapping des champs

Le tableau ci-dessous presente la correspondance par defaut entre les champs Products Manager et les champs PrestaShop :

| Products Manager | PrestaShop | Notes |
|-----------------|------------|-------|
| `title` | `name` | Multi-langue supporte |
| `description` | `description` | HTML preserve, multi-langue |
| `short_description` | `description_short` | Multi-langue |
| `sku` | `reference` | Reference unique du produit |
| `ean` | `ean13` | Code-barres EAN13 |
| `price` | `price` | Prix HT par defaut (conversion automatique) |
| `cost_price` | `wholesale_price` | Prix d'achat fournisseur |
| `stock_quantity` | `quantity` | Quantite disponible en stock |
| `category.name` | `id_category_default` | Categorie principale |
| `weight` | `weight` | Poids en kg |
| `is_active` | `active` | 1 = actif, 0 = inactif |
| `images[].url` | `images` | Upload separe via l'API images |

{% callout type="note" %}
PrestaShop utilise par defaut les prix hors taxes (HT). Products Manager effectue la conversion automatique si vos prix sont en TTC, en se basant sur la regle de taxe configuree dans PrestaShop.
{% /callout %}

---

## Gestion multi-langues

PrestaShop est nativement multi-langue. Lors de l'export, Products Manager gere les contenus traduits de la maniere suivante :

### Comportement par defaut

- Le contenu de Products Manager est exporte dans la **langue par defaut** configuree dans l'integration
- Si le parametre "Repliquer dans toutes les langues" est active, le contenu est copie dans toutes les langues configurees dans PrestaShop

### Configuration avancee

Si vous gerez des traductions dans Products Manager, vous pouvez configurer le mapping par langue :

| Langue PrestaShop (ID) | Champ Products Manager |
|------------------------|----------------------|
| 1 (Francais) | `title` |
| 2 (English) | `title_en` |
| 3 (Espanol) | `title_es` |

### Langue de repli

Configurez une langue de repli (fallback) dans les parametres de l'integration. Si un contenu n'est pas disponible dans une langue, le contenu de la langue de repli est utilise.

---

## Export pas a pas

1. Depuis le menu lateral, accedez a **Exports**
2. Cliquez sur **Nouvel export** et selectionnez **PrestaShop** comme destination
3. Selectionnez les produits a exporter (tous, par categorie, par fournisseur, par selection)
4. Verifiez et ajustez le mapping des champs si necessaire
5. Configurez les options multi-langues si applicable
6. Selectionnez la categorie par defaut pour les nouveaux produits
7. Cliquez sur **Lancer l'export**
8. Suivez la progression dans le tableau de bord des exports

{% callout type="note" %}
PrestaShop ne supporte pas nativement les webhooks. La synchronisation entre Products Manager et PrestaShop fonctionne par interrogation periodique (polling). Pour une mise a jour automatique, configurez un export planifie.
{% /callout %}

---

## Gestion des images et des declinaisons

### Images

L'upload des images vers PrestaShop fonctionne differemment des autres plateformes :

- Les images sont envoyees separement via l'endpoint `POST /api/images/products/{id}`
- PrestaShop genere automatiquement les miniatures selon la configuration de votre theme
- Formats acceptes : JPG, PNG, GIF
- Taille maximale : 8 Mo par defaut (configurable dans PrestaShop)

### Declinaisons (Combinaisons)

Les declinaisons PrestaShop correspondent aux variantes de produits (taille, couleur, pointure, etc.) :

- Chaque declinaison possede sa propre reference, son prix specifique et son stock
- Les attributs sont crees automatiquement dans PrestaShop s'ils n'existent pas
- Le prix de la declinaison est exprime en difference par rapport au prix du produit parent

### Exemple de declinaisons

| Declinaison | Reference | Prix (+/-) | Stock |
|-------------|-----------|------------|-------|
| Rouge / S | TSHIRT-RED-S | +0.00 | 15 |
| Rouge / M | TSHIRT-RED-M | +0.00 | 22 |
| Rouge / L | TSHIRT-RED-L | +2.00 | 10 |
| Bleu / S | TSHIRT-BLUE-S | +0.00 | 18 |
| Bleu / M | TSHIRT-BLUE-M | +0.00 | 25 |
| Bleu / L | TSHIRT-BLUE-L | +2.00 | 8 |

---

## Verification apres export

Apres un export vers PrestaShop, effectuez les verifications suivantes :

1. **Tableau de bord des exports** : verifiez que l'export est "Termine" sans erreurs
2. **Back-office PrestaShop** : accedez a **Catalogue** > **Produits** et verifiez les produits exportes
3. **Donnees produit** : verifiez le titre, la description, le prix et la reference sur quelques produits
4. **Categories** : verifiez que les produits sont assignes aux bonnes categories
5. **Images** : verifiez que les images sont correctement affichees dans les fiches produits
6. **Stock** : verifiez les quantites dans l'onglet **Quantites** de chaque produit
7. **Declinaisons** : si applicable, verifiez que les combinaisons sont creees correctement avec les bons attributs
8. **Multi-langues** : basculez entre les langues dans le back-office pour verifier les traductions
9. **Boutique** : visitez la boutique en ligne pour verifier l'affichage des produits

---

## Erreurs courantes et solutions

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| "401 Unauthorized" | Cle API invalide ou desactivee | Verifiez la cle API dans le Webservice PrestaShop |
| "This call to PrestaShop Web Services failed" | Webservice desactive ou URL incorrecte | Activez le Webservice dans Parametres avances |
| "Invalid product name" | Nom du produit vide ou contenant des caracteres interdits | Renseignez un nom valide pour tous les produits |
| "Category does not exist" | ID de categorie invalide | Verifiez que la categorie par defaut existe dans PrestaShop |
| "Image upload failed" | Taille ou format non supporte | Reduisez l'image a moins de 8 Mo, utilisez JPG ou PNG |
| "Stock update failed" | Advanced Stock Management active sans configuration | Configurez l'entrepot par defaut dans les parametres |
| "Duplicate reference" | Reference (SKU) deja existante | Verifiez les doublons ou activez la mise a jour des produits existants |

{% callout type="warning" %}
Si vous utilisez le module Advanced Stock Management de PrestaShop, assurez-vous de configurer l'entrepot par defaut dans les parametres de l'integration Products Manager pour que les stocks soient correctement mis a jour.
{% /callout %}

---

## Prochaines etapes

- [Documentation technique PrestaShop](/docs/integrations/prestashop) : reference complete de l'integration PrestaShop
- [Exporter vos Produits](/docs/guide/exports) : vue d'ensemble de toutes les options d'export
- [Export Shopify](/docs/guide/export-shopify) : exporter vers une autre plateforme
- [Gestion des Produits](/docs/guide/produits) : preparer vos produits avant l'export
