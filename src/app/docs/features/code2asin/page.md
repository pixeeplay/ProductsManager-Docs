---
title: Code2ASIN - Amazon Integration
nextjs:
  metadata:
    title: Code2ASIN - Amazon Integration - Products Manager APP
    description: Convertissez automatiquement vos codes EAN/UPC en ASIN Amazon via l'API Product Advertising. Enrichissez votre catalogue avec les donnees Amazon.
---

Convertissez automatiquement vos codes EAN/UPC en identifiants Amazon ASIN. Code2ASIN interroge l'API Amazon Product Advertising pour enrichir votre catalogue avec les donnees produits Amazon : prix, images, descriptions et plus encore. {% .lead %}

---

## Vue d'Ensemble

Code2ASIN est le module de mapping EAN vers ASIN de Products Manager APP. Il permet de :

- **Convertir des codes EAN/UPC en ASIN** via l'API Amazon Product Advertising
- **Enrichir votre catalogue** avec les donnees Amazon (prix, images, descriptions)
- **Telecharger les images Amazon** vers votre stockage MinIO
- **Traiter des milliers de produits** en mode batch avec suivi en temps reel

Le module utilise une architecture asynchrone basee sur Celery pour traiter les conversions en arriere-plan, garantissant des performances optimales meme pour les grands catalogues.

---

## Architecture du Service

### Organisation des Modules

Code2ASIN est structure en plusieurs services specialises :

```
services/code2asin/
├── core_service.py              # Logging et parsing de fichiers
├── amazon_integration_service.py # Integration API Amazon (Celery tasks)
├── processing_service.py        # Orchestration des jobs
├── result_service.py            # Stockage et export des resultats
├── job_lifecycle_service.py     # CRUD des jobs
└── job_execution_service.py     # Gestion de l'execution
```

### Flux de Traitement

1. **Upload du fichier** : L'utilisateur uploade un fichier CSV/Excel contenant les codes EAN
2. **Creation du job** : Un job est cree dans la base `db_code2asin`
3. **Dispatch Celery** : Le job est envoye a la queue `code2asin`
4. **Traitement batch** : Les codes sont convertis par lots de 100
5. **Stockage resultats** : Les ASIN et donnees Amazon sont sauvegardes
6. **Export fichier** : Un fichier Excel de resultats est genere

---

## Gestion des Jobs

### Cycle de Vie d'un Job

Un job Code2ASIN passe par plusieurs statuts :

| Statut | Description |
|--------|-------------|
| `pending` | Job cree, en attente de traitement |
| `processing` | Conversion en cours |
| `paused` | Job mis en pause par l'utilisateur |
| `completed` | Traitement termine avec succes |
| `failed` | Erreur lors du traitement |
| `cancelled` | Annule par l'utilisateur |

### Actions Disponibles

- **Start** : Demarrer un job en attente
- **Pause** : Mettre en pause un job en cours
- **Resume** : Reprendre un job en pause
- **Cancel** : Annuler un job (pending, processing ou paused)
- **Retry** : Relancer un job echoue ou annule
- **Delete** : Supprimer un job (sauf en cours de traitement)

{% callout type="note" %}
Seuls les jobs en statut `failed` ou `cancelled` peuvent etre relances. Utilisez l'option `reset_retry_counter=true` pour reinitialiser le compteur de tentatives.
{% /callout %}

---

## Page de Details du Job

La page de details (`/code2asin/[id]/details`) affiche des informations completes sur chaque job.

### 8 Tuiles de Statistiques

| Tuile | Description |
|-------|-------------|
| **Total Codes** | Nombre total de codes EAN dans le fichier source |
| **With ASIN** | Nombre de codes ayant trouve un ASIN correspondant |
| **With Images** | Nombre de produits avec images Amazon telechargees |
| **With Price** | Nombre de produits avec prix Amazon |
| **Exact Matches** | Correspondances exactes (EAN = ASIN verifie) |
| **Fuzzy Matches** | Correspondances approximatives (titre similaire) |
| **Partial Matches** | Correspondances partielles |
| **Avg Confidence** | Score de confiance moyen (0-100%) |

### Timeline d'Execution

La timeline affiche les evenements du job :

- Heure de creation
- Demarrage du traitement
- Progression (codes traites)
- Completion ou erreur
- Temps d'execution total

### Onglets de Navigation

- **Results** : Liste paginee des resultats de conversion
- **Logs** : Journal detaille des operations
- **Configuration** : Parametres du job (mode, options)

---

## Telechargement d'Images Amazon

Code2ASIN peut telecharger automatiquement les images Amazon vers votre stockage MinIO.

### Configuration

Dans les options d'import :

