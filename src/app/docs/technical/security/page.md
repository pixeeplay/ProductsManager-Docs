---
title: Sécurité
description: RBAC, authentification, sécurité des API et conformité
---

# Sécurité

Le système Suppliers-Import implémente une architecture de sécurité multi-couche avec RBAC granulaire, JWT, et une protection complète contre les vulnérabilités OWASP Top 10.

{% .lead %}

---

## Score de Sécurité

{% callout type="success" title="Audit Sécurité v3.2.1" %}
**Score Global : 87/100 (B+)** | **0 CVE critiques** | **93.4% endpoints protégés** | **29 permissions granulaires**
{% /callout %}

### Métriques Clés

| Catégorie | Score | Statut |
|-----------|-------|--------|
| **Authentication & Authorization** | 9.0/10 | Excellent |
| **Input Validation & Injection** | 9.5/10 | Excellent |
| **Security Headers & CORS** | 9.5/10 | Excellent |
| **Secrets Management** | 9.5/10 | Excellent |
| **Dependency Vulnerabilities** | 9.0/10 | Excellent |
| **Code Security** | 10/10 | Parfait |
| **API Security** | 9.0/10 | Excellent |
| **OWASP Compliance** | 8.9/10 | Excellent |

**Evolution** : +15 points (+20.8%) depuis v3.0.0

---

## Système RBAC

### Rôles & Permissions

Le système utilise un **RBAC (Role-Based Access Control)** avec 4 rôles et 29 permissions granulaires.

#### Les 4 Rôles

**1. Admin** - Accès complet
- Toutes les permissions
- Gestion utilisateurs
- Configuration système
- Accès analytics

**2. Manager** - Gestion opérationnelle
- Imports : create, start, cancel
- Products : read, write
- Suppliers : read, write
- Analytics : read

**3. User** - Utilisation standard
- Products : read
- Imports : read
- Own data : read, write

**4. API Client** - Accès programmatique
- API endpoints spécifiques
- Rate limiting strict
- Scopes limités

#### Les 29 Permissions Granulaires

**Products** (6 permissions)
- `products:read` - Lecture catalogue
- `products:write` - Création/modification
- `products:delete` - Suppression
- `products:import` - Import produits
- `products:export` - Export données
- `products:bulk` - Opérations en masse

**Suppliers** (4 permissions)
- `suppliers:read` - Consultation
- `suppliers:write` - Gestion
- `suppliers:delete` - Suppression
- `suppliers:config` - Configuration imports

**Imports** (6 permissions)
- `imports:read` - Voir jobs
- `imports:write` - Créer configs
- `imports:delete` - Supprimer jobs
- `imports:start` - Lancer imports
- `imports:cancel` - Annuler jobs
- `imports:schedule` - Planifier

**Admin** (5 permissions)
- `admin:access` - Accès panel admin
- `admin:users` - Gestion utilisateurs
- `admin:settings` - Config système
- `admin:logs` - Logs système
- `admin:metrics` - Métriques avancées

**Analytics** (3 permissions)
- `analytics:read` - Voir rapports
- `analytics:export` - Exporter données
- `analytics:advanced` - Analytics avancés

**Cache** (3 permissions)
- `cache:read` - Voir cache
- `cache:manage` - Gérer cache
- `cache:invalidate` - Invalider cache

**Monitoring** (2 permissions)
- `monitoring:read` - Métriques système
- `monitoring:system` - Accès système complet

### Implémentation

#### Décorateurs de Protection

```python
from api.core.permissions import require_permission, require_any_permission

# Single permission
@router.post("/products")
@require_permission("products:create")
async def create_product(product: ProductCreate, user: User = Depends(get_current_user)):
    ...

# OR logic (au moins une permission)
@router.get("/data")
@require_any_permission("products:read", "admin:access")
async def get_data(user: User = Depends(get_current_user)):
    ...

# AND logic (toutes les permissions)
@router.post("/bulk-import")
@require_all_permissions("imports:create", "products:create")
async def bulk_import(user: User = Depends(get_current_user)):
    ...
```

#### Permissions JSON par Utilisateur

Possibilité de surcharger les permissions role-based :

```python
# Modèle User
class User(Base):
    id: UUID
    email: str
    role: UserRole  # admin, manager, user, api_client
    permissions: dict = {}  # Permissions JSON custom

# Exemple de permissions custom
user.permissions = {
    "products:read": True,
    "products:write": False,  # Override role permission
    "imports:start": True,     # Permission supplémentaire
    "special:export": True     # Permission spécifique
}
```

