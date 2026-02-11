---
title: Categories Manager
nextjs:
  metadata:
    title: Categories Manager - Products Manager APP
    description: Gestionnaire de categories multi-taxonomie avec arborescence, mapping inter-sources et import CSV/Odoo.
---

Gerez des taxonomies multi-sources avec arborescence hierarchique, mapping inter-taxonomies et import depuis Odoo, PrestaShop, Google ou CSV. Le Categories Manager centralise toutes vos classifications produit dans une interface unifiee. {% .lead %}

---

## Vue d'Ensemble

Le module **Categories Manager** permet de gerer plusieurs taxonomies simultanement et de creer des correspondances entre elles. C'est essentiel pour les e-commercants qui vendent sur plusieurs canaux (site propre, Amazon, Google Shopping) et doivent maintenir des classifications coherentes.

### Concepts Cles

- **Taxonomy Source** : Une source de categories (ex: "Interne", "Google Product Category", "Odoo 18", "Amazon Browse Node")
- **Category** : Un noeud dans l'arborescence d'une taxonomie avec chemin materialise
- **Mapping** : Une correspondance entre deux categories de taxonomies differentes
- **Attribute** : Un attribut defini au niveau d'une categorie (ex: Couleur, Taille pour "Vetements")

---

## Fonctionnalites Principales

### Gestion des Taxonomies

Chaque taxonomie est definie par :

| Champ | Description |
|-------|-------------|
| `code` | Code unique (ex: `internal`, `google`, `odoo_18`) |
| `name` | Nom affiche |
| `source_type` | Type : `internal`, `google`, `amazon`, `odoo`, `prestashop`, `icecat` |
| `sync_url` | URL de synchronisation (pour import distant) |
| `sync_method` | Methode de sync : `csv`, `api`, `manual` |
| `sync_cron` | Expression cron pour sync automatique |
| `categories_count` | Nombre de categories (calcule) |

### Arborescence Hierarchique

Les categories utilisent un **chemin materialise** pour des requetes arborescentes performantes :

```
Electronique                    path: /1/
  Informatique                  path: /1/2/
    Ordinateurs portables       path: /1/2/3/
    Peripheriques               path: /1/2/4/
  Telephonie                    path: /1/5/
    Smartphones                 path: /1/5/6/
```

Ce stockage permet de recuperer instantanement toute une branche et ses descendants.

### Mapping Inter-Taxonomies

Le mapping permet de creer des correspondances entre categories de sources differentes :

| Type | Description |
|------|-------------|
| `manual` | Cree manuellement par un utilisateur |
| `auto` | Genere par correspondance automatique de noms |
| `ai_suggested` | Suggere par l'IA (necessite validation) |

Chaque mapping a un statut : `active`, `pending_review` ou `rejected`, et un score de confiance (0-100).

L'endpoint `/auto-match` lance un matching automatique entre deux taxonomies en comparant les noms normalises des categories.

### Import de Categories

Plusieurs methodes d'import sont disponibles :

- **CSV** : Upload direct d'un fichier CSV avec colonnes `name`, `parent_name` ou `path`
- **URL** : Telechargement depuis une URL distante
- **Odoo 18** : Import du format specifique Odoo avec attributs (1114 lignes)
- **Legacy** : Migration depuis l'ancien systeme `OdooCategoryMapping`

### Attributs de Categories

Chaque categorie peut definir des attributs specifiques :

| Type d'attribut | Exemple |
|-----------------|---------|
| `select` | Couleur (Rouge, Bleu, Vert) |
| `text` | Materiau |
| `number` | Poids (kg) |
| `boolean` | Waterproof (Oui/Non) |
| `multiselect` | Compatibilite (iOS, Android, Windows) |

Les valeurs d'attributs sont filtrables et triables, et peuvent etre importees depuis un CSV Odoo 18.

---

## API Endpoints

