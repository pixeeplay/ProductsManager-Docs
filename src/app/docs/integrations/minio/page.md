---
title: Integration MinIO
nextjs:
  metadata:
    title: Integration MinIO - Products Manager APP
    description: Configuration MinIO, compatibilite S3, structure des buckets et deploiement Docker.
---

Products Manager utilise MinIO comme systeme de stockage objet S3-compatible pour tous les fichiers de l'application. MinIO est deploye en tant que service Docker autonome avec une console d'administration web. {% .lead %}

---

## Qu'est-ce que MinIO ?

MinIO est un serveur de stockage objet haute-performance, compatible avec l'API Amazon S3.

| Critere | MinIO | Systeme de fichiers local |
|---------|-------|---------------------------|
| Scalabilite | Horizontale, multi-noeud | Limitee a un serveur |
| API | S3-compatible (standard) | Proprietaire |
| Haute disponibilite | Replique, erasure coding | Point unique de defaillance |
| Console web | Interface d'administration | Aucune |
| Migration cloud | Compatible AWS S3, OVH, GCP | Migration complexe |

---

## Configuration Docker

MinIO est deploye via Docker Compose :

```yaml
minio:
  image: minio/minio:latest
  container_name: staging-minio
  ports:
    - "127.0.0.1:9000:9000"
    - "127.0.0.1:9001:9001"
  environment:
    - MINIO_ROOT_USER=$MINIO_ACCESS_KEY
    - MINIO_ROOT_PASSWORD=$MINIO_SECRET_KEY
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
    interval: 30s
```

| Port | Usage |
|------|-------|
| 9000 | API S3 (upload/download) |
| 9001 | Console web d'administration |

{% callout type="warning" title="Securite reseau" %}
Les ports MinIO sont lies a 127.0.0.1 et ne sont pas exposes sur le reseau public. L'acces externe se fait via le reverse proxy Traefik/Coolify.
{% /callout %}

---

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MINIO_ENDPOINT` | Endpoint de l'API MinIO | `staging-minio:9000` |
| `MINIO_ACCESS_KEY` | Cle d'acces | `minio_admin` |
| `MINIO_SECRET_KEY` | Cle secrete | `minio_secret_key` |
| `MINIO_SECURE` | Utiliser HTTPS | `false` (interne Docker) |
| `MINIO_BUCKET_IMPORTS` | Bucket pour les imports | `pm-imports` |
| `MINIO_BUCKET_EXPORTS` | Bucket pour les exports | `pm-exports` |
| `MINIO_BUCKET_TEMP` | Bucket temporaire | `pm-temp` |
| `MINIO_BUCKET_MANAGER` | Bucket media/manager | `pm-manager` |

---

## Structure des buckets

### pm-imports

Fichiers source des imports fournisseurs, organises par fournisseur et mois :

```
pm-imports/
  INGRAM/2026-01/catalogue_ingram.xlsx
  INGRAM/2026-02/catalogue_ingram.csv
  COMLINE/2026-02/products_comline.xlsx
  pending/2026/02/11/upload_temp.csv
```

### pm-exports

Fichiers generes lors des exports :

```
pm-exports/
  reports/2026-02/rapport_mensuel.xlsx
  prestashop/export_20260211.csv
```

### pm-manager

Fichiers media et thumbnails :

```
pm-manager/
  images/product_001.jpg
  images/product_001_small.jpg
  images/product_001_medium.jpg
  images/product_001_large.jpg
```

### pm-temp

Fichiers temporaires (nettoyage automatique) :

```
pm-temp/
  temp/20260211_143022/processing_buffer.tmp
```

---

## Client Python MinIO

```python
from minio import Minio

client = Minio(
    endpoint="staging-minio:9000",
    access_key="minio_admin",
    secret_key="minio_secret_key",
    secure=False
)

# Upload
client.put_object(
    bucket_name="pm-imports",
    object_name="INGRAM/2026-02/catalogue.xlsx",
    data=file_stream,
    length=file_size,
    content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
)

# Download
response = client.get_object("pm-imports", "INGRAM/2026-02/catalogue.xlsx")

# URL presignee (acces temporaire)
url = client.presigned_get_object("pm-manager", "images/product.jpg", expires=3600)
```

---

## Console d'administration

La console web MinIO est accessible via `SERVICE_URL_MINIO`. Elle permet de naviguer dans les buckets, uploader/telecharger des fichiers, gerer les politiques d'acces et surveiller l'espace disque.

---

## Healthcheck

```bash
curl -f http://localhost:9000/minio/health/live
```

L'API backend depend de MinIO au demarrage (`condition: service_healthy`).

---

## Sauvegarde et migration

### Sauvegarde du volume Docker

```bash
docker run --rm -v minio_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/minio_backup.tar.gz /data
```

### Migration vers S3

Grace a la compatibilite S3, la migration vers AWS S3 ou OVH Object Storage est directe :

1. Configurer le nouveau bucket dans `/api/v1/bucket-configs`
2. Modifier les variables d'environnement
3. Utiliser `mc mirror` (MinIO Client) pour synchroniser les donnees

{% callout type="info" title="Migration planifiee" %}
Une migration vers un stockage S3 externe est prevue dans la roadmap pour externaliser les fichiers media et reduire la charge sur le VPS.
{% /callout %}

---

## Bonnes pratiques

1. **Ne jamais exposer MinIO sur le reseau public** sans reverse proxy TLS
2. **Utiliser des cles d'acces dediees** par service (pas le root)
3. **Activer le versionning** sur les buckets critiques (imports, media)
4. **Nettoyer regulierement** le bucket pm-temp
5. **Surveiller l'espace disque** via les metriques Prometheus
