---
title: FAQ
nextjs:
  metadata:
    title: FAQ - Guide Utilisateur Products Manager APP
    description: "Foire aux questions de Products Manager APP v4.5.58. Retrouvez les reponses aux questions les plus frequentes sur les comptes, produits, imports, exports, fournisseurs et performances."
---

Retrouvez les reponses aux questions les plus frequemment posees par les utilisateurs de Products Manager APP. {% .lead %}

---

## Compte et Connexion

### Comment reinitialiser mon mot de passe ?

Depuis la page de connexion de Products Manager APP, cliquez sur le lien **Mot de passe oublie**. Saisissez l'adresse email associee a votre compte et validez. Vous recevrez un email contenant un lien de reinitialisation valable 24 heures. Si vous ne recevez pas l'email, verifiez votre dossier de courrier indesirable.

### Pourquoi ma session expire-t-elle ?

Pour des raisons de securite, votre session expire automatiquement apres **30 minutes d'inactivite**. La duree maximale d'une session est de **7 jours**, meme si vous restez actif. Passe ce delai, vous devrez vous reconnecter. Si vous cochez l'option **Se souvenir de moi** lors de la connexion, la duree d'inactivite est etendue a 24 heures.

### Comment changer mon adresse email ?

Rendez-vous dans **Parametres** > **Profil** et modifiez le champ **Email**. Un email de verification sera envoye a la nouvelle adresse. Vous devez cliquer sur le lien de confirmation pour finaliser le changement. Votre ancienne adresse reste active tant que la nouvelle n'est pas confirmee.

### Puis-je avoir plusieurs comptes avec le meme email ?

Non. Chaque adresse email est unique au sein d'une organisation. Un meme email ne peut etre associe qu'a un seul compte utilisateur par organisation. Si vous avez besoin d'acceder a plusieurs organisations, contactez votre administrateur pour qu'il vous cree un acces avec une adresse email differente.

### Comment activer l'authentification a deux facteurs (2FA) ?

Rendez-vous dans **Parametres** > **Securite** > **Activer l'authentification a deux facteurs**. Scannez le QR code affiche avec une application d'authentification compatible (Google Authenticator, Authy, Microsoft Authenticator). Saisissez le code a 6 chiffres genere par l'application pour confirmer l'activation. Conservez precieusement les codes de recuperation qui vous sont fournis.

{% callout type="warning" %}
Si vous perdez l'acces a votre application d'authentification et que vous n'avez plus vos codes de recuperation, seul un administrateur pourra desactiver la 2FA sur votre compte. Contactez le support a webmaster@pixeeplay.com.
{% /callout %}

---

## Produits

### Quels sont les champs obligatoires pour creer un produit ?

Les champs obligatoires sont le **Titre** du produit et au moins un identifiant unique : **EAN** ou **SKU**. Tous les autres champs sont facultatifs mais contribuent au score de completude. Plus un produit est complet, meilleure sera sa qualite pour les exports vers les plateformes e-commerce.

### Comment ajouter des images a un produit ?

Depuis la fiche produit, rendez-vous dans l'onglet **Media**. Vous pouvez ajouter des images par glisser-deposer ou en cliquant sur le bouton d'upload. Les formats acceptes sont **JPG**, **PNG** et **WebP**. La taille maximale par image est de **10 MB** et vous pouvez associer jusqu'a **20 images** par produit. L'ordre des images peut etre modifie par glisser-deposer.

### Comment modifier des produits en masse ?

Selectionnez les produits souhaites dans la liste en cochant les cases correspondantes, puis cliquez sur **Actions en masse** > **Modifier**. Vous pouvez alors appliquer des modifications a l'ensemble de la selection : changer la categorie, le statut, le fournisseur, ou mettre a jour n'importe quel champ. Pour les modifications plus complexes, utilisez l'import avec l'option de mise a jour.

### Comment supprimer un produit ?

Depuis la fiche produit ou la liste des produits, utilisez l'action **Supprimer**. Le produit est place dans la **Corbeille** et reste restaurable pendant **30 jours**. Passe ce delai, la suppression devient definitive. Vous pouvez acceder a la corbeille depuis **Produits** > **Corbeille** pour restaurer ou supprimer definitivement un produit.

### Comment dupliquer un produit ?

Depuis la fiche produit, ouvrez le **Menu actions** (icone trois points) et selectionnez **Dupliquer**. Une copie du produit est creee avec toutes ses informations. Vous devez ensuite modifier l'**EAN** et/ou le **SKU** du nouveau produit car ces identifiants doivent rester uniques dans votre catalogue.

