---
title: Permissions & RBAC
nextjs:
  metadata:
    title: Permissions & RBAC - Products Manager APP
    description: Guide complet du systeme de controle d'acces base sur les roles (RBAC) pour l'API Products Manager.
---

L'API Products Manager utilise un systeme RBAC (Role-Based Access Control) pour gerer les autorisations de maniere granulaire et securisee. {% .lead %}

---

## Vue d'Ensemble

Le systeme de permissions offre :

- Controle d'acces base sur les roles (RBAC)
- Permissions granulaires par ressource et action
- Support des permissions personnalisees par utilisateur
- Priorite : Superuser > Permissions JSON > Role

---

## Hierarchie des Roles

Products Manager definit 4 roles avec des niveaux de privileges croissants :

| Role | Description | Niveau d'Acces |
|------|-------------|----------------|
| **GUEST** | Visiteur | Aucun acces par defaut |
| **USER** | Utilisateur standard | Lecture + imports basiques |
| **MANAGER** | Gestionnaire | Lecture/ecriture sans suppression ni admin |
| **ADMIN** | Administrateur | Toutes les permissions |

{% callout type="note" %}
Les **Superusers** ont automatiquement acces a toutes les permissions, independamment de leur role ou des permissions JSON configurees.
{% /callout %}

---

## Format des Permissions

Les permissions suivent le format `action:resource` :

```text
read:products      # Lecture des produits
write:suppliers    # Creation/modification des fournisseurs
delete:imports     # Suppression des imports
manage:cache       # Gestion complete du cache
```

### Actions Disponibles

| Action | Description |
|--------|-------------|
| `read` | Consulter les donnees |
| `write` | Creer ou modifier |
| `delete` | Supprimer definitivement |
| `start` | Demarrer un processus |
| `cancel` | Annuler un processus en cours |
| `manage` | Gestion complete (configurations, planifications) |
| `upload` | Telecharger des fichiers |
| `execute` | Executer une action |
| `admin` | Actions administratives |

---

## Permissions par Ressource

### Products (Produits)

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:products` | Consulter les produits | X | X | X | - |
| `write:products` | Creer/modifier les produits | X | X | - | - |
| `delete:products` | Supprimer les produits | X | - | - | - |

---

### Suppliers (Fournisseurs)

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:suppliers` | Consulter les fournisseurs | X | X | X | - |
| `write:suppliers` | Creer/modifier les fournisseurs | X | X | - | - |
| `delete:suppliers` | Supprimer les fournisseurs | X | - | - | - |

---

### Imports

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:imports` | Consulter les imports | X | X | X | - |
| `write:imports` | Creer des imports | X | X | X | - |
| `delete:imports` | Supprimer les imports | X | - | - | - |
| `start:imports` | Demarrer un import | X | X | - | - |
| `cancel:imports` | Annuler un import en cours | X | X | - | - |
| `manage:imports` | Gerer configs et planifications | X | X | - | - |

---

### Exports

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:exports` | Consulter les exports | X | X | - | - |
| `write:exports` | Creer des exports | X | X | - | - |
| `manage:exports` | Gerer plateformes et configs | X | X | - | - |

---

### Analytics

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:analytics` | Consulter les analytics | X | X | X | - |

---

### Media (Images)

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:media` | Consulter les medias | X | X | X | - |
| `write:media` | Ajouter des medias | X | X | - | - |
| `delete:media` | Supprimer les medias | X | - | - | - |

---

### Cache

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:cache` | Consulter le cache | X | X | X | - |
| `write:cache` | Modifier le cache | X | X | - | - |
| `manage:cache` | Gestion complete du cache | X | - | - | - |

---

### Code2ASIN

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:code2asin` | Consulter les jobs Code2ASIN | X | X | X | - |
| `write:code2asin` | Creer des jobs Code2ASIN | X | X | X | - |
| `delete:code2asin` | Supprimer les jobs Code2ASIN | X | - | - | - |

---

### Templates (Mapping Templates)

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:templates` | Consulter les templates | X | X | X | - |
| `write:templates` | Creer/modifier les templates | X | X | - | - |
| `delete:templates` | Supprimer les templates | X | - | - | - |

---

### System & Monitoring

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:system` | Consulter infos systeme | X | - | - | - |
| `read:monitoring` | Consulter metriques systeme | X | X | X | - |

---

### Files

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:files` | Consulter les fichiers | X | X | - | - |
| `write:files` | Creer des fichiers | X | X | - | - |
| `upload:files` | Telecharger des fichiers | X | X | X | - |

---

### Prices (Prix)

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:prices` | Consulter les prix | X | X | X | - |
| `write:prices` | Modifier les prix | X | X | - | - |
| `delete:prices` | Supprimer les prix | X | - | - | - |

---

### Environmental Data

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:environmental_data` | Consulter donnees environnementales | X | X | X | - |
| `write:environmental_data` | Modifier donnees environnementales | X | X | - | - |

---

### AI Metadata

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:ai_metadata` | Consulter metadonnees IA | X | X | X | - |
| `write:ai_metadata` | Modifier metadonnees IA | X | X | - | - |

---

### Workflows

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:workflows` | Consulter les workflows | X | X | X | - |
| `write:workflows` | Creer/modifier les workflows | X | X | - | - |
| `execute:workflows` | Executer les workflows | X | X | - | - |
| `delete:workflows` | Supprimer les workflows | X | - | - | - |

---

### Tags

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:tags` | Consulter les tags | X | X | X | - |
| `write:tags` | Creer/modifier les tags | X | X | - | - |
| `delete:tags` | Supprimer les tags | X | - | - | - |

