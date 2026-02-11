---
title: AI Providers
nextjs:
  metadata:
    title: AI Providers
    description: Configuration des fournisseurs IA (OpenAI, Anthropic, Gemini, Ollama) pour l'enrichissement produits
---

# AI Providers

Les AI Providers sont les fournisseurs de modeles de langage utilises par le module AI Enrichment. ProductsManager supporte 6 types de providers avec configuration dynamique depuis l'interface. {% .lead %}

## Types de providers supportes

| Type | Nom | SDK/Client | Modeles principaux |
|------|-----|-----------|-------------------|
| `openai` | OpenAI | aiohttp + tiktoken | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo |
| `claude` | Anthropic | AsyncAnthropic SDK | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku |
| `gemini` | Google Gemini | API REST | Gemini Pro, Gemini Ultra |
| `mistral` | Mistral AI | API REST | Mistral Large, Mistral Medium |
| `ollama_local` | Ollama (local) | HTTP local | Llama 3, Mixtral, CodeLlama, etc. |
| `ollama_cloud` | Ollama (cloud) | HTTP distant | Idem, heberge sur serveur |

## Configuration

### Via l'interface

La page `/ai-providers` permet de :
- Ajouter un nouveau provider (formulaire avec type, nom, cle API, modele)
- Modifier la configuration d'un provider existant
- Activer/desactiver un provider
- Tester la connexion
- Supprimer un provider

### Via l'API

Les endpoints sont sous `/api/v1/ai-providers` :

| Endpoint | Methode | Description |
|----------|---------|------------|
| `/ai-providers` | GET | Liste tous les providers |
| `/ai-providers` | POST | Creer un nouveau provider |
| `/ai-providers/{id}` | GET | Detail d'un provider |
| `/ai-providers/{id}` | PUT | Modifier la configuration |
| `/ai-providers/{id}` | DELETE | Supprimer un provider |
| `/ai-providers/{id}/toggle` | PATCH | Activer/desactiver |
| `/ai-providers/{id}/test` | POST | Tester la connexion |
| `/ai-providers/initialize-defaults` | POST | Initialiser les providers par defaut |
| `/ai-providers/sync` | POST | Synchroniser depuis le frontend |

### Endpoints Ollama

Pour les providers Ollama (local et cloud), des endpoints supplementaires sont disponibles :

| Endpoint | Description |
|----------|------------|
| `/ai-providers/ollama/models` | Lister les modeles installes |
| `/ai-providers/ollama/pull` | Telecharger un nouveau modele |
| `/ai-providers/ollama/delete` | Supprimer un modele |

## Configuration detaillee par provider

### OpenAI

```json
{
  "provider_type": "openai",
  "name": "OpenAI GPT-4",
  "api_key": "sk-...",
  "model": "gpt-4-turbo",
  "config": {
    "temperature": 0.7,
    "max_tokens": 4096,
    "timeout": 30
  }
}
```

**Modeles disponibles et tarifs** :

| Modele | Input (1K tokens) | Output (1K tokens) | Contexte max |
|--------|-------------------|---------------------|-------------|
| `gpt-4` | $0.030 | $0.060 | 8K |
| `gpt-4-turbo` | $0.010 | $0.030 | 128K |
| `gpt-3.5-turbo` | $0.0005 | $0.0015 | 16K |

Le comptage de tokens est exact grace a la librairie `tiktoken`.

### Anthropic (Claude)

```json
{
  "provider_type": "claude",
  "name": "Anthropic Claude",
  "api_key": "sk-ant-...",
  "model": "claude-3-5-sonnet-20241022",
  "config": {
    "temperature": 0.7,
    "max_tokens": 4096,
    "timeout": 30
  }
}
```

**Modeles disponibles et tarifs** :

| Modele | Input (1K tokens) | Output (1K tokens) | Contexte max |
|--------|-------------------|---------------------|-------------|
| `claude-3-5-sonnet` | $0.003 | $0.015 | 200K |
| `claude-3-opus` | $0.015 | $0.075 | 200K |
| `claude-3-haiku` | $0.00025 | $0.00125 | 200K |

