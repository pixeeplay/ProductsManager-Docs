---
title: Resolution de Problemes
nextjs:
  metadata:
    title: Resolution de Problemes - Guide Utilisateur Products Manager APP
    description: "Guide de depannage de Products Manager APP v4.5.58. Diagnostiquez et resolvez les problemes de connexion, d'import, d'export, de performance, d'affichage et d'API."
---

Identifiez et resolvez rapidement les problemes les plus courants rencontres dans Products Manager APP grace a ce guide de depannage. {% .lead %}

---

## Problemes de Connexion

### Impossible de se connecter

Si vous ne parvenez pas a acceder a votre compte, suivez ces etapes dans l'ordre :

1. **Verifiez vos identifiants** : assurez-vous que l'adresse email et le mot de passe sont corrects, en verifiant notamment les majuscules et la touche Verrouillage Majuscules
2. **Reinitialiser votre mot de passe** : cliquez sur **Mot de passe oublie** depuis la page de connexion et suivez les instructions envoyees par email
3. **Videz le cache du navigateur** : supprimez les cookies et les donnees de navigation pour le domaine de Products Manager APP
4. **Essayez en mode navigation privee** : ouvrez une fenetre de navigation privee (Ctrl+Maj+N) pour exclure un probleme lie aux extensions ou au cache

{% callout type="note" %}
Si vous avez active l'authentification a deux facteurs (2FA), assurez-vous que l'heure de votre appareil est correctement synchronisee. Un decalage horaire peut rendre les codes 2FA invalides.
{% /callout %}

### Session qui expire de maniere inattendue

Si votre session se termine plus rapidement que prevu :

- **Option "Se souvenir de moi"** : cochez cette option lors de la connexion pour etendre la duree de session a 7 jours
- **Cookies** : verifiez que votre navigateur accepte les cookies pour le domaine de Products Manager APP et qu'aucun logiciel de nettoyage ne les supprime automatiquement
- **Extensions de navigateur** : certaines extensions de confidentialite (uBlock, Privacy Badger) peuvent bloquer les cookies de session
- **Heure systeme** : un decalage important de l'horloge de votre ordinateur peut provoquer des expirations prematurees

### Acces refuse apres connexion

Si vous parvenez a vous connecter mais obtenez un message "Acces refuse" :

- **Verification du role** : votre role utilisateur ne dispose peut-etre pas des permissions necessaires pour acceder a la page demandee. Contactez votre administrateur pour verifier vos droits
- **Permissions insuffisantes** : certains modules sont restreints a des roles specifiques (Administrateur, Manager). Demandez une elevation de privileges si necessaire
- **Statut du compte** : votre compte a peut-etre ete desactive ou archive par un administrateur. Contactez le support pour verification

---

## Problemes d'Import

### Fichier non reconnu

Si votre fichier est rejete lors de l'upload :

