---
title: Systeme de Modules
nextjs:
  metadata:
    title: Systeme de Modules
    description: Architecture modulaire de ProductsManager avec activation dynamique et priorite 3 niveaux
---

# Systeme de Modules

ProductsManager utilise une architecture modulaire permettant d'activer ou desactiver chaque fonctionnalite independamment, sans redemarrage de l'application. {% .lead %}

## Vue d'ensemble

Le systeme de modules centralise la gestion de 17 fonctionnalites. Chaque module peut etre controle via trois niveaux de priorite : la base de donnees (runtime), les variables d'environnement (deploiement), ou les valeurs par defaut (tous actifs).

Cette architecture permet de :
- Personnaliser l'interface par client ou deploiement
- Desactiver des fonctionnalites non utilisees pour simplifier la navigation
- Gerer les dependances entre modules (ex: AI Enrichment depend de AI Services)
- Reordonner les modules dans la sidebar

## Les 17 modules

| ID | Nom | Ordre | Routes | Queues Celery | Icone |
|----|-----|-------|--------|---------------|-------|
| `suppliers` | Fournisseurs | -2 | `/suppliers` | — | users |
| `imports` | Imports | -1 | `/imports` | imports | download |
| `icecat` | Icecat Enrichment | 1 | `/icecat` | icecat | snowflake |
| `odoo_sync` | Odoo ERP Sync | 2 | `/odoo-sync`, `/odoo` | odoo | refresh-cw |
| `prestashop` | PrestaShop Sync | 3 | `/prestashop` | prestashop | store |
| `amazon` | Amazon | 4 | `/amazon` | amazon | shopping-cart |
| `code2asin` | Code2ASIN | 5 | `/code2asin` | code2asin | package |
| `ean_lookup` | EAN/Barcode Lookup | 6 | `/ean-lookup`, `/ean-pending`, `/ean` | — | barcode |
| `ai_services` | AI Services | 7 | `/ai-services`, `/ai-providers` | — | bot |
| `ai_enrichment` | IA Enrichment | 8 | `/ai-enrichment`, `/enrichment` | — | sparkles |
| `exports` | Export Platform | 9 | `/exports` | exports | upload |
| `file_explorer` | File Explorer | 10 | `/file-explorer` | — | folder-open |
| `brand_manager` | Brand Manager | 11 | `/brands` | — | tag |
| `category_manager` | Categories Manager | 12 | `/categories-manager` | — | folder-tree |
| `completeness` | Completude Catalogue | 13 | `/completeness` | — | target |
| `search_engine` | Moteur de Recherche | 14 | `/search` | search_indexing | search |
| `price_monitor` | Price Monitor | 15 | `/prices` | price_monitor | trending-up |

## Priorite a 3 niveaux

Le statut d'un module est determine par un systeme de priorite hierarchique :

### Niveau 1 : Base de donnees (priorite maximale)

Les reglages sont stockes dans la table `AppSetting` (base `db_core`) avec `category='modules'`. Ils sont modifiables a chaud depuis l'interface `/settings/modules`.

```python
# Lecture depuis le cache des settings
db_status = self._get_db_status(module_id)
# Utilise services.settings_service.get_cached_settings()
```

### Niveau 2 : Variables d'environnement

Chaque module possede une variable d'environnement auto-generee au format `MODULE_{ID}_ENABLED` :

```
MODULE_ICECAT_ENABLED=true
MODULE_ODOO_SYNC_ENABLED=false
MODULE_PRESTASHOP_ENABLED=true
MODULE_PRICE_MONITOR_ENABLED=false
```

### Niveau 3 : Valeur par defaut

Si ni la base de donnees ni l'environnement ne definissent le statut, **le module est active par defaut**. Cela garantit la retro-compatibilite avec les deploiements existants.

{% callout type="note" title="Ordre de priorite" %}
DB > Environnement > Defaut. Un module desactive en base de donnees reste desactive meme si `MODULE_*_ENABLED=true` est defini dans l'environnement.
{% /callout %}

## Architecture technique

### ModuleID (Enum)

L'enum `ModuleID` dans `api/core/modules.py` definit les identifiants uniques :

