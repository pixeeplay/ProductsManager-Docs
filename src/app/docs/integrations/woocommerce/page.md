---
title: Intégration WooCommerce
nextjs:
  metadata:
    title: Intégration WooCommerce
    description: Guide complet pour intégrer Products Manager avec votre boutique WooCommerce
---

Synchronisez automatiquement vos produits entre Products Manager et votre boutique WooCommerce via l'API REST v3. {% .lead %}

---

## Vue d'ensemble

L'intégration WooCommerce permet une synchronisation bidirectionnelle entre Products Manager et votre boutique WordPress/WooCommerce. Grâce à l'API REST WooCommerce v3, gérez vos produits, stocks et catégories de manière centralisée.

### Fonctionnalités principales

- **Synchronisation bidirectionnelle** : Products Manager ↔ WooCommerce
- **Gestion des produits** : Titre, description, prix, SKU, images, variations
- **Gestion des stocks** : Synchronisation temps réel des quantités
- **Catégories** : Mapping automatique avec taxonomie WordPress
- **Webhooks** : Mises à jour instantanées via webhooks WooCommerce
- **Variations** : Support complet des produits variables (taille, couleur, etc.)

---

## Prérequis

### Versions supportées

- **WooCommerce** : 4.0+ (WooCommerce REST API v3)
- **WordPress** : 5.5 minimum (6.0+ recommandé)
- **PHP** : 7.4 minimum (8.0+ recommandé)
- **Products Manager** : v3.0.0 minimum

### Extensions requises

- **WooCommerce** plugin activé
- **Permaliens WordPress** configurés (pas de "?p=123")
- **HTTPS** activé (obligatoire pour API WooCommerce)

### Informations nécessaires

- URL de votre boutique WordPress (ex: `https://maboutique.com`)
- Accès admin WordPress/WooCommerce
- Permissions pour générer des clés API

---

## Configuration étape par étape

### 1. Activer l'API REST WooCommerce

{% callout type="note" title="Activation automatique" %}
L'API REST WooCommerce est activée par défaut depuis WooCommerce 3.0+. Aucune action nécessaire.
{% /callout %}

Vérifiez que l'API est accessible :

```bash
# Testez l'endpoint API
curl https://maboutique.com/wp-json/wc/v3/

# Réponse attendue :
{
  "namespace": "wc/v3",
  "routes": {...}
}
```

### 2. Générer des clés API WooCommerce

1. Connectez-vous au tableau de bord WordPress
2. Allez dans **WooCommerce** → **Paramètres** → **Avancé** → **API REST**
3. Cliquez sur **Ajouter une clé**
4. Remplissez le formulaire :
   - **Description** : `Products Manager Integration`
   - **Utilisateur** : Sélectionnez votre compte admin
   - **Permissions** : **Lecture/Écriture**
5. Cliquez sur **Générer la clé API**
6. Copiez immédiatement :
   - **Clé consommateur (Consumer Key)** : `ck_xxxxxxxxxxxxxxxx`
   - **Clé secrète (Consumer Secret)** : `cs_xxxxxxxxxxxxxxxx`

{% callout type="warning" title="Sauvegardez vos clés" %}
La clé secrète n'est affichée qu'une seule fois. Si vous la perdez, vous devrez en générer une nouvelle.
{% /callout %}

### 3. Configurer la connexion dans Products Manager

1. Connectez-vous à Products Manager
2. Allez dans **Paramètres** → **Intégrations**
3. Cliquez sur **Ajouter une intégration**
4. Sélectionnez **WooCommerce**

Remplissez le formulaire :

```json
{
  "name": "WooCommerce Boutique",
  "type": "woocommerce",
  "config": {
    "shop_url": "https://maboutique.com",
    "consumer_key": "ck_xxxxxxxxxxxxxxxx",
    "consumer_secret": "cs_xxxxxxxxxxxxxxxx",
    "api_version": "wc/v3"
  }
}
```

### 4. Tester la connexion

Cliquez sur **Tester la connexion** :

```
✅ Connexion à maboutique.com réussie
✅ Authentification WooCommerce OK
✅ API REST v3 détectée
✅ 3,245 produits trouvés
✅ 18 catégories disponibles
✅ WordPress version : 6.4.2
✅ WooCommerce version : 8.5.1
```

{% callout type="error" title="Erreur de connexion ?" %}
Si le test échoue, vérifiez :
- L'URL est correcte (avec https://)
- Les permaliens WordPress sont configurés (pas de "?p=123")
- Les clés Consumer Key et Consumer Secret sont exactes
- Le plugin WooCommerce est activé
- Aucun plugin de sécurité ne bloque l'API REST
{% /callout %}

### 5. Configurer la synchronisation

#### Fréquence de synchronisation

