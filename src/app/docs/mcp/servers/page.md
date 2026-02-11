---
title: Serveurs MCP — Detail des outils
nextjs:
  metadata:
    title: Serveurs MCP — Detail des outils
    description: Reference complete des 8 serveurs MCP et 42 outils pour agents IA
---

# Serveurs MCP — Detail des outils

Reference complete des 42 outils repartis sur 8 serveurs MCP. Chaque outil est decrit avec ses parametres d'entree et sa fonctionnalite. {% .lead %}

## Categories Server (6 outils)

Serveur de gestion des categories multi-taxonomie avec arborescence et attributs.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `search_categories` | Recherche de categories par mot-cle | `query` (str), `taxonomy` (str, opt), `limit` (int, opt) |
| `get_category_tree` | Arborescence complete d'une taxonomie | `taxonomy` (str), `parent_id` (str, opt) |
| `get_category_attributes` | Attributs associes a une categorie | `category_id` (str) |
| `get_category_mappings` | Mappings inter-taxonomies | `category_id` (str), `target_taxonomy` (str, opt) |
| `suggest_category` | Suggestion IA de categorie pour un produit | `product_title` (str), `product_description` (str, opt) |
| `list_taxonomies` | Liste des taxonomies disponibles | — |

### Exemple d'utilisation

```json
{
  "name": "search_categories",
  "arguments": {
    "query": "informatique portable",
    "taxonomy": "google",
    "limit": 5
  }
}
```

## Icecat Server (5 outils)

Enrichissement produit via l'API Icecat (images, descriptions, specifications techniques).

| Outil | Description | Parametres |
|-------|------------|-----------|
| `lookup_product_by_ean` | Recherche produit Icecat par code EAN | `ean` (str) |
| `lookup_product_by_mpn` | Recherche par reference fabricant | `mpn` (str), `brand` (str) |
| `lookup_product_by_icecat_id` | Recherche par ID Icecat | `icecat_id` (int) |
| `get_product_specifications` | Specifications techniques detaillees | `ean` (str) ou `icecat_id` (int) |
| `test_icecat_connection` | Test de connexion a l'API Icecat | — |

### Exemple d'utilisation

```json
{
  "name": "lookup_product_by_ean",
  "arguments": {
    "ean": "4548736130876"
  }
}
```

## Brands Server (7 outils)

Gestion avancee des marques avec harmonisation, aliases et detection de doublons.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `match_brand` | Matching intelligent d'un nom de marque | `brand_name` (str), `threshold` (float, opt) |
| `search_brands` | Recherche de marques par mot-cle | `query` (str), `limit` (int, opt) |
| `get_brand_details` | Details complets d'une marque | `brand_id` (str) |
| `list_brand_aliases` | Liste des aliases d'une marque | `brand_id` (str) |
| `detect_duplicate_brands` | Detection de doublons potentiels | `limit` (int, opt) |
| `list_pending_brands` | Marques en attente de validation | `limit` (int, opt) |
| `batch_match_brands` | Matching par lot de noms de marques | `brand_names` (list[str]) |

### Exemple d'utilisation

```json
{
  "name": "batch_match_brands",
  "arguments": {
    "brand_names": ["SONY", "Sony Corporation", "sony", "SONI"]
  }
}
```

## AI Enrichment Server (6 outils)

Enrichissement IA des fiches produits via OpenAI ou Anthropic.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `categorize_product` | Categorisation IA d'un produit | `title` (str), `description` (str, opt) |
| `generate_description` | Generation de description marketing | `title` (str), `attributes` (dict, opt), `language` (str, opt) |
| `optimize_seo` | Optimisation SEO (meta, keywords, slug) | `title` (str), `description` (str) |
| `extract_attributes` | Extraction d'attributs structures | `title` (str), `description` (str, opt) |
| `score_product_quality` | Scoring qualite de la fiche produit | `product_id` (str) |
| `enrich_product` | Enrichissement complet multi-operations | `product_id` (str), `operations` (list[str], opt) |

### Exemple d'utilisation

