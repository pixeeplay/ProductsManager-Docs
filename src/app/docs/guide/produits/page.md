---
title: Gestion des Produits
nextjs:
  metadata:
    title: Gestion des Produits - Products Manager APP
    description: Guide complet pour creer, modifier, organiser et gerer vos produits dans Products Manager v4.5.58 - structure, statuts, images, variantes et actions en masse.
---

Maitrisez la gestion complete de votre catalogue produits : creation, edition, statuts, images, variantes et actions en masse pour un catalogue optimise et a jour. {% .lead %}

---

## Vue d'Ensemble

Le module **Produits** est le coeur de Products Manager. Il centralise toutes les operations liees a votre catalogue :

- **Creer** des produits manuellement, par import ou via l'API
- **Modifier** les fiches individuellement ou en edition rapide inline
- **Organiser** vos produits avec des statuts, categories et tags
- **Gerer** jusqu'a 20 images par produit avec optimisation automatique
- **Configurer** des variantes (taille, couleur) pour un meme produit
- **Agir en masse** sur des selections de produits (modification, suppression, export)
- **Suivre** l'historique complet des modifications de chaque fiche

Pour une vue detaillee du modele de donnees, consultez la [documentation technique du modele Produit](/docs/data-model/product).

---

## Structure d'un Produit

Chaque fiche produit dans Products Manager est composee de trois niveaux de champs : obligatoires, recommandes et avances. Le remplissage de ces champs influence directement le [score de completude](/docs/guide/completude) de vos produits.

### Champs Obligatoires

Ces champs sont requis pour enregistrer un produit :

| Champ | Type | Description |
|-------|------|-------------|
| **Titre** | Texte (max 255 caracteres) | Nom du produit, doit etre descriptif et unique |
| **EAN** | Texte (13 chiffres) | Code-barres EAN-13 international |
| **SKU** | Texte | Reference interne unique de votre entreprise |

{% callout type="note" %}
Au moins un identifiant unique est requis : EAN ou SKU. Idealement, renseignez les deux pour maximiser la compatibilite avec les plateformes e-commerce et les fournisseurs.
{% /callout %}

### Champs Recommandes

Ces champs ne sont pas obligatoires mais fortement conseilles pour un catalogue de qualite :

| Champ | Type | Description |
|-------|------|-------------|
| **Description** | HTML (rich text) | Description detaillee du produit |
| **Prix** | Decimal | Prix de vente TTC |
| **Marque** | Texte / Relation | Nom de la marque associee |
| **Categorie** | Relation | Categorie(s) du produit dans l'arborescence |
| **Stock** | Entier | Quantite disponible en stock |
| **Poids** | Decimal (kg) | Poids du produit pour les calculs de livraison |
| **image_url** | URL | URL de l'image principale du produit |

### Champs Avances

Ces champs permettent d'enrichir la fiche pour les marketplaces et les exports :

| Champ | Type | Description |
|-------|------|-------------|
| **Dimensions** | Texte | Longueur x Largeur x Hauteur (en cm) |
| **Couleur** | Texte | Couleur principale du produit |
| **Taille** | Texte | Taille ou format (S, M, L, XL, 38, 42...) |
| **Pays d'origine** | Code ISO | Pays de fabrication ou d'origine |
| **Code douanier** | Texte | Code HS / nomenclature combinee |
| **Matiere** | Texte | Composition et materiaux |
| **TVA** | Decimal (%) | Taux de TVA applicable |
| **Prix d'achat** | Decimal | Cout d'acquisition aupres du fournisseur |
| **Description courte** | Texte | Resume pour les fiches catalogue |
| **Donnees SEO** | Texte | Meta title et meta description |

---

## Creer un Produit

Products Manager propose trois methodes pour ajouter des produits a votre catalogue.

### Creation Manuelle

1. Cliquez sur **Produits** dans le menu lateral
2. Cliquez sur le bouton **+ Nouveau produit**
3. Remplissez les informations obligatoires :
   - **Titre** : Nom complet du produit
   - **EAN** et/ou **SKU** : Identifiant(s) unique(s)
4. Completez les champs recommandes (description, prix, marque, categorie, stock)
5. Ajoutez des images dans la section **Medias**
6. Cliquez sur **Enregistrer**

