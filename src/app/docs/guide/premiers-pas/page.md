---
title: Premiers Pas
nextjs:
  metadata:
    title: Premiers Pas - Guide Utilisateur Products Manager APP
    description: "Guide de demarrage pour Products Manager APP : prerequis, connexion, decouverte du dashboard et premier import."
---

Decouvrez comment vous connecter a Products Manager APP, naviguer dans le dashboard et realiser vos premieres actions en quelques minutes. {% .lead %}

---

## Prerequis

Avant de commencer, assurez-vous de disposer des elements suivants :

- Un **compte utilisateur actif** Products Manager APP (fourni par votre administrateur)
- Un **navigateur moderne** a jour (Chrome, Firefox, Safari ou Edge)
- Une **connexion Internet stable**

{% callout type="note" %}
Vous n'avez pas encore de compte ? Contactez votre administrateur ou ecrivez a **webmaster@pixeeplay.com** pour obtenir un acces ou une demonstration gratuite.
{% /callout %}

---

## Premiere Connexion

### 1. Acceder a l'Application

Ouvrez votre navigateur et rendez-vous a l'adresse suivante :

```text
https://productsmanager.app/login
```

### 2. Saisir vos Identifiants

1. Entrez votre **adresse email** professionnelle
2. Saisissez votre **mot de passe**
3. Cliquez sur **Se connecter**

{% callout type="warning" %}
Si vous avez oublie votre mot de passe, cliquez sur **Mot de passe oublie ?** sur la page de connexion. Un lien de reinitialisation vous sera envoye par email dans les minutes qui suivent.
{% /callout %}

### 3. Authentification a Deux Facteurs (2FA)

Si la double authentification est activee pour votre organisation :

1. Ouvrez votre application d'authentification (Google Authenticator, Authy ou equivalent)
2. Entrez le **code a 6 chiffres** affiche dans l'application
3. Cochez **"Se souvenir de cet appareil"** si vous souhaitez ne pas avoir a ressaisir le code pendant 30 jours

{% callout type="note" %}
La 2FA est fortement recommandee pour proteger votre compte. Votre administrateur peut l'activer dans [Securite et Mot de Passe](/docs/guide/securite).
{% /callout %}

---

## Decouverte du Dashboard

Apres connexion, vous arrivez sur le **Dashboard principal**, le point de depart de votre utilisation quotidienne.

### Statistiques Cles

Le haut du dashboard affiche quatre indicateurs en temps reel :

| Indicateur | Description |
|------------|-------------|
| **Total Produits** | Nombre total de produits dans votre catalogue |
| **Fournisseurs Actifs** | Nombre de fournisseurs configures et actifs |
| **Imports Aujourd'hui** | Nombre d'imports executes dans les dernieres 24 heures |
| **Taux de Reussite** | Pourcentage d'imports termines sans erreur |

### Activite Recente

Sous les statistiques, un fil d'activite chronologique liste les derniers evenements :

- Imports termines ou en echec
- Produits crees ou modifies
- Alertes de stock
- Modifications de configuration

### Graphiques de Tendances

Des graphiques interactifs vous permettent de visualiser :

- **Imports par jour** sur les 7 derniers jours
- **Produits ajoutes** sur les 30 derniers jours
- **Performance par fournisseur** avec taux de reussite

---

## Creer Votre Premier Produit

Pour ajouter un produit manuellement dans le catalogue :

### 1. Acceder au Catalogue

Cliquez sur **Produits** dans le menu lateral pour acceder a la liste des produits.

### 2. Creer un Nouveau Produit

1. Cliquez sur le bouton **Nouveau Produit** en haut a droite
2. Remplissez les champs obligatoires :
   - **SKU** : reference unique du produit (ex. `PROD-001`)
   - **Titre** : nom du produit
   - **Prix HT** : prix hors taxes
3. Completez les champs optionnels selon vos besoins :
   - Description, categorie, marque, poids, dimensions
   - Images et medias
   - Attributs specifiques (couleur, taille, etc.)
4. Cliquez sur **Enregistrer**

### 3. Verifier le Produit

Le produit apparait dans la liste du catalogue. Cliquez dessus pour verifier les informations saisies et les completer si necessaire.

{% callout type="note" %}
La creation manuelle est utile pour quelques produits. Pour des volumes importants, utilisez la fonctionnalite d'import decrite ci-dessous.
{% /callout %}

---

## Lancer Votre Premier Import

L'import est la methode privilegiee pour alimenter votre catalogue avec les donnees de vos fournisseurs.

### 1. Configurer un Fournisseur

Avant d'importer, vous devez configurer au moins un fournisseur :

1. Allez dans **Fournisseurs** depuis le menu lateral
2. Cliquez sur **Nouveau Fournisseur**
3. Renseignez les informations de base :
   - **Nom** du fournisseur
   - **Type d'import** : Excel, CSV, FTP ou API
   - **Frequence** : manuelle, quotidienne, hebdomadaire
4. Configurez le **mapping des colonnes** pour associer les colonnes de votre fichier aux champs Products Manager :

| Colonne Fournisseur | Champ Products Manager |
|---------------------|------------------------|
| ref_produit | SKU |
| nom_produit | Titre |
| prix_ht | Prix HT |
| stock_dispo | Stock |
| image_url | Image principale |

5. Cliquez sur **Enregistrer**

### 2. Importer un Fichier

1. Allez dans **Imports** depuis le menu lateral
2. Cliquez sur **Nouvel Import**
3. Selectionnez le fournisseur configure
4. Uploadez votre fichier (Excel ou CSV, 50 Mo maximum)
5. Cliquez sur **Lancer l'Import**

L'import se deroule en arriere-plan en 4 phases :

1. **Upload** du fichier (5 a 10 secondes)
2. **Validation** des donnees (10 a 30 secondes)
3. **Insertion** en base de donnees (30 a 60 secondes)
4. **Finalisation** et mise a jour des statistiques (5 secondes)

### 3. Consulter le Resultat

Une fois l'import termine, consultez le rapport pour verifier :

- Le nombre de produits **crees**, **mis a jour** et en **erreur**
- Les **logs detailles** de l'execution
- Le **fichier source** telecharge pour reference

{% callout type="note" %}
Vous pouvez continuer a utiliser l'application pendant le traitement de l'import. Une notification vous previent lorsqu'il est termine.
{% /callout %}

---

## Prochaines Etapes

Maintenant que vous avez pris en main les bases, explorez les fonctionnalites plus en detail :

- [Tour de l'Interface](/docs/guide/interface) -- Decouvrez en detail tous les elements de l'interface
- [Gestion des Produits](/docs/guide/produits) -- Maitrisez la gestion avancee de votre catalogue
- [Importer des Produits](/docs/guide/imports) -- Explorez les options avancees d'import (FTP, API, planification)
- [Exporter vos Produits](/docs/guide/exports) -- Synchronisez vos produits avec vos plateformes e-commerce
- [Enrichissement IA](/docs/guide/enrichissement-ia) -- Generez des descriptions et optimisez le SEO automatiquement

---

## Besoin d'Aide ?

- **FAQ** : [Consulter la FAQ](/docs/guide/faq) pour les questions frequentes
- **Depannage** : [Resolution de Problemes](/docs/guide/depannage) pour les problemes courants
- **Email** : webmaster@pixeeplay.com
- **Documentation technique** : [docs.productsmanager.app](https://docs.productsmanager.app)
