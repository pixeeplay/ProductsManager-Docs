---
title: Connecteurs & Intégrations
nextjs:
  metadata:
    title: Connecteurs & Intégrations
    description: Connectez Products Manager à vos plateformes e-commerce, ERP et marketplaces via le module Connecteurs Plateformes
---

Connectez Products Manager à vos plateformes e-commerce, ERP et marketplaces pour synchroniser automatiquement produits, stocks et prix. {% .lead %}

---

## Module Connecteurs Plateformes (v4.9.0)

Le module **Connecteurs Plateformes** centralise toutes vos intégrations dans une interface unifiée. Accessible depuis **Paramètres → Connecteurs Plateformes** (ou via la sidebar avec l'icône Plug), il permet de configurer, tester et monitorer chaque connexion.

### Accéder aux connecteurs

- **Sidebar** : icône Plug → Connecteurs
- **Commande** : `Ctrl+K` → rechercher "Connecteurs"
- **URL directe** : `/settings/integrations`

---

## Plateformes supportées

### E-commerce (push/pull produits complet)

| Plateforme | Auth | Push produits | Pull produits | Stock | Prix | Webhooks |
|-----------|------|:---:|:---:|:---:|:---:|:---:|
| [Shopify](/docs/integrations/shopify) | OAuth2 / Access Token | ✅ | ✅ | ✅ | ✅ | ✅ |
| [WooCommerce](/docs/integrations/woocommerce) | API Key + Secret | ✅ | ✅ | ✅ | ✅ | ✅ |
| [PrestaShop](/docs/integrations/prestashop) | API Key | ✅ | ✅ | ✅ | ✅ | — |
| [Magento 2](/docs/integrations/magento2) | Bearer Token | ✅ | ✅ | ✅ (MSI) | ✅ | — |
| [BigCommerce](/docs/integrations/bigcommerce) | X-Auth-Token | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Sylius](/docs/integrations/sylius) | JWT | ✅ | ✅ | ✅ | ✅ (centimes) | — |
| [WiziShop](/docs/integrations/wizishop) | Access Token | ✅ | ✅ | ✅ | ✅ | — |
| [Squarespace](/docs/integrations/squarespace) | API Key | — | ✅ | ✅ | Partiel | — |

### ERP & PIM

| Plateforme | Auth | Capacités |
|-----------|------|-----------|
| [Odoo ERP](/docs/integrations/odoo) | XML-RPC + mdp | Sync bidirectionnelle produits/stock/prix |
| [WinDev ERP](/docs/integrations/windev) | X-API-Key | Lecture/écriture 75 champs produits |

### Enterprise

| Plateforme | Auth | Push produits | Pull produits | Stock | Prix |
|-----------|------|:---:|:---:|:---:|:---:|
| [Salesforce Commerce Cloud](/docs/integrations/sfcc) | OAuth2 client_credentials | ✅ | ✅ | ✅ | ✅ |
| [SAP Commerce Cloud](/docs/integrations/sap-commerce) | OAuth2 | ImpEx | ✅ | — | — |

### Marketplaces (push offres par EAN)

| Marketplace | Auth | Push offres | Pull offres | Fiches produits |
|------------|------|:---:|:---:|:---:|
| [CDiscount](/docs/integrations/cdiscount) | Login/Password SOAP | ✅ | ✅ | — (existantes) |
| [Fnac Marketplace](/docs/integrations/fnac) | shop_id + api_key | ✅ | ✅ | — (existantes) |

### Autres intégrations

| Intégration | Description |
|------------|-------------|
| [Amazon PA-API](/docs/integrations/amazon-pa-api) | Recherche produits Amazon, enrichissement données |
| [MinIO](/docs/integrations/minio) | Stockage objets compatible S3 pour images produits |
| [Email Imports](/docs/integrations/email-imports) | Import de fichiers produits reçus par email |

---

## Comment configurer un connecteur

1. Allez dans **Paramètres → Connecteurs Plateformes**
2. Cliquez sur la plateforme souhaitée
3. Renseignez les credentials (URL, token, clés API...)
4. Cliquez sur **Tester la connexion**
5. Une fois validé, configurez la fréquence de synchronisation
6. Activez le connecteur

Pour les détails de chaque intégration, consultez le guide correspondant dans la liste ci-dessus.

---

## Synchronisation et fréquences

| Mode | Description | Cas d'usage |
|------|-------------|-------------|
| **Temps réel (webhooks)** | Déclenchement instantané sur événement | Shopify, WooCommerce, BigCommerce |
| **Périodique (Celery Beat)** | Sync automatique planifiée | WiziShop, Squarespace, CDiscount |
| **Manuelle** | Déclenchée depuis l'interface PM | Tous |
| **ImpEx bulk** | Fichier XML/CSV pour gros catalogues | SAP Commerce, Magento 2 |

---

## Sécurité des credentials

Tous les tokens et mots de passe sont chiffrés au repos (AES-256) dans la base de données Products Manager. Ils ne sont jamais exposés dans les logs ou les réponses API.

---

## Support

Pour toute question sur une intégration :
- **Email** : hello-pm@pixeeplay.fr
- **Documentation** : [https://docs.productsmanager.app](https://docs.productsmanager.app)
