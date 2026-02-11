---
title: Gestion des erreurs API
nextjs:
  metadata:
    title: Gestion des erreurs API - Products Manager APP
    description: Format unifie des erreurs, codes HTTP, codes d'erreur standardises et bonnes pratiques de gestion des erreurs.
---

L'API Products Manager utilise un systeme unifie de gestion des erreurs. Toutes les erreurs suivent un format JSON coherent avec des codes d'erreur standardises, un suivi par request ID et une journalisation structuree. {% .lead %}

---

## Format de reponse d'erreur

Toutes les erreurs retournees par l'API suivent ce format unifie :

```json
{
  "error": {
    "code": 404,
    "error_code": "PRODUCT_NOT_FOUND",
    "type": "not_found",
    "message": "Product with ID 'abc-123' not found",
    "details": null,
    "path": "/api/v1/products/abc-123",
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-02-11T10:30:00.000Z"
  }
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `code` | integer | Code de statut HTTP |
| `error_code` | string | Code d'erreur standardise (ex: `PRODUCT_NOT_FOUND`) |
| `type` | string | Type d'erreur (voir section ci-dessous) |
| `message` | string | Message lisible par un humain |
| `details` | object/list/null | Informations detaillees optionnelles |
| `path` | string | Chemin de la requete |
| `request_id` | string | UUID unique pour le tracage |
| `timestamp` | string | Horodatage ISO 8601 |

---

## Types d'erreur

| Type | Description | Codes HTTP |
|------|-------------|------------|
| `http_error` | Erreur HTTP generique | Variable |
| `validation_error` | Erreur de validation des donnees | 400, 422 |
| `authentication_error` | Authentification requise ou invalide | 401 |
| `authorization_error` | Permissions insuffisantes | 403 |
| `not_found` | Ressource introuvable | 404 |
| `conflict` | Conflit de ressource (doublon, etat invalide) | 409 |
| `rate_limit_exceeded` | Limitation de debit depassee | 429 |
| `database_error` | Erreur de base de donnees | 500 |
| `internal_server_error` | Erreur interne non geree | 500 |

---

## Codes HTTP utilises

### 2xx -- Succes

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | Requete reussie (GET, PUT, PATCH) |
| 201 | Created | Ressource creee (POST) |
| 204 | No Content | Suppression reussie (DELETE) |

### 4xx -- Erreur client

| Code | Signification | Usage |
|------|---------------|-------|
| 400 | Bad Request | Donnees invalides, contrainte violee |
| 401 | Unauthorized | Token JWT manquant ou expire |
| 403 | Forbidden | Permissions insuffisantes, CSRF invalide |
| 404 | Not Found | Ressource introuvable |
| 409 | Conflict | Doublon, etat de workflow invalide |
| 413 | Payload Too Large | Fichier trop volumineux (limite : 100 Mo) |
| 422 | Unprocessable Entity | Validation Pydantic echouee |
| 429 | Too Many Requests | Limite de debit depassee |

### 5xx -- Erreur serveur

| Code | Signification | Usage |
|------|---------------|-------|
| 500 | Internal Server Error | Erreur non geree, erreur base de donnees |
| 502 | Bad Gateway | Service externe indisponible |
| 503 | Service Unavailable | Service en maintenance |

---

## Codes d'erreur standardises

L'API utilise des codes d'erreur normalises definis dans `core/error_codes.py`. Voici les principaux :

### Authentification

| Code | Description |
|------|-------------|
| `AUTH_TOKEN_MISSING` | Token d'authentification absent |
| `AUTH_TOKEN_EXPIRED` | Token expire |
| `AUTH_TOKEN_INVALID` | Token invalide ou malformee |
| `PERMISSION_DENIED` | Permissions insuffisantes |

### Produits et Catalogue

| Code | Description |
|------|-------------|
| `PRODUCT_NOT_FOUND` | Produit introuvable |
| `PRODUCT_ALREADY_EXISTS` | Produit en doublon (meme EAN) |
| `VALIDATION_FAILED` | Validation des champs echouee |
| `VALIDATION_CONSTRAINT_VIOLATION` | Contrainte metier violee |

### Import

| Code | Description |
|------|-------------|
| `IMPORT_JOB_NOT_FOUND` | Job d'import introuvable |
| `IMPORT_FILE_INVALID_TYPE` | Type de fichier non supporte |
| `IMPORT_FILE_TOO_LARGE` | Fichier depassant la limite de taille |
| `IMPORT_PARSE_FAILED` | Echec de l'analyse du fichier |
| `IMPORT_MAPPING_INVALID` | Mapping de colonnes invalide |
| `IMPORT_PROCESSING_FAILED` | Echec du traitement de l'import |

### Stockage et Media

| Code | Description |
|------|-------------|
| `STORAGE_UPLOAD_FAILED` | Echec de l'upload vers MinIO |
| `STORAGE_DOWNLOAD_FAILED` | Echec du telechargement |
| `MEDIA_UPLOAD_FAILED` | Echec de l'upload media |
| `MEDIA_THUMBNAIL_FAILED` | Echec de la generation de miniature |

### Cache et Base de donnees

| Code | Description |
|------|-------------|
| `CACHE_CONNECTION_FAILED` | Connexion Redis echouee |
| `DATABASE_CONNECTION_FAILED` | Connexion PostgreSQL echouee |
| `DATABASE_QUERY_FAILED` | Requete SQL echouee |
| `DATABASE_TRANSACTION_FAILED` | Transaction echouee |

### Limitation de debit

| Code | Description |
|------|-------------|
| `RATE_LIMIT_EXCEEDED` | Trop de requetes |

---

## Erreurs de validation (422)

Les erreurs de validation retournent des details au niveau du champ :

```json
{
  "error": {
    "code": 422,
    "error_code": "VALIDATION_FAILED",
    "type": "validation_error",
    "message": "Request validation failed",
    "details": [
      {
        "field": "body.email",
        "message": "value is not a valid email address",
        "type": "value_error.email"
      },
      {
        "field": "body.price",
        "message": "ensure this value is greater than 0",
        "type": "value_error.number.not_gt"
      }
    ],
    "path": "/api/v1/products",
    "request_id": "...",
    "timestamp": "..."
  }
}
```

---

## Hierarchie des exceptions

L'application definit une hierarchie d'exceptions personnalisees dans `core/exceptions.py` :

```
ProductsManagerError (base)
  +-- ValidationError (400)
  |     +-- FileValidationError
  |     +-- ConfigValidationError
  |     +-- DataValidationError
  |     +-- SchemaValidationError
  +-- ResourceNotFoundError (404)
  |     +-- ProductNotFoundError
  |     +-- ImportJobNotFoundError
  |     +-- TemplateNotFoundError
  +-- BusinessRuleError (409)
  |     +-- DuplicateResourceError
  |     +-- InvalidStateError
  +-- ProcessingError (500)
  |     +-- ParserError
  |     +-- PersistenceError
  |     +-- ImportProcessingError
  |     +-- ExternalServiceError
  |     +-- CacheError
  |     +-- DatabaseError
  |     +-- MediaError
  |     +-- StorageError
  +-- AuthenticationError (401)
  +-- AuthorizationError (403)
  +-- RateLimitError (429)
```

---

## Tracage des erreurs

Chaque reponse d'erreur inclut un `request_id` unique (UUID v4) dans le corps de la reponse et dans l'en-tete `X-Request-ID`. Ce mecanisme permet de :

- Retrouver les logs correspondants dans les journaux structures
- Correler les erreurs entre le frontend et le backend
- Identifier les requetes problematiques dans Sentry

{% callout type="info" title="Correlation ID" %}
En plus du `request_id`, un `X-Correlation-ID` est propage a travers toute la chaine de middleware pour le suivi inter-services.
{% /callout %}

---

## Bonnes pratiques

1. **Toujours verifier le champ `error_code`** pour la logique de traitement cote client
2. **Utiliser le `request_id`** lors des rapports de bugs pour faciliter le diagnostic
3. **Ne pas se fier au `message`** pour la logique applicative (il peut changer)
4. **Gerer le 429** en implementant un backoff exponentiel
5. **Les erreurs 500** ne revelent jamais les details internes en production
