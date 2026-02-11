---
title: Enrichissement IA
nextjs:
  metadata:
    title: Enrichissement IA - Guide Utilisateur Products Manager APP
    description: "Utilisez l'intelligence artificielle pour enrichir automatiquement vos fiches produits : generation de descriptions, traduction, optimisation SEO et extraction d'attributs."
---

Utilisez l'intelligence artificielle pour enrichir automatiquement vos fiches produits avec des descriptions optimisees, des traductions multi-langues et des suggestions de categories. {% .lead %}

---

## Vue d'Ensemble

Le module **Enrichissement IA** de Products Manager APP vous permet d'exploiter la puissance de l'intelligence artificielle pour completer et ameliorer vos fiches produits de maniere automatisee. Plutot que de rediger manuellement chaque description ou de traduire vos contenus un par un, l'IA analyse vos donnees existantes et genere des contenus de qualite professionnelle en quelques secondes.

Ce module est particulierement utile lorsque vous gerez un catalogue volumineux et que la redaction manuelle devient un goulot d'etranglement pour la mise en ligne de vos produits.

---

## Providers Supportes

Products Manager APP supporte deux fournisseurs d'intelligence artificielle :

| Provider | Modeles Disponibles | Points Forts |
|----------|---------------------|--------------|
| **OpenAI** | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo | Excellence en generation de texte, large base de connaissances produit |
| **Anthropic** | Claude 3 Opus, Claude 3 Sonnet | Precision factuelle, respect des consignes de ton et de style |

{% callout type="note" %}
Le choix du provider et du modele impacte directement la qualite des resultats et le cout par enrichissement. GPT-4 et Claude 3 Opus offrent les meilleurs resultats mais consomment davantage de credits.
{% /callout %}

---

## Configuration du Provider IA

Avant d'utiliser l'enrichissement IA, vous devez configurer votre provider dans les parametres de l'application.

### 1. Acceder aux Parametres IA

1. Rendez-vous dans **Parametres** depuis le menu lateral
2. Selectionnez l'onglet **Intelligence Artificielle**

### 2. Configurer le Provider

1. Choisissez votre **provider** (OpenAI ou Anthropic)
2. Saisissez votre **cle API** obtenue depuis le portail du provider
3. Selectionnez le **modele prefere** pour les enrichissements
4. Definissez la **langue par defaut** pour les contenus generes
5. Cliquez sur **Enregistrer**

### 3. Tester la Connexion

Cliquez sur **Tester la connexion** pour verifier que votre cle API est valide et que le provider repond correctement. Un message de confirmation s'affiche en cas de succes.

{% callout type="warning" %}
Conservez votre cle API en securite. Ne la partagez jamais et ne la stockez pas dans des fichiers non securises. En cas de compromission, regenerez immediatement votre cle depuis le portail du provider.
{% /callout %}

---

## Fonctionnalites d'Enrichissement

### Generation de Descriptions

L'IA genere des descriptions produit completes a partir des donnees existantes de votre fiche (titre, marque, categorie, attributs). Vous pouvez choisir entre plusieurs formats :

- **Description courte** : 2 a 3 phrases, ideale pour les listings
- **Description longue** : paragraphe detaille avec caracteristiques techniques
- **Description HTML** : contenu structure avec titres et listes a puces

### Traduction Multi-Langues

Traduisez automatiquement vos fiches produits dans les langues de vos marches cibles :

- Francais, Anglais, Allemand, Espagnol, Italien, Portugais, Neerlandais
- Conservation du ton commercial et des termes techniques
- Adaptation des unites de mesure selon le marche cible

### Optimisation SEO des Titres

L'IA analyse vos titres produits et propose des versions optimisees pour le referencement naturel :

- Inclusion des mots-cles pertinents
- Respect des longueurs recommandees par marketplace (Amazon, Google Shopping)
- Mise en avant des attributs differenciants (marque, taille, couleur)

### Extraction d'Attributs depuis Descriptions

A partir d'une description en texte libre, l'IA extrait automatiquement les attributs structures :

- Dimensions, poids, materiau, couleur
- Caracteristiques techniques
- Informations de compatibilite

### Suggestions de Categories

L'IA analyse le contenu de votre fiche et suggere les categories les plus pertinentes selon les taxonomies de vos marketplaces cibles (Google Product Category, Amazon Browse Nodes).

