---
title: Modele de donnees Produit
nextjs:
  metadata:
    title: Modele de donnees Produit
    description: Reference complete du modele Product avec 100+ champs, relations, index et contraintes
---

# Modele de donnees Produit

Le modele `Product` est le coeur du catalogue ProductsManager. Il comporte plus de 100 champs organises en sections thematiques, couvrant l'identite, les dimensions, la conformite, le cycle de vie, l'enrichissement Icecat et le scoring de completude. {% .lead %}

## Informations generales

| Propriete | Valeur |
|-----------|--------|
| **Table** | `products` |
| **Base de donnees** | `db_catalog` |
| **Cle primaire** | `id` (UUID v4) |
| **Soft delete** | Oui (via `SoftDeleteMixin`) |
| **Index composites** | `(status, created_at)`, `(brand_name, status)` |

## Identite et identification

| Champ | Type | Index | Description |
|-------|------|-------|------------|
| `id` | UUID | PK | Identifiant unique |
| `ean` | String(20) | Oui | Code EAN/GTIN (identifiant principal produit) |
| `asin` | String(20) | Oui | Amazon Standard Identification Number |
| `title` | String(7500) | — | Titre du produit (obligatoire) |
| `external_id` | String(255) | Oui | ID dans les systemes externes |
| `upc` | String(12) | — | Universal Product Code |
| `gtin` | String(14) | — | Global Trade Item Number |
| `manufacturer_reference` | String(100) | — | Reference fabricant (MPN) |
| `odoo_product_id` | Integer | Oui | ID produit Odoo (pour sync ERP) |
| `prestashop_category_id` | Integer | Oui | ID categorie PrestaShop par defaut |
| `url_slug` | String(255) | — | Slug URL (unique) |

{% callout type="note" title="SKU supprime en v4.0" %}
Le champ `sku` a ete supprime du modele Product en v4.0. Les SKU sont maintenant geres par fournisseur via la table `supplier_products.supplier_sku`.
{% /callout %}

## Categorie et marque

| Champ | Type | Index | Description |
|-------|------|-------|------------|
| `category_id` | UUID | Oui | Categorie principale (reference) |
| `brand_id` | UUID (FK) | Oui | Cle etrangere vers `brands.id` |
| `brand_name` | String(255) | Oui | Nom de marque denormalise (performance) |

La relation `brand` est en mode `lazy="noload"` pour eviter les requetes N+1. Les categories multiples sont gerees via la table intermediaire `ProductCategory`.

## Descriptions

| Champ | Type | Description |
|-------|------|------------|
| `description` | Text | Description complete du produit |
| `short_description` | String(7500) | Resume court |
| `marketing_description` | Text | Description marketing longue (Icecat) |
| `promotional_text` | Text | Texte promotionnel |

## Dimensions et poids

### Dimensions produit

| Champ | Type | Description |
|-------|------|------------|
| `weight` | Decimal(10,3) | Poids du produit |
| `width` | Decimal(10,2) | Largeur |
| `height` | Decimal(10,2) | Hauteur |
| `depth` | Decimal(10,2) | Profondeur |
| `unit_of_measure` | String(20) | Unite de mesure (defaut: "unit") |

### Dimensions colis (expedition)

| Champ | Type | Description |
|-------|------|------------|
| `package_length` | Decimal(8,2) | Longueur du colis (cm) |
| `package_width` | Decimal(8,2) | Largeur du colis (cm) |
| `package_height` | Decimal(8,2) | Hauteur du colis (cm) |
| `package_weight` | Integer | Poids du colis (grammes) |
| `package_quantity` | Integer | Quantite par colis/carton |

## Statut et synchronisation

| Champ | Type | Index | Description |
|-------|------|-------|------------|
| `status` | String(50) | Oui | Statut du produit (defaut: "active") |
| `is_active` | Boolean | Oui | Produit actif ou non |
| `sync_status` | String(20) | Oui | Statut de sync (pending, in_progress, synced, error, conflict) |
| `last_sync_at` | DateTime | — | Derniere synchronisation |
| `sync_error` | Text | — | Message d'erreur de sync |
| `needs_sync` | Boolean | Oui | Marqueur pour re-synchronisation |

## Prix et fiscalite

{% callout type="warning" title="Pas de retail_price sur Product" %}
Les prix produits sont geres via le modele `ProductPrice` (table `product_prices`), pas directement sur le Product. La propriete `product.price` est un accesseur qui lit le premier `ProductPrice` actif.
{% /callout %}

| Champ | Type | Description |
|-------|------|------------|
| `tax_rate` | Decimal(5,2) | Taux de TVA (defaut: 20.00%) |
| `volume_pricing` | JSONB | Grille tarifaire par volume (B2B) |

