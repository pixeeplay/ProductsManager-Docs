---
title: Recherche Produits
nextjs:
  metadata:
    title: Recherche Produits - Products Manager APP
    description: Guide complet de la recherche produits dans Products Manager v4.5.58 - recherche rapide, filtres avances, raccourcis clavier et recherches sauvegardees.
---

Trouvez n'importe quel produit en quelques secondes grace au moteur de recherche Meilisearch. Recherche instantanee par EAN, SKU, titre, marque ou ASIN, filtres avances et recherches sauvegardees pour un acces rapide a vos donnees. {% .lead %}

---

## Vue d'Ensemble

La recherche dans Products Manager est alimentee par **Meilisearch**, un moteur de recherche performant qui offre des temps de reponse inferieurs a 50 ms. Le systeme interroge simultanement plusieurs index (produits, marques, categories, fournisseurs) et fusionne les resultats par pertinence.

En cas d'indisponibilite de Meilisearch, un **fallback PostgreSQL** prend automatiquement le relais sans interruption de service, avec des temps de reponse legerement plus longs (< 200 ms).

### Fonctionnalites Principales

- **Recherche instantanee** avec autocompletion en temps reel
- **Recherche multi-criteres** : EAN, SKU, titre, marque, ASIN
- **Filtres avances** combinables pour des requetes precises
- **Recherches sauvegardees** pour retrouver vos filtres favoris
- **Raccourci clavier** pour ouvrir la recherche depuis n'importe quelle page
- **Tolerance aux erreurs** : Meilisearch gere les fautes de frappe et les approximations

---

## Recherche Rapide

La recherche rapide est accessible depuis n'importe quelle page de l'application.

### Ouvrir la Recherche

Utilisez le raccourci clavier ou cliquez sur la barre de recherche dans le header :

| Raccourci | Systeme |
|-----------|---------|
| **Ctrl + K** | Windows / Linux |
| **Cmd + K** | macOS |

La barre de recherche s'ouvre en superposition avec un champ de saisie et des suggestions en temps reel.

### Rechercher par Identifiant

La recherche par identifiant permet de trouver un produit exact instantanement :

| Type d'identifiant | Exemple | Comportement |
|--------------------|---------|-------------|
| **EAN** | `3760001234567` | Resultat exact sur le code-barres |
| **SKU** | `TSH-BLU-M-001` | Resultat exact sur la reference interne |
| **ASIN** | `B08N5WRWNW` | Resultat exact sur le code Amazon |

{% callout type="note" %}
Pour une recherche par identifiant, saisissez le code complet. La recherche par EAN partiel ne retournera pas de resultat exact car Meilisearch privilegiera la recherche textuelle.
{% /callout %}

### Rechercher par Texte

La recherche textuelle fonctionne sur plusieurs champs simultanement :

| Champ recherche | Exemple de requete |
|-----------------|-------------------|
| **Titre** | `t-shirt bleu coton` |
| **Marque** | `Nike` |
| **Description** | `coton biologique` |
| **Reference fabricant** | `REF-12345` |

Meilisearch applique automatiquement :

- La **tokenisation** : decoupe la requete en mots-cles
- Le **classement par pertinence** : les resultats les plus proches apparaissent en premier
- La **tolerance aux fautes** : `nikee` trouvera les produits de la marque `Nike`
- Les **synonymes** si configures : `tee-shirt` trouvera aussi `t-shirt`

### Autocompletion

Pendant la saisie, des suggestions apparaissent en temps reel :

- Les resultats sont affiches en moins de 20 ms
- Chaque suggestion indique son type (produit, marque, categorie)
- Un maximum de 10 suggestions est affiche par defaut
- Cliquez sur une suggestion ou utilisez les fleches du clavier puis **Entree** pour naviguer directement vers le resultat

---

## Filtres Avances

Les filtres avances permettent de construire des requetes precises en combinant plusieurs criteres.

### Acceder aux Filtres

1. Accedez a **Produits** dans le menu lateral
2. Cliquez sur le bouton **Filtres** au-dessus de la liste
3. Le panneau de filtres s'affiche avec les differentes categories

### Filtres par Fournisseur

| Filtre | Description |
|--------|-------------|
| **Fournisseur** | Selectionner un ou plusieurs fournisseurs |
| **Sans fournisseur** | Produits non associes a un fournisseur |

### Filtres par Statut

| Filtre | Options |
|--------|---------|
| **Statut** | Brouillon, Actif, Inactif, Archive |
| **En corbeille** | Afficher les produits supprimes |

### Filtres par Categorie

| Filtre | Description |
|--------|-------------|
| **Categorie** | Selection dans l'arborescence (multi-selection) |
| **Sans categorie** | Produits non classes |
| **Sous-categories incluses** | Inclure les sous-categories dans le filtre |

### Filtres par Prix

| Filtre | Description |
|--------|-------------|
| **Prix minimum** | Produits dont le prix est superieur ou egal a la valeur |
| **Prix maximum** | Produits dont le prix est inferieur ou egal a la valeur |
| **Sans prix** | Produits sans prix defini |

### Filtres par Stock

| Filtre | Description |
|--------|-------------|
| **Stock minimum** | Produits avec un stock superieur ou egal |
| **Stock maximum** | Produits avec un stock inferieur ou egal |
| **En rupture** | Produits dont le stock est a zero |
| **En stock** | Produits avec un stock positif |

### Filtres par Completude

| Filtre | Description |
|--------|-------------|
| **Grade** | Filtrer par grade de completude (A, B, C, F) |
| **Score minimum** | Produits avec un score superieur ou egal |
| **Score maximum** | Produits avec un score inferieur ou egal |
| **Champ manquant** | Produits ou un champ specifique est absent |

