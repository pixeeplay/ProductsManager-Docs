---
title: Formats Supportes
nextjs:
  metadata:
    title: Formats Supportes - Guide Utilisateur Products Manager APP
    description: "Decouvrez les formats de fichiers acceptes pour l'import de produits dans Products Manager APP : CSV, Excel, JSON, XML et archives. Limites, encodage et bonnes pratiques."
---

Products Manager APP accepte les formats de fichiers les plus courants pour l'import de catalogues fournisseurs. Chaque format a ses avantages et ses limites selon votre volume de donnees et vos outils. {% .lead %}

---

## Vue d'Ensemble

Le systeme d'import supporte quatre formats de fichiers ainsi que deux types d'archives compressees. La detection du format est automatique : il vous suffit d'uploader votre fichier et Products Manager APP identifie le type, l'encodage et la structure des colonnes.

Pour lancer un import, consultez la page [Importer des Produits](/docs/guide/imports).

---

## CSV

### Description

Le format **CSV** (Comma-Separated Values) est le format le plus utilise pour l'echange de donnees tabulaires. Chaque ligne represente un produit et les colonnes sont separees par un caractere delimiteur.

### Specifications

| Parametre | Valeur |
|-----------|--------|
| Extensions | `.csv`, `.txt` |
| Encodage recommande | UTF-8 |
| Separateurs supportes | Virgule (`,`), point-virgule (`;`), tabulation |
| Limite | 100 000 lignes |
| Taille max | 50 Mo |

Products Manager APP detecte automatiquement le delimiteur utilise dans votre fichier. Toutefois, pour les fichiers europeens contenant des prix avec des virgules decimales, le **point-virgule** est fortement recommande comme separateur de colonnes.

### Exemple de Structure

```csv
EAN;Titre;Marque;Prix_HT;Stock;Categorie
3760001234567;Casque audio Bluetooth;AudioTech;29.90;150;Audio
3760009876543;Souris sans fil ergonomique;PeriphPlus;19.50;300;Peripheriques
3760005551234;Clavier mecanique RGB;KeyMaster;79.00;45;Peripheriques
```

### Avantages

- Format le plus leger et le plus rapide a traiter
- Compatible avec tous les tableurs et outils de donnees
- Limite la plus elevee : 100 000 lignes par fichier
- Ideal pour les exports automatises depuis les ERP fournisseurs

---

## Excel

### Description

Le format **Excel** permet d'importer directement des fichiers issus de Microsoft Excel ou LibreOffice Calc, sans conversion prealable.

### Specifications

| Parametre | Valeur |
|-----------|--------|
| Extensions | `.xlsx`, `.xls` |
| Limite | 50 000 lignes |
| Taille max | 50 Mo |
| Onglets | Plusieurs onglets supportes |

Lorsque le fichier contient plusieurs onglets, Products Manager APP vous propose de selectionner celui a importer. Les formules Excel sont evaluees et seules les valeurs resultantes sont importees.

### Avantages

- Aucune conversion necessaire depuis Excel
- Support des onglets multiples pour organiser les donnees
- Mise en forme preservee pour la previsualisation
- Format natif pour de nombreux fournisseurs

{% callout type="note" %}
Si votre fichier Excel depasse 50 000 lignes, exportez-le au format CSV depuis Excel (Fichier > Enregistrer sous > CSV UTF-8) pour beneficier de la limite etendue a 100 000 lignes.
{% /callout %}

---

## JSON

### Description

Le format **JSON** (JavaScript Object Notation) est adapte aux echanges programmatiques entre systemes. Chaque produit est represente par un objet dans un tableau.

### Specifications

| Parametre | Valeur |
|-----------|--------|
| Extension | `.json` |
| Structure attendue | Tableau d'objets (`[{...}, {...}]`) |
| Limite | 30 000 objets |
| Taille max | 50 Mo |

### Exemple de Structure

```json
[
  {
    "ean": "3760001234567",
    "title": "Casque audio Bluetooth",
    "brand": "AudioTech",
    "price_ht": 29.90,
    "stock": 150,
    "category": "Audio"
  },
  {
    "ean": "3760009876543",
    "title": "Souris sans fil ergonomique",
    "brand": "PeriphPlus",
    "price_ht": 19.50,
    "stock": 300,
    "category": "Peripheriques"
  }
]
```

### Avantages

- Structure claire et non ambigue (pas de probleme de delimiteur)
- Support des types de donnees natifs (nombres, booleens, tableaux)
- Ideal pour les integrations API et les flux automatises
- Structures imbriquees supportees

---

## XML

### Description

Le format **XML** (eXtensible Markup Language) est utilise dans certains contextes industriels et pour les echanges EDI. Chaque produit est represente par un noeud XML.

### Specifications

| Parametre | Valeur |
|-----------|--------|
| Extension | `.xml` |
| Limite | 30 000 noeuds |
| Taille max | 50 Mo |

### Exemple de Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <ean>3760001234567</ean>
    <title>Casque audio Bluetooth</title>
    <brand>AudioTech</brand>
    <price_ht>29.90</price_ht>
    <stock>150</stock>
    <category>Audio</category>
  </product>
  <product>
    <ean>3760009876543</ean>
    <title>Souris sans fil ergonomique</title>
    <brand>PeriphPlus</brand>
    <price_ht>19.50</price_ht>
    <stock>300</stock>
    <category>Peripheriques</category>
  </product>