{% callout type="note" %}
Pour en savoir plus sur la gestion des produits, consultez la page [Gestion des Produits](/docs/guide/produits).
{% /callout %}

---

## Imports

### Pourquoi mon import echoue-t-il ?

Les causes les plus frequentes d'echec d'import sont :

- **Format non supporte** : verifiez que votre fichier est au format CSV, Excel (.xlsx, .xls) ou JSON
- **Colonnes manquantes** : les colonnes obligatoires (titre, EAN ou SKU) doivent etre presentes
- **Donnees invalides** : certaines lignes contiennent des valeurs non conformes (EAN incorrect, prix negatif, etc.)
- **Fichier trop volumineux** : le fichier depasse la taille maximale autorisee

Consultez le rapport d'erreurs detaille disponible apres chaque tentative d'import pour identifier la cause exacte.

### Comment mapper des colonnes personnalisees ?

Lors de l'etape de **mapping** de l'import, glissez-deposez les colonnes de votre fichier vers les champs correspondants de Products Manager. Vous pouvez sauvegarder votre mapping personnalise en cliquant sur **Sauvegarder le template** pour le reutiliser lors de vos prochains imports depuis le meme fournisseur.

### Quelle est la taille maximale d'un fichier d'import ?

La taille maximale autorisee est de **50 MB** par fichier. Pour les fichiers CSV, la limite est de **100 000 lignes**. Pour les fichiers Excel, la limite recommandee est de **50 000 lignes**. Si votre fichier depasse ces limites, nous vous recommandons de le decouper en plusieurs fichiers plus petits.

### Comment planifier des imports automatiques ?

Depuis la fiche d'un fournisseur, accedez a l'onglet **Import automatique** et cliquez sur **Configurer**. Selectionnez la source (FTP, SFTP, Email ou URL), renseignez les parametres de connexion, definissez la frequence d'execution et associez un template de mapping. Consultez la page [Gestion des Fournisseurs](/docs/guide/fournisseurs) pour les details de configuration.

### Comment gerer les doublons lors d'un import ?

Lors de la configuration de l'import, vous disposez de trois options pour traiter les produits deja presents dans votre catalogue :

| Option | Comportement |
|--------|-------------|
| **Mettre a jour** | Les produits existants sont mis a jour avec les nouvelles donnees du fichier |
| **Ignorer** | Les produits deja presents sont ignores, seuls les nouveaux sont crees |
| **Creer uniquement** | Seuls les nouveaux produits sont importes, aucune mise a jour n'est effectuee |

La detection des doublons se base sur le champ cle configure (EAN, SKU ou reference fournisseur).

---

## Exports

### Quelles plateformes e-commerce sont supportees ?

Products Manager APP prend en charge l'export vers les plateformes suivantes :

- **Shopify** : export natif avec synchronisation du catalogue
- **WooCommerce** : export adapte a l'API WooCommerce / WordPress
- **PrestaShop** : export compatible avec le Webservice PrestaShop
- **Amazon** : export au format Amazon Seller Central (Flat File)
- **Magento** : export compatible avec l'API Magento 2
- **Odoo** : synchronisation bidirectionnelle avec l'ERP Odoo

Vous pouvez egalement exporter en fichier local (CSV, Excel, JSON) pour tout autre usage.

### Pourquoi certains produits ne sont-ils pas exportes ?

Plusieurs raisons peuvent expliquer l'absence de produits dans un export :

- **Statut inactif** : par defaut, seuls les produits actifs sont inclus dans les exports
- **Champs requis manquants** : la plateforme de destination exige certains champs (titre, prix, description, etc.) que le produit ne possede pas
- **Filtres actifs** : verifiez les filtres appliques lors de la creation de l'export (categorie, fournisseur, statut)

Consultez le rapport d'export pour identifier les produits exclus et la raison de leur exclusion.

### Comment planifier un export automatique ?

Rendez-vous dans **Exports** > **Planification** et cliquez sur **Nouvel export planifie**. Configurez la selection de produits, le format, le mapping et la destination. Definissez la frequence (quotidienne, hebdomadaire, mensuelle ou expression cron) et l'heure d'execution. Consultez la page [Exporter vos Produits](/docs/guide/exports) pour les instructions detaillees.

### Puis-je personnaliser le format d'export ?

Oui. Products Manager APP permet de creer des **templates d'export personnalisables** par plateforme. Vous pouvez selectionner les champs a inclure, definir l'ordre des colonnes, appliquer des transformations (format de prix, concatenation de champs, valeurs par defaut) et sauvegarder le tout en template reutilisable.

---

## Fournisseurs

### Comment creer un fournisseur ?

Deux methodes sont disponibles :

