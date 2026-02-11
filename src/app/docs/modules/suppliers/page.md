---
title: Fournisseurs
nextjs:
  metadata:
    title: Fournisseurs - Products Manager APP
    description: Gestion complete des fournisseurs avec CRUD, produits fournisseurs, resolution EAN et automatisation des imports.
---

Centralisez la gestion de tous vos fournisseurs dans une interface unique. Creez, modifiez, suivez et associez vos fournisseurs a leurs imports automatises avec suivi des statistiques en temps reel. {% .lead %}

---

## Vue d'Ensemble

Le module **Fournisseurs** est le point de depart de votre chaine d'approvisionnement dans Products Manager APP. Il vous permet de gerer l'ensemble de vos fournisseurs, de leurs coordonnees jusqu'a la configuration de leurs imports automatises.

Chaque fournisseur est identifie par un **code unique** (ex : `SECOMP`, `LDLC`, `INGRAM`) et peut etre associe a une ou plusieurs configurations d'import (FTP, SFTP, Email, HTTP, MinIO, Google Drive).

Le module offre une vue unifiee combinant les donnees fournisseur (stockees dans `db_catalog`) avec les configurations d'import (stockees dans `db_imports`), permettant de gerer l'ensemble depuis un seul ecran.

---

## Fonctionnalites Principales

### CRUD Fournisseurs

Gerez le cycle de vie complet de vos fournisseurs :

- **Creation** : Nom, code unique, email de contact, telephone, adresse, pays (defaut : FR)
- **Modification** : Mise a jour partielle ou complete avec validation du code unique
- **Activation/Desactivation** : Desactivez un fournisseur sans perdre son historique
- **Suppression** : Suppression avec verification des dependances

Chaque fournisseur expose les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `name` | string | Nom commercial du fournisseur |
| `code` | string | Code unique (identifiant metier) |
| `contact_email` | string | Email de contact principal |
| `contact_phone` | string | Numero de telephone |
| `address` | string | Adresse postale |
| `country` | string | Code pays ISO (defaut : FR) |
| `is_active` | boolean | Statut actif/inactif |

### Recherche et Filtrage

L'API supporte une recherche avancee avec :

- **Recherche insensible aux accents** sur le nom du fournisseur (adapte au francais)
- **Recherche insensible a la casse** sur le code et l'email
- **Filtre par statut** : actif, inactif, ou tous
- **Pagination offset** : `?page=1&per_page=20` (par defaut)
- **Pagination curseur** : `?use_cursor=true&limit=100` (recommande pour les grands volumes)

{% callout type="note" title="Performance" %}
La pagination par curseur utilise la methode seek (WHERE + ORDER BY) qui est nettement plus performante que la pagination offset classique pour les grands jeux de donnees (plus de 10 000 fournisseurs).
{% /callout %}

### Vue Unifiee Fournisseur + Import

Le systeme propose un modele unifie qui combine en un seul appel :

- Les champs fournisseur de base (nom, code, contact)
- La configuration de connexion (FTP, SFTP, Email, HTTP, MinIO, Google Drive, Gmail)
- La planification des imports automatiques (cron, intervalle, timezone)
- Les parametres de fichier (format, encodage, delimiteur)

Les types de source supportes sont :

| Source | Description |
|--------|-------------|
| `manual` | Upload manuel de fichiers |
| `ftp` | Connexion FTP avec host, port, credentials, repertoire |
| `sftp` | Connexion SFTP securisee |
| `http` | Telechargement via URL avec authentification optionnelle |
| `email` | Recuperation via IMAP (pieces jointes) |
| `minio` | Lecture depuis le stockage objet MinIO |
| `google_drive` | Import depuis Google Drive |
| `gmail` | Import depuis pieces jointes Gmail |

### Statut d'Automatisation

Chaque fournisseur affiche un badge d'automatisation dans la liste, indiquant :

- **has_automation** : Le fournisseur a au moins une configuration d'import active
- **has_active_schedule** : Un planning d'import automatique est active
- **import_types** : Les types d'import configures (ex : ftp, email)
- **next_run_at** : Date et heure du prochain import planifie

Ces informations sont chargees en batch via des requetes cross-database optimisees pour eviter les problemes N+1.

---

## Statistiques et Metriques

### Statistiques Globales

L'endpoint `/stats` retourne un resume rapide :

- Nombre total de fournisseurs
- Nombre de fournisseurs actifs / inactifs
- Pourcentage d'integration API

### Metriques par Fournisseur