{% callout type="note" %}
Le produit est cree avec le statut **Brouillon** par defaut. Passez-le en **Actif** lorsque la fiche est complete et prete a etre publiee.
{% /callout %}

### Creation par Import

Pour creer plusieurs produits simultanement, utilisez la fonctionnalite d'import :

1. Preparez votre fichier (CSV, Excel ou JSON) avec les colonnes requises
2. Accedez a **Imports** dans le menu lateral
3. Suivez l'assistant d'import avec le mapping des colonnes

Consultez le guide [Importer des Produits](/docs/guide/imports) et les [Formats Supportes](/docs/guide/formats-import) pour les details.

### Creation par API

Les produits peuvent etre crees programmatiquement via l'API REST :

```bash
POST /api/v1/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "T-shirt bleu coton bio",
  "ean": "3760001234567",
  "sku": "TSH-BLU-M-001",
  "price": 29.99,
  "description": "T-shirt 100% coton biologique, coupe droite",
  "brand": "MaMarque",
  "stock": 150
}
```

Consultez la [Reference API](/docs/api/endpoints) pour la documentation complete des endpoints.

---

## Modifier un Produit

### Edition Individuelle

1. Trouvez le produit via la [recherche](/docs/guide/recherche) ou la navigation dans la liste
2. Cliquez sur le produit pour ouvrir sa fiche complete
3. Modifiez les champs souhaites dans les differentes sections
4. Cliquez sur **Enregistrer** pour valider les modifications

### Edition Inline Rapide

Dans la vue tableau de la liste des produits, vous pouvez modifier certains champs directement :

1. Double-cliquez sur une cellule editable dans le tableau
2. Modifiez la valeur affichee
3. Appuyez sur **Entree** pour valider ou **Echap** pour annuler

Les champs modifiables en inline sont :

- Titre
- Prix
- Stock
- Statut

Cette methode est ideale pour des corrections rapides sans ouvrir la fiche complete.

### Historique des Modifications

Chaque produit conserve un historique complet et tracable de toutes les modifications :

1. Ouvrez la fiche produit
2. Cliquez sur l'onglet **Historique**
3. Consultez la liste chronologique des modifications

L'historique affiche pour chaque entree :

- **Date et heure** de la modification
- **Utilisateur** ayant effectue la modification (ou source automatique : import, API, enrichissement IA)
- **Champs modifies** avec les anciennes et nouvelles valeurs
- **Type d'action** : creation, modification, changement de statut

{% callout type="note" %}
L'historique est conserve indefiniment et ne peut pas etre supprime. Il constitue une trace d'audit complete de votre catalogue.
{% /callout %}

---

## Statuts des Produits

Les statuts permettent de gerer le cycle de vie de chaque produit dans votre catalogue.

### Etats Disponibles

| Statut | Description | Visible en front | Exportable |
|--------|-------------|------------------|------------|
| **Brouillon** | Fiche en cours de creation ou incomplete | Non | Non |
| **Actif** | Produit publie, disponible a la vente | Oui | Oui |
| **Inactif** | Masque temporairement (rupture, saison...) | Non | Configurable |
| **Archive** | Conservation historique, produit retire | Non | Non |
| **Corbeille** | En attente de suppression definitive | Non | Non |

### Workflow de Statut

Le diagramme suivant illustre les transitions possibles entre statuts :

```text
                    +--------+
                    |Brouillon|
                    +----+----+
                         |
                         v
                +--------+--------+
                |      Actif      |
                +---+--------+----+
                    |        |
                    v        v
              +-----+--+ +--+------+
              |Inactif | |Archive  |
              +-----+--+ +--+------+
                    |        |
                    v        v
                +---+--------+----+
                |    Corbeille    |
                +--------+--------+
                         |
                    (30 jours)
                         |
                         v
                +--------+--------+
                | Supprime defini.|
                +-----------------+
```

### Changer le Statut

**Individuellement** :

1. Ouvrez la fiche produit
2. Utilisez le menu deroulant **Statut** en haut a droite
3. Selectionnez le nouveau statut

**En masse** :

1. Selectionnez les produits dans la liste
2. Cliquez sur **Actions** puis **Changer le statut**
3. Choisissez le statut cible et confirmez

