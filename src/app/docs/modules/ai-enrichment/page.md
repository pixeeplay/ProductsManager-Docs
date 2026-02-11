---
title: AI Enrichment
nextjs:
  metadata:
    title: AI Enrichment
    description: Moteur d'enrichissement IA reel avec OpenAI et Anthropic pour le catalogue produits
---

# AI Enrichment

Le module AI Enrichment utilise des modeles de langage (OpenAI GPT et Anthropic Claude) pour enrichir automatiquement les fiches produits : descriptions, categorisation, SEO, extraction d'attributs et scoring qualite. {% .lead %}

## Vue d'ensemble

L'enrichissement IA est un systeme en deux couches :

1. **AI Services** (`ai_services`) : Couche d'abstraction des fournisseurs IA (OpenAI, Anthropic, Ollama, etc.)
2. **AI Enrichment** (`ai_enrichment`) : Moteur d'enrichissement metier qui utilise AI Services pour traiter les produits

{% callout type="note" title="Dependance inter-modules" %}
Le module `ai_enrichment` depend de `ai_services`. Si AI Services est desactive, AI Enrichment est automatiquement desactive.
{% /callout %}

## Fournisseurs supportes

### OpenAI

| Modele | Cout input (1K tokens) | Cout output (1K tokens) | Usage recommande |
|--------|----------------------|------------------------|-----------------|
| `gpt-4` | $0.03 | $0.06 | Enrichissement haute qualite |
| `gpt-4-turbo` | $0.01 | $0.03 | Batch volumetrique |
| `gpt-3.5-turbo` | $0.0005 | $0.0015 | Taches simples (EAN, categorisation rapide) |

Le provider OpenAI utilise `aiohttp` pour les appels API et `tiktoken` pour le comptage exact de tokens.

### Anthropic (Claude)

| Modele | Cout input (1K tokens) | Cout output (1K tokens) | Usage recommande |
|--------|----------------------|------------------------|-----------------|
| `claude-3-5-sonnet` | $0.003 | $0.015 | Equilibre qualite/cout |
| `claude-3-opus` | $0.015 | $0.075 | Descriptions complexes |
| `claude-3-haiku` | $0.00025 | $0.00125 | Categorisation rapide |

Le provider Anthropic utilise le SDK officiel `AsyncAnthropic` avec estimation de tokens par approximation (longueur/4).

### Ollama (local/cloud)

Support pour les modeles auto-heberges via Ollama, en mode local ou cloud. Ideal pour les traitements sensibles ou le developpement sans couts API.

## Fonctionnalites d'enrichissement

### Enrichissement complet

La methode `enrich_product()` applique toutes les operations d'enrichissement sur un produit :

```python
result = await enrichment_service.enrich_product(
    product_id=product.id,
    operations=["description", "categorization", "seo", "attributes"]
)
```

### Generation de descriptions

Genere des descriptions marketing optimisees en plusieurs langues :

```python
description = await enrichment_service.generate_description(
    product_title="Casque Bluetooth Sony WH-1000XM5",
    product_attributes={"brand": "Sony", "type": "casque audio"},
    language="fr",
    tone="professional"
)
```

### Categorisation automatique

Classifie les produits dans la taxonomie du catalogue :

```python
categories = await enrichment_service.categorize_product(
    product_title="Casque Bluetooth Sony WH-1000XM5",
    product_description="Casque sans fil a reduction de bruit..."
)
# Retourne: [CategoryPrediction(category="Audio > Casques", confidence=0.95)]
```

### Optimisation SEO

Genere les meta-titres, meta-descriptions et mots-cles :

```python
seo = await enrichment_service.optimize_seo(
    product_title="...",
    product_description="..."
)
# Retourne: SEOData(meta_title, meta_description, keywords, slug)
```

### Extraction d'attributs

Extrait les attributs structures depuis les textes libres :

```python
attributes = await enrichment_service.extract_attributes(
    product_title="Casque Bluetooth Sony WH-1000XM5 Noir",
    product_description="..."
)
# Retourne: {"couleur": "Noir", "connectivite": "Bluetooth", ...}
```

### Scoring qualite

Evalue la completude et la qualite d'une fiche produit :

```python
score = await enrichment_service.analyze_quality(product_id)
# Retourne: QualityScore avec poids:
#   title: 0.25, description: 0.30, completeness: 0.45
```

## Traitement par batch

Le batch processing permet d'enrichir des centaines de produits en parallele avec controle de concurrence :

