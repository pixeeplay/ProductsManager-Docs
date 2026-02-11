---
title: Export Amazon
nextjs:
  metadata:
    title: Export Amazon - Guide Utilisateur Products Manager APP
    description: "Exportez vos produits vers Amazon Seller Central depuis Products Manager APP. Configuration SP-API, mapping des champs, gestion des ASIN et des images."
---

Exportez vos produits depuis Products Manager APP vers Amazon Seller Central pour les publier sur la marketplace Amazon. {% .lead %}

---

## Introduction

L'export vers Amazon vous permet de publier et de mettre a jour vos produits sur Amazon Seller Central directement depuis Products Manager APP. Le systeme prend en charge la creation de nouvelles fiches produits, l'association a des ASIN existants, ainsi que la gestion des stocks et des prix.

Amazon impose des regles strictes sur la qualite des donnees produits. Ce guide vous accompagne dans la preparation de vos produits, le mapping des champs et le processus d'export vers Amazon.

---

## Prerequis

Avant de commencer, assurez-vous de disposer des elements suivants :

- Un **compte Amazon Seller Central** actif (Individual ou Professional)
- L'acces a l'**API SP-API** (Selling Partner API) configure
- Les **identifiants API** (Client ID, Client Secret, Refresh Token) renseignes dans Products Manager APP
- La connexion Amazon configuree dans **Parametres** > **Integrations**

{% callout type="warning" %}
L'utilisation de l'API SP-API necessite un compte Seller Professional et l'approbation du programme developeur Amazon. Les delais d'approbation peuvent varier de quelques jours a plusieurs semaines.
{% /callout %}

---

## Configuration de la connexion

### Verifier la connexion Amazon

1. Accedez a **Parametres** > **Integrations** dans Products Manager APP
2. Localisez votre integration Amazon dans la liste
3. Cliquez sur **Tester la connexion** pour verifier que tout fonctionne

Le test de connexion verifie :

- L'accessibilite de l'API SP-API Amazon
- La validite des identifiants (Client ID, Client Secret, Refresh Token)
- Les permissions accordees au compte vendeur
- La marketplace configuree (Amazon.fr, Amazon.de, Amazon.co.uk, etc.)

### Parametres de configuration

Lors de la configuration, precisez les parametres suivants :

- **Marketplace** : selectionnez la place de marche cible (ex : Amazon.fr)
- **Type de compte** : Individual ou Professional
- **Mode d'export** : creation de nouvelles fiches ou association a des ASIN existants
- **Condition** : etat des produits (Neuf, Reconditionne, Occasion)

{% callout type="note" %}
Si vous n'avez pas encore configure la connexion Amazon, consultez la [documentation technique de l'integration Amazon](/docs/integrations/amazon-pa-api) pour les instructions de configuration.
{% /callout %}

---

## Champs requis par Amazon

Amazon impose un ensemble strict de champs obligatoires pour creer une offre produit. Voici les champs principaux du format Flat File :

| Champ Amazon | Description | Obligatoire |
|--------------|-------------|-------------|
| **item_sku** | Reference unique du vendeur (SKU) | Oui |
| **item_name** | Titre du produit (max 200 caracteres) | Oui |
| **product_description** | Description complete du produit | Oui |
| **standard_price** | Prix de vente | Oui |
| **quantity** | Quantite en stock | Oui |
| **main_image_url** | URL de l'image principale | Oui |
| **brand_name** | Nom de la marque | Oui (selon categorie) |
| **manufacturer** | Nom du fabricant | Oui (selon categorie) |
| **product_type** | Type/categorie Amazon (Browse Node) | Oui |
| **external_product_id** | Code EAN/UPC du produit | Oui (sauf marque propre) |
| **external_product_id_type** | Type de code (EAN, UPC) | Oui si code fourni |

---

## Mapping des champs

Le tableau ci-dessous presente la correspondance par defaut entre les champs Products Manager et les champs Amazon Flat File :