{% callout type="warning" %}
Le passage en **Corbeille** declenche un compte a rebours de 30 jours avant la suppression definitive. Pensez a restaurer les produits places en corbeille par erreur avant ce delai.
{% /callout %}

---

## Actions en Masse

Les actions en masse permettent de modifier, supprimer ou exporter plusieurs produits simultanement.

### Selectionner des Produits

| Action | Effet |
|--------|-------|
| **Clic sur la case** | Selectionne un produit individuel |
| **Shift + Clic** | Selectionne une plage continue de produits |
| **Ctrl/Cmd + A** | Selectionne tous les produits visibles |
| **Case en-tete du tableau** | Selectionne/deselectionne la page courante |

### Operations Disponibles

Une fois des produits selectionnes, la barre d'actions en masse apparait en haut de la liste :

#### Modifier en masse

| Champ | Options de modification |
|-------|----------------------|
| **Prix** | Valeur fixe, pourcentage (+/-), montant (+/-) |
| **Stock** | Valeur fixe, ajout/retrait de quantite |
| **Statut** | Actif, Inactif, Archive |
| **Categorie** | Ajouter, Remplacer, Supprimer |
| **Tags** | Ajouter, Remplacer, Supprimer |
| **Fournisseur** | Ajouter, Remplacer |

#### Supprimer en masse

1. Selectionnez les produits a supprimer
2. Cliquez sur **Supprimer**
3. Confirmez l'operation dans la boite de dialogue

Les produits sont deplaces vers la corbeille (suppression douce).

#### Exporter une selection

Exportez les produits selectionnes dans le format de votre choix :

- **CSV** : Format universel, compatible avec tous les tableurs
- **Excel** : Format .xlsx avec mise en forme
- **JSON** : Format structure pour les integrations techniques

Consultez le guide [Exporter vos Produits](/docs/guide/exports) pour les details.

#### Assigner des categories en masse

1. Selectionnez les produits concernes
2. Cliquez sur **Actions** puis **Assigner a une categorie**
3. Choisissez la ou les categories dans l'arborescence
4. Selectionnez le mode : **Ajouter** (cumul) ou **Remplacer** (ecrasement)

### Limites Recommandees

| Action | Limite recommandee | Maximum technique |
|--------|-------------------|-------------------|
| Modification | 1 000 produits | 10 000 |
| Suppression | 500 produits | 5 000 |
| Export | 50 000 produits | 100 000 |

---

## Gestion des Images

Les images sont un element essentiel de vos fiches produit. Products Manager offre une gestion complete des medias avec optimisation automatique.

### Specifications Techniques

| Parametre | Valeur |
|-----------|--------|
| **Nombre maximum** | 20 images par produit |
| **Formats acceptes** | JPG, PNG, WebP |
| **Taille maximale** | 10 MB par image |
| **Resolution recommandee** | 1000 x 1000 px minimum |

### Ajouter des Images

Plusieurs methodes sont disponibles pour ajouter des images a un produit :

1. **Glisser-deposer** : Faites glisser vos fichiers directement dans la zone Medias de la fiche produit
2. **Parcourir** : Cliquez sur la zone d'upload pour selectionner des fichiers depuis votre ordinateur
3. **URL** : Renseignez une URL pour importer une image depuis le web
4. **Import** : Les images peuvent etre associees automatiquement lors d'un import de produits via le champ `image_url`

### Organiser les Images

- **Glissez-deposez** les vignettes pour reorganiser l'ordre d'affichage
- Cliquez sur l'icone **Etoile** pour definir l'image principale
- Cliquez sur l'icone **Corbeille** pour supprimer une image
- Utilisez le **clic droit** pour acceder au menu contextuel (telecharger, renommer, etc.)

### Optimisation Automatique

Products Manager optimise automatiquement chaque image uploadee :

- **Redimensionnement** : Maximum 2000 px sur le plus grand cote
- **Compression** : JPEG a 85% de qualite pour un bon equilibre poids/rendu
- **Conversion WebP** : Generation automatique du format WebP pour les navigateurs compatibles
- **Thumbnails** : 3 tailles generees automatiquement (150 px, 300 px, 800 px)
- **Distribution CDN** : Images servies via un CDN pour des temps de chargement optimaux