Dans la vue liste enrichie (`/list/with-automation`), chaque fournisseur affiche :

- **products_count** : Nombre de produits fournisseur (SupplierProduct)
- **success_rate** : Taux de reussite des imports (lignes reussies / lignes traitees)
- **last_import_at** : Date du dernier import reussi
- **last_import_type** : Type du dernier import (manual ou scheduled)

---

## Produits Fournisseur

Les produits fournisseur (`SupplierProduct`) font le lien entre un fournisseur et les produits du catalogue. Chaque SupplierProduct contient :

- La reference fournisseur (SKU fournisseur)
- Le prix d'achat (`cost_price`)
- Le stock fournisseur
- Les donnees brutes du dernier import

Cette architecture permet a un meme produit d'etre fourni par plusieurs fournisseurs avec des prix et stocks differents.

---

## Resolution EAN

Lorsqu'un import ne contient pas de code EAN valide, le systeme de resolution EAN entre en jeu :

1. **Calcul de hash** : Un identifiant unique est genere a partir du code fournisseur, nom produit et reference fabricant
2. **Verification de resolutions existantes** : Si ce hash a deja ete resolu, l'EAN est automatiquement applique
3. **File d'attente de resolution** : Les produits sans EAN sont places dans une file d'attente (`SupplierEanResolution` dans `db_suppliers`)
4. **Score de resolution** : Chaque entree recoit un score base sur la qualite des donnees disponibles

{% callout type="warning" title="EAN et integrite des donnees" %}
Les codes EAN sont systematiquement traites comme des chaines de caracteres (jamais des nombres flottants) pour eviter la perte de zeros en tete. Ce principe de defense en profondeur est applique a tous les niveaux : parseur, normalisation, API bulk.
{% /callout %}

---

## API Endpoints

### Endpoints Principaux

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/suppliers` | Liste paginee des fournisseurs |
| `GET` | `/api/v1/suppliers/active` | Liste des fournisseurs actifs (pour dropdowns) |
| `GET` | `/api/v1/suppliers/stats` | Statistiques globales |
| `GET` | `/api/v1/suppliers/stats/summary` | Resume des statistiques |
| `GET` | `/api/v1/suppliers/list/with-automation` | Liste avec badges d'automatisation |
| `GET` | `/api/v1/suppliers/{id}` | Detail d'un fournisseur (par UUID ou code) |
| `POST` | `/api/v1/suppliers` | Creer un fournisseur |
| `PUT` | `/api/v1/suppliers/{id}` | Modifier un fournisseur (unifie) |
| `DELETE` | `/api/v1/suppliers/{id}` | Supprimer un fournisseur |

### Permissions Requises

- **Lecture** : `READ_SUPPLIERS`
- **Ecriture** : `WRITE_SUPPLIERS`

### Rate Limiting

Les endpoints de lecture sont limites au tier `READ_STANDARD`. Les endpoints d'ecriture utilisent le tier `WRITE_STANDARD`.

---

## Cache et Performance

Les listes de fournisseurs sont mises en cache dans Redis pendant 5 minutes. Le cache est automatiquement invalide lors de :

- Creation d'un fournisseur
- Modification d'un fournisseur
- Suppression d'un fournisseur
- Import de produits pour un fournisseur

L'invalidation est geree par le service `cache_invalidation` avec les cles de pattern `catalog_suppliers_list:*`.

---

## Base de Donnees

Le module Fournisseurs utilise plusieurs bases de donnees :

| Base | Tables | Contenu |
|------|--------|---------|
| `db_catalog` | `suppliers`, `supplier_products` | Donnees fournisseur et produits associes |
| `db_imports` | `import_configs`, `import_schedules`, `import_jobs` | Configuration et historique des imports |
| `db_suppliers` | `supplier_ean_resolutions` | File de resolution EAN |

{% callout type="info" title="Architecture cross-database" %}
Les relations entre bases sont gerees par UUID (pas de cles etrangeres cross-DB). Le code fournisseur (supplier_code) sert de cle de jointure logique entre db_catalog et db_imports.
{% /callout %}

---

## Prochaines Etapes

- [Imports](/docs/modules/imports) : Configurez le pipeline d'import pour vos fournisseurs
- [Brand Manager](/docs/modules/brand-manager) : Harmonisez les marques issues de vos fournisseurs
- [Completude](/docs/modules/completeness) : Mesurez la qualite des donnees fournisseur
- [API Endpoints](/docs/api/endpoints) : Reference complete de l'API REST
