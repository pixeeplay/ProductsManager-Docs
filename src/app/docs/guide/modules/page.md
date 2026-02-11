---
title: Configuration des Modules
nextjs:
  metadata:
    title: Configuration des Modules - Guide Utilisateur Products Manager APP
    description: "Activez, desactivez et configurez les modules de Products Manager APP selon vos besoins : fournisseurs, imports, exports, enrichissement IA, Price Monitor, categories et bien plus."
---

Products Manager APP est une plateforme modulaire : activez ou desactivez les fonctionnalites selon vos besoins pour adapter l'application a votre activite. {% .lead %}

---

## Vue d'Ensemble

L'architecture modulaire de Products Manager APP vous permet de n'utiliser que les fonctionnalites dont vous avez reellement besoin. Chaque module correspond a un ensemble coherent de fonctionnalites qui peut etre active ou desactive independamment.

L'activation d'un module ajoute ses ecrans dans la navigation, ses options dans les menus contextuels et ses fonctionnalites dans les workflows de l'application. La desactivation masque l'ensemble de ces elements sans supprimer les donnees associees.

---

## Acceder a la Configuration des Modules

Pour gerer les modules de votre organisation :

1. Rendez-vous dans **Parametres** depuis le menu lateral
2. Cliquez sur **Modules**
3. La liste des modules disponibles s'affiche avec leur statut actuel (actif ou inactif)

{% callout type="note" %}
L'acces a la configuration des modules est reserve aux utilisateurs disposant du role **Admin** ou **Super Admin**. Consultez la page [Utilisateurs et Roles](/docs/guide/administration) pour plus d'informations sur les permissions.
{% /callout %}

---

## Modules Disponibles

Products Manager APP propose les modules suivants, chacun apportant un ensemble de fonctionnalites dedies :

| Module | Description | Statut par defaut |
|--------|-------------|-------------------|
| **Fournisseurs** | Gestion des fournisseurs et des sources d'import. Permet de creer des fiches fournisseurs, configurer les connexions automatiques (FTP, SFTP, Email) et suivre les statistiques par fournisseur | Actif |
| **Imports** | Import de produits multi-format (CSV, Excel, XML, JSON). Inclut le mapping de colonnes, les regles de validation, le mode dry run et la planification des imports automatiques | Actif |
| **Exports** | Export et synchronisation des produits vers les plateformes e-commerce (Shopify, WooCommerce, PrestaShop, Amazon, Odoo). Configuration des templates d'export et planification | Actif |
| **Enrichissement IA** | Generation de contenu par intelligence artificielle : titres, descriptions, bullet points, traductions et optimisation SEO des fiches produits | Inactif |
| **Price Monitor** | Surveillance des prix concurrents sur les marketplaces et sites e-commerce. Alertes de variation de prix, historique et rapports comparatifs | Inactif |
| **Brand Manager** | Gestion centralisee des marques : fiches marques, logos, descriptions et association automatique aux produits du catalogue | Inactif |
| **Categories Manager** | Gestion hierarchique des categories produits avec arborescence multi-niveaux, mapping de categories fournisseurs et categories plateformes | Actif |
| **Search Engine** | Moteur de recherche avancee base sur Meilisearch. Recherche instantanee avec filtres a facettes, suggestions automatiques et tolerance aux fautes de frappe | Inactif |
| **Completude** | Score de completude des fiches produits. Definissez les champs obligatoires et recommandes, suivez le taux de remplissage de votre catalogue et identifiez les fiches a completer | Actif |
| **File Explorer** | Gestionnaire de fichiers et medias integre. Upload, organisation et association d'images, documents et fichiers aux produits du catalogue | Actif |

---

## Activer ou Desactiver un Module

### Activation

Pour activer un module :

1. Depuis la page **Parametres** puis **Modules**, reperer le module souhaite
2. Cliquez sur le bouton **Activer**
3. Confirmez l'activation dans la boite de dialogue

