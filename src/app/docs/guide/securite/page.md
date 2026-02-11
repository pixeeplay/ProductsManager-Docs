---
title: Securite et Mot de Passe
nextjs:
  metadata:
    title: Securite et Mot de Passe - Guide Utilisateur Products Manager APP
    description: "Securisez votre compte et votre organisation dans Products Manager APP : mot de passe, double authentification, sessions, tokens API, restrictions IP et sauvegardes."
---

Securisez votre compte et votre organisation en configurant les politiques de mot de passe, la double authentification, les sessions et les sauvegardes de Products Manager APP. {% .lead %}

---

## Vue d'Ensemble

La securite de vos donnees est une priorite dans Products Manager APP. Cette page couvre l'ensemble des mecanismes de protection disponibles : gestion du mot de passe, double authentification (2FA), controle des sessions, tokens API, restrictions IP et sauvegardes.

Les parametres de securite sont accessibles depuis **Parametres** puis **Securite**. Certaines options sont reservees aux administrateurs (Admin et Super Admin).

---

## Gestion du Mot de Passe

### Changer son Mot de Passe

Pour modifier votre mot de passe :

1. Accedez a votre **Profil** depuis le menu en haut a droite
2. Cliquez sur **Changer le mot de passe**
3. Saisissez votre mot de passe actuel
4. Saisissez et confirmez votre nouveau mot de passe
5. Cliquez sur **Enregistrer**

### Reinitialisation par Email

Si vous avez oublie votre mot de passe :

1. Sur l'ecran de connexion, cliquez sur **Mot de passe oublie**
2. Saisissez votre adresse email
3. Consultez votre boite de reception et cliquez sur le lien de reinitialisation
4. Definissez un nouveau mot de passe conforme a la politique en vigueur

{% callout type="note" %}
Le lien de reinitialisation est valide pendant 1 heure. Passe ce delai, vous devrez effectuer une nouvelle demande.
{% /callout %}

### Politique de Mot de Passe

Les administrateurs peuvent configurer la politique de mot de passe de l'organisation depuis **Parametres** puis **Securite** puis **Politique de mot de passe** :

| Critere | Valeur par defaut | Configurable |
|---------|-------------------|--------------|
| Longueur minimale | 8 caracteres | Oui |
| Au moins une majuscule | Oui | Oui |
| Au moins un chiffre | Oui | Oui |
| Au moins un caractere special | Oui | Oui |
| Expiration du mot de passe | Desactivee | Oui (30, 60, 90 jours) |
| Historique des mots de passe | 3 derniers interdits | Oui |

---

## Double Authentification (2FA)

La double authentification ajoute une couche de securite supplementaire en exigeant un code temporaire en plus du mot de passe lors de la connexion.

### Activer la 2FA

1. Accedez a votre **Profil** puis **Securite**
2. Cliquez sur **Activer la double authentification**
3. Scannez le QR code affiche avec une application d'authentification
4. Saisissez le code a 6 chiffres genere par l'application pour confirmer l'activation
5. Sauvegardez les codes de secours affiches dans un endroit sur

### Applications Compatibles

Products Manager APP est compatible avec toutes les applications TOTP standard :

- **Google Authenticator** (Android, iOS)
- **Authy** (Android, iOS, Desktop)
- **Microsoft Authenticator** (Android, iOS)
- **1Password**, **Bitwarden** et autres gestionnaires de mots de passe compatibles TOTP

### Codes de Secours

Lors de l'activation de la 2FA, Products Manager APP genere 10 codes de secours a usage unique. Ces codes permettent de se connecter si vous perdez l'acces a votre application d'authentification.

{% callout type="warning" %}
Conservez vos codes de secours dans un endroit securise et hors ligne. Chaque code ne peut etre utilise qu'une seule fois. Si vous avez epuise vos codes de secours, contactez un administrateur pour reinitialiser votre 2FA.
{% /callout %}

### Rendre la 2FA Obligatoire

Les administrateurs peuvent imposer la double authentification a tous les utilisateurs de l'organisation :

1. Rendez-vous dans **Parametres** puis **Securite** puis **Double authentification**
2. Activez l'option **Obliger la 2FA pour tous les utilisateurs**
3. Definissez un delai de grace (par defaut : 7 jours) pendant lequel les utilisateurs doivent configurer leur 2FA

Les utilisateurs qui n'ont pas active la 2FA dans le delai imparti seront invites a le faire a chaque connexion.

---

## Gestion des Sessions

### Timeout d'Inactivite

Par defaut, une session est automatiquement fermee apres **30 minutes** d'inactivite. Les administrateurs peuvent ajuster cette duree depuis **Parametres** puis **Securite** puis **Sessions** :

| Parametre | Valeur par defaut | Options |
|-----------|-------------------|---------|
| Timeout d'inactivite | 30 minutes | 15 min, 30 min, 1h, 2h, 4h |
| Duree maximale de session | 7 jours | 1 jour, 3 jours, 7 jours, 30 jours |
| Sessions simultanees | Autorisees | Autorisees, Limitees (max 3), Interdites |

### Deconnexion Forcee

Les administrateurs peuvent forcer la deconnexion d'un utilisateur depuis sa fiche dans la section **Utilisateurs et Roles** :

- **Deconnecter toutes les sessions** : termine toutes les sessions actives de l'utilisateur sur tous ses appareils
- **Deconnecter une session specifique** : termine une session identifiee par son appareil et sa date de derniere activite

Cette fonctionnalite est utile en cas de suspicion de compromission d'un compte.

---

## Tokens API

