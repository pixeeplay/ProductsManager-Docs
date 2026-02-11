---
title: Completude Catalogue
nextjs:
  metadata:
    title: Completude Catalogue - Products Manager APP
    description: Scoring de completude des fiches produits avec 18 criteres ponderes sur 3 tiers et grades A-F.
---

Evaluez la qualite et la completude de votre catalogue produit. Le module Completude attribue un score de 0 a 100 a chaque produit en analysant 18 criteres ponderes sur 3 tiers de priorite, avec des grades de A (excellent) a F (incomplet). {% .lead %}

---

## Vue d'Ensemble

Le module **Completude** repond a une question essentielle : mes fiches produit sont-elles suffisamment completes pour etre publiees sur les canaux de vente ?

Le scoring est base sur 18 criteres repartis en 3 tiers de priorite. Chaque critere verifie la presence et la qualite d'une donnee produit specifique.

---

## Systeme de Scoring

### Tiers et Poids

| Tier | Poids | Criteres | Description |
|------|-------|----------|-------------|
| **Tier 1** | 45% | 5 criteres | Donnees essentielles (identite et commerce) |
| **Tier 2** | 35% | 7 criteres | Donnees enrichies (media, dimensions, sourcing) |
| **Tier 3** | 20% | 6 criteres | Donnees avancees (SEO, attributs, tech specs) |

### Criteres Tier 1 (Essentiels - 45%)

| Critere | Verifie | Poids dans le tier |
|---------|---------|-------------------|
| `title` | Titre produit renseigne | 9% |
| `ean_gtin` | Code EAN/GTIN valide | 9% |
| `price` | Au moins un prix actif (via `ProductPrice`) | 9% |
| `brand` | Marque associee | 9% |
| `description` | Description non vide | 9% |

### Criteres Tier 2 (Enrichis - 35%)

| Critere | Verifie | Poids dans le tier |
|---------|---------|-------------------|
| `image` | Au moins une image (sync depuis `db_media`) | 5% |
| `category` | Categorie assignee | 5% |
| `dimensions` | Poids ou dimensions renseignes | 5% |
| `supplier` | Au moins un fournisseur associe | 5% |
| `short_description` | Description courte | 5% |
| `asin` | Code ASIN Amazon | 5% |
| `cost_price` | Prix d'achat (via `SupplierProduct`) | 5% |

### Criteres Tier 3 (Avances - 20%)

| Critere | Verifie | Poids dans le tier |
|---------|---------|-------------------|
| `seo` | Donnees SEO (meta title, meta description) | 3.3% |
| `icecat` | Enrichissement Icecat effectue | 3.3% |
| `attributes` | Attributs produit renseignes | 3.3% |
| `tech_specs` | Specifications techniques | 3.3% |
| `environmental` | Donnees environnementales | 3.3% |
| `rich_media` | Videos ou documents | 3.4% |

---

## Grades

Le score numerique est converti en grade lettre :

| Grade | Score | Interpretation |
|-------|-------|----------------|
| **A** | 90 - 100 | Excellent : fiche complete et publiable |
| **B** | 80 - 89 | Bon : quelques champs mineurs manquants |
| **C** | 70 - 79 | Moyen : des ameliorations souhaitables |
| **D** | 60 - 69 | Insuffisant : donnees essentielles manquantes |
| **F** | 0 - 59 | Incomplet : fiche a completer en priorite |

{% callout type="info" title="Objectif recommande" %}
Pour une publication sur les marketplaces (Amazon, Google Shopping), un grade minimum de B (80+) est recommande. Les produits avec un grade C ou inferieur risquent d'etre rejetes ou mal references.
{% /callout %}

---

## API Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/products/stats/completeness` | Statistiques agregees (moyenne, mediane, distribution A-F) |
| `POST` | `/api/v1/products/stats/completeness/recalculate` | Recalculer les scores (tous ou produits specifiques) |
| `GET` | `/api/v1/products/stats/completeness/products` | Liste paginee avec filtres |

### Filtres Disponibles

| Parametre | Type | Description |
|-----------|------|-------------|
| `grade` | string | Filtrer par grade (A, B, C, D, F) |
| `missing_field` | string | Produits ou ce champ est manquant |
| `min_score` | integer | Score minimum |
| `max_score` | integer | Score maximum |
| `page` | integer | Numero de page |
| `per_page` | integer | Resultats par page |

---

## Recalcul

Le recalcul des scores peut etre declenche :

- **Manuellement** : Via l'endpoint `POST /recalculate` (admin)
- **Par lot** : En fournissant une liste de `product_ids`
- **Automatiquement** : Apres un import ou une mise a jour produit

Le recalcul :

1. Charge les donnees produit depuis `db_catalog`
2. Compte les images depuis `db_media` (cross-database)
3. Verifie le prix d'achat depuis `supplier_products`
4. Calcule le score pondere sur les 18 criteres
5. Persiste le score, le grade et la date de calcul

---

## Base de Donnees

Les scores sont stockes directement sur le modele `Product` dans `db_catalog` :

| Champ | Type | Description |
|-------|------|-------------|
| `completeness_score` | integer (0-100) | Score de completude |
| `completeness_grade` | string (A-F) | Grade lettre |
| `completeness_last_updated` | datetime | Date du dernier calcul |

---

## Prochaines Etapes

- [Imports](/docs/modules/imports) : Ameliorez la completude en important des donnees enrichies
- [AI Enrichment](/docs/modules/ai-enrichment) : L'IA peut completer les descriptions et attributs manquants
- [Data Model](/docs/data-model/product) : Structure complete du modele produit
