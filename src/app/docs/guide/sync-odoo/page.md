---
title: Synchronisation Odoo
nextjs:
  metadata:
    title: Synchronisation Odoo - Guide Utilisateur Products Manager APP
    description: "Synchronisez vos produits entre Products Manager APP et Odoo ERP. Configuration, mapping des champs, synchronisation bidirectionnelle et gestion des conflits."
---

Synchronisez vos produits de maniere bidirectionnelle entre Products Manager APP et votre ERP Odoo pour centraliser la gestion de votre catalogue. {% .lead %}

---

## Introduction

La synchronisation avec Odoo vous permet de maintenir vos donnees produits a jour entre Products Manager APP et votre instance Odoo ERP. Contrairement aux exports ponctuels vers les plateformes e-commerce, la synchronisation Odoo est **bidirectionnelle** : les modifications effectuees dans l'un ou l'autre systeme sont propagees automatiquement.

Cette integration est particulierement utile pour les entreprises qui utilisent Odoo comme systeme central de gestion (ventes, stocks, achats) et Products Manager comme plateforme de gestion du catalogue e-commerce.

---

## Prerequis

Avant de commencer, assurez-vous de disposer des elements suivants :

- Une **instance Odoo** operationnelle (Community ou Enterprise, version 14.0 ou superieure)
- Le **module API** active sur votre instance Odoo
- Les **identifiants API** Odoo (email et cle API ou mot de passe)
- Un utilisateur Odoo avec les permissions sur les modules **Ventes**, **Inventaire** et **Produits**

{% callout type="note" %}
Products Manager APP supporte Odoo Community et Enterprise. Cependant, la synchronisation en temps reel via webhooks n'est disponible que sur Odoo Enterprise. Odoo Community utilise le polling (interrogation periodique).
{% /callout %}

---

## Configuration de la connexion

### Informations requises

Pour configurer la connexion entre Products Manager APP et Odoo, vous avez besoin de :

| Information | Description | Exemple |
|-------------|-------------|---------|
| **URL** | Adresse de votre instance Odoo | `https://votreentreprise.odoo.com` |
| **Base de donnees** | Nom de la base de donnees Odoo | `votreentreprise` |
| **Login** | Adresse email de l'utilisateur Odoo | `utilisateur@entreprise.com` |
| **Cle API** | Cle API generee dans Odoo | Chaine de caracteres unique |

### Generer une cle API dans Odoo

1. Connectez-vous a votre instance Odoo
2. Cliquez sur votre avatar en haut a droite
3. Selectionnez **Mes preferences**
4. Dans l'onglet **Securite du compte**, section **Cles API**
5. Cliquez sur **Nouvelle cle API**
6. Nommez-la `Products Manager Integration`
7. Copiez la cle generee (elle ne sera affichee qu'une seule fois)

{% callout type="warning" %}
Privilegiez l'utilisation d'une cle API plutot qu'un mot de passe. Les cles API peuvent etre revoquees individuellement sans impacter le mot de passe principal du compte.
{% /callout %}

### Configurer la connexion dans Products Manager

1. Accedez a **Parametres** > **Integrations** dans Products Manager APP
2. Cliquez sur **Ajouter une integration**
3. Selectionnez **Odoo**
4. Renseignez les informations de connexion (URL, base de donnees, login, cle API)
5. Cliquez sur **Tester la connexion**
6. Si le test est reussi, cliquez sur **Enregistrer**

Le test de connexion verifie :

- L'accessibilite de votre instance Odoo via le protocole XML-RPC
- La validite des identifiants
- Les permissions de l'utilisateur
- Le nombre de produits detectes dans Odoo

{% callout type="note" %}
Si vous n'avez pas encore configure la connexion Odoo, consultez la [documentation technique de l'integration Odoo](/docs/integrations/odoo) pour les instructions detaillees de configuration.
{% /callout %}

---

## Champs synchronises

Les champs suivants sont synchronises entre Products Manager APP et Odoo :

