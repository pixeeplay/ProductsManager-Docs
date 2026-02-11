---
title: Tour de l'Interface
nextjs:
  metadata:
    title: Tour de l'Interface - Guide Utilisateur Products Manager APP
    description: "Decouvrez les principaux elements de l'interface de Products Manager APP : navigation, dashboard, liste produits et raccourcis clavier."
---

Familiarisez-vous avec l'interface de Products Manager APP pour naviguer efficacement et tirer le meilleur parti de chaque fonctionnalite. {% .lead %}

---

## Structure Generale

L'interface de Products Manager APP est organisee en trois zones principales :

- **Barre superieure (header)** : recherche globale, notifications et menu utilisateur
- **Barre laterale (sidebar)** : navigation principale vers toutes les sections de l'application
- **Zone de contenu** : zone centrale qui affiche la page active (dashboard, liste produits, formulaires, etc.)

Cette disposition reste constante sur toutes les pages, ce qui vous permet de toujours acceder rapidement a la navigation et a la recherche, quel que soit l'ecran sur lequel vous vous trouvez.

---

## Navigation Principale

La barre laterale regroupe l'ensemble des sections accessibles de l'application. Les sections visibles dependent des modules actives et de vos permissions utilisateur.

| Section | Description | Acces |
|---------|-------------|-------|
| **Dashboard** | Vue d'ensemble des metriques, activite recente et graphiques de tendances | Tous les utilisateurs |
| **Produits** | Catalogue complet avec filtres, recherche, edition unitaire et par lot | Tous les utilisateurs |
| **Fournisseurs** | Liste des fournisseurs, configuration du mapping et parametres d'import | User, Manager, Admin |
| **Imports** | Historique des imports, lancement manuel, planification automatique | User, Manager, Admin |
| **Exports** | Configuration et historique des exports vers les plateformes e-commerce | User, Manager, Admin |
| **Analytics** | Statistiques detaillees, rapports d'activite et indicateurs de performance | Manager, Admin |
| **Parametres** | Preferences utilisateur, gestion des modules, configuration systeme | Variable selon le role |

{% callout type="note" %}
Si une section n'apparait pas dans votre menu, il est possible que le module correspondant soit desactive ou que votre role ne dispose pas des permissions necessaires. Contactez votre administrateur pour en savoir plus.
{% /callout %}

---

## Barre Superieure

La barre superieure est presente sur toutes les pages et offre trois fonctionnalites essentielles :

### Recherche Globale

Le champ de recherche permet de trouver rapidement n'importe quelle ressource dans l'application :

- **Produits** : par SKU, nom, code EAN ou ASIN
- **Fournisseurs** : par nom
- **Imports** : par identifiant de job
- **Utilisateurs** : par nom ou email (administrateurs uniquement)

La recherche s'ouvre egalement avec le raccourci clavier **Ctrl + K** (ou **Cmd + K** sur Mac).

### Notifications

L'icone de notifications affiche les alertes et evenements recents :

- Imports termines ou en echec
- Alertes de stock faible
- Mises a jour systeme et maintenance planifiee
- Actions d'equipe (nouveaux fournisseurs, modifications de configuration)

Cliquez sur une notification pour acceder directement a l'element concerne. Configurez vos preferences de notification dans **Parametres** puis **Notifications**.

### Menu Profil Utilisateur

Le menu profil donne acces a :

- Vos **informations de compte** et parametres personnels
- Le **choix de la langue** (Francais, Anglais, Espagnol)
- Le **basculement de theme** (clair, sombre, automatique)
- La **deconnexion** de l'application

---

## Tableau de Bord (Dashboard)

Le dashboard est la page d'accueil de l'application et offre une vision globale de votre activite.

### Widgets de Statistiques

Quatre cartes en haut du dashboard affichent les indicateurs cles en temps reel :

| Widget | Donnee affichee |
|--------|-----------------|
| **Total Produits** | Nombre de produits dans le catalogue |
| **Fournisseurs Actifs** | Nombre de fournisseurs configures |
| **Imports Aujourd'hui** | Nombre d'imports executes en 24 heures |
| **Taux de Reussite** | Pourcentage d'imports sans erreur |

### Fil d'Activite

Un historique chronologique des dernieres actions effectuees sur la plateforme : imports, creations de produits, modifications de fournisseurs et alertes systeme.

### Graphiques

Des visualisations interactives montrent l'evolution de votre activite :

- **Imports par jour** sur les 7 derniers jours
- **Produits ajoutes** sur les 30 derniers jours
- **Repartition par fournisseur** avec volumes et taux de reussite