## Disponibilite et stock

| Champ | Type | Description |
|-------|------|------------|
| `min_order_quantity` | Integer | Quantite minimum de commande (defaut: 1) |
| `max_order_quantity` | Integer | Quantite maximum de commande |
| `order_increment` | Integer | Increment de commande (defaut: 1) |
| `backorder_allowed` | Boolean | Commande en rupture autorisee |
| `preorder_available` | Boolean | Pre-commande disponible |
| `availability_date` | DateTime | Date de disponibilite prevue |
| `lead_time_days` | Integer | Delai d'approvisionnement (jours) |

## Conformite et reglementation

| Champ | Type | Description |
|-------|------|------------|
| `hs_code` | String(20) | Code HS (nomenclature douaniere) |
| `country_of_origin` | String(2) | Pays d'origine (code ISO 2 lettres) |
| `customs_description` | Text | Description douaniere |
| `dangerous_goods` | Boolean | Marchandise dangereuse |
| `dangerous_goods_class` | String(10) | Classe de danger |
| `reach_compliant` | Boolean | Conformite REACH |
| `rohs_compliant` | Boolean | Conformite RoHS |
| `ce_marked` | Boolean | Marquage CE |
| `weee_category` | String(50) | Categorie DEEE |
| `is_rohs_compliant` | Boolean | Statut RoHS (v4.5.24) |
| `is_weee_compliant` | Boolean | Statut DEEE (v4.5.24) |
| `is_ce_marked` | Boolean | Statut CE (v4.5.24) |

## Cycle de vie

| Champ | Type | Index | Description |
|-------|------|-------|------------|
| `lifecycle_status` | String(20) | — | Statut du cycle (defaut: "active") |
| `discontinued` | Boolean | — | Produit abandonne |
| `end_of_life_date` | DateTime | — | Date de fin de vie |
| `replacement_product_id` | UUID (FK) | Oui | Produit de remplacement (auto-reference) |

## Energie et environnement

| Champ | Type | Description |
|-------|------|------------|
| `energy_class` | String(5) | Classe energetique (A+++, A, B, etc.) |
| `power_consumption_kwh` | Decimal(10,2) | Consommation electrique (kWh) |
| `energy_consumption` | Decimal(10,2) | Valeur de consommation (v4.5.24) |
| `energy_consumption_unit` | String(20) | Unite (kWh, W, etc.) |
| `recyclable` | Boolean | Produit recyclable |
| `eco_friendly` | Boolean | Eco-responsable |
| `carbon_footprint_kg` | Decimal(10,2) | Empreinte carbone (kg CO2) |

## Garantie et SAV

| Champ | Type | Description |
|-------|------|------------|
| `warranty_duration` | Integer | Duree de garantie (mois) |
| `warranty_type` | String(50) | Type de garantie |
| `return_policy_days` | Integer | Delai de retour (defaut: 14 jours) |
| `return_allowed` | Boolean | Retour autorise (defaut: true) |

## Analytics et performance

| Champ | Type | Description |
|-------|------|------------|
| `view_count` | Integer | Nombre de vues (defaut: 0) |
| `sales_count` | Integer | Nombre de ventes (defaut: 0) |
| `popularity_score` | Decimal(5,2) | Score de popularite |
| `last_sold_at` | DateTime | Derniere vente |
| `conversion_rate` | Decimal(5,4) | Taux de conversion |
| `last_viewed_at` | DateTime | Derniere consultation |

## B2B

| Champ | Type | Description |
|-------|------|------------|
| `requires_quote` | Boolean | Necessite un devis |
| `is_b2b_only` | Boolean | Reserve aux professionnels |
| `minimum_margin_percentage` | Decimal(5,2) | Marge minimale imposee |
| `volume_pricing` | JSONB | Tarifs degressifs par volume |

## Variantes et design

| Champ | Type | Description |
|-------|------|------------|
| `color` | String(50) | Couleur principale |
| `color_secondary` | String(50) | Couleur secondaire |
| `size` | String(50) | Taille |
| `material` | String(100) | Materiau |
| `finish` | String(100) | Finition |
| `style` | String(100) | Style |
| `pattern` | String(100) | Motif |

## Technique et specifications

| Champ | Type | Description |
|-------|------|------------|
| `technical_specs` | JSONB | Specifications techniques (format libre) |
| `compatibility` | JSONB | Compatibilites produit |
| `installation_required` | Boolean | Installation necessaire |

## Enrichissement Icecat (v4.5.24)

