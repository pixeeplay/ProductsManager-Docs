---
title: Utilisateurs et Roles
nextjs:
  metadata:
    title: Utilisateurs et Roles - Guide Utilisateur Products Manager APP
    description: "Gerez les utilisateurs, les roles et les permissions de votre organisation dans Products Manager APP. Configurez les acces, consultez les logs d'activite et appliquez le principe du moindre privilege."
---

Gerez les utilisateurs, les roles et les permissions de votre organisation pour controler finement les acces a chaque fonctionnalite de Products Manager APP. {% .lead %}

---

## Vue d'Ensemble

La section Administration vous permet de gerer l'ensemble des utilisateurs de votre organisation, de leur attribuer des roles avec des permissions adaptees et de suivre l'activite de chacun grace aux logs detailles.

Depuis le menu **Parametres** puis **Utilisateurs et Roles**, les administrateurs peuvent :

- Inviter de nouveaux utilisateurs et leur attribuer un role
- Modifier les informations et les permissions des utilisateurs existants
- Creer des roles personnalises avec des permissions granulaires
- Consulter les logs d'activite de l'ensemble de l'organisation

---

## Acces a l'Administration

L'acces aux fonctionnalites d'administration depend du role de l'utilisateur connecte :

| Role | Acces Administration |
|------|---------------------|
| **Super Admin** | Acces complet a toutes les fonctionnalites d'administration, y compris la gestion de l'infrastructure et la configuration systeme |
| **Admin** | Acces partiel : gestion des utilisateurs, roles et parametres de l'organisation |
| **Manager** | Aucun acces aux fonctionnalites d'administration |
| **Editeur** | Aucun acces aux fonctionnalites d'administration |
| **Lecteur** | Aucun acces aux fonctionnalites d'administration |

{% callout type="warning" %}
Seuls les utilisateurs disposant du role **Super Admin** ou **Admin** peuvent acceder a la section Administration. Si vous ne voyez pas cette section dans votre menu, contactez un administrateur de votre organisation.
{% /callout %}

---

## Gestion des Utilisateurs

### Liste des Utilisateurs

L'ecran principal affiche la liste de tous les utilisateurs de votre organisation avec les informations suivantes : nom, email, role, date de derniere connexion et statut (actif ou desactive).

Utilisez la barre de recherche pour retrouver un utilisateur par son nom ou son adresse email.

### Inviter un Utilisateur

Pour inviter un nouvel utilisateur dans votre organisation :

1. Rendez-vous dans **Parametres** puis **Utilisateurs et Roles**
2. Cliquez sur le bouton **Inviter un utilisateur**
3. Renseignez les informations suivantes :

| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| Email | Adresse email du nouvel utilisateur | Oui |
| Nom | Nom complet de l'utilisateur | Oui |
| Role | Role a attribuer (Super Admin, Admin, Manager, Editeur, Lecteur) | Oui |
| Message | Message personnalise inclus dans l'email d'invitation | Non |

4. Cliquez sur **Envoyer l'invitation**

L'utilisateur recevra un email contenant un lien pour creer son mot de passe et acceder a l'application.

{% callout type="note" %}
L'invitation reste valide pendant 7 jours. Passe ce delai, vous devrez en envoyer une nouvelle depuis la liste des utilisateurs.
{% /callout %}

### Modifier un Utilisateur

Depuis la fiche d'un utilisateur, vous pouvez modifier :

- Son nom et ses coordonnees
- Son role au sein de l'organisation
- Ses permissions specifiques (si vous utilisez des roles personnalises)
- Son statut (actif ou desactive)

### Desactiver ou Supprimer un Utilisateur

- **Desactiver** : l'utilisateur ne peut plus se connecter, mais son historique et ses actions sont conserves. Cette option est recommandee pour les departs temporaires ou les changements de poste
- **Supprimer** : suppression definitive du compte utilisateur et de ses donnees de connexion. L'historique des actions reste attribue a l'utilisateur dans les logs

{% callout type="warning" %}
La suppression d'un compte utilisateur est irreversible. Privilegiez la desactivation si vous pensez que l'utilisateur pourrait avoir besoin de son acces a l'avenir.
{% /callout %}

---

## Roles par Defaut

Products Manager APP propose cinq roles par defaut, chacun avec un perimetre d'acces adapte :

| Role | Description |
|------|-------------|
| **Super Admin** | Acces total a l'application, y compris la gestion de l'infrastructure, la configuration des modules et la supervision de toutes les organisations |
| **Admin** | Gestion des utilisateurs, parametres de l'organisation, configuration des modules et acces a toutes les fonctionnalites metier |
| **Manager** | Toutes les operations CRUD sur les produits, fournisseurs et imports. Acces aux exports, aux analytics et aux outils avances |
| **Editeur** | Creation et modification des produits et des imports. Pas d'acces a la suppression ni aux parametres d'administration |
| **Lecteur** | Consultation seule de l'ensemble du catalogue, des fournisseurs et des rapports. Aucune action de creation, modification ou suppression |

### Tableau de Permissions par Module

Le tableau suivant detaille les permissions accordees a chaque role pour les principaux modules de l'application :

