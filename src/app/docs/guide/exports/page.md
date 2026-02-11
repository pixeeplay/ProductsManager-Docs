---
title: Exporter vos Produits
nextjs:
  metadata:
    title: Exporter vos Produits - Guide Utilisateur Products Manager APP
    description: "Exportez et distribuez vos produits vers les principales plateformes e-commerce depuis Products Manager APP. Formats CSV, Excel, JSON et integrations natives."
---

Exportez vos produits vers les principales plateformes e-commerce, en fichier local ou vers le cloud, directement depuis Products Manager APP. {% .lead %}

---

## Vue d'ensemble

Le module **Exports** de Products Manager APP vous permet de distribuer votre catalogue produits vers l'ensemble de vos canaux de vente. Que vous souhaitiez generer un fichier pour un traitement interne ou alimenter directement une marketplace, le systeme d'export centralise toutes vos operations de distribution.

L'export peut etre realise en une seule operation manuelle ou planifie pour s'executer automatiquement a intervalles reguliers. Les exports volumineux sont traites en arriere-plan avec suivi de progression en temps reel.

---

## Destinations d'export

Products Manager APP prend en charge plusieurs types de destinations pour vos exports :

| Destination | Description | Cas d'usage |
|-------------|-------------|-------------|
| **Fichier local** | Telechargement direct depuis le navigateur | Export ponctuel, analyse manuelle |
| **MinIO** | Stockage objet interne de la plateforme | Archivage, partage entre equipes |
| **Amazon S3** | Stockage cloud AWS | Integration avec pipelines externes |
| **Shopify** | Export natif vers votre boutique Shopify | Synchronisation catalogue e-commerce |
| **WooCommerce** | Export natif vers WordPress/WooCommerce | Synchronisation catalogue e-commerce |
| **PrestaShop** | Export natif vers votre boutique PrestaShop | Synchronisation catalogue e-commerce |
| **Amazon** | Export vers Amazon Seller Central | Publication sur marketplace Amazon |
| **Odoo** | Synchronisation avec votre ERP Odoo | Centralisation des donnees produits |

---

## Formats disponibles

### CSV

Le format CSV est le plus universel pour l'echange de donnees produits :

- Encodage UTF-8 avec BOM pour compatibilite Excel
- Separateur configurable (point-virgule, virgule, tabulation)
- Selection des champs a inclure ou exclure
- Mode streaming pour les catalogues volumineux (plus de 10 000 produits)

### Excel (.xlsx)

Le format Excel est adapte aux traitements manuels et aux partages internes :

- Support multi-feuilles (produits, fournisseurs, categories)
- Formatage automatique des en-tetes et des colonnes
- Selection de champs configurable
- Limite recommandee : 50 000 lignes par fichier

### JSON

Le format JSON est destine aux integrations techniques et aux API :

- Mode standard ou JSON Lines (un objet par ligne)
- Pretty-printing optionnel pour la lisibilite
- Inclusion des relations imbriquees (fournisseurs, categories)
- Mode streaming disponible pour les grands volumes

---

## Creer un export pas a pas

### 1. Acceder au module Exports

Depuis le menu principal de Products Manager APP, cliquez sur **Exports** dans la barre de navigation laterale. Vous accedez au tableau de bord des exports qui affiche l'historique de vos exports recents et leur statut.

### 2. Choisir la plateforme de destination

Cliquez sur **Nouvel export** et selectionnez la destination souhaitee parmi les plateformes disponibles. Si vous souhaitez exporter vers une plateforme e-commerce (Shopify, WooCommerce, PrestaShop, Amazon), assurez-vous que la connexion est configuree au prealable dans **Parametres** > **Integrations**.

### 3. Selectionner les produits

Choisissez les produits a exporter selon plusieurs criteres :

- **Tous les produits** : exporte l'integralite du catalogue
- **Par categorie** : selectionnez une ou plusieurs categories
- **Par fournisseur** : filtrez par fournisseur
- **Par statut** : produits actifs, inactifs ou tous
- **Selection manuelle** : cochez individuellement les produits souhaites
- **Par filtre avance** : utilisez les filtres de recherche pour affiner la selection

### 4. Configurer le mapping des champs

Definissez la correspondance entre les champs de Products Manager et ceux de la plateforme de destination. Vous pouvez :

- Utiliser le mapping par defaut propose par Products Manager
- Personnaliser la correspondance champ par champ
- Appliquer des transformations (format de prix, concatenation, valeurs par defaut)
- Sauvegarder votre mapping sous forme de template reutilisable

### 5. Lancer l'export

Cliquez sur **Lancer l'export**. Pour les petits volumes (moins de 1 000 produits), le fichier est genere immediatement. Pour les volumes importants, l'export est traite en arriere-plan et vous pouvez suivre la progression en temps reel depuis le tableau de bord des exports.

{% callout type="note" %}
Une fois l'export termine, vous recevez une notification dans l'application. Le fichier reste disponible au telechargement pendant 30 jours dans l'historique des exports.
{% /callout %}

---

## Planification des exports

### Frequences disponibles

La planification permet d'automatiser vos exports a intervalles reguliers :