| Champ | Products Manager | Odoo | Direction |
|-------|-----------------|------|-----------|
| Nom du produit | `title` | `name` | Bidirectionnelle |
| Reference interne | `sku` | `default_code` | Bidirectionnelle |
| Prix de vente | `price` | `list_price` | Bidirectionnelle |
| Code-barres | `ean` | `barcode` | Bidirectionnelle |
| Description | `description` | `description_sale` | Bidirectionnelle |
| Categorie | `category` | `categ_id` | Bidirectionnelle |
| Quantite en stock | `stock_quantity` | `qty_available` | Bidirectionnelle |
| Prix d'achat | `cost_price` | `standard_price` | Bidirectionnelle |
| Poids | `weight` | `weight` | Bidirectionnelle |
| Image principale | `images[0].url` | `image_1920` | Bidirectionnelle |
| Statut actif | `is_active` | `active` | Bidirectionnelle |

---

## Synchronisation bidirectionnelle

### Products Manager vers Odoo

Lorsqu'un produit est cree ou modifie dans Products Manager APP :

1. Le systeme detecte la modification
2. Les donnees du produit sont preparees au format Odoo
3. L'appel XML-RPC est envoye vers Odoo (creation ou mise a jour)
4. Les images sont transferees vers le serveur Odoo
5. Les stocks sont mis a jour dans l'entrepot configure
6. Les categories sont creees dans Odoo si elles n'existent pas

### Odoo vers Products Manager

Lorsqu'un produit est cree ou modifie dans Odoo :

1. Products Manager detecte le changement (via webhook ou polling)
2. Les donnees du produit sont recuperees depuis Odoo
3. Le produit est cree ou mis a jour dans Products Manager
4. Les images sont telechargees depuis Odoo vers le stockage MinIO
5. Les categories sont mappees automatiquement
6. Les variantes sont creees comme produits lies si applicable

---

## Mapping des champs

### Mapping par defaut

Products Manager APP propose un mapping par defaut qui couvre les champs les plus courants. Vous pouvez personnaliser ce mapping dans les parametres de l'integration.

### Mapping personnalise

Pour adapter le mapping a vos besoins :

1. Accedez a **Parametres** > **Integrations** > **Odoo** > **Mapping des champs**
2. Pour chaque champ Products Manager, selectionnez le champ Odoo correspondant
3. Configurez les transformations si necessaire (conversion de prix, formatage)
4. Enregistrez le mapping

### Champs personnalises Odoo

Si vous utilisez des champs personnalises dans Odoo (champs `x_`), vous pouvez les inclure dans le mapping :

| Products Manager | Odoo (champ personnalise) | Description |
|-----------------|--------------------------|-------------|
| `custom_field_1` | `x_custom_field_1` | Champ personnalise 1 |
| `custom_field_2` | `x_custom_field_2` | Champ personnalise 2 |

---

## Planification de la synchronisation

### Frequences disponibles

Configurez la frequence de synchronisation selon vos besoins :

| Frequence | Description | Recommandation |
|-----------|-------------|----------------|
| **Temps reel** | Via webhooks Odoo (Enterprise) | Catalogues a mise a jour frequente |
| **Toutes les 5 minutes** | Polling automatique | Recommande pour Odoo Community |
| **Toutes les 15 minutes** | Polling moderee | Catalogues stables |
| **Toutes les heures** | Polling legere | Boutiques avec peu de modifications |
| **Manuel** | A la demande uniquement | Tests et synchronisations ponctuelles |

### Configurer la planification

1. Accedez a **Parametres** > **Integrations** > **Odoo** > **Synchronisation**
2. Selectionnez la **frequence** souhaitee
3. Definissez la **direction** (bidirectionnelle, Odoo vers PM, ou PM vers Odoo)
4. Choisissez les **categories** a synchroniser (toutes ou selection)
5. Activez la planification

### Synchronisation incrementale

Par defaut, Products Manager utilise la synchronisation **incrementale** : seuls les produits modifies depuis la derniere synchronisation sont traites. Ce mode est recommande pour les performances.

La synchronisation **complete** (tous les produits) peut etre lancee manuellement depuis le tableau de bord de l'integration.

