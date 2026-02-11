---
title: Vue d'ensemble de l'API
nextjs:
  metadata:
    title: Vue d'ensemble de l'API - Products Manager APP
    description: Architecture globale de l'API REST Products Manager, versioning, modules de routage et conventions.
---

L'API Products Manager est construite sur FastAPI et expose plus de 47 modules de routage organises sous le prefixe `/api/v1/`. Cette page presente l'architecture globale, le versioning, les conventions de reponse et la liste complete des endpoints disponibles. {% .lead %}

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

L'API utilise l'authentification **JWT Bearer Token**. Toutes les requetes (sauf les endpoints publics) doivent inclure l'en-tete :

```
Authorization: Bearer <access_token>
```

Pour obtenir un token, voir la page [Authentification](/docs/api/authentication).

---

## Modules de routage enregistres

L'application enregistre **26 groupes de routage** au demarrage, couvrant l'ensemble des fonctionnalites. Le fichier `core/router_setup.py` orchestre l'enregistrement via la fonction `register_all_routers()`.

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
| `/api/v1/modules` | Modules | Activation/desactivation des modules (public, sans auth) |
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