```json
{
  "download_images": true,
  "max_images_per_product": 10,
  "image_mode": "replace"
}
```

### Modes d'Image

| Mode | Description |
|------|-------------|
| `replace` | Remplace les images existantes |
| `append` | Ajoute aux images existantes |
| `skip` | Ne telecharge pas si images existantes |

### Stockage

Les images sont stockees dans MinIO avec la structure :

```
products/{uuid[0:2]}/{product_id}/{hash}.jpg
```

Cette structure UUID prefix permet une distribution uniforme et supporte des catalogues de plus de 200 000 produits.

---

## Logs et Suivi d'Execution

### Structure des Logs

Chaque conversion genere un log detaille :

```json
{
  "id": 1,
  "timestamp": "2025-10-21T16:01:23Z",
  "input_code": "3760123456789",
  "code_type": "EAN",
  "previous_asin": null,
  "new_asin": "B08XYZABC1",
  "change_reason": "initial",
  "confidence_score": 0.95,
  "processing_time_ms": 245,
  "api_response": {...}
}
```

### Types de Match

| Type | Description | Fiabilite |
|------|-------------|-----------|
| `exact` | Correspondance exacte EAN | Tres haute |
| `partial` | Correspondance partielle | Haute |
| `fuzzy` | Correspondance par titre | Moyenne |
| `manual` | Validation manuelle | Variable |

---

## Configuration API

### Endpoints Principaux

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/code2asin/jobs` | Liste paginee des jobs |
| `GET` | `/code2asin/jobs/{id}` | Details d'un job |
| `POST` | `/code2asin/import` | Creer un nouveau job |
| `POST` | `/code2asin/jobs/{id}/start` | Demarrer un job |
| `POST` | `/code2asin/jobs/{id}/pause` | Mettre en pause |
| `POST` | `/code2asin/jobs/{id}/resume` | Reprendre |
| `POST` | `/code2asin/jobs/{id}/cancel` | Annuler |
| `POST` | `/code2asin/jobs/{id}/retry` | Relancer |
| `DELETE` | `/code2asin/jobs/{id}` | Supprimer |
| `GET` | `/code2asin/results/{id}` | Resultats de conversion |
| `GET` | `/code2asin/jobs/{id}/logs` | Logs du job |
| `GET` | `/code2asin/statistics` | Statistiques globales |
| `GET` | `/code2asin/stats/errors` | Statistiques d'erreurs |

### Permissions Requises

| Permission | Endpoints |
|------------|-----------|
| `READ_CODE2ASIN` | GET endpoints |
| `WRITE_CODE2ASIN` | POST endpoints (start, pause, resume, cancel, retry) |
| `DELETE_CODE2ASIN` | DELETE endpoint |

---

## Exemples d'Utilisation de l'API

### Creer un Job d'Import

```bash
curl -X POST "https://api.productsmanager.app/code2asin/import" \
  -H "Authorization: Bearer {token}" \
  -F "supplier_code=SUP001" \
  -F "file=@ean_codes.xlsx" \
  -F "use_amazon_api=true" \
  -F 'options={"download_images": true, "max_images_per_product": 5}'
```

**Reponse :**

```json
{
  "message": "Job Code2ASIN cree avec succes",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

### Recuperer les Jobs

```bash
curl -X GET "https://api.productsmanager.app/code2asin/jobs?page=1&per_page=20&status=completed" \
  -H "Authorization: Bearer {token}"
```

**Reponse :**

```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "supplier_code": "SUP001",
      "status": "completed",
      "total_codes": 1000,
      "successful_conversions": 850,
      "failed_conversions": 150,
      "created_at": "2025-10-21T16:00:00Z",
      "completed_at": "2025-10-21T16:05:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "per_page": 20
}
```

### Recuperer les Resultats d'un Job

```bash
curl -X GET "https://api.productsmanager.app/code2asin/results/550e8400-e29b-41d4-a716-446655440000?match_type=exact&limit=10" \
  -H "Authorization: Bearer {token}"
```

**Reponse :**

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "job_status": "completed",
  "total": 1000,
  "with_asin": 850,
  "with_images": 720,
  "with_price": 800,
  "exact_matches": 650,
  "fuzzy_matches": 150,
  "avg_confidence": 0.87,
  "items": [
    {
      "id": "660e9500-f39c-52e5-b827-557766551111",
      "product_ean": "3017620422003",
      "asin": "B00KWB94LS",
      "amazon_title": "Nutella Hazelnut Spread 400g",
      "match_confidence": 0.98,
      "match_type": "exact",
      "amazon_price": 5.99,
      "amazon_currency": "EUR",
      "amazon_rating": 4.7,
      "amazon_review_count": 12534,
      "amazon_images": ["https://m.media-amazon.com/images/I/81abc123.jpg"]
    }
  ]
}
```

### Relancer un Job Echoue

```bash
curl -X POST "https://api.productsmanager.app/code2asin/jobs/550e8400-e29b-41d4-a716-446655440000/retry?reset_retry_counter=true" \
  -H "Authorization: Bearer {token}"