| Products Manager | Amazon | Notes |
|-----------------|--------|-------|
| `sku` | `item_sku` | Reference unique du vendeur |
| `title` | `item_name` | Tronque a 200 caracteres si necessaire |
| `description` | `product_description` | HTML converti en texte brut |
| `price` | `standard_price` | Prix de vente TTC |
| `stock_quantity` | `quantity` | Quantite disponible |
| `images[0].url` | `main_image_url` | Image principale (fond blanc requis) |
| `images[1..8].url` | `other_image_url1..8` | Images supplementaires |
| `brand` | `brand_name` | Nom de la marque |
| `manufacturer` | `manufacturer` | Nom du fabricant |
| `ean` | `external_product_id` | Code EAN13 |
| `weight` | `item_weight` | Poids en grammes |
| `bullet_points` | `bullet_point1..5` | Points forts (5 maximum) |

{% callout type="note" %}
Amazon impose des regles strictes sur le format des titres et des descriptions. Consultez les directives de la categorie concernee dans Seller Central pour connaitre les exigences specifiques.
{% /callout %}

---

## ASIN et codes produit

### Qu'est-ce qu'un ASIN

L'ASIN (Amazon Standard Identification Number) est l'identifiant unique d'un produit sur Amazon. Chaque fiche produit sur Amazon possede un ASIN.

### Association EAN vers ASIN

Lorsque vous exportez un produit vers Amazon, deux scenarios sont possibles :

1. **Le produit existe deja sur Amazon** : si votre code EAN correspond a un ASIN existant, votre offre est associee a la fiche produit existante. Vous partagez cette fiche avec d'autres vendeurs.

2. **Le produit n'existe pas sur Amazon** : une nouvelle fiche produit est creee avec un nouvel ASIN. Vous devez fournir toutes les informations obligatoires (titre, description, images, categorie).

### Utiliser Code2ASIN

Products Manager APP integre le module **Code2ASIN** qui vous permet de mapper automatiquement vos codes EAN vers les ASIN Amazon correspondants avant l'export :

1. Accedez au module [Code2ASIN](/docs/guide/code2asin)
2. Lancez un job de mapping avec vos codes EAN
3. Les ASIN trouves sont automatiquement associes a vos produits
4. Lors de l'export, Products Manager utilise ces ASIN pour associer vos offres aux fiches existantes

{% callout type="note" %}
Le mapping EAN vers ASIN via Code2ASIN est fortement recommande avant un premier export vers Amazon. Il vous permet d'identifier les produits deja references sur Amazon et d'eviter la creation de fiches en doublon.
{% /callout %}

---

## Export pas a pas (format Flat File)

Le format Flat File est le format standard d'Amazon pour l'import en masse de produits via Seller Central.

1. Depuis le menu lateral, accedez a **Exports**
2. Cliquez sur **Nouvel export** et selectionnez **Amazon** comme destination
3. Selectionnez la **marketplace** cible (Amazon.fr, Amazon.de, etc.)
4. Selectionnez les produits a exporter (tous, par categorie, par fournisseur, par selection)
5. Verifiez et ajustez le mapping des champs
6. Choisissez le **mode d'export** :
   - **Flat File** : genere un fichier tabulaire (TSV) compatible Seller Central
   - **API directe** : envoi direct des produits via SP-API
7. Cliquez sur **Lancer l'export**
8. Suivez la progression dans le tableau de bord des exports

### Upload du Flat File dans Seller Central

Si vous avez choisi le mode Flat File :

1. Telechargez le fichier genere depuis Products Manager
2. Connectez-vous a Amazon Seller Central
3. Accedez a **Catalogue** > **Ajouter des produits via upload**
4. Selectionnez le fichier genere
5. Cliquez sur **Charger** et attendez le traitement par Amazon

---

## Regles specifiques Amazon

### Titres

