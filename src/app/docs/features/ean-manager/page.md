---
title: EAN Manager
nextjs:
  metadata:
    title: EAN Manager - Products Manager APP
    description: Trouvez et associez automatiquement les codes-barres EAN/UPC/ASIN de vos produits via l'API Amazon Product Advertising.
---

Complétez automatiquement les codes-barres manquants de votre catalogue. EAN Manager recherche et associe les EAN, UPC et ASIN en interrogeant la base Amazon Product Advertising API. {% .lead %}

---

## Vue d'Ensemble

Les codes-barres (EAN-13, UPC, GTIN) sont indispensables pour vendre sur les marketplaces comme Amazon, Fnac, Cdiscount ou Google Shopping. Sans eux, impossible de publier vos produits.

Le problème : vos fournisseurs ne fournissent pas toujours ces codes, et les rechercher manuellement produit par produit est chronophage.

EAN Manager résout ce problème en interrogeant automatiquement la base de données Amazon (plus de 500 millions de produits) pour trouver le code-barres correspondant à chaque référence de votre catalogue.

---

## Fonctionnalités Principales

### Source de Données : Amazon Product Advertising API

EAN Manager exploite l'API officielle Amazon Product Advertising :

- **Couverture mondiale** : Plus de 500 millions de produits référencés
- **Données fiables** : Codes-barres validés par Amazon
- **Multi-formats** : EAN-13, UPC, GTIN, ASIN
- **Mise à jour continue** : Base enrichie quotidiennement

Cette API est la même utilisée par les sites affiliés Amazon, garantissant une qualité et fraîcheur des données maximales.

### Modes de Recherche

Trouvez vos codes-barres par différents critères :

#### Recherche par Référence Fabricant

Le mode le plus précis :
- Interrogation par MPN (Manufacturer Part Number)
- Matching exact avec base Amazon
- Taux de succès : ~85% pour marques connues

#### Recherche par Titre Produit

Pour les produits sans référence :
- Analyse sémantique du titre
- Correspondance fuzzy avec catalogue Amazon
- Filtrage par marque si disponible
- Taux de succès : ~60-70%

#### Recherche par Marque + Mots-Clés

Pour affiner les résultats :
- Combinaison marque + caractéristiques clés
- Désambiguïsation automatique
- Proposition de plusieurs résultats si doute

{% callout type="note" %}
Pour maximiser le taux de réussite, assurez-vous que vos produits ont au minimum un titre cohérent et idéalement une marque. Plus vos données initiales sont complètes, meilleurs seront les résultats.
{% /callout %}

### Cache Intelligent

Un système de cache optimise les coûts et performances :

- **Mise en cache des résultats** : Chaque EAN trouvé est stocké localement
- **Durée de rétention** : 90 jours par défaut (personnalisable)
- **Réduction coûts API** : -70% de requêtes sur catalogues stables
- **Refresh intelligent** : Mise à jour automatique pour produits non trouvés après 30 jours

### Matching Automatique

L'association EAN se fait intelligemment :

- **Score de confiance** : Chaque résultat reçoit un score de 0 à 100
- **Seuil de validation** : Seuls les scores >80 sont appliqués automatiquement
- **Validation manuelle** : Scores 60-80 nécessitent confirmation
- **Suggestions multiples** : Jusqu'à 5 propositions pour choix manuel

### Formats de Codes-Barres

Tous les standards sont supportés :

- **EAN-13** : Standard européen (13 chiffres)
- **UPC-A** : Standard américain (12 chiffres)
- **GTIN-14** : Pour packs et lots
- **ASIN** : Identifiant Amazon (10 caractères alphanumériques)

Les codes sont automatiquement formatés et validés (checksum).

---

## Comment ça Marche

### Étape 1 : Sélection des Produits

Identifiez les produits nécessitant un EAN :

- Filtre automatique : Produits sans EAN
- Sélection par catégorie ou fournisseur
- Import liste références externes

### Étape 2 : Lancement de la Recherche

Configurez votre recherche :

- Choisissez le mode : Référence / Titre / Marque
- Définissez le seuil de confiance (recommandé : 80)
- Sélectionnez le pays Amazon (FR, UK, DE, US, etc.)

### Étape 3 : Traitement Automatique

EAN Manager interroge l'API Amazon :

- Traitement par batch de 100 produits
- Vitesse : ~100 produits en 2-3 minutes
- Gestion automatique des rate limits API
- Retry intelligent en cas d'erreur temporaire

### Étape 4 : Révision des Résultats

Analysez les propositions :

- **Automatiques (vert)** : Score >80, appliqués directement
- **À valider (orange)** : Score 60-80, validation manuelle recommandée
- **Non trouvés (rouge)** : Aucun résultat, recherche manuelle nécessaire

