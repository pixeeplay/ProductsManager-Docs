---
title: Workflow d'Import Complet
nextjs:
  metadata:
    title: Workflow d'Import Complet - Products Manager APP
    description: Guide complet pour importer vos produits - upload manuel, mapping, templates, imports automatises FTP/SFTP/Email/HTTP et planification.
---

Maitrisez le processus complet d'import de produits : upload manuel, mapping des colonnes, templates reutilisables, imports automatises et planification. {% .lead %}

---

## Vue d'Ensemble

Products Manager supporte plusieurs methodes d'import :

- **Upload manuel** : CSV, Excel directement depuis votre navigateur
- **FTP/SFTP** : Recuperation automatique depuis un serveur
- **Email** : Reception de fichiers par email dedie
- **HTTP/Webhook** : Telechargement depuis une URL

---

## Formats Supportes

### Formats de Fichiers

| Format | Extensions | Encodage | Taille max |
|--------|------------|----------|------------|
| **CSV** | `.csv` | UTF-8 (recommande), Latin-1 | 50 MB |
| **Excel** | `.xlsx`, `.xls` | - | 50 MB |
| **JSON** | `.json` | UTF-8 | 50 MB |
| **XML** | `.xml` | UTF-8 | 50 MB |

### Archives Supportees

Products Manager peut decompresser automatiquement :

- **ZIP** (`.zip`)
- **GZIP** (`.gz`)

### Limites Recommandees

| Format | Lignes max | Performance optimale |
|--------|------------|---------------------|
| CSV | 100,000 | moins de 50,000 lignes |
| Excel | 50,000 | moins de 20,000 lignes |
| JSON | 50,000 | moins de 20,000 objets |
| XML | 50,000 | moins de 20,000 elements |

---

## Import Manuel

### Etape 1 : Lancer un Import

1. Cliquez sur **Imports** dans le menu
2. Cliquez sur **+ Nouvel import**
3. Selectionnez ou creez un fournisseur

### Etape 2 : Charger le Fichier

1. **Glissez-deposez** votre fichier dans la zone
2. Ou cliquez pour **parcourir** vos fichiers
3. Le fichier est analyse automatiquement

{% callout type="note" %}
Le systeme detecte automatiquement l'encodage et le separateur de votre fichier CSV.
{% /callout %}

### Etape 3 : Mapper les Colonnes

L'assistant de mapping s'affiche pour associer vos colonnes aux champs Products Manager :

#### Colonnes Obligatoires

| Colonne | Description | Exemples de noms |
|---------|-------------|------------------|
| **Titre/Nom** | Nom du produit | `title`, `name`, `nom`, `product_name` |
| **EAN ou SKU** | Identifiant unique | `ean`, `sku`, `reference`, `barcode` |

#### Colonnes Recommandees

| Colonne | Description | Exemples de noms |
|---------|-------------|------------------|
| **Description** | Description produit | `description`, `desc` |
| **Prix** | Prix de vente | `price`, `prix`, `prix_ttc` |
| **Marque** | Marque fabricant | `brand`, `marque` |
| **Categorie** | Categorie produit | `category`, `categorie` |
| **Stock** | Quantite disponible | `stock`, `quantity`, `qty` |
| **Poids** | Poids en kg | `weight`, `poids` |
| **Image URL** | URL de l'image | `image`, `image_url`, `photo` |

#### Actions de Mapping

Pour chaque colonne de votre fichier :

- **Mapper** : Associer a un champ Products Manager
- **Ignorer** : Ne pas importer cette colonne
- **Creer un champ personnalise** : Pour les attributs specifiques

### Etape 4 : Apercu et Validation

1. Verifiez l'**apercu** des 10 premieres lignes
2. Corrigez les erreurs signalees en rouge
3. Cliquez sur **Lancer l'import**

### Etape 5 : Suivi de l'Import

Pendant l'import, suivez la progression :

- **Barre de progression** : Pourcentage de completion
- **Produits traites** : Nombre actuel / total
- **Produits crees** : Nouveaux produits
- **Produits mis a jour** : Produits existants modifies
- **Erreurs** : Lignes en erreur
- **Temps estime** : Duree restante estimee

---

## Mapping Avance

### Sauvegarder un Mapping

1. Apres avoir configure le mapping
2. Cliquez sur **Sauvegarder ce mapping**
3. Donnez-lui un nom (ex: "Import Fournisseur A")
4. Il sera reutilisable pour les prochains imports

{% callout type="note" %}
Les mappings sauvegardes sont associes au fournisseur et appliques automatiquement lors des imports automatises.
{% /callout %}

### Transformations de Donnees

Products Manager peut appliquer des transformations automatiques :

