---
title: Brand Manager
nextjs:
  metadata:
    title: Brand Manager - Products Manager APP
    description: Harmonisation des marques avec deduplication, aliases, fusion et workflow de validation.
---

Harmonisez et gerez toutes les marques de votre catalogue. Le Brand Manager detecte les doublons, gere les aliases, permet la fusion de marques et propose un workflow de validation pour les marques issues des imports. {% .lead %}

---

## Vue d'Ensemble

Le module **Brand Manager** resout un probleme courant en e-commerce multi-fournisseurs : la meme marque peut apparaitre sous des noms differents selon les fournisseurs (ex: "SAMSUNG", "Samsung Electronics", "samsung").

Le systeme offre :

- **Deduplication** : Detection automatique des doublons par similarite de nom
- **Aliases** : Gestion des variantes de noms pour une meme marque
- **Fusion** : Merge de marques avec reassignation des produits et historique
- **Workflow pending** : Validation des marques inconnues issues des imports
- **Dashboard** : Vue d'ensemble avec statistiques et actions prioritaires

---

## Fonctionnalites Principales

### CRUD Marques

Chaque marque dispose des champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `name` | string | Nom commercial de la marque |
| `code` | string | Code unique normalise |
| `normalized_name` | string | Version normalisee pour comparaison |
| `logo_url` | string | URL du logo |
| `website` | string | Site web officiel |
| `description` | string | Description de la marque |
| `is_active` | boolean | Statut actif/inactif |
| `products_count` | integer | Nombre de produits associes |

### Detection de Doublons

L'endpoint `/duplicates` analyse toutes les marques et retourne les paires potentiellement dupliquees en calculant un score de similarite (seuil par defaut : 0.85).

### Gestion des Aliases

Un alias est une variante de nom pour une marque existante. Par exemple, la marque "Samsung" peut avoir les aliases : "SAMSUNG", "Samsung Electronics", "samsung corp".

Sources d'aliases :

| Source | Description |
|--------|-------------|
| `manual` | Cree manuellement par un utilisateur |
| `import` | Detecte lors d'un import fournisseur |
| `merge` | Genere lors d'une fusion de marques |
| `odoo` | Importe depuis Odoo ERP |

### Fusion de Marques

Le processus de fusion :

1. Selection de la marque cible (celle qui sera conservee)
2. Selection des marques sources (celles qui seront absorbees)
3. Reassignation automatique de tous les produits vers la cible
4. Creation d'aliases pour les noms des marques sources
5. Enregistrement dans l'historique de fusion (avec rollback possible)

{% callout type="warning" title="Fusion irreversible" %}
La fusion reassigne les produits de maniere definitive. Bien que l'historique soit conserve et qu'un rollback soit techniquement possible, il est recommande de verifier soigneusement avant de fusionner.
{% /callout %}

### Workflow de Validation (Pending Brands)

Lorsqu'un import contient un nom de marque inconnu, le systeme cree une entree "pending" :

1. **Detection** : Le nom brut est normalise et hashe pour deduplication
2. **Suggestion** : Le systeme propose une correspondance avec les marques existantes (score de confiance)
3. **Validation** : L'utilisateur valide la suggestion, cree une nouvelle marque, ou ignore l'entree

Statuts possibles :

| Statut | Description |
|--------|-------------|
| `pending` | En attente de validation |
| `validated` | Associe a une marque existante |
| `new_brand` | Nouvelle marque creee |
| `ignored` | Ignore par l'utilisateur |

---

## API Endpoints

### Marques

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/brands` | Liste paginee avec recherche et filtres |
| `POST` | `/api/v1/brands` | Creer une marque |
| `GET` | `/api/v1/brands/search` | Recherche autocomplete |
| `GET` | `/api/v1/brands/stats` | Statistiques globales |
| `GET` | `/api/v1/brands/dashboard` | Donnees du dashboard |
| `GET` | `/api/v1/brands/duplicates` | Doublons detectes |
| `POST` | `/api/v1/brands/merge` | Fusionner des marques |
| `GET` | `/api/v1/brands/merge-history` | Historique des fusions |
| `GET` | `/api/v1/brands/{id}` | Detail d'une marque |
| `PUT` | `/api/v1/brands/{id}` | Modifier une marque |
| `DELETE` | `/api/v1/brands/{id}` | Supprimer une marque |

### Aliases

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/brands/{id}/aliases` | Liste des aliases |
| `POST` | `/api/v1/brands/{id}/aliases` | Ajouter un alias |
| `DELETE` | `/api/v1/brands/{id}/aliases/{alias_id}` | Supprimer un alias |

### Validation (Pending)

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/brands/pending` | Liste des marques en attente |
| `POST` | `/api/v1/brands/pending/bulk-validate` | Validation en masse |
| `POST` | `/api/v1/brands/pending/{id}/validate` | Valider une entree |
| `POST` | `/api/v1/brands/match` | Matcher un nom de marque |
| `POST` | `/api/v1/brands/match/batch` | Matching en lot |

---

## Base de Donnees

Toutes les tables sont dans `db_catalog` :

| Table | Description |
|-------|-------------|
| `brands` | Registre principal des marques |
| `brand_aliases` | Variantes de noms (alias normalise unique) |
| `brand_pending` | File d'attente des marques inconnues |
| `brand_merge_history` | Historique des fusions avec audit |

---

## Prochaines Etapes

- [Imports](/docs/modules/imports) : Les imports alimentent automatiquement le workflow pending
- [Categories Manager](/docs/modules/categories-manager) : Organisez les produits par categories
- [Completude](/docs/modules/completeness) : La marque est un critere de scoring Tier 1
