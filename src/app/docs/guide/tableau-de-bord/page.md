---
title: Tableau de Bord
nextjs:
  metadata:
    title: Tableau de Bord - Guide Utilisateur Products Manager APP
    description: "Decouvrez le tableau de bord de Products Manager APP : statistiques cles, activite recente, graphiques de tendances et personnalisation des widgets."
---

Votre point de depart quotidien pour suivre l'activite de votre catalogue, surveiller les imports et analyser les performances de vos fournisseurs. {% .lead %}

---

## Vue d'Ensemble

Le **Tableau de Bord** est la premiere page que vous voyez apres connexion a Products Manager APP. Il regroupe dans une interface unique toutes les informations essentielles pour piloter votre activite au quotidien : statistiques en temps reel, fil d'activite, graphiques de tendances et metriques avancees.

Chaque widget du tableau de bord est concu pour vous donner une vision synthetique de l'etat de votre catalogue et de vos flux de donnees, sans avoir a naviguer dans les differents modules.

---

## Widgets Principaux

### Statistiques Cles

Le bandeau superieur du tableau de bord affiche quatre indicateurs en temps reel :

| Indicateur | Description | Calcul |
|------------|-------------|--------|
| **Total Produits** | Nombre total de produits actifs dans votre catalogue | Comptage en temps reel |
| **Fournisseurs Actifs** | Nombre de fournisseurs configures et ayant importe au moins une fois | Fournisseurs avec dernier import < 30 jours |
| **Imports Aujourd'hui** | Nombre d'imports executes dans les dernieres 24 heures | Comptage glissant 24h |
| **Taux de Reussite** | Pourcentage d'imports termines sans erreur critique | Imports reussis / Total imports x 100 |

Chaque indicateur est accompagne d'une **fleche de tendance** indiquant l'evolution par rapport a la periode precedente (hausse, baisse ou stable).

{% callout type="note" %}
Cliquez sur n'importe quel indicateur pour acceder directement au detail correspondant (liste des produits, fournisseurs, historique des imports).
{% /callout %}

### Activite Recente

Sous les statistiques, un fil d'activite chronologique liste les derniers evenements de votre plateforme :

- **Imports completes** : nom du fournisseur, nombre de produits traites, duree
- **Imports en echec** : raison de l'echec, lien vers le rapport d'erreurs
- **Produits crees** : nombre de nouveaux produits ajoutes et source
- **Produits modifies** : nombre de fiches mises a jour et champs concernes
- **Alertes stock** : produits dont le stock est passe sous le seuil d'alerte
- **Alertes prix** : notifications du [Price Monitor](/docs/guide/price-monitor)

Le fil d'activite affiche les **50 derniers evenements** par defaut. Cliquez sur **Voir tout** pour acceder a l'historique complet.

### Graphiques de Tendances

La section inferieure du tableau de bord propose trois graphiques interactifs :

#### Imports par Jour (7 derniers jours)

Un graphique en barres affichant le nombre d'imports executes chaque jour, colore selon le statut :

- **Vert** : imports reussis
- **Orange** : imports avec avertissements
- **Rouge** : imports en echec

#### Produits Ajoutes (30 derniers jours)

Un graphique en courbe montrant l'evolution quotidienne du nombre de produits ajoutes a votre catalogue. Ce graphique permet d'identifier les pics d'activite et les periodes creuses.

#### Performance par Fournisseur

Un graphique en barres horizontales classant vos fournisseurs par taux de reussite d'import. Chaque barre indique le nombre total d'imports et le pourcentage de reussite.

---

## Personnalisation du Dashboard

### Ajouter ou Retirer des Widgets

1. Cliquez sur le bouton **Personnaliser** en haut a droite du tableau de bord
2. La liste des widgets disponibles s'affiche
3. Cochez ou decochez les widgets selon vos besoins
4. Cliquez sur **Appliquer**

### Reorganiser les Widgets

1. En mode personnalisation, faites glisser les widgets pour les repositionner
2. Chaque widget peut etre place dans la colonne de gauche (pleine largeur) ou en grille (demi-largeur)
3. Cliquez sur **Enregistrer la disposition**

{% callout type="note" %}
La personnalisation est propre a chaque utilisateur. Chaque membre de votre equipe peut configurer son propre tableau de bord selon ses responsabilites.
{% /callout %}

### Widgets Supplementaires Disponibles

En plus des widgets par defaut, vous pouvez ajouter :