### Étape 5 : Validation et Application

Appliquez les codes-barres :

- Validation en lot pour résultats automatiques
- Révision unitaire pour résultats moyens
- Mise à jour immédiate du catalogue
- Synchronisation vers marketplaces

---

## Cas d'Usage

### E-commerçant Voulant Vendre sur Amazon

**Problème** : 2000 produits sans EAN, impossible de créer listings Amazon.

**Solution** :
- Import catalogue dans Products Manager
- Recherche EAN par référence fabricant
- Validation automatique des résultats >80

**Résultat** :
- 1700 EAN trouvés automatiquement (85%)
- 300 recherches manuelles nécessaires
- Gain de 40h vs recherche manuelle
- Catalogue Amazon publié en 2 jours

### Boutique High-Tech Multi-Marques

**Problème** : Fournisseurs fournissent références mais pas EAN.

**Solution** :
- Workflow automatisé : Import → Recherche EAN → Validation
- Cache intelligent pour références récurrentes
- Seuil confiance 85 pour validation auto

**Résultat** :
- 90% des nouveaux produits avec EAN dès import
- Réduction coûts API de 65% grâce au cache
- Zéro intervention manuelle

### Marketplace Généraliste

**Problème** : Catalogues fournisseurs hétérogènes, qualité données variable.

**Solution** :
- Recherche par titre pour produits sans référence
- Validation manuelle systématique pour sécurité
- Enrichissement progressif du catalogue

**Résultat** :
- 60% de taux de succès sur produits sans référence
- Amélioration continue via apprentissage
- Qualification progressive de 15 000 produits

---

## Configuration

### Prérequis

- Un compte Products Manager APP actif
- Clés API Amazon Product Advertising (fournies gratuitement)
- Des produits avec minimum un titre ou une référence

### Obtention Clés API Amazon

Products Manager APP fournit les clés API Amazon incluses dans votre abonnement :

1. Accédez à **Paramètres > Intégrations > Amazon PA API**
2. Cliquez sur **Activer Amazon Product Advertising**
3. Vos clés sont générées automatiquement
4. Aucune configuration supplémentaire nécessaire

{% callout type="note" %}
Les clés API Amazon sont partagées entre tous les utilisateurs Products Manager APP. Nous gérons les quotas et rate limits de manière transparente. Vous ne payez que vos crédits de recherche EAN.
{% /callout %}

### Configuration Basique

1. Accédez à **Produits > EAN Manager**
2. Cliquez sur **Rechercher EAN**
3. Sélectionnez vos produits
4. Configurez :
   - Mode de recherche : Référence (recommandé)
   - Marketplace Amazon : France (ou votre pays)
   - Seuil confiance : 80
5. Lancez la recherche

### Paramètres Avancés

#### Matching Personnalisé

Affinez les critères de matching :

- **Filtres marque** : Restreindre recherche à une marque spécifique
- **Exclusions** : Mots-clés à ignorer dans les résultats
- **Pondération** : Prioriser titre vs référence vs marque

#### Gestion du Cache

Optimisez votre cache :

- **Durée rétention** : 30 à 180 jours (défaut 90)
- **Refresh automatique** : Fréquence mise à jour codes non trouvés
- **Purge sélective** : Vider cache pour catégories spécifiques

#### Workflows Automatisés

Automatisez la recherche EAN :

```
Trigger : Nouveau produit importé
Condition : EAN vide
Action : Recherche EAN automatique
Validation : Auto si score >85, sinon notification
```

---

## Tarification et Crédits

### Consommation de Crédits

Chaque recherche EAN consomme des crédits :

- **Recherche réussie** : 1 crédit
- **Recherche sans résultat** : 0,5 crédit (consommation API réduite)
- **Résultat en cache** : 0 crédit (gratuit)

### Inclus dans les Plans

- **Starter** : 500 recherches EAN/mois
- **Growth** : 2000 recherches EAN/mois
- **Enterprise** : Illimité

### Optimisation des Coûts

Maximisez votre quota :

- Utilisez le cache (revalidation gratuite)
- Regroupez vos recherches en batch
- Priorisez recherche par référence (meilleur taux succès)
- Évitez recherches répétées pour produits introuvables

---

## Prochaines Étapes

- [Centralisation des Imports](/docs/features/import-centralisation) : Importez vos produits avant recherche EAN
- [Market Intelligence](/docs/features/market-intelligence) : Surveillez les prix après matching EAN
- [Intégrations Marketplaces](/docs/integrations/marketplaces) : Exportez vos produits avec EAN vers Amazon, Cdiscount
- [API Reference](/docs/api) : Automatisez la recherche EAN via API