| Champ | Type | Index | Description |
|-------|------|-------|------------|
| `icecat_id` | Integer | Oui | ID produit Icecat |
| `icecat_quality_score` | Decimal(3,2) | — | Score qualite Icecat (0.00-1.00) |
| `icecat_last_enriched_at` | DateTime | — | Date du dernier enrichissement |
| `key_features` | JSONB | — | Caracteristiques cles |
| `reasons_to_buy` | JSONB | — | Arguments de vente |
| `awards` | JSONB | — | Recompenses produit |
| `icecat_category_id` | Integer | — | ID categorie Icecat |
| `icecat_category_name` | String(255) | — | Nom categorie Icecat |
| `icecat_brand_id` | Integer | — | ID marque Icecat |
| `icecat_brand_logo_url` | Text | — | URL logo marque |
| `bullet_points` | JSONB | — | Points cles (puces) |
| `gallery_images_count` | Integer | — | Nombre d'images galerie |
| `videos_count` | Integer | — | Nombre de videos |
| `documents_count` | Integer | — | Nombre de documents |
| `is_icecat_enriched` | Boolean | Oui | Produit enrichi par Icecat |

## Completude (v4.5.37)

| Champ | Type | Index | Description |
|-------|------|-------|------------|
| `completeness_score` | Integer | Oui | Score de completude 0-100 (defaut: 0) |
| `completeness_details` | JSONB | — | Detail par champ du scoring |

## Import tracking (v4.5.13)

| Champ | Type | Description |
|-------|------|------------|
| `import_source` | String(100) | Source d'import (nom fichier/fournisseur) |

## Relations ORM

| Relation | Modele cible | Type | Description |
|----------|-------------|------|------------|
| `brand` | Brand | ManyToOne | Marque (FK brand_id) |
| `supplier_products` | SupplierProduct | OneToMany | Liens fournisseurs |
| `attributes` | ProductAttribute | OneToMany | Attributs produit |
| `categories_multi` | ProductCategory | OneToMany | Categories multi-taxonomie |
| `variants` | ProductVariant | OneToMany | Variantes produit |
| `prices` | ProductPrice | OneToMany | Historique de prix |
| `stocks` | ProductStock | OneToMany | Niveaux de stock |
| `bundles` | ProductBundle | OneToMany | Lots/bundles parents |
| `bundle_items` | ProductBundleItem | OneToMany | Items dans des bundles |
| `seo_data` | ProductSEO | OneToMany | Donnees SEO multi-langue |
| `replacement_for` | Product | ManyToOne | Produit de remplacement (auto-reference) |

{% callout type="note" title="Lazy loading" %}
Toutes les relations sont en mode `lazy="noload"` pour eviter les requetes N+1. Utilisez `selectinload()` ou `joinedload()` explicitement dans vos requetes quand les relations sont necessaires.
{% /callout %}

## Index de performance

| Index | Colonnes | Usage |
|-------|---------|-------|
| `ix_products_status_created` | `status`, `created_at` | Tri par date avec filtre statut |
| `ix_products_brand_status` | `brand_name`, `status` | Filtrage par marque et statut |
| `ix_products_ean` | `ean` | Lookup par code EAN |
| `ix_products_asin` | `asin` | Lookup par ASIN Amazon |
| `ix_products_status` | `status` | Filtre par statut |
| `ix_products_is_active` | `is_active` | Filtre produits actifs |
| `ix_products_created_at` | `created_at` | Tri chronologique |
| `ix_products_completeness_score` | `completeness_score` | Tri par completude |

## Proprietes calculees

| Propriete | Description |
|-----------|------------|
| `name` | Alias pour `title` (retro-compatibilite) |
| `barcode` | Alias pour `ean` |
| `price` | Lit le premier `ProductPrice` actif via la relation `prices` |

## Modeles associes

Le modele Product est au centre d'un ecosysteme de tables liees :

- **ProductPrice** : Prix par source avec historique
- **ProductStock** : Niveaux de stock par entrepot
- **ProductAttribute** : Attributs cle-valeur
- **ProductCategory** : Mapping multi-taxonomie
- **ProductSEO** : Meta-donnees SEO multi-langue
- **ProductVariant** : Variantes (couleur, taille, etc.)
- **SupplierProduct** : Lien produit-fournisseur avec prix d'achat et SKU
- **ProductBundle** / **ProductBundleItem** : Lots et packs
- **ProductEnvironmental** : Donnees environnementales etendues
- **ProductAIMetadata** : Metadonnees d'enrichissement IA

## Liens utiles

- [Architecture technique](/docs/technical/architecture) — Infrastructure multi-base de donnees
- [Imports](/docs/features/imports) — Pipeline d'import et mapping de champs
- [AI Enrichment](/docs/modules/ai-enrichment) — Enrichissement IA du catalogue