```python
results = await enrichment_service.enrich_batch(
    product_ids=[...],
    operations=["description", "seo"],
    max_concurrent=5  # Semaphore asyncio
)
```

### Fonctionnalites batch

- **Concurrence controlee** : `asyncio.Semaphore` limite les appels API paralleles
- **Pause/Resume** : L'utilisateur peut mettre en pause et reprendre un batch
- **Progression temps reel** : Pourcentage de completion visible dans l'interface
- **Budget** : Suivi des couts par batch (tokens consommes x tarif modele)
- **Gestion d'erreurs** : Les erreurs individuelles n'arretent pas le batch

{% callout type="warning" title="Couts API" %}
Les appels IA sont factures par les fournisseurs. Surveillez le budget via l'interface AI Dashboard. Utilisez `gpt-3.5-turbo` ou `claude-3-haiku` pour les traitements volumetriques.
{% /callout %}

## Validation des reponses

Le systeme `AIResponseValidator` valide chaque reponse IA avant de l'appliquer :

- **Parsing JSON** : Extraction du JSON depuis la reponse brute du modele
- **Verification PII** : Detection d'informations personnelles potentiellement generees
- **Controles de securite** : Rejet des contenus inattendus ou malveillants
- **Retry automatique** : En cas de reponse invalide, re-tentative avec exponential backoff

## Architecture du code

```
api/services/ai/
├── enrichment_service.py     # Moteur d'enrichissement (1129 lignes)
├── models.py                 # Modeles Pydantic (749 lignes)
├── providers/
│   ├── base.py              # AIProvider interface abstraite
│   ├── openai.py            # Provider OpenAI (GPT)
│   └── anthropic.py         # Provider Anthropic (Claude)
```

### Modeles Pydantic

| Modele | Description |
|--------|------------|
| `EnrichmentResult` | Resultat d'enrichissement unitaire |
| `BatchResult` | Resultat d'un batch avec statistiques |
| `QualityScore` | Score de qualite avec detail par critere |
| `SEOData` | Donnees SEO generees |
| `CategoryPrediction` | Prediction de categorie avec confiance |
| `GeneratedDescription` | Description generee multi-langue |
| `ExtractedAttributes` | Attributs extraits structures |
| `EnrichmentRequest` | Requete d'enrichissement unitaire |
| `BatchEnrichmentRequest` | Requete de batch enrichissement |

### Pattern Strategy (AIProvider)

L'interface `AIProvider` definit le contrat pour chaque fournisseur :

```python
class AIProvider(ABC):
    @abstractmethod
    async def generate_text(self, prompt: str, ...) -> str: ...

    @abstractmethod
    def count_tokens(self, text: str) -> int: ...

    @abstractmethod
    def calculate_cost(self, input_tokens: int, output_tokens: int) -> float: ...
```

Chaque provider (OpenAI, Anthropic) implemente cette interface, permettant de changer de fournisseur sans modifier le code metier.

## Configuration des providers

Les providers IA sont configures via le router `/api/v1/ai-providers` :

| Endpoint | Methode | Description |
|----------|---------|------------|
| `/ai-providers` | GET | Liste tous les providers configures |
| `/ai-providers` | POST | Ajouter un nouveau provider |
| `/ai-providers/{id}` | PUT | Modifier la configuration |
| `/ai-providers/{id}` | DELETE | Supprimer un provider |
| `/ai-providers/{id}/toggle` | PATCH | Activer/desactiver |
| `/ai-providers/{id}/test` | POST | Tester la connexion |
| `/ai-providers/initialize-defaults` | POST | Initialiser les providers par defaut |

Les types de providers supportes : `openai`, `claude`, `gemini`, `mistral`, `ollama_local`, `ollama_cloud`.

## Suivi et analytics

Les appels IA sont traces dans la table `ai_usage_logs` (base `db_analytics`) :

- **Tokens consommes** : Input et output par appel
- **Cout** : Calcule automatiquement selon le modele et le tarif
- **Latence** : Temps de reponse du provider
- **Taux de succes** : Ratio reponses valides / appels totaux

Le dashboard IA (`/ai-services`) affiche ces metriques en temps reel.

## Liens utiles

- [Systeme de modules](/docs/modules/module-system) — Activation des modules
- [MCP Servers](/docs/mcp/servers) — Serveur MCP AI Enrichment (6 outils)
- [AI Providers](/docs/mcp/ai-providers) — Configuration des fournisseurs IA
