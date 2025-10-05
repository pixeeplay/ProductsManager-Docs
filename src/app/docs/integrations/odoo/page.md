---
title: Intégration Odoo
nextjs:
  metadata:
    title: Intégration Odoo
    description: Guide complet pour intégrer Products Manager avec Odoo ERP
---

Connectez Products Manager à votre instance Odoo pour une synchronisation bidirectionnelle des produits, stocks et commandes. {% .lead %}

---

## Vue d'ensemble

L'intégration Odoo permet une synchronisation bidirectionnelle complète entre Products Manager et votre ERP Odoo. Cette intégration utilise le protocole **XML-RPC** d'Odoo pour un échange de données fiable et temps réel.

### Fonctionnalités principales

- **Synchronisation bidirectionnelle** : Les modifications dans Products Manager ou Odoo sont propagées automatiquement
- **Gestion des produits** : Synchronisation complète des fiches produits (titre, description, prix, SKU)
- **Gestion des stocks** : Mise à jour temps réel des niveaux de stock
- **Synchronisation des commandes** : Import automatique des commandes depuis Odoo
- **Mapping de catégories** : Correspondance automatique entre les catégories des deux systèmes

---

## Prérequis

### Versions supportées

- **Odoo Community** : 14.0, 15.0, 16.0, 17.0+
- **Odoo Enterprise** : 14.0, 15.0, 16.0, 17.0+
- **Products Manager** : v3.0.0 minimum

### Permissions requises

Votre utilisateur Odoo doit avoir les permissions suivantes :

- **Sales** : User (minimum) ou Manager
- **Inventory** : User (minimum) ou Manager
- **Product** : User avec droits de lecture/écriture

### Informations nécessaires

Avant de commencer, assurez-vous d'avoir :

- URL de votre instance Odoo (ex: `https://votreentreprise.odoo.com`)
- Nom de la base de données Odoo
- Email de connexion
- Mot de passe ou clé API

---

## Configuration étape par étape

### 1. Générer une clé API dans Odoo

{% callout type="warning" title="Recommandation de sécurité" %}
Utilisez une clé API plutôt qu'un mot de passe pour une sécurité renforcée. Les clés API peuvent être révoquées sans changer le mot de passe principal.
{% /callout %}

**Pour Odoo 14.0+ :**

