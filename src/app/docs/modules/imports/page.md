---
title: Imports
nextjs:
  metadata:
    title: Imports - Products Manager APP
    description: Pipeline d'import complet avec support multi-formats, mapping templates, planification automatique, architecture split et gestion d'erreurs avancee.
---

Importez vos catalogues fournisseurs dans tous les formats courants. Products Manager APP offre un pipeline d'import complet avec parsing intelligent, mapping de colonnes, validation des donnees et persistance EAN-centrique. {% .lead %}

---

## Vue d'Ensemble

Le module **Imports** est le coeur du systeme d'alimentation de votre catalogue. Il orchestre l'ensemble du processus d'import depuis la reception du fichier jusqu'a la persistance des produits en base de donnees.

L'architecture est divisee en services specialises (split architecture) pour une meilleure maintenabilite :

- **ImportOrchestrator** : Coordinateur principal du workflow
- **ParserService** : Parsing CSV, Excel et JSON
- **ValidationService** : Validation des donnees et des regles metier
- **PersistenceService** : Persistance en base avec architecture EAN-centrique
- **EANResolutionService** : Resolution cross-database des EAN manquants

Le systeme supporte jusqu'a 200 000 lignes par import API et utilise Celery pour les fichiers volumineux.

---

## Formats Supportes

### Fichiers

| Format | Extensions | Particularites |
|--------|-----------|----------------|
| CSV | `.csv`, `.txt` | Detection automatique du delimiteur (virgule, point-virgule, tabulation) |
| Excel | `.xlsx`, `.xls` | Support multi-feuilles et formules |
| JSON | `.json` | Validation de schema, structures imbriquees |

### Sources d'Import

| Source | Handler | Description |
|--------|---------|-------------|
| Upload manuel | `ManualImportHandler` | Glisser-deposer ou selection de fichier |
| FTP | `FTPImportHandler` | Connexion FTP avec credentials |
| SFTP | `SFTPImportHandler` | Connexion SFTP securisee |
| Email | `EmailImportHandler` | Recuperation automatique via IMAP |
| URL HTTP | Upload depuis URL | Telechargement direct depuis une URL |

{% callout type="note" title="Detection automatique de format" %}
L'endpoint `/detect-format` analyse un fichier et detecte automatiquement son format, encodage, delimiteur et structure de colonnes. Cette detection est utilisee pour pre-remplir la configuration de mapping.
{% /callout %}

---

## Pipeline d'Import

Le processus d'import suit un workflow en etapes :

### Etape 1 : Upload et Analyse

L'utilisateur uploade un fichier ou declenche un import automatise. Le systeme :

1. Valide le type et la taille du fichier
2. Stocke le fichier dans MinIO
3. Analyse la structure (colonnes, types de donnees, encodage)
4. Cree un job d'import avec le statut `uploaded`

### Etape 2 : Configuration du Mapping

L'interface de mapping permet d'associer les colonnes du fichier aux champs Products Manager :

- **Mapping par template** : Reutilisation de configurations existantes
- **Mapping manuel** : Association colonne par colonne via interface visuelle
- **Regles automatiques** : Auto-completion HT/TTC, conversion unites/devises
- **Attributs calcules** : Colonnes calculees definies dans les mapping templates

### Etape 3 : Dry Run (optionnel)

Le mode dry run execute l'import sans persister les donnees :

- Valide toutes les lignes
- Rapporte les erreurs potentielles
- Affiche un apercu des resultats (crees, mis a jour, ignores)
- Permet d'ajuster le mapping avant l'import reel

### Etape 4 : Traitement

Le traitement reel persiste les donnees avec l'architecture 3-sessions :

```python
async with db_router.session_scope("imports") as imports_session:
    async with db_router.session_scope("catalog") as catalog_session:
        async with db_router.session_scope("suppliers") as suppliers_session:
            handler = ManualImportHandler(imports_session, catalog_session, suppliers_session)
```

