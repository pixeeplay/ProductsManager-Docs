---
title: Authentification API
nextjs:
  metadata:
    title: Authentification API - Products Manager APP
    description: Guide complet d'authentification JWT pour l'API Products Manager.
---

L'API Products Manager utilise JWT (JSON Web Tokens) pour une authentification sécurisée et stateless.

---

## Vue d'Ensemble

Le système d'authentification offre :

- Authentification stateless avec JWT
- Tokens avec expiration configurable (2h par défaut)
- Refresh tokens pour renouvellement automatique
- Rôles et permissions granulaires (RBAC)

---

## Obtenir un Token

### Requête

```bash
POST https://api.productsmanager.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Réponse

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

---

## Utiliser le Token

Incluez le `access_token` dans l'header `Authorization` de chaque requête :

```bash
GET https://api.productsmanager.app/api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rafraîchir le Token

Quand le `access_token` expire (après 2 heures), utilisez le `refresh_token` pour en obtenir un nouveau :

### Requête

```bash
POST https://api.productsmanager.app/api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Réponse

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

---

## Rôles et Permissions

Products Manager APP utilise un système RBAC (Role-Based Access Control) avec 4 rôles :

| Rôle | Description | Permissions |
|------|-------------|-------------|
| viewer | Lecture seule | read |
| user | Utilisateur standard | read, create (ressources propres) |
| manager | Gestionnaire | read, create, update, delete |
| admin | Administrateur | Toutes permissions + gestion utilisateurs |

---

## Documentation Complète

Pour plus de détails, consultez :

- [API Endpoints](/docs/api/endpoints)
- [Webhooks](/docs/api/webhooks)
- [Security](/docs/technical/security)
