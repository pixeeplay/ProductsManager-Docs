---
title: Code2ASIN
nextjs:
  metadata:
    title: Code2ASIN - Guide Utilisateur Products Manager APP
    description: "Mappez automatiquement vos codes produits EAN, UPC et ISBN vers les ASIN Amazon grace au module Code2ASIN de Products Manager APP."
---

Mappez automatiquement vos codes produits (EAN, UPC, ISBN) vers les identifiants ASIN Amazon pour preparer vos exports et enrichir vos fiches produit. {% .lead %}

---

## Vue d'Ensemble

Le module **Code2ASIN** de Products Manager APP vous permet de retrouver automatiquement l'identifiant ASIN (Amazon Standard Identification Number) correspondant a vos produits a partir de leurs codes-barres EAN, UPC ou ISBN. Cette correspondance est indispensable pour vendre sur Amazon, mais aussi pour enrichir vos fiches avec les donnees disponibles sur la marketplace.

Plutot que de rechercher manuellement chaque ASIN sur Amazon, Code2ASIN automatise le processus pour l'ensemble de votre catalogue.

---

## Comment Fonctionne Code2ASIN

Le module interroge l'API **Amazon Product Advertising** (PA-API) pour etablir la correspondance entre vos codes produits et les ASIN Amazon :

1. Products Manager APP envoie le code EAN/UPC/ISBN a l'API Amazon
2. L'API recherche le produit correspondant dans le catalogue Amazon
3. Si une correspondance est trouvee, l'ASIN, le titre, le prix et l'image Amazon sont retournes
4. Les resultats sont enregistres dans votre fiche produit

{% callout type="note" %}
La recherche est effectuee sur la marketplace Amazon correspondant a votre configuration (Amazon.fr, Amazon.de, Amazon.co.uk, Amazon.com, etc.). Vous pouvez configurer plusieurs marketplaces.
{% /callout %}

---

## Configuration

### Activer le Module

1. Rendez-vous dans **Parametres** depuis le menu lateral
2. Selectionnez l'onglet **Modules**
3. Activez le module **Code2ASIN**
4. Cliquez sur **Enregistrer**

### Configurer les Identifiants Amazon PA-API

Pour utiliser Code2ASIN, vous devez disposer d'un compte Amazon Associates et d'un acces a la Product Advertising API :

1. Dans **Parametres > Code2ASIN**, cliquez sur **Configurer**
2. Renseignez vos identifiants :
   - **Access Key** : votre cle d'acces PA-API
   - **Secret Key** : votre cle secrete PA-API
   - **Partner Tag** : votre tag d'affilie Amazon Associates
   - **Marketplace** : selectionnez la ou les marketplaces cibles
3. Cliquez sur **Tester la connexion** pour verifier la validite de vos identifiants
4. Cliquez sur **Enregistrer**

{% callout type="warning" %}
L'API Amazon PA-API impose des limites de requetes (1 requete par seconde par defaut). Products Manager APP gere automatiquement le throttling, mais les recherches en masse peuvent prendre du temps en consequence.
{% /callout %}

---

## Utilisation

### Recherche Individuelle

1. Ouvrez la fiche d'un produit contenant un code EAN, UPC ou ISBN
2. Dans la section **Identifiants**, cliquez sur **Rechercher ASIN**
3. Le systeme interroge l'API Amazon et affiche le resultat en quelques secondes
4. Si un ASIN est trouve, cliquez sur **Associer** pour l'enregistrer dans la fiche

### Recherche en Masse

1. Depuis la liste des produits, selectionnez les produits a traiter via les cases a cocher ou utilisez les filtres pour cibler un ensemble de produits
2. Cliquez sur **Actions groupees** puis **Recherche Code2ASIN**
3. Confirmez le lancement de la recherche
4. Le traitement se deroule en arriere-plan ; une notification vous previent a la fin
5. Consultez le rapport de resultats dans **Code2ASIN > Historique des recherches**

---

## Resultats

Pour chaque code produit traite, le systeme retourne les informations suivantes lorsqu'une correspondance est trouvee :

| Donnee | Description |
|--------|-------------|
| **ASIN** | Identifiant unique Amazon du produit |
| **Titre Amazon** | Titre du produit tel qu'affiche sur Amazon |
| **Prix Amazon** | Prix de vente actuel sur la marketplace |
| **Image Amazon** | URL de l'image principale du produit sur Amazon |
| **Categorie Amazon** | Categorie Browse Node dans laquelle le produit est classe |
| **Disponibilite** | Statut de disponibilite du produit (en stock, indisponible) |

Les resultats sont consultables dans la fiche produit (onglet **Amazon**) et dans le tableau recapitulatif de Code2ASIN.

---

## Taux de Correspondance

Le taux de correspondance depend de plusieurs facteurs :

- **Qualite des codes EAN** : des codes EAN valides et correctement saisis augmentent significativement le taux de resultats
- **Disponibilite sur Amazon** : tous les produits ne sont pas references sur Amazon, en particulier les produits de niche ou les marques distributeur
- **Marketplace cible** : un produit peut etre disponible sur Amazon.com mais pas sur Amazon.fr
- **Exactitude du code** : un code EAN errone (mauvais checksum, format invalide) ne retournera aucun resultat

En moyenne, le taux de correspondance se situe entre **60 % et 85 %** pour un catalogue de produits de grande consommation.

{% callout type="note" %}
Utilisez le module [EAN Lookup](/docs/guide/ean-lookup) pour valider la qualite de vos codes EAN avant de lancer une recherche Code2ASIN. Cela ameliore sensiblement le taux de correspondance.
{% /callout %}

---

## Utilisation des ASIN Trouves

Une fois les ASIN associes a vos produits, vous pouvez les exploiter de plusieurs facons :

- **Preparation des exports Amazon** : les ASIN sont utilises lors de la creation de vos listings Amazon Seller Central
- **Enrichissement des fiches** : recuperez le titre, les images et la categorisation Amazon pour completer vos fiches
- **Veille concurrentielle** : utilisez les ASIN dans le [Price Monitor](/docs/guide/price-monitor) pour surveiller les prix Amazon
- **Analyse de marche** : identifiez quels produits de votre catalogue sont presents sur Amazon et a quel prix

---

## Bonnes Pratiques

1. **Verifiez vos EAN avant la recherche** : utilisez le module [EAN Lookup](/docs/guide/ean-lookup) pour valider le format et le checksum de vos codes-barres
2. **Traitez par lots de 500 maximum** : pour des raisons de performance et de limites API, privilegiez des lots de 500 produits maximum
3. **Ciblez une marketplace a la fois** : lancez les recherches marketplace par marketplace pour un meilleur suivi des resultats
4. **Mettez a jour regulierement** : les ASIN peuvent changer ou de nouveaux produits apparaitre sur Amazon ; relancez la recherche periodiquement
5. **Exploitez les resultats** : ne vous limitez pas a l'ASIN ; utilisez le titre et les images Amazon pour enrichir vos propres fiches

---

## Ressources Techniques

Pour des informations techniques approfondies sur le module Code2ASIN :

- [Feature Code2ASIN](/docs/features/code2asin) -- Specifications detaillees et documentation API

---

## Prochaines Etapes

- [EAN Lookup](/docs/guide/ean-lookup) -- Validez et enrichissez vos codes EAN
- [Enrichissement IA](/docs/guide/enrichissement-ia) -- Completez vos fiches avec l'intelligence artificielle
- [Price Monitor](/docs/guide/price-monitor) -- Surveillez les prix de vos concurrents sur Amazon