Une fois active, le module ajoute immediatement :

- Ses **sections dans la navigation** laterale
- Ses **options dans les menus** contextuels des produits et fournisseurs
- Ses **colonnes et filtres** dans les listes de produits
- Ses **parametres** dans la section Configuration

### Desactivation

Pour desactiver un module :

1. Cliquez sur le bouton **Desactiver** en face du module
2. Confirmez la desactivation

{% callout type="note" %}
La desactivation d'un module masque ses fonctionnalites dans l'interface mais **ne supprime pas les donnees** associees. Si vous reactivez le module ulterieurement, vous retrouverez l'ensemble de vos donnees et configurations.
{% /callout %}

---

## Configurer un Module

Chaque module dispose de ses propres parametres de configuration. Pour y acceder :

1. Depuis la page **Modules**, cliquez sur le nom du module ou sur l'icone **Configurer**
2. La page de parametres specifiques au module s'ouvre

Les parametres varient selon le module. Par exemple :

- **Enrichissement IA** : choix du fournisseur d'IA, langue par defaut, longueur des descriptions, ton redactionnel
- **Price Monitor** : frequence de surveillance, seuils d'alerte, marketplaces a surveiller
- **Completude** : definition des champs obligatoires, poids de chaque champ dans le score, seuils d'alerte
- **Search Engine** : configuration de l'indexation, champs recherchables, synonymes et stop words

---

## Dependances entre Modules

Certains modules dependent d'autres modules pour fonctionner correctement. Products Manager APP verifie automatiquement ces dependances lors de l'activation et de la desactivation.

### Exemples de Dependances

| Module | Depend de |
|--------|-----------|
| **Exports** | Les modules des plateformes cibles doivent etre actifs (ex : si vous exportez vers Shopify, le connecteur Shopify doit etre configure) |
| **Enrichissement IA** | Le module **Produits** doit etre actif (module de base, toujours actif) |
| **Price Monitor** | Le module **Produits** doit etre actif |
| **Completude** | Le module **Categories Manager** est recommande pour definir des regles de completude par categorie |

{% callout type="warning" %}
Si vous desactivez un module dont dependent d'autres modules actifs, Products Manager APP vous affichera un avertissement listant les modules impactes. Les fonctionnalites des modules dependants qui reposent sur le module desactive ne seront plus disponibles.
{% /callout %}

---

## Bonnes Pratiques

### Activer Uniquement les Modules Necessaires

Une interface epuree facilite la prise en main et le travail quotidien. N'activez que les modules dont votre equipe a reellement besoin. Vous pourrez toujours en activer de nouveaux par la suite.

### Tester Apres Activation

Apres l'activation d'un nouveau module, effectuez les verifications suivantes :

1. Verifiez que le module apparait correctement dans la navigation
2. Testez les fonctionnalites principales du module (creation, modification, consultation)
3. Controlez que les permissions sont correctement appliquees pour chaque role utilisateur
4. Si le module interagit avec d'autres modules, verifiez les integrations (ex : score de completude sur les fiches produits)

### Documenter la Configuration

Gardez une trace de la configuration de chaque module et des raisons de son activation ou desactivation. Cela facilite la maintenance et l'onboarding des nouveaux collaborateurs.

---

## Documentation Technique

Pour la documentation technique detaillee de l'architecture modulaire et du systeme de modules, consultez la page [Systeme de Modules](/docs/modules/module-system).

---

## Prochaines Etapes

- [Utilisateurs et Roles](/docs/guide/administration) : Configurez les permissions de votre equipe pour chaque module
- [Securite et Mot de Passe](/docs/guide/securite) : Securisez l'acces a votre organisation
- [Gestion des Produits](/docs/guide/produits) : Explorez les fonctionnalites du catalogue produits
- [Tour de l'Interface](/docs/guide/interface) : Decouvrez la navigation et les raccourcis clavier
