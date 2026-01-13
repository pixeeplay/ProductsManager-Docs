---
title: Gestion des Produits
nextjs:
  metadata:
    title: Gestion des Produits - Products Manager APP
    description: Guide complet pour gerer vos produits dans Products Manager - liste, filtres, vues, actions en masse et medias.
---

Maitrisez la gestion complete de votre catalogue produits : navigation, filtrage, edition, actions en masse et gestion des medias. {% .lead %}

---

## Vue d'Ensemble

Le module **Produits** est le coeur de Products Manager. Il vous permet de :

- **Visualiser** votre catalogue avec differentes vues
- **Rechercher** et **filtrer** rapidement vos produits
- **Editer** les fiches produits individuellement ou en masse
- **Gerer** les images et medias associes
- **Exporter** vos selections

---

## Structure d'un Produit

### Champs Principaux

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| **Titre** | Texte | Oui | Nom du produit (max 255 caracteres) |
| **EAN** | Texte | Oui* | Code-barres EAN-13 (13 chiffres) |
| **SKU** | Texte | Oui* | Reference interne unique |
| **Description** | HTML | Non | Description detaillee |
| **Prix** | Decimal | Non | Prix de vente TTC |
| **Prix d'achat** | Decimal | Non | Cout d'acquisition |
| **Stock** | Entier | Non | Quantite en stock |
| **Poids** | Decimal | Non | Poids en kg |
| **Marque** | Texte | Non | Nom de la marque |
| **Categorie** | Relation | Non | Categorie(s) du produit |
| **Fournisseur** | Relation | Non | Fournisseur(s) associe(s) |

{% callout type="note" %}
EAN ou SKU : au moins un identifiant unique est requis pour chaque produit.
{% /callout %}

### Champs Avances

| Champ | Description |
|-------|-------------|
| **Dimensions** | Longueur x Largeur x Hauteur |
| **Couleur** | Couleur principale |
| **Taille** | Taille/Format |
| **Matiere** | Composition/Materiaux |
| **Pays d'origine** | Code ISO du pays |
| **Code douanier** | Code HS/nomenclature |
| **TVA** | Taux de TVA applicable |

---

## Liste des Produits

### Acceder a la Liste

1. Cliquez sur **Produits** dans le menu lateral
2. La liste affiche par defaut tous les produits actifs

### Vues Disponibles

Products Manager propose deux modes d'affichage :

#### Vue Tableau

Affichage classique en colonnes avec :

- Image miniature
- Titre du produit
- EAN / SKU
- Prix
- Stock
- Fournisseur
- Statut

**Avantages** : Dense, permet de voir beaucoup d'informations, ideal pour les operations en masse.

#### Vue Cartes

Affichage en grille de cartes visuelles avec :

- Image principale en grand format
- Titre du produit
- Prix et stock
- Actions rapides

**Avantages** : Visuel, ideal pour les catalogues avec images, navigation plus intuitive.

### Basculer entre les Vues

Cliquez sur les icones de vue en haut a droite de la liste :

- Icone tableau pour la vue tableau
- Icone grille pour la vue cartes

---

## Filtres de Recherche

### Recherche Rapide

Utilisez la barre de recherche (**Ctrl/Cmd + K**) pour chercher par :

- **EAN** : `3760001234567`
- **SKU** : `SKU-12345`
- **Titre** : `t-shirt bleu`
- **Marque** : `marque:Nike`

### Filtres Avances

Cliquez sur **Filtres** pour acceder aux options avancees :

#### Filtres de Disponibilite

| Filtre | Description |
|--------|-------------|
| **has_asin** | Produits avec/sans ASIN Amazon |
| **in_stock** | Produits en stock uniquement |
| **has_price** | Produits avec un prix defini |
| **has_images** | Produits avec au moins une image |

#### Filtres de Categorie

| Filtre | Options |
|--------|---------|
| **Categorie** | Selection multiple dans l'arborescence |
| **Fournisseur** | Selection multiple |
| **Marque** | Texte libre ou liste |

#### Filtres de Valeurs

| Filtre | Options |
|--------|---------|
| **Prix** | Min - Max |
| **Stock** | Min - Max, En rupture |
| **Poids** | Min - Max |

#### Filtres de Dates

| Filtre | Options |
|--------|---------|
| **Date creation** | Periode |
| **Date modification** | Periode |
| **Dernier import** | Periode |

#### Filtres de Statut

| Filtre | Options |
|--------|---------|
| **Statut** | Actif, Inactif, Archive, Brouillon |
| **Tags** | Selection multiple |

### Sauvegarder un Filtre