- **Temps réel (webhooks)** : Recommandé, synchronisation instantanée
- **Toutes les 5 minutes** : Polling de secours si webhooks indisponibles
- **Manuel** : Synchronisation à la demande uniquement

#### Direction de synchronisation

- **Bidirectionnelle** (défaut) : Products Manager ↔ WooCommerce
- **WooCommerce → Products Manager** : Import uniquement
- **Products Manager → WooCommerce** : Export uniquement

#### Champs à synchroniser

**Produits simples :**
- ✅ Nom
- ✅ Description (courte et complète)
- ✅ SKU
- ✅ Prix régulier et prix promo
- ✅ Stock
- ✅ Catégories
- ✅ Tags
- ✅ Images
- ✅ Poids/Dimensions
- ✅ Statut (publié, brouillon, privé)

**Produits variables :**
- ✅ Variations (taille, couleur, etc.)
- ✅ Prix par variation
- ✅ Stock par variation
- ✅ SKU par variation

---

## Fonctionnalités synchronisées

### Synchronisation des produits

#### Mapping des champs

| WooCommerce | Products Manager | Notes |
|------------|-----------------|-------|
| `name` | `title` | Nom du produit |
| `description` | `description` | Description complète (HTML) |
| `short_description` | `short_description` | Description courte |
| `sku` | `sku` | Référence unique |
| `regular_price` | `price` | Prix de vente |
| `sale_price` | `sale_price` | Prix promotionnel |
| `manage_stock` | - | Toujours true dans PM |
| `stock_quantity` | `stock_quantity` | Quantité disponible |
| `categories` | `category_id` | Catégories (array) |
| `tags` | `tags[]` | Tags produit |
| `images` | `images[]` | URLs des images |
| `weight` | `weight` | Poids en kg |
| `status` | `is_active` | published/draft/private |

#### De WooCommerce vers Products Manager

Lors de la synchronisation depuis WooCommerce :

1. **Webhook déclenché** : `product.created` ou `product.updated`
2. **Réception** : Products Manager reçoit la notification instantanément
3. **Traitement** : Produit créé/mis à jour dans PM
4. **Images** : Téléchargées depuis WordPress Media Library vers MinIO
5. **Variations** : Créées comme produits liés au produit parent

#### De Products Manager vers WooCommerce

Lors de la synchronisation vers WooCommerce :

1. **Validation** : Vérification des champs obligatoires (nom, prix)
2. **API Call** : `POST /wp-json/wc/v3/products` ou `PUT /wp-json/wc/v3/products/{id}`
3. **Images** : Upload vers WordPress Media Library
4. **Publication** : Produit publié selon paramètres
5. **Webhook retour** : Confirmation de création reçue

### Synchronisation des variations

WooCommerce utilise un système de **variations** pour les produits variables :

**Exemple :** Sac à dos avec 2 couleurs et 2 tailles = 4 variations

| Variation | SKU | Prix | Stock |
|-----------|-----|------|-------|
| Noir / Petit | BAG-BLACK-S | 49.99€ | 15 |
| Noir / Grand | BAG-BLACK-L | 59.99€ | 10 |
| Bleu / Petit | BAG-BLUE-S | 49.99€ | 8 |
| Bleu / Grand | BAG-BLUE-L | 59.99€ | 5 |

**Synchronisation :**

- **Option 1 (Défaut)** : 4 produits séparés dans PM avec relation parent
- **Option 2** : 1 produit avec 4 variations (requiert module variants dans PM)

### Synchronisation des stocks

Le stock est synchronisé via l'API WooCommerce :

**Mise à jour temps réel :**

1. **Webhook** : `product.updated` déclenché par WooCommerce
2. **Réception** : Products Manager détecte le changement de stock
3. **Inverse** : Modification dans PM → API call `PUT /wp-json/wc/v3/products/{id}`

**Stock tracking :**

```json
{
  "manage_stock": true,
  "stock_quantity": 50,
  "stock_status": "instock",  // instock | outofstock | onbackorder
  "backorders": "no"  // no | notify | yes
}
```

### Synchronisation des catégories

Les catégories WooCommerce sont mappées aux catégories Products Manager :

| WooCommerce | Products Manager |
|------------|-----------------|
| Électronique | Catégories/Électronique |
| Vêtements → Hommes | Catégories/Vêtements/Hommes |
| Promotions | Catégories/Promotions |

**Création automatique :**

Si une catégorie n'existe pas dans WooCommerce, elle est créée via `POST /wp-json/wc/v3/products/categories`.

### Images et médias

**Upload automatique :**

Lorsque vous ajoutez une image dans Products Manager :

