---
title: MCP — Vue d'ensemble
nextjs:
  metadata:
    title: MCP — Vue d'ensemble
    description: Protocole Model Context Protocol (MCP) avec 8 serveurs et 42 outils pour agents IA
---

# MCP — Vue d'ensemble

ProductsManager expose 8 serveurs MCP (Model Context Protocol) totalisant 42 outils, permettant aux agents IA d'interagir avec le catalogue produits via un protocole standardise. {% .lead %}

## Qu'est-ce que MCP ?

Le **Model Context Protocol** (MCP) est un protocole ouvert standardise par Anthropic pour connecter les modeles de langage (LLM) a des sources de donnees et des outils. Il permet aux agents IA (Claude, GPT, etc.) d'acceder aux fonctionnalites de ProductsManager de maniere structuree et securisee.

### Principes cles

- **JSON-RPC 2.0** : Protocole de communication base sur JSON-RPC 2.0
- **Transport stdio** : Communication par entree/sortie standard (stdin/stdout)
- **Decouverte d'outils** : Les agents decouvrent les outils disponibles via `tools/list`
- **Appel d'outils** : Les agents executent les outils via `tools/call`
- **Version du protocole** : `2024-11-05`

{% callout type="note" title="Usage principal" %}
Les serveurs MCP permettent a Claude Code, Claude Desktop, ou tout agent compatible MCP de rechercher des produits, enrichir des fiches, gerer des marques et plus encore, directement depuis une conversation.
{% /callout %}

## Les 8 serveurs

| Serveur | Outils | Description |
|---------|--------|------------|
| **Categories** | 6 | Recherche, arborescence, attributs, mappings, suggestions |
| **Icecat** | 5 | Lookup produit par EAN/MPN/ID, specifications, test connexion |
| **Brands** | 7 | Matching, recherche, aliases, doublons, batch matching |
| **AI Enrichment** | 6 | Categorisation, description, SEO, attributs, scoring, enrichissement |
| **Products** | 5 | Recherche, detail produit, lookup EAN, stats, validation EAN |
| **Suppliers** | 5 | Recherche, details, produits, sourcing, comparaison prix |
| **Code2ASIN** | 4 | Lookup EAN/ASIN, batch, resultats jobs, statistiques |
| **Imports** | 4 | Detail job, liste jobs, erreurs, statistiques |
| **Total** | **42** | |

## Architecture

### Classe de base (BaseMCPServer)

Tous les serveurs heritent de `BaseMCPServer` qui gere le protocole JSON-RPC 2.0 :

```python
class BaseMCPServer:
    def __init__(self, name: str, version: str):
        self.name = name
        self.version = version
        self.tools = {}

    def register_tool(self, name, description, input_schema, handler):
        self.tools[name] = {
            "description": description,
            "inputSchema": input_schema,
            "handler": handler
        }
```

### Cycle de vie d'une requete

1. **initialize** : L'agent envoie une requete d'initialisation, le serveur repond avec ses capacites
2. **tools/list** : L'agent decouvre les outils disponibles (nom, description, schema d'input)
3. **tools/call** : L'agent appelle un outil avec des parametres JSON
4. **Reponse** : Le serveur retourne le resultat en JSON-RPC 2.0

```json
// Requete tools/call
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_products",
    "arguments": {
      "query": "casque bluetooth sony",
      "limit": 10
    }
  }
}

// Reponse
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "[{\"id\": \"...\", \"title\": \"Casque Sony WH-1000XM5\", ...}]"
    }]
  }
}
```

### Transport stdio

Les serveurs MCP communiquent via stdin/stdout, ce qui les rend compatibles avec tout client MCP. Chaque serveur est un processus Python independant :

```bash
# Lancer un serveur MCP
python -m api.mcp.products_server
python -m api.mcp.brands_server
python -m api.mcp.categories_server
```

## Configuration client

### Claude Desktop

Pour connecter Claude Desktop aux serveurs MCP de ProductsManager, ajoutez dans `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "productsmanager-products": {
      "command": "python",
      "args": ["-m", "api.mcp.products_server"],
      "cwd": "/path/to/ProductsManager-App"
    },
    "productsmanager-brands": {
      "command": "python",
      "args": ["-m", "api.mcp.brands_server"],
      "cwd": "/path/to/ProductsManager-App"
    }
  }
}
```

### Claude Code

Claude Code detecte automatiquement les serveurs MCP configures dans le projet. Les serveurs sont lances a la demande.

## Securite

- Les serveurs MCP s'executent localement (pas d'exposition reseau directe)
- L'acces aux donnees passe par les services internes (SQLAlchemy, sessions DB)
- Aucune authentification supplementaire n'est requise car le transport stdio implique un acces local
- Les resultats sont filtres et limites (pagination, max items) pour eviter les surcharges

{% callout type="warning" title="Acces base de donnees" %}
Les serveurs MCP accedent directement aux bases de donnees via les sessions SQLAlchemy. Ils doivent etre executes dans un environnement ou les variables de connexion DB sont configurees.
{% /callout %}

## Structure des fichiers

```
api/mcp/
├── base_server.py            # Classe de base JSON-RPC 2.0
├── categories_server.py      # 6 outils categories
├── icecat_server.py          # 5 outils Icecat
├── brands_server.py          # 7 outils marques
├── ai_enrichment_server.py   # 6 outils enrichissement IA
├── products_server.py        # 5 outils produits
├── suppliers_server.py       # 5 outils fournisseurs
├── code2asin_server.py       # 4 outils Code2ASIN
└── imports_server.py         # 4 outils imports
```

## Liens utiles

- [Serveurs MCP (detail)](/docs/mcp/servers) — Liste complete des 42 outils
- [AI Providers](/docs/mcp/ai-providers) — Configuration des fournisseurs IA
- [AI Enrichment](/docs/modules/ai-enrichment) — Module d'enrichissement IA