Les tokens API permettent d'acceder aux fonctionnalites de Products Manager APP depuis des applications tierces ou des scripts d'automatisation.

### Generer un Token

1. Accedez a votre **Profil** puis **Tokens API**
2. Cliquez sur **Generer un nouveau token**
3. Donnez un nom descriptif au token (ex : "Integration ERP", "Script import quotidien")
4. Selectionnez les permissions du token (lecture seule, lecture-ecriture, ou permissions granulaires par module)
5. Definissez une date d'expiration (recommandee)
6. Cliquez sur **Generer**

{% callout type="warning" %}
Le token complet n'est affiche qu'une seule fois lors de sa creation. Copiez-le immediatement et stockez-le dans un endroit securise (gestionnaire de secrets, variable d'environnement). Il ne sera plus possible de le consulter ulterieurement.
{% /callout %}

### Permissions du Token

Chaque token peut etre configure avec des permissions specifiques :

| Permission | Description |
|------------|-------------|
| **Lecture seule** | Acces en consultation a l'ensemble des ressources |
| **Lecture-ecriture** | Acces complet aux operations CRUD |
| **Personnalise** | Selection granulaire des permissions par module (Produits, Fournisseurs, Imports, Exports) |

### Rotation et Revocation

- **Rotation reguliere** : regenerez vos tokens periodiquement (tous les 90 jours recommande) pour limiter les risques en cas de fuite
- **Revocation** : supprimez immediatement un token compromis depuis la page **Tokens API**. La revocation prend effet instantanement

---

## Restriction IP

Les administrateurs peuvent restreindre l'acces a Products Manager APP en configurant une whitelist d'adresses IP autorisees.

### Configurer la Whitelist

1. Rendez-vous dans **Parametres** puis **Securite** puis **Restrictions IP**
2. Cliquez sur **Ajouter une adresse IP**
3. Saisissez l'adresse IP ou la plage CIDR (ex : `192.168.1.0/24`)
4. Ajoutez une description pour identifier la source (ex : "Bureau Paris", "VPN entreprise")
5. Enregistrez la configuration

{% callout type="warning" %}
Avant d'activer la restriction IP, assurez-vous d'avoir ajoute toutes les adresses IP necessaires, y compris votre adresse actuelle. Une configuration incorrecte pourrait bloquer l'acces a l'ensemble des utilisateurs. En cas de verrouillage, contactez le support technique.
{% /callout %}

Les restrictions IP s'appliquent a l'interface web et aux appels API.

---

## Sauvegardes

### Sauvegardes Automatiques

Products Manager APP effectue des sauvegardes automatiques de l'ensemble de vos donnees :

| Parametre | Valeur par defaut |
|-----------|-------------------|
| Frequence | Quotidienne (chaque nuit a 2h, heure Europe/Paris) |
| Retention | 30 jours |
| Contenu | Base de donnees complete, fichiers et medias, configuration |

### Sauvegarde Manuelle

En complement des sauvegardes automatiques, vous pouvez declencher une sauvegarde manuelle depuis **Parametres** puis **Sauvegardes** :

Les elements exportables sont les suivants :

| Element | Format | Description |
|---------|--------|-------------|
| **Produits** | CSV, JSON | Export complet du catalogue avec tous les attributs |
| **Fournisseurs** | CSV, JSON | Liste des fournisseurs et leurs configurations |
| **Parametres** | JSON | Configuration de l'organisation, modules et preferences |
| **Utilisateurs** | CSV | Liste des utilisateurs et leurs roles (sans les mots de passe) |

### Restauration

La restauration d'une sauvegarde est reservee aux Super Admin. Depuis la page **Sauvegardes**, selectionnez le point de restauration souhaite et confirmez l'operation. La restauration remplace les donnees actuelles par celles de la sauvegarde selectionnee.

{% callout type="warning" %}
La restauration est une operation destructive qui remplace l'integralite des donnees actuelles. Effectuez une sauvegarde manuelle avant toute restauration pour pouvoir revenir en arriere si necessaire.
{% /callout %}

---

## Bonnes Pratiques de Securite

Pour maintenir un niveau de securite optimal sur votre organisation, appliquez les recommandations suivantes :

- **Rotation des tokens API** : regenerez vos tokens tous les 90 jours et revoquez immediatement ceux qui ne sont plus utilises
- **Revision des logs d'activite** : consultez regulierement les logs depuis [Utilisateurs et Roles](/docs/guide/administration) pour detecter toute activite suspecte (tentatives de connexion echouees, actions inhabituelles)
- **Whitelist IP** : si votre organisation dispose d'adresses IP fixes, activez la restriction IP pour empecher les connexions depuis des reseaux non autorises
- **Test des sauvegardes** : verifiez periodiquement que vos sauvegardes sont fonctionnelles en effectuant un test de restauration sur un environnement de test
- **Formation des equipes** : sensibilisez vos collaborateurs aux bonnes pratiques de securite (ne pas partager ses identifiants, signaler les emails suspects, verrouiller sa session)

---

## Documentation Technique

Pour la documentation technique detaillee des mecanismes de securite (chiffrement, architecture, conformite), consultez la page [Securite Technique](/docs/technical/security).

---

## Prochaines Etapes

- [Utilisateurs et Roles](/docs/guide/administration) : Gerez les utilisateurs, les roles et les permissions de votre organisation
- [Configuration des Modules](/docs/guide/modules) : Activez et configurez les modules selon vos besoins
- [Premiers Pas](/docs/guide/premiers-pas) : Revenez aux bases si vous decouvrez l'application