Le comptage de tokens est approximatif (longueur du texte / 4).

### Ollama (local)

```json
{
  "provider_type": "ollama_local",
  "name": "Ollama Local",
  "config": {
    "base_url": "http://localhost:11434",
    "model": "llama3:8b"
  }
}
```

{% callout type="note" title="Pas de cle API" %}
Ollama en mode local ne necessite pas de cle API. Le serveur Ollama doit etre installe et lance sur la machine.
{% /callout %}

### Ollama (cloud)

```json
{
  "provider_type": "ollama_cloud",
  "name": "Ollama Cloud",
  "config": {
    "base_url": "https://ollama.example.com",
    "model": "mixtral:8x7b",
    "api_key": "..."
  }
}
```

## Architecture du provider

### Interface abstraite (AIProvider)

Chaque provider implemente l'interface `AIProvider` definie dans `api/services/ai/providers/base.py` :

```python
class AIProvider(ABC):
    def __init__(self, config: AIProviderConfig):
        self.config = config

    @abstractmethod
    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Genere du texte a partir d'un prompt."""

    @abstractmethod
    def count_tokens(self, text: str) -> int:
        """Compte le nombre de tokens dans un texte."""

    @abstractmethod
    def calculate_cost(
        self, input_tokens: int, output_tokens: int
    ) -> float:
        """Calcule le cout d'un appel en dollars."""
```

### AIProviderConfig

La configuration d'un provider est encapsulee dans un dataclass :

```python
@dataclass
class AIProviderConfig:
    provider_name: str        # Nom du provider
    model: str               # Modele a utiliser
    api_key: str = ""        # Cle API
    timeout: int = 30        # Timeout en secondes
    max_retries: int = 3     # Nombre de re-tentatives
    temperature: float = 0.7 # Temperature de generation
    max_tokens: int = 4096   # Tokens max en sortie
```

### Retry avec backoff exponentiel

Les providers implementent un mecanisme de retry automatique avec backoff exponentiel en cas d'erreur API :

```python
# Retry automatique : 3 tentatives
# Delai : 1s, 2s, 4s (exponentiel)
# Erreurs retryables : timeout, rate limit, server error
```

### Parsing JSON des reponses

Les reponses des modeles sont automatiquement parsees en JSON quand attendu. Si le modele retourne du texte avec des blocs de code JSON, le parser extrait le contenu JSON.

## Stockage en base de donnees

Les providers sont stockes dans la table `ai_providers` de la base `db_core`. La configuration sensible (cles API) est chiffree en base.

Le provider SerpAPI (pour le Price Monitor) est egalement gere via ce systeme, avec le type `serp_api` et la cle `SERPAPI_API_KEY`.

## Test de connexion

L'endpoint `/ai-providers/{id}/test` envoie un prompt de test simple au provider et verifie :
- La validite de la cle API
- La disponibilite du modele
- Le temps de reponse
- Le format de la reponse

```python
# Test: "Reponds avec le mot OK"
# Succes si la reponse contient "OK" et le temps < timeout
```

## Initialisation des providers par defaut

L'endpoint `/ai-providers/initialize-defaults` cree automatiquement les providers standards si aucun n'est configure. Utile pour le premier demarrage.

{% callout type="warning" title="Securite des cles API" %}
Les cles API sont stockees de maniere securisee en base de donnees. Ne les exposez jamais dans les logs ou les reponses API. Le endpoint GET retourne les cles masquees (`sk-...****`).
{% /callout %}

## Liens utiles

- [AI Enrichment](/docs/modules/ai-enrichment) — Module d'enrichissement IA
- [MCP Servers](/docs/mcp/servers) — Serveur MCP AI Enrichment
- [MCP Vue d'ensemble](/docs/mcp/overview) — Introduction au protocole MCP