### Taxonomies

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/categories-manager/taxonomies` | Lister les taxonomies |
| `POST` | `/api/v1/categories-manager/taxonomies` | Creer une taxonomie |
| `GET` | `/api/v1/categories-manager/taxonomies/{id}` | Detail d'une taxonomie |
| `PUT` | `/api/v1/categories-manager/taxonomies/{id}` | Modifier une taxonomie |
| `DELETE` | `/api/v1/categories-manager/taxonomies/{id}` | Supprimer une taxonomie |
| `POST` | `/api/v1/categories-manager/taxonomies/{id}/sync` | Synchroniser |
| `POST` | `/api/v1/categories-manager/taxonomies/{id}/sync-and-map` | Sync + auto-match |

### Categories

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/categories-manager/taxonomies/{id}/categories` | Lister (flat ou tree) |
| `POST` | `/api/v1/categories-manager/taxonomies/{id}/categories` | Creer une categorie |
| `GET` | `/api/v1/categories-manager/categories/search` | Rechercher |
| `GET` | `/api/v1/categories-manager/categories/stats` | Statistiques |
| `GET` | `/api/v1/categories-manager/categories/dashboard` | Dashboard |
| `POST` | `/api/v1/categories-manager/categories/import-csv` | Import CSV |
| `POST` | `/api/v1/categories-manager/categories/import-url` | Import URL |
| `GET` | `/api/v1/categories-manager/categories/{id}` | Detail |
| `GET` | `/api/v1/categories-manager/categories/{id}/tree` | Arborescence |
| `GET` | `/api/v1/categories-manager/categories/{id}/attributes` | Attributs |

### Mappings

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/categories-manager/mappings` | Lister les mappings |
| `POST` | `/api/v1/categories-manager/mappings` | Creer un mapping |
| `POST` | `/api/v1/categories-manager/mappings/auto-match` | Auto-match entre taxonomies |
| `GET` | `/api/v1/categories-manager/mappings/suggestions` | Suggestions en attente |
| `DELETE` | `/api/v1/categories-manager/mappings/{id}` | Supprimer un mapping |
| `PUT` | `/api/v1/categories-manager/mappings/{id}/status` | Approuver/rejeter |

### Attributs

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/categories-manager/attributes` | Lister les definitions |
| `POST` | `/api/v1/categories-manager/attributes` | Creer un attribut |
| `POST` | `/api/v1/categories-manager/attributes/import-csv` | Import Odoo 18 |
| `GET` | `/api/v1/categories-manager/attributes/{id}` | Detail avec valeurs |
| `PUT` | `/api/v1/categories-manager/attributes/{id}` | Modifier |
| `POST` | `/api/v1/categories-manager/attributes/{id}/values` | Ajouter une valeur |

### Assignation Produits

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/v1/categories-manager/products/sync-categories-from-odoo` | Sync batch depuis Odoo |
| `GET` | `/api/v1/categories-manager/products/{id}/categories` | Categories d'un produit |
| `POST` | `/api/v1/categories-manager/products/{id}/assign` | Assigner une categorie |
| `DELETE` | `/api/v1/categories-manager/products/{id}/categories/{assignment_id}` | Retirer |

---

## Base de Donnees

Toutes les tables sont dans `db_catalog` :

| Table | Description |
|-------|-------------|
| `taxonomy_sources` | Registre des taxonomies |
| `taxonomy_categories` | Categories avec chemin materialise |
| `category_mappings` | Correspondances inter-taxonomies |
| `category_attribute_definitions` | Schema d'attributs par categorie |
| `category_attribute_values` | Valeurs enum des attributs |
| `product_category_assignments` | Liens produit-categorie |

---

## Prochaines Etapes

- [Brand Manager](/docs/modules/brand-manager) : Harmonisez les marques de votre catalogue
- [Imports](/docs/modules/imports) : Les imports peuvent assigner automatiquement des categories
- [Data Model](/docs/data-model/product) : Structure complete du modele produit
