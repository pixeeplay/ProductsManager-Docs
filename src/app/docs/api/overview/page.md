---
title: Vue d'ensemble de l'API
nextjs:
  metadata:
    title: Vue d'ensemble de l'API - Products Manager APP
    description: Architecture globale de l'API REST Products Manager, versioning, modules de routage et conventions.
---

L'API Products Manager est construite sur FastAPI et expose plus de 55 modules de routage sous le prefixe `/api/v1/`. Elle supporte deux modes d'authentification (JWT utilisateur et X-API-Key application), un rate limiting Redis par cle, des webhooks sortants HMAC-SHA256, et une integration bidirectionnelle complete avec WinDev, Odoo et PrestaShop. {% .lead %}

---

## URL de base

| Environnement | URL |
|---------------|-----|
| Production | `https://api.productsmanager.app/api/v1` |
| Staging | `https://staging-api.productsmanager.app/api/v1` |
| Developpement | `http://localhost:8000/api/v1` |

---

## Versioning de l'API

Tous les endpoints sont enregistres sous le prefixe `/api/v1/`, defini par la variable `settings.API_V1_STR` dans `core/config_multidb.py`. Le frontend Next.js (proxy route) ajoute automatiquement ce prefixe aux requetes sortantes.

{% callout type="note" title="Endpoints non-versionnes" %}
Certains endpoints sont accessibles directement a la racine, sans prefixe `/api/v1` :
- `/health` -- Verification de sante basique
- `/metrics` -- Metriques Prometheus
- `/docs` -- Documentation Swagger UI
- `/redoc` -- Documentation ReDoc
- `/openapi.json` -- Schema OpenAPI
{% /callout %}

### Deux patterns de routage

L'API utilise deux patterns pour l'enregistrement des routers :

**Pattern A (recommande)** -- prefixe defini uniquement a l'enregistrement :

```python
# Fichier router : router = APIRouter()
# Enregistrement : app.include_router(router, prefix=f"{settings.API_V1_STR}/resource")
# Resultat : /api/v1/resource/...
```

**Pattern B** -- prefixe defini sur le router lui-meme :

```python
# Fichier router : router = APIRouter(prefix="/api/v1/resource")
# Enregistrement : app.include_router(router, tags=[...])
# Resultat : /api/v1/resource/...
```

{% callout type="warning" title="Ne jamais combiner les deux" %}
FastAPI concatene les prefixes de `include_router` et de `APIRouter`, ce qui produirait des chemins doubles comme `/api/v1/resource/resource/...`.
{% /callout %}

---

## Format de reponse

Toutes les reponses de l'API utilisent le format JSON. Les reponses paginees suivent cette structure :

```json
{
  "items": [],
  "total": 150,
  "page": 1,
  "per_page": 20,
  "pages": 8
}
```

### En-tetes de reponse

| En-tete | Description |
|---------|-------------|
| `X-Request-ID` | Identifiant unique de la requete pour le tracage |
| `X-Correlation-ID` | Identifiant de correlation pour le suivi inter-services |
| `Content-Type` | Toujours `application/json` |

---

## Authentification

L'API supporte **deux modes d'authentification** selon le type de client :

### 1. JWT Bearer Token (utilisateurs, interface web)

```
Authorization: Bearer <access_token>
```

Utilise pour les endpoints metier (produits, imports, exports…). Voir [Authentification JWT](/docs/api/authentication).

### 2. X-API-Key (applications externes, WinDev, scripts)

```
X-API-Key: pm_live_xxxxxxxxxxxxxxxxxxxx
```