| Cause probable | Solution |
|----------------|----------|
| Extension non supportee | Renommez ou convertissez le fichier en .csv, .xlsx, .xls ou .json |
| Taille excessive | Verifiez que le fichier ne depasse pas 50 MB. Decoupez-le si necessaire |
| Fichier corrompu | Re-telechargez le fichier depuis sa source d'origine ou regenerez-le |
| Encodage incorrect | Assurez-vous que le fichier est encode en UTF-8 (voir section Erreurs d'encodage) |

### Erreurs d'encodage des caracteres

Les caracteres speciaux (accents, symboles) apparaissent de maniere incorrecte dans vos imports :

1. **Specifiez l'encodage** : lors de l'upload, selectionnez l'encodage correct dans les options avancees (UTF-8, ISO-8859-1, Windows-1252)
2. **Convertissez le fichier en UTF-8** : ouvrez le fichier dans un editeur de texte (Notepad++, VS Code) et enregistrez-le en UTF-8
3. **Utilisez Excel ou LibreOffice** : ouvrez le fichier CSV dans Excel ou LibreOffice Calc, verifiez que les caracteres s'affichent correctement, puis reenregistrez au format CSV avec l'encodage UTF-8

{% callout type="warning" %}
L'encodage **UTF-8 avec BOM** est recommande pour les fichiers CSV destines a etre ouverts dans Microsoft Excel. Le BOM (Byte Order Mark) permet a Excel de detecter automatiquement l'encodage UTF-8.
{% /callout %}

### Import bloque ou lent

Si votre import semble bloque ou progresse tres lentement :

- **Taille du fichier** : les fichiers volumineux (plus de 10 000 lignes) sont traites en arriere-plan. Laissez le processus se terminer sans actualiser la page
- **Colonnes inutiles** : supprimez les colonnes non necessaires de votre fichier avant l'import pour accelerer le traitement
- **Formules Excel** : remplacez les formules par leurs valeurs (Copier > Coller en tant que valeurs) car le calcul des formules ralentit le parsing
- **Timing** : les imports lances aux heures de pointe peuvent etre plus lents. Privilegiez les heures creuses pour les gros volumes

### EAN invalides en masse

Si de nombreux EAN sont rejetes lors de l'import :

- **Format** : les EAN-13 doivent comporter exactement **13 chiffres**. Les UPC-A doivent comporter exactement **12 chiffres**
- **Outil de validation** : utilisez l'outil de validation integre dans Products Manager pour verifier vos EAN avant l'import
- **Nettoyage prealable** : dans votre fichier source, supprimez les espaces, tirets et autres caracteres non numeriques des colonnes EAN
- **Format de cellule** : dans Excel, assurez-vous que la colonne EAN est formatee en **Texte** et non en **Nombre** (sinon le zero initial est supprime)

### Produits en double lors de l'import

Si l'import genere des doublons inattendus :

- **Champ cle** : verifiez que le champ cle de deduplication (EAN, SKU ou reference fournisseur) est correctement configure dans les options d'import
- **Option de mise a jour** : activez l'option **Mettre a jour les produits existants** pour fusionner les donnees au lieu de creer de nouvelles fiches
- **Nettoyage** : utilisez l'outil de detection des doublons dans **Produits** > **Outils** > **Doublons** pour identifier et fusionner les doublons existants

---

## Problemes d'Export

### Export incomplet

Si votre export ne contient pas tous les produits attendus :

1. **Verifiez les filtres** : examinez les criteres de selection appliques lors de la creation de l'export (categorie, statut, fournisseur)
2. **Produits inactifs** : par defaut, seuls les produits **actifs** sont exportes. Modifiez le filtre de statut pour inclure les produits inactifs si necessaire
3. **Erreurs de validation** : certains produits sont exclus car ils ne respectent pas les exigences de la plateforme cible. Consultez le rapport d'export pour identifier les produits exclus
4. **Champs requis** : verifiez que tous les champs obligatoires de la plateforme sont renseignes pour les produits concernes

### Fichier rejete par la plateforme de destination

Chaque plateforme a des exigences specifiques. Voici les erreurs les plus courantes par plateforme :

**Shopify** :
- Les descriptions contiennent du HTML non supporte : utilisez le filtre de nettoyage HTML dans le template d'export
- Le poids ou le prix est manquant : ces champs sont obligatoires pour Shopify

**WooCommerce** :
- Les categories n'existent pas sur la boutique : creez les categories dans WooCommerce avant l'import ou activez la creation automatique
- Les images ne sont pas accessibles : verifiez que les URLs sont publiques et que le serveur WooCommerce peut y acceder

**Amazon** :
- Les champs obligatoires varient selon la categorie Amazon : consultez le template Flat File correspondant a votre categorie
- L'identifiant produit (ASIN, EAN, UPC) est manquant ou invalide

{% callout type="note" %}
Pour des instructions detaillees par plateforme, consultez les guides d'export dedies disponibles dans la section [Exporter vos Produits](/docs/guide/exports).
{% /callout %}

### Images non importees par la plateforme

Si les images de vos produits n'apparaissent pas sur la plateforme de destination :

- **URLs publiques** : les URLs des images doivent etre accessibles publiquement, sans authentification
- **Formats supportes** : utilisez les formats **JPG**, **PNG** ou **WebP** qui sont universellement supportes
- **Taille et resolution** : respectez les limites de la plateforme cible (par exemple, Shopify recommande des images de 2048x2048 pixels maximum)
- **Protocole HTTPS** : certaines plateformes exigent des URLs en HTTPS

---

## Problemes de Performance

### Application lente

Si l'application met du temps a repondre :

1. **Testez votre connexion** : effectuez un test de debit internet. Une connexion de 10 Mbps minimum est recommandee
2. **Mettez a jour votre navigateur** : utilisez la derniere version de Google Chrome, Mozilla Firefox, Microsoft Edge ou Apple Safari
3. **Desactivez les extensions** : les extensions de navigateur (bloqueurs de publicites, outils de developpement) peuvent ralentir l'interface
4. **Optimisez l'affichage** : reduisez le nombre d'elements affiches par page dans les options d'affichage (25 produits au lieu de 100)
5. **Fermez les onglets inutiles** : un nombre excessif d'onglets ouverts consomme de la memoire et peut degrader les performances

### Recherche lente

Si la recherche de produits est anormalement lente :

- **Termes precis** : utilisez des termes de recherche specifiques plutot que des mots generiques (recherchez "Samsung Galaxy S24" plutot que "telephone")
- **Combinez les filtres** : affinez votre recherche en combinant la barre de recherche avec les filtres de categorie, statut ou fournisseur
- **Evitez les termes trop courts** : les recherches de moins de 3 caracteres parcourent l'integralite du catalogue et sont plus lentes

### Timeout pendant les operations

Si une operation (import, export, modification en masse) se termine par un timeout :

| Situation | Solution |
|-----------|----------|
| Import volumineux | Divisez le fichier en lots de 10 000 a 20 000 lignes maximum |
| Export massif | Reduisez la selection de produits ou utilisez des filtres plus restrictifs |
| Modification en masse | Affinez les criteres de selection pour traiter moins de 5 000 produits a la fois |
| Recherche complexe | Simplifiez les criteres de filtrage et reduisez le nombre de filtres combines |

Les operations sur de grands volumes sont automatiquement traitees par lots en arriere-plan. Laissez le traitement se terminer sans actualiser la page.

---

## Problemes d'Affichage

### Page blanche ou erreur 500

Si une page ne se charge pas ou affiche une erreur serveur :

1. **Rafraichissez la page** : appuyez sur F5 ou Ctrl+R pour recharger la page
2. **Videz le cache** : appuyez sur Ctrl+Maj+Suppr et supprimez les fichiers en cache
3. **Essayez un autre navigateur** : testez avec un navigateur different pour isoler le probleme
4. **Verifiez le statut du service** : consultez la page de statut de Products Manager APP pour verifier qu'il n'y a pas d'incident en cours

Si le probleme persiste sur une page specifique, notez l'URL exacte et contactez le support.

### Interface deformee ou mal alignee

Si l'interface ne s'affiche pas correctement :

- **Zoom du navigateur** : verifiez que le niveau de zoom est a 100% (Ctrl+0 pour reinitialiser)
- **Cache** : videz le cache du navigateur pour forcer le rechargement des fichiers CSS
- **Extensions** : desactivez temporairement les extensions qui modifient l'affichage des pages web
- **Resolution** : une resolution d'ecran minimale de 1280x720 pixels est recommandee

### Donnees obsoletes affichees

Si les donnees affichees ne correspondent pas aux modifications recentes :

1. **Rafraichissez la page** : appuyez sur F5 pour forcer le rechargement des donnees
2. **Cliquez sur Mettre a jour** : sur certaines pages, un bouton de rafraichissement permet de recharger les donnees sans recharger toute la page
3. **Videz le cache local** : les donnees peuvent etre mises en cache localement par le navigateur. Videz le cache pour obtenir les donnees a jour
4. **Deconnexion / reconnexion** : en dernier recours, deconnectez-vous puis reconnectez-vous pour reinitialiser completement la session

---

## Problemes d'API

### 401 Unauthorized

Si vos appels API retournent une erreur 401 :

- **Regenerez le token** : votre token d'authentification a peut-etre expire. Generez un nouveau token depuis **Parametres** > **API** > **Tokens**
- **Verifiez le format** : le token doit etre transmis dans l'en-tete HTTP au format `Authorization: Bearer votre_token_ici`
- **Verifiez les permissions** : assurez-vous que le token dispose des scopes necessaires pour l'operation demandee

### 429 Too Many Requests

Si vous recevez une erreur 429, vous avez depasse la limite de requetes autorisees :

- **Respectez les limites** : la limite par defaut est de 100 requetes par minute. Adaptez le debit de vos appels en consequence
- **Ajoutez des delais** : inserez un delai de 100 a 500 ms entre chaque requete pour eviter de saturer l'API
- **Utilisez les endpoints bulk** : pour les operations en masse, privilegiez les endpoints de type `/bulk` qui permettent de traiter plusieurs elements en une seule requete

{% callout type="note" %}
L'en-tete de reponse `X-RateLimit-Remaining` indique le nombre de requetes restantes dans la fenetre actuelle. Utilisez cette information pour adapter dynamiquement le debit de vos appels.
{% /callout %}

### 500 Internal Server Error

Si l'API retourne une erreur 500 :

1. **Reessayez la requete** : les erreurs 500 peuvent etre temporaires. Attendez quelques secondes puis relancez l'appel
2. **Verifiez le format de la requete** : assurez-vous que le corps de la requete (JSON) est correctement formate et que les champs requis sont presents
3. **Consultez les logs** : si vous avez acces aux logs d'erreur, recherchez le message detaille associe a votre requete
4. **Contactez le support** : si l'erreur persiste, transmettez l'identifiant de requete (en-tete `X-Request-Id`) au support pour faciliter le diagnostic

---

## Codes d'Erreur HTTP

Voici la reference des codes d'erreur HTTP que vous pouvez rencontrer lors de l'utilisation de l'API de Products Manager APP :

| Code | Signification | Solution |
|------|---------------|----------|
| **400** | Requete invalide | Verifiez la syntaxe de la requete, les parametres obligatoires et le format des donnees |
| **401** | Non autorise | Regenerez votre token d'authentification et verifiez le format Bearer |
| **403** | Acces interdit | Votre token ne dispose pas des permissions suffisantes pour cette operation |
| **404** | Ressource non trouvee | Verifiez l'identifiant de la ressource et l'URL de l'endpoint |
| **409** | Conflit | La ressource existe deja ou une modification concurrente a ete detectee |
| **413** | Payload trop volumineux | Reduisez la taille du corps de la requete ou du fichier envoye |
| **422** | Entite non traitable | Les donnees sont syntaxiquement correctes mais semantiquement invalides (ex : EAN invalide) |
| **429** | Trop de requetes | Ralentissez le debit de vos appels et respectez les limites de rate limiting |
| **500** | Erreur serveur interne | Reessayez apres quelques secondes. Si l'erreur persiste, contactez le support |
| **502** | Bad Gateway | Le serveur intermediaire n'a pas obtenu de reponse. Reessayez apres quelques instants |
| **503** | Service indisponible | Le service est temporairement en maintenance. Consultez la page de statut |

---

## Diagnostics Avances

### Collecter les informations de debug

Avant de contacter le support, rassemblez les informations suivantes pour accelerer le diagnostic :

1. **Capture d'ecran** : prenez une capture d'ecran de l'erreur affichee, incluant l'URL dans la barre d'adresse
2. **Console du navigateur** : ouvrez la console (F12 > onglet Console) et copiez les messages d'erreur affiches en rouge
3. **Onglet Reseau** : dans les outils de developpement (F12 > onglet Network/Reseau), identifiez les requetes en erreur (codes 4xx ou 5xx) et notez le code de statut et le corps de la reponse
4. **Etapes de reproduction** : decrivez precisement les actions effectuees pour reproduire le probleme (page visitee, bouton clique, donnees saisies)

### Verifier le statut du service

En cas de doute sur la disponibilite de Products Manager APP :

- Consultez la page de statut du service pour verifier qu'aucun incident n'est en cours
- Verifiez votre connexion internet en accedant a d'autres sites web
- Testez depuis un autre reseau (partage de connexion mobile) pour exclure un probleme reseau local

---

## Contact Support

Si vous n'avez pas reussi a resoudre votre probleme avec ce guide, contactez l'equipe de support :

- **Email** : webmaster@pixeeplay.com
- **Documentation technique** : [Introduction a Products Manager](/docs/getting-started/introduction)
- **FAQ** : [Consulter la FAQ](/docs/guide/faq)

### Temps de reponse du support

| Priorite | Criteres | Delai de reponse |
|----------|----------|-----------------|
| **Critique** | Service completement indisponible, perte de donnees | Moins de 1 heure |
| **Urgent** | Fonctionnalite majeure inaccessible, blocage d'un workflow | Moins de 4 heures |
| **Normal** | Question d'utilisation, probleme mineur, demande d'amelioration | Moins de 24 heures |

### Checklist avant de contacter le support

Avant d'envoyer votre demande, assurez-vous d'avoir :

- [ ] Consulte cette page de depannage et la [FAQ](/docs/guide/faq)
- [ ] Teste dans un autre navigateur et/ou en navigation privee
- [ ] Vide le cache du navigateur
- [ ] Note l'URL exacte de la page concernee
- [ ] Prepare une capture d'ecran de l'erreur
- [ ] Releve les messages d'erreur dans la console du navigateur (F12)
- [ ] Decrit les etapes precises pour reproduire le probleme

{% callout type="note" %}
Plus votre description du probleme est precise et documentee, plus le support sera en mesure de vous apporter une reponse rapide et efficace.
{% /callout %}
