---
title: Importer des Produits
nextjs:
  metadata:
    title: Importer des Produits - Guide Utilisateur Products Manager APP
    description: "Importez vos catalogues fournisseurs depuis CSV, Excel, JSON ou XML. Decouvrez les methodes d'import, le mapping de colonnes, la gestion des erreurs et l'automatisation."
---

Importez vos catalogues fournisseurs depuis differentes sources et dans tous les formats courants. Products Manager APP detecte automatiquement la structure de vos fichiers et vous guide dans le mapping des colonnes. {% .lead %}

---

## Vue d'Ensemble

L'import de produits est l'une des fonctionnalites centrales de Products Manager APP. Il vous permet d'alimenter votre catalogue depuis des fichiers fournis par vos partenaires commerciaux, que ce soit manuellement ou de maniere automatisee.

Le processus d'import comprend cinq etapes principales :

1. **Selection de la source** : choisir le fournisseur et la methode d'import
2. **Upload du fichier** : envoyer le fichier ou le recuperer automatiquement
3. **Mapping des colonnes** : associer les colonnes du fichier aux champs du catalogue
4. **Previsualisation** : verifier les donnees avant traitement
5. **Traitement** : lancer l'import et suivre la progression en temps reel

---

## Methodes d'Import

Products Manager APP propose quatre methodes pour importer vos donnees :

| Methode | Description | Usage recommande |
|---------|-------------|------------------|
| **Upload manuel** | Glisser-deposer ou selection de fichier depuis votre ordinateur | Imports ponctuels, tests de fichiers |
| **FTP / SFTP** | Connexion a un serveur FTP ou SFTP distant | Fournisseurs avec serveur dedie |
| **Email** | Recuperation automatique des pieces jointes via IMAP | Fournisseurs envoyant leurs catalogues par email |
| **HTTP / Webhook** | Telechargement depuis une URL publique ou protegee | Flux de donnees en ligne, API fournisseurs |

---

## Formats Supportes

### Types de Fichiers

| Format | Extensions | Limite lignes | Taille max |
|--------|-----------|---------------|------------|
| CSV | `.csv`, `.txt` | 100 000 lignes | 50 Mo |
| Excel | `.xlsx`, `.xls` | 50 000 lignes | 50 Mo |
| JSON | `.json` | 30 000 objets | 50 Mo |
| XML | `.xml` | 30 000 noeuds | 50 Mo |

### Support des Archives

Products Manager APP accepte egalement les fichiers compresses :

- **ZIP** : archive contenant un seul fichier de donnees
- **GZIP** (.gz) : fichier compresse individuellement

Les archives sont automatiquement decompressees avant traitement. Pour une description detaillee de chaque format, consultez la page [Formats Supportes](/docs/guide/formats-import).

---

## Preparer votre Fichier

### Colonnes Obligatoires

Pour qu'un import soit traite correctement, votre fichier doit contenir au minimum :

| Colonne | Description |
|---------|-------------|
| **Titre / Nom** | Le nom ou titre du produit |
| **EAN ou SKU** | Un identifiant unique : code-barres EAN-13 ou reference fournisseur (SKU) |

{% callout type="note" %}
Si votre fichier ne contient pas de code EAN, Products Manager APP placera les produits dans une **file d'attente de resolution EAN**. Vous pourrez attribuer les EAN manuellement par la suite depuis l'interface.
{% /callout %}

### Colonnes Recommandees

Pour un catalogue complet, ajoutez egalement :

- **Marque** : nom de la marque du produit
- **Prix d'achat HT** : prix fournisseur hors taxes
- **Prix de vente TTC** : prix de vente conseille
- **Description** : description du produit
- **Categorie** : categorie ou famille de produit
- **Stock** : quantite en stock chez le fournisseur
- **Reference fabricant** : reference constructeur (MPN)
- **Poids** et **Dimensions** : informations logistiques
- **URL image** : lien vers l'image principale du produit

### Bonnes Pratiques de Preparation