Utilise pour les integrations machine-to-machine (WinDev, ERP, scripts automatises). Les cles sont gerees via `/api/v1/api-keys`. Voir [API Keys](#api-keys-et-integrations-externes).

---

## API Keys et Integrations Externes

Depuis v4.5.61, ProductsManager expose des APIs dediees aux integrations machine-to-machine.

### Gestion des cles API (`/api/v1/api-keys`)

| Endpoint | Description |
|----------|-------------|
| `GET /api-keys/` | Lister toutes les cles (admin) |
| `POST /api-keys/` | Creer une cle (retourne la valeur brute une seule fois) |
| `PATCH /api-keys/{id}` | Modifier nom / scopes / expiration |
| `DELETE /api-keys/{id}` | Supprimer |
| `POST /api-keys/{id}/toggle` | Activer / desactiver |
| `POST /api-keys/{id}/rotate` | Rotation (nouvelle cle, ancienne invalidee) |
| `GET /api-keys/{id}/stats` | Statistiques d'usage |

**Scopes disponibles** :

| Scope | Description |
|-------|-------------|
| `ext:products:read` | Lecture produits via External API |
| `ext:products:write` | Ecriture produits via External API |
| `windev:read` | Lecture WinDev (produits, categories, fournisseurs) |
| `windev:write` | Ecriture WinDev (stock, prix, PATCH produit) |
| `windev:sync` | Sync batch WinDev |

**Format des cles** :
- Production : `pm_live_<64chars>`
- Test : `pm_test_<64chars>`
- Stockage : prefixe clair + hash SHA-256 (valeur brute jamais stockee)

---

### External Products API (`/api/v1/ext`)

API universelle push/pull pour n'importe quel systeme tiers.

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /ext/status` | Publique | Health check |
| `GET /ext/products` | ext:products:read | Liste paginee (filtres : brand, supplier, active_only) |
| `GET /ext/products/delta` | ext:products:read | Produits modifies depuis timestamp |
| `GET /ext/products/{ean}` | ext:products:read | Produit par EAN |
| `POST /ext/products` | ext:products:write | Upsert unique |
| `POST /ext/products/batch` | ext:products:write | Upsert batch (max 500) |
| `PATCH /ext/products/{ean}` | ext:products:write | Mise a jour partielle |

---

### Integration WinDev (`/api/v1/windev`)

API bidirectionnelle complete pour WinDev ERP. Format de reponse WinDev-friendly :

```json
{"success": true, "code": 200, "message": "OK", "data": [...], "count": 42}
```

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /windev/status` | Publique | Health check avec liste des endpoints |
| `GET /windev/products` | windev:read | Liste paginee complete (sync initiale) |
| `GET /windev/products/since/{ts}` | windev:read | Produits modifies depuis timestamp Unix |
| `GET /windev/products/{ref}` | windev:read | Par EAN ou reference (actifs ET inactifs) |
| `PATCH /windev/products/{ref}` | windev:write | Mise a jour individuelle (75 champs) |
| `POST /windev/products/{ref}/activate` | windev:write | Reactivation |
| `POST /windev/products/{ref}/deactivate` | windev:write | Desactivation |
| `POST /windev/products/sync` | windev:sync | Upsert batch (max 1000) |
| `POST /windev/stock/update` | windev:write | MAJ stocks batch (max 5000) |
| `POST /windev/prices/update` | windev:write | MAJ prix batch (max 5000) |
| `GET /windev/categories` | windev:read | Arbre categories |
| `GET /windev/suppliers` | windev:read | Liste fournisseurs |

**Matching** (par priorite) : EAN normalise → `manufacturer_reference` → creation si absent.

Les responses produit exposent **65 champs** complets (identifiants, dimensions, fiscal, conformite, attributs physiques, sync ERP, prix et stocks inline).

---

### Synchronisation Odoo (`/api/v1/odoo-import`)

Import ET export bidirectionnel Odoo ↔ ProductsManager.

| Endpoint | Description |
|----------|-------------|
| `POST /odoo-import/pull-products` | Odoo → PM (avec strategie conflit : odoo_wins / pm_wins / newest_wins) |
| `GET /odoo-import/pull-products/preview` | Apercu sans import |
| `GET /odoo-import/products/remote` | Liste produits Odoo |
| `GET /odoo-import/conflicts` | Produits en conflit PM ↔ Odoo |
| `POST /odoo-import/conflicts/{id}/resolve` | Resolution manuelle (keep_pm / use_odoo) |
| `GET /odoo-import/categories` | Categories Odoo |
| `POST /odoo-import/push-products` | **PM → Odoo** (synchrone) |
| `POST /odoo-import/push-products/async` | **PM → Odoo** (Celery, recommande > 200 produits) |

---

### Synchronisation PrestaShop (`/api/v1/prestashop-import`)

| Endpoint | Description |
|----------|-------------|
| `GET /prestashop-import/status` | Test connexion WebService |
| `GET /prestashop-import/products/remote` | Apercu produits PS |
| `POST /prestashop-import/pull-products` | PS → PM |
| `POST /prestashop-import/push-products` | **PM → PS** (synchrone) |
| `POST /prestashop-import/push-products/async` | **PM → PS** (Celery asynchrone) |

---

### Webhooks Sortants (`/api/v1/webhooks`)

Notifications HTTP vers des systemes externes (Zapier, Make, n8n, WinDev…).

| Endpoint | Description |
|----------|-------------|
| `GET /webhooks/` | Liste des webhooks configures |
| `POST /webhooks/` | Creer un webhook |
| `GET /webhooks/events` | Catalogue des evenements disponibles |
| `PATCH /webhooks/{id}` | Modifier |
| `DELETE /webhooks/{id}` | Supprimer |
| `POST /webhooks/{id}/toggle` | Activer / desactiver |
| `POST /webhooks/{id}/test` | Declencher un payload de test |
| `GET /webhooks/{id}/logs` | Historique livraisons |

Signature : `X-PM-Signature: sha256=<hmac>` sur chaque payload.

**Evenements declenchables** : `product.created`, `product.updated`, `product.deleted`, `product.batch_sync`, `stock.updated`, `price.updated`, `import.started`, `import.completed`, `import.failed`, `supplier.created`, `supplier.updated`, `ean.resolved`, `test`

---

## Modules de routage enregistres

L'application enregistre **60+ groupes de routage** au demarrage. Le fichier `core/router_setup.py` orchestre l'enregistrement via `register_all_routers()`.

### Catalogue et Produits

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/products` | Products | CRUD produits, recherche, filtrage, pagination |
| `/api/v1/suppliers` | Suppliers | Gestion des fournisseurs |
| `/api/v1/categories` | Categories | Categories produit |
| `/api/v1/tags` | Tags | Etiquettes et tags produit |
| `/api/v1/brands` | Brand Manager | Harmonisation, aliases, doublons, fusion de marques |
| `/api/v1/categories-manager` | Categories Manager | Gestion avancee des categories (arborescence, mapping) |

### Import et Export

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/imports` | Imports | Jobs d'import, upload de fichiers, suivi du traitement |
| `/api/v1/mapping-templates` | Mapping Templates | Templates de mapping colonnes pour les imports |
| `/api/v1/import-configs` | Import Configs | Configurations et planifications d'import |
| `/api/v1/exports` | Exports | Export de donnees produit |
| `/api/v1/exports/platforms` | Export Platforms | Plateformes d'export multi-canal |

### Medias et Stockage

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/media` | Media | Fichiers media (images, documents), CRUD |
| `/api/v1/storage` | Storage | Navigation multi-bucket MinIO, upload/download |
| `/api/v1/bucket-configs` | Bucket Configuration | Configuration des buckets (MinIO, OVH, AWS S3) |

### Authentification et Utilisateurs

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/auth` | Authentication | Login, register, refresh token, reset password |
| `/api/v1/users` | User Management | CRUD utilisateurs, roles, permissions |

### Integrations externes

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/code2asin` | Code2ASIN | Mapping EAN vers ASIN Amazon |
| `/api/v1/amazon` | Amazon | Configuration PA-API Amazon |
| `/api/v1/odoo` | Odoo Integration | Synchronisation ERP Odoo |
| `/api/v1/prestashop` | PrestaShop | Synchronisation e-commerce PrestaShop |
| `/api/v1/connectors` | Connecteurs | Sync bidirectionnelle Shopify, WooCommerce, Magento2, BigCommerce, SFCC, SAP Commerce, WiziShop, CDiscount, Fnac, Sylius, Squarespace |
| `/api/v1/icecat` | Icecat | Enrichissement produit via Icecat |
| `/api/v1/google` | Google Integration | OAuth Google Drive |

### Intelligence artificielle

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/ai-providers` | AI Providers | Configuration des fournisseurs IA (OpenAI, Anthropic, Ollama) |
| `/api/v1/enrichment` | AI Enrichment | Enrichissement IA des fiches produit |

### EAN et Recherche

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/ean` | EAN Lookup | Recherche et validation de codes EAN/UPC |
| `/api/v1/ean-lookup` | EAN Lookup Search | Resolution EAN pour produits en attente |
| `/api/v1/search` | Search | Recherche globale (Meilisearch + fallback PostgreSQL) |

### Administration et Monitoring

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/admin` | Admin | Administration systeme, audit logs, media fix |
| `/api/v1/dashboard` | Dashboard | KPIs et metriques du tableau de bord |
| `/api/v1/cache` | Cache | Gestion du cache Redis |
| `/api/v1/monitoring` | Monitoring | Surveillance systeme |
| `/api/v1/performance` | Performance | Metriques de performance (CPU, memoire, DB) |
| `/api/v1/analytics` | Analytics | Rapports et analytics |
| `/api/v1/health` | Health | Verifications de sante detaillees |
| `/api/v1/error-monitoring` | Error Monitoring | Suivi des erreurs applicatives |
| `/api/v1/notifications` | Notifications | Systeme de notifications |

### Configuration et Modules

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/settings` | Settings | Configuration de l'application et email SMTP |
| `/api/v1/modules` | Modules | Gestion des 20 modules (public, sans auth) |
| `/api/v1/security-dashboard` | Security Dashboard | Tableau de bord securite |
| `/api/v1/business` | Business | KPIs business et analytics avances |

### Prix et Fournisseurs

| Prefixe | Module | Description |
|---------|--------|-------------|
| `/api/v1/prices` | Price Monitor | Suivi des prix concurrents (SerpAPI/SearXNG) |
| `/api/v1/price-tracking` | Price Tracking | Historique et suivi des prix |
| `/api/v1/supplier-history` | Supplier History | Historique prix/stock fournisseurs |
| `/api/v1/product-sourcing` | Product Sourcing | Comparaison prix, recommandations sourcing |

---

## Types de contenu

| Operation | Content-Type |
|-----------|-------------|
| Requetes JSON | `application/json` |
| Upload de fichiers | `multipart/form-data` |
| Export CSV | `text/csv` |
| Export Excel | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| Reponses | `application/json` |

---

## Middleware

L'API applique une chaine de middleware dans l'ordre suivant (du plus externe au plus interne) :

1. **CorrelationIdMiddleware** -- Attribution/lecture de `X-Correlation-ID`
2. **RequestLoggingMiddleware** -- Journalisation structuree avec metriques de timing
3. **GZipMiddleware** -- Compression des reponses superieures a 500 octets
4. **Rate Limiting** -- Limitation de debit par endpoint (SlowAPI + Redis)
5. **SecurityHeadersMiddleware** -- HSTS, X-Frame-Options, X-Content-Type-Options
6. **CSPMiddleware** -- Content Security Policy
7. **CSRFMiddleware** -- Protection CSRF (double-submit cookie)
8. **TrustedHostMiddleware** -- Validation des hotes autorises
9. **CORSMiddleware** -- Gestion des origines croisees
10. **ModuleGateMiddleware** -- Blocage des routes de modules desactives (403)
11. **PrometheusMiddleware** -- Collecte de metriques Prometheus
12. **RequestSizeMiddleware** -- Limite de taille des requetes (100 Mo)
13. **XSSSanitizerMiddleware** -- Nettoyage anti-XSS des entrees

---

## Documentation interactive

L'API expose deux interfaces de documentation interactives :

- **Swagger UI** : `https://staging-api.productsmanager.app/docs`
- **ReDoc** : `https://staging-api.productsmanager.app/redoc`
- **Schema OpenAPI** : `https://staging-api.productsmanager.app/openapi.json`

Ces interfaces permettent de tester directement les endpoints avec authentification.
