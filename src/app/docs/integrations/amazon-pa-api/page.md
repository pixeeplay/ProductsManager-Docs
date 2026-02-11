---
title: Integration Amazon PA-API et Code2ASIN
nextjs:
  metadata:
    title: Integration Amazon PA-API et Code2ASIN - Products Manager APP
    description: Integration Amazon Product Advertising API, service Code2ASIN pour le mapping EAN vers ASIN, et configuration.
---

Products Manager integre Amazon Product Advertising API (PA-API 5.0) pour rechercher des produits par code EAN/UPC et le service Code2ASIN pour mapper massivement les codes EAN vers les ASIN Amazon correspondants. {% .lead %}

---

## Vue d'ensemble

L'integration Amazon se decompose en deux modules complementaires :

| Module | Service | Description |
|--------|---------|-------------|
| Amazon PA-API | `services/amazon/api_service.py` | Recherche unitaire de produits sur Amazon |
| Code2ASIN | `services/code2asin/` | Mapping massif EAN vers ASIN via jobs asynchrones |

---

## Amazon PA-API

### Configuration

L'API Amazon PA-API est configuree via des variables d'environnement :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `AMAZON_PAAPI_ENABLED` | Activation de l'API | `true` / `false` |
| `AMAZON_PAAPI_ACCESS_KEY` | Cle d'acces PA-API | `AKIA...` |
| `AMAZON_PAAPI_SECRET_KEY` | Cle secrete PA-API | `wJalrXUtnF...` |
| `AMAZON_ASSOCIATE_TAG` | Tag Amazon Associates | `monsite-21` |
| `AMAZON_PAAPI_HOST` | Hote de l'API | `webservices.amazon.fr` |
| `AMAZON_PAAPI_REGION` | Region AWS | `eu-west-1` |

{% callout type="warning" title="Prerequis" %}
L'utilisation de PA-API necessite un compte Amazon Associates actif et l'approbation du programme PA-API. Les cles d'acces sont differentes des cles AWS standard.
{% /callout %}

### Fonctions disponibles

| Fonction | Description | Parametres |
|----------|-------------|------------|
| `search_amazon_by_ean(ean)` | Recherche un produit par EAN/UPC | Code EAN (string) |
| `validate_asin_on_amazon(asin)` | Valide l'existence d'un ASIN | ASIN (string) |
| `fetch_amazon_product_data(asin)` | Recupere les donnees completes | ASIN (string) |

### Exemple de reponse

```json
{
  "asin": "B08XYZ1234",
  "title": "Samsung Galaxy S24",
  "price": 799.99,
  "currency": "EUR",
  "category": "Electronics",
  "rating": 4.5,
  "review_count": 1234,
  "images": ["https://...", "https://..."],
  "availability": "In Stock",
  "prime_eligible": true
}
```

---

## Service Code2ASIN

Le service Code2ASIN permet de mapper massivement des codes EAN vers des ASIN Amazon via des jobs asynchrones.

### Architecture

```
services/code2asin/
  core_service.py              # Utilitaires de base (logging DB, parsing fichiers)
  amazon_api_service.py        # Integration PA-API (deprecated, utiliser services/amazon/)
  amazon_integration_service.py # Service d'integration Amazon complet
  job_lifecycle_service.py     # Gestion du cycle de vie des jobs
  job_execution_service.py     # Execution des jobs de mapping
  processing_service.py        # Logique de traitement par lot
  field_processor.py           # Traitement des champs individuels
  validation_utils.py          # Utilitaires de validation
  result_service.py            # Gestion des resultats
  file_handler.py              # Gestion des fichiers source
  image_service.py             # Recuperation des images Amazon
```

### Base de donnees

Les donnees Code2ASIN sont stockees dans la base dediee `db_code2asin` :

| Table | Description |
|-------|-------------|
| `code2asin_jobs` | Jobs de mapping (statut, progression, statistiques) |
| `code2asin_results` | Resultats de mapping (EAN, ASIN, confiance) |
| `code2asin_logs` | Journaux d'execution detailles |

### Workflow de mapping

1. **Creation du job** : Upload du fichier CSV/Excel avec les codes EAN
2. **Parsing** : Extraction des codes EAN du fichier source
3. **Recherche** : Interrogation de l'API Amazon pour chaque EAN
4. **Matching** : Correspondance EAN/ASIN avec score de confiance
5. **Resultats** : Stockage des mappings et generation du fichier resultat
6. **Notification** : Notification de fin de job

---

## Router Amazon

Le router `/api/v1/amazon` expose les endpoints de configuration :

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/amazon/config` | GET | Configuration PA-API actuelle |
| `/api/v1/amazon/config` | PUT | Modifier la configuration |
| `/api/v1/amazon/test` | POST | Tester la connexion PA-API |

---

## Router Code2ASIN

Le router `/api/v1/code2asin` expose les endpoints de gestion des jobs :

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/code2asin/jobs` | GET | Lister les jobs |
| `/api/v1/code2asin/jobs` | POST | Creer un nouveau job |
| `/api/v1/code2asin/jobs/{id}` | GET | Detail d'un job |
| `/api/v1/code2asin/jobs/{id}/cancel` | POST | Annuler un job en cours |
| `/api/v1/code2asin/jobs/{id}/results` | GET | Resultats d'un job |
| `/api/v1/code2asin/jobs/{id}/download` | GET | Telecharger les resultats |

### Exemple : Creer un job

```bash
curl -X POST https://staging-api.productsmanager.app/api/v1/code2asin/jobs   -H "Authorization: Bearer "   -F "file=@codes_ean.csv"   -F "name=Mapping Janvier 2026"
```

---

## Logging des jobs

Le service `core_service.py` fournit un systeme de logging persistant en base de donnees :

```python
from services.code2asin.core_service import create_job_log

await create_job_log(
    job_id="123e4567-e89b-12d3-a456-426614174000",
    log_level="INFO",
    message="Job demarre",
    details={"source_file": "products.csv"}
)
```

{% callout type="info" title="Resilience du logging" %}
Si l'ecriture du log en base echoue, l'erreur est capturee et logguee en console sans faire echouer le job principal.
{% /callout %}

---

## Limites et quotas

| Parametre | Valeur | Description |
|-----------|--------|-------------|
| Rate limit PA-API | 1 requete/seconde | Limite imposee par Amazon |
| Taille fichier max | 100 Mo | Limite d'upload |
| EAN par job | Illimite | Traitement par lots |

{% callout type="danger" title="Cles PA-API" %}
Les cles PA-API sont stockees soit dans les variables d'environnement, soit dans la configuration AI Providers en base (provider `serp_api`). Ne jamais les commiter dans le code source.
{% /callout %}
