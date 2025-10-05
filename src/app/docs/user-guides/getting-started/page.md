---
title: Guide de Démarrage
nextjs:
  metadata:
    title: Guide de Démarrage - Products Manager APP
    description: Guide complet pour démarrer avec Products Manager et maîtriser les fonctionnalités essentielles.
---

Bienvenue dans Products Manager APP. Ce guide vous accompagne pour comprendre l'interface, configurer votre espace de travail et réaliser vos premières actions. {% .lead %}

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Un **compte utilisateur actif** Products Manager APP
- Un **navigateur moderne** à jour (Chrome, Firefox, Safari, Edge)
- Une **connexion Internet stable**
- Des **identifiants de connexion** (email et mot de passe)

{% callout type="note" %}
Vous n'avez pas encore de compte ? Contactez **webmaster@pixeeplay.com** pour obtenir un accès ou une démo gratuite.
{% /callout %}

---

## Première Connexion

### 1. Accéder à l'Application

Rendez-vous sur l'URL de connexion :

```text
https://productsmanager.app/login
```

### 2. Se Connecter

1. Entrez votre **email professionnel**
2. Saisissez votre **mot de passe**
3. Cliquez sur **Se connecter**

{% callout type="warning" %}
Si vous avez oublié votre mot de passe, cliquez sur **Mot de passe oublié ?** pour recevoir un lien de réinitialisation par email.
{% /callout %}

### 3. Double Authentification (2FA)

Si votre organisation a activé la 2FA :

1. Entrez le **code à 6 chiffres** depuis votre application d'authentification (Google Authenticator, Authy, etc.)
2. Cochez **"Se souvenir de cet appareil"** pour ne pas redemander le code pendant 30 jours

---

## Interface Principale

Après connexion, vous arrivez sur le **Dashboard principal**.

### Navigation Principale

L'interface est organisée en plusieurs sections accessibles depuis la barre latérale :

| Section | Description |
|---------|-------------|
| **Dashboard** | Vue d'ensemble des métriques et activité récente |
| **Produits** | Catalogue complet de tous vos produits |
| **Fournisseurs** | Gestion des fournisseurs et configurations d'import |
| **Imports** | Historique et planification des imports |
| **Analytics** | Statistiques détaillées et rapports |
| **Paramètres** | Configuration de votre compte et préférences |

### Barre Supérieure

- **Recherche globale** : Recherchez rapidement un produit, fournisseur ou import
- **Notifications** : Consultez les alertes et événements importants
- **Profil utilisateur** : Accédez à vos paramètres, changez de langue, déconnexion

---

## Comprendre le Dashboard

Le **Dashboard** est votre point de départ quotidien.

### Widgets Principaux

#### 1. Statistiques Clés

Affiche en temps réel :

- **Total produits** : Nombre de produits dans votre catalogue
- **Fournisseurs actifs** : Nombre de fournisseurs configurés
- **Imports aujourd'hui** : Nombre d'imports exécutés dans les dernières 24h
- **Taux de succès** : Pourcentage d'imports réussis

#### 2. Activité Récente

Liste chronologique des dernières actions :

- Imports complétés ou en échec
- Produits créés/modifiés
- Alertes de stock
- Modifications de fournisseurs

#### 3. Graphiques de Tendances

Visualisez l'évolution de :

- **Imports par jour** (derniers 7 jours)
- **Produits ajoutés** (derniers 30 jours)
- **Performance par fournisseur**

{% callout type="note" %}
Vous pouvez personnaliser les widgets affichés dans **Paramètres** → **Préférences Dashboard**.
{% /callout %}

---

## Gestion des Produits

### Consulter le Catalogue

1. Allez dans **Produits** depuis le menu latéral
2. Utilisez les **filtres** pour affiner la vue :
   - Par fournisseur
   - Par statut (actif, inactif, brouillon)
   - Par catégorie
   - Par fourchette de prix

### Rechercher un Produit

Utilisez la barre de recherche pour trouver un produit par :

- **SKU** (référence unique)
- **Nom du produit**
- **Code EAN/UPC**
- **ASIN Amazon**

### Consulter une Fiche Produit

Cliquez sur un produit pour voir :

- **Informations générales** : SKU, nom, description, prix
- **Stock et disponibilité**
- **Images et médias**
- **Attributs** (couleur, taille, etc.)
- **Historique des modifications**
- **Fournisseur associé**

---

## Gestion des Fournisseurs

### Vue d'Ensemble

1. Allez dans **Fournisseurs**
2. Consultez la liste de tous vos fournisseurs configurés

### Détails d'un Fournisseur

Cliquez sur un fournisseur pour voir :

- **Informations de contact** (nom, email, téléphone)
- **Type d'import** (CSV, Excel, FTP, API)
- **Configuration de mapping** des colonnes
- **Historique des imports**
- **Nombre de produits associés**

---

## Historique des Imports

### Consulter les Imports

1. Allez dans **Imports**
2. Consultez l'historique de tous les imports exécutés

### Colonnes Affichées

| Colonne | Description |
|---------|-------------|
| **Date** | Date et heure de début de l'import |
| **Fournisseur** | Nom du fournisseur |
| **Type** | Full (complet) ou Partial (partiel) |
| **Statut** | Pending, Running, Completed, Failed |
| **Produits** | Nombre de produits traités |
| **Durée** | Temps d'exécution total |

