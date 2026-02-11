---
title: Price Monitor
nextjs:
  metadata:
    title: Price Monitor - Guide Utilisateur Products Manager APP
    description: "Surveillez les prix de vos concurrents et du marche, configurez des alertes et ajustez vos prix grace au module Price Monitor de Products Manager APP."
---

Surveillez les prix de vos concurrents et du marche en temps reel, configurez des alertes automatiques et ajustez vos tarifs pour rester competitif. {% .lead %}

---

## Vue d'Ensemble

Le module **Price Monitor** de Products Manager APP vous offre une vision claire et actualisee des prix pratiques par vos concurrents et sur les principales marketplaces. Cet outil de veille concurrentielle vous permet de prendre des decisions tarifaires eclairees, basees sur des donnees concretes plutot que sur des estimations.

Que vous vendiez sur un seul canal ou sur plusieurs marketplaces, le Price Monitor centralise toutes les informations de prix dans un tableau de bord unique.

---

## Configuration du Price Monitor

### Activer le Module

1. Rendez-vous dans **Parametres** depuis le menu lateral
2. Selectionnez l'onglet **Modules**
3. Activez le module **Price Monitor**
4. Cliquez sur **Enregistrer**

### Ajouter des Sources de Surveillance

Pour chaque produit ou groupe de produits, vous pouvez definir des sources de surveillance :

1. Accedez a **Price Monitor** depuis le menu lateral
2. Cliquez sur **Ajouter une source**
3. Renseignez les informations :
   - **Type de source** : URL concurrente, Amazon, Cdiscount, eBay ou autre marketplace
   - **URL ou identifiant** : lien direct vers la page produit concurrente ou ASIN
   - **Frequence de mise a jour** : quotidienne, bi-hebdomadaire, hebdomadaire
4. Associez la source a un ou plusieurs produits de votre catalogue
5. Cliquez sur **Enregistrer**

{% callout type="note" %}
Vous pouvez ajouter jusqu'a 10 sources concurrentes par produit. Pour les marketplaces Amazon et Cdiscount, l'association se fait automatiquement via le code ASIN ou la reference produit.
{% /callout %}

---

## Tableau de Bord des Prix

Le tableau de bord du Price Monitor affiche une vue comparative synthetique :

| Colonne | Description |
|---------|-------------|
| **Produit** | Titre et SKU de votre produit |
| **Votre Prix** | Prix actuel configure dans votre catalogue |
| **Prix Min Concurrent** | Prix le plus bas releve chez les concurrents |
| **Prix Max Concurrent** | Prix le plus eleve releve chez les concurrents |
| **Prix Moyen Marche** | Moyenne des prix releves sur l'ensemble des sources |
| **Ecart** | Difference en pourcentage entre votre prix et le prix moyen du marche |
| **Tendance** | Indicateur d'evolution du prix concurrent (hausse, baisse, stable) |

Vous pouvez trier et filtrer le tableau par categorie, fournisseur, ecart de prix ou tendance pour identifier rapidement les produits necessitant une action.

---

## Alertes Prix

### Configurer des Alertes

Le systeme d'alertes vous previent automatiquement lorsque les conditions de marche changent :

1. Depuis le tableau de bord, cliquez sur **Configurer les alertes**
2. Definissez vos regles d'alerte :
   - **Prix concurrent inferieur** : notification lorsqu'un concurrent passe sous votre prix
   - **Ecart en pourcentage** : alerte si l'ecart depasse un seuil defini (ex. : 10 %)
   - **Changement brusque** : notification en cas de variation superieure a un pourcentage sur 24 heures
3. Choisissez le mode de notification : email, notification dans l'application ou les deux
4. Cliquez sur **Enregistrer**

{% callout type="warning" %}
Definissez des seuils realistes pour eviter un volume excessif de notifications. Un ecart de 5 a 10 % est generalement un bon point de depart pour la plupart des secteurs.
{% /callout %}

### Gerer les Alertes

Les alertes actives sont visibles dans le centre de notifications de l'application et dans l'onglet **Alertes** du Price Monitor. Chaque alerte indique le produit concerne, la source, l'ancien prix et le nouveau prix.

---

## Historique des Prix

### Consulter l'Historique

Cliquez sur un produit dans le tableau de bord pour acceder a son historique de prix detaille. Un graphique interactif affiche l'evolution des prix sur la periode selectionnee.

### Periodes Disponibles

| Periode | Utilisation Recommandee |
|---------|------------------------|
| **30 jours** | Suivi operationnel quotidien |
| **60 jours** | Analyse des tendances a moyen terme |
| **90 jours** | Identification des cycles saisonniers |
| **Personnalisee** | Analyse sur une periode specifique |

L'historique permet de reperer les patterns de tarification de vos concurrents (promotions recurrentes, ajustements saisonniers) et d'anticiper vos propres ajustements.

---

## Recommandations de Prix

Sur la base des donnees collectees, le Price Monitor genere des recommandations tarifaires pour chaque produit :

- **Prix competitif** : prix suggere pour s'aligner sur la concurrence
- **Prix optimal** : prix maximisant la marge tout en restant dans la fourchette du marche
- **Prix agressif** : prix positionne en dessous du concurrent le moins cher

Ces recommandations sont des suggestions basees sur les donnees du marche. La decision finale de modification des prix vous appartient.

---

## Actions Rapides

Depuis le tableau de bord du Price Monitor, vous pouvez ajuster vos prix sans quitter l'ecran :

1. Identifiez un produit necessitant un ajustement
2. Cliquez sur le bouton **Ajuster le prix** dans la colonne actions
3. Saisissez le nouveau prix ou appliquez une des recommandations proposees
4. Cliquez sur **Appliquer**

Le nouveau prix est immediatement mis a jour dans votre catalogue et sera repercute lors de la prochaine synchronisation avec vos canaux de vente.

---

## Export des Rapports de Prix

Exportez les donnees du Price Monitor pour analyse approfondie ou archivage :

1. Depuis le tableau de bord, cliquez sur **Exporter**
2. Selectionnez le format : **CSV** ou **PDF**
3. Choisissez la periode et les produits a inclure
4. Cliquez sur **Telecharger**

Le rapport CSV inclut l'ensemble des donnees brutes (prix, dates, sources), tandis que le rapport PDF propose une synthese visuelle avec graphiques et recommandations.

---

## Bonnes Pratiques

1. **Surveillez vos produits cles** : concentrez la surveillance sur vos meilleures ventes et vos produits a forte marge
2. **Ajustez vos seuils d'alerte** : affinez les seuils au fil du temps en fonction de la volatilite des prix dans votre secteur
3. **Analysez les tendances** : ne reagissez pas a chaque fluctuation ponctuelle ; basez vos decisions sur les tendances de moyen terme
4. **Automatisez les rapports** : programmez un export hebdomadaire pour constituer un historique de reference
5. **Combinez avec l'enrichissement IA** : utilisez les donnees de prix pour ajuster vos descriptions et mises en avant produit

---

## Ressources Techniques

Pour des informations techniques approfondies sur le Price Monitor :

- [Module Price Monitor](/docs/modules/price-monitor) -- Architecture technique et configuration avancee
- [Market Intelligence](/docs/features/market-intelligence) -- Fonctionnalites d'intelligence de marche

---

## Prochaines Etapes

- [Code2ASIN](/docs/guide/code2asin) -- Mappez vos codes produits vers les ASIN Amazon
- [EAN Lookup](/docs/guide/ean-lookup) -- Recherchez des informations produit par code EAN
- [Tableau de Bord](/docs/guide/tableau-de-bord) -- Suivez l'activite globale de votre catalogue
