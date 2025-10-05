---
title: Workflow d'Import
nextjs:
  metadata:
    title: Workflow d'Import - Products Manager APP
    description: Guide complet pour maîtriser les imports de produits depuis vos fournisseurs.
---

Maîtrisez le processus complet d'import de produits depuis vos fournisseurs : configuration, mapping, exécution, planification et gestion des erreurs. {% .lead %}

---

## Vue d'Ensemble du Processus

Le workflow d'import se déroule en **5 étapes clés** :

1. **Créer un fournisseur** et configurer la source de données
2. **Configurer le mapping** des colonnes
3. **Lancer un import manuel** pour valider la configuration
4. **Planifier des imports automatiques** (optionnel)
5. **Gérer les erreurs** et consulter les logs

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Permissions **User** ou supérieures
- Un **fichier fournisseur** (CSV, Excel) ou **accès FTP/API**
- La **structure du fichier** (liste des colonnes et leur signification)

{% callout type="note" %}
Les formats supportés : **CSV** (avec délimiteur configurable), **Excel** (.xlsx, .xls), **JSON** (via API), **XML**.
{% /callout %}

---

## Étape 1 : Créer un Fournisseur

### Via l'Interface Web

1. Allez dans **Fournisseurs** → **Nouveau Fournisseur**
2. Remplissez le formulaire :

#### Informations Générales

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom** | Nom du fournisseur | "Grossiste Tech XYZ" |
| **Email** | Contact email | contact@grossiste.com |
| **Téléphone** | Contact téléphone (optionnel) | +33 1 23 45 67 89 |

#### Type d'Import

Sélectionnez le type d'import selon votre source de données :

- **Upload manuel** : Uploadez un fichier depuis votre ordinateur
- **FTP/SFTP** : Récupération automatique depuis un serveur FTP
- **API REST** : Import depuis une API fournisseur
- **URL HTTP** : Téléchargement depuis une URL publique

### Configuration par Type

#### Upload Manuel (CSV/Excel)

```
Format : CSV ou Excel
Taille max : 50 MB
Encodage : UTF-8, ISO-8859-1, Windows-1252
Délimiteur CSV : ; (point-virgule), , (virgule), ou | (pipe)
```

#### FTP/SFTP

```
Hôte : ftp.fournisseur.com
Port : 21 (FTP) ou 22 (SFTP)
Utilisateur : votre_login
Mot de passe : ********
Chemin du fichier : /exports/products.csv
```

{% callout type="warning" %}
Pour SFTP, assurez-vous que le serveur Products Manager a accès au port 22 de votre serveur FTP.
{% /callout %}

#### API REST

```json
{
  "endpoint": "https://api.fournisseur.com/v1/products",
  "method": "GET",
  "auth_type": "bearer",
  "token": "YOUR_API_TOKEN",
  "headers": {
    "Accept": "application/json"
  }
}
```

---

## Étape 2 : Configurer le Mapping

Le **mapping** associe les colonnes de votre fichier fournisseur aux champs Products Manager.

### Accéder au Mapping

1. Dans la fiche du fournisseur, cliquez sur **Configuration Mapping**
2. Uploadez un **fichier d'exemple** pour détecter automatiquement les colonnes

### Champs Obligatoires

| Champ Products Manager | Description | Exemple Colonne Fournisseur |
|------------------------|-------------|------------------------------|
| **SKU** | Identifiant unique produit | `ref_produit`, `sku`, `reference` |
| **Nom** | Nom du produit | `nom`, `title`, `product_name` |
| **Prix HT** | Prix hors taxes | `prix_ht`, `price`, `cost` |

### Champs Optionnels

| Champ | Description | Exemple Colonne |
|-------|-------------|------------------|
| **Description** | Description longue | `description`, `desc` |
| **Stock** | Quantité disponible | `stock`, `quantity`, `qty` |
| **EAN** | Code-barres EAN13 | `ean`, `barcode`, `gtin` |
| **Prix TTC** | Prix toutes taxes comprises | `prix_ttc`, `price_with_tax` |
| **Catégorie** | Catégorie produit | `category`, `categorie` |
| **Marque** | Marque fabricant | `brand`, `marque`, `manufacturer` |
| **Image URL** | URL de l'image principale | `image`, `photo_url`, `img` |
| **Poids** | Poids en grammes | `weight`, `poids` |

### Exemple de Mapping

Votre fichier fournisseur :

```csv
ref;nom_article;tarif_ht;quantite;photo;ean13
PROD001;Clavier Mécanique RGB;89.90;150;https://cdn.example.com/img1.jpg;3760123456789
PROD002;Souris Sans Fil;29.90;300;https://cdn.example.com/img2.jpg;3760123456790
```

Configuration du mapping :

| Colonne Fournisseur | Champ Products Manager |
|---------------------|------------------------|
| ref | SKU |
| nom_article | Nom |
| tarif_ht | Prix HT |
| quantite | Stock |
| photo | Image URL |
| ean13 | EAN |

### Transformations Disponibles

Products Manager peut appliquer des transformations automatiques :

