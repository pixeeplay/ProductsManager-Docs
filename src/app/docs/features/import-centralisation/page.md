---
title: Centralisation des Imports
nextjs:
  metadata:
    title: Centralisation des Imports - Products Manager APP
    description: Centralisez tous vos flux fournisseurs dans une plateforme unique avec support multi-formats et planification automatique.
---

Gérez tous vos imports fournisseurs depuis une interface unique. Products Manager APP supporte les formats Excel, CSV, XML et JSON avec planification automatique et validation intelligente. {% .lead %}

---

## Vue d'Ensemble

La centralisation des imports est le point d'entrée de votre écosystème produits. Au lieu de jongler entre différents outils et processus manuels, Products Manager APP unifie tous vos flux fournisseurs dans une seule plateforme.

Que vos fournisseurs vous envoient des fichiers Excel par email, que vous récupériez des flux XML via FTP ou que vous consommiez des API REST, notre système centralise et normalise automatiquement toutes ces données.

---

## Fonctionnalités Principales

### Formats Supportés

Products Manager APP gère nativement les formats les plus utilisés dans le e-commerce :

- **Excel (.xlsx, .xls)** : Prise en charge complète incluant feuilles multiples et formules
- **CSV (.csv, .txt)** : Détection automatique des délimiteurs (virgule, point-virgule, tabulation)
- **XML** : Support des structures hiérarchiques complexes avec namespaces
- **JSON** : Import de flux API modernes avec validation de schéma

### Sources d'Import

Récupérez vos données depuis n'importe quelle source :

- **Upload manuel** : Glissez-déposez vos fichiers directement dans l'interface
- **FTP/SFTP** : Connexion sécurisée à vos serveurs fournisseurs
- **HTTP/HTTPS** : Téléchargement automatique depuis URLs publiques ou protégées
- **API REST** : Intégration native avec authentification OAuth 2.0 et API keys

### Planification Automatique

Configurez vos imports pour qu'ils s'exécutent sans intervention :

- **Quotidien** : Synchronisation chaque matin à l'heure de votre choix
- **Hebdomadaire** : Import le jour de la semaine défini
- **Temps réel** : Polling toutes les 15 minutes pour les flux critiques
- **Personnalisé** : Cron expressions pour des scénarios avancés

{% callout type="note" %}
Les imports planifiés s'exécutent automatiquement en arrière-plan. Vous recevez une notification par email en cas d'erreur ou de changement significatif du nombre de produits importés.
{% /callout %}

### Validation et Mapping

Assurez la qualité de vos données dès l'import :

- **Mapping colonnes** : Interface visuelle pour associer les colonnes fournisseurs à vos champs métier
- **Règles de validation** : Prix minimum/maximum, formats obligatoires, cohérence stock
- **Transformations** : Conversion d'unités, normalisation de formats, calculs automatiques
- **Dédoublonnage** : Détection intelligente des produits en double par référence ou EAN

### Gestion des Erreurs

Un système robuste pour gérer les anomalies :

- **Logs détaillés** : Chaque ligne importée est tracée avec son statut (succès, erreur, warning)
- **Retry automatique** : Nouvelle tentative après 5 minutes en cas d'échec temporaire
- **Mise en quarantaine** : Les produits avec erreurs sont isolés pour correction manuelle
- **Alertes intelligentes** : Notifications uniquement pour les erreurs critiques

---

## Comment ça Marche

### Étape 1 : Création d'une Source

Créez une nouvelle source d'import en définissant :
- Le nom et type de fournisseur
- Le format de fichier (Excel, CSV, XML, JSON)
- La méthode de récupération (upload, FTP, HTTP, API)

### Étape 2 : Configuration du Mapping

Associez les colonnes du fichier fournisseur aux champs Products Manager :
- Glissez-déposez les colonnes dans l'interface visuelle
- Appliquez des transformations si nécessaire (prix HT vers TTC, etc.)
- Définissez les champs obligatoires et règles de validation

### Étape 3 : Test et Validation

Lancez un import de test pour vérifier :
- La qualité du mapping
- Les règles de validation
- Le nombre de produits importés avec succès

### Étape 4 : Planification

Activez la planification automatique :
- Choisissez la fréquence (quotidien, hebdomadaire, temps réel)
- Définissez l'heure d'exécution
- Configurez les notifications

---

## Cas d'Usage

### E-commerçant Multi-Fournisseurs

**Contexte** : Boutique avec 15 fournisseurs envoyant des catalogues dans différents formats.

**Solution** :
- Configuration de 15 sources d'import différentes
- Mapping personnalisé pour chaque fournisseur
- Planification quotidienne à 6h du matin
- Consolidation automatique dans un catalogue unique

**Résultat** : Gain de 10h par semaine sur la gestion manuelle des catalogues.

### Distributeur avec Flux Temps Réel

**Contexte** : Marketplace nécessitant une mise à jour stock toutes les 15 minutes.

**Solution** :
- Import via API REST du fournisseur
- Polling automatique toutes les 15 minutes
- Synchronisation immédiate vers PrestaShop

**Résultat** : Réduction de 90% des ventes de produits en rupture.

### Dropshipper International

**Contexte** : 50+ fournisseurs avec catalogues en différentes langues.

**Solution** :
- Import centralisé de tous les flux fournisseurs
- Normalisation automatique des devises et unités
- Enrichissement IA pour traduction des descriptions

**Résultat** : Passage de 500 à 5000 références en 2 mois.

---

## Configuration

### Prérequis

- Un compte Products Manager APP actif
- Les identifiants de connexion à vos sources (FTP, API, etc.)
- Un fichier exemple de votre fournisseur

### Configuration Basique

1. Accédez à **Imports > Nouvelles Sources**
2. Cliquez sur **Créer une Source**
3. Remplissez les informations :
   - Nom de la source
   - Type de fournisseur
   - Format de fichier
4. Configurez la connexion (FTP, HTTP, API)
5. Testez la connexion

### Configuration Avancée

Pour les flux complexes, utilisez :
- **Filtres pré-import** : Excluez certains produits avant traitement
- **Règles de priorité** : Définissez quelle source est prioritaire en cas de conflit
- **Webhooks** : Recevez des notifications sur vos systèmes tiers
- **Scripts personnalisés** : Transformations JavaScript pour cas spécifiques

{% callout type="note" %}
Pour les flux XML complexes, notre équipe support peut vous aider à configurer le mapping initial. Contactez support@productsmanager.app avec un fichier exemple.
{% /callout %}

---

## Prochaines Étapes

- [Enrichissement IA](/docs/features/ai-enrichment) : Optimisez vos descriptions après import
- [EAN Manager](/docs/features/ean-manager) : Complétez automatiquement les codes-barres manquants
- [Guide de démarrage](/docs/getting-started) : Configurez votre première import
- [API Reference](/docs/api) : Intégrez vos systèmes via notre API REST
