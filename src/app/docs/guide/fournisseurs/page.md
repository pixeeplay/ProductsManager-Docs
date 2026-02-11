---
title: Gestion des Fournisseurs
nextjs:
  metadata:
    title: Gestion des Fournisseurs - Guide Utilisateur Products Manager APP
    description: "Creez, organisez et gerez vos fournisseurs dans Products Manager APP. Associez des produits, configurez les imports automatiques et suivez les statistiques de chaque fournisseur."
---

Centralisez la gestion de vos fournisseurs pour organiser vos approvisionnements, automatiser vos imports et suivre les performances de chaque source de donnees. {% .lead %}

---

## Vue d'Ensemble

Les fournisseurs sont au coeur de votre chaine d'approvisionnement dans Products Manager APP. Chaque fournisseur represente une source de donnees produits que vous pouvez configurer, suivre et automatiser independamment.

Depuis l'ecran **Fournisseurs**, accessible via le menu lateral, vous pouvez :

- Creer et modifier vos fiches fournisseurs avec toutes leurs coordonnees
- Associer des produits a chaque fournisseur
- Configurer des imports automatiques (FTP, SFTP, Email, Webhook)
- Consulter l'historique des imports et les statistiques de performance

---

## Structure d'un Fournisseur

### Informations Principales

Chaque fiche fournisseur contient les informations de base suivantes :

| Champ | Description |
|-------|-------------|
| Nom | Nom commercial du fournisseur |
| Code | Identifiant unique (ex : `SECOMP`, `LDLC`, `INGRAM`) |
| Email | Adresse email de contact principal |
| Telephone | Numero de telephone du contact |
| Site web | URL du site du fournisseur |
| Adresse | Adresse postale complete |
| Pays | Pays du fournisseur (defaut : France) |
| Notes | Commentaires internes libres |

{% callout type="note" %}
Le **code fournisseur** est unique dans toute l'application. Il sert d'identifiant metier pour relier le fournisseur a ses imports et a ses produits. Choisissez un code court et parlant, par exemple le nom abrege du fournisseur en majuscules.
{% /callout %}

### Informations Commerciales

En complement des coordonnees, vous pouvez renseigner les donnees commerciales :

| Champ | Description |
|-------|-------------|
| Delai de livraison | Nombre de jours moyen pour recevoir une commande |
| Commande minimum | Montant ou quantite minimum de commande |
| Devise | Devise utilisee pour les prix d'achat (EUR, USD, GBP, etc.) |
| Conditions de paiement | Conditions negociees (ex : 30 jours fin de mois) |
| Remise | Pourcentage de remise negocie |

---

## Creer un Fournisseur

### Creation Manuelle

Pour creer un fournisseur depuis l'interface :

1. Rendez-vous dans **Fournisseurs** depuis le menu lateral
2. Cliquez sur le bouton **Ajouter un fournisseur**
3. Remplissez les champs obligatoires : **Nom** et **Code**
4. Completez les informations de contact et les donnees commerciales selon vos besoins
5. Cliquez sur **Enregistrer**

Le fournisseur est immediatement disponible pour recevoir des imports et etre associe a des produits.

### Creation Lors d'un Import

Lorsque vous lancez un import et que le fournisseur n'existe pas encore, Products Manager APP vous propose de le creer directement depuis l'ecran d'import. Renseignez au minimum le nom et le code, puis poursuivez votre import sans quitter le workflow.

---

## Gerer les Fournisseurs

### Liste des Fournisseurs

L'ecran principal affiche la liste de tous vos fournisseurs avec les colonnes suivantes : nom, code, nombre de produits, dernier import et statut d'automatisation.

### Filtres Disponibles

Utilisez les filtres pour retrouver rapidement un fournisseur :

| Filtre | Description |
|--------|-------------|
| Statut | Afficher les fournisseurs actifs, inactifs ou tous |
| Pays | Filtrer par pays d'origine |
| Nombre de produits | Trier par volume de produits associes |
| Dernier import | Trier par date du dernier import recu |

La barre de recherche permet egalement de trouver un fournisseur par son nom, son code ou son email de contact.

---

## Actions Disponibles

Depuis la liste ou la fiche d'un fournisseur, vous disposez des actions suivantes :

| Action | Description |
|--------|-------------|
| **Voir** | Ouvrir la fiche complete du fournisseur avec ses produits et son historique |
| **Modifier** | Editer les informations du fournisseur |
| **Dupliquer** | Creer un nouveau fournisseur a partir d'un existant (pratique pour des filiales) |
| **Archiver** | Desactiver le fournisseur sans supprimer ses donnees ni son historique |
| **Supprimer** | Supprimer definitivement le fournisseur (uniquement s'il n'a plus de produits associes) |

{% callout type="warning" %}
La suppression d'un fournisseur est irreversible. Si vous souhaitez simplement suspendre les imports d'un fournisseur, preferez l'action **Archiver** qui conserve l'integralite de l'historique.
{% /callout %}

---

## Associer des Produits