1. Connectez-vous à votre instance Odoo
2. Cliquez sur votre avatar en haut à droite
3. Sélectionnez **Mes préférences**
4. Dans l'onglet **Sécurité du compte**, section **Clés API**
5. Cliquez sur **Nouvelle clé API**
6. Donnez un nom : `Products Manager Integration`
7. Copiez la clé générée (elle ne sera affichée qu'une seule fois)

**Pour Odoo versions antérieures :**

Vous devrez utiliser votre mot de passe Odoo directement.

### 2. Trouver le nom de votre base de données

Le nom de la base de données est visible dans l'URL ou dans les paramètres système :

- **URL** : `https://votredb.odoo.com` → nom de base = `votredb`
- **Multi-tenant** : Contactez votre administrateur Odoo

### 3. Configurer la connexion dans Products Manager

1. Connectez-vous à Products Manager
2. Accédez à **Paramètres** → **Intégrations**
3. Cliquez sur **Ajouter une intégration**
4. Sélectionnez **Odoo**

Remplissez le formulaire :

```json
{
  "name": "Odoo Production",
  "type": "odoo",
  "config": {
    "url": "https://votreentreprise.odoo.com",
    "database": "votredb",
    "username": "votre.email@entreprise.com",
    "api_key": "votre_cle_api_generee",
    "version": "16.0"
  }
}
```

### 4. Tester la connexion

Cliquez sur **Tester la connexion**. Vous devriez voir :

```text
✅ Connexion réussie
✅ Authentification XML-RPC OK
✅ Base de données accessible
✅ Permissions vérifiées
✅ 1,247 produits détectés
```

{% callout type="error" title="Erreur de connexion ?" %}
Si le test échoue, vérifiez :
- L'URL (sans `/` à la fin)
- Le nom exact de la base de données
- Les credentials (email + clé API)
- Que votre pare-feu autorise les connexions XML-RPC (port 8069)
{% /callout %}

### 5. Configurer la synchronisation

Après une connexion réussie, configurez les paramètres de synchronisation :

#### Fréquence de synchronisation

- **Temps réel** : Via webhooks Odoo (recommandé pour Enterprise)
- **Toutes les 5 minutes** : Polling automatique (recommandé pour Community)
- **Toutes les 15 minutes** : Pour les catalogues stables
- **Manuel** : Synchronisation à la demande uniquement

#### Direction de synchronisation

- **Bidirectionnelle** (défaut) : Products Manager ↔ Odoo
- **Odoo → Products Manager** : Import uniquement
- **Products Manager → Odoo** : Export uniquement

#### Champs synchronisés

Sélectionnez les champs à synchroniser :

**Produits :**
- ✅ Nom/Titre (obligatoire)
- ✅ Description
- ✅ SKU/Référence interne
- ✅ Code-barres EAN13
- ✅ Prix de vente
- ✅ Prix d'achat
- ✅ Catégorie
- ✅ Images (URL ou upload)
- ✅ Poids/Dimensions
- ✅ Attributs variants (couleur, taille...)

**Stocks :**
- ✅ Quantité disponible
- ✅ Entrepôt de stockage
- ✅ Seuil d'alerte

**Commandes (optionnel) :**
- ✅ Numéro de commande
- ✅ Client
- ✅ Lignes de commande
- ✅ Statut (brouillon, confirmé, livré)
- ✅ Date de commande

---

## Fonctionnalités synchronisées

### Synchronisation des produits

#### De Odoo vers Products Manager

Lorsqu'un produit est créé ou modifié dans Odoo :

1. Products Manager détecte le changement (webhook ou polling)
2. Le produit est créé/mis à jour automatiquement
3. Les images sont téléchargées et stockées dans MinIO
4. Les catégories sont mappées automatiquement
5. Les variants sont créés comme produits liés

#### De Products Manager vers Odoo

Lorsqu'un produit est créé ou modifié dans Products Manager :

1. Le produit est poussé vers Odoo via XML-RPC
2. Les images sont uploadées sur le serveur Odoo
3. Les catégories sont créées si nécessaire
4. Les stocks sont mis à jour dans l'entrepôt principal

### Synchronisation des catégories

Le mapping de catégories se fait automatiquement :

| Products Manager | Odoo |
|-----------------|------|
| Électronique | All / Saleable / Electronics |
| Vêtements → T-shirts | All / Saleable / Clothing / T-Shirts |
| Accessoires | All / Saleable / Accessories |

Les catégories absentes dans Odoo sont créées automatiquement sous la catégorie racine configurée.

### Synchronisation des stocks en temps réel

Le stock est synchronisé via le module **Stock/Inventory** d'Odoo :

- **Mise à jour Products Manager** : Interroge `stock.quant` toutes les 5 minutes
- **Mise à jour Odoo** : Crée des mouvements de stock via `stock.move`
- **Entrepôt par défaut** : Configurable (ex: "WH/Stock")

{% callout type="note" title="Gestion multi-entrepôts" %}
Si vous avez plusieurs entrepôts Odoo, vous pouvez configurer quel entrepôt synchroniser dans les paramètres avancés.
{% /callout %}

### Synchronisation des commandes

Les commandes Odoo (`sale.order`) peuvent être importées dans Products Manager :

**Données importées :**
- Numéro de commande
- Client (nom, email, adresse)
- Produits commandés (avec quantités)
- Montant total
- Statut (devis, confirmé, livré, annulé)
- Date de commande et date de livraison prévue

**Utilité :**
- Suivi des ventes de produits
- Analytics : produits les plus vendus
- Prévisions de réapprovisionnement

---

## Mapping avancé des champs

### Produits : correspondance des champs

| Odoo | Products Manager | Notes |
|------|-----------------|-------|
| `name` | `title` | Obligatoire |
| `default_code` | `sku` | Référence interne |
| `barcode` | `ean` | EAN13/UPC |
| `list_price` | `price` | Prix de vente TTC |
| `standard_price` | `cost_price` | Prix d'achat HT |
| `categ_id` | `category_id` | Mapping automatique |
| `image_1920` | `images[0].url` | Image principale |
| `description_sale` | `description` | Description commerciale |
| `weight` | `weight` | En kg |

### Stocks : correspondance des champs

| Odoo | Products Manager | Notes |
|------|-----------------|-------|
| `qty_available` | `stock_quantity` | Stock disponible |
| `virtual_available` | - | Non synchronisé |
| `incoming_qty` | - | Non synchronisé |
| `outgoing_qty` | - | Non synchronisé |

---

## Troubleshooting courant

### Erreur : "Database not found"

**Cause :** Le nom de la base de données est incorrect.

**Solution :**
```python
# Tester le nom de la base avec ce script Python
import xmlrpc.client
url = "https://votreentreprise.odoo.com"
db = xmlrpc.client.ServerProxy(f"{url}/xmlrpc/2/db")
print(db.list())  # Affiche toutes les bases disponibles
```

### Erreur : "Access Denied"

**Causes possibles :**
- Email ou mot de passe incorrect
- Clé API expirée ou révoquée
- Utilisateur désactivé dans Odoo
- Authentification à deux facteurs (2FA) activée

**Solutions :**
1. Vérifiez vos credentials dans Odoo
2. Générez une nouvelle clé API
3. Désactivez temporairement 2FA pour les API (dans les préférences)

### Les images ne se synchronisent pas

**Causes :**
- Taille d'image trop grande (>10 MB)
- Format non supporté (utilisez JPG, PNG, WebP)
- Timeout réseau

**Solutions :**
- Compressez les images avant upload
- Augmentez le timeout dans la config (défaut : 60s)
- Vérifiez que MinIO est accessible

### Les stocks ne se mettent pas à jour

**Causes :**
- Entrepôt mal configuré
- Permissions insuffisantes sur `stock.quant`
- Stock négatif dans Odoo (bloqué par validation)

**Solutions :**
```python
# Vérifier l'entrepôt configuré
GET /api/v1/integrations/odoo/warehouses
# Réponse attendue :
[
  {"id": 1, "name": "WH/Stock", "code": "WH"},
  {"id": 2, "name": "Shop", "code": "SHOP"}
]

# Changer l'entrepôt par défaut
PATCH /api/v1/integrations/odoo/config
{
  "default_warehouse_id": 1
}
```

### Synchronisation lente (>1000 produits)

**Optimisations :**

1. **Activer le cache Redis** pour éviter les appels répétés
2. **Synchronisation incrémentale** : Ne synchroniser que les produits modifiés depuis la dernière sync
3. **Parallélisation** : Configurez `sync_workers: 4` dans les paramètres avancés
4. **Filtrer les catégories** : Ne synchronisez que certaines catégories Odoo

```json
{
  "sync_config": {
    "incremental": true,
    "cache_enabled": true,
    "workers": 4,
    "category_filter": [1, 5, 12]  // IDs des catégories Odoo
  }
}
```

---

## Limites connues

### Limites techniques

- **Limite de produits** : Aucune limite technique, testé jusqu'à 50,000 produits
- **Limite d'images** : 10 images max par produit (limitation Odoo)
- **Timeout XML-RPC** : 120 secondes par requête (configurable)
- **Taille d'image** : 10 MB max par image

### Fonctionnalités non supportées

- **Comptabilité Odoo** : Non synchronisée (hors scope)
- **CRM/Leads** : Non synchronisés
- **Manufacturing (MRP)** : Nomenclatures non supportées
- **Multi-devise** : Seule la devise par défaut d'Odoo est synchronisée
- **Multi-société** : Une seule société Odoo par intégration

### Différences comportementales

| Comportement | Odoo | Products Manager | Note |
|-------------|------|-----------------|------|
| Produits archivés | `active=False` | Suppression logique | Réconciliation possible |
| Prix TTC/HT | Configurable | Toujours TTC | Conversion automatique selon config Odoo |
| Unités de mesure | Multiples (kg, L, etc.) | Simple quantité | Conversion manuelle nécessaire |

---

## Webhooks Odoo (Enterprise uniquement)

Pour une synchronisation en temps réel sans polling, configurez les webhooks Odoo :

### 1. Installer le module Webhooks

Dans Odoo Enterprise, installez le module **Webhooks** depuis les Apps.

### 2. Créer un webhook pour les produits

1. Allez dans **Paramètres** → **Technique** → **Automation** → **Webhooks**
2. Créez un nouveau webhook :

```text
Nom: Products Manager - Product Update
Modèle: Product Template (product.template)
Trigger: On Create, On Update
URL: https://votre-products-manager.com/api/v1/webhooks/odoo/products
Méthode: POST
Authentification: Bearer Token
Token: <votre_webhook_secret>
```

### 3. Créer un webhook pour les stocks

```text
Nom: Products Manager - Stock Update
Modèle: Stock Quant (stock.quant)
Trigger: On Update
URL: https://votre-products-manager.com/api/v1/webhooks/odoo/stock
Méthode: POST
Authentification: Bearer Token
Token: <votre_webhook_secret>
```

Le webhook secret est disponible dans Products Manager :
**Paramètres** → **Intégrations** → **Odoo** → **Webhook Secret**

---

## Sécurité

### Bonnes pratiques

- ✅ Utilisez toujours des clés API plutôt que des mots de passe
- ✅ Créez un utilisateur Odoo dédié pour Products Manager (ex: `productsmanager@entreprise.com`)
- ✅ Limitez les permissions au strict nécessaire (lecture/écriture produits et stocks)
- ✅ Activez SSL/TLS sur votre instance Odoo (HTTPS obligatoire)
- ✅ Renouvelez les clés API tous les 6 mois
- ✅ Surveillez les logs de connexion dans Odoo

### Chiffrement

- Les credentials sont stockés chiffrés (AES-256) dans Products Manager
- Les connexions utilisent TLS 1.2+ obligatoire
- Les clés API ne sont jamais loggées en clair

---

## Ressources

### Documentation officielle

- [Odoo External API](https://www.odoo.com/documentation/16.0/developer/api/external_api.html)
- [XML-RPC Protocol](https://www.odoo.com/documentation/16.0/developer/api/external_api.html#xml-rpc-library)
- [Odoo Product Model](https://www.odoo.com/documentation/16.0/developer/reference/backend/orm.html#model-product-template)

### Support

- **Email** : integrations@productsmanager.com
- **Documentation** : [https://docs.productsmanager.com](https://docs.productsmanager.com)
- **Status** : [https://status.productsmanager.com](https://status.productsmanager.com)

---

## Prochaines étapes

Après avoir configuré l'intégration Odoo :

1. [Configurer la synchronisation automatique](/docs/integrations/sync-automation)
2. [Mapper les catégories](/docs/integrations/category-mapping)
3. [Configurer les notifications](/docs/integrations/notifications)
4. [Consulter les analytics](/docs/analytics/overview)