1. Configurez vos filtres
2. Cliquez sur **Sauvegarder ce filtre**
3. Donnez un nom (ex: "Produits en rupture")
4. Retrouvez-le dans le menu **Filtres sauvegardes**

{% callout type="note" %}
Les filtres sauvegardes sont accessibles rapidement depuis le menu deroulant des filtres.
{% /callout %}

---

## Actions en Masse

### Selectionner des Produits

| Action | Effet |
|--------|-------|
| **Clic case** | Selectionne un produit |
| **Shift + Clic** | Selectionne une plage |
| **Ctrl/Cmd + A** | Selectionne tous les produits visibles |
| **Case en-tete** | Selectionne la page courante |

### Actions Disponibles

Une fois des produits selectionnes, la barre d'actions apparait :

#### Modifier en Masse

Modifiez plusieurs champs simultanement :

| Champ | Options |
|-------|---------|
| **Prix** | Valeur fixe, +/- %, +/- montant |
| **Stock** | Valeur fixe, +/- quantite |
| **Statut** | Actif, Inactif |
| **Categorie** | Ajouter, Remplacer, Supprimer |
| **Tags** | Ajouter, Remplacer, Supprimer |
| **Fournisseur** | Ajouter, Remplacer |

#### Supprimer

1. Selectionnez les produits
2. Cliquez sur **Supprimer**
3. Confirmez la suppression

{% callout type="warning" %}
Les produits supprimes vont dans la corbeille et sont supprimes definitivement apres 30 jours.
{% /callout %}

#### Exporter

Exportez votre selection dans differents formats :

- **CSV** : Format universel
- **Excel** : Format .xlsx avec mise en forme
- **JSON** : Format structure pour integration

### Limites des Actions en Masse

| Action | Limite recommandee | Maximum |
|--------|-------------------|---------|
| Modification | 1,000 produits | 10,000 |
| Suppression | 500 produits | 5,000 |
| Export | 50,000 produits | 100,000 |

---

## Creer un Produit

### Creation Manuelle

1. Cliquez sur **Produits** dans le menu
2. Cliquez sur **+ Nouveau produit**
3. Remplissez les informations :

#### Informations Generales

- **Titre** (obligatoire) : Nom du produit
- **EAN** : Code-barres EAN-13
- **SKU** : Reference interne

#### Description

Utilisez l'editeur rich text pour formater votre description :

- Mise en forme (gras, italique, souligne)
- Listes a puces
- Liens
- Images

#### Prix et Stock

- **Prix TTC** : Prix de vente
- **Prix d'achat** : Cout d'acquisition
- **Stock** : Quantite disponible

4. Cliquez sur **Enregistrer**

### Creation par Import

Pour creer plusieurs produits, utilisez l'[import de fichiers](/docs/user-guides/imports-workflow).

### Creation par API

```bash
POST /api/v1/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "T-shirt bleu",
  "ean": "3760001234567",
  "price": 29.99,
  "description": "T-shirt 100% coton"
}
```

---

## Modifier un Produit

### Modification Individuelle

1. Trouvez le produit (recherche ou navigation)
2. Cliquez sur le produit pour ouvrir sa fiche
3. Modifiez les champs souhaites
4. Cliquez sur **Enregistrer**

### Modification Rapide (Inline)

Dans la vue tableau :

1. Double-cliquez sur une cellule editable
2. Modifiez la valeur
3. Appuyez sur **Entree** pour valider

Champs modifiables en inline :

- Titre
- Prix
- Stock
- Statut

### Historique des Modifications

Chaque produit conserve un historique complet :

1. Ouvrez la fiche produit
2. Cliquez sur l'onglet **Historique**
3. Consultez les modifications par date

L'historique affiche :

- Date et heure de la modification
- Utilisateur ou source (import automatique)
- Champs modifies avec anciennes et nouvelles valeurs

---

## Gestion des Medias

### Types de Medias Supportes

| Type | Formats | Taille Max |
|------|---------|------------|
| **Images** | JPEG, PNG, WebP, GIF | 10 MB |
| **Nombre max** | 20 images par produit | - |
| **Resolution recommandee** | 1000x1000 px minimum | - |

### Ajouter des Images

1. Ouvrez la fiche produit
2. Section **Medias**
3. Options d'ajout :
   - **Glisser-deposer** des fichiers
   - **Cliquer** pour parcourir vos fichiers
   - **URL** pour importer depuis le web

### Organiser les Images

- **Glissez** les images pour les reorganiser
- **Etoile** : Definissez l'image principale
- **Corbeille** : Supprimez une image
- **Clic droit** : Menu contextuel avec options supplementaires