| Transformation | Description | Exemple |
|----------------|-------------|---------|
| **Prefixe** | Ajoute un texte avant | `PRD-` + valeur |
| **Suffixe** | Ajoute un texte apres | valeur + `-FR` |
| **Majuscules** | Convertit en majuscules | `abc` -> `ABC` |
| **Minuscules** | Convertit en minuscules | `ABC` -> `abc` |
| **Remplacer** | Remplace du texte | `e` -> `e` |
| **Formule** | Calcul sur les valeurs | `prix * 1.2` |

### Valeurs par Defaut

Definissez des valeurs par defaut pour les colonnes absentes :

- **Stock** : 0 si non specifie
- **Statut** : "Actif" par defaut
- **TVA** : 20% par defaut

---

## Templates de Mapping

### Creer un Template

Les templates permettent de reutiliser une configuration de mapping :

1. Configurez votre mapping complet
2. Cliquez sur **Sauvegarder comme template**
3. Nommez le template
4. Selectionnez le fournisseur (optionnel)

### Utiliser un Template

1. Lors d'un nouvel import
2. Cliquez sur **Charger un template**
3. Selectionnez le template souhaite
4. Le mapping est applique automatiquement

### Templates par Fournisseur

Associez un template a un fournisseur pour :

- Application automatique lors des imports manuels
- Utilisation automatique pour les imports planifies
- Coherence des donnees entre les imports

---

## Imports Automatises

### Sources Supportees

| Source | Configuration requise |
|--------|----------------------|
| **FTP** | Hote, port, identifiants |
| **SFTP** | Hote, port, cle SSH ou mot de passe |
| **Email** | Adresse email dediee |
| **HTTP/Webhook** | URL du fichier |

### Configuration FTP/SFTP

1. Ouvrez la fiche fournisseur
2. Onglet **Automation**
3. Cliquez sur **+ Nouvelle automation**
4. Selectionnez **FTP** ou **SFTP**

#### Parametres FTP

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Hote** | Adresse du serveur | `ftp.fournisseur.com` |
| **Port** | Port de connexion | 21 (FTP) ou 22 (SFTP) |
| **Utilisateur** | Login | `votre_login` |
| **Mot de passe** | Mot de passe | `********` |
| **Dossier** | Chemin du fichier | `/exports/products/` |
| **Pattern fichier** | Filtre des fichiers | `*.csv`, `export*.xlsx` |

{% callout type="warning" %}
Preferez SFTP a FTP pour une connexion securisee et chiffree.
{% /callout %}

### Configuration Email

1. Dans l'automation, selectionnez **Email**
2. Une adresse email dediee est generee :

```text
import-fournisseurA@votre-domaine.productsmanager.app
```

3. Le fournisseur envoie ses fichiers a cette adresse
4. Les pieces jointes sont traitees automatiquement

#### Options Email

- Filtrer par objet (regex)
- Traiter automatiquement les pieces jointes
- Notifier en cas d'erreur

### Configuration HTTP/URL

1. Dans l'automation, selectionnez **HTTP**
2. Configurez :

| Champ | Description |
|-------|-------------|
| **URL** | URL du fichier a telecharger |
| **Methode** | GET (par defaut) |
| **Authentification** | Aucune, Bearer Token, Basic Auth |
| **Headers** | Headers HTTP personnalises |

#### Exemple avec Bearer Token

```text
URL: https://api.fournisseur.com/export/products.csv
Authentification: Bearer Token
Token: votre-token-api
```

---

## Planification des Imports

### Configurer un Planning

1. Dans la fiche fournisseur, onglet **Automation**
2. Activez la source (FTP, Email, HTTP)
3. Section **Planification**

### Options de Frequence

| Frequence | Description | Exemple |
|-----------|-------------|---------|
| **A la demande** | Declenchement manuel | - |
| **Quotidien** | Tous les jours a heure fixe | 6h00 |
| **Hebdomadaire** | Jour et heure de la semaine | Lundi 9h00 |
| **Mensuel** | Jour du mois | 1er a minuit |
| **Personnalise** | Expression CRON | `0 6 * * 1-5` |

### Expressions CRON

| Expression | Description |
|------------|-------------|
| `0 6 * * *` | Tous les jours a 6h00 |
| `0 6 * * 1-5` | Lun-Ven a 6h00 |
| `0 */4 * * *` | Toutes les 4 heures |
| `0 0 1 * *` | Premier jour du mois a minuit |

### Notifications

Configurez les alertes pour chaque automation :

- [ ] Import reussi
- [ ] Import avec erreurs
- [ ] Import echoue
- [ ] Fichier non trouve

{% callout type="note" %}
Les notifications peuvent etre envoyees par email ou affichees dans l'interface.
{% /callout %}

---

## Suivi de Progression

### Tableau de Bord des Imports

Depuis **Imports**, visualisez :

- **Imports en cours** : Progression en temps reel
- **Derniers imports** : Historique avec statuts
- **Imports planifies** : Prochaines executions

### Statuts d'Import