Pour plus de details techniques sur le systeme de vignettes, consultez la [documentation Thumbnail System](/docs/features/thumbnails-system).

---

## Variantes de Produit

Les variantes permettent de gerer les declinaisons d'un meme produit selon des attributs comme la taille ou la couleur.

### Creer des Variantes

1. Ouvrez la fiche du produit parent
2. Accedez a la section **Variantes**
3. Definissez les axes de variation :
   - **Taille** : S, M, L, XL, XXL ou tailles numeriques (38, 40, 42...)
   - **Couleur** : Bleu, Rouge, Noir, Blanc...
4. Products Manager genere automatiquement les combinaisons

### Gestion des Variantes

Chaque variante possede :

- Son propre **SKU** (genere automatiquement ou personnalise)
- Son propre **EAN** (si applicable)
- Son propre **stock**
- Son propre **prix** (ou herite du produit parent)
- Ses propres **images**

### Bonnes Pratiques pour les Variantes

- Utilisez le produit parent pour les informations communes (description, marque, categorie)
- Attribuez un SKU distinct a chaque variante pour un suivi precis des stocks
- Associez des images specifiques a chaque variante de couleur
- Verifiez que chaque variante possede un EAN unique si vous exportez vers des marketplaces

---

## Corbeille et Restauration

Products Manager utilise un systeme de **suppression douce** (soft delete) pour proteger vos donnees contre les suppressions accidentelles.

### Fonctionnement

- Lorsqu'un produit est supprime, il est deplace vers la **Corbeille**
- Les produits en corbeille sont conserves pendant **30 jours**
- Passe ce delai, la suppression devient **definitive et irreversible**
- Les produits en corbeille ne sont ni visibles ni exportables

### Supprimer un Produit

1. Ouvrez la fiche produit
2. Cliquez sur le menu **...** (trois points) puis **Supprimer**
3. Confirmez la mise en corbeille

### Restaurer un Produit

1. Accedez a **Produits** puis **Corbeille** dans le menu lateral
2. Trouvez le produit a restaurer
3. Cliquez sur **Restaurer**
4. Le produit reprend son statut precedent (Actif, Inactif ou Brouillon)

### Vider la Corbeille

1. Accedez a **Produits** puis **Corbeille**
2. Cliquez sur **Vider la corbeille**
3. Confirmez l'operation

{% callout type="warning" %}
Vider la corbeille supprime definitivement et de facon irreversible tous les produits qu'elle contient, ainsi que leurs images, variantes et historique. Cette action ne peut pas etre annulee.
{% /callout %}

---

## Bonnes Pratiques

### Qualite des Donnees

- **Titres descriptifs** : Incluez les caracteristiques principales (marque, type, couleur, taille)
- **EAN valides** : Verifiez le format a 13 chiffres et le chiffre de controle
- **Images de qualite** : Minimum 1000 x 1000 px, fond neutre de preference
- **Descriptions completes** : Fournissez des informations utiles et structurees

### Organisation du Catalogue

- **Categories coherentes** : Maintenez une arborescence logique et navigable
- **Tags strategiques** : Utilisez-les pour des regroupements transversaux (saison, promotion, nouveaute)
- **Statuts a jour** : Refletez la disponibilite reelle de chaque produit

### Performance

- **Utilisez les filtres sauvegardes** pour vos recherches frequentes
- **Privilegiez les actions en masse** pour les modifications repetitives
- **Planifiez des imports reguliers** pour maintenir les donnees synchronisees

---

## Prochaines Etapes

- [Score de Completude](/docs/guide/completude) -- Evaluez et ameliorez la qualite de vos fiches produit
- [Recherche Produits](/docs/guide/recherche) -- Trouvez rapidement n'importe quel produit dans votre catalogue
- [Importer des Produits](/docs/guide/imports) -- Ajoutez des produits en masse depuis vos fichiers fournisseurs
- [Exporter vos Produits](/docs/guide/exports) -- Publiez votre catalogue sur vos canaux de vente
- [Enrichissement IA](/docs/guide/enrichissement-ia) -- Ameliorez automatiquement vos fiches produit
- [Documentation technique : Completude](/docs/modules/completeness) -- Details techniques du scoring de completude
- [Documentation technique : Thumbnails](/docs/features/thumbnails-system) -- Systeme de generation des vignettes