1. Image uploadée sur MinIO (stockage interne PM)
2. Image transférée vers WordPress Media Library via API
3. Image associée au produit WooCommerce
4. URL WordPress stockée dans PM pour référence

**Formats supportés :** JPG, PNG, WebP, GIF
**Taille max :** Dépend de la configuration WordPress (8 MB par défaut)
**Limite :** Illimité (recommandé : <10 images/produit)

**API Call :**

```bash
POST /wp-json/wc/v3/products/{id}
{
  "images": [
    {"src": "https://minio.pm.com/products/image1.jpg"},
    {"src": "https://minio.pm.com/products/image2.jpg"}
  ]
}
```

---

## Webhooks WooCommerce

Products Manager enregistre automatiquement les webhooks suivants lors de la configuration :

### Webhooks configurés

| Webhook Topic | URL | Action |
|--------------|-----|--------|
| `product.created` | `/api/v1/webhooks/woocommerce/products/create` | Importe nouveau produit |
| `product.updated` | `/api/v1/webhooks/woocommerce/products/update` | Met à jour produit |
| `product.deleted` | `/api/v1/webhooks/woocommerce/products/delete` | Archive produit |
| `product.restored` | `/api/v1/webhooks/woocommerce/products/restore` | Restaure produit |

### Configuration manuelle des webhooks

Si les webhooks ne sont pas créés automatiquement :

1. Dans WordPress, allez dans **WooCommerce** → **Paramètres** → **Avancé** → **Webhooks**
2. Cliquez sur **Ajouter un webhook**
3. Configurez :
   - **Nom** : `Products Manager - Product Created`
   - **Statut** : ✅ Actif
   - **Sujet** : `Product created`
   - **URL de livraison** : `https://votre-pm.com/api/v1/webhooks/woocommerce/products/create`
   - **Secret** : (généré automatiquement, copiez-le dans Products Manager)
   - **Version API** : WP REST API Integration v3
4. Répétez pour `product.updated`, `product.deleted`, `product.restored`

### Sécurité des webhooks

Les webhooks WooCommerce sont sécurisés via signature HMAC-SHA256 :

```php
// Vérification automatique par Products Manager
function verify_woocommerce_webhook($payload, $signature, $secret) {
    $expected = base64_encode(hash_hmac('sha256', $payload, $secret, true));
    return hash_equals($expected, $signature);
}
```

### Vérifier les webhooks

Dans WooCommerce Admin :

1. **WooCommerce** → **Paramètres** → **Avancé** → **Webhooks**
2. Vérifiez que les 4 webhooks Products Manager sont **Actifs**
3. Cliquez sur un webhook pour voir l'historique des livraisons
4. Statut : ✅ 200 OK (vert) = fonctionnel

---

## Limites et quotas

### Limites WooCommerce API

WooCommerce n'impose pas de rate limit strict par défaut, mais dépend de la configuration serveur :

| Limite | Valeur typique | Configurable via |
|--------|---------------|-----------------|
| **Requêtes/minute** | 600 (10/s) | Plugin rate limiting |
| **Timeout** | 30 secondes | php.ini |
| **Mémoire PHP** | 256 MB | php.ini |
| **Upload max** | 8 MB | php.ini |

**Gestion par Products Manager :**

- Rate limiting intelligent (max 5 req/s par défaut)
- Retry automatique avec exponential backoff
- Queue de synchronisation pour gros catalogues

### Limites produits

- **Variations** : 50 variations max par produit (recommandé, configurable)
- **Images** : Pas de limite stricte (recommandé : <10)
- **Attributs** : Illimité
- **Catégories** : Illimité (hiérarchie à plusieurs niveaux)

### Limites de synchronisation

- **Sync initiale** : ~200-500 produits/minute (selon serveur)
- **Webhooks** : Temps réel (<2 secondes)
- **Polling** : 5 minutes minimum entre syncs

---

## Troubleshooting courant

### Erreur : "woocommerce_rest_cannot_view"

**Cause :** Permissions insuffisantes sur les clés API.

**Solution :**

1. Allez dans **WooCommerce** → **Paramètres** → **Avancé** → **API REST**
2. Trouvez la clé API Products Manager
3. Vérifiez que **Permissions** = **Lecture/Écriture**
4. Si besoin, régénérez une nouvelle clé

### Erreur : "Sorry, you are not allowed to do that"

**Cause :** Utilisateur WordPress associé à la clé n'a pas les permissions admin.

**Solution :**

1. Créez une nouvelle clé API
2. Sélectionnez un utilisateur avec rôle **Administrateur**
3. Permissions : **Lecture/Écriture**

### Les webhooks ne se déclenchent pas

**Diagnostic :**