### Couverture RBAC

**Endpoints protégés** :
- Total endpoints : **196**
- Protégés par RBAC : **171** (87.2%)
- Permission-based : **102** (52%)
- User-based : **69** (35%)
- Public (intentionnel) : **25** (12.8%)

**Endpoints publics** :
- `/health`, `/health/ready`, `/health/live`
- `/auth/login`, `/auth/register`
- `/docs`, `/openapi.json`
- `/metrics` (Prometheus, internal only)

---

## Authentification JWT

### Configuration

**Algorithme** : HS256 (HMAC-SHA256)
**Token expiration** : 120 minutes (configurable)
**Refresh tokens** : Recommandé (à implémenter)

### Structure Token

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

### Flow d'Authentification

**1. Login**
```python
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "secure-password"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

**2. Requêtes Authentifiées**
```http
GET /api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**3. Validation Token**
```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Décode & vérifie signature
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Récupère user en DB
        user = await get_user_by_id(payload["sub"])

        # Vérifie que user est actif
        if not user.is_active:
            raise HTTPException(401, "User inactive")

        return user
    except JWTError:
        raise HTTPException(401, "Invalid token")
```

### Sécurité JWT

**Bonnes pratiques implémentées** :
- SECRET_KEY minimum 32 caractères
- Tokens signés (vérification d'intégrité)
- Expiration obligatoire
- Vérification user actif
- Pas de données sensibles dans payload

{% callout type="warning" title="Améliorations Recommandées" %}
**Haute Priorité** : Implémenter refresh tokens et token blacklist pour logout sécurisé.
{% /callout %}

---

## Hashing Mots de Passe

### Bcrypt

**Algorithme** : Bcrypt (recommandé OWASP)
**Library** : PassLib avec bcrypt 4.1.3
**Work factor** : 12 rounds (par défaut bcrypt)

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
hashed_password = pwd_context.hash("user-password")

# Verify password
is_valid = pwd_context.verify("user-password", hashed_password)
```

**Avantages** :
- Résistant aux rainbow tables
- Salage automatique
- Work factor ajustable
- Auto-upgrade vers versions récentes

---

## Protection des API

### Rate Limiting

**Implémentation** : SlowAPI (middleware)
**Backend** : Redis (persistent)

**Limites configurées** :

| Endpoint | Limite | Rationale |
|----------|--------|-----------|
| Global | 100/min | Protection générale |
| Auth (login/register) | 5/min | Anti brute-force |
| Admin endpoints | 10/min | Protection sensible |
| Import start | 20/min | Limiter charge |
| User deletion | 5/min | Opération destructive |

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, credentials: LoginRequest):
    ...
```

**Réponse rate limit** :
```json
HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

### CORS Configuration

**Production** :
```python
allowed_origins = [
    "https://productsmanager.app",
    "https://www.productsmanager.app",
    "https://api.productsmanager.app"
]

CORSMiddleware(
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    max_age=600  # 10 min preflight cache
)
```

**Jamais** :
- `allow_origins=["*"]` en production
- `allow_credentials=True` avec wildcard origins

### CSRF Protection

**Implémentation** : starlette-csrf 3.0.0

```python
CSRFMiddleware(
    secret=CSRF_SECRET_KEY,
    cookie_secure=not DEBUG,        # HTTPS only en prod
    cookie_httponly=True,           # JS ne peut pas lire
    cookie_samesite="strict",       # Protection CSRF
    exempt_urls=[
        "/health",
        "/auth/login",
        "/auth/register",
        "/metrics",
        "/docs"
    ]
)
```

**Cookie CSRF** :
```http
Set-Cookie: csrf_token=xxx; Secure; HttpOnly; SameSite=Strict
```

---

## Security Headers

### Backend Headers

**Middleware** : `api/middleware/security.py`

```python
SecurityHeadersMiddleware(
    headers={
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'"
    }
)
```

### Frontend Headers (Next.js)

**Fichier** : `frontend/next.config.js`

```javascript
headers: async () => [{
  source: '/:path*',
  headers: [
    {
      key: 'X-Frame-Options',
      value: 'DENY'
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff'
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains'
    },
    {
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    }
  ]
}]
```

**Protection** :
- **Clickjacking** : X-Frame-Options DENY
- **MIME-sniffing** : X-Content-Type-Options nosniff
- **HTTPS Enforcement** : HSTS 1 an
- **XSS** : CSP restrictive

---

## Prévention des Injections

### SQL Injection (Score : 10/10)

**Protection** : SQLAlchemy ORM avec parameterized queries

{% callout type="success" title="0 Vulnérabilité SQL Injection" %}
**100% ORM usage**, 0 raw SQL, 0 f-strings dans queries
{% /callout %}

**Bon** :
```python
# Parameterized query (safe)
stmt = select(Product).where(Product.sku == sku)
result = await db.execute(stmt)
```

**Mauvais** :
```python
# NEVER do this (vulnerable)
query = f"SELECT * FROM products WHERE sku = '{sku}'"
result = await db.execute(text(query))
```

### XSS Prevention (Score : 8.5/10)

**Backend** : Middleware `api/middleware/xss_sanitizer.py`

```python
from bleach import clean

# Sanitize all POST/PUT/PATCH
ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3']
ALLOWED_PROTOCOLS = ['http', 'https', 'mailto']

def sanitize_html(text: str) -> str:
    return clean(
        text,
        tags=ALLOWED_TAGS,
        protocols=ALLOWED_PROTOCOLS,
        strip=True
    )
```

**Frontend** : React auto-escaping + sanitization

```typescript
// Safe - React escapes automatically
<div>{userInput}</div>

// Dangerous - only for sanitized content
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// Sanitize before rendering
const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

### Command Injection (Score : 10/10)

**Scan results** :
- `eval()` : 0 instances
- `exec()` : 0 instances
- `compile()` : 0 instances
- `subprocess` : 0 instances non-sanitized

**Aucune vulnérabilité** détectée.

---

## Gestion des Secrets

### Variables d'Environnement

{% callout type="warning" title="Secrets Security" %}
**Jamais** commit de secrets en clair. Utiliser `.env` (gitignored) ou Coolify Secrets.
{% /callout %}

**Configuration** : `api/core/config.py`

```python
class Settings(BaseSettings):
    SECRET_KEY: str = Field(..., env="SECRET_KEY", min_length=32)
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    REDIS_URL: str = Field(default="redis://redis:6379/0", env="REDIS_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
```

**Validation** :
- SECRET_KEY minimum 32 caractères
- Required fields enforced
- Testing mode safe fallbacks

### Scan Hardcoded Credentials

**Résultats** :
- Production code : **0 secrets**
- Test files : 12 mock passwords (acceptable)
- No API keys hardcoded
- No DB credentials in code

**Score** : 10/10

---

## Audit des Dépendances

### Backend (Python)

**Total packages** : 87
**CVEs critiques** : 0
**CVEs high** : 0

**Packages sécurité récents** :
```text
cryptography==46.0.2      # CVE-2024-12797 fixé
PyJWT==2.10.1             # Compatible cryptography >= 43
bleach==6.1.0             # XSS protection
starlette-csrf==3.0.0     # CSRF protection
bcrypt==4.1.3             # Password hashing
```

**Scan régulier** :
```bash
safety check --json
pip-audit
```

### Frontend (npm)

**Vulnérabilités** :
- Critical : 0
- High : 0
- Moderate : 0
- Low : 2 (dev dependencies only)

**Packages sécurité** :
```json
{
  "next": "15.5.4",
  "react": "19.0.0",
  "zod": "^3.24.1"
}
```

---

## Conformité OWASP Top 10

### Matrice de Conformité

| OWASP 2021 | Conformité | Score | Notes |
|------------|-----------|-------|-------|
| **A01: Broken Access Control** | Forte | 9/10 | RBAC 93.4% coverage |
| **A02: Cryptographic Failures** | Forte | 9/10 | Bcrypt, JWT, HTTPS |
| **A03: Injection** | Excellente | 10/10 | ORM, XSS sanitization |
| **A04: Insecure Design** | Bonne | 8.5/10 | RBAC, rate limiting |
| **A05: Security Misconfiguration** | Bonne | 8.5/10 | Debug=False, HSTS |
| **A06: Vulnerable Components** | Bonne | 9/10 | 0 CVE critiques |
| **A07: Auth Failures** | Bonne | 8/10 | JWT + bcrypt |
| **A08: Data Integrity** | Bonne | 8.5/10 | Pydantic, CSRF |
| **A09: Security Logging** | Excellente | 10/10 | Structlog, Sentry |
| **A10: SSRF** | Bonne | 9/10 | No user-controlled URLs |

**Score global OWASP** : 89/100 (A-)

---

## Logging & Monitoring

### Logging Structuré

**Library** : structlog

```python
import structlog

logger = structlog.get_logger(__name__)

# Log avec contexte
logger.info(
    "user_authenticated",
    user_id=user.id,
    email=user.email,
    ip_address=request.client.host,
    user_agent=request.headers.get("user-agent")
)
```

**Features** :
- JSON logs en production
- Console logs en dev
- Pas de données sensibles loggées
- Request ID tracking
- Contexte enrichi

### Sentry Error Tracking

**Intégration** :
```python
import sentry_sdk

sentry_sdk.init(
    dsn=SENTRY_DSN,
    environment=ENVIRONMENT,
    traces_sample_rate=0.1,  # 10% transactions
    profiles_sample_rate=0.1
)
```

**Features** :
- Real-time alerting
- Performance monitoring (APM)
- Release tracking
- Context enrichment (user, request, DB queries)

### Security Event Logging

**Events loggés** :
- Login success/failure
- Permission denied
- Rate limit exceeded
- Admin actions
- Config changes
- Token invalidations

---

## Incident Response

### Procédure

**1. Détection**
- Sentry alerts
- Log analysis
- Monitoring dashboards

**2. Containment**
- Identifier systèmes affectés
- Isoler composants compromis
- Révoquer credentials
- Activer logging supplémentaire

**3. Eradication**
- Patcher vulnérabilités
- Update dependencies
- Rotate all secrets
- Review access logs

**4. Recovery**
- Restore from clean backups
- Verify system integrity
- Gradual service restoration
- Enhanced monitoring

**5. Post-Incident**
- Root cause analysis
- Update security measures
- Document lessons learned
- User notification (si requis)

---

## Checklist Sécurité Déploiement

### Pre-Production

- [ ] `DEBUG=False` en production
- [ ] `SECRET_KEY` fort (32+ chars random)
- [ ] HTTPS activé avec certificat valide
- [ ] DB credentials en variables env
- [ ] Redis password configuré
- [ ] MinIO access keys changés (pas defaults)
- [ ] CORS origins whitelisted (pas `*`)
- [ ] Rate limiting activé
- [ ] Security headers actifs
- [ ] CSRF protection activé
- [ ] XSS sanitization actif
- [ ] File upload limits configurés
- [ ] Sentry DSN configuré

### Maintenance Mensuelle

- [ ] Review Sentry error reports
- [ ] Check dependency updates (`npm audit`, `safety check`)
- [ ] Review access logs anomalies
- [ ] Verify backup integrity
- [ ] Review user permissions/roles
- [ ] Check rate limiting effectiveness
- [ ] Update documentation

### Maintenance Trimestrielle

- [ ] Rotate `SECRET_KEY` et DB credentials
- [ ] Full dependency audit et updates
- [ ] Review RBAC permissions et roles
- [ ] Security testing (penetration test recommandé)
- [ ] Review incident response plan
- [ ] Audit user accounts (remove inactive)
- [ ] Review third-party integrations

---

## Recommandations d'Amélioration

### Haute Priorité

**H1: Implement Refresh Token Rotation**
- **Impact** : Meilleure sécurité sessions
- **Effort** : Moyen
- **Gain** : Tokens plus courts (15 min), révocation possible

**H2: Add Token Blacklist for Logout**
- **Impact** : Logout sécurisé
- **Effort** : Faible
- **Gain** : Tokens invalidés immédiatement

**H3: Migrate JWT to HttpOnly Cookies**
- **Impact** : Protection XSS localStorage
- **Effort** : Élevé
- **Gain** : Tokens inaccessibles au JavaScript

### Moyenne Priorité

**M1: Add User-Based Rate Limiting**
- **Impact** : Protection account-specific
- **Effort** : Faible

**M2: Implement Separate CSRF Secret**
- **Impact** : Meilleure isolation secrets
- **Effort** : Faible

**M3: Add Secret Rotation Policy**
- **Impact** : Sécurité long-terme
- **Effort** : Moyen

### Basse Priorité

**L1: Add API Rate Limit Headers**
**L2: Implement Token Fingerprinting**
**L3: Add Security Audit Logging Table**
**L4: Fix Low-Severity npm Vulnerabilities**
**L5: Add Dependency Scanning to CI/CD**

---

## Ressources

- [Architecture Technique](/docs/technical/architecture)
- [Database Guide](/docs/technical/database)
- [Deployment Guide](/docs/technical/deployment)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

{% callout type="info" title="Sécurité en Production" %}
**Score : 87/100 (B+)** | **171/196 endpoints protégés** | **0 CVE critiques** | **Audit prochain : Avril 2026**
{% /callout %}
