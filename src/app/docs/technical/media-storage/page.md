---
title: Stockage Media et MinIO
nextjs:
  metadata:
    title: Stockage Media et MinIO - Products Manager APP
    description: Integration MinIO pour le stockage objet, gestion des buckets, upload de fichiers, thumbnails et architecture multi-bucket.
---

Products Manager utilise MinIO comme systeme de stockage objet S3-compatible pour gerer l'ensemble des fichiers : catalogues importes, images produit, exports, et fichiers temporaires. L'architecture multi-bucket permet de separer les donnees par domaine fonctionnel. {% .lead %}

---

## Architecture multi-bucket

Le systeme de stockage est organise en plusieurs buckets specialises :

| Bucket | Variable d'environnement | Contenu |
|--------|--------------------------|---------|
| Imports | `MINIO_BUCKET_IMPORTS` | Fichiers CSV/Excel des fournisseurs |
| Exports | `MINIO_BUCKET_EXPORTS` | Fichiers generes pour l'export |
| Temp | `MINIO_BUCKET_TEMP` | Fichiers temporaires de traitement |
| Manager | `MINIO_BUCKET_MANAGER` | Fichiers de gestion (media, thumbnails) |

---

## Service de stockage

Le service central est `StorageService` dans `services/storage_service.py`, base sur le **Repository Pattern** avec le client Python MinIO :

```python
from services.storage_service import storage_service

# Upload d'un fichier
url = storage_service.upload_file(
    file_content=file_bytes,
    object_name="products/image.jpg",
    content_type="image/jpeg",
    bucket_type="media"
)
```

### Construction des chemins

Le `PathBuilder` genere automatiquement les chemins de stockage selon le type de bucket :

| Type | Prefixe genere | Exemple |
|------|---------------|---------|
| catalog | `products/` | `products/image.jpg` |
| media | `images/` | `images/product_001.jpg` |
| imports | `{FOURNISSEUR}/{YYYY-MM}/` | `INGRAM/2026-02/catalogue.xlsx` |
| code2asin | `results/{YYYYMMDD}/` | `results/20260211/results.csv` |
| analytics | `reports/{YYYY-MM}/` | `reports/2026-02/report.xlsx` |
| temp | `temp/{timestamp}/` | `temp/20260211_143022/file.tmp` |

---

## Service Media

Le service `media_service.py` gere les operations specifiques aux images produit :

### Traitement d'images

Le `ImageProcessor` prend en charge :

- **Detection de format** : JPEG, PNG, WebP
- **Conversion RGB** : Gestion des images RGBA avec transparence
- **Optimisation** : Compression JPEG qualite 85%
- **Redimensionnement** : Taille maximale 2000x2000 pixels

### Generation de thumbnails

Trois tailles de miniatures sont generees automatiquement :

| Taille | Dimensions | Usage |
|--------|-----------|-------|
| small | 150 x 150 px | Listes, tableaux de donnees |
| medium | 300 x 300 px | Grilles de produits |
| large | 800 x 800 px | Pages de detail produit |

### Formats supportes

| Format | Extension | Support |
|--------|-----------|---------|
| JPEG | `.jpg`, `.jpeg` | Complet (optimisation) |
| PNG | `.png` | Complet (transparence conservee) |
| WebP | `.webp` | Complet (compression avancee) |

---

## Router Media

Le router `/api/v1/media` expose les endpoints de gestion media :

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/media` | GET | Liste des fichiers media (pagine) |
| `/api/v1/media/files` | GET | Liste avec filtrage par type et recherche |
| `/api/v1/media/upload` | POST | Upload d'un fichier media |
| `/api/v1/media/{id}` | GET | Detail d'un fichier media |
| `/api/v1/media/{id}` | DELETE | Suppression d'un fichier media |

### Filtrage

```bash
# Filtrer par type de fichier
GET /api/v1/media/files?file_type=image&search=product

# Pagination
GET /api/v1/media/files?page=2&per_page=50
```

---

## Router Storage (Multi-bucket)

Le router `/api/v1/storage` offre une navigation multi-bucket :

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/storage/config` | GET | Configuration du stockage (endpoint, console URL) |
| `/api/v1/storage/buckets` | GET | Liste des buckets disponibles |
| `/api/v1/storage/browse` | GET | Navigation dans un bucket (repertoires, fichiers) |
| `/api/v1/storage/upload` | POST | Upload vers un bucket specifique |
| `/api/v1/storage/download` | GET | Telechargement d'un fichier |

### Modeles de donnees

```json
{
  "path": "products/",
  "bucket_type": "media",
  "items": [
    {
      "name": "image_001.jpg",
      "path": "products/image_001.jpg",
      "type": "file",
      "size": 245760,
      "modified_at": "2026-02-10T14:30:00Z",
      "mime_type": "image/jpeg",
      "is_directory": false
    }
  ],
  "total": 42
}
```

---

## Configuration des buckets

Le router `/api/v1/bucket-configs` permet de gerer les configurations de buckets via l'interface d'administration. Les configurations supportent plusieurs fournisseurs :

| Fournisseur | Description |
|-------------|-------------|
| MinIO | Stockage objet local (principal) |
| OVH Object Storage | Stockage cloud OVH |
| AWS S3 | Amazon Simple Storage Service |

### Endpoints

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/bucket-configs` | GET | Lister les configurations |
| `/api/v1/bucket-configs/{id}` | GET | Detail d'une configuration |
| `/api/v1/bucket-configs` | POST | Creer une configuration |
| `/api/v1/bucket-configs/{id}` | PUT | Modifier une configuration |
| `/api/v1/bucket-configs/{id}/test` | POST | Tester la connexion |

---

## Flux d'upload

Le processus d'upload d'une image produit suit ces etapes :

1. **Reception** : Le fichier est recu via `multipart/form-data`
2. **Validation** : Verification du type MIME et de la taille
3. **Optimisation** : Compression et redimensionnement si necessaire
4. **Thumbnails** : Generation des 3 tailles de miniatures
5. **Stockage** : Upload vers MinIO dans le bucket appropriate
6. **Persistance** : Creation de l'enregistrement `Media` en base (db_media)
7. **Invalidation** : Invalidation du cache media

{% callout type="note" title="Taille maximale" %}
La taille maximale d'upload est de 100 Mo, definie par le `RequestSizeMiddleware`.
{% /callout %}

---

## Taches Celery

Certaines operations media sont executees de maniere asynchrone via Celery :

| Tache | Description |
|-------|-------------|
| `generate_thumbnails` | Generation asynchrone des miniatures |
| `optimize_images` | Optimisation batch des images existantes |
| `sync_media_metadata` | Synchronisation des metadonnees media |

---

## Bonnes pratiques

1. **Toujours utiliser le `PathBuilder`** pour generer les chemins de stockage
2. **Ne jamais stocker d'URL absolues** en base -- utiliser les chemins relatifs
3. **Gerer les erreurs de stockage** avec les exceptions `StorageError` et `MediaError`
4. **Utiliser les taches Celery** pour les operations lourdes (batch, thumbnails)
5. **Preferer WebP** pour les nouvelles images (meilleure compression)
