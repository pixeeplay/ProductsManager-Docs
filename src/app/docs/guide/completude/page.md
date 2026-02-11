---
title: Score de Completude
nextjs:
  metadata:
    title: Score de Completude - Products Manager APP
    description: Comprendre et ameliorer le score de completude de vos fiches produit dans Products Manager v4.5.58 - calcul, niveaux, bonnes pratiques et impact sur les exports.
---

Evaluez la qualite de vos fiches produit grace au score de completude. Ce pourcentage mesure le remplissage des champs de chaque produit et vous guide pour atteindre un catalogue pret a etre publie sur vos canaux de vente. {% .lead %}

---

## Qu'est-ce que le Score de Completude

Le score de completude est un indicateur numerique de **0 a 100%** attribue a chaque produit de votre catalogue. Il represente le pourcentage de champs renseignes, pondere selon leur importance.

Un produit dont tous les champs essentiels sont remplis obtient un score eleve. Un produit avec seulement un titre et un EAN aura un score faible, car de nombreuses informations manquent pour constituer une fiche exploitable.

Le score est accompagne d'un **grade lettre** (de A a F) qui permet de visualiser rapidement la qualite globale d'une fiche.

{% callout type="note" %}
Le score est recalcule automatiquement apres chaque modification de produit, chaque import et chaque enrichissement IA. Vous pouvez aussi declencher un recalcul manuel depuis le tableau de bord.
{% /callout %}

---

## Comment le Score est Calcule

Le calcul repose sur **18 criteres** repartis en 3 tiers de priorite. Les champs obligatoires pesent davantage dans le score final que les champs avances.

### Repartition par Tiers

| Tier | Poids total | Nombre de criteres | Nature des champs |
|------|-------------|-------------------|-------------------|
| **Tier 1 -- Essentiels** | 45% | 5 criteres | Identite et commerce (titre, EAN, prix, marque, description) |
| **Tier 2 -- Enrichis** | 35% | 7 criteres | Media, dimensions, sourcing (image, categorie, fournisseur...) |
| **Tier 3 -- Avances** | 20% | 6 criteres | SEO, attributs, specifications techniques |

### Details des Criteres Tier 1 (45%)

| Critere | Ce qui est verifie | Poids |
|---------|-------------------|-------|
| Titre | Le produit possede un titre non vide | 9% |
| EAN / GTIN | Un code EAN ou GTIN valide est renseigne | 9% |
| Prix | Au moins un prix actif est defini | 9% |
| Marque | Une marque est associee au produit | 9% |
| Description | La description du produit est renseignee | 9% |

### Details des Criteres Tier 2 (35%)

| Critere | Ce qui est verifie | Poids |
|---------|-------------------|-------|
| Image | Au moins une image est associee au produit | 5% |
| Categorie | Le produit est classe dans une categorie | 5% |
| Dimensions | Le poids ou les dimensions sont renseignes | 5% |
| Fournisseur | Au moins un fournisseur est associe | 5% |
| Description courte | La description courte est remplie | 5% |
| ASIN | Le code ASIN Amazon est renseigne | 5% |
| Prix d'achat | Le cout d'acquisition est defini | 5% |

### Details des Criteres Tier 3 (20%)

| Critere | Ce qui est verifie | Poids |
|---------|-------------------|-------|
| Donnees SEO | Meta title et meta description presentes | 3,3% |
| Enrichissement Icecat | Les donnees Icecat ont ete recuperees | 3,3% |
| Attributs | Des attributs produit sont renseignes | 3,3% |
| Specifications techniques | Des specs techniques sont presentes | 3,3% |
| Donnees environnementales | Les informations environnementales sont remplies | 3,3% |
| Rich media | Des videos ou documents sont associes | 3,4% |

---

## Niveaux de Score

Le score numerique est traduit en un grade lettre pour une lecture rapide :

| Grade | Plage de score | Interpretation |
|-------|---------------|----------------|
| **A** | 90 -- 100% | Excellent : fiche complete, prete pour publication sur toutes les plateformes |
| **B** | 70 -- 89% | Bon : fiche bien remplie, quelques champs secondaires a completer |
| **C** | 50 -- 69% | Moyen : des informations importantes manquent, ameliorations necessaires |
| **F** | 0 -- 49% | Faible : fiche tres incomplete, a completer en priorite |

{% callout type="warning" %}
Les produits avec un grade C ou inferieur risquent d'etre rejetes par les marketplaces (Amazon, Google Shopping) ou d'etre mal references. Visez un grade A ou B minimum avant d'exporter.
{% /callout %}

---

## Ameliorer votre Score

Voici les actions les plus efficaces pour augmenter le score de completude de vos produits, classees par impact :

### 1. Remplir les Champs Obligatoires (Tier 1)

Les 5 criteres du Tier 1 representent a eux seuls 45% du score. Assurez-vous que chaque produit possede :

- Un **titre** clair et descriptif
- Un **EAN** ou **GTIN** valide
- Au moins un **prix** actif
- Une **marque** associee
- Une **description** non vide

### 2. Ajouter des Images