Trois methodes permettent d'associer des produits a un fournisseur :

### Via la Fiche Fournisseur

Depuis l'onglet **Produits** de la fiche fournisseur, vous pouvez rechercher et ajouter manuellement des produits existants du catalogue. Cette methode est adaptee pour des ajouts ponctuels.

### Via la Fiche Produit

Depuis la fiche d'un produit, dans la section **Fournisseurs**, ajoutez un ou plusieurs fournisseurs avec leur reference fournisseur, leur prix d'achat et leur stock. Un meme produit peut etre associe a plusieurs fournisseurs.

### Via Import avec Colonne Fournisseur

Lors d'un import de fichier, les produits sont automatiquement associes au fournisseur selectionne. C'est la methode la plus courante et la plus efficace pour gerer de grands volumes.

---

## Import Automatique

### Configurer les Sources

Products Manager APP supporte plusieurs sources d'import automatique pour chaque fournisseur :

| Source | Description |
|--------|-------------|
| **Email** | Recuperation automatique des fichiers en piece jointe via IMAP. Configurez l'adresse email a surveiller et les filtres de sujet. |
| **FTP / SFTP** | Connexion a un serveur FTP ou SFTP du fournisseur. Renseignez l'hote, le port, les identifiants et le repertoire distant. |
| **Webhook / URL** | Telechargement automatique depuis une URL HTTP. Optionnellement protege par authentification (Basic, Bearer). |

### Planification

Configurez la frequence d'execution des imports automatiques :

| Frequence | Exemple |
|-----------|---------|
| Quotidien | Chaque jour a 6h du matin |
| Hebdomadaire | Chaque lundi a 8h |
| Mensuel | Le 1er de chaque mois a 7h |
| Expression CRON | `0 */4 * * *` (toutes les 4 heures) |

Le fuseau horaire est configurable (par defaut : Europe/Paris). En cas d'echec, le systeme effectue automatiquement une nouvelle tentative.

### Mapping par Defaut

Pour chaque source d'import automatique, vous pouvez definir un **template de mapping par defaut**. Ce template sera applique automatiquement a chaque nouveau fichier recu, sans intervention manuelle. Consultez la page [Importer des Produits](/docs/guide/imports) pour les details du mapping.

---

## Historique des Imports

L'onglet **Historique** de la fiche fournisseur affiche la liste chronologique de tous les imports recus :

- Date et heure de l'import
- Type d'import (manuel ou automatique)
- Nombre de lignes traitees, reussies et en erreur
- Statut final (termine, en erreur, annule)
- Acces au rapport detaille de chaque import

Cet historique vous permet de suivre la regularite et la qualite des donnees recues de chaque fournisseur.

---

## Statistiques Fournisseur

Chaque fiche fournisseur affiche un tableau de bord avec les indicateurs suivants :

| Indicateur | Description |
|------------|-------------|
| **Total produits** | Nombre total de produits associes au fournisseur |
| **Produits actifs** | Nombre de produits actifs dans le catalogue |
| **Produits inactifs** | Nombre de produits desactives ou en rupture |
| **Performance import** | Taux de reussite moyen des imports (lignes reussies / lignes traitees) |
| **Valeur stock** | Valeur totale du stock fourni par ce fournisseur (basee sur les prix d'achat) |

Ces statistiques sont mises a jour automatiquement apres chaque import.

---

## Bonnes Pratiques

### Organisation

- Utilisez des **codes fournisseurs courts et explicites** (ex : `SECOMP`, `LDLC`) pour faciliter la recherche et le tri
- Renseignez systematiquement l'**email de contact** pour faciliter la communication en cas de probleme de donnees
- Ajoutez des **notes internes** sur les particularites de chaque fournisseur (format de fichier, colonnes specifiques, delais)

### Test des Imports

- Avant d'activer un import automatique, effectuez un **import manuel de test** pour valider le mapping
- Utilisez le mode **dry run** pour verifier les resultats sans impacter votre catalogue
- Verifiez le rapport d'erreurs du premier import pour ajuster les regles de validation

### Securite SFTP

- Privilegiez le protocole **SFTP** plutot que FTP pour les connexions aux serveurs fournisseurs
- Utilisez des **comptes dedies** avec des droits en lecture seule sur le repertoire d'export du fournisseur
- Changez regulierement les mots de passe de connexion

---

## Documentation Technique

Pour la documentation technique detaillee du module Fournisseurs (API, base de donnees, architecture), consultez la page [Module Fournisseurs](/docs/modules/suppliers).

---

## Prochaines Etapes

- [Importer des Produits](/docs/guide/imports) : Lancez votre premier import depuis un fichier fournisseur
- [Formats Supportes](/docs/guide/formats-import) : Decouvrez les formats de fichiers acceptes et leurs specificites
- [Gestion des Produits](/docs/guide/produits) : Gerez les produits importes dans votre catalogue
- [Exporter vos Produits](/docs/guide/exports) : Distribuez vos produits vers vos canaux de vente