#### Conversion de Prix

```
Format fournisseur : "89,90€"
Transformation : Extraction numérique → 89.90
```

#### Nettoyage de Texte

```
Format fournisseur : "  Clavier RGB   "
Transformation : Trim et normalisation → "Clavier RGB"
```

#### Conversion d'Unités

```
Format fournisseur : "1.5kg"
Transformation : Conversion en grammes → 1500
```

---

## Étape 3 : Lancer un Import Manuel

### Premier Test

Avant de planifier des imports automatiques, testez avec un **import manuel** :

1. Allez dans **Imports** → **Nouvel Import**
2. Sélectionnez votre fournisseur
3. **Uploadez** votre fichier (si upload manuel)
4. Choisissez le **type d'import** :
   - **Full** : Remplace tous les produits du fournisseur
   - **Partial** : Ajoute/met à jour uniquement les produits présents dans le fichier

{% callout type="warning" %}
L'import **Full** supprimera les produits existants qui ne sont plus dans le nouveau fichier. Utilisez **Partial** pour conserver l'historique.
{% /callout %}

### Phases d'Exécution

L'import se déroule en **4 phases** :

#### Phase 1 : Upload et Validation (5-10 secondes)

- Upload du fichier sur le serveur
- Détection de l'encodage et du format
- Validation de la structure

#### Phase 2 : Parsing et Mapping (10-30 secondes)

- Lecture ligne par ligne
- Application du mapping configuré
- Validation des données (types, formats)

#### Phase 3 : Insertion en Base (30-60 secondes pour 5000 produits)

- Création/mise à jour des produits
- Insertion des images
- Mise à jour du stock

#### Phase 4 : Finalisation (5 secondes)

- Génération du rapport
- Envoi des notifications
- Nettoyage des fichiers temporaires

### Suivre la Progression

Pendant l'import, vous voyez en temps réel :

- **Barre de progression** (0-100%)
- **Nombre de produits traités** (ex: 2450/5000)
- **Temps écoulé** et **temps estimé restant**
- **Erreurs** rencontrées

---

## Étape 4 : Planifier des Imports Automatiques

Une fois validé, planifiez des imports récurrents.

### Configuration de la Planification

1. Dans la fiche fournisseur, allez dans **Planification**
2. Activez **Imports Automatiques**
3. Configurez la **fréquence** :

#### Options de Fréquence

| Fréquence | Description | Use Case |
|-----------|-------------|----------|
| **Toutes les heures** | Chaque heure à la minute 0 | Stock temps réel |
| **Quotidien** | Chaque jour à une heure fixe | Import journalier standard |
| **Hebdomadaire** | Un jour de la semaine spécifique | MAJ hebdo catalogue |
| **Mensuel** | Premier jour du mois | Import mensuel |
| **Personnalisé (Cron)** | Expression cron avancée | Cas spécifiques |

#### Exemples de Cron

```bash
# Tous les jours à 2h du matin
0 2 * * *

# Tous les lundis à 9h
0 9 * * 1

# Toutes les 6 heures
0 */6 * * *

# Premier jour du mois à minuit
0 0 1 * *
```

### Options Avancées

#### Retry en Cas d'Échec

```
Nombre de tentatives : 3
Délai entre tentatives : 15 minutes
```

#### Notifications

Cochez les événements pour lesquels vous souhaitez être notifié :

- Import terminé avec succès
- Import échoué
- Erreurs critiques (>10% des produits)
- Stock faible détecté

---

## Étape 5 : Gérer les Erreurs

### Consulter les Erreurs

Après un import, consultez le rapport d'erreurs :

1. Allez dans **Imports** → Sélectionnez l'import
2. Onglet **Erreurs**

### Types d'Erreurs Courants

#### 1. Erreurs de Validation

```
Ligne 42 : Le champ 'price' doit être un nombre positif (valeur : "-10.50")
```

**Solution** : Corrigez le fichier source ou ajoutez une transformation.

#### 2. SKU Dupliqué

```
Ligne 156 : SKU "PROD-001" déjà existant (ligne 12)
```

**Solution** : Assurez-vous que chaque SKU est unique dans le fichier.

#### 3. Image Inaccessible

```
Ligne 89 : Impossible de télécharger l'image "https://cdn.example.com/img404.jpg" (HTTP 404)
```

**Solution** : Vérifiez que les URLs d'images sont valides et accessibles.

#### 4. Champ Obligatoire Manquant

```
Ligne 203 : Le champ obligatoire 'name' est vide
```

**Solution** : Complétez le champ manquant ou marquez-le comme optionnel dans le mapping.

### Réimporter les Erreurs

Après correction, réimportez uniquement les lignes en erreur :

1. **Téléchargez** le fichier d'erreurs (CSV)
2. **Corrigez** les lignes problématiques
3. Créez un **nouvel import** avec le fichier corrigé (mode Partial)

---

## Consulter les Logs

### Accéder aux Logs

1. Dans la fiche d'un import, onglet **Logs**
2. Consultez les logs détaillés de l'exécution

### Niveaux de Log

