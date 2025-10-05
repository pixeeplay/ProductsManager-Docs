---
title: Déploiement
description: Docker, Coolify, environnement et déploiement production
---

# Déploiement

Le système Suppliers-Import est déployé via **Docker Compose** avec orchestration **Coolify**, permettant des déploiements zero-downtime avec SSL automatique via Let's Encrypt.

{% .lead %}

---

## Vue d'ensemble

### Infrastructure

**Orchestration** : Coolify (self-hosted PaaS)
**Containers** : Docker Compose
**Reverse Proxy** : Traefik
**SSL** : Let's Encrypt (automatique)
**CI/CD** : Git push-based deployment

### Environnements

| Environnement | URL | Branch | Auto-deploy |
|---------------|-----|--------|-------------|
| **Production** | https://productsmanager.app | `main` | Oui |
| **Staging** | https://staging.productsmanager.app | `staging` | Oui |
| **Development** | http://localhost:3000 | `develop` | Non |

{% callout type="success" title="Zero-downtime Deployments" %}
Les déploiements se font sans interruption de service grâce à Traefik et les health checks Docker.
{% /callout %}

---

## Architecture Docker

### Stack de Containers

```yaml
services:
  # Application Backend
  api:
    image: suppliers-import/api:latest
    ports: 8000
    depends_on: [postgres, redis, minio]

  # Application Frontend
  frontend:
    image: suppliers-import/frontend:latest
    ports: 3000
    depends_on: [api]

  # Workers Asynchrones
  celery:
    image: suppliers-import/api:latest
    command: celery -A worker worker
    depends_on: [redis, postgres]

  celery-beat:
    image: suppliers-import/api:latest
    command: celery -A worker beat
    depends_on: [redis]

  # Infrastructure
  postgres:
    image: postgres:15-alpine
    volumes: [postgres-data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    volumes: [redis-data:/data]

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    volumes: [minio-data:/data]

  # Reverse Proxy
  traefik:
    image: traefik:v2.10
    ports: [80:80, 443:443]
    volumes: [/var/run/docker.sock:/var/run/docker.sock]
```

### Multi-stage Build

**Backend Dockerfile** :

```dockerfile
# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile** :

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Avantages multi-stage** :
- Image finale : **113 MB** (vs 691 MB sans optimisation)
- Pas de dev dependencies en production
- Layer caching optimisé
- Build reproductibles

---

## Coolify

Coolify est utilisé comme plateforme d'orchestration self-hosted, offrant une expérience similaire à Heroku/Vercel.

### Configuration Coolify

**Fichier `coolify.yaml`** :

```yaml
version: "3.8"

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - SECRET_KEY=${SECRET_KEY}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.productsmanager.app`)"
      - "traefik.http.routers.api.tls=true"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`productsmanager.app`)"
      - "traefik.http.routers.frontend.tls=true"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

### Features Coolify

**Déploiements** :
- Git push-based deployment
- Automatic rebuilds on push
- Zero-downtime deployments
- Rollback en 1 clic

**SSL/TLS** :
- Let's Encrypt automatique
- Renewal automatique
- Wildcard certificates support

**Monitoring** :
- Logs centralisés
- Métriques containers
- Health checks automatiques
- Alertes email/Slack

**Backup** :
- Backup automatique volumes
- Snapshots avant déploiement
- Restore facile

---

## Variables d'Environnement

### Variables Critiques

{% callout type="warning" title="Sécurité" %}
Ne **jamais** commit de secrets en clair. Utiliser Coolify Secrets ou `.env` (gitignored).
{% /callout %}

#### Bases de Données (5 PostgreSQL)

```env
# Base principale (compatibilité)
DATABASE_URL=postgresql://user:pass@postgres:5432/supplier_import

# Architecture Multi-DB
DB_CATALOG_URL=postgresql://user:pass@postgres:5432/db_catalog
DB_IMPORTS_URL=postgresql://user:pass@postgres:5432/db_imports
DB_MEDIA_URL=postgresql://user:pass@postgres:5432/db_media
DB_CODE2ASIN_URL=postgresql://user:pass@postgres:5432/db_code2asin
DB_ANALYTICS_URL=postgresql://user:pass@postgres:5432/db_analytics