| Frequence | Description | Cas d'usage |
|-----------|-------------|-------------|
| **Quotidien** | Export chaque jour a une heure definie | Catalogues a mise a jour frequente |
| **Hebdomadaire** | Export un jour precis de la semaine | Mises a jour regulieres mais moderees |
| **Mensuel** | Export un jour precis du mois | Rapports mensuels, archivage |
| **Expression cron** | Planification avancee personnalisee | Besoins specifiques (toutes les 6h, etc.) |

### Destinations de livraison

Les exports planifies peuvent etre livres automatiquement vers plusieurs destinations :

- **Email** : le fichier est envoye en piece jointe ou via un lien de telechargement
- **FTP / SFTP** : depot automatique sur un serveur FTP ou SFTP distant
- **Webhook** : notification HTTP avec lien de telechargement vers un systeme tiers
- **Stockage cloud** : depot dans MinIO ou Amazon S3

### Configurer un export planifie

1. Depuis le module **Exports**, cliquez sur **Planifier un export**
2. Configurez les parametres de l'export (produits, format, mapping)
3. Definissez la frequence et l'heure d'execution
4. Choisissez la destination de livraison
5. Activez le schedule

{% callout type="warning" %}
Les exports planifies s'executent dans le fuseau horaire Europe/Paris par defaut. Vous pouvez modifier le fuseau horaire dans les parametres avances du schedule.
{% /callout %}

---

## Templates d'export

### Sauvegarder un template personnalise

Lorsque vous configurez un export, vous pouvez sauvegarder l'ensemble des parametres (format, champs, mapping, filtres) sous forme de template reutilisable :

1. Configurez votre export normalement
2. Avant de lancer, cliquez sur **Sauvegarder comme template**
3. Donnez un nom explicite au template (ex : "Export Shopify - Catalogue complet")
4. Le template apparait dans la liste lors de vos prochains exports

### Templates predefinis

Products Manager APP fournit des templates predefinis pour les plateformes les plus courantes :

- **Shopify Standard** : mapping complet vers les champs Shopify
- **WooCommerce Standard** : mapping adapte a l'API WooCommerce
- **PrestaShop Standard** : mapping compatible avec le Webservice PrestaShop
- **Amazon Flat File** : format tabulaire compatible Amazon Seller Central
- **Google Shopping** : format adapte au flux Google Merchant Center

---

## Gestion des images dans les exports

### Modes d'inclusion des images

Lors de l'export, les images de vos produits peuvent etre incluses de differentes manieres :

| Mode | Description | Avantages |
|------|-------------|-----------|
| **URLs** | Les URLs des images sont incluses dans le fichier | Fichier leger, adapte aux plateformes e-commerce |
| **Base64** | Les images sont encodees directement dans le fichier | Fichier autonome, pas de dependance reseau |
| **ZIP separe** | Les images sont exportees dans un fichier ZIP a part | Controle total sur les fichiers images |

### Optimisation des images

Avant l'export, vous pouvez appliquer des optimisations automatiques aux images :

- **Redimensionnement** : definir une taille maximale (ex : 1200x1200 pixels)
- **Format** : convertir automatiquement en JPEG, PNG ou WebP
- **Qualite** : ajuster le taux de compression (recommande : 85%)
- **Renommage** : renommer les fichiers images selon un schema (SKU, EAN, etc.)

{% callout type="note" %}
Pour les exports vers les plateformes e-commerce, le mode URLs est recommande. Les images doivent etre accessibles publiquement pour que la plateforme de destination puisse les recuperer.
{% /callout %}

---

## Bonnes pratiques

Pour garantir la qualite de vos exports, suivez ces recommandations :

1. **Verifiez vos donnees** : avant de lancer un export, assurez-vous que les champs obligatoires sont remplis en utilisant le [score de completude](/docs/guide/produits)
2. **Validez les images** : verifiez que les URLs des images sont accessibles et que les formats sont compatibles avec la plateforme cible
3. **Testez sur un echantillon** : lancez un premier export sur un petit nombre de produits (10-20) pour valider le mapping et le format
4. **Planifiez aux heures creuses** : pour les exports volumineux, programmez l'execution en dehors des heures de pointe (nuit, week-end)
5. **Utilisez les templates** : sauvegardez vos configurations d'export en templates pour garantir la coherence entre les exports
6. **Surveillez les erreurs** : consultez le journal des exports pour identifier et corriger rapidement les eventuels problemes

---

## Guides par plateforme

Pour des instructions detaillees par plateforme de destination, consultez les guides dedies :

- [Export Shopify](/docs/guide/export-shopify) : exporter vers votre boutique Shopify
- [Export WooCommerce](/docs/guide/export-woocommerce) : exporter vers WordPress/WooCommerce
- [Export PrestaShop](/docs/guide/export-prestashop) : exporter vers votre boutique PrestaShop
- [Export Amazon](/docs/guide/export-amazon) : exporter vers Amazon Seller Central
- [Synchronisation Odoo](/docs/guide/sync-odoo) : synchroniser avec votre ERP Odoo

---

## Prochaines etapes

- [Documentation technique du module Exports](/docs/modules/exports) : reference complete de l'API et des fonctionnalites techniques
- [Gestion des Produits](/docs/guide/produits) : preparer vos produits avant l'export
- [Importer des Produits](/docs/guide/imports) : alimenter votre catalogue avant de distribuer