- Utilisez l'encodage **UTF-8** pour garantir l'affichage correct des caracteres accentues
- Pour les fichiers CSV, privilegiez le **point-virgule** comme separateur (standard europeen)
- Entourez les champs texte contenant des separateurs de **guillemets doubles**
- Verifiez que la **premiere ligne** contient les en-tetes de colonnes
- Supprimez les lignes vides et les lignes de totaux en fin de fichier

---

## Import Manuel Pas a Pas

### 1. Selectionner le Fournisseur

Depuis le menu **Imports**, cliquez sur **Nouvel import**. Selectionnez le fournisseur dans la liste deroulante ou creez-en un nouveau directement depuis cet ecran.

### 2. Uploader le Fichier

Glissez-deposez votre fichier dans la zone prevue ou cliquez pour selectionner un fichier depuis votre ordinateur. Le systeme detecte automatiquement le format, l'encodage et le delimiteur.

### 3. Mapper les Colonnes

L'ecran de mapping affiche les colonnes detectees dans votre fichier. Pour chaque colonne :

- Selectionnez le champ Products Manager correspondant dans la liste deroulante
- Les colonnes reconnues automatiquement sont pre-remplies
- Ignorez les colonnes que vous ne souhaitez pas importer

### 4. Previsualiser les Donnees

Avant de lancer le traitement, l'ecran de previsualisation affiche les premieres lignes du fichier avec le mapping applique. Verifiez que les donnees correspondent aux bons champs. Vous pouvez egalement lancer un **dry run** pour simuler l'import complet sans modifier votre catalogue.

### 5. Lancer l'Import

Cliquez sur **Lancer l'import** pour demarrer le traitement. La barre de progression indique l'avancement en temps reel.

### 6. Suivre la Progression

Pendant le traitement, vous pouvez suivre :

- Le nombre de lignes traitees / total
- Le nombre de produits crees et mis a jour
- Les eventuelles erreurs detectees
- Le temps ecoule et estime restant

A la fin de l'import, un rapport complet est genere avec le detail des resultats.

---

## Mapping Avance

### Sauvegarder les Mappings

Apres avoir configure un mapping, cliquez sur **Sauvegarder comme template** pour le reutiliser lors de vos prochains imports. Les templates sont associes a un fournisseur et sont tries par frequence d'utilisation.

### Transformations

Le mapping avance permet d'appliquer des transformations sur les donnees importees :

| Transformation | Description | Exemple |
|----------------|-------------|---------|
| **Prefixe** | Ajouter un texte au debut de la valeur | `PREF-` + valeur |
| **Suffixe** | Ajouter un texte a la fin de la valeur | valeur + ` kg` |
| **Casse** | Convertir en majuscules, minuscules ou capitalize | `mon produit` vers `Mon Produit` |
| **Rechercher / Remplacer** | Remplacer un texte par un autre | `N/A` vers vide |
| **Formules** | Appliquer un calcul sur les valeurs numeriques | prix HT x 1.20 = prix TTC |

### Valeurs par Defaut

Definissez des valeurs par defaut pour les champs absents du fichier. Par exemple, si votre fichier ne contient pas de colonne **Pays d'origine**, vous pouvez definir `France` comme valeur par defaut pour tous les produits de cet import.

---

## Gestion des Erreurs

### Types d'Erreurs

Lors du traitement, le systeme detecte et reporte les erreurs suivantes :

| Erreur | Description | Solution |
|--------|-------------|----------|
| **EAN invalide** | Le code EAN ne respecte pas le format EAN-13 ou sa somme de controle est incorrecte | Verifiez le code-barres dans votre fichier source |
| **Doublons** | Plusieurs lignes du fichier contiennent le meme EAN | Supprimez les doublons ou choisissez la strategie de gestion adaptee |
| **Prix invalide** | Le prix contient des caracteres non numeriques ou est negatif | Verifiez le format (utilisez le point comme separateur decimal) |
| **Champs manquants** | Un champ obligatoire (titre, EAN/SKU) est vide | Completez les donnees dans votre fichier source |
| **Erreur d'encodage** | Le fichier contient des caracteres illisibles | Convertissez votre fichier en UTF-8 |

### Telecharger le Rapport d'Erreurs

