---
title: Workflow d'Export
nextjs:
  metadata:
    title: Workflow d'Export - Products Manager APP
    description: Guide complet pour exporter vos produits - formats CSV, Excel, JSON, destinations MinIO et S3, exports planifies.
---

Maitrisez l'export de vos produits vers differentes plateformes et destinations : formats multiples, destinations cloud et planification automatique. {% .lead %}

---

## Vue d'Ensemble

Products Manager permet d'exporter vos produits vers :

- **Fichiers locaux** : CSV, Excel, JSON
- **Stockage cloud** : MinIO, Amazon S3
- **Plateformes e-commerce** : Shopify, WooCommerce, PrestaShop, etc.

---

## Formats d'Export

### Formats Disponibles

| Format | Extension | Description | Use Case |
|--------|-----------|-------------|----------|
| **CSV** | `.csv` | Valeurs separees par virgules | Export universel, integration |
| **Excel** | `.xlsx` | Fichier Microsoft Excel | Analyse, partage equipe |
| **JSON** | `.json` | Format structure | Integration API, developpeurs |

### Caracteristiques par Format

#### CSV

```csv
ean;title;price;stock;brand;category
3760001234567;T-shirt bleu;29.99;150;MaMarque;Vetements/Hommes
3760001234568;Jean slim;59.99;80;MaMarque;Vetements/Hommes
```

**Avantages** :

- Format universel
- Leger et rapide
- Compatible avec tous les outils

**Options** :

- Separateur : virgule, point-virgule, tabulation
- Encodage : UTF-8, ISO-8859-1
- Guillemets : automatiques ou forces

#### Excel

**Avantages** :

- Mise en forme preservee
- Formules et filtres Excel
- Ideal pour analyse

**Options** :

- Nom de la feuille
- Entetes en gras
- Largeur des colonnes automatique

#### JSON

```json
{
  "products": [
    {
      "ean": "3760001234567",
      "title": "T-shirt bleu",
      "price": 29.99,
      "stock": 150,
      "brand": "MaMarque",
      "category": "Vetements/Hommes"
    }
  ]
}
```

**Avantages** :

- Structure hierarchique
- Integration API facile
- Types de donnees preserves

---

## Creer un Export

### Etape 1 : Acceder aux Exports

1. Cliquez sur **Exports** dans le menu
2. Cliquez sur **+ Nouvel export**

### Etape 2 : Selectionner les Produits

Plusieurs methodes de selection :

| Methode | Description |
|---------|-------------|
| **Tous les produits** | Exporte tout le catalogue |
| **Selection manuelle** | Cochez les produits souhaites |
| **Par filtres** | Categorie, fournisseur, statut... |
| **Par collection** | Collection sauvegardee |

#### Filtres Disponibles

- **Categorie** : Selection dans l'arborescence
- **Fournisseur** : Un ou plusieurs fournisseurs
- **Marque** : Texte libre ou liste
- **Statut** : Actif, Inactif, Archive
- **Stock** : En stock, Rupture
- **Date creation/modification** : Periode
- **Tags** : Selection multiple
- **has_asin** : Avec/sans ASIN Amazon
- **has_price** : Avec/sans prix defini

### Etape 3 : Choisir le Format

Selectionnez le format de sortie :

- **CSV** : Export standard
- **Excel** : Fichier .xlsx
- **JSON** : Format structure

### Etape 4 : Configurer le Mapping

Selectionnez les colonnes a exporter :

#### Champs Standards

| Champ | Description |
|-------|-------------|
| **EAN** | Code-barres EAN-13 |
| **SKU** | Reference interne |
| **Titre** | Nom du produit |
| **Description** | Description complete |
| **Prix** | Prix de vente |
| **Prix d'achat** | Cout |
| **Stock** | Quantite |
| **Marque** | Marque fabricant |
| **Categorie** | Chemin de categorie |
| **Poids** | Poids en kg |
| **Images** | URLs des images |

#### Colonnes Personnalisees

- Selectionnez les attributs personnalises
- Renommez les colonnes si necessaire
- Definissez l'ordre des colonnes

### Etape 5 : Lancer l'Export

1. Verifiez le resume :
   - Nombre de produits
   - Format selectionne
   - Colonnes configurees
2. Cliquez sur **Generer l'export**
3. Telechargez le fichier ou envoyez vers une destination

---

## Destinations d'Export

### Telechargement Direct

Par defaut, le fichier est telecharge dans votre navigateur.

### MinIO

MinIO est le stockage objet integre a Products Manager.

#### Configuration MinIO

1. Dans l'export, selectionnez **Destination** : MinIO
2. Configurez :

