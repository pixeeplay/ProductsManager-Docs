---
title: Price Monitor
nextjs:
  metadata:
    title: Price Monitor - Products Manager APP
    description: Surveillance des prix concurrents avec SerpAPI, SearXNG, matching intelligent et tiers de monitoring.
---

Surveillez les prix de vos concurrents en temps reel. Le module Price Monitor collecte automatiquement les prix depuis Google Shopping et Amazon via SerpAPI, avec fallback SearXNG auto-heberge, et propose un systeme de validation par matching intelligent. {% .lead %}

---

## Vue d'Ensemble

Le module **Price Monitor** permet de :

- Suivre les prix concurrents de vos produits sur les marketplaces
- Definir des tiers de surveillance (4h, 24h, 7j) selon la priorite
- Valider les correspondances produit via matching EAN strict + titre fuzzy
- Blacklister des concurrents indesirables
- Visualiser l'historique des prix et les ecarts concurrentiels

L'architecture repose sur deux adaptateurs de collecte (SerpAPI et SearXNG) orchestre par un `CollectorService`, avec stockage des resultats dans `db_catalog` et des logs de verification dans `db_analytics`.

---

## Fonctionnalites Principales

### Dashboard

Le dashboard affiche les KPIs essentiels :

| KPI | Description |
|-----|-------------|
| Produits surveilles | Nombre total de produits avec monitoring actif |
| Concurrents detectes | Nombre de concurrents uniques trouves |
| Verifications aujourd'hui | Nombre de checks prix effectues dans la journee |
| Competitivite | Pourcentage de produits ou votre prix est inferieur ou egal au concurrent le moins cher |
| Ecart moyen | Ecart de prix moyen entre vos prix et les concurrents |

### Tiers de Monitoring

Chaque produit surveille est assigne a un tier qui determine la frequence de verification :

| Tier | Intervalle | Usage |
|------|-----------|-------|
| `TIER1_FAST` | 4 heures | Produits strategiques, bestsellers |
| `TIER2_STANDARD` | 24 heures | Catalogue principal |
| `TIER3_SLOW` | 7 jours | Long tail, produits a rotation lente |

Le scheduler Celery Beat calcule automatiquement le `next_check_at` et declenche les verifications dues.

### Collecte de Prix

Le `CollectorService` orchestre la collecte en 3 etapes :

1. **Recherche** : Envoi de la requete vers SerpAPI (Google Shopping + Amazon) ou SearXNG
2. **Matching** : Correspondance EAN stricte ou titre fuzzy avec scoring de confiance
3. **Stockage** : Persistance des resultats dans `product_competitors`

{% callout type="note" title="SerpAPI vs SearXNG" %}
SerpAPI est le provider principal (requiert une cle API payante). SearXNG est un moteur de recherche auto-heberge utilise en fallback gratuit. La cle SerpAPI est configurable via la variable `SERPAPI_API_KEY` ou la configuration AI Providers en base.
{% /callout %}

### Matching Intelligent

Le `MatchingService` utilise deux strategies :

- **EAN strict** : Correspondance exacte du code EAN/GTIN (confiance 100%)
- **Titre fuzzy** : Comparaison du titre et de la marque avec un score de similarite (seuil configurable)

Les resultats avec matching fuzzy sont places dans une **file de validation** pour revue manuelle.

### Gestion des Concurrents

- **Creation** : Ajout de concurrents avec nom, URL de base et statut actif
- **Blacklist** : Exclusion de concurrents indesirables avec motif
- **Statistiques** : Nombre de produits, prix moyen par concurrent
- **Soft delete** : Desactivation sans perte de donnees historiques

---

## API Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/prices/dashboard` | KPIs du dashboard |
| `GET` | `/api/v1/prices/monitored` | Liste des produits surveilles |
| `PATCH` | `/api/v1/prices/monitored/{product_id}` | Modifier tier/statut |
| `POST` | `/api/v1/prices/monitored/bulk` | Activer le monitoring en masse |
| `POST` | `/api/v1/prices/check/{product_id}` | Lancer une verification manuelle |
| `POST` | `/api/v1/prices/check/bulk` | Verification en masse |
| `GET` | `/api/v1/prices/history/{product_id}` | Historique des prix |
| `GET` | `/api/v1/prices/competitors` | Liste des concurrents |
| `POST` | `/api/v1/prices/competitors` | Creer un concurrent |
| `PATCH` | `/api/v1/prices/competitors/{id}` | Modifier un concurrent |
| `DELETE` | `/api/v1/prices/competitors/{id}` | Supprimer un concurrent |
| `POST` | `/api/v1/prices/competitors/blacklist` | Blacklister un concurrent |
| `DELETE` | `/api/v1/prices/competitors/blacklist/{id}` | Retirer de la blacklist |
| `GET` | `/api/v1/prices/validation` | File de validation (matchs fuzzy) |
| `POST` | `/api/v1/prices/validation/{item_id}` | Valider/rejeter un match |

---

## Base de Donnees

| Base | Tables | Contenu |
|------|--------|---------|
| `db_catalog` | `competitors`, `product_competitors`, `price_monitor_config`, `competitor_blacklist`, `price_history` | Donnees concurrentielles et configuration |
| `db_analytics` | `price_check_log` | Logs d'audit des verifications |

---

## Architecture des Services

```
api/services/price_monitor/
  collector_service.py      Orchestrateur (recherche -> matching -> stockage)
  serpapi_adapter.py        Adaptateur SerpAPI (Google Shopping + Amazon)
  searxng_adapter.py        Adaptateur SearXNG (fallback auto-heberge)
  matching_service.py       Matching EAN strict + titre fuzzy
  scheduler.py              Planification Celery Beat par tier
```

---

## Prochaines Etapes

- [Fournisseurs](/docs/modules/suppliers) : Gerez vos fournisseurs et leurs prix
- [Completude](/docs/modules/completeness) : Evaluez la qualite de vos fiches produit
- [API Endpoints](/docs/api/endpoints) : Reference complete de l'API REST