---

### Integrations

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:integrations` | Consulter statut integrations | X | X | X | - |
| `manage:integrations` | Gerer les integrations | X | - | - | - |

---

### Enrichment

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:enrichment` | Consulter statut enrichissement | X | X | X | - |
| `manage:enrichment` | Gerer l'enrichissement | X | X | - | - |

---

### Reports

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `read:reports` | Consulter les rapports | X | X | X | - |
| `manage:reports` | Gerer les rapports | X | X | - | - |

---

### Administration

| Permission | Description | ADMIN | MANAGER | USER | GUEST |
|------------|-------------|:-----:|:-------:|:----:|:-----:|
| `admin:access` | Acces panneau admin | X | - | - | - |
| `admin:users` | Gerer les utilisateurs | X | - | - | - |
| `admin:user_create` | Creer des utilisateurs | X | - | - | - |
| `admin:user_update` | Modifier des utilisateurs | X | - | - | - |
| `admin:user_delete` | Supprimer des utilisateurs | X | - | - | - |
| `admin:role_assign` | Assigner des roles | X | - | - | - |
| `admin:permission_assign` | Assigner des permissions | X | - | - | - |
| `admin:settings` | Gerer les parametres | X | - | - | - |
| `admin:amazon_api_global` | Gerer config Amazon API globale | X | - | - | - |

---

## Utilisation des Decorateurs de Permission

### require_permission

Exige une permission specifique pour acceder a un endpoint :

```python
from core.permissions import Permission, require_permission

@router.get("/products")
async def list_products(
    current_user: User = Depends(require_permission(Permission.READ_PRODUCTS))
):
    # L'utilisateur a la permission read:products
    return await get_products()
```

---

### require_any_permission

Exige au moins une des permissions specifiees :

```python
from core.permissions import Permission, require_any_permission

@router.get("/dashboard")
async def get_dashboard(
    current_user: User = Depends(
        require_any_permission(Permission.READ_PRODUCTS, Permission.READ_ANALYTICS)
    )
):
    # L'utilisateur a au moins une des deux permissions
    return await get_dashboard_data()
```

---

### require_all_permissions

Exige toutes les permissions specifiees :

```python
from core.permissions import Permission, require_all_permissions

@router.delete("/critical-operation")
async def critical_operation(
    current_user: User = Depends(
        require_all_permissions(Permission.DELETE_PRODUCTS, Permission.ADMIN_ACCESS)
    )
):
    # L'utilisateur a les DEUX permissions requises
    return await perform_critical_operation()
```

---

### require_role

Exige un role specifique :

```python
from core.permissions import Role, require_role

@router.get("/admin/settings")
async def admin_settings(
    current_user: User = Depends(require_role(Role.ADMIN))
):
    # Seuls les ADMIN peuvent acceder
    return await get_settings()
```

---

## Gestion des Erreurs 403

Quand un utilisateur n'a pas les permissions requises, l'API retourne une erreur **403 Forbidden** :

### Reponse d'Erreur

```json
{
  "detail": "Insufficient permissions. Required: read:products"
}
```

### Erreur pour Permissions Multiples

```json
{
  "detail": "Insufficient permissions. Required one of: read:products, read:analytics"
}
```

```json
{
  "detail": "Insufficient permissions. Required all of: delete:products, admin:access"
}
```

### Erreur de Role

```json
{
  "detail": "Insufficient role. Required: admin, you have: user"
}
```

---

## Permissions Personnalisees (JSON)

Les utilisateurs peuvent avoir des permissions granulaires stockees dans un champ JSON, qui prennent priorite sur les permissions basees sur le role :

```json
{
  "read:products": true,
  "write:suppliers": true,
  "delete:products": false,
  "manage:imports": true
}
```

{% callout type="warning" %}
Si des permissions JSON sont definies pour un utilisateur, elles **remplacent** completement les permissions du role. Assurez-vous de configurer toutes les permissions necessaires.
{% /callout %}

---

## Priorite de Resolution

L'ordre de priorite pour determiner les permissions d'un utilisateur :

1. **Superuser** : A toutes les permissions (bypass complet)
2. **Permissions JSON** : Si definies, utilisees exclusivement
3. **Role** : Fallback vers les permissions du role assigne

```python
def get_user_permissions(user: User) -> list[Permission]:
    # 1. Superuser = toutes les permissions
    if user.is_superuser:
        return list(Permission)

    # 2. Permissions JSON si definies
    if user.permissions:
        return parse_json_permissions(user.permissions)

    # 3. Permissions basees sur le role
    return ROLE_PERMISSIONS.get(user.role, [])
```

---

## Bonnes Pratiques

1. **Principe du moindre privilege** : Attribuez uniquement les permissions necessaires
2. **Utilisez les roles** : Preferez les roles aux permissions individuelles pour la maintenabilite
3. **Auditez regulierement** : Verifiez periodiquement les permissions des utilisateurs
4. **Superusers limites** : Restreignez le nombre de superusers au strict minimum

---

## Ressources Associees

- [Authentification API](/docs/api/authentication)
- [Endpoints API](/docs/api/endpoints)
- [Securite](/docs/technical/security)