| Niveau | Description | Exemple |
|--------|-------------|---------|
| **INFO** | Information générale | "Import started: 5000 products to process" |
| **WARNING** | Avertissement non bloquant | "Duplicate image URL detected" |
| **ERROR** | Erreur sur un produit | "Invalid EAN format for product PROD-123" |
| **CRITICAL** | Erreur bloquante | "Unable to connect to FTP server" |

### Rechercher dans les Logs

Utilisez la barre de recherche pour filtrer :

```
Search: "SKU-001"
→ Affiche tous les logs concernant le produit SKU-001

Search: "ERROR"
→ Affiche uniquement les erreurs
```

---

## Bonnes Pratiques

### 1. Tester avec un Petit Fichier

Avant d'importer 10 000 produits, testez avec **100 produits** pour valider le mapping.

### 2. Utiliser le Mode Partial par Défaut

Le mode **Partial** est plus sûr car il ne supprime pas les produits existants.

### 3. Planifier les Imports en Heures Creuses

Planifiez les gros imports la nuit (ex: 2h du matin) pour éviter la charge en journée.

### 4. Activer les Notifications d'Échec

Configurez les alertes email pour être prévenu immédiatement en cas d'erreur.

### 5. Valider les URLs d'Images

Assurez-vous que toutes les URLs d'images sont accessibles publiquement (pas de protection par mot de passe).

### 6. Normaliser les Données

Standardisez les formats dans vos fichiers fournisseurs :

- **Prix** : Format numérique (89.90 et non "89,90€")
- **Dates** : Format ISO 8601 (2025-10-05)
- **Booléens** : 1/0 ou true/false (pas "oui"/"non")

---

## Formats Supportés

### CSV

```csv
sku;name;price;stock
PROD001;Produit 1;29.90;100
PROD002;Produit 2;49.90;50
```

**Configuration** :
- Délimiteur : `;` (point-virgule)
- Encodage : UTF-8
- Ligne d'en-tête : Oui

### Excel (.xlsx)

Products Manager lit la **première feuille** du fichier Excel. Assurez-vous que :

- La première ligne contient les **noms de colonnes**
- Les données commencent à la **ligne 2**
- Pas de **cellules fusionnées** dans la zone de données

### JSON (via API)

```json
{
  "products": [
    {
      "sku": "PROD001",
      "name": "Produit 1",
      "price": 29.90,
      "stock": 100
    }
  ]
}
```

### XML

```xml
<products>
  <product>
    <sku>PROD001</sku>
    <name>Produit 1</name>
    <price>29.90</price>
    <stock>100</stock>
  </product>
</products>
```

---

## Cas d'Usage Avancés

### Import Multi-Fournisseurs

Si vous avez plusieurs fournisseurs, créez **un fournisseur par source** :

```
Fournisseur A → Import quotidien à 2h
Fournisseur B → Import toutes les 6h
Fournisseur C → Import hebdomadaire (lundi 9h)
```

### Import Incrémental

Pour les gros catalogues (>100 000 produits), utilisez des **imports partiels** :

- **Jour 1** : Import catégorie "Électronique"
- **Jour 2** : Import catégorie "Informatique"
- **Jour 3** : Import catégorie "Audio"

### Import avec Enrichissement IA

Activez l'enrichissement automatique après import :

1. **Paramètres** → **Enrichissement IA**
2. Cochez **"Enrichir automatiquement après import"**
3. Sélectionnez les champs à enrichir (description, titre SEO)

Voir : [Enrichissement IA](/docs/features/ai-enrichment)

---

## Troubleshooting

### L'import est bloqué à 0%

**Causes possibles** :
- Fichier trop volumineux (>50 MB)
- Serveur FTP inaccessible
- Format de fichier non supporté

**Solution** : Consultez les logs pour identifier la cause exacte.

### L'import échoue systématiquement

**Vérifiez** :
1. Le mapping est correct
2. Le fichier respecte le format attendu
3. Les URLs d'images sont accessibles
4. Les connexions FTP/API sont valides

### Les images ne s'affichent pas

**Vérifiez** :
1. Les URLs sont publiques (pas de 404)
2. Le format est supporté (JPG, PNG, WEBP)
3. Les URLs utilisent HTTPS (pas HTTP)

### Performance lente

Pour accélérer les imports :

1. Réduisez la taille des fichiers (max 10 000 produits par fichier)
2. Désactivez temporairement l'enrichissement IA
3. Planifiez les imports en heures creuses

---

## Statistiques d'Import

Après chaque import, consultez les statistiques :

```
✓ Total traité : 5000 produits
✓ Créés : 150 nouveaux produits
✓ Mis à jour : 4800 produits existants
✗ Erreurs : 50 produits (1%)

Durée : 2 min 15 sec
Débit : 37 produits/sec
```

---

## Prochaines Étapes

- [Utilisation du Dashboard](/docs/user-guides/dashboard-usage) - Exploiter les analytics
- [Enrichissement IA](/docs/features/ai-enrichment) - Améliorer vos fiches produits
- [API Endpoints](/docs/api/endpoints) - Automatiser via API
