---
title: EAN Lookup
nextjs:
  metadata:
    title: EAN Lookup - Guide Utilisateur Products Manager APP
    description: "Recherchez des informations produit a partir d'un code EAN ou UPC et enrichissez automatiquement vos fiches grace au module EAN Lookup de Products Manager APP."
---

Recherchez des informations produit a partir d'un code EAN ou UPC pour enrichir automatiquement vos fiches et valider la qualite de vos codes-barres. {% .lead %}

---

## Vue d'Ensemble

Le module **EAN Lookup** de Products Manager APP vous permet de retrouver les informations d'un produit (titre, marque, categorie, description, images, dimensions) a partir de son code-barres EAN ou UPC. Ce module interroge un ensemble de bases de donnees publiques et partenaires pour fournir les resultats les plus complets possibles.

L'EAN Lookup est un outil essentiel pour completer rapidement vos fiches produit lorsque vous disposez uniquement du code-barres, et pour valider la qualite de vos donnees avant un export.

---

## Comment Fonctionne l'EAN Lookup

Le systeme interroge simultanement plusieurs sources de donnees pour maximiser le taux de resultats :

1. **Bases de donnees partenaires** : bases de donnees commerciales specialisees dans les codes-barres
2. **Bases de donnees publiques** : Open Food Facts, Open Beauty Facts et registres nationaux
3. **Cache interne** : les resultats precedemment trouves sont mis en cache pour accelerer les recherches repetees

Les informations retournees sont agreges et deduplicees pour fournir la fiche la plus complete possible.

---

## Utilisation

### Recherche Individuelle

1. Accedez a **EAN Lookup** depuis le menu lateral
2. Saisissez le code EAN (13 chiffres) ou UPC (12 chiffres) dans le champ de recherche
3. Cliquez sur **Rechercher**
4. Les informations trouvees s'affichent en quelques secondes
5. Cliquez sur **Appliquer a un produit** pour associer les donnees a une fiche existante ou creer un nouveau produit

### Recherche en Masse via Fichier

1. Accedez a **EAN Lookup** depuis le menu lateral
2. Cliquez sur **Recherche en masse**
3. Uploadez un fichier CSV ou Excel contenant une colonne de codes EAN
4. Cliquez sur **Lancer la recherche**
5. Le traitement se deroule en arriere-plan ; une notification vous previent a la fin
6. Consultez et telechargez le rapport de resultats

{% callout type="note" %}
Le fichier d'import doit contenir une colonne nommee **EAN**, **UPC** ou **code_barres**. Le systeme detecte automatiquement la colonne correspondante.
{% /callout %}

---

## Informations Retournees

Selon la disponibilite des donnees dans les sources interrogees, l'EAN Lookup peut retourner les informations suivantes :

| Donnee | Description | Taux de Disponibilite |
|--------|-------------|----------------------|
| **Titre produit** | Denomination commerciale du produit | Eleve |
| **Marque** | Marque ou fabricant du produit | Eleve |
| **Categorie** | Classification du produit (alimentaire, electronique, etc.) | Moyen |
| **Description** | Description detaillee du produit | Moyen |
| **Images** | URL des images produit (principale et secondaires) | Moyen |
| **Dimensions** | Longueur, largeur, hauteur et poids | Faible a moyen |
| **Composition** | Liste des ingredients ou materiaux (produits alimentaires) | Faible |
| **Pays d'origine** | Pays de fabrication ou de conditionnement | Faible |

---

## Enrichissement Automatique

Lorsque des resultats sont trouves, vous pouvez les utiliser pour completer automatiquement les champs manquants de vos fiches produit :

### Enrichir une Fiche Existante

1. Depuis les resultats de recherche, cliquez sur **Associer a un produit**
2. Selectionnez le produit cible dans votre catalogue
3. Cochez les champs a remplir (titre, marque, description, images, etc.)
4. Cliquez sur **Appliquer**

### Creer un Produit a partir des Resultats

1. Depuis les resultats de recherche, cliquez sur **Creer un produit**
2. Les champs disponibles sont pre-remplis avec les donnees trouvees
3. Completez les informations manquantes (prix, stock, fournisseur)
4. Cliquez sur **Enregistrer**

{% callout type="warning" %}
Les donnees issues de l'EAN Lookup proviennent de sources tierces. Verifiez toujours leur exactitude avant de publier vos fiches produit, en particulier pour les descriptions et les images.
{% /callout %}

---

## Validation EAN

Le module inclut un outil de validation des codes EAN qui verifie :

- **Format** : le code contient exactement 13 chiffres (EAN-13) ou 12 chiffres (UPC-A)
- **Checksum** : le chiffre de controle est valide selon l'algorithme standard
- **Prefixe pays** : le prefixe correspond a un organisme de codification reconnu (GS1)

### Valider un EAN

1. Saisissez le code dans le champ de validation
2. Le systeme indique instantanement si le code est valide ou invalide
3. En cas d'erreur, le systeme suggere le chiffre de controle correct

### Validation en Masse

Depuis la liste des produits, cliquez sur **Actions groupees > Valider les EAN** pour verifier l'ensemble de vos codes-barres. Un rapport detaille liste les codes invalides avec la raison de l'erreur.

---

## Statistiques de Recherche

Le tableau de bord de l'EAN Lookup affiche des statistiques sur vos recherches :

| Metrique | Description |
|----------|-------------|
| **Recherches effectuees** | Nombre total de recherches lancees |
| **Resultats trouves** | Nombre de codes EAN pour lesquels des informations ont ete trouvees |
| **Taux de reussite** | Pourcentage de recherches ayant retourne au moins un resultat |
| **Champs completes** | Nombre total de champs produit remplis grace a l'EAN Lookup |

---

## Bonnes Pratiques

1. **Utilisez des EAN valides** : validez vos codes-barres avant de lancer une recherche pour eviter les requetes inutiles
2. **Verifiez les resultats** : les donnees proviennent de sources tierces ; une verification manuelle est recommandee pour les informations critiques
3. **Combinez avec l'enrichissement IA** : utilisez les donnees de l'EAN Lookup comme base, puis enrichissez avec le module [Enrichissement IA](/docs/guide/enrichissement-ia) pour generer des descriptions optimisees
4. **Traitez par lots** : pour un grand volume de codes, utilisez la recherche en masse plutot que la recherche individuelle
5. **Exploitez le cache** : les resultats sont mis en cache ; une seconde recherche pour le meme EAN est instantanee

---

## Ressources Techniques

Pour des informations techniques approfondies sur le module EAN Lookup :

- [EAN Manager](/docs/features/ean-manager) -- Specifications detaillees et documentation API

---

## Prochaines Etapes

- [Code2ASIN](/docs/guide/code2asin) -- Retrouvez l'ASIN Amazon correspondant a vos EAN
- [Enrichissement IA](/docs/guide/enrichissement-ia) -- Completez vos fiches avec l'intelligence artificielle
- [Tableau de Bord](/docs/guide/tableau-de-bord) -- Suivez l'activite globale de votre catalogue
