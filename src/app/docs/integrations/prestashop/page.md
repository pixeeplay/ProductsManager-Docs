---
title: Intégration PrestaShop
nextjs:
  metadata:
    title: Intégration PrestaShop
    description: Guide complet pour intégrer Products Manager avec votre boutique PrestaShop
---

Synchronisez automatiquement vos produits entre Products Manager et votre boutique PrestaShop via l'API Webservice. {% .lead %}

---

## Vue d'ensemble

L'intégration PrestaShop permet une synchronisation bidirectionnelle entre Products Manager et votre boutique PrestaShop utilisant le **PrestaShop Webservice API**. Gérez vos produits, stocks et catégories de manière centralisée.

### Fonctionnalités principales

- **Synchronisation bidirectionnelle** : Products Manager ↔ PrestaShop
- **Gestion des produits** : Titre, description, prix, SKU, EAN13, images
- **Gestion des stocks** : Synchronisation des quantités disponibles
- **Catégories** : Mapping automatique avec l'arborescence PrestaShop
- **Multi-langue** : Support de toutes les langues configurées dans PrestaShop
- **Déclinaisons** : Synchronisation des combinaisons (couleur, taille, etc.)

---

## Prérequis

### Versions supportées

- **PrestaShop** : 1.7.x, 8.0.x, 8.1.x (dernières versions)
- **PHP** : 7.4 minimum (8.0+ recommandé)
- **Products Manager** : v3.0.0 minimum

### Permissions requises

L'intégration nécessite un accès au Webservice PrestaShop avec permissions sur :

- **Products** : GET, POST, PUT (lecture/écriture)
- **Stock availables** : GET, PUT (lecture/écriture)
- **Categories** : GET, POST (lecture/création)
- **Images** : GET, POST (lecture/upload)
- **Combinations** : GET, POST, PUT (lecture/écriture déclinaisons)

### Informations nécessaires

- URL de votre boutique PrestaShop (ex: `https://maboutique.com`)
- Accès au back-office PrestaShop
- Droits administrateur pour activer le Webservice

---

## Configuration étape par étape

### 1. Activer le Webservice PrestaShop

{% callout type="warning" title="Activation obligatoire" %}
Le Webservice est désactivé par défaut dans PrestaShop. Vous devez l'activer manuellement.
{% /callout %}

1. Connectez-vous au back-office PrestaShop
2. Allez dans **Paramètres avancés** → **Webservice**
3. Activez l'option **Activer le Webservice de PrestaShop**
4. Cliquez sur **Enregistrer**

### 2. Créer une clé API Webservice

1. Dans la page **Webservice**, cliquez sur **Ajouter une nouvelle clé**
2. Remplissez le formulaire :
   - **Clé** : Laissez vide (générée automatiquement) ou créez une clé personnalisée
   - **Description** : `Products Manager Integration`
   - **Statut** : ✅ Activé
3. Dans **Permissions**, sélectionnez les ressources :
   - **products** : ✅ View, ✅ Modify, ✅ Add
   - **stock_availables** : ✅ View, ✅ Modify
   - **categories** : ✅ View, ✅ Add
   - **images** : ✅ View, ✅ Add
   - **combinations** : ✅ View, ✅ Modify, ✅ Add
4. Cliquez sur **Enregistrer**
5. Copiez la **clé API** générée (format : 32 caractères alphanumériques)

### 3. Configurer la connexion dans Products Manager

1. Connectez-vous à Products Manager
2. Allez dans **Paramètres** → **Intégrations**
3. Cliquez sur **Ajouter une intégration**
4. Sélectionnez **PrestaShop**

Remplissez le formulaire :

```json
{
  "name": "PrestaShop Production",
  "type": "prestashop",
  "config": {
    "shop_url": "https://maboutique.com",
    "api_key": "VOTRE_CLE_API_32_CARACTERES",
    "default_language_id": 1,
    "default_shop_id": 1
  }
}
```