```bash
# Vérifiez les webhooks actifs
curl -X GET "https://maboutique.com/wp-json/wc/v3/webhooks" \
  -u "ck_xxxxx:cs_xxxxx"

# Testez manuellement un webhook
curl -X POST https://votre-pm.com/api/v1/webhooks/woocommerce/products/create \
  -H "Content-Type: application/json" \
  -H "X-WC-Webhook-Signature: test" \
  -d '{"id": 123, "name": "Test Product"}'
```

**Solutions :**

1. Vérifiez que les webhooks sont **Actifs** dans WooCommerce
2. Vérifiez l'historique de livraison dans WooCommerce (erreurs 4xx/5xx ?)
3. Réenregistrez les webhooks depuis Products Manager

### Les images ne se synchronisent pas

**Causes :**
- Taille >8 MB (limite WordPress par défaut)
- Format non supporté (BMP, TIFF, etc.)
- Permissions insuffisantes sur `/wp-content/uploads/`

**Solutions :**

```php
// Augmenter la limite d'upload dans wp-config.php
@ini_set('upload_max_size', '64M');
@ini_set('post_max_size', '64M');
@ini_set('max_execution_time', '300');

// Ou dans .htaccess
php_value upload_max_filesize 64M
php_value post_max_size 64M
```

### Synchronisation lente

**Optimisations :**

1. **Pagination** : Synchroniser par lots de 50 produits
2. **Cache WordPress** : Activer un plugin de cache (WP Rocket, W3 Total Cache)
3. **PHP OpCache** : Activer OpCache dans php.ini
4. **Base de données** : Optimiser les index MySQL

```json
{
  "sync_config": {
    "batch_size": 50,
    "concurrent_requests": 2,
    "cache_enabled": true
  }
}
```

---

## Cas d'usage avancés

### 1. Synchronisation par statut

Synchronisez uniquement les produits publiés :

```json
{
  "sync_filters": {
    "status": "publish",  // publish | draft | private
    "stock_status": "instock"
  }
}
```

### 2. Mapping prix avec marges

Appliquez une marge sur prix d'achat :

```json
{
  "price_rules": {
    "base_price": "cost_price",
    "margin_percent": 40,
    "round_to": 0.99,
    "sale_price_discount": 10  // -10% sur prix régulier
  }
}
```

### 3. Synchronisation sélective par catégorie

```json
{
  "category_filter": {
    "include_categories": [15, 22, 45],  // IDs WooCommerce
    "exclude_categories": []
  }
}
```

### 4. Multi-sites WordPress

Si vous utilisez WordPress Multisite :

```json
{
  "multisite_config": {
    "enabled": true,
    "site_id": 1,
    "sync_all_sites": false
  }
}
```

---

## Sécurité

### Bonnes pratiques

- ✅ Utilisez HTTPS obligatoirement
- ✅ Créez des clés API dédiées pour chaque intégration
- ✅ Permissions : Lecture/Écriture uniquement (pas d'admin)
- ✅ Renouvelez les clés tous les 6 mois
- ✅ Activez un plugin de sécurité (Wordfence, iThemes Security)
- ✅ Limitez les tentatives de connexion API
- ✅ Surveillez les logs WordPress

### Chiffrement

- Les clés API sont stockées chiffrées (AES-256) dans Products Manager
- Les connexions utilisent TLS 1.2+ obligatoire
- Les webhooks sont signés HMAC-SHA256

### Plugins de sécurité compatibles

- **Wordfence** : Whitelist l'IP de Products Manager
- **iThemes Security** : Autoriser l'API REST
- **Sucuri** : Whitelist l'user-agent Products Manager

---

## Ressources

### Documentation officielle

- [WooCommerce REST API Documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [WooCommerce Webhooks](https://woocommerce.com/document/webhooks/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

### Outils de développement

- [Postman Collection WooCommerce](https://www.postman.com/woocommerce) : Tester l'API
- [WooCommerce API Console](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction) : Documentation interactive
- [WP-CLI](https://wp-cli.org/) : Ligne de commande WordPress

### Plugins recommandés

- **WP REST API Controller** : Gérer les permissions API
- **WP Webhooks** : Webhooks avancés
- **WP-Optimize** : Optimisation base de données

### Support

- **Email** : integrations@productsmanager.com
- **Documentation** : [https://docs.productsmanager.com](https://docs.productsmanager.com)
- **Support WooCommerce** : [https://woocommerce.com/my-account/create-a-ticket/](https://woocommerce.com/my-account/create-a-ticket/)

---

## Prochaines étapes

Après avoir configuré l'intégration WooCommerce :

1. [Configurer les webhooks](/docs/integrations/webhooks)
2. [Optimiser les images produits](/docs/media/image-optimization)
3. [Configurer les variations](/docs/catalog/product-variations)
4. [Consulter les analytics](/docs/analytics/overview)
