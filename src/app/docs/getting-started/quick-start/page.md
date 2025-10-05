---
title: Démarrage Rapide
nextjs:
  metadata:
    title: Démarrage Rapide - Products Manager APP
    description: Commencez avec Products Manager APP en moins de 10 minutes.
---

Commencez avec Products Manager APP en moins de **10 minutes**. Ce guide vous accompagne de la création de compte à votre premier import. {% .lead %}

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Un **navigateur moderne** (Chrome, Firefox, Safari, Edge)
- Un **compte utilisateur** Products Manager APP
- Un **fichier fournisseur** (Excel, CSV) ou accès FTP/API

{% callout type="warning" title="Compte démo disponible" %}
Vous n'avez pas encore de compte ? Contactez **webmaster@pixeeplay.com** pour obtenir un accès démo gratuit.
{% /callout %}

---

## Étape 1 : Connexion

### Accédez à l'application

Rendez-vous sur **[productsmanager.app](https://productsmanager.app)** et connectez-vous avec vos identifiants.

```
URL: https://productsmanager.app
Email: votre@email.com
Mot de passe: ********
```

### Première connexion

Au premier login, vous serez redirigé vers le **tableau de bord** principal.

---

## Étape 2 : Configurer un Fournisseur

### Créer un nouveau fournisseur

1. Allez dans **Fournisseurs** → **Nouveau Fournisseur**
2. Renseignez les informations :
   - Nom: `Mon Fournisseur`
   - Type d'import: `Excel / CSV`
   - Fréquence: `Quotidien`
3. **Sauvegardez**

### Configurer le mapping

Associez les colonnes de votre fichier fournisseur aux champs Products Manager :

| Colonne Fournisseur | Champ Products Manager |
|---------------------|------------------------|
| ref_produit         | SKU                    |
| nom_produit         | Titre                  |
| prix_ht             | Prix HT                |
| stock_dispo         | Stock                  |
| image_url           | Image principale       |

---

## Étape 3 : Premier Import

### Uploader un fichier

1. Allez dans **Imports** → **Nouvel Import**
2. Sélectionnez votre fournisseur
3. **Uploadez** votre fichier Excel/CSV (max 50 MB)
4. Cliquez sur **Lancer l'Import**

### Suivre l'import

L'import se déroule en **4 phases** :

```
1. ⬆️  Upload du fichier (5-10 sec)
2. 🔍 Validation des données (10-30 sec)
3. 💾 Insertion en base (30-60 sec)
4. ✅ Finalisation (5 sec)
```

{% callout type="note" title="Traitement asynchrone" %}
Les imports s'exécutent en tâche de fond. Vous pouvez continuer à utiliser l'application pendant le traitement.
{% /callout %}

---

## Étape 4 : Enrichissement IA (Optionnel)

### Activer l'enrichissement automatique

1. Allez dans **Paramètres** → **Enrichissement IA**
2. Activez les options :
   - ✅ Génération de descriptions
   - ✅ Optimisation SEO des titres
   - ✅ Extraction d'attributs
3. Sélectionnez le modèle IA (GPT-4o recommandé)

### Lancer l'enrichissement

Sur vos produits importés :

1. Sélectionnez les produits
2. **Actions groupées** → **Enrichir avec IA**
3. Attendez 1-2 minutes (selon le nombre de produits)

---

## Étape 5 : Export vers votre E-commerce

### Connecter votre plateforme

Products Manager APP s'intègre avec :

- **Odoo** (ERP)
- **Shopify**
- **PrestaShop**
- **WooCommerce**
- **API REST personnalisée**

### Configuration de la synchronisation

1. **Intégrations** → **Nouvelle Connexion**
2. Choisissez votre plateforme
3. Renseignez les credentials API
4. Testez la connexion
5. Configurez la **fréquence de sync** (temps réel, horaire, quotidien)

---

## Résultat Attendu

Après ces 5 étapes, vous avez :

- ✅ Un fournisseur configuré
- ✅ Vos premiers produits importés
- ✅ Des fiches enrichies avec l'IA
- ✅ Une synchronisation active vers votre e-commerce

**Temps total : ~10 minutes**

---

## Prochaines Étapes

{% quick-links %}

{% quick-link title="Guide Complet" icon="installation" href="/docs/user-guides/getting-started" description="Explorez toutes les fonctionnalités en détail." /%}

{% quick-link title="Workflow d'Import" icon="presets" href="/docs/user-guides/import-workflow" description="Maîtrisez les imports avancés (FTP, API, planification)." /%}

{% quick-link title="Enrichissement IA" icon="plugins" href="/docs/features/ai-enrichment" description="Optimisez vos contenus avec l'intelligence artificielle." /%}

{% quick-link title="API Documentation" icon="theming" href="/docs/api/authentication" description="Automatisez avec l'API REST." /%}

{% /quick-links %}

---

## Besoin d'Aide ?

- 📧 **Email**: webmaster@pixeeplay.com
- 📚 **Documentation**: [docs.productsmanager.app](https://docs.productsmanager.app)
- 🐛 **Issues**: [GitHub Issues](https://github.com/pixeeplay/Suppliers-Import/issues)