**Paramètres :**
- `shop_url` : URL complète de votre boutique (avec https://)
- `api_key` : Clé générée dans PrestaShop
- `default_language_id` : ID de la langue par défaut (1 = Français généralement)
- `default_shop_id` : ID de la boutique (1 si mono-boutique)

### 4. Tester la connexion

Cliquez sur **Tester la connexion** :

```text
✅ Connexion à maboutique.com réussie
✅ Authentification Webservice OK
✅ Permissions vérifiées (5/5 ressources)
✅ 1,847 produits détectés
✅ 25 catégories trouvées
✅ PrestaShop version : 8.1.2
```

{% callout type="error" title="Erreur de connexion ?" %}
Si le test échoue, vérifiez :
- Le Webservice est bien activé dans PrestaShop
- L'URL est correcte (avec https://, sans `/` à la fin)
- La clé API est valide et active
- Votre serveur autorise les connexions sortantes vers PrestaShop
- Aucun pare-feu ne bloque les requêtes HTTP
{% /callout %}

### 5. Configurer la synchronisation

#### Fréquence de synchronisation

- **Toutes les 5 minutes** : Polling automatique (recommandé)
- **Toutes les 15 minutes** : Pour catalogues stables
- **Toutes les heures** : Pour boutiques avec peu de modifications
- **Manuel** : Synchronisation à la demande uniquement

{% callout type="note" title="Webhooks non disponibles" %}
PrestaShop ne supporte pas nativement les webhooks. La synchronisation utilise le polling (interrogation périodique).
{% /callout %}

#### Direction de synchronisation

- **Bidirectionnelle** (défaut) : Products Manager ↔ PrestaShop
- **PrestaShop → Products Manager** : Import uniquement
- **Products Manager → PrestaShop** : Export uniquement

#### Champs à synchroniser

**Produits :**
- ✅ Nom (multi-langue)
- ✅ Description courte et complète
- ✅ SKU (référence)
- ✅ EAN13
- ✅ Prix TTC/HT
- ✅ Quantité en stock
- ✅ Catégorie
- ✅ Images
- ✅ Poids
- ✅ Actif/Inactif

**Déclinaisons (combinations) :**
- ✅ Attributs (couleur, taille, etc.)
- ✅ Prix spécifique
- ✅ SKU spécifique
- ✅ Stock par déclinaison

---

## Fonctionnalités synchronisées

### Synchronisation des produits

#### Mapping des champs

| PrestaShop | Products Manager | Notes |
|-----------|-----------------|-------|
| `name[id_lang]` | `title` | Multi-langue supporté |
| `description[id_lang]` | `description` | HTML préservé |
| `reference` | `sku` | Référence unique |
| `ean13` | `ean` | Code-barres |
| `price` | `price` | Prix HT par défaut |
| `wholesale_price` | `cost_price` | Prix d'achat |
| `quantity` | `stock_quantity` | Stock disponible |
| `id_category_default` | `category_id` | Catégorie principale |
| `active` | `is_active` | Statut actif/inactif |
| `weight` | `weight` | En kg |

#### De PrestaShop vers Products Manager

Lors de la synchronisation depuis PrestaShop :

1. **Récupération** : API call `GET /api/products?display=full`
2. **Parsing** : Extraction des données XML/JSON
3. **Images** : Téléchargement depuis PrestaShop CDN vers MinIO
4. **Multi-langue** : Sélection de la langue par défaut configurée
5. **Création** : Produit créé/mis à jour dans Products Manager

#### De Products Manager vers PrestaShop

Lors de la synchronisation vers PrestaShop :

1. **Validation** : Vérification des champs obligatoires
2. **API Call** : `POST /api/products` (création) ou `PUT /api/products/{id}` (modification)
3. **Images** : Upload séparé via `POST /api/images/products/{id}`
4. **Stock** : Mise à jour via `PUT /api/stock_availables/{id}`
5. **Multi-langue** : Réplication du contenu dans toutes les langues configurées

### Synchronisation des catégories

Le mapping de catégories respecte l'arborescence PrestaShop :

| PrestaShop | Products Manager |
|-----------|-----------------|
| Accueil / Électronique | Catégories/Électronique |
| Accueil / Vêtements / Hommes | Catégories/Vêtements/Hommes |
| Accueil / Promotions | Catégories/Promotions |

**Création automatique :**

Si une catégorie n'existe pas dans PrestaShop, elle est créée sous la catégorie racine configurée.

### Synchronisation des stocks

Le stock est synchronisé via la ressource `stock_availables` :

**Mise à jour :**

```xml
PUT /api/stock_availables/{id}
<stock_available>
  <id_product>123</id_product>
  <quantity>50</quantity>
  <depends_on_stock>0</depends_on_stock>
</stock_available>
```

**Multi-entrepôts :**

Si vous utilisez le module **Advanced Stock Management**, configurez l'entrepôt par défaut dans les paramètres.

### Synchronisation des déclinaisons

PrestaShop utilise le système de **combinations** pour les variantes :

**Exemple :** Chaussures avec 2 pointures et 3 couleurs = 6 combinations

| Combination | SKU | Prix | Stock |
|------------|-----|------|-------|
| 42 / Noir | SHOE-42-BLACK | +0€ | 12 |
| 42 / Blanc | SHOE-42-WHITE | +0€ | 8 |
| 42 / Rouge | SHOE-42-RED | +5€ | 5 |
| 44 / Noir | SHOE-44-BLACK | +0€ | 10 |
| 44 / Blanc | SHOE-44-WHITE | +0€ | 6 |
| 44 / Rouge | SHOE-44-RED | +5€ | 3 |

**Synchronisation :**

- **Option 1 (Défaut)** : 6 produits séparés dans Products Manager liés au produit parent
- **Option 2** : 1 produit avec 6 variations (requiert module variants dans PM)

### Images et médias

**Upload automatique vers PrestaShop :**

```bash
# Upload d'une image
POST /api/images/products/{id_product}
Content-Type: multipart/form-data

# PrestaShop génère automatiquement les thumbnails
```

**Formats supportés :** JPG, PNG, GIF
**Taille max :** 8 MB (configurable dans PrestaShop)
**Limite :** Illimité (mais recommandé : <10 images/produit pour performance)

---

## Multi-langue et multi-boutiques

### Support multi-langue

PrestaShop est multi-langue natif. Products Manager peut synchroniser dans toutes les langues :

```json
{
  "language_mapping": {
    "1": "fr",  // ID 1 = Français
    "2": "en",  // ID 2 = English
    "3": "es"   // ID 3 = Español
  },
  "sync_all_languages": true,
  "fallback_language_id": 1
}
```

Si `sync_all_languages` = true, le contenu de Products Manager est répliqué dans toutes les langues.

### Support multi-boutiques

Si vous utilisez le module **Multiboutique** de PrestaShop :

```json
{
  "shop_id": 1,  // ID de la boutique à synchroniser
  "sync_all_shops": false  // true = synchroniser toutes les boutiques
}
```

Pour synchroniser plusieurs boutiques, créez une intégration par boutique.

---

## Troubleshooting courant

### Erreur : "401 Unauthorized"

**Cause :** Clé API invalide ou permissions insuffisantes.

**Solution :**

1. Vérifiez que la clé API est exactement celle affichée dans PrestaShop
2. Vérifiez que toutes les permissions sont cochées (products, stock_availables, etc.)
3. Vérifiez que la clé est **Active**

### Erreur : "This call to PrestaShop Web Services failed"

**Cause :** Webservice désactivé ou URL incorrecte.

**Solution :**

```bash
# Testez manuellement l'API
curl -X GET "https://maboutique.com/api/products?limit=1" \
  -H "Authorization: Basic $(echo -n 'VOTRE_CLE_API:' | base64)"

# Réponse attendue : XML/JSON avec 1 produit
```

### Les images ne s'uploadent pas

**Cause :** Limite de taille PHP ou permissions fichiers.

**Solution :**

1. Augmentez `upload_max_filesize` et `post_max_size` dans php.ini
2. Vérifiez les permissions du dossier `img/` dans PrestaShop (777 ou www-data:www-data)
3. Compressez les images avant upload (<2 MB recommandé)

### Les stocks ne se mettent pas à jour

**Cause :** Advanced Stock Management activé sans configuration.

**Solution :**

```bash
# Vérifier si ASM est activé
GET /api/configurations?filter[name]=PS_ADVANCED_STOCK_MANAGEMENT

# Si activé, configurez l'entrepôt par défaut dans Products Manager
{
  "warehouse_id": 1
}
```

### Synchronisation lente (>1000 produits)

**Optimisations :**

1. **Pagination** : Synchroniser par lots de 100 produits
2. **Cache** : Activer le cache Redis dans Products Manager
3. **Filtres** : Ne synchroniser que les produits actifs
4. **Scheduler** : Synchroniser en heures creuses (nuit)

```json
{
  "sync_config": {
    "batch_size": 100,
    "filter_active_only": true,
    "cache_enabled": true
  }
}
```

---

## Limites connues

### Limites techniques

- **Rate limiting** : Aucune limite native PrestaShop (dépend du serveur)
- **Timeout** : 30 secondes par défaut (configurable dans php.ini)
- **Mémoire** : Dépend de la configuration PHP du serveur

### Fonctionnalités non supportées

- **Webhooks** : PrestaShop ne les supporte pas nativement
- **Prix par groupe client** : Non synchronisé
- **Réductions spécifiques** : Non synchronisées
- **Features (caractéristiques)** : Non synchronisées (roadmap)
- **Fournisseurs** : Synchronisation manuelle uniquement

### Différences comportementales

| Comportement | PrestaShop | Products Manager | Note |
|-------------|-----------|-----------------|------|
| Produits désactivés | `active=0` | `is_active=false` | Mapping 1:1 |
| Prix | TTC ou HT (config) | Toujours TTC | Conversion automatique |
| Stock négatif | Configurable | Non autorisé | Validation PM |

---

## Cas d'usage avancés

### 1. Synchronisation incrémentale

Synchronisez uniquement les produits modifiés depuis la dernière sync :

```json
{
  "sync_mode": "incremental",
  "track_changes": true,
  "last_sync_timestamp": "2025-10-05T10:00:00Z"
}
```

### 2. Mapping prix avec marges

```json
{
  "price_rules": {
    "base_price": "wholesale_price",
    "margin_percent": 35,
    "apply_tax": true,
    "tax_rule_id": 1
  }
}
```

### 3. Synchronisation sélective par catégorie

Ne synchronisez que certaines catégories PrestaShop :

```json
{
  "category_filter": {
    "include_categories": [2, 5, 12],  // IDs PrestaShop
    "exclude_categories": [8]
  }
}
```

---

## Sécurité

### Bonnes pratiques

- ✅ Utilisez HTTPS obligatoirement (clé API en clair)
- ✅ Créez une clé API dédiée pour Products Manager
- ✅ Limitez les permissions au strict nécessaire
- ✅ Renouvelez la clé API tous les 6 mois
- ✅ Surveillez les logs d'accès au Webservice dans PrestaShop
- ✅ Activez un pare-feu (ModSecurity) pour limiter les abus

### Chiffrement

- Les clés API sont stockées chiffrées (AES-256) dans Products Manager
- Les connexions utilisent TLS 1.2+ obligatoire
- Les logs ne contiennent jamais les clés API en clair

---

## Ressources

### Documentation officielle

- [PrestaShop Webservice Documentation](https://devdocs.prestashop-project.org/8/webservice/)
- [PrestaShop API Reference](https://devdocs.prestashop-project.org/8/webservice/reference/)
- [PrestaShop Developer Guide](https://devdocs.prestashop-project.org/)

### Outils de développement

- [Postman Collection](https://www.postman.com/prestashop) : Tester l'API
- [PrestaShop Webservice Lib](https://github.com/PrestaShop/PrestaShop-webservice-lib) : Librairie PHP

### Support

- **Email** : integrations@productsmanager.com
- **Documentation** : [https://docs.productsmanager.com](https://docs.productsmanager.com)
- **Forum PrestaShop** : [https://www.prestashop.com/forums](https://www.prestashop.com/forums)

---

## Prochaines étapes

Après avoir configuré l'intégration PrestaShop :

1. [Configurer la synchronisation automatique](/docs/integrations/sync-automation)
2. [Mapper les catégories](/docs/integrations/category-mapping)
3. [Optimiser les images](/docs/media/image-optimization)
4. [Consulter les analytics](/docs/analytics/overview)