---

## Enrichir un Produit

### Enrichissement Individuel

1. Ouvrez la fiche d'un produit depuis le catalogue
2. Cliquez sur le bouton **Enrichir avec l'IA** dans la barre d'actions
3. Selectionnez les champs a enrichir (description, titre SEO, attributs, traduction)
4. Choisissez le modele IA et la langue cible si applicable
5. Cliquez sur **Generer**
6. Relisez les resultats proposes et cliquez sur **Appliquer** pour enregistrer

### Enrichissement en Masse

1. Depuis la liste des produits, selectionnez les produits a enrichir via les cases a cocher
2. Cliquez sur **Actions groupees** puis **Enrichissement IA**
3. Definissez les champs a enrichir et les parametres
4. Cliquez sur **Lancer l'enrichissement**
5. Le traitement se deroule en arriere-plan ; une notification vous previent a la fin

{% callout type="note" %}
L'enrichissement en masse traite les produits par lots de 50. Pour un catalogue de 1 000 produits, comptez environ 15 a 20 minutes de traitement selon le provider et le modele choisis.
{% /callout %}

---

## Cout et Credits

Chaque enrichissement consomme des tokens aupres du provider IA. Le cout depend du modele utilise et du volume de texte genere.

| Operation | Tokens Estimes | Cout Approximatif (GPT-4) |
|-----------|---------------|---------------------------|
| Description courte | 200 - 400 tokens | 0,01 - 0,02 EUR |
| Description longue | 500 - 1 000 tokens | 0,03 - 0,06 EUR |
| Traduction d'une fiche | 300 - 800 tokens | 0,02 - 0,05 EUR |
| Optimisation titre SEO | 100 - 200 tokens | 0,005 - 0,01 EUR |
| Extraction d'attributs | 200 - 500 tokens | 0,01 - 0,03 EUR |

Un compteur de credits consommes est disponible dans **Parametres > Intelligence Artificielle > Utilisation**. Vous pouvez y suivre votre consommation en temps reel et definir des alertes de seuil.

{% callout type="warning" %}
Surveillez regulierement votre consommation de tokens pour eviter les depassements de budget. Definissez un plafond mensuel dans les parametres du provider pour limiter les couts.
{% /callout %}

---

## Qualite et Verification

L'intelligence artificielle produit des resultats de grande qualite, mais une relecture humaine reste indispensable :

- **Exactitude factuelle** : verifiez que les caracteristiques techniques generees correspondent a la realite du produit
- **Ton et style** : ajustez le registre de langue selon votre marque (professionnel, decontracte, technique)
- **Conformite reglementaire** : assurez-vous que les descriptions respectent les obligations legales de votre secteur
- **Coherence** : verifiez la coherence entre les differentes langues pour les traductions

---

## Bonnes Pratiques

1. **Fournissez un maximum de donnees source** : plus la fiche initiale est complete (titre, marque, categorie, attributs de base), meilleur sera le resultat de l'enrichissement
2. **Verifiez systematiquement les resultats** : relisez chaque contenu genere avant publication, en particulier les specifications techniques
3. **Enrichissez par lots homogenes** : regroupez les produits similaires (meme categorie, meme type) pour obtenir des resultats plus coherents
4. **Testez plusieurs modeles** : comparez les resultats entre GPT-4 et Claude pour identifier celui qui convient le mieux a votre secteur
5. **Definissez des modeles de prompt** : enregistrez des configurations de ton et de style pour garantir l'homogeneite de vos descriptions
6. **Commencez petit** : testez l'enrichissement sur un echantillon de 10 a 20 produits avant de lancer un traitement en masse

---

## Ressources Techniques

Pour des informations techniques approfondies sur le module d'enrichissement IA :

- [Module AI Enrichment](/docs/modules/ai-enrichment) -- Architecture technique et configuration avancee
- [Feature AI Enrichment](/docs/features/ai-enrichment) -- Specifications detaillees des fonctionnalites

---

## Prochaines Etapes

- [Price Monitor](/docs/guide/price-monitor) -- Surveillez les prix de vos concurrents
- [Code2ASIN](/docs/guide/code2asin) -- Mappez vos codes produits vers les ASIN Amazon
- [EAN Lookup](/docs/guide/ean-lookup) -- Recherchez des informations produit par code EAN
