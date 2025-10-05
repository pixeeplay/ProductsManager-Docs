---
title: Utilisation du Dashboard
nextjs:
  metadata:
    title: Utilisation du Dashboard - Products Manager APP
    description: Guide complet pour exploiter le dashboard et les outils d'analytics de Products Manager.
---

Exploitez pleinement le dashboard Products Manager pour visualiser vos métriques, analyser les tendances et générer des rapports personnalisés. {% .lead %}

---

## Vue d'Ensemble

Le **Dashboard** est votre centre de contrôle pour :

- Visualiser les **métriques clés** en temps réel
- Analyser les **tendances** d'imports et de catalogue
- Monitorer la **performance** des fournisseurs
- Générer des **rapports** personnalisés
- Recevoir des **alertes** automatiques

---

## Widgets Disponibles

### 1. Statistiques Globales

Le panneau de **métriques principales** affiche 4 indicateurs clés :

#### Total Produits

```
12,450 produits
↑ +350 ce mois
```

- **Nombre total** de produits actifs dans le catalogue
- **Évolution** par rapport au mois précédent
- **Graphique sparkline** des 30 derniers jours

#### Fournisseurs Actifs

```
45 fournisseurs
→ Stable
```

- Nombre de fournisseurs avec au moins 1 import dans les 30 derniers jours
- Statut de la tendance (↑ en hausse, ↓ en baisse, → stable)

#### Imports Aujourd'hui

```
8 imports
6 réussis, 2 en échec
```

- Nombre d'imports exécutés dans les **dernières 24 heures**
- Répartition par statut (completed, failed, running)
- Lien direct vers la liste des imports

#### Taux de Succès

```
98.5%
↑ +1.2% ce mois
```

- Pourcentage d'imports réussis sur les 30 derniers jours
- Évolution de la fiabilité
- Code couleur : vert (>95%), orange (90-95%), rouge (<90%)

---

### 2. Graphiques de Tendances

#### Imports par Jour (7 derniers jours)

Graphique en barres affichant :

- **Nombre d'imports** exécutés chaque jour
- **Répartition** par statut (vert = succès, rouge = échec)
- **Nombre de produits** importés par jour (ligne)

**Utilité** : Identifier les jours de forte activité et les anomalies.

#### Produits Ajoutés (30 derniers jours)

Graphique en courbe montrant :

- **Produits créés** chaque jour
- **Produits mis à jour** (ligne en pointillés)
- **Produits supprimés** (ligne rouge)

**Utilité** : Suivre la croissance du catalogue.

#### Performance par Fournisseur

Tableau classant les fournisseurs par :

| Fournisseur | Imports | Produits | Taux Succès | Durée Moy. |
|-------------|---------|----------|-------------|------------|
| Grossiste A | 42 | 12,500 | 99.2% | 2m 15s |
| Fournisseur B | 28 | 8,200 | 97.5% | 1m 45s |
| Supplier C | 15 | 3,800 | 100% | 45s |

**Utilité** : Comparer les performances et identifier les fournisseurs problématiques.

---

### 3. Activité Récente

Liste chronologique des **20 derniers événements** :

```
[10:45] ✓ Import "Grossiste A" terminé - 1,250 produits (2m 10s)
[10:30] ⚠ Stock faible détecté: PROD-12345 (5 unités)
[10:15] ✗ Import "Fournisseur B" échoué - Connexion FTP timeout
[09:50] ✓ Import "Supplier C" terminé - 850 produits (1m 30s)
[09:20] ℹ Nouveau fournisseur créé: "Tech Distributor XYZ"
```

**Types d'événements** :

- ✓ Import réussi
- ✗ Import échoué
- ⚠ Alerte (stock faible, erreurs critiques)
- ℹ Information (nouveau fournisseur, modification config)
- 🔄 En cours (import running)

---

### 4. Alertes et Notifications

Panneau d'alertes actives nécessitant une action :

#### Stock Faible

```
⚠ 12 produits sous le seuil de stock
```

Cliquez pour voir la liste des produits concernés.

#### Imports en Échec

```
✗ 3 imports échoués dans les 24 dernières heures
```

Cliquez pour consulter les détails et les logs d'erreur.

#### Fournisseurs Inactifs

```
ℹ 5 fournisseurs sans import depuis 7 jours
```

Identifiez les fournisseurs à réactiver.

---

## Filtres et Recherche

### Filtrage du Dashboard

Personnalisez la vue avec les filtres :

#### Par Période

```
Dernières 24h | 7 jours | 30 jours | Personnalisé
```

Sélectionnez une plage de dates pour affiner les métriques.

#### Par Fournisseur

```
Tous les fournisseurs | Grossiste A | Fournisseur B | ...
```

Affichez les données d'un fournisseur spécifique.

#### Par Statut

```
Tous | Réussis | Échoués | En cours
```

Filtrez les imports par statut.

---

## Analytics Avancés

### Accéder aux Analytics

1. Cliquez sur **Analytics** dans le menu latéral
2. Choisissez un rapport prédéfini :

#### 1. Rapport d'Imports

