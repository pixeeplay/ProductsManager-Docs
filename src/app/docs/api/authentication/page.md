---
title: Authentification API
nextjs:
  metadata:
    title: Authentification API - Products Manager APP
    description: Guide complet d'authentification JWT pour l'API Products Manager.
---

L'API Products Manager utilise JWT (JSON Web Tokens) pour une authentification securisee et stateless. {% .lead %}

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

## Documentation Complementaire

Pour plus de details, consultez :

- [API Endpoints](/docs/api/endpoints) : Liste complete des endpoints
- [Rate Limiting](/docs/api/rate-limiting) : Limites par tier
- [Security](/docs/technical/security) : Architecture securite complete