A la fin de chaque import, vous pouvez telecharger un rapport CSV contenant les lignes en erreur avec le detail de chaque probleme. Ce fichier peut etre corrige puis reimporte.

{% callout type="warning" %}
Les lignes en erreur ne sont pas importees. Corrigez les erreurs dans votre fichier source et relancez un import uniquement pour les lignes concernees, ou reimportez le fichier complet en choisissant la strategie **Mettre a jour les existants**.
{% /callout %}

---

## Gestion des Doublons

Lorsqu'un produit importe existe deja dans le catalogue (meme EAN), vous avez trois options :

| Option | Description |
|--------|-------------|
| **Mettre a jour** | Les donnees du fichier ecrasent les donnees existantes (prix, stock, description, etc.) |
| **Ignorer** | Les produits deja existants sont ignores, seuls les nouveaux sont crees |
| **Creer uniquement** | Seuls les produits dont l'EAN n'existe pas dans le catalogue sont importes |

La strategie par defaut est **Mettre a jour**, ce qui convient a la majorite des cas d'usage (mise a jour quotidienne des stocks et prix fournisseurs).

---

## Import Automatique

### Sources Disponibles

L'import automatique recupere et traite les fichiers sans intervention manuelle :

| Source | Configuration |
|--------|--------------|
| **Email** | Adresse IMAP a surveiller, filtre sur l'objet et l'expediteur, types de pieces jointes |
| **FTP** | Hote, port, identifiants, repertoire distant, pattern de fichier |
| **SFTP** | Identique au FTP avec connexion securisee |
| **HTTP / Webhook** | URL de telechargement, methode (GET/POST), authentification optionnelle |

### Configuration

Pour configurer un import automatique :

1. Rendez-vous sur la fiche du fournisseur concerne
2. Cliquez sur l'onglet **Import automatique**
3. Selectionnez le type de source
4. Renseignez les parametres de connexion
5. Definissez le template de mapping a appliquer automatiquement
6. Configurez la planification

### Planification

| Frequence | Description |
|-----------|-------------|
| **Quotidien** | Execution chaque jour a une heure definie |
| **Hebdomadaire** | Execution un jour precis de la semaine |
| **Mensuel** | Execution un jour precis du mois |
| **Expression CRON** | Planification avancee au format CRON (ex : `0 */6 * * *` pour toutes les 6 heures) |

Le fuseau horaire est configurable (par defaut : Europe/Paris).

### Notifications

Configurez des notifications pour etre informe du resultat de chaque import automatique :

- **Succes** : recevez un resume avec le nombre de produits crees et mis a jour
- **Erreur** : recevez une alerte avec le detail des erreurs rencontrees
- **Aucun fichier** : soyez prevenu si aucun fichier n'est trouve a la source

---

## Bonnes Pratiques

### Performance

- Pour les fichiers de plus de **50 000 lignes**, privilegiez le format CSV qui est le plus performant
- Decoupez les fichiers tres volumineux en lots de 50 000 a 100 000 lignes
- Planifiez les imports automatiques en dehors des heures de forte activite (nuit, tot le matin)
- Utilisez la compression **GZIP** pour reduire les temps de transfert sur FTP/SFTP

### Qualite des Donnees

- Effectuez un **dry run** avant chaque premier import d'un nouveau fournisseur
- Verifiez systematiquement le **rapport d'erreurs** apres chaque import
- Harmonisez les noms de marques en amont pour eviter les doublons dans le catalogue
- Utilisez des **templates de mapping** pour garantir la coherence entre les imports successifs d'un meme fournisseur

---

## Documentation Technique

Pour la documentation technique detaillee du module Imports (API, pipeline, architecture), consultez la page [Module Imports](/docs/modules/imports).

---

## Prochaines Etapes

- [Formats Supportes](/docs/guide/formats-import) : Details et specificites de chaque format de fichier
- [Gestion des Fournisseurs](/docs/guide/fournisseurs) : Configurez vos fournisseurs et leurs sources d'import
- [Gestion des Produits](/docs/guide/produits) : Gerez les produits importes dans votre catalogue
- [Exporter vos Produits](/docs/guide/exports) : Distribuez vos produits vers vos canaux de vente