Analyse détaillée des imports :

- **Volume** : Nombre d'imports par fournisseur et par période
- **Performance** : Temps d'exécution moyen, débit (produits/sec)
- **Fiabilité** : Taux de succès, types d'erreurs récurrents
- **Tendances** : Évolution hebdomadaire/mensuelle

#### 2. Rapport Produits

Statistiques sur le catalogue :

- **Répartition** : Par fournisseur, catégorie, marque
- **Couverture** : Produits avec images, descriptions, prix
- **Qualité** : Produits avec données incomplètes
- **Évolution** : Croissance du catalogue dans le temps

#### 3. Rapport Performance

Métriques de performance système :

- **Temps de réponse** : API, imports, enrichissement IA
- **Utilisation ressources** : CPU, mémoire, stockage
- **Taux d'erreur** : Par type d'opération
- **Disponibilité** : Uptime du système

---

## Export de Rapports

### Formats Disponibles

Exportez vos rapports dans plusieurs formats :

#### PDF

```
📄 Rapport complet avec graphiques et tableaux
→ Idéal pour présentation
```

#### Excel (.xlsx)

```
📊 Données brutes + feuilles de calcul
→ Idéal pour analyse approfondie
```

#### CSV

```
📋 Données tabulaires simples
→ Idéal pour traitement automatisé
```

### Générer un Export

1. Depuis le dashboard ou Analytics, cliquez sur **Export**
2. Sélectionnez le **format** souhaité
3. Configurez les **options** :
   - Période de données
   - Fournisseurs inclus
   - Métriques à exporter
4. Cliquez sur **Générer**

Le fichier est téléchargé automatiquement.

{% callout type="note" %}
Les exports volumineux (>10 000 lignes) peuvent prendre quelques minutes. Vous recevrez un email quand le fichier sera prêt.
{% /callout %}

---

## Rapports Planifiés

### Automatiser les Rapports

Recevez des rapports par email à intervalles réguliers :

1. **Analytics** → **Rapports Planifiés** → **Nouveau**
2. Configurez :

#### Fréquence

```
Quotidien → Tous les jours à 9h
Hebdomadaire → Tous les lundis à 9h
Mensuel → Premier jour du mois à 9h
```

#### Contenu

Sélectionnez les sections à inclure :

- Statistiques globales
- Imports par fournisseur
- Évolution du catalogue
- Alertes et anomalies

#### Destinataires

```
john.doe@company.com
manager@company.com
```

Ajoutez les emails des destinataires.

### Exemple de Rapport Hebdomadaire

```
Rapport Hebdomadaire - Semaine du 30 Sept au 6 Oct 2025

📊 Métriques Clés
- Total produits : 12,450 (+350)
- Imports exécutés : 56 (100% de succès)
- Fournisseurs actifs : 45

📈 Top 3 Fournisseurs
1. Grossiste A : 15,000 produits importés
2. Fournisseur B : 8,500 produits importés
3. Supplier C : 3,200 produits importés

⚠ Alertes
- 12 produits en stock faible
- 2 fournisseurs inactifs depuis 7 jours

📄 Rapport complet en pièce jointe (PDF)
```

---

## Personnalisation du Dashboard

### Réorganiser les Widgets

Personnalisez la disposition :

1. Cliquez sur **Personnaliser** en haut à droite
2. **Glissez-déposez** les widgets pour les réorganiser
3. **Redimensionnez** les widgets en tirant les coins
4. **Masquez** les widgets non utilisés
5. Cliquez sur **Enregistrer**

### Ajouter des Widgets

Cliquez sur **+ Ajouter un Widget** et choisissez parmi :

- **Graphique personnalisé** : Créez votre propre graphique
- **KPI spécifique** : Affichez une métrique précise
- **Liste filtrée** : Produits, imports ou fournisseurs avec filtres
- **Alerte personnalisée** : Configurez une alerte métier

---

## Widgets Personnalisés

### Créer un Widget Personnalisé

1. **Dashboard** → **+ Ajouter Widget** → **Widget Personnalisé**
2. Configurez :

#### Type de Visualisation

```
Graphique en ligne | Barres | Camembert | Tableau | KPI
```

#### Source de Données

```
Imports | Produits | Fournisseurs | Analytics
```

#### Filtres

```
Période : 30 derniers jours
Fournisseurs : Tous
Statut : Réussis uniquement
```

#### Métrique

```
Nombre d'imports | Total produits | Taux de succès | Durée moyenne
```

### Exemple : Widget "Imports du Jour"

Configuration :

```
Type : Tableau
Source : Imports
Filtre : Dernières 24h
Colonnes : Heure, Fournisseur, Produits, Statut, Durée
Tri : Par heure descendante
Limite : 10 derniers imports
```

Résultat :

| Heure | Fournisseur | Produits | Statut | Durée |
|-------|-------------|----------|--------|-------|
| 14:30 | Grossiste A | 1,250 | ✓ | 2m 10s |
| 12:15 | Supplier C | 850 | ✓ | 1m 30s |
| 10:00 | Fournisseur B | 3,200 | ✗ | 30s |