- Longueur maximale : **200 caracteres**
- Format recommande : Marque + Ligne de produit + Materiau/Caracteristique cle + Type de produit + Couleur + Taille + Quantite
- Pas de caracteres speciaux excessifs, pas de majuscules completes
- Pas de mentions promotionnelles ("promo", "gratuit", "meilleur prix")

### Categories

- Chaque produit doit etre associe a une **categorie Amazon** (Browse Node)
- Utilisez le classificateur de produits Amazon pour trouver la bonne categorie
- Certaines categories sont restreintes et necessitent une approbation prealable

### Images

Amazon impose des regles strictes sur les images :

| Regle | Image principale | Images secondaires |
|-------|-----------------|-------------------|
| **Fond** | Blanc pur (RGB 255, 255, 255) | Fond blanc ou mise en situation |
| **Taille minimale** | 1000 x 1000 pixels | 1000 x 1000 pixels |
| **Taille maximale** | 10 000 x 10 000 pixels | 10 000 x 10 000 pixels |
| **Format** | JPEG, PNG, TIFF, GIF | JPEG, PNG, TIFF, GIF |
| **Contenu** | Produit uniquement, sans accessoire | Produit en contexte, details, dimensions |
| **Nombre maximum** | 1 | 8 |

{% callout type="warning" %}
Les images qui ne respectent pas les directives Amazon seront rejetees. Assurez-vous que votre image principale presente le produit sur fond blanc, sans texte ni logo superpose.
{% /callout %}

---

## Verification apres export

Apres un export vers Amazon, effectuez les verifications suivantes :

1. **Tableau de bord des exports** : verifiez que l'export est "Termine" sans erreurs
2. **Seller Central** : accedez a **Catalogue** > **Gerer l'inventaire** pour verifier vos offres
3. **Rapport de traitement** : si vous avez utilise le Flat File, consultez le rapport de traitement dans **Upload de fichiers** > **Surveiller le statut de l'upload**
4. **Fiches produit** : verifiez que les titres, descriptions et images sont corrects
5. **Prix et stock** : verifiez que les prix et les quantites correspondent
6. **Offre active** : verifiez que vos offres sont bien "Active" et non en erreur
7. **Page produit** : recherchez vos produits sur Amazon.fr pour verifier l'affichage public

{% callout type="note" %}
Le traitement par Amazon peut prendre de quelques minutes a 24 heures selon le volume de produits et la charge du systeme. Les nouveaux ASIN peuvent mettre jusqu'a 48 heures avant d'etre visibles dans le catalogue Amazon.
{% /callout %}

---

## Erreurs courantes et solutions

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| "SKU already exists" | SKU deja utilise dans votre inventaire Seller Central | Utilisez un SKU unique ou mettez a jour l'offre existante |
| "Invalid product ID" | Code EAN invalide ou non reconnu par Amazon | Verifiez le format EAN (13 chiffres) et la validite du code |
| "Image does not meet requirements" | Image non conforme aux directives Amazon | Corrigez l'image (fond blanc, taille minimale 1000px) |
| "Brand name not found" | Marque non enregistree dans Amazon Brand Registry | Enregistrez votre marque ou utilisez le nom exact |
| "Category requires approval" | Categorie restreinte necessite une approbation | Faites une demande d'approbation dans Seller Central |
| "Price too low/high" | Prix en dehors des limites fixees par Amazon | Verifiez et ajustez le prix de vente |
| "Throttling" | Depassement du rate limit API SP-API | L'export reprendra automatiquement apres un delai |

---

## Prochaines etapes

- [Documentation technique Amazon](/docs/integrations/amazon-pa-api) : reference complete de l'integration Amazon PA-API et SP-API
- [Code2ASIN](/docs/guide/code2asin) : mapper vos codes EAN vers les ASIN Amazon
- [Exporter vos Produits](/docs/guide/exports) : vue d'ensemble de toutes les options d'export
- [Gestion des Produits](/docs/guide/produits) : preparer vos produits avant l'export