```python
class ModuleID(str, Enum):
    SUPPLIERS = "suppliers"
    IMPORTS = "imports"
    ICECAT = "icecat"
    ODOO_SYNC = "odoo_sync"
    PRESTASHOP = "prestashop"
    AMAZON = "amazon"
    CODE2ASIN = "code2asin"
    EAN_LOOKUP = "ean_lookup"
    AI_SERVICES = "ai_services"
    AI_ENRICHMENT = "ai_enrichment"
    EXPORTS = "exports"
    FILE_EXPLORER = "file_explorer"
    BRAND_MANAGER = "brand_manager"
    CATEGORY_MANAGER = "category_manager"
    COMPLETENESS = "completeness"
    SEARCH_ENGINE = "search_engine"
    PRICE_MONITOR = "price_monitor"
```

### ModuleDefinition (Dataclass)

Chaque module est decrit par une definition structuree :

```python
@dataclass
class ModuleDefinition:
    id: ModuleID                    # Identifiant unique
    name: str                       # Nom d'affichage
    description: str                # Description fonctionnelle
    default_order: int = 0          # Ordre dans la sidebar
    route_prefixes: List[str]       # Prefixes de routes API
    celery_queues: List[str]        # Queues Celery associees
    env_var: str = ""               # Variable d'env (auto-generee)
    icon: str = ""                  # Icone Lucide
    depends_on: List[ModuleID]      # Dependances inter-modules
```

### ModuleService

Le service principal expose les methodes suivantes :

| Methode | Description |
|---------|------------|
| `is_enabled(module_id)` | Verifie si un module est actif (3 niveaux + dependances) |
| `get_all_status()` | Retourne le statut de tous les modules avec metadata |
| `get_enabled_modules()` | Liste des IDs de modules actifs |
| `get_disabled_modules()` | Liste des IDs de modules desactives |
| `is_route_allowed(route)` | Verifie si une route API est autorisee |
| `invalidate_cache()` | Invalide le cache de statut |

### Gestion des dependances

Certains modules dependent d'autres. Par exemple, `ai_enrichment` depend de `ai_services` :

```python
ModuleID.AI_ENRICHMENT.value: ModuleDefinition(
    ...
    depends_on=[ModuleID.AI_SERVICES]
)
```

Si `ai_services` est desactive, `ai_enrichment` est automatiquement desactive, meme s'il est explicitement active en base de donnees.

## API REST

| Endpoint | Methode | Auth | Description |
|----------|---------|------|------------|
| `/api/v1/modules/status` | GET | Non | Statut de tous les modules (public) |
| `/api/v1/modules/{id}` | PATCH | Admin | Activer/desactiver un module |
| `/api/v1/modules/order` | PATCH | Admin | Modifier l'ordre d'affichage |

L'endpoint `/status` est public (sans authentification) car le frontend en a besoin avant la connexion pour configurer la navigation.

## Integration frontend

### ModuleContext

Le contexte React `ModuleContext` charge le statut des modules au demarrage :

```typescript
const { modules, isModuleEnabled } = useModules()

// Verifier si un module est actif
if (isModuleEnabled("icecat")) {
  // Afficher les fonctionnalites Icecat
}
```

### Hook useModule

Le hook `useModule(id)` retourne les details d'un module specifique :

```typescript
const module = useModule("price_monitor")
// { id, name, description, enabled, icon, order, route_prefixes }
```

### Filtrage sidebar et Command Palette

La `PremiumSidebar` et la `CommandPalette` utilisent le contexte modules pour filtrer les elements de navigation. Chaque entree de navigation porte un `moduleId` qui determine sa visibilite.

{% callout type="warning" title="Enregistrement obligatoire" %}
Tout nouveau module doit etre enregistre dans trois fichiers :
1. `api/core/modules.py` — Enum `ModuleID` + entree `MODULE_REGISTRY`
2. `PremiumSidebar.tsx` — Propriete `moduleId` sur l'element de navigation
3. `CommandPalette.tsx` — Propriete `moduleId` sur les commandes associees
{% /callout %}

## Ordre personnalise

L'ordre des modules dans la sidebar peut etre personnalise par l'utilisateur admin. L'ordre custom est stocke dans le cache des settings sous la cle `modules._order` :

```python
custom_order = modules_settings.get("_order", {})
# Ex: {"icecat": 1, "imports": 2, "suppliers": 3, ...}
order = custom_order.get(module_id, module.default_order)
```

Si aucun ordre custom n'est defini, l'ordre par defaut (`default_order`) est utilise.

## Liens utiles

- [Architecture technique](/docs/technical/architecture) — Infrastructure globale
- [File Explorer](/docs/modules/file-explorer) — Module de gestion de fichiers
- [AI Enrichment](/docs/modules/ai-enrichment) — Module d'enrichissement IA
