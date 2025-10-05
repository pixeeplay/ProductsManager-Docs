---
title: Intégration Shopify
nextjs:
  metadata:
    title: Intégration Shopify
    description: Guide complet pour intégrer Products Manager avec votre boutique Shopify
---

Synchronisez automatiquement vos produits entre Products Manager et votre boutique Shopify avec mises à jour en temps réel. {% .lead %}

---

## Vue d'ensemble

L'intégration Shopify permet une synchronisation bidirectionnelle entre Products Manager et votre boutique Shopify. Grâce à l'API Shopify Admin et aux webhooks, vos produits, stocks et catégories sont toujours à jour.

### Fonctionnalités principales

- **Synchronisation temps réel** : Webhooks Shopify pour mises à jour instantanées
- **Gestion des produits** : Titre, description, prix, SKU, codes-barres, variants
- **Gestion des stocks** : Synchronisation multi-emplacements avec inventaires Shopify
- **Images optimisées** : Upload automatique vers Shopify CDN
- **Collections** : Mapping automatique avec les catégories Products Manager
- **Variants** : Support complet des variantes (taille, couleur, etc.)

---

## Prérequis

### Versions supportées

- **Shopify Plans** : Basic, Shopify, Advanced, Plus
- **Shopify Admin API** : Version 2023-04 ou supérieure
- **Products Manager** : v3.0.0 minimum

### Permissions requises

L'application Products Manager nécessite les permissions Shopify suivantes :

- `read_products` : Lecture des produits
- `write_products` : Création/modification de produits
- `read_inventory` : Lecture des stocks
- `write_inventory` : Mise à jour des stocks
- `read_locations` : Lecture des emplacements de stock
- `read_product_listings` : Lecture des collections

### Informations nécessaires

- Nom de votre boutique (ex: `maboutique.myshopify.com`)
- Accès admin à la boutique Shopify
- Plan Shopify actif (pas de boutique en pause)

---

## Configuration étape par étape

### 1. Installer l'application Products Manager sur Shopify

{% callout type="note" title="Installation automatique" %}
Products Manager utilise le processus d'installation OAuth de Shopify pour une configuration sécurisée et automatique.
{% /callout %}

**Méthode 1 : Via le Shopify App Store (Recommandé)**