Consultez le guide [Score de Completude](/docs/guide/completude) pour comprendre le systeme de scoring.

### Filtres par Date

| Filtre | Description |
|--------|-------------|
| **Date de creation** | Produits crees dans une periode donnee |
| **Date de modification** | Produits modifies dans une periode donnee |
| **Dernier import** | Produits importes dans une periode donnee |

### Filtres de Disponibilite

| Filtre | Description |
|--------|-------------|
| **Avec ASIN** | Produits possedant un code ASIN Amazon |
| **Avec images** | Produits ayant au moins une image |
| **Avec prix** | Produits ayant un prix defini |

### Combiner les Filtres

Tous les filtres sont combinables avec une logique **ET** (tous les criteres doivent etre remplis). Par exemple :

- Fournisseur = "Dupont" **ET** Stock = 0 **ET** Statut = Actif : affiche les produits actifs en rupture chez Dupont
- Grade = F **ET** Avec images = Non : affiche les produits incomplets sans image

---

## Recherches Sauvegardees

Les combinaisons de filtres frequemment utilisees peuvent etre sauvegardees pour un acces rapide.

### Sauvegarder une Recherche

1. Configurez vos filtres selon vos besoins
2. Cliquez sur **Sauvegarder ce filtre**
3. Donnez un nom explicite a votre recherche (par exemple : "Produits en rupture chez Dupont")
4. Cliquez sur **Enregistrer**

### Utiliser une Recherche Sauvegardee

1. Cliquez sur le menu deroulant **Filtres sauvegardes** au-dessus de la liste
2. Selectionnez la recherche sauvegardee souhaitee
3. Les filtres sont automatiquement appliques

### Gerer les Recherches Sauvegardees

- **Renommer** : Cliquez sur l'icone d'edition a cote du nom
- **Supprimer** : Cliquez sur l'icone de suppression
- **Modifier** : Chargez la recherche, ajustez les filtres, puis sauvegardez a nouveau

{% callout type="note" %}
Les recherches sauvegardees sont propres a chaque utilisateur. Elles ne sont pas partagees entre les membres de l'equipe.
{% /callout %}

---

## Affichage et Tri des Resultats

### Options d'Affichage

Les resultats de recherche s'affichent dans la vue courante (tableau ou cartes). Vous pouvez basculer entre les deux vues a tout moment :

- **Vue Tableau** : affichage dense avec toutes les colonnes, ideal pour les operations en masse
- **Vue Cartes** : affichage visuel avec les images en grand format

### Options de Tri

Cliquez sur un en-tete de colonne (en vue tableau) pour trier les resultats :

| Critere de tri | Description |
|---------------|-------------|
| **Titre** | Ordre alphabetique (A-Z ou Z-A) |
| **Prix** | Du moins cher au plus cher (ou inversement) |
| **Stock** | Du stock le plus bas au plus eleve (ou inversement) |
| **Date de creation** | Du plus recent au plus ancien (ou inversement) |
| **Date de modification** | Du plus recemment modifie au plus ancien |
| **Score de completude** | Du score le plus bas au plus eleve (ou inversement) |
| **Pertinence** | Tri par defaut lors d'une recherche textuelle |

{% callout type="note" %}
Le tri par **pertinence** est le tri par defaut lorsqu'une requete de recherche est active. Il est determine par le moteur Meilisearch en fonction de la correspondance entre la requete et les champs indexes.
{% /callout %}

---

## Conseils pour une Recherche Efficace

### Utiliser les Identifiants Exacts

Pour trouver un produit precis, privilegiez la recherche par identifiant exact :

- Saisissez un **EAN complet** (13 chiffres) pour un resultat immediat
- Utilisez un **SKU exact** pour retrouver une reference interne
- Recherchez par **ASIN** pour les produits Amazon

### Combiner Recherche et Filtres

La recherche textuelle et les filtres avances fonctionnent ensemble :

1. Saisissez un terme de recherche dans la barre (par exemple : `chaussure`)
2. Appliquez des filtres pour affiner (fournisseur, prix, stock)
3. Les resultats cumulent les deux criteres

### Raccourcis Utiles

| Action | Raccourci |
|--------|-----------|
| Ouvrir la recherche | **Ctrl/Cmd + K** |
| Valider la recherche | **Entree** |
| Naviguer dans les suggestions | **Fleches haut/bas** |
| Fermer la recherche | **Echap** |
| Effacer la recherche | **Ctrl/Cmd + Backspace** |

### Bonnes Pratiques

- **Soyez specifique** : "t-shirt coton bleu XL" donne de meilleurs resultats que "t-shirt"
- **Utilisez les filtres pour les criteres numeriques** : prix, stock, score -- les filtres sont plus precis que la recherche textuelle pour ces champs
- **Sauvegardez vos filtres recurrents** : gagnez du temps en accedant directement a vos combinaisons de filtres frequentes
- **Verifiez le statut des filtres actifs** : un badge indique le nombre de filtres actifs au-dessus de la liste

---

## Prochaines Etapes

- [Gestion des Produits](/docs/guide/produits) -- Creer, modifier et organiser vos fiches produit
- [Score de Completude](/docs/guide/completude) -- Comprendre et ameliorer la qualite de vos fiches
- [Importer des Produits](/docs/guide/imports) -- Alimenter votre catalogue par import de fichiers
- [Documentation technique : Search Engine](/docs/modules/search-engine) -- Architecture technique du moteur de recherche, endpoints API et configuration Meilisearch