{% callout type="note" %}
Les widgets affiches sur le dashboard peuvent etre personnalises dans **Parametres** puis **Preferences Dashboard**. Vous pouvez reorganiser, masquer ou afficher les widgets selon vos besoins.
{% /callout %}

Pour une documentation complete du dashboard, consultez la page [Tableau de Bord](/docs/guide/tableau-de-bord).

---

## Vue Liste des Produits

La page **Produits** constitue le coeur de l'application. Elle affiche votre catalogue sous forme de tableau avec de nombreuses options d'interaction.

### Fonctionnalites de la Liste

- **Filtres avances** : filtrez par fournisseur, statut (actif, inactif, brouillon), categorie, fourchette de prix, marque ou score de completude
- **Tri** : cliquez sur l'en-tete d'une colonne pour trier par SKU, nom, prix, stock ou date de modification
- **Recherche rapide** : un champ de recherche dedie permet de filtrer la liste en temps reel
- **Selection multiple** : cochez plusieurs produits pour appliquer des actions groupees (modification par lot, export, enrichissement IA, suppression)
- **Colonnes configurables** : choisissez les colonnes visibles selon vos besoins
- **Pagination** : navigation par page avec choix du nombre d'elements affiches (25, 50, 100)

### Fiche Produit

Cliquez sur un produit pour acceder a sa fiche detaillee, qui regroupe :

- Informations generales (SKU, titre, description, prix)
- Stock et disponibilite
- Images et medias
- Attributs et variantes
- Historique des modifications
- Fournisseur associe et donnees d'import

---

## Theme Clair et Sombre

Products Manager APP propose trois modes d'affichage pour s'adapter a vos preferences visuelles et a votre environnement de travail :

- **Theme clair** : fond blanc, ideal pour un environnement bien eclaire (mode par defaut)
- **Theme sombre** : fond fonce, recommande pour reduire la fatigue visuelle en environnement peu eclaire
- **Mode automatique** : bascule automatiquement entre clair et sombre selon les preferences de votre systeme d'exploitation

Pour changer de theme, accedez au **menu profil** dans la barre superieure ou allez dans **Parametres** puis **Preferences** puis **Theme d'affichage**.

---

## Raccourcis Clavier

Products Manager APP offre des raccourcis clavier pour accelerer les actions courantes :

| Raccourci | Action |
|-----------|--------|
| **Ctrl + K** (Cmd + K sur Mac) | Ouvrir la recherche globale |
| **Ctrl + S** (Cmd + S sur Mac) | Sauvegarder le formulaire en cours |
| **Esc** | Fermer la modale ou le panneau actif |
| **?** | Afficher l'aide contextuelle et la liste des raccourcis |
| **Ctrl + N** (Cmd + N sur Mac) | Creer un nouvel element (produit, fournisseur, import) |
| **Fleches haut/bas** | Naviguer dans les listes et resultats de recherche |
| **Entree** | Valider la selection dans la recherche ou un formulaire |

{% callout type="note" %}
La combinaison **?** affiche une fenetre recapitulative de tous les raccourcis disponibles sur la page en cours. N'hesitez pas a l'utiliser pour decouvrir les raccourcis specifiques a chaque section.
{% /callout %}

---

## Affichage Responsive et Mobile

L'interface de Products Manager APP s'adapte a differentes tailles d'ecran :

### Sur Tablette

- La barre laterale se replie automatiquement pour maximiser l'espace de contenu
- Un bouton hamburger permet de l'afficher ou de la masquer a tout moment
- Les tableaux s'adaptent avec un defilement horizontal si necessaire

### Sur Mobile

- La navigation passe en mode plein ecran avec un menu deroulant
- Les widgets du dashboard s'empilent verticalement
- Les formulaires s'adaptent a la largeur de l'ecran
- La recherche globale reste accessible via le bouton dedie dans la barre superieure

{% callout type="warning" %}
L'experience complete de Products Manager APP est optimisee pour les ecrans de bureau et tablette. Certaines fonctionnalites avancees (edition par lot, configuration de mapping) sont plus confortables a utiliser sur un ecran large.
{% /callout %}

---

## Prochaines Etapes

Maintenant que vous connaissez l'interface, passez a l'action :

- [Gestion des Produits](/docs/guide/produits) -- Explorez les fonctionnalites avancees du catalogue
- [Gestion des Fournisseurs](/docs/guide/fournisseurs) -- Configurez vos premiers fournisseurs
- [Importer des Produits](/docs/guide/imports) -- Lancez vos imports de catalogues fournisseurs
- [Tableau de Bord](/docs/guide/tableau-de-bord) -- Exploitez les statistiques et graphiques en detail
- [Configuration des Modules](/docs/guide/modules) -- Activez et configurez les modules selon vos besoins