```json
{
  "name": "generate_description",
  "arguments": {
    "title": "Casque Bluetooth Sony WH-1000XM5",
    "attributes": {"brand": "Sony", "type": "casque audio", "couleur": "noir"},
    "language": "fr"
  }
}
```

## Products Server (5 outils)

Recherche et consultation du catalogue produits.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `search_products` | Recherche full-text de produits | `query` (str), `limit` (int, opt), `offset` (int, opt) |
| `get_product` | Detail complet d'un produit | `product_id` (str) |
| `lookup_by_ean` | Recherche de produit par code EAN | `ean` (str) |
| `get_product_stats` | Statistiques globales du catalogue | — |
| `validate_ean` | Validation du format et checksum EAN | `ean` (str) |

### Exemple d'utilisation

```json
{
  "name": "search_products",
  "arguments": {
    "query": "ecran 27 pouces 4K",
    "limit": 20
  }
}
```

## Suppliers Server (5 outils)

Gestion des fournisseurs et de leurs catalogues produits.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `search_suppliers` | Recherche de fournisseurs | `query` (str), `limit` (int, opt) |
| `get_supplier_details` | Details complets d'un fournisseur | `supplier_id` (str) |
| `get_supplier_products` | Produits d'un fournisseur | `supplier_id` (str), `limit` (int, opt), `offset` (int, opt) |
| `get_product_sourcing` | Sources d'approvisionnement d'un produit | `product_id` (str) |
| `compare_supplier_prices` | Comparaison de prix entre fournisseurs | `product_id` (str) |

### Exemple d'utilisation

```json
{
  "name": "compare_supplier_prices",
  "arguments": {
    "product_id": "a1b2c3d4-5678-90ab-cdef-123456789abc"
  }
}
```

## Code2ASIN Server (4 outils)

Mapping entre codes EAN et identifiants ASIN Amazon.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `lookup_asin_by_ean` | Recherche ASIN par code EAN | `ean` (str) |
| `batch_lookup_asins` | Lookup par lot de codes EAN | `eans` (list[str]) |
| `get_job_results` | Resultats d'un job de mapping | `job_id` (str) |
| `get_job_statistics` | Statistiques d'un job | `job_id` (str) |

### Exemple d'utilisation

```json
{
  "name": "batch_lookup_asins",
  "arguments": {
    "eans": ["4548736130876", "0887276789231", "3662936058704"]
  }
}
```

## Imports Server (4 outils)

Suivi et consultation des jobs d'import de fichiers produits.

| Outil | Description | Parametres |
|-------|------------|-----------|
| `get_import_job` | Detail d'un job d'import | `job_id` (str) |
| `list_import_jobs` | Liste des jobs avec filtrage | `status` (str, opt), `limit` (int, opt) |
| `get_import_errors` | Erreurs d'un job d'import | `job_id` (str) |
| `get_import_statistics` | Statistiques globales des imports | — |

### Exemple d'utilisation

```json
{
  "name": "list_import_jobs",
  "arguments": {
    "status": "completed",
    "limit": 10
  }
}
```

## Recapitulatif

| Serveur | Fichier | Outils | Domaine fonctionnel |
|---------|---------|--------|-------------------|
| Categories | `categories_server.py` | 6 | Taxonomies et arborescence |
| Icecat | `icecat_server.py` | 5 | Enrichissement externe |
| Brands | `brands_server.py` | 7 | Marques et harmonisation |
| AI Enrichment | `ai_enrichment_server.py` | 6 | Enrichissement IA |
| Products | `products_server.py` | 5 | Catalogue produits |
| Suppliers | `suppliers_server.py` | 5 | Fournisseurs |
| Code2ASIN | `code2asin_server.py` | 4 | Mapping EAN/ASIN |
| Imports | `imports_server.py` | 4 | Jobs d'import |
| **Total** | **8 serveurs** | **42** | |

## Liens utiles

- [MCP Vue d'ensemble](/docs/mcp/overview) — Introduction au protocole MCP
- [AI Providers](/docs/mcp/ai-providers) — Configuration des fournisseurs IA
- [AI Enrichment](/docs/modules/ai-enrichment) — Module d'enrichissement