# Pools de connexions
CATALOG_POOL_SIZE=30
IMPORTS_POOL_SIZE=20
MEDIA_POOL_SIZE=15
CODE2ASIN_POOL_SIZE=12
ANALYTICS_POOL_SIZE=10
DATABASE_POOL_TIMEOUT=30
DATABASE_POOL_RECYCLE=3600
```

#### MinIO (Stockage)

```env
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=ChangeThisInProduction123!
MINIO_SECURE=false  # true en production avec HTTPS
MINIO_PUBLIC_URL=https://storage.productsmanager.app

# Buckets
MINIO_CATALOG_BUCKET=catalog-products
MINIO_IMPORTS_BUCKET=imports-files
MINIO_MEDIA_BUCKET=media-images
MINIO_CODE2ASIN_BUCKET=code2asin-results
MINIO_ANALYTICS_BUCKET=analytics-reports
```

#### Redis (Cache)

```env
REDIS_URL=redis://redis:6379/0
REDIS_CACHE_TTL=3600
REDIS_MAX_CONNECTIONS=50

# Celery
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2
```

#### Sécurité & JWT

```env
SECRET_KEY=your-secret-key-min-32-chars-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=120
ALGORITHM=HS256
```

#### Application

```env
# Environment
APP_NAME=Supplier Import System
APP_VERSION=3.2.1
ENVIRONMENT=production  # production | staging | development
DEBUG=false
LOG_LEVEL=INFO

# URLs
APP_URL=https://productsmanager.app
API_V1_STR=/api/v1
NEXT_PUBLIC_API_URL=https://api.productsmanager.app/api/v1

# CORS
ALLOWED_ORIGINS=https://productsmanager.app,https://www.productsmanager.app
```

#### Notifications

```env
# SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_USE_TLS=true
FROM_EMAIL=noreply@productsmanager.app
FROM_NAME=Supplier Import System

# Admins
ADMIN_EMAILS=admin@productsmanager.app,tech@productsmanager.app
```

#### Monitoring

```env
# Sentry
SENTRY_DSN=https://xxx@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

# Prometheus
PROMETHEUS_ENABLED=true
METRICS_ENABLED=true
```

---

## Checklist de Déploiement

### Pré-déploiement

**Backup** :
- [ ] Backup complet de toutes les DB
- [ ] Backup volumes MinIO
- [ ] Export config Coolify

**Vérifications** :
- [ ] Tests passent en local
- [ ] Build Docker réussit
- [ ] Variables d'environnement configurées
- [ ] Secrets sécurisés (pas de hardcoded)

**Migration DB** :
- [ ] Migrations Alembic testées en staging
- [ ] Rollback plan documenté
- [ ] Indexes créés avec CONCURRENTLY

### Déploiement

**Coolify** :
1. Push sur branch `staging` ou `main`
2. Coolify détecte le push
3. Pull du code
4. Build des images Docker
5. Run des migrations
6. Démarrage des nouveaux containers
7. Health checks
8. Switch traffic vers nouveaux containers
9. Arrêt des anciens containers

**Durée** : ~3-5 minutes
**Downtime** : 0 seconde

### Post-déploiement

**Health Checks** :
- [ ] `/health` endpoint répond 200
- [ ] Multi-DB health check OK
- [ ] Redis accessible
- [ ] MinIO accessible
- [ ] Celery workers actifs

**Vérifications Fonctionnelles** :
- [ ] Login fonctionne
- [ ] Dashboard s'affiche
- [ ] Import produits OK
- [ ] Upload fichiers OK
- [ ] WebSocket temps réel OK

**Monitoring** :
- [ ] Logs propres (pas d'erreurs)
- [ ] Sentry actif
- [ ] Prometheus metrics exportées
- [ ] Grafana dashboards à jour

**Performance** :
- [ ] Temps de réponse API < 500ms p95
- [ ] Pool exhaustion 0%
- [ ] Cache hit rate > 70%
- [ ] Requêtes lentes < 3000/jour

---

## Health Checks

### Endpoint Health

```python
# /api/v1/health
@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "3.2.1",
        "timestamp": datetime.now().isoformat()
    }