1. Connectez-vous à votre boutique Shopify
2. Accédez au [Shopify App Store](https://apps.shopify.com)
3. Recherchez **"Products Manager"**
4. Cliquez sur **Ajouter l'application**
5. Suivez le processus d'installation OAuth

**Méthode 2 : Via Products Manager**

1. Connectez-vous à Products Manager
2. Allez dans **Paramètres** → **Intégrations**
3. Cliquez sur **Ajouter une intégration**
4. Sélectionnez **Shopify**
5. Entrez le nom de votre boutique : `maboutique.myshopify.com`
6. Cliquez sur **Connecter à Shopify**
7. Vous serez redirigé vers Shopify pour autoriser l'application
8. Cliquez sur **Installer l'application**

### 2. Générer un Access Token personnalisé (Optionnel)

Pour les développeurs ou les besoins avancés, vous pouvez créer une application privée :

1. Dans votre admin Shopify, allez dans **Paramètres** → **Applications et canaux de vente**
2. Cliquez sur **Développer des applications**
3. Cliquez sur **Créer une application**
4. Donnez un nom : `Products Manager Private App`
5. Dans **Configuration**, sélectionnez **Admin API Scopes** :
   - Products: `read_products`, `write_products`
   - Inventory: `read_inventory`, `write_inventory`
   - Locations: `read_locations`
   - Product listings: `read_product_listings`
6. Cliquez sur **Enregistrer**
7. Dans l'onglet **API Credentials**, révélez **Admin API Access Token**
8. Copiez le token (format : `shpat_xxxxx...`)

Puis dans Products Manager :

```json
{
  "name": "Shopify Boutique",
  "type": "shopify",
  "config": {
    "shop_name": "maboutique",
    "access_token": "shpat_xxxxxxxxxxxxx",
    "api_version": "2023-10"
  }
}
```

### 3. Tester la connexion

Cliquez sur **Tester la connexion** dans Products Manager :

```text
✅ Connexion à maboutique.myshopify.com réussie
✅ Authentification OAuth validée
✅ Permissions vérifiées (6/6)
✅ 2,543 produits détectés
✅ 3 emplacements de stock trouvés
✅ 12 collections disponibles
```

{% callout type="error" title="Erreur de connexion ?" %}
Si le test échoue, vérifiez :
- Le nom de la boutique (sans `.myshopify.com`)
- Que l'application est bien installée et active
- Les permissions demandées ont été accordées
- Votre abonnement Shopify est actif
{% /callout %}

### 4. Configurer la synchronisation

Après connexion réussie, configurez les paramètres :

#### Fréquence de synchronisation

- **Temps réel (webhooks)** : Recommandé, synchronisation instantanée
- **Toutes les 5 minutes** : Polling de secours si webhooks indisponibles
- **Manuel** : Synchronisation à la demande uniquement

#### Direction de synchronisation

- **Bidirectionnelle** (défaut) : Products Manager ↔ Shopify
- **Shopify → Products Manager** : Import uniquement
- **Products Manager → Shopify** : Export/publication uniquement

#### Emplacement de stock

Sélectionnez l'emplacement Shopify à synchroniser :

```text
📍 Main Location (Primary)
📍 Warehouse Paris
📍 Retail Store NYC
```

#### Statut de publication

Définissez si les produits créés depuis Products Manager doivent être :

- **Publiés** : Visible sur la boutique immédiatement
- **Brouillon** : Créés mais non visibles (nécessite publication manuelle)
- **Archivés** : Créés mais archivés

---

## Fonctionnalités synchronisées

### Synchronisation des produits

#### Champs synchronisés

| Shopify | Products Manager | Direction |
|---------|-----------------|-----------|
| `title` | `title` | ↔ Bidirectionnelle |
| `body_html` | `description` | ↔ Bidirectionnelle |
| `vendor` | `supplier.name` | ↔ Bidirectionnelle |
| `product_type` | `category.name` | ↔ Bidirectionnelle |
| `tags` | `tags[]` | ↔ Bidirectionnelle |
| `status` | `is_active` | ↔ Bidirectionnelle |
| `variants[0].sku` | `sku` | ↔ Bidirectionnelle |
| `variants[0].barcode` | `ean` | ↔ Bidirectionnelle |
| `variants[0].price` | `price` | ↔ Bidirectionnelle |
| `variants[0].compare_at_price` | `original_price` | ↔ Bidirectionnelle |
| `variants[0].weight` | `weight` | ↔ Bidirectionnelle |
| `images[]` | `images[]` | ↔ Bidirectionnelle |

#### De Shopify vers Products Manager

Lorsqu'un produit est créé/modifié dans Shopify :

1. **Webhook déclenché** : `products/create` ou `products/update`
2. **Réception** : Products Manager reçoit la notification en <1s
3. **Traitement** : Le produit est créé/mis à jour
4. **Images** : Téléchargées depuis Shopify CDN vers MinIO
5. **Variants** : Créés comme produits liés avec relation parent/enfant

#### De Products Manager vers Shopify

Lorsqu'un produit est créé/modifié dans Products Manager :

1. **Validation** : Vérification des champs obligatoires (titre, prix)
2. **API Call** : `POST /admin/api/2023-10/products.json`
3. **Upload images** : Images uploadées vers Shopify CDN
4. **Publication** : Produit publié selon paramètres
5. **Webhook retour** : Confirmation de création reçue

### Synchronisation des variants

Shopify utilise un système de variants pour les variations de produits (taille, couleur, etc.).

**Exemple :** T-shirt avec 2 couleurs et 3 tailles = 6 variants

| Variant | SKU | Prix | Stock |
|---------|-----|------|-------|
| Bleu / S | TSHIRT-BLUE-S | 19.99€ | 10 |
| Bleu / M | TSHIRT-BLUE-M | 19.99€ | 15 |
| Bleu / L | TSHIRT-BLUE-L | 19.99€ | 8 |
| Rouge / S | TSHIRT-RED-S | 19.99€ | 5 |
| Rouge / M | TSHIRT-RED-M | 19.99€ | 12 |
| Rouge / L | TSHIRT-RED-L | 19.99€ | 0 |

**Synchronisation :**

- **Option 1 (Défaut)** : Créer 6 produits séparés dans Products Manager avec relation parent
- **Option 2** : Créer 1 produit avec 6 variations (requiert module variants)

### Synchronisation des stocks

Le stock est synchronisé via **Shopify Inventory API** :

**Mise à jour temps réel :**

1. **Webhook** : `inventory_levels/update` déclenché par Shopify
2. **Reception** : Products Manager met à jour le stock instantanément
3. **Inverse** : Modification dans PM → API call `POST /admin/api/2023-10/inventory_levels/set.json`

**Emplacements multiples :**

Si vous avez plusieurs emplacements Shopify, configurez la priorité :

```json
{
  "inventory_locations": [
    {"id": 12345678, "name": "Main Location", "priority": 1},
    {"id": 87654321, "name": "Warehouse", "priority": 2}
  ]
}
```

Products Manager synchronisera uniquement l'emplacement prioritaire.

### Synchronisation des collections

Les collections Shopify sont mappées aux catégories Products Manager :

| Shopify Collection | Products Manager Category |
|-------------------|---------------------------|
| Summer Collection | Catégories/Été 2025 |
| Electronics | Catégories/Électronique |
| Sale Items | Catégories/Promotions |

**Mapping automatique :**

- Collections **Automated** : Basées sur rules Shopify, mapping dynamique
- Collections **Manual** : Mapping fixe configuré dans PM

**Création de collections :**

Si vous créez une catégorie dans PM, vous pouvez choisir :

- ✅ Créer collection Shopify correspondante
- ❌ Ne pas créer (produits non catégorisés sur Shopify)

### Images et médias

**Upload automatique :**

Lorsque vous ajoutez une image à un produit dans Products Manager :

1. Image uploadée sur MinIO (stockage interne)
2. Image transférée vers Shopify CDN via API
3. URL Shopify CDN stockée dans PM pour référence

**Formats supportés :** JPG, PNG, WebP, GIF
**Taille max :** 20 MB (limitation Shopify)
**Limite :** 250 images par produit (limitation Shopify)

**Optimisation automatique :**

- Compression intelligente (qualité 85%)
- Conversion WebP pour meilleure performance
- Génération de thumbnails

---

## Webhooks Shopify

Products Manager enregistre automatiquement les webhooks suivants lors de l'installation :

### Webhooks configurés

| Webhook Topic | URL | Action |
|--------------|-----|--------|
| `products/create` | `/api/v1/webhooks/shopify/products/create` | Importe nouveau produit |
| `products/update` | `/api/v1/webhooks/shopify/products/update` | Met à jour produit existant |
| `products/delete` | `/api/v1/webhooks/shopify/products/delete` | Archive produit |
| `inventory_levels/update` | `/api/v1/webhooks/shopify/inventory/update` | Met à jour stock |
| `collections/create` | `/api/v1/webhooks/shopify/collections/create` | Crée catégorie |
| `collections/update` | `/api/v1/webhooks/shopify/collections/update` | Met à jour catégorie |

### Sécurité des webhooks

Les webhooks Shopify sont sécurisés via HMAC SHA256 :

```python
# Vérification automatique par Products Manager
def verify_shopify_webhook(data, hmac_header, shared_secret):
    computed_hmac = base64.b64encode(
        hmac.new(shared_secret.encode(), data, hashlib.sha256).digest()
    )
    return hmac.compare_digest(computed_hmac, hmac_header.encode())
```

Tous les webhooks invalides sont rejetés avec code `401 Unauthorized`.

### Vérifier les webhooks

Dans Shopify Admin :

1. **Paramètres** → **Notifications** → **Webhooks**
2. Vérifiez que les 6 webhooks Products Manager sont présents
3. Statut : ✅ Active (vert)
4. Cliquez sur un webhook pour voir l'historique des envois

---

## Limites et quotas

### Limites Shopify API

Shopify impose des rate limits stricts :

| Plan Shopify | Limite API | Burst |
|-------------|-----------|-------|
| **Basic** | 2 req/s | 40 req/bucket |
| **Shopify** | 4 req/s | 80 req/bucket |
| **Advanced** | 6 req/s | 120 req/bucket |
| **Plus** | 10 req/s | 200 req/bucket |

**Gestion par Products Manager :**

- Rate limiting intelligent avec exponential backoff
- Queue de synchronisation pour éviter dépassement
- Retry automatique en cas d'erreur `429 Too Many Requests`

### Limites produits

- **Variants** : 100 variants max par produit (limitation Shopify)
- **Images** : 250 images max par produit
- **Options** : 3 options max (ex: Couleur, Taille, Matière)
- **Valeurs d'option** : 100 valeurs max par option

### Limites de synchronisation

- **Sync initiale** : ~500 produits/minute (selon plan)
- **Webhooks** : Temps réel (<1 seconde)
- **Polling** : 5 minutes minimum entre syncs

---

## Troubleshooting courant

### Erreur : "Shop not found"

**Cause :** Le nom de la boutique est incorrect.

**Solution :**

```bash
# Vérifiez le nom exact dans l'URL admin Shopify
# Format : https://maboutique.myshopify.com/admin

# Dans Products Manager, utilisez seulement :
Shop Name: maboutique
```

### Erreur : "Access token invalid"

**Causes :**
- Token révoqué ou expiré
- Application désinstallée puis réinstallée
- Permissions modifiées

**Solution :**

1. Réinstallez l'application via OAuth
2. Ou régénérez le token si application privée

### Les webhooks ne se déclenchent pas

**Diagnostic :**

1. Vérifiez que les webhooks sont actifs dans Shopify Admin
2. Testez l'endpoint manuellement :

```bash
curl -X POST https://votre-pm.com/api/v1/webhooks/shopify/products/create \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-SHA256: test" \
  -d '{"id": 12345, "title": "Test Product"}'

# Réponse attendue : 401 Unauthorized (signature invalide mais endpoint fonctionnel)
```

3. Consultez les logs webhook dans Shopify (dernières 48h)

**Solution :**

Si aucun webhook n'existe :

```bash
# Réenregistrer les webhooks depuis Products Manager
POST /api/v1/integrations/shopify/{integration_id}/webhooks/register
```

### Les images ne s'uploadent pas

**Causes :**
- Taille >20 MB (limite Shopify)
- Format non supporté (BMP, TIFF, etc.)
- URL image inaccessible (timeout, 404)

**Solution :**

```bash
# Vérifier les images dans Products Manager
GET /api/v1/products/{id}/images

# Réessayer upload manuel
POST /api/v1/products/{id}/images/sync-to-shopify
```

### Synchronisation lente

**Diagnostic :**

```bash
# Vérifier le rate limit status
GET /api/v1/integrations/shopify/rate-limit

# Réponse :
{
  "current_cost": 35,
  "max_cost": 40,
  "restore_rate": 2,  // 2 points/seconde
  "throttled": false
}
```

**Optimisations :**

1. **Sync par batch** : Réduire la taille des batchs (500 → 100 produits)
2. **Scheduler intelligent** : Synchroniser en heures creuses (nuit)
3. **Filtrer les produits** : Ne synchroniser que produits actifs
4. **Upgrade plan Shopify** : Plus de rate limit sur plans supérieurs

---

## Cas d'usage avancés

### 1. Publication conditionnelle

Publiez uniquement les produits avec stock disponible :

```json
{
  "sync_rules": {
    "publish_condition": "stock_quantity > 0",
    "unpublish_when": "stock_quantity === 0",
    "auto_archive_after_days": 90
  }
}
```

### 2. Mapping prix avec marges

Appliquez une marge automatique sur prix d'achat :

```json
{
  "price_rules": {
    "base_price": "cost_price",
    "margin_percent": 30,
    "round_to": 0.99,
    "compare_at_price_margin": 50
  }
}
```

Exemple : Coût 10€ → Prix vente 14.99€ → Prix comparaison 19.99€

### 3. Tags automatiques

Ajoutez des tags Shopify basés sur critères :

```json
{
  "auto_tags": [
    {"condition": "stock_quantity < 10", "tag": "Low Stock"},
    {"condition": "margin > 40", "tag": "High Margin"},
    {"condition": "category == 'Nouveautés'", "tag": "New Arrival"}
  ]
}
```

### 4. Synchronisation multi-boutiques

Gérez plusieurs boutiques Shopify depuis Products Manager :

```text
Products Manager
    ├── Shopify FR (maboutique-fr.myshopify.com)
    ├── Shopify UK (myshop-uk.myshopify.com)
    └── Shopify US (myshop-us.myshopify.com)
```

Chaque boutique a sa propre intégration avec rules spécifiques.

---

## Sécurité et conformité

### Données stockées

Products Manager stocke uniquement :

- ✅ ID produits Shopify (pour mapping)
- ✅ Access token (chiffré AES-256)
- ✅ Metadata produits (titre, prix, etc.)
- ❌ Données clients
- ❌ Informations de paiement
- ❌ Données bancaires

### RGPD

- Products Manager est conforme RGPD
- Suppression de données : Désinstaller l'app supprime tous les tokens
- Export de données : Disponible via API

### Shopify App Store Requirements

L'application Products Manager respecte toutes les exigences Shopify :

- ✅ OAuth 2.0 pour authentification
- ✅ Webhooks HMAC signés
- ✅ HTTPS obligatoire
- ✅ Privacy Policy disponible
- ✅ Données chiffrées au repos et en transit

---

## Ressources

### Documentation officielle

- [Shopify Admin API](https://shopify.dev/api/admin)
- [Shopify Webhooks](https://shopify.dev/api/admin/rest/reference/events/webhook)
- [Shopify OAuth](https://shopify.dev/apps/auth/oauth)
- [Rate Limits](https://shopify.dev/api/usage/rate-limits)

### Outils de développement

- [Shopify GraphiQL App](https://shopify-graphiql-app.shopifycloud.com/) : Tester GraphQL queries
- [Webhook Tester](https://webhook.site) : Tester webhooks
- [Shopify CLI](https://shopify.dev/apps/tools/cli) : Development local

### Support

- **Email** : integrations@productsmanager.com
- **Documentation** : [https://docs.productsmanager.com](https://docs.productsmanager.com)
- **Statut API Shopify** : [https://www.shopifystatus.com](https://www.shopifystatus.com)

---

## Prochaines étapes

Après avoir configuré l'intégration Shopify :

1. [Configurer les webhooks](/docs/integrations/webhooks)
2. [Optimiser les images produits](/docs/media/image-optimization)
3. [Configurer les collections](/docs/catalog/collections)
4. [Consulter les analytics de ventes](/docs/analytics/sales)
