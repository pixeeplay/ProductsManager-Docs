---
title: Rate Limiting
nextjs:
  metadata:
    title: Rate Limiting - Products Manager API
    description: "Guide complet du rate limiting de l'API Products Manager : tiers, headers, gestion des erreurs."
---

L'API Products Manager implemente un rate limiting granulaire pour proteger contre les abus et garantir une utilisation equitable pour tous les utilisateurs. {% .lead %}

---

## Vue d'ensemble

Le rate limiting controle le nombre de requetes API autorisees dans une fenetre de temps donnee. Cela protege l'API contre les abus, garantit une allocation equitable des ressources, et maintient la stabilite du systeme.

Caracteristiques principales :

- **Limites par tiers** : Differents endpoints ont differentes limites selon l'intensite des ressources
- **Suivi par utilisateur** : Les limites sont trackees par utilisateur authentifie
- **Headers clairs** : Chaque reponse inclut les informations de rate limit
- **Gestion gracieuse** : Les reponses 429 incluent le temps de retry
- **Ajustement par environnement** : Limites adaptees (dev, staging, production)
- **Logging des violations** : Enregistrement dans `rate_limit_violations` (db_analytics)

---

## Tiers de Rate Limiting

L'API organise les rate limits en quatre tiers selon le niveau de risque et l'intensite des ressources :

### Tier Critical

Operations necessitant les limites les plus restrictives pour raisons de securite ou cout eleve.

| Tier | Limite | Description |
|------|--------|-------------|
| AUTH_LOGIN | 5/minute | Tentatives de connexion (protection brute force) |
| AUTH_PASSWORD_RESET | 5/minute | Demandes de reset mot de passe |
| AUTH_REGISTER | 5/minute | Creation de compte |
| AUTH_REFRESH | 30/minute | Rafraichissement de token |
| AUTH_LOGOUT | 30/minute | Operations de deconnexion |
| BULK_IMPORT | 500/minute | Imports de donnees en masse |
| BULK_EXPORT | 500/minute | Exports de donnees en masse |
| BULK_CREATE | 500/minute | Creation d'entites en masse |
| BULK_UPDATE | 500/minute | Mise a jour d'entites en masse |
| BULK_DELETE | 500/minute | Suppression d'entites en masse |
| AI_BATCH | 1/heure | Enrichissement IA batch (controle de cout) |
| AI_SINGLE | 20/minute | Enrichissement IA produit unique |

### Tier High

Operations d'ecriture et fonctions d'export.

| Tier | Limite | Description |
|------|--------|-------------|
| WRITE_STANDARD | 100/minute | Operations POST/PUT/DELETE standard |
| WRITE_UPLOAD | 100/minute | Upload de fichiers |
| WRITE_USER_MGMT | 100/minute | Gestion utilisateurs et roles |
| WRITE_CONFIG | 100/minute | Changements de configuration |
| EXPORT_STANDARD | 50/minute | Exports CSV/Excel/JSON |
| EXPORT_STREAM | 50/minute | Exports en streaming |
| EXPORT_DOWNLOAD | 50/minute | Telechargement de fichiers |
| EXPORT_SCHEDULE | 50/minute | Operations d'export planifiees |

### Tier Medium

Operations de lecture standard avec limites moderees.

| Tier | Limite | Description |
|------|--------|-------------|
| READ_SENSITIVE | 50/minute | Donnees utilisateur, logs d'audit |
| READ_STANDARD | 1000/minute | Operations GET standard |
| READ_ADMIN | 1000/minute | Lectures panel admin |

### Tier Low

Endpoints publics et health checks avec limites permissives.

| Tier | Limite | Description |
|------|--------|-------------|
| READ_PUBLIC | 1000/minute | Donnees publiques (categories, etc.) |
| HEALTH_CHECK | 1000/minute | Endpoints health et status |
| PROGRESS_POLL | 1000/minute | Polling de progression (haute frequence) |

---

## Resume par Categorie d'Endpoint

| Categorie | Limite | Exemples |
|-----------|--------|----------|
| Lecture | 1000/minute | Listes produits, recherche, details |
| Ecriture | 100/minute | Creation, mise a jour, suppression |
| Analytics & Rapports | 50/minute | Metriques dashboard, exports |
| Operations IA | 20/minute | Enrichissement unitaire, categorisation |
| IA Batch | 1/heure | Traitement IA en masse |
| Operations en masse | 500/minute | Imports/exports catalogue |
| Authentification | 5/minute | Login, register, password reset |

---

## Implementation

Le rate limiting utilise SlowAPI avec Redis comme backend :

```python
from slowapi import Limiter
from api.core.rate_limits import get_rate_limit, RateLimitTier

limiter = Limiter(key_func=get_remote_address, storage_uri=REDIS_URL)

@router.post("/auth/login")
@limiter.limit(get_rate_limit(RateLimitTier.AUTH_LOGIN))
async def login(request: Request, credentials: LoginRequest):
    ...

@router.get("/products")
@require_permission(Permission.READ_PRODUCTS)
@limiter.limit(get_rate_limit(RateLimitTier.READ_STANDARD))
async def list_products(request: Request):
    ...
```