### Optimisation Automatique

Products Manager optimise automatiquement vos images :

- **Redimensionnement** : 2000px maximum
- **Compression** : JPEG 85% qualite
- **Formats** : WebP genere automatiquement
- **Thumbnails** : 3 tailles (150px, 300px, 800px)
- **CDN** : Distribution globale pour performance optimale

---

## Statuts des Produits

### Etats Disponibles

| Statut | Description | Visible |
|--------|-------------|---------|
| **Brouillon** | En cours de creation | Non |
| **Actif** | Publie et vendable | Oui |
| **Inactif** | Masque temporairement | Non |
| **Archive** | Conservation historique | Non |
| **Corbeille** | En attente de suppression | Non |

### Workflow de Statut

```text
Brouillon -> Actif <-> Inactif
                |
            Archive
                |
            Corbeille
                |
         Supprime (30 jours)
```

### Changer le Statut

**Individuel** :

1. Ouvrez la fiche produit
2. Menu **Statut** en haut a droite
3. Selectionnez le nouveau statut

**En masse** :

1. Selectionnez les produits
2. **Actions** -> **Changer le statut**
3. Choisissez le statut

---

## Organisation des Produits

### Categories

#### Creer une Categorie

1. **Produits** -> **Categories**
2. Cliquez sur **+ Nouvelle categorie**
3. Renseignez :
   - Nom
   - Description
   - Categorie parente (optionnel)
   - Image (optionnel)

#### Structure Hierarchique

Les categories peuvent etre imbriquees :

```text
Vetements
|-- Hommes
|   |-- T-shirts
|   |-- Pantalons
|   |-- Vestes
|-- Femmes
|   |-- Robes
|   |-- Jupes
|   |-- Chemisiers
|-- Enfants
    |-- Garcons
    |-- Filles
```

#### Assigner des Categories

**Methode 1 : Fiche produit**

1. Ouvrez le produit
2. Section **Categories**
3. Cochez les categories applicables

**Methode 2 : Actions en masse**

1. Selectionnez plusieurs produits
2. **Actions** -> **Assigner a une categorie**

### Tags

Les tags permettent une organisation flexible et transversale :

- Creez des tags librement
- Associez plusieurs tags par produit
- Filtrez rapidement par tag

**Creer un tag** :

1. Dans la fiche produit, section **Tags**
2. Tapez le nom du nouveau tag
3. Appuyez sur **Entree**

---

## Corbeille et Restauration

### Supprimer un Produit

1. Fiche produit -> **...** -> **Supprimer**
2. Le produit va dans la corbeille
3. Suppression definitive apres 30 jours

### Restaurer un Produit

1. **Produits** -> **Corbeille**
2. Trouvez le produit
3. Cliquez sur **Restaurer**

### Vider la Corbeille

1. **Produits** -> **Corbeille**
2. Cliquez sur **Vider la corbeille**
3. Confirmez (action irreversible)

{% callout type="warning" %}
La suppression de la corbeille est definitive et irreversible.
{% /callout %}

---

## Raccourcis Clavier

| Action | Raccourci |
|--------|-----------|
| Nouveau produit | **Ctrl/Cmd + N** |
| Recherche | **Ctrl/Cmd + K** |
| Sauvegarder | **Ctrl/Cmd + S** |
| Dupliquer | **Ctrl/Cmd + D** |
| Supprimer | **Suppr** ou **Backspace** |
| Selectionner tout | **Ctrl/Cmd + A** |
| Navigation | Fleches directionnelles |

---

## Bonnes Pratiques

### Qualite des Donnees

1. **Titres descriptifs** : Incluez les caracteristiques cles
2. **EAN valides** : Verifiez le format 13 chiffres
3. **Images de qualite** : Minimum 1000x1000px
4. **Descriptions completes** : Informations utiles pour le client

### Organisation

1. **Categories coherentes** : Structure logique et navigable
2. **Tags strategiques** : Pour les regroupements transversaux
3. **Statuts a jour** : Refletent la disponibilite reelle

### Performance

1. **Filtres sauvegardes** : Pour les recherches frequentes
2. **Actions en masse** : Pour les modifications repetitives
3. **Imports reguliers** : Pour maintenir les donnees a jour

---

## Prochaines Etapes

- [Workflow d'Import](/docs/user-guides/imports-workflow) - Importer vos produits depuis vos fournisseurs
- [Workflow d'Export](/docs/user-guides/exports-workflow) - Exporter vers vos plateformes e-commerce
- [Enrichissement IA](/docs/features/ai-enrichment) - Ameliorer vos fiches produits automatiquement