# /api/v1/multidb/health
@router.get("/multidb/health")
async def multidb_health():
    health_status = {}

    # Test each database
    for db_name in ["catalog", "imports", "media", "code2asin", "analytics"]:
        try:
            db = get_db_session(db_name)
            await db.execute(text("SELECT 1"))
            health_status[db_name] = "healthy"
        except Exception as e:
            health_status[db_name] = f"unhealthy: {str(e)}"

    # Test Redis
    try:
        await redis.ping()
        health_status["redis"] = "healthy"
    except:
        health_status["redis"] = "unhealthy"

    # Test MinIO
    try:
        minio_client.list_buckets()
        health_status["minio"] = "healthy"
    except:
        health_status["minio"] = "unhealthy"

    return {
        "status": "healthy" if all(v == "healthy" for v in health_status.values()) else "degraded",
        "services": health_status
    }
```

### Docker Health Checks

```yaml
# API container
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s

# Frontend container
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s

# PostgreSQL
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U supplier_user"]
  interval: 10s
  timeout: 5s
  retries: 5

# Redis
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 5s
  retries: 5
```

---

## Traefik Configuration

### Labels Docker

```yaml
labels:
  # Enable Traefik
  - "traefik.enable=true"

  # HTTP → HTTPS redirect
  - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
  - "traefik.http.routers.api-http.middlewares=redirect-https"

  # HTTPS router
  - "traefik.http.routers.api.rule=Host(`api.productsmanager.app`)"
  - "traefik.http.routers.api.entrypoints=websecure"
  - "traefik.http.routers.api.tls=true"
  - "traefik.http.routers.api.tls.certresolver=letsencrypt"

  # Load balancer
  - "traefik.http.services.api.loadbalancer.server.port=8000"

  # Headers
  - "traefik.http.middlewares.api-headers.headers.customresponseheaders.X-Frame-Options=DENY"
  - "traefik.http.middlewares.api-headers.headers.customresponseheaders.X-Content-Type-Options=nosniff"
  - "traefik.http.middlewares.api-headers.headers.stsSeconds=31536000"

  # Compression
  - "traefik.http.middlewares.api-compress.compress=true"

  # Apply middlewares
  - "traefik.http.routers.api.middlewares=api-headers,api-compress"
```

### Features

**SSL/TLS** :
- Let's Encrypt automatique
- ACME HTTP-01 challenge
- Renouvellement automatique
- HSTS headers

**Load Balancing** :
- Round-robin par défaut
- Health checks actifs
- Sticky sessions (si besoin)

**Security** :
- Security headers automatiques
- Rate limiting possible
- IP whitelisting possible

---

## Rollback

### Rollback Automatique

Si health checks échouent après déploiement, Coolify rollback automatiquement vers version précédente.

### Rollback Manuel

**Via Coolify UI** :
1. Deployments → History
2. Sélectionner version précédente
3. Click "Rollback"
4. Confirmation

**Via Git** :
```bash
# Revenir à commit précédent
git revert HEAD
git push origin main

# OU forcer version précédente
git reset --hard <commit-hash>
git push --force origin main
```

**Via Docker** :
```bash
# Lister les images
docker images suppliers-import/api

# Redéployer version précédente
docker-compose up -d api:v3.2.0
```

### Rollback Base de Données

{% callout type="danger" title="Attention Migrations" %}
Les rollbacks DB nécessitent un downgrade Alembic. Tester **toujours** en staging avant.
{% /callout %}

```bash
# Rollback dernière migration
alembic downgrade -1

# Rollback à version spécifique
alembic downgrade <revision>