Une fiche produit sans image perd 5% du score (Tier 2). Ajoutez au minimum une image de qualite pour chaque produit. Consultez la section [Gestion des Images](/docs/guide/produits#gestion-des-images) pour les specifications.

### 3. Completer les Descriptions

Renseignez a la fois la **description longue** (Tier 1) et la **description courte** (Tier 2) pour un gain total de 14% sur le score.

### 4. Associer Fournisseurs et Categories

L'association d'un fournisseur et d'une categorie represente 10% du score. Utilisez les [actions en masse](/docs/guide/produits#actions-en-masse) pour assigner rapidement des categories a plusieurs produits.

### 5. Enrichir les Donnees Avancees

Pour viser le grade A, completez les donnees du Tier 3 :

- Renseignez les **donnees SEO** (meta title, meta description)
- Ajoutez les **specifications techniques**
- Completez les **attributs produit**

{% callout type="note" %}
L'[Enrichissement IA](/docs/guide/enrichissement-ia) peut completer automatiquement les descriptions, attributs et donnees SEO manquants pour gagner du temps.
{% /callout %}

---

## Tableau de Bord de Completude

Le tableau de bord de completude offre une vue d'ensemble de la qualite de votre catalogue.

### Indicateurs Affiches

- **Score moyen** du catalogue : moyenne ponderee de tous les produits actifs
- **Score median** : valeur centrale de la distribution
- **Distribution par grade** : nombre et pourcentage de produits par grade (A, B, C, F)
- **Evolution** : progression du score moyen dans le temps

### Identifier les Produits Faibles

Le tableau de bord permet de reperer rapidement les produits necessitant une attention :

1. Accedez a la section **Completude** depuis le [Tableau de Bord](/docs/guide/tableau-de-bord)
2. Consultez la repartition par grade
3. Cliquez sur un grade (par exemple **F**) pour afficher la liste des produits concernes
4. Triez par **champ manquant** pour identifier les ameliorations les plus impactantes

---

## Filtrer par Score de Completude

Depuis la liste des produits, vous pouvez filtrer par score de completude :

1. Accedez a **Produits** dans le menu lateral
2. Cliquez sur **Filtres**
3. Utilisez le filtre **Completude** :
   - **Par grade** : selectionnez A, B, C ou F
   - **Par score** : definissez un score minimum et/ou maximum
   - **Par champ manquant** : identifiez les produits ou un champ specifique est absent

### Combiner les Filtres

Combinez le filtre de completude avec d'autres criteres pour des requetes precises :

- Produits **actifs** avec un grade **F** : identifiez les fiches publiees mais incompletes
- Produits d'un **fournisseur** specifique avec un score inferieur a 70 : ciblez les imports a enrichir
- Produits sans **image** et sans **description** : priorisez les fiches les plus lacunaires

Consultez la [Recherche Produits](/docs/guide/recherche) pour en savoir plus sur les filtres avances.

---

## Bonnes Pratiques

### Definir un Objectif de Score

- Fixez un **score minimum de 80 (grade B)** pour tous les produits destines a la publication
- Pour les marketplaces exigeantes (Amazon, Google Shopping), visez un **score de 90+ (grade A)**
- Utilisez les filtres pour surveiller regulierement les produits sous le seuil

### Automatiser l'Amelioration

- Activez l'**enrichissement IA** pour completer automatiquement les descriptions et attributs
- Planifiez des **imports enrichis** depuis vos fournisseurs avec le maximum de champs renseignes
- Utilisez **Code2ASIN** pour retrouver les ASIN Amazon manquants et gagner 5% de score

### Suivre la Progression

- Consultez le tableau de bord de completude chaque semaine
- Suivez l'evolution du score moyen apres chaque campagne d'enrichissement
- Exportez les statistiques pour vos rapports internes

---

## Impact sur les Exports E-commerce

Le score de completude a un impact direct sur la qualite de vos exports vers les plateformes e-commerce :

| Plateforme | Score minimum recommande | Champs critiques |
|------------|-------------------------|-----------------|
| **Amazon** | 90% (grade A) | Titre, EAN, description, images, marque, categorie |
| **Google Shopping** | 80% (grade B) | Titre, prix, image, description, marque, GTIN |
| **Shopify** | 70% (grade B) | Titre, description, prix, images |
| **PrestaShop** | 70% (grade B) | Titre, description, prix, images, categories |
| **WooCommerce** | 70% (grade B) | Titre, description, prix, images |

{% callout type="warning" %}
Les produits avec un score insuffisant peuvent etre automatiquement exclus des exports selon la configuration de vos canaux de vente. Verifiez les exigences de chaque plateforme avant d'exporter.
{% /callout %}

---

## Prochaines Etapes

- [Gestion des Produits](/docs/guide/produits) -- Creer et modifier vos fiches pour ameliorer le score
- [Recherche Produits](/docs/guide/recherche) -- Filtrer les produits par score de completude
- [Enrichissement IA](/docs/guide/enrichissement-ia) -- Completer automatiquement les champs manquants
- [Exporter vos Produits](/docs/guide/exports) -- Publier les produits avec un score suffisant
- [Documentation technique : Completude](/docs/modules/completeness) -- Details techniques du calcul de scoring et des endpoints API