| Widget | Description |
|--------|-------------|
| **Completude Moyenne** | Score moyen de completude de vos fiches produit |
| **Repartition par Statut** | Graphique camembert des produits par statut (actif, brouillon, archive) |
| **Top Fournisseurs** | Classement des 5 fournisseurs avec le plus grand volume de produits |
| **Dernieres Recherches Code2ASIN** | Resultats des dernieres recherches [Code2ASIN](/docs/guide/code2asin) |
| **Enrichissements IA Recents** | Dernieres fiches enrichies par [l'IA](/docs/guide/enrichissement-ia) |
| **Alertes Prix Actives** | Resume des alertes du [Price Monitor](/docs/guide/price-monitor) |

---

## Filtres Temporels

Tous les widgets du tableau de bord sont synchronises sur une meme periode temporelle que vous pouvez modifier :

| Filtre | Periode Couverte |
|--------|-----------------|
| **Aujourd'hui** | Les dernieres 24 heures |
| **7 jours** | Les 7 derniers jours calendaires |
| **30 jours** | Les 30 derniers jours calendaires |
| **Personnalise** | Periode definie par une date de debut et une date de fin |

Pour changer la periode, utilisez le selecteur de dates situe en haut a droite du tableau de bord. Les graphiques et statistiques se mettent a jour automatiquement.

{% callout type="warning" %}
Les periodes personnalisees superieures a 90 jours peuvent entrainer un temps de chargement plus long pour les graphiques, en particulier si votre catalogue contient plus de 50 000 produits.
{% /callout %}

---

## Metriques Detaillees

### Completude Moyenne

Le score de completude moyen de l'ensemble de votre catalogue, calcule sur la base des champs remplis par rapport aux champs requis pour chaque produit. Un score eleve (superieur a 80 %) indique un catalogue bien renseigne et pret pour l'export.

### Repartition par Statut

Un graphique circulaire montrant la distribution de vos produits selon leur statut :

- **Actif** : produits publies et visibles sur vos canaux de vente
- **Brouillon** : produits en cours de creation ou d'enrichissement
- **Archive** : produits retires de la vente mais conserves dans le catalogue
- **Erreur** : produits avec des donnees manquantes ou invalides

### Top Fournisseurs

Le classement de vos fournisseurs selon plusieurs criteres :

| Critere | Description |
|---------|-------------|
| **Volume de produits** | Nombre total de produits importes |
| **Taux de reussite** | Pourcentage d'imports sans erreur |
| **Frequence** | Nombre d'imports sur la periode selectionnee |
| **Completude** | Score moyen de completude des fiches importees |

---

## Export des Rapports

### Export PDF

1. Cliquez sur **Exporter** en haut a droite du tableau de bord
2. Selectionnez **PDF**
3. Le rapport genere inclut tous les widgets visibles avec leurs graphiques et donnees a la date du jour
4. Le fichier PDF est telecharge automatiquement

### Export CSV

1. Cliquez sur **Exporter** en haut a droite du tableau de bord
2. Selectionnez **CSV**
3. Choisissez les donnees a inclure (statistiques, activite, metriques)
4. Le fichier CSV est telecharge avec l'ensemble des donnees brutes

{% callout type="note" %}
Les exports PDF sont ideaux pour les rapports de direction, tandis que les exports CSV sont adaptes a l'analyse dans un tableur ou un outil de Business Intelligence.
{% /callout %}

---

## Bonnes Pratiques

1. **Consultez le tableau de bord quotidiennement** : prenez 2 minutes chaque matin pour verifier l'etat de vos imports et les alertes eventuelles
2. **Surveillez les alertes** : traitez les imports en echec et les alertes stock des qu'elles apparaissent pour eviter les ruptures
3. **Analysez les tendances** : utilisez les graphiques pour identifier les ameliorations possibles dans vos flux d'import
4. **Personnalisez selon votre role** : un administrateur n'a pas les memes besoins qu'un operateur ; adaptez vos widgets en consequence
5. **Exportez des rapports reguliers** : programmez un export hebdomadaire pour constituer un historique et suivre l'evolution de vos indicateurs

---

## Ressources Techniques

Pour des informations techniques approfondies sur les metriques et l'analyse de donnees :

- [Market Intelligence](/docs/features/market-intelligence) -- Fonctionnalites d'analyse de marche et reporting avance

---

## Prochaines Etapes

- [Enrichissement IA](/docs/guide/enrichissement-ia) -- Enrichissez vos fiches produit avec l'intelligence artificielle
- [Price Monitor](/docs/guide/price-monitor) -- Surveillez les prix de vos concurrents
- [Gestion des Produits](/docs/guide/produits) -- Gerez votre catalogue en detail