</products>
```

### Avantages

- Standard largement adopte dans les echanges B2B et EDI
- Validation possible via schema XSD
- Compatible avec les systemes anciens et les ERP industriels

---

## Archives

### Description

Products Manager APP accepte les fichiers compresses pour reduire les temps de transfert, particulierement utile pour les gros fichiers envoyes par FTP/SFTP ou email.

### Formats Supportes

| Format | Extension | Description |
|--------|-----------|-------------|
| **ZIP** | `.zip` | Archive contenant un seul fichier de donnees |
| **GZIP** | `.gz` | Fichier compresse individuellement |

Les archives sont automatiquement decompressees avant analyse et traitement. L'archive doit contenir exactement **un seul fichier** de donnees dans l'un des formats supportes (CSV, Excel, JSON ou XML).

### Avantages

- Reduction significative de la taille des fichiers (jusqu'a 80% pour les CSV)
- Transferts plus rapides sur FTP/SFTP et par email
- Particulierement utile pour les fichiers CSV volumineux
- Decompression transparente et automatique

{% callout type="warning" %}
Les archives contenant plusieurs fichiers ne sont pas supportees. Si votre fournisseur envoie une archive multi-fichiers, demandez-lui de n'inclure qu'un seul fichier de donnees ou extrayez manuellement le fichier souhaite avant l'import.
{% /callout %}

---

## Tableau Comparatif

| Format | Extension | Limite lignes | Taille max | Recommande pour |
|--------|-----------|---------------|------------|-----------------|
| CSV | `.csv`, `.txt` | 100 000 | 50 Mo | Gros volumes, imports quotidiens, automatisation |
| Excel | `.xlsx`, `.xls` | 50 000 | 50 Mo | Fichiers fournisseurs natifs, catalogues manuels |
| JSON | `.json` | 30 000 | 50 Mo | Integrations API, flux programmatiques |
| XML | `.xml` | 30 000 | 50 Mo | Echanges EDI, systemes industriels |
| ZIP | `.zip` | selon contenu | 50 Mo | Compression de gros fichiers pour le transfert |
| GZIP | `.gz` | selon contenu | 50 Mo | Compression de fichiers CSV volumineux |

---

## Encodage et Caracteres Speciaux

### Encodage Recommande

L'encodage **UTF-8** est recommande pour tous les formats de fichiers. Il garantit l'affichage correct des caracteres accentues francais (e, a, u, c, etc.) et des caracteres speciaux internationaux.

### Conversion depuis d'Autres Encodages

Products Manager APP detecte automatiquement l'encodage du fichier. Les conversions suivantes sont gerees :

| Encodage source | Description | Notes |
|-----------------|-------------|-------|
| **UTF-8** | Standard recommande | Aucune conversion necessaire |
| **Windows-1252** | Encodage par defaut de Windows/Excel francais | Conversion automatique |
| **ISO-8859-1** (Latin-1) | Encodage europeen classique | Conversion automatique |

{% callout type="note" %}
Si vous constatez des caracteres mal affiches apres un import (ex : `Ã©` au lieu de `e`), votre fichier est probablement en UTF-8 mais a ete detecte comme un autre encodage. Resauvegardez-le explicitement en UTF-8 depuis votre editeur de texte ou tableur.
{% /callout %}

---

## Bonnes Pratiques par Format

### CSV

- Utilisez le **point-virgule** comme separateur pour les fichiers contenant des prix avec virgule decimale
- Entourez les champs texte de **guillemets doubles** s'ils contiennent le caractere separateur
- Assurez-vous que la **premiere ligne** contient les en-tetes de colonnes
- Sauvegardez toujours en **UTF-8** depuis votre tableur

### Excel

- Verifiez que les codes EAN ne sont pas convertis en notation scientifique (formatez la colonne en **Texte**)
- Supprimez les lignes de totaux et les lignes vides en fin de fichier
- Si vous utilisez plusieurs onglets, placez les donnees a importer dans le **premier onglet**
- Evitez les cellules fusionnees qui perturbent la detection des colonnes

### JSON

- Validez la structure de votre fichier avec un outil en ligne avant l'import
- Utilisez des **cles de propriete coherentes** et en minuscules (ex : `price_ht`, `stock`)
- Evitez les structures trop profondement imbriquees (un niveau d'imbrication maximum recommande)

### XML

- Incluez la declaration d'encodage en en-tete : `<?xml version="1.0" encoding="UTF-8"?>`
- Utilisez un noeud racine unique englobant tous les noeuds produit
- Nommez les noeuds produit de maniere coherente (ex : `<product>`, `<item>`, `<article>`)

---

## Documentation Technique

Pour la documentation technique detaillee sur le pipeline d'import et les formats (parseurs, validation, API), consultez la page [Module Imports](/docs/modules/imports).

---

## Prochaines Etapes

- [Importer des Produits](/docs/guide/imports) : Lancez votre premier import pas a pas
- [Gestion des Fournisseurs](/docs/guide/fournisseurs) : Configurez vos fournisseurs et leurs sources d'import
- [Gestion des Produits](/docs/guide/produits) : Gerez les produits importes dans votre catalogue