1. **Depuis le menu** : rendez-vous dans **Fournisseurs** > **Ajouter un fournisseur** et remplissez les champs obligatoires (Nom et Code)
2. **Lors d'un import** : si le fournisseur n'existe pas encore, Products Manager APP vous propose de le creer directement depuis l'ecran d'import

Consultez la page [Gestion des Fournisseurs](/docs/guide/fournisseurs) pour les details complets.

### Comment associer des produits a un fournisseur ?

Trois methodes sont possibles :

- **Via la fiche fournisseur** : depuis l'onglet Produits, recherchez et ajoutez des produits existants
- **Via la fiche produit** : dans la section Fournisseurs, ajoutez un ou plusieurs fournisseurs au produit
- **Via une colonne import** : lors de l'import, associez automatiquement les produits au fournisseur selectionne

### Un produit peut-il avoir plusieurs fournisseurs ?

Oui. Products Manager APP supporte le **multi-fournisseurs**. Un meme produit peut etre associe a plusieurs fournisseurs, chacun avec sa propre reference, son prix d'achat et son stock. Cette fonctionnalite vous permet de comparer les offres et de gerer les approvisionnements de maniere flexible.

---

## Erreurs Courantes

### Format EAN invalide

L'EAN doit respecter un format standard :

- **EAN-13** : 13 chiffres exactement (standard europeen)
- **UPC-A** : 12 chiffres exactement (standard nord-americain)

Le dernier chiffre est un checksum calcule automatiquement. Si l'EAN saisi ne passe pas la verification du checksum, il est considere comme invalide. Utilisez l'outil de validation integre pour verifier vos EAN avant import.

### Produit en double detecte

Cette erreur survient lorsqu'un produit avec le meme **EAN** ou **SKU** existe deja dans votre catalogue. Vous avez alors le choix entre :

- **Mettre a jour** le produit existant avec les nouvelles donnees
- **Ignorer** le doublon et conserver le produit existant tel quel

### Quota de produits depasse

Chaque plan dispose d'une limite de produits :

| Plan | Limite de produits |
|------|-------------------|
| **Standard** | 100 000 produits |
| **Business** | 500 000 produits |
| **Enterprise** | Illimite |

Si vous atteignez la limite de votre plan, vous ne pourrez plus creer de nouveaux produits. Contactez votre administrateur pour envisager une mise a niveau.

### Erreur de connexion plateforme

Si l'export vers une plateforme e-commerce echoue avec une erreur de connexion, verifiez les points suivants :

- Les **cles API** sont valides et n'ont pas expire
- Les **permissions** associees aux cles API sont suffisantes (lecture/ecriture)
- L'**URL** de la boutique est correcte et accessible
- Le **certificat SSL** de la plateforme est valide

---

## Performance

### Combien de produits puis-je gerer dans Products Manager ?

Le nombre maximal de produits depend de votre plan d'abonnement :

- **Standard** : jusqu'a 100 000 produits
- **Business** : jusqu'a 500 000 produits
- **Enterprise** : nombre illimite de produits

Les performances de l'application sont optimisees pour gerer des catalogues de grande taille sans degradation notable.

### L'application est lente, que faire ?

Si vous constatez des lenteurs, suivez ces etapes :

1. **Verifiez votre connexion internet** : testez votre debit avec un outil de speedtest
2. **Mettez a jour votre navigateur** : utilisez la derniere version de Chrome, Firefox, Edge ou Safari
3. **Desactivez les extensions** : certaines extensions de navigateur peuvent interferer avec l'application
4. **Reduisez l'affichage** : diminuez le nombre de produits affiches par page (25 au lieu de 100)
5. **Videz le cache** : effacez le cache et les cookies de votre navigateur

Si le probleme persiste, contactez le support a webmaster@pixeeplay.com.

### Quelle est la disponibilite du service ?

Products Manager APP garantit un taux de disponibilite de **99.9%** (SLA). Les maintenances planifiees sont effectuees en dehors des heures ouvrables et sont annoncees a l'avance par email. En cas d'incident, vous pouvez consulter la page de statut du service pour suivre la resolution en temps reel.

---

## Contact et Support

Si vous n'avez pas trouve la reponse a votre question dans cette FAQ :

- **Email support** : webmaster@pixeeplay.com
- **Documentation technique** : [Introduction a Products Manager](/docs/getting-started/introduction)
- **Guide de depannage** : [Resolution de Problemes](/docs/guide/depannage)

{% callout type="note" %}
Pour les questions techniques relatives a l'API ou a l'architecture de Products Manager APP, consultez la [documentation technique](/docs/getting-started/introduction) qui fournit des references detaillees sur tous les endpoints et modules disponibles.
{% /callout %}