| Module | Lire | Creer | Modifier | Supprimer |
|--------|------|-------|----------|-----------|
| **Produits** | Lecteur et superieur | Editeur et superieur | Editeur et superieur | Manager et superieur |
| **Fournisseurs** | Lecteur et superieur | Manager et superieur | Manager et superieur | Admin et superieur |
| **Imports** | Lecteur et superieur | Editeur et superieur | Manager et superieur | Admin et superieur |
| **Exports** | Lecteur et superieur | Manager et superieur | Manager et superieur | Admin et superieur |
| **Analytics** | Lecteur et superieur | Manager et superieur | Admin et superieur | Admin et superieur |
| **Parametres** | Admin et superieur | Admin et superieur | Admin et superieur | Super Admin uniquement |

{% callout type="note" %}
La hierarchie des roles est la suivante : Lecteur < Editeur < Manager < Admin < Super Admin. Chaque role herite des permissions des roles inferieurs.
{% /callout %}

---

## Roles Personnalises

Si les roles par defaut ne correspondent pas exactement a votre organisation, vous pouvez creer des roles personnalises avec des permissions granulaires.

### Creer un Role Personnalise

1. Rendez-vous dans **Parametres** puis **Utilisateurs et Roles** puis **Roles**
2. Cliquez sur **Creer un role**
3. Definissez le nom et la description du role
4. Cochez les permissions souhaitees pour chaque module (Lire, Creer, Modifier, Supprimer)
5. Enregistrez le role

Le role personnalise est immediatement disponible lors de l'attribution de roles aux utilisateurs.

### Modifier ou Supprimer un Role Personnalise

Vous pouvez modifier les permissions d'un role personnalise a tout moment. Les modifications s'appliquent immediatement a tous les utilisateurs qui disposent de ce role.

La suppression d'un role personnalise n'est possible que si aucun utilisateur ne l'utilise. Reassignez d'abord les utilisateurs concernes vers un autre role.

---

## Logs d'Activite

Les logs d'activite enregistrent l'ensemble des actions effectuees dans votre organisation. Ils sont accessibles depuis **Parametres** puis **Logs d'activite**.

### Consultation des Logs

Chaque entree de log contient les informations suivantes :

- Date et heure de l'action
- Utilisateur ayant effectue l'action
- Type d'action (creation, modification, suppression, connexion, export, etc.)
- Module concerne
- Detail de l'action (identifiant de la ressource, anciennes et nouvelles valeurs)

### Filtres Disponibles

Utilisez les filtres pour retrouver des actions specifiques :

| Filtre | Description |
|--------|-------------|
| **Periode** | Definir une plage de dates (aujourd'hui, 7 derniers jours, 30 derniers jours, personnalise) |
| **Utilisateur** | Filtrer par un utilisateur specifique |
| **Type** | Filtrer par categorie de log |
| **Action** | Filtrer par type d'action (creation, modification, suppression) |

### Types de Logs

Les logs sont organises en six categories :

| Type | Description |
|------|-------------|
| **Authentification** | Connexions, deconnexions, tentatives echouees, changements de mot de passe |
| **Produits** | Creation, modification, suppression, enrichissement IA, modifications par lot |
| **Imports** | Lancement, completion, echec, modifications de mapping |
| **Exports** | Lancement, completion, echec, synchronisations |
| **Administration** | Gestion des utilisateurs, roles, permissions, configuration des modules |
| **Systeme** | Sauvegardes, mises a jour, maintenance, evenements techniques |

{% callout type="note" %}
Les logs d'activite sont conserves pendant 12 mois. Pour des besoins de conformite ou d'audit, vous pouvez exporter les logs au format CSV depuis la page de consultation.
{% /callout %}

---

## Bonnes Pratiques

### Principe du Moindre Privilege

Attribuez a chaque utilisateur uniquement les permissions dont il a besoin pour effectuer ses taches quotidiennes. Un operateur d'import n'a pas besoin d'un acces Admin.

### Securite des Comptes Administrateurs

- Activez la **double authentification (2FA)** pour tous les comptes Admin et Super Admin. Consultez la page [Securite et Mot de Passe](/docs/guide/securite) pour la configuration
- Limitez le nombre de comptes Super Admin au strict necessaire (idealement un ou deux par organisation)

### Revision Reguliere des Acces

- Passez en revue la liste des utilisateurs et leurs roles au moins une fois par trimestre
- Desactivez immediatement les comptes des collaborateurs ayant quitte l'organisation
- Verifiez que les roles personnalises correspondent toujours aux besoins de l'equipe

### Politique de Mots de Passe

- Imposez des mots de passe forts (minimum 8 caracteres, majuscule, chiffre et caractere special)
- Configurez une expiration periodique des mots de passe depuis les parametres de securite
- Formez vos equipes a ne jamais partager leurs identifiants de connexion

---

## Documentation Technique

Pour la documentation technique detaillee des permissions et de l'API d'administration, consultez la page [Permissions API](/docs/api/permissions).

---

## Prochaines Etapes

- [Securite et Mot de Passe](/docs/guide/securite) : Configurez la double authentification, les sessions et les tokens API
- [Configuration des Modules](/docs/guide/modules) : Activez et desactivez les modules selon vos besoins
- [Tour de l'Interface](/docs/guide/interface) : Decouvrez les elements de l'interface et la navigation