# OU restore backup
docker exec -i postgres psql -U user db_catalog < backup_catalog.sql
```

---

## Monitoring Post-Déploiement

### Métriques à Surveiller (24-48h)

**Performance** :
- Temps réponse API (p50, p95, p99)
- Requêtes lentes DB
- Pool exhaustion events
- Cache hit rate

**Infrastructure** :
- CPU usage par container
- Memory usage
- Disk I/O
- Network traffic

**Application** :
- Taux d'erreurs (5xx)
- Logs d'erreur Sentry
- Jobs Celery (success/failure)
- WebSocket connections

**Business** :
- Imports réussis/échoués
- Temps processing imports
- Nouvelles connexions utilisateurs
- Activité produits

### Commandes Utiles

```bash
# Logs temps réel
docker logs -f api-container

# Stats containers
docker stats

# Connexions actives DB
docker exec postgres psql -U user -c "
  SELECT datname, count(*)
  FROM pg_stat_activity
  GROUP BY datname;
"

# Stats Redis
docker exec redis redis-cli INFO stats

# Buckets MinIO
docker exec minio mc ls local/

# Status Celery workers
docker exec celery celery -A worker inspect active
```

---

## Troubleshooting

### Container ne démarre pas

**Symptômes** : Container restart loop

**Diagnostic** :
```bash
# Logs détaillés
docker logs api-container --tail 100

# Events Docker
docker events --filter container=api-container

# Inspect container
docker inspect api-container
```

**Solutions** :
- Vérifier variables d'environnement
- Vérifier depends_on (DB ready?)
- Augmenter start_period health check
- Check ports conflicts

### DB Connection Errors

**Symptômes** : "could not connect to server"

**Diagnostic** :
```bash
# Test connexion depuis container
docker exec api-container psql $DATABASE_URL -c "SELECT 1"

# Check réseau Docker
docker network inspect coolify
```

**Solutions** :
- Vérifier DATABASE_URL format
- Check PostgreSQL container running
- Vérifier network Docker
- Pool size trop petit?

### SSL Certificate Issues

**Symptômes** : "certificate not valid"

**Diagnostic** :
```bash
# Check certificate Traefik
docker exec traefik cat /letsencrypt/acme.json | jq

# Test SSL
curl -vI https://api.productsmanager.app
```

**Solutions** :
- Vérifier DNS pointe vers serveur
- Ports 80/443 ouverts
- Rate limit Let's Encrypt (5/week)
- Forcer renouvellement

---

## Backup & Restore

### Backup Automatique

**Script quotidien** :

```bash
#!/bin/bash
# /scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)

# Backup chaque DB
for DB in catalog imports media code2asin analytics; do
  docker exec postgres pg_dump -U user db_$DB > /backups/db_$DB_$DATE.sql
done

# Backup volumes MinIO
docker run --rm -v minio-data:/data -v /backups:/backup alpine \
  tar czf /backup/minio_$DATE.tar.gz /data

# Upload vers S3 (optionnel)
aws s3 cp /backups/ s3://backups-bucket/ --recursive

# Cleanup anciens backups (> 30 jours)
find /backups -type f -mtime +30 -delete
```

**Cron** :
```cron
# Tous les jours à 2h du matin
0 2 * * * /scripts/backup.sh
```

### Restore

```bash
# Restore DB
docker exec -i postgres psql -U user db_catalog < backup_catalog.sql

# Restore MinIO
docker run --rm -v minio-data:/data -v /backups:/backup alpine \
  tar xzf /backup/minio_20250101_020000.tar.gz -C /
```

---

## Ressources

- [Architecture Technique](/docs/technical/architecture)
- [Database Guide](/docs/technical/database)
- [Security](/docs/technical/security)
- [Coolify Documentation](https://coolify.io/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)

{% callout type="info" title="Production Actuelle" %}
Déployé sur **Coolify**, **8 containers**, **~3-5 min** par déploiement, **0 downtime**, **SSL automatique Let's Encrypt**
{% /callout %}