---

## Headers de Reponse

Toutes les reponses API incluent les informations de rate limit dans les headers suivants :

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Nombre maximum de requetes autorisees dans la fenetre de temps |
| `X-RateLimit-Remaining` | Nombre de requetes restantes dans la fenetre |
| `X-RateLimit-Reset` | Timestamp Unix (secondes) quand la fenetre se reinitialise |
| `Retry-After` | Secondes a attendre avant de retenter (present uniquement sur 429) |

### Exemple de Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 998
X-RateLimit-Reset: 1704067260
Content-Type: application/json
```

---

## Gestion des Erreurs (429 Too Many Requests)

Quand vous depassez la limite, l'API retourne une reponse `429 Too Many Requests` :

### Corps de la Reponse

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": "Please wait before making more requests",
  "detail": "1 per 1 minute"
}
```

### Headers de Reponse

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067305
Content-Type: application/json
```

Les violations de rate limit sont automatiquement enregistrees dans la table `rate_limit_violations` de db_analytics.

---

## Ajustements par Environnement

Les limites varient par environnement :

### Environnement Developpement

Limites plus permissives pour faciliter les tests :

| Tier | Limite Dev | Limite Prod |
|------|-----------|-------------|
| AUTH_LOGIN | 20/minute | 5/minute |
| BULK_IMPORT | 1000/minute | 500/minute |
| BULK_DELETE | 1000/minute | 500/minute |
| AI_BATCH | 5/heure | 1/heure |
| AI_SINGLE | 50/minute | 20/minute |
| READ_STANDARD | 2000/minute | 1000/minute |
| WRITE_STANDARD | 200/minute | 100/minute |

### Environnement Test

Tres permissif pour les suites de tests automatisees :

| Tier | Limite Test | Limite Prod |
|------|------------|-------------|
| AUTH_LOGIN | 100/minute | 5/minute |
| BULK_IMPORT | 1000/minute | 500/minute |
| AI_BATCH | 20/heure | 1/heure |
| AI_SINGLE | 100/minute | 20/minute |
| READ_STANDARD | 5000/minute | 1000/minute |
| WRITE_STANDARD | 500/minute | 100/minute |
| EXPORT_STANDARD | 100/minute | 50/minute |

### Environnement Staging

Memes limites que la production pour des tests realistes.

### Environnement Production

Les limites documentees ci-dessus representent les valeurs de production.

---

## Exemples de Code

### Python (requests)

```python
import requests
import time

def make_api_request(url, headers, max_retries=3):
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)

        remaining = response.headers.get('X-RateLimit-Remaining')
        limit = response.headers.get('X-RateLimit-Limit')
        print(f"Rate limit: {remaining}/{limit} restantes")

        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 60))
            print(f"Rate limited. Attente {retry_after} secondes...")
            time.sleep(retry_after)
            continue

        return response

    raise Exception("Max retries depasse")

headers = {"Authorization": "Bearer your-token-here"}
response = make_api_request(
    "https://api.productsmanager.app/api/v1/products",
    headers
)
```

### JavaScript (fetch)

```javascript
async function makeApiRequest(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': 'Bearer your-token-here',
        ...options.headers,
      },
    });

    const remaining = response.headers.get('X-RateLimit-Remaining');
    const limit = response.headers.get('X-RateLimit-Limit');
    console.log(`Rate limit: ${remaining}/${limit} restantes`);

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      console.log(`Rate limited. Attente ${retryAfter} secondes...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    return response;
  }

  throw new Error('Max retries depasse');
}

const response = await makeApiRequest(
  'https://api.productsmanager.app/api/v1/products'
);
const data = await response.json();
```

---

## Bonnes Pratiques

1. **Surveillez les headers** : Verifiez toujours `X-RateLimit-Remaining` pour eviter de toucher les limites
2. **Implementez le backoff** : Utilisez le backoff exponentiel quand rate limited
3. **Utilisez le batch** : Privilegiez les endpoints bulk plutot que des requetes individuelles multiples
4. **Cachez les reponses** : Reduisez les appels API en cachant les donnees frequemment accedees
5. **Utilisez les webhooks** : Pour les mises a jour evenementielles plutot que le polling
6. **Planifiez les limites** : Concevez votre integration en tenant compte des limites

---

## Demander des Limites Plus Elevees

Pour les applications necessitant des limites plus elevees ou des quotas personnalises, contactez le support avec :

- Description de votre cas d'usage
- Volumes de requetes attendus
- Endpoints specifiques concernes

---

## Documentation Associee

- [Authentification](/docs/api/authentication)
- [API Endpoints](/docs/api/endpoints)
- [Webhooks](/docs/api/webhooks)
- [Securite](/docs/technical/security)