```

**Reponse :**

```json
{
  "message": "Job marque pour relance (compteur reinitialise)",
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "retry_count": 0,
  "max_retries": 5
}
```

### Recuperer les Statistiques d'Erreurs

```bash
curl -X GET "https://api.productsmanager.app/code2asin/stats/errors?days=7" \
  -H "Authorization: Bearer {token}"
```

**Reponse :**

```json
{
  "period_days": 7,
  "total_errors": 50,
  "error_breakdown": {
    "network": {
      "count": 15,
      "percentage": 30.0,
      "description": "Network/connectivity errors (temporary, should retry)"
    },
    "api_rate_limit": {
      "count": 10,
      "percentage": 20.0,
      "description": "API rate limit exceeded (temporary, retry with backoff)"
    },
    "invalid_data": {
      "count": 20,
      "percentage": 40.0,
      "description": "Invalid ASIN/product data (permanent, don't retry)"
    },
    "unknown": {
      "count": 5,
      "percentage": 10.0,
      "description": "Unknown error (retry with caution)"
    }
  },
  "retry_backoff_schedule": [1, 5, 15, 60, 240]
}
```

---

## Modes de Traitement

### Phase 1 : Import Direct

Le mode Import Direct attend un fichier a 2 colonnes (EAN, ASIN) :

- Pas d'appel API Amazon
- Import direct des mappings fournis
- Ideal pour importer des mappings existants

```bash
curl -X POST "https://api.productsmanager.app/code2asin/import" \
  -F "supplier_code=SUP001" \
  -F "file=@ean_asin_mapping.csv" \
  -F "use_amazon_api=false"
```

### Phase 2 : Recherche Amazon API

Le mode API Amazon recherche les ASIN a partir des codes EAN :

- Appel Amazon Product Advertising API
- Enrichissement avec donnees Amazon
- Telechargement optionnel des images

```bash
curl -X POST "https://api.productsmanager.app/code2asin/import" \
  -F "supplier_code=SUP001" \
  -F "file=@ean_codes.csv" \
  -F "use_amazon_api=true" \
  -F 'options={"download_images": true}'
```

---

## Gestion des Erreurs

### Types d'Erreurs

| Type | Description | Action |
|------|-------------|--------|
| `network` | Erreur reseau/connectivite | Retry automatique |
| `api_rate_limit` | Limite API Amazon depassee | Backoff exponentiel |
| `invalid_data` | Donnees invalides | Pas de retry |
| `unknown` | Erreur inconnue | Retry avec prudence |

### Backoff Exponentiel

Les retries utilisent un backoff exponentiel :

- Tentative 1 : 1 minute
- Tentative 2 : 5 minutes
- Tentative 3 : 15 minutes
- Tentative 4 : 1 heure
- Tentative 5 : 4 heures

{% callout type="warning" %}
Les erreurs de type `invalid_data` ne sont pas relancees automatiquement car elles indiquent un probleme avec les donnees source (EAN invalide, produit introuvable, etc.).
{% /callout %}

---

## Cas d'Usage

### Enrichissement Catalogue E-commerce

**Contexte** : 5000 produits avec codes EAN mais sans donnees Amazon.

**Solution** :
1. Export des EAN depuis le catalogue
2. Creation d'un job Code2ASIN avec `use_amazon_api=true`
3. Activation du telechargement d'images
4. Import des resultats dans le catalogue

**Resultat** :
- 4200 ASIN trouves (84%)
- 3800 images telechargees
- Prix Amazon pour analyse competitive
- Enrichissement descriptions produits

### Mise a Jour Prix Concurrentiels

**Contexte** : Suivi des prix Amazon pour ajuster la tarification.

**Solution** :
1. Job Code2ASIN periodique (hebdomadaire)
2. Extraction des prix Amazon via `amazon_price`
3. Calcul des ecarts via `price_difference_percent`
4. Alertes sur variations >10%

**Resultat** :
- Suivi automatise des prix concurrents
- Ajustement tarifaire reactif
- Marge optimisee

---

## Prochaines Etapes

- [EAN Manager](/docs/features/ean-manager) : Recherche EAN pour produits sans code-barres
- [Import Centralisation](/docs/features/import-centralisation) : Importez vos catalogues fournisseurs
- [Market Intelligence](/docs/features/market-intelligence) : Analysez les tendances marche
- [API Reference](/docs/api/endpoints) : Documentation complete de l'API
