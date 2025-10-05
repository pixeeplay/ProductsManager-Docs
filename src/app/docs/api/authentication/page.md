---
title: Authentification API
nextjs:
  metadata:
    title: Authentification API - Products Manager APP
    description: Guide complet d'authentification JWT pour l'API Products Manager.
---

L'API Products Manager utilise **JWT (JSON Web Tokens)** pour une authentification sécurisée et stateless. {% .lead %}

---

## Vue d'Ensemble

Le système d'authentification offre :

- 🔐 **Authentification stateless** avec JWT
- ⏰ **Tokens avec expiration** configurable (2h par défaut)
- 🔄 **Refresh tokens** pour renouvellement automatique
- 👥 **Rôles et permissions** granulaires (RBAC)

---

## Flux d'Authentification

```
1. Client envoie email + password
   ↓
2. API valide et retourne access_token + refresh_token
   ↓
3. Client utilise access_token pour les requêtes
   ↓
4. Quand le token expire, utiliser refresh_token
   ↓
5. API retourne un nouveau access_token
```

---

## 🔑 Obtenir un Token

### Requête

```bash
POST https://api.productsmanager.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

###Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

{% callout type="note" title="Stockage sécurisé" %}
Stockez les tokens de manière sécurisée (localStorage, sessionStorage, ou httpOnly cookies). Ne les exposez jamais dans le code source ou les logs.
{% /callout %}

---

## 🎫 Utiliser le Token

Incluez le `access_token` dans l'header `Authorization` de chaque requête :

```bash
GET https://api.productsmanager.app/api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemple avec cURL

```bash
curl -X GET https://api.productsmanager.app/api/v1/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Exemple avec JavaScript (fetch)

```javascript
const response = await fetch('https://api.productsmanager.app/api/v1/products', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
```

### Exemple avec Python (requests)

```python
import requests

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.productsmanager.app/api/v1/products',
    headers=headers
)

data = response.json()
```

---

## 🔄 Rafraîchir le Token

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

{% callout type="warning" title="Expiration du refresh token" %}
Le refresh token expire après 30 jours d'inactivité. L'utilisateur devra se reconnecter après cette période.
{% /callout %}

---

## 👥 Rôles et Permissions

Products Manager APP utilise un système **RBAC** (Role-Based Access Control) avec 4 rôles :

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `viewer` | Lecture seule | `read` |
| `user` | Utilisateur standard | `read`, `create` (ressources propres) |
| `manager` | Gestionnaire | `read`, `create`, `update`, `delete` |
| `admin` | Administrateur | Toutes permissions + gestion utilisateurs |

### Vérifier les Permissions

Le payload JWT contient le rôle et les permissions :

```json
{
  "sub": "user@example.com",
  "user_id": 123,
  "role": "manager",
  "permissions": ["read", "write", "delete"],
  "iat": 1695384000,
  "exp": 1695391200
}
```

### Endpoints Protégés

Chaque endpoint requiert des permissions spécifiques :

- `GET /products` → `read`
- `POST /products` → `create`
- `PUT /products/{id}` → `update`
- `DELETE /products/{id}` → `delete`
- `POST /users` → `admin`

---

## 🔒 Bonnes Pratiques

### Sécurité

✅ **À FAIRE** :
- Stocker les tokens en mémoire ou httpOnly cookies
- Utiliser HTTPS pour toutes les requêtes
- Implémenter un refresh automatique du token
- Gérer la déconnexion (blacklist des tokens)

❌ **À ÉVITER** :
- Stocker les tokens dans localStorage si risque XSS
- Exposer les tokens dans les URLs
- Partager les tokens entre utilisateurs
- Logger les tokens en production

### Gestion des Erreurs

```javascript
try {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  })

  if (response.status === 401) {
    // Token expiré → rafraîchir ou rediriger vers login
    await refreshToken()
  }

  if (response.status === 403) {
    // Permissions insuffisantes
    console.error('Access denied')
  }
} catch (error) {
  console.error('Request failed', error)
}
```

---

## 📋 Codes d'Erreur

| Code | Description | Action |
|------|-------------|---------|
| `401 Unauthorized` | Token invalide ou expiré | Rafraîchir ou reconnecter |
| `403 Forbidden` | Permissions insuffisantes | Vérifier le rôle utilisateur |
| `422 Unprocessable Entity` | Credentials invalides | Vérifier email/password |

---

## Prochaines Étapes

{% quick-links %}

{% quick-link title="API Endpoints" icon="plugins" href="/docs/api/endpoints" description="Explorez tous les endpoints disponibles." /%}

{% quick-link title="Webhooks" icon="theming" href="/docs/api/webhooks" description="Configurez des webhooks pour les événements." /%}

{% quick-link title="Rate Limiting" icon="installation" href="/docs/technical/security" description="Limites de requêtes et quotas." /%}

{% /quick-links %}