---

## Gestion des conflits

Lorsqu'un produit est modifie simultanement dans Products Manager et dans Odoo, un conflit de synchronisation peut survenir. Products Manager APP gere ces conflits selon la strategie configuree.

### Strategies de resolution

| Strategie | Description | Cas d'usage |
|-----------|-------------|-------------|
| **Priorite Products Manager** | Les donnees de Products Manager ecrasent celles d'Odoo | Products Manager est la source principale du catalogue |
| **Priorite Odoo** | Les donnees d'Odoo ecrasent celles de Products Manager | Odoo est la source principale (ERP central) |
| **Derniere modification** | La version la plus recente est conservee | Les deux systemes sont utilises de maniere equivalente |
| **Manuel** | Le conflit est signale et l'utilisateur decide | Donnees sensibles necessitant une validation humaine |

### Configurer la strategie

1. Accedez a **Parametres** > **Integrations** > **Odoo** > **Gestion des conflits**
2. Selectionnez la strategie de resolution par defaut
3. Optionnellement, definissez des strategies specifiques par champ (ex : prix toujours depuis Odoo, description toujours depuis Products Manager)

{% callout type="note" %}
En cas de conflit resolu automatiquement, un journal d'audit est cree pour tracer la decision prise. Vous pouvez consulter l'historique des conflits dans le tableau de bord de l'integration.
{% /callout %}

---

## Verification de la synchronisation

### Tableau de bord de synchronisation

Depuis **Parametres** > **Integrations** > **Odoo**, vous disposez d'un tableau de bord qui affiche :

- Le **statut** de la synchronisation (active, en pause, en erreur)
- La **date de la derniere synchronisation** reussie
- Le **nombre de produits** synchronises
- Les **erreurs** recentes et leur detail
- Les **conflits** en attente de resolution manuelle

### Verifications manuelles

Pour vous assurer que la synchronisation fonctionne correctement :

1. **Modifiez un produit** dans Products Manager et verifiez qu'il est mis a jour dans Odoo
2. **Modifiez un produit** dans Odoo et verifiez qu'il est mis a jour dans Products Manager
3. **Creez un produit** dans l'un des systemes et verifiez qu'il apparait dans l'autre
4. **Verifiez les stocks** : modifiez une quantite dans un systeme et verifiez la propagation
5. **Verifiez les categories** : assurez-vous que les categories sont correctement mappees

---

## Erreurs courantes et solutions

| Erreur | Cause probable | Solution |
|--------|---------------|----------|
| "Database not found" | Nom de base de donnees incorrect | Verifiez le nom exact de la base dans l'URL Odoo |
| "Access Denied" | Identifiants invalides ou utilisateur desactive | Regenerez une cle API ou verifiez le compte |
| "Connection timeout" | Instance Odoo inaccessible ou pare-feu | Verifiez l'URL et les regles de pare-feu (port 8069) |
| "Field not found" | Champ personnalise absent dans Odoo | Verifiez que le module contenant le champ est installe |
| "Image sync failed" | Image trop volumineuse ou format non supporte | Reduisez l'image a moins de 10 Mo, utilisez JPG ou PNG |
| "Stock update rejected" | Stock negatif non autorise par Odoo | Verifiez les parametres de validation de stock dans Odoo |
| "Category mapping failed" | Categorie inexistante dans le systeme cible | Activez la creation automatique de categories dans les parametres |

{% callout type="warning" %}
Si vous rencontrez des erreurs repetees de type "Connection timeout", verifiez que votre instance Odoo autorise les connexions XML-RPC entrantes et que le port 8069 est ouvert dans votre pare-feu.
{% /callout %}

---

## Prochaines etapes

- [Documentation technique Odoo](/docs/integrations/odoo) : reference complete de l'integration Odoo
- [Exporter vos Produits](/docs/guide/exports) : vue d'ensemble de toutes les options d'export
- [Export Shopify](/docs/guide/export-shopify) : exporter vers les plateformes e-commerce
- [Gestion des Produits](/docs/guide/produits) : preparer vos produits avant la synchronisation