---

## Comparaisons et Benchmarks

### Comparer des Périodes

Comparez les performances entre deux périodes :

1. **Analytics** → **Comparaison de Périodes**
2. Sélectionnez :

```
Période 1 : 1-30 Sept 2025
Période 2 : 1-30 Août 2025
```

3. Consultez les écarts :

```
📊 Total Imports
Sept : 120 (+15%)
Août : 105

📦 Produits Importés
Sept : 45,000 (+12%)
Août : 40,000

⏱ Durée Moyenne
Sept : 1m 55s (-10%)
Août : 2m 08s
```

### Benchmark par Fournisseur

Comparez vos fournisseurs :

```
Fournisseur A vs Fournisseur B

Vitesse d'import:
A: 42 produits/sec ✓ (meilleur)
B: 35 produits/sec

Taux de succès:
A: 99.2% ✓
B: 97.5%

Fiabilité images:
A: 95% ✓
B: 88%

→ Fournisseur A est 18% plus performant
```

---

## Alertes Personnalisées

### Configurer une Alerte

Recevez des notifications quand certaines conditions sont remplies :

1. **Dashboard** → **Alertes** → **Nouvelle Alerte**
2. Configurez :

#### Condition

```
Taux d'échec des imports > 5%
OU
Stock total < 1,000 produits
OU
Durée import > 5 minutes
```

#### Fréquence de Vérification

```
Toutes les heures | Quotidien | Temps réel
```

#### Notification

```
✉ Email : manager@company.com
📱 Slack : #imports-alerts
🔔 Notification navigateur
```

### Exemples d'Alertes Utiles

#### Alerte Stock Critique

```
Condition : Nombre de produits en stock < 10 > 50 produits
Fréquence : Temps réel
Notification : Email + Slack
```

#### Alerte Performance Dégradée

```
Condition : Durée moyenne import > 3 minutes sur les 10 derniers imports
Fréquence : Toutes les heures
Notification : Email
```

#### Alerte Fournisseur Inactif

```
Condition : Fournisseur sans import depuis 7 jours
Fréquence : Quotidien à 9h
Notification : Email
```

---

## Vues Enregistrées

### Sauvegarder une Vue

Enregistrez vos configurations de filtres :

1. Appliquez vos **filtres** (période, fournisseurs, statut)
2. Cliquez sur **Enregistrer la Vue**
3. Nommez-la (ex: "Imports Mensuels Grossiste A")

### Charger une Vue

Cliquez sur **Mes Vues** et sélectionnez une vue sauvegardée pour appliquer instantanément les filtres.

### Partager une Vue

Partagez vos vues avec votre équipe :

1. Ouvrez une vue enregistrée
2. Cliquez sur **Partager**
3. Sélectionnez les utilisateurs ou groupes
4. Cliquez sur **Partager**

---

## Raccourcis Utiles

| Action | Raccourci |
|--------|-----------|
| Rafraîchir le dashboard | **F5** ou **Ctrl+R** |
| Ouvrir la recherche globale | **Ctrl/Cmd + K** |
| Exporter la vue actuelle | **Ctrl/Cmd + E** |
| Basculer en plein écran | **F11** |
| Aide contextuelle | **?** |

---

## Bonnes Pratiques

### 1. Surveiller Quotidiennement

Consultez le dashboard chaque matin pour :

- Vérifier les imports de la nuit
- Identifier les alertes nécessitant une action
- Valider le taux de succès global

### 2. Configurer des Rapports Hebdomadaires

Automatisez un rapport hebdomadaire pour :

- Partager les métriques avec votre équipe
- Identifier les tendances long terme
- Documenter les améliorations

### 3. Utiliser les Alertes Temps Réel

Configurez des alertes pour les événements critiques :

- Imports en échec
- Stock critique
- Performance dégradée

### 4. Comparer les Performances Mensuellement

Analysez l'évolution chaque mois pour :

- Mesurer l'impact des optimisations
- Identifier les fournisseurs à améliorer
- Justifier les investissements

---

## Accès Mobile

Le dashboard est **responsive** et accessible depuis mobile/tablette :

### Fonctionnalités Mobile

- Statistiques globales
- Activité récente
- Alertes
- Consultation rapide des imports

### Notifications Push

Activez les notifications push sur mobile pour :

- Recevoir les alertes en temps réel
- Être notifié des imports terminés
- Consulter les métriques clés en déplacement

---

## Intégrations

### Exporter vers des Outils BI

Connectez Products Manager à vos outils de Business Intelligence :

- **Power BI** : Connecteur natif disponible
- **Tableau** : Via export CSV automatisé
- **Google Data Studio** : Via API REST
- **Metabase** : Connexion directe à la base de données

Voir : [API Analytics](/docs/api/endpoints#analytics)

---

## Prochaines Étapes

- [Enrichissement IA](/docs/features/ai-enrichment) - Améliorer la qualité des données
- [API Endpoints](/docs/api/endpoints) - Automatiser l'extraction de métriques
- [Webhooks](/docs/api/webhooks) - Recevoir des notifications en temps réel