Les etapes de traitement sont :
1. Parsing du fichier (CSV/Excel/JSON)
2. Validation des donnees (types, formats, regles metier)
3. Normalisation des EAN (chaines, checksums)
4. Resolution des EAN manquants (file d'attente cross-DB)
5. Creation/mise a jour des produits et marques
6. Creation/mise a jour des produits fournisseur

### Etape 5 : Rapport

A la fin de l'import, un rapport detaille est genere :

- Nombre de lignes traitees, reussies, en erreur
- Detail des erreurs par ligne et par champ
- Statistiques de creation vs mise a jour
- Liste des EAN en attente de resolution

---

## Mapping Templates

Les templates de mapping sont des configurations reutilisables qui definissent :

- L'association entre colonnes source et champs cible
- Les regles de transformation (prix HT vers TTC, conversions)
- Les attributs calcules (colonnes derivees)
- Les regles de validation (champs obligatoires, formats)

Chaque utilisation d'un template incremente son compteur d'utilisation, permettant de trier par popularite.

---

## Gestion des Erreurs

### Types d'Erreurs

| Code | Description |
|------|-------------|
| `ean_missing` | EAN absent ou vide |
| `ean_checksum_invalid` | Checksum EAN incorrect |
| `ean_format_invalid` | Format EAN invalide |
| `ean_placeholder` | EAN generique detecte |
| `required_field_missing` | Champ obligatoire manquant |
| `field_format_invalid` | Format de champ invalide |
| `database_error` | Erreur de persistance |

### Erreurs Paginables

Les erreurs d'un job d'import sont accessibles via l'endpoint pagine `/{import_id}/errors` avec :

- Filtrage par type d'erreur
- Filtrage par champ
- Tri par numero de ligne
- Export des EAN invalides en CSV

### Archive et Nettoyage

Le systeme d'archive automatique permet de :

- Archiver les anciens jobs d'import
- Consulter les statistiques d'archive
- Executer des sessions de nettoyage manuellement

---

## Planification

Les imports automatises sont configures via les `ImportSchedule` :

- **Expression cron** : Planification flexible (ex : `0 6 * * *` pour chaque matin a 6h)
- **Intervalle en minutes** : Polling regulier (ex : toutes les 15 minutes)
- **Timezone** : Fuseau horaire configurable (defaut : Europe/Paris)
- **Retry automatique** : Nouvelle tentative en cas d'echec temporaire

---

## API Endpoints

### Endpoints Principaux

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/imports` | Liste paginee des jobs d'import |
| `GET` | `/api/v1/imports/templates` | Liste des templates de mapping |
| `GET` | `/api/v1/imports/recent` | Imports recents |
| `GET` | `/api/v1/imports/stats` | Statistiques d'import |
| `POST` | `/api/v1/imports/upload` | Upload d'un fichier |
| `POST` | `/api/v1/imports/upload-from-url` | Import depuis une URL |
| `POST` | `/api/v1/imports/import/ftp` | Import depuis FTP |
| `POST` | `/api/v1/imports/import/sftp` | Import depuis SFTP |
| `POST` | `/api/v1/imports/import/email` | Import depuis Email |
| `POST` | `/api/v1/imports/detect-format` | Detection automatique de format |

### Endpoints par Job

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/imports/{id}` | Detail d'un job |
| `GET` | `/api/v1/imports/{id}/errors` | Erreurs paginables |
| `GET` | `/api/v1/imports/{id}/report` | Rapport complet |
| `POST` | `/api/v1/imports/{id}/save-mapping` | Sauvegarder le mapping |
| `POST` | `/api/v1/imports/{id}/start-processing` | Lancer le traitement |
| `POST` | `/api/v1/imports/{id}/dry-run` | Lancer un dry run |
| `POST` | `/api/v1/imports/{id}/cancel` | Annuler un import |
| `POST` | `/api/v1/imports/{id}/retry` | Relancer un import echoue |
| `POST` | `/api/v1/imports/{id}/reanalyze` | Reanalyser un fichier |
| `DELETE` | `/api/v1/imports/{id}` | Supprimer un job |

### EAN Pending

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/imports/ean-pending` | Liste des EAN en attente |
| `DELETE` | `/api/v1/imports/ean-pending/{id}` | Supprimer une entree |
| `POST` | `/api/v1/imports/ean-pending/bulk-delete` | Suppression en masse |

---

## Base de Donnees

| Base | Tables | Contenu |
|------|--------|---------|
| `db_imports` | `import_jobs`, `import_configs`, `import_schedules`, `import_errors`, `import_logs`, `import_files` | Jobs, configs, planifications, erreurs |
| `db_catalog` | `products`, `suppliers`, `supplier_products`, `brands` | Donnees produit persistees |
| `db_suppliers` | `supplier_ean_resolutions` | File de resolution EAN |

---

## Prochaines Etapes

- [Fournisseurs](/docs/modules/suppliers) : Configurez vos fournisseurs et leurs connexions
- [Exports](/docs/modules/exports) : Exportez vos donnees dans differents formats
- [Completude](/docs/modules/completeness) : Mesurez la qualite des donnees importees
