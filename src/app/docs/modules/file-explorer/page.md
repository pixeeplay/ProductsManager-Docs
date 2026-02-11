---
title: File Explorer
nextjs:
  metadata:
    title: File Explorer
    description: Explorateur de fichiers avec integration MinIO S3 pour la gestion des assets produits
---

# File Explorer

Le module File Explorer permet de naviguer, telecharger et gerer les fichiers stockes dans MinIO, le service de stockage objet S3-compatible de ProductsManager. {% .lead %}

## Vue d'ensemble

Le File Explorer fournit une interface graphique complete pour explorer les buckets MinIO, organiser les fichiers par type (imports, media, exports, etc.), et effectuer des operations CRUD sur les fichiers. Il supporte le drag-and-drop, la creation de dossiers, et offre deux modes d'affichage (grille et liste).

{% callout type="note" title="Module activable" %}
Le File Explorer est enregistre comme module `file_explorer` dans le systeme de modules. Il peut etre active ou desactive depuis `/settings/modules`.
{% /callout %}

## Architecture de stockage

MinIO est configure avec **8 buckets** dedies, chacun servant un domaine fonctionnel precis :

| Bucket | Description | Icone | Couleur |
|--------|------------|-------|---------|
| `catalog` | Fichiers catalogue produits | Package | Bleu |
| `imports` | Fichiers d'import bruts (CSV, XLSX) | Download | Vert |
| `media` | Images et medias produits | Image | Violet |
| `code2asin` | Fichiers de mapping EAN/ASIN | Barcode | Orange |
| `analytics` | Rapports et donnees analytiques | BarChart | Cyan |
| `exports` | Fichiers exportes (CSV, JSON, XML) | Upload | Rose |
| `temp` | Fichiers temporaires de traitement | Clock | Gris |
| `products` | Assets produits finalises | ShoppingBag | Indigo |

### Configuration MinIO

La connexion MinIO est configuree via les variables d'environnement :

```
MINIO_ENDPOINT = "minio:9000"
MINIO_ACCESS_KEY = "..."
MINIO_SECRET_KEY = "..."
MINIO_SECURE = false
```

Un lien direct vers la console MinIO est accessible depuis l'interface File Explorer pour l'administration avancee.

## Interface utilisateur

### Navigation

L'interface est organisee en trois zones principales :

1. **Selecteur de bucket** : Barre horizontale avec les 8 buckets, chacun avec son icone et sa couleur distinctive
2. **Fil d'Ariane (breadcrumb)** : Navigation hierarchique dans les dossiers du bucket selectionne
3. **Zone de contenu** : Affichage des fichiers et dossiers en mode grille ou liste

### Modes d'affichage

- **Mode grille** : Apercu visuel avec icones larges, ideal pour les images et medias
- **Mode liste** : Tableau detaille avec nom, taille, type MIME et date de modification

### Operations disponibles

| Operation | Description | Methode |
|-----------|------------|---------|
| **Parcourir** | Navigation dans les dossiers et buckets | Click / breadcrumb |
| **Telecharger** | Telecharger un fichier sur le poste local | Bouton download |
| **Uploader** | Envoyer un fichier par drag-and-drop ou selecteur | Drop zone / bouton |
| **Creer un dossier** | Creer un sous-dossier dans le bucket courant | Bouton + dialog |
| **Supprimer** | Supprimer un fichier (avec confirmation) | Bouton delete |

### Upload par drag-and-drop

L'upload supporte le glisser-deposer directement dans la zone de contenu. Le composant affiche un overlay visuel pendant le survol et un indicateur de progression pendant le transfert.

```typescript
// Gestion du drop
const handleDrop = async (e: React.DragEvent) => {
  const files = Array.from(e.dataTransfer.files)
  for (const file of files) {
    await fileExplorerApi.uploadFile(currentBucket, currentPath, file)
  }
  await refreshListing()
}
```

## API Backend

Le router `storage` expose les endpoints suivants sous `/api/v1/storage` :

| Endpoint | Methode | Description |
|----------|---------|------------|
| `/config` | GET | Configuration MinIO (endpoint, buckets) |
| `/buckets` | GET | Liste des buckets avec taille et nombre de fichiers |
| `/list` | GET | Liste le contenu d'un dossier dans un bucket |
| `/upload` | POST | Upload un fichier dans un bucket/chemin |
| `/download` | GET | Telecharge un fichier (URL signee ou stream) |
| `/delete` | DELETE | Supprime un fichier |
| `/create-folder` | POST | Cree un dossier virtuel dans un bucket |

### Modeles de donnees

```python
class FileItem(BaseModel):
    name: str               # Nom du fichier/dossier
    path: str               # Chemin complet dans le bucket
    is_directory: bool       # True si c'est un dossier
    size: Optional[int]      # Taille en octets (None pour dossiers)
    content_type: Optional[str]  # Type MIME
    last_modified: Optional[datetime]  # Date de derniere modification

class BucketInfo(BaseModel):
    name: str               # Nom du bucket
    object_count: int       # Nombre d'objets
    total_size: int         # Taille totale en octets

class DirectoryListing(BaseModel):
    bucket: str             # Bucket courant
    path: str               # Chemin courant
    items: List[FileItem]   # Fichiers et dossiers
    total_items: int        # Nombre total d'elements
```

### Securite

Tous les endpoints necessitent une authentification JWT. Les permissions sont gerees par le systeme de permissions standard :

```python
@router.get("/list")
@require_permission(Permission.READ_FILES)
async def list_files(bucket: str, path: str = ""):
    ...
```

## Enregistrement module

Le File Explorer est declare dans le registre des modules (`api/core/modules.py`) :

```python
ModuleID.FILE_EXPLORER.value: ModuleDefinition(
    id=ModuleID.FILE_EXPLORER,
    name="File Explorer",
    description="File system explorer for import files and media",
    default_order=10,
    route_prefixes=["/file-explorer"],
    celery_queues=[],
    icon="folder-open"
)
```

Variable d'environnement pour desactiver : `MODULE_FILE_EXPLORER_ENABLED=false`

## Client API frontend

Le client TypeScript `file-explorer-api.ts` encapsule les appels REST :

```typescript
type BucketType =
  | "catalog" | "imports" | "media" | "code2asin"
  | "analytics" | "exports" | "temp" | "products"

interface FileItem {
  name: string
  path: string
  is_directory: boolean
  size?: number
  content_type?: string
  last_modified?: string
}

// Methodes principales
fileExplorerApi.listFiles(bucket, path)
fileExplorerApi.uploadFile(bucket, path, file)
fileExplorerApi.downloadFile(bucket, path)
fileExplorerApi.deleteFile(bucket, path)
fileExplorerApi.createFolder(bucket, path)
fileExplorerApi.getBuckets()
```

{% callout type="warning" title="Fichiers temporaires" %}
Le bucket `temp` est nettoye periodiquement. Ne stockez pas de fichiers permanents dans ce bucket. Utilisez `catalog`, `media` ou `exports` selon le type de contenu.
{% /callout %}

## Liens utiles

- [Architecture technique](/docs/technical/architecture) — Vue d'ensemble de l'infrastructure
- [Systeme de modules](/docs/modules/module-system) — Activation et configuration des modules
- [Import de produits](/docs/features/imports) — Pipeline d'import utilisant le stockage MinIO
