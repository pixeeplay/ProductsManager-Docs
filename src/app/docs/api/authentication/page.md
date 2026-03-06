---
title: Authentification API
nextjs:
  metadata:
    title: Authentification API - Products Manager APP
    description: Guide complet d'authentification JWT pour l'API Products Manager.
---

L'API Products Manager supporte deux modes d'authentification : JWT Bearer Token pour les utilisateurs humains, et X-API-Key pour les integrations machine-to-machine (WinDev, ERP, scripts). {% .lead %}

---

## Vue d'Ensemble

Le systeme d'authentification offre :

- Authentification stateless avec JWT (HS256)
- Access tokens avec expiration configurable (2h par defaut)
- Refresh tokens pour renouvellement automatique
- Roles et permissions granulaires (RBAC avec 4 roles et 29 permissions)
- Verrouillage de compte apres tentatives echouees (depuis v4.5.51)
- Rate limiting specifique sur les endpoints d'authentification (5/min)

---

## Obtenir un Token

### Requete

```bash
POST https://api.productsmanager.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Reponse

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

### Structure du Token JWT

Le payload du token contient :

```json
{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "id": "user-uuid-here",
  "username": "john.doe",
  "is_superuser": false,
  "role": "manager",
  "exp": 1696435200,
  "iat": 1696428000
}
```

---

## Utiliser le Token

Incluez le `access_token` dans l'header `Authorization` de chaque requete :

```bash
GET https://api.productsmanager.app/api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rafraichir le Token

Quand le `access_token` expire (apres 2 heures), utilisez le `refresh_token` pour en obtenir un nouveau :

### Requete

```bash
POST https://api.productsmanager.app/api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Reponse

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

---

## Verrouillage de Compte

Depuis v4.5.51, le systeme implemente un verrouillage automatique :

| Tentatives echouees | Action |
|---------------------|--------|
| 5 | Verrouillage 15 minutes |
| 10 | Verrouillage 1 heure |
| 20 | Verrouillage permanent (admin requis) |

---

## Roles et Permissions

Products Manager APP utilise un systeme RBAC (Role-Based Access Control) avec 4 roles et 29 permissions granulaires :

| Role | Description | Permissions |
|------|-------------|-------------|
| **admin** | Administrateur | Toutes permissions + gestion utilisateurs + config systeme |
| **manager** | Gestionnaire | read, create, update, delete sur produits/imports/fournisseurs + analytics |
| **user** | Utilisateur standard | read sur produits/imports + own data read/write |
| **api_client** | Acces programmatique | API endpoints specifiques, scopes limites, rate limiting strict |

### Permissions par Domaine

| Domaine | Permissions | Nombre |
|---------|-------------|--------|
| Products | read, write, delete, import, export, bulk | 6 |
| Suppliers | read, write, delete, config | 4 |
| Imports | read, write, delete, start, cancel, schedule | 6 |
| Admin | access, users, settings, logs, metrics | 5 |
| Analytics | read, export, advanced | 3 |
| Cache | read, manage, invalidate | 3 |
| Monitoring | read, system | 2 |

### Verification des Permissions

```python
from api.core.permissions import require_permission, Permission

@router.get("/products")
@require_permission(Permission.READ_PRODUCTS)
async def list_products(request: Request):
    ...
```

Les permissions sont verifiees a 3 niveaux :
1. **Role de base** : Permissions heritees du role
2. **Permissions JSON** : Surcharges par utilisateur (champ `permissions` JSONB)
3. **Modules actifs** : Endpoints des modules desactives retournent 404

---

## Securite JWT

### Configuration

- **Algorithme** : HS256 (HMAC-SHA256)
- **SECRET_KEY** : Minimum 32 caracteres
- **Expiration access token** : 2 heures (configurable)
- **Expiration refresh token** : 7 jours
- **Verification** : Signature + expiration + user actif

### Bonnes Pratiques Implementees

- SECRET_KEY minimum 32 caracteres
- Tokens signes (verification d'integrite)
- Expiration obligatoire
- Verification user actif a chaque requete
- Pas de donnees sensibles dans payload
- Rate limiting sur endpoints d'authentification (5/min)

---

## Authentification par Cle API (X-API-Key)

Depuis v4.5.61, les integrations machine-to-machine utilisent des **cles API** a la place du JWT. Ce mode est destine aux applications externes (WinDev, ERP, scripts automatises) qui ne peuvent pas gerer un flux OAuth/refresh token.

### Utilisation

```bash
GET https://api.productsmanager.app/api/v1/windev/products
X-API-Key: pm_live_a1b2c3d4e5f6...
```

### Format des Cles

| Prefixe | Environnement |
|---------|--------------|
| `pm_live_` | Production |
| `pm_test_` | Test / staging |

- 64 caracteres aleatoires apres le prefixe
- Valeur brute retournee **une seule fois** a la creation (stockage du hash SHA-256 uniquement)
- Rotation possible via `POST /api/v1/api-keys/{id}/rotate`

### Scopes

Chaque cle embarque un ou plusieurs scopes qui definissent les permissions :

| Scope | Acces |
|-------|-------|
| `ext:products:read` | Lecture via External API (`/api/v1/ext`) |
| `ext:products:write` | Ecriture via External API |
| `windev:read` | Lecture WinDev (produits, categories, fournisseurs) |
| `windev:write` | Ecriture WinDev (stock, prix, PATCH/activate/deactivate) |
| `windev:sync` | Sync batch WinDev (`/products/sync`) |

### Gestion des Cles

```bash
# Creer une cle
POST https://api.productsmanager.app/api/v1/api-keys
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "WinDev Production",
  "scopes": ["windev:read", "windev:write", "windev:sync"],
  "rate_limit_per_minute": 300,
  "expires_at": null
}
```

Reponse (valeur brute disponible une seule fois) :

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "WinDev Production",
  "key": "pm_live_a1b2c3d4e5f6g7h8...",
  "scopes": ["windev:read", "windev:write", "windev:sync"],
  "rate_limit_per_minute": 300,
  "expires_at": null,
  "created_at": "2026-03-06T10:00:00Z"
}
```

{% callout type="warning" title="Conservez la cle" %}
La valeur brute `pm_live_...` n'est retournee qu'a la creation. Sauvegardez-la immediatement — il sera impossible de la recuperer ensuite. En cas de perte, utilisez la rotation.
{% /callout %}

### Rate Limiting par Cle

Chaque cle peut avoir sa propre limite de requetes par minute (champ `rate_limit_per_minute`) :

- La limite est trackee dans Redis : bucket par minute par cle
- Si la limite est depassee : `429 Too Many Requests` avec headers :
  ```
  X-RateLimit-Limit: 300
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1741302000
  Retry-After: 60
  ```
- Toutes les reponses 2xx incluent les headers `X-RateLimit-*` avec les valeurs courantes
- Si Redis est indisponible : la requete passe (fail open)

Voir [Rate Limiting par Cle API](/docs/api/rate-limiting#rate-limiting-par-cle-api) pour plus de details.

### Rotation de Cle

```bash
POST https://api.productsmanager.app/api/v1/api-keys/{id}/rotate
Authorization: Bearer YOUR_JWT_TOKEN
```

L'ancienne cle est immediatement invalidee. Une nouvelle valeur brute est retournee.

---

## Documentation Complementaire

Pour plus de details, consultez :

- [API Endpoints](/docs/api/endpoints) : Liste complete des endpoints
- [Rate Limiting](/docs/api/rate-limiting) : Limites par tier
- [Security](/docs/technical/security) : Architecture securite complete