| Champ | Description |
|-------|-------------|
| **Bucket** | Nom du bucket de destination |
| **Chemin** | Dossier dans le bucket |
| **Nom du fichier** | Nom du fichier exporte |

#### Pattern de Nommage

Utilisez des variables dans le nom de fichier :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{date}` | Date du jour | `2025-12-06` |
| `{datetime}` | Date et heure | `2025-12-06_143215` |
| `{timestamp}` | Timestamp Unix | `1733496735` |
| `{format}` | Format du fichier | `csv`, `xlsx` |
| `{count}` | Nombre de produits | `1250` |

**Exemple** :

```text
Nom: export-{date}-{count}.{format}
Resultat: export-2025-12-06-1250.csv
```

### Amazon S3

Pour exporter vers Amazon S3 :

1. Selectionnez **Destination** : S3
2. Configurez :

| Champ | Description |
|-------|-------------|
| **Region** | Region AWS (eu-west-1, etc.) |
| **Bucket** | Nom du bucket S3 |
| **Access Key** | Cle d'acces AWS |
| **Secret Key** | Cle secrete AWS |
| **Chemin** | Prefix dans le bucket |

{% callout type="warning" %}
Utilisez des credentials IAM avec des permissions limitees au bucket specifique.
{% /callout %}

---

## Exports Planifies

### Configurer un Export Planifie

1. Apres avoir configure un export
2. Activez **Planifier cet export**
3. Configurez la planification :

### Options de Frequence

| Frequence | Description |
|-----------|-------------|
| **Quotidien** | Tous les jours a une heure fixe |
| **Hebdomadaire** | Jour et heure specifiques |
| **Mensuel** | Jour du mois |
| **Personnalise** | Expression CRON |

### Configuration Detaillee

| Champ | Options |
|-------|---------|
| **Heure** | 00:00 - 23:59 |
| **Jours** | Lun, Mar, Mer, Jeu, Ven, Sam, Dim |
| **Fuseau horaire** | Europe/Paris, etc. |

### Destination pour les Planifies

Les exports planifies necessitent une destination automatique :

- **MinIO** : Stockage interne
- **S3** : Amazon S3
- **Email** : Envoi en piece jointe (fichiers < 10 MB)
- **FTP/SFTP** : Upload vers un serveur

### Notifications

Configurez les alertes :

- [ ] Export reussi
- [ ] Export avec avertissements
- [ ] Export echoue

---

## Templates d'Export

### Creer un Template

1. Configurez un export complet
2. Cliquez sur **Sauvegarder comme template**
3. Nommez le template
4. Reutilisez-le pour les prochains exports

### Templates Predefinies

Products Manager fournit des templates optimises :

| Template | Description |
|----------|-------------|
| **Standard - CSV** | Tous les champs principaux |
| **Catalogue complet** | Tous les champs avec images |
| **Prix et stock** | Export minimal pour MAJ |
| **Shopify compatible** | Format natif Shopify |
| **WooCommerce compatible** | Format WooCommerce |

### Utiliser un Template

1. Lors d'un nouvel export
2. Cliquez sur **Charger un template**
3. Selectionnez le template
4. Ajustez si necessaire

---

## Export vers Plateformes E-commerce

### Plateformes Supportees

| Plateforme | Format | Specificites |
|------------|--------|--------------|
| **Shopify** | CSV | Format natif Shopify |
| **WooCommerce** | CSV/XML | Compatible plugin import |
| **PrestaShop** | CSV | Format standard PS |
| **Magento** | CSV | Compatible profiles |
| **Amazon** | Flat File | Seller Central format |
| **Odoo** | CSV/XML | Compatible import natif |

### Configuration Shopify

| Champ Shopify | Champ Products Manager |
|---------------|------------------------|
| Title | Titre |
| Body (HTML) | Description |
| Vendor | Marque |
| Product Category | Categorie |
| Variant SKU | SKU |
| Variant Barcode | EAN |
| Variant Price | Prix |
| Image Src | URL Image |

**Options Shopify** :

- [ ] Inclure les variantes
- [ ] Exporter les images
- [ ] Inclure le SEO (meta title, description)

### Configuration WooCommerce

| Champ WooCommerce | Champ Products Manager |
|-------------------|------------------------|
| post_title | Titre |
| post_content | Description |
| _sku | SKU |
| _regular_price | Prix |
| _stock | Stock |
| product_cat | Categorie |

**Options WooCommerce** :

- [ ] Format XML (plugin compatible)
- [ ] Inclure les attributs
- [ ] Exporter les images base64

### Configuration PrestaShop

| Champ PrestaShop | Champ Products Manager |
|------------------|------------------------|
| Name | Titre |
| Description | Description |
| Price | Prix |
| Reference | SKU |
| EAN13 | EAN |
| Quantity | Stock |

**Options PrestaShop** :

- [ ] Multi-langue (FR, EN, ES...)
- [ ] Prix HT / TTC
- [ ] Inclure les declinaisons

---

## Gestion des Images

### Options d'Export des Images

| Option | Description | Taille fichier |
|--------|-------------|----------------|
| **URLs** | Liens vers les images | Petit |
| **Base64** | Images encodees dans le fichier | Grand |
| **ZIP separe** | Archive des images | Variable |

### Optimisation

Pour les exports avec images :

- **Redimensionnement** : Max 2000x2000 px
- **Format** : JPEG (photos), PNG (logos)
- **Qualite** : 80% (bon compromis)

---

## Historique des Exports

### Consulter l'Historique

1. **Exports** dans le menu
2. Onglet **Historique**
3. Liste des exports avec :
   - Date et heure
   - Format
   - Nombre de produits
   - Destination
   - Statut

### Actions sur l'Historique

Pour chaque export :

- **Telecharger** : Recuperer le fichier (si encore disponible)
- **Re-executer** : Lancer le meme export avec les donnees actuelles
- **Voir les details** : Logs et statistiques

### Retention des Fichiers

| Type | Duree de retention |
|------|-------------------|
| **Telechargement direct** | 24 heures |
| **MinIO** | Selon votre configuration |
| **S3** | Selon votre configuration |

---

## Bonnes Pratiques

### Avant l'Export

1. **Verifiez les donnees** : Titres, descriptions completes
2. **Validez les images** : URLs accessibles
3. **Testez sur un echantillon** : 10-50 produits d'abord

### Pendant l'Export

1. **Planifiez en heures creuses** : Moins de charge serveur
2. **Evitez les exports simultanes** : Un a la fois
3. **Surveillez la progression** : Verifiez les erreurs

### Apres l'Export

1. **Verifiez le fichier** : Ouvrez-le avant import cible
2. **Testez l'import** : Sur la plateforme cible
3. **Conservez l'historique** : Pour reference

---

## Troubleshooting

### Certains produits ne sont pas exportes

**Causes possibles** :

- Produits inactifs ou archives
- Champs requis manquants
- Filtres trop restrictifs

**Solutions** :

1. Verifiez le statut des produits
2. Completez les champs obligatoires
3. Ajustez les filtres de selection

### Le fichier est rejete par la plateforme

**Causes possibles** :

- Format incorrect
- Encodage incompatible
- Champs manquants ou mal formates

**Solutions** :

1. Utilisez le template officiel de la plateforme
2. Verifiez l'encodage UTF-8
3. Consultez les erreurs de la plateforme

### Les images ne s'affichent pas

**Causes possibles** :

- URLs non accessibles
- Images trop volumineuses
- Format non supporte

**Solutions** :

1. Verifiez que les URLs sont publiques
2. Optimisez les images (moins de 2 MB)
3. Utilisez JPEG ou PNG

### Export vers MinIO/S3 echoue

**Causes possibles** :

- Credentials incorrects
- Bucket non existant
- Permissions insuffisantes

**Solutions** :

1. Verifiez les credentials
2. Creez le bucket si necessaire
3. Verifiez les permissions IAM

---

## Limites et Performance

### Limites par Export

| Metrique | Limite |
|----------|--------|
| Produits par export | 100,000 |
| Taille fichier CSV | 100 MB |
| Taille fichier Excel | 50 MB |
| Exports simultanes | 3 |

### Performance Estimee

| Nombre de produits | Duree estimee |
|--------------------|---------------|
| 1,000 | 10-30 secondes |
| 10,000 | 1-3 minutes |
| 50,000 | 5-15 minutes |
| 100,000 | 15-30 minutes |

{% callout type="note" %}
Les temps varient selon la complexite des donnees et le format choisi.
{% /callout %}

---

## API d'Export

### Lancer un Export via API

```bash
POST /api/v1/exports
Content-Type: application/json
Authorization: Bearer <token>

{
  "format": "csv",
  "filters": {
    "supplier_id": "uuid",
    "status": "active"
  },
  "columns": ["ean", "title", "price", "stock"],
  "destination": {
    "type": "minio",
    "bucket": "exports",
    "path": "daily/"
  }
}
```

### Consulter le Statut

```bash
GET /api/v1/exports/{export_id}
Authorization: Bearer <token>
```

### Telecharger le Fichier

```bash
GET /api/v1/exports/{export_id}/download
Authorization: Bearer <token>
```

---

## Prochaines Etapes

- [Gestion des Produits](/docs/user-guides/products) - Gerer votre catalogue
- [Workflow d'Import](/docs/user-guides/imports-workflow) - Importer vos produits
- [API Endpoints](/docs/api/endpoints) - Automatiser via API