| Statut | Description |
|--------|-------------|
| **En attente** | Planifie, pas encore execute |
| **En cours** | Execution en cours |
| **Termine** | Complete avec succes |
| **Termine avec erreurs** | Complete mais avec des erreurs |
| **Echoue** | Echec total de l'import |

### Rapport d'Import

Pour chaque import termine :

1. Cliquez sur l'import dans la liste
2. Consultez le rapport :
   - **Resume** : Crees, mis a jour, erreurs
   - **Erreurs** : Liste detaillee avec ligne et cause
   - **Fichier original** : Telechargement disponible
   - **Logs** : Historique technique

---

## Gestion des Erreurs

### Types d'Erreurs

| Erreur | Cause | Solution |
|--------|-------|----------|
| **EAN invalide** | Format incorrect | Verifier 13 chiffres |
| **Doublon** | EAN deja existant | Choisir "Mettre a jour" |
| **Prix invalide** | Format non numerique | Utiliser le point decimal |
| **Champ requis manquant** | Titre ou EAN absent | Completer le fichier |
| **Encodage** | Caracteres corrompus | Convertir en UTF-8 |

### Options de Gestion des Doublons

| Option | Comportement |
|--------|--------------|
| **Mettre a jour** | Ecrase les donnees existantes |
| **Ignorer** | Garde les donnees actuelles |
| **Creer uniquement** | N'importe que les nouveaux |
| **Signaler** | Marque comme erreur |

### Telecharger le Rapport d'Erreurs

1. Apres l'import, cliquez sur **Voir le rapport**
2. Section **Erreurs** : liste detaillee
3. Cliquez sur **Telecharger les erreurs (CSV)**
4. Corrigez et reimportez

---

## Bonnes Pratiques

### Preparation du Fichier

1. **Encodage UTF-8** : Evite les problemes d'accents
2. **Separateur** : Virgule (`,`) ou point-virgule (`;`)
3. **Guillemets** : Encadrez les textes contenant des virgules
4. **Dates** : Format ISO `YYYY-MM-DD`
5. **Prix** : Point comme separateur decimal (`29.99`)

### Performance

1. **Divisez les gros fichiers** : moins de 50,000 lignes par import
2. **Planifiez en heures creuses** : Nuit ou week-end
3. **Utilisez le CSV** : Format le plus rapide
4. **Limitez les colonnes** : N'importez que le necessaire

### Qualite des Donnees

1. **Nettoyez avant l'import** : Supprimez les lignes vides
2. **Standardisez les formats** : Dates, prix, codes
3. **Verifiez les EAN** : Utilisez un validateur
4. **Testez d'abord** : Import de 100 lignes test

### Securite

1. **Protegez les acces FTP** : Changez les mots de passe regulierement
2. **Utilisez SFTP** : Plutot que FTP non chiffre
3. **Verifiez les sources** : Ne configurez que des sources de confiance

---

## Troubleshooting

### Le fichier n'est pas reconnu

**Causes possibles** :

- Extension incorrecte
- Fichier corrompu
- Encodage non supporte

**Solutions** :

1. Verifiez l'extension du fichier
2. Ouvrez et re-enregistrez avec Excel/LibreOffice
3. Convertissez en UTF-8

### L'import est bloque

**Causes possibles** :

- Fichier trop volumineux
- Erreurs multiples
- Timeout serveur

**Solutions** :

1. Divisez le fichier en parties
2. Verifiez les erreurs dans le rapport
3. Reessayez ulterieurement

### Les accents sont mal affiches

**Cause** : Encodage incorrect

**Solutions** :

1. Ouvrez le CSV dans un editeur de texte
2. Sauvegardez en UTF-8
3. Ou specifiez l'encodage lors de l'import

### Le fichier FTP n'est pas recupere

**Causes possibles** :

- Identifiants incorrects
- Chemin de fichier incorrect
- Pattern de nom ne correspond pas

**Solutions** :

1. Testez la connexion manuellement
2. Verifiez le chemin exact
3. Ajustez le pattern (ex: `*.csv` vs `export*.csv`)

---

## Historique des Imports

### Consulter l'Historique

1. **Imports** dans le menu
2. Liste des imports par date
3. Filtrez par :
   - Fournisseur
   - Statut
   - Periode

### Details d'un Import

Pour chaque import :

- **Date et heure** d'execution
- **Source** : Manuel, automatique, fournisseur
- **Resume** : Nombre de produits crees, mis a jour, erreurs
- **Duree** : Temps d'execution
- **Actions** : Voir le rapport, telecharger le fichier original

---

## Prochaines Etapes

- [Gestion des Produits](/docs/user-guides/products) - Gerer votre catalogue
- [Workflow d'Export](/docs/user-guides/exports-workflow) - Exporter vers vos plateformes
- [Enrichissement IA](/docs/features/ai-enrichment) - Ameliorer vos fiches produits