### Filtrer les Imports

Utilisez les filtres pour affiner la vue :

- **Par statut** : Voir uniquement les imports réussis ou échoués
- **Par fournisseur** : Voir les imports d'un fournisseur spécifique
- **Par période** : Dernière semaine, dernier mois, période personnalisée

### Consulter les Détails d'un Import

Cliquez sur un import pour voir :

1. **Résumé** : Statistiques globales (créés, mis à jour, erreurs)
2. **Logs** : Détails techniques de l'exécution
3. **Erreurs** : Liste des erreurs rencontrées avec explications
4. **Fichier source** : Lien de téléchargement du fichier importé

---

## Notifications et Alertes

### Types de Notifications

Products Manager vous alerte automatiquement pour :

- **Import terminé** : Confirmation d'un import réussi
- **Import échoué** : Alerte en cas d'erreur
- **Stock faible** : Produit sous le seuil de stock minimum
- **Nouveau fournisseur** : Ajout d'un nouveau fournisseur par votre équipe
- **Mises à jour système** : Nouvelles fonctionnalités ou maintenance planifiée

### Gérer les Notifications

1. Cliquez sur l'**icône cloche** dans la barre supérieure
2. Consultez vos notifications récentes
3. Marquez comme lues ou supprimez-les
4. Configurez vos préférences dans **Paramètres** → **Notifications**

---

## Recherche Globale

La **barre de recherche** en haut de l'écran permet de trouver rapidement n'importe quelle ressource.

### Ce que Vous Pouvez Rechercher

- **Produits** : Par SKU, nom, EAN, ASIN
- **Fournisseurs** : Par nom
- **Imports** : Par ID de job
- **Utilisateurs** : Par nom ou email (admin uniquement)

### Raccourci Clavier

Appuyez sur **Ctrl + K** (Windows/Linux) ou **Cmd + K** (Mac) pour ouvrir instantanément la recherche.

---

## Personnalisation

### Préférences Utilisateur

Dans **Paramètres** → **Préférences**, configurez :

- **Langue** : Français, Anglais, Espagnol
- **Fuseau horaire** : Pour afficher les dates/heures correctement
- **Format de date** : JJ/MM/AAAA ou MM/JJ/AAAA
- **Devise** : EUR, USD, GBP, etc.

### Thème d'Affichage

Choisissez entre :

- **Thème clair** (par défaut)
- **Thème sombre** (confort visuel en environnement peu éclairé)
- **Automatique** (suit les préférences système)

---

## Premiers Pas Recommandés

Après avoir exploré l'interface, voici les étapes recommandées pour bien démarrer :

### 1. Configurer Votre Premier Fournisseur

Allez dans **Fournisseurs** → **Nouveau Fournisseur** et suivez l'assistant de configuration.

Voir : [Workflow d'Import](/docs/user-guides/import-workflow)

### 2. Lancer Votre Premier Import

Testez un import manuel avec un fichier contenant quelques produits pour valider la configuration.

### 3. Explorer le Dashboard

Familiarisez-vous avec les métriques et graphiques disponibles.

Voir : [Utilisation du Dashboard](/docs/user-guides/dashboard-usage)

### 4. Configurer les Notifications

Activez les alertes email pour être informé des événements importants.

---

## Rôles et Permissions

Selon votre rôle, certaines fonctionnalités peuvent être limitées :

| Rôle | Permissions |
|------|-------------|
| **Viewer** | Lecture seule (consultation du catalogue et des imports) |
| **User** | Lecture + création/modification de ses propres imports |
| **Manager** | Toutes opérations CRUD sur produits, fournisseurs, imports |
| **Admin** | Toutes permissions + gestion des utilisateurs et paramètres système |

{% callout type="note" %}
Contactez votre administrateur si vous avez besoin de permissions supplémentaires.
{% /callout %}

---

## Raccourcis Clavier Utiles

| Raccourci | Action |
|-----------|--------|
| **Ctrl/Cmd + K** | Ouvrir la recherche globale |
| **Ctrl/Cmd + S** | Sauvegarder (dans les formulaires) |
| **Esc** | Fermer les modales |
| **?** | Afficher l'aide contextuelle |

---

## Besoin d'Aide ?

### Documentation

- [Installation](/docs/getting-started/installation) - Déployer Products Manager en local
- [Workflow d'Import](/docs/user-guides/import-workflow) - Maîtriser les imports
- [Dashboard Usage](/docs/user-guides/dashboard-usage) - Exploiter les analytics

### Support Technique

- **Email** : webmaster@pixeeplay.com
- **Documentation** : [docs.productsmanager.app](https://docs.productsmanager.app)
- **GitHub Issues** : [Signaler un bug](https://github.com/pixeeplay/Suppliers-Import/issues)

### Formation et Tutoriels

Des vidéos et tutoriels interactifs sont disponibles dans **Aide** → **Tutoriels** depuis l'interface.

---

## Prochaines Étapes

Maintenant que vous maîtrisez l'interface, passez aux guides avancés :

- [Workflow d'Import Complet](/docs/user-guides/import-workflow)
- [Utilisation Avancée du Dashboard](/docs/user-guides/dashboard-usage)
- [Enrichissement IA](/docs/features/ai-enrichment)
- [Intégrations E-commerce](/docs/integrations/shopify)
