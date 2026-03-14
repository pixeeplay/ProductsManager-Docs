---
title: Installation
nextjs:
  metadata:
    title: Installation - Products Manager APP
    description: Guide d'installation complet de Products Manager avec Docker et Docker Compose.
---

Installez Products Manager en local ou sur votre serveur en moins de 15 minutes avec Docker. Ce guide couvre l'installation complète, la configuration et le troubleshooting. {% .lead %}

---

## Prérequis Système

### Matériel Recommandé

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| **CPU** | 2 cores | 4 cores |
| **RAM** | 4 GB | 8 GB |
| **Stockage** | 20 GB SSD | 50 GB SSD |
| **Réseau** | 100 Mbps | 1 Gbps |

### Logiciels Requis

- **Docker** : Version 20.10 ou supérieure
- **Docker Compose** : Version 2.0 ou supérieure
- **Git** : Pour cloner le repository (optionnel)

{% callout type="note" %}
Products Manager utilise Docker pour simplifier le déploiement et garantir la compatibilité multi-plateforme (Linux, macOS, Windows).
{% /callout %}

---

## Installation de Docker

### Linux (Ubuntu/Debian)

```bash
# Mettre à jour les paquets
sudo apt update
sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo apt install docker-compose-plugin -y

# Vérifier l'installation
docker --version
docker compose version
```

### macOS

```bash
# Installer Docker Desktop depuis :
# https://www.docker.com/products/docker-desktop

# Ou via Homebrew
brew install --cask docker

# Lancer Docker Desktop depuis le Finder
# Vérifier l'installation
docker --version
docker compose version
```

### Windows

1. Téléchargez **Docker Desktop** : https://www.docker.com/products/docker-desktop
2. Installez en suivant l'assistant
3. Activez **WSL 2** si demandé
4. Redémarrez votre machine
5. Vérifiez l'installation :

```powershell
docker --version
docker compose version
```

---

## Installation de Products Manager

### Méthode 1 : Clone du Repository (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/pixeeplay/ProductsManager-App.git
cd ProductsManager-App

# Copier le fichier d'environnement
cp .env.example .env

# Éditer la configuration
nano .env  # ou vim, code, etc.
```

### Méthode 2 : Téléchargement Direct

```bash
# Télécharger l'archive
wget https://github.com/pixeeplay/ProductsManager-App/archive/refs/heads/main.zip

# Extraire
unzip main.zip
cd ProductsManager-App-main

# Copier le fichier d'environnement
cp .env.example .env
```

---

## Configuration du Fichier .env

Éditez le fichier `.env` pour configurer votre installation.

### Variables Essentielles

#### 1. Base de Données

```bash
# Architecture Multi-DB (7 bases PostgreSQL)
DB_CORE_URL=postgresql://user:password@postgres:5432/staging_db_core
DB_CATALOG_URL=postgresql://user:password@postgres:5432/staging_db_catalog
DB_IMPORTS_URL=postgresql://user:password@postgres:5432/staging_db_imports
DB_ANALYTICS_URL=postgresql://user:password@postgres:5432/staging_db_analytics
DB_MEDIA_URL=postgresql://user:password@postgres:5432/staging_db_media
DB_CODE2ASIN_URL=postgresql://user:password@postgres:5432/staging_db_code2asin
DB_SUPPLIERS_URL=postgresql://user:password@postgres:5432/staging_db_suppliers
DATABASE_URL=${DB_CATALOG_URL}  # compatibilité
```

{% callout type="warning" %}
**Important** : Changez TOUJOURS les mots de passe par défaut avant de déployer en production !
{% /callout %}

#### 2. Application

```bash
# Application Settings
APP_NAME=ProductsManager
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

# Secret Key (générez avec: openssl rand -hex 32)
SECRET_KEY=votre_secret_key_aleatoire_64_caracteres
```

#### 3. Redis (Cache)

```bash
# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=CHANGEZ_MOI_REDIS_PASSWORD
REDIS_DB=0
```

#### 4. API & Authentication

```bash
# JWT Configuration
JWT_SECRET_KEY=votre_jwt_secret_aleatoire
JWT_ACCESS_TOKEN_EXPIRES=7200  # 2 heures en secondes
JWT_REFRESH_TOKEN_EXPIRES=604800  # 7 jours

# API Rate Limiting
RATE_LIMIT_DEFAULT=100/minute
RATE_LIMIT_AUTH=10/minute
RATE_LIMIT_IMPORTS=5/minute
```

#### 4b. MinIO (Stockage Objets)

```bash
# MinIO — Staging
MINIO_ENDPOINT=staging-minio.productsmanager.app
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_SECURE=true
MINIO_BUCKET=media-images

# MinIO — Production
# MINIO_ENDPOINT=minio.productsmanager.app
# MINIO_SECURE=true
```

#### 4c. Meilisearch (Recherche Full-Text)

```bash
MEILISEARCH_URL=http://meilisearch:7700
MEILISEARCH_API_KEY=your-meilisearch-master-key
```

#### 4d. Qdrant (Recherche Sémantique — Optionnel)

```bash
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=your-qdrant-api-key
```

#### 5. IA et Enrichissement (Optionnel)

```bash
# OpenAI (enrichissement IA + embeddings Qdrant)
OPENAI_API_KEY=sk-votre_cle_api_openai

# Anthropic (alternative à OpenAI)
ANTHROPIC_API_KEY=sk-ant-votre_cle_anthropic

# Perplexity (web enrichment Phase A)
PERPLEXITY_API_KEY=pplx-votre_cle_perplexity

# SerpAPI (price monitoring + web enrichment Phase B)
SERPAPI_API_KEY=votre_cle_serpapi
```

#### 6. Email (Optionnel)

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_app
SMTP_FROM=noreply@productsmanager.app
```

---

## Lancement de l'Application

### Démarrage Initial

```bash
# Construire les images Docker
docker compose build

# Démarrer tous les services
docker compose up -d

# Vérifier que tous les conteneurs sont démarrés
docker compose ps
```

Vous devriez voir :

```text
NAME                    STATUS              PORTS
productsmanager-api     Up 30 seconds       0.0.0.0:8000->8000/tcp
productsmanager-web     Up 30 seconds       0.0.0.0:3000->3000/tcp
productsmanager-postgres Up 30 seconds      5432/tcp
productsmanager-redis   Up 30 seconds       6379/tcp
productsmanager-worker  Up 30 seconds
```

### Initialisation de la Base de Données

ProductsManager utilise **Alembic** pour les migrations (FastAPI, pas Django). Les migrations s'exécutent automatiquement au démarrage via le service `migrate` (job Docker `restart: "no"`).

Pour les appliquer manuellement :

```bash
# Appliquer les migrations sur chaque base
docker compose exec api alembic -x db=core upgrade head
docker compose exec api alembic -x db=catalog upgrade head
docker compose exec api alembic -x db=imports upgrade head
docker compose exec api alembic -x db=analytics upgrade head
docker compose exec api alembic -x db=media upgrade head
docker compose exec api alembic -x db=code2asin upgrade head
docker compose exec api alembic -x db=suppliers upgrade head
```

Le premier super-admin est créé via l'API ou directement en base. Utilisez `POST /api/v1/auth/register` pour le premier compte, puis assignez le rôle Admin via `PATCH /api/v1/users/{id}/roles`.

---

## Accès à l'Application

### URLs par Défaut

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface web principale |
| **API** | http://localhost:8000/api/v1 | API REST |
| **API Docs** | http://localhost:8000/docs | Documentation OpenAPI interactive (Swagger UI) |
| **MinIO Console** | http://localhost:9001 | Interface stockage objets |
| **Meilisearch** | http://localhost:7700 | Moteur de recherche |

### Credentials par Défaut

```text
Email: admin@productsmanager.app
Mot de passe: celui que vous avez défini lors de createsuperuser
```

{% callout type="warning" %}
Pour un usage en production, configurez un reverse proxy (Nginx/Traefik) avec HTTPS et changez les ports par défaut.
{% /callout %}

---

## Structure des Services

### Architecture Multi-Conteneurs

```text
┌─────────────────────────────────────────────────┐
│  productsmanager-web (Next.js Frontend)         │
│  Port: 3000                                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  productsmanager-api (FastAPI Backend)          │
│  Port: 8000                                     │
└─────────────────────────────────────────────────┘
         ↓                              ↓
┌────────────────────┐      ┌──────────────────────┐
│  PostgreSQL (5 DB) │      │  Redis (Cache)       │
│  Port: 5432        │      │  Port: 6379          │
└────────────────────┘      └──────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│  productsmanager-worker (Celery Worker)         │
│  Traite les imports en arrière-plan            │
└─────────────────────────────────────────────────┘
```

### Base de Données Multi-DB

Products Manager utilise une **architecture multi-DB** avec 7 bases PostgreSQL :

| Base de Données | Usage | Tables Principales |
|-----------------|-------|--------------------|
| **db_core** | Utilisateurs, auth, paramètres | users, roles, permissions, app_settings, platform_connectors |
| **db_catalog** | Catalogue produits | products, suppliers, categories, brands, platform_product_mappings |
| **db_imports** | Jobs d'import | import_jobs, import_configs, import_schedules |
| **db_analytics** | Métriques et rapports | audit_logs, ai_usage_logs, user_activity |
| **db_media** | Images et fichiers | media_files |
| **db_code2asin** | Mapping codes Amazon | code2asin_jobs |
| **db_suppliers** | Données fournisseurs étendues | scraped_products, scraper_runs |

---

## Gestion des Services

### Commandes Docker Compose Utiles

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Redémarrer un service spécifique
docker compose restart api

# Voir les logs en temps réel
docker compose logs -f api

# Voir les logs d'un service spécifique
docker compose logs -f worker

# Exécuter une commande dans un conteneur
docker compose exec api python manage.py shell

# Accéder au shell d'un conteneur
docker compose exec api bash

# Reconstruire après modification du code
docker compose build api
docker compose up -d api
```

### Monitoring de l'État

```bash
# Vérifier l'état de santé
curl http://localhost:8000/health

# Health check multi-DB détaillé
curl http://localhost:8000/api/v1/monitoring/database-health

# Métriques Prometheus
curl http://localhost:8000/api/v1/monitoring/prometheus-metrics
```

---

## Configuration Avancée

### Reverse Proxy Nginx

Créez `/etc/nginx/sites-available/productsmanager` :

```nginx
server {
    listen 80;
    server_name productsmanager.app;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name productsmanager.app;

    ssl_certificate /etc/letsencrypt/live/productsmanager.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/productsmanager.app/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Activez la configuration :

```bash
sudo ln -s /etc/nginx/sites-available/productsmanager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Certificat SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir un certificat SSL
sudo certbot --nginx -d productsmanager.app -d www.productsmanager.app

# Le renouvellement est automatique via cron
```

---

## Sauvegardes

### Backup de la Base de Données

```bash
# Backup manuel
docker compose exec postgres pg_dumpall -U productsmanager > backup_$(date +%Y%m%d).sql

# Backup automatisé (cron quotidien)
# Ajoutez à crontab -e :
0 2 * * * cd /path/to/Suppliers-Import && docker compose exec -T postgres pg_dumpall -U productsmanager | gzip > /backups/productsmanager_$(date +\%Y\%m\%d).sql.gz
```

### Restauration

```bash
# Restaurer depuis un backup
docker compose exec -T postgres psql -U productsmanager < backup_20251005.sql
```

### Backup des Fichiers Uploadés

```bash
# Backup du volume Docker contenant les médias
docker run --rm -v productsmanager_media:/data -v $(pwd):/backup ubuntu tar czf /backup/media_backup_$(date +%Y%m%d).tar.gz /data
```

---

## Troubleshooting

### Les conteneurs ne démarrent pas

**Vérifiez les logs** :

```bash
docker compose logs api
docker compose logs postgres
```

**Erreur courante** : Port déjà utilisé

```bash
# Identifier le processus utilisant le port 8000
sudo lsof -i :8000

# Arrêter le processus ou changer le port dans docker-compose.yml
```

### Erreur de connexion à la base de données

**Vérifiez** :

1. PostgreSQL est bien démarré : `docker compose ps postgres`
2. Les credentials dans `.env` sont corrects
3. Attendez 30 secondes après le démarrage initial (temps de démarrage PostgreSQL)

```bash
# Tester la connexion manuelle
docker compose exec postgres psql -U productsmanager -d productsmanager
```

### L'API retourne des erreurs 500

**Vérifiez les migrations** :

```bash
docker compose exec api alembic -x db=core current
docker compose exec api alembic -x db=catalog current
docker compose exec api alembic -x db=core upgrade head
```

**Vérifiez les variables d'environnement** :

```bash
docker compose exec api env | grep DB_
```

### Performance lente

**Vérifiez les ressources Docker** :

```bash
docker stats

# Augmentez les limites dans docker-compose.yml si nécessaire
```

**Optimisez PostgreSQL** :

Éditez `postgresql.conf` dans le conteneur :

```text
shared_buffers = 256MB
effective_cache_size = 1GB
max_connections = 200
```

### Réinitialisation complète

```bash
# ATTENTION : Supprime toutes les données !
docker compose down -v
docker system prune -a --volumes -f
docker compose up -d
# Les migrations s'appliquent automatiquement via le service migrate
```

---

## Mise à Jour

### Mettre à Jour vers une Nouvelle Version

```bash
# 1. Sauvegarder les bases de données
for db in staging_db_core staging_db_catalog staging_db_imports staging_db_analytics \
          staging_db_media staging_db_code2asin staging_db_suppliers; do
  docker compose exec postgres pg_dump -U postgresuser $db > backup_${db}_$(date +%Y%m%d).sql
done

# 2. Récupérer la dernière version
git pull origin main

# 3. Reconstruire les images
docker compose build

# 4. Redémarrer (migrations appliquées automatiquement par le service migrate)
docker compose up -d
```

---

## Performance et Optimisation

### Pool de Connexions Multi-DB

La configuration optimale pour 8 GB RAM :

```bash
# Dans .env
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=3600
```

### Cache Redis

```bash
# Optimiser Redis pour les imports
REDIS_MAXMEMORY=2gb
REDIS_MAXMEMORY_POLICY=allkeys-lru
```

### Workers Celery

ProductsManager utilise 4 queues Celery distinctes :

```bash
# Démarrer le worker avec toutes les queues
celery -A core.celery_app worker -Q default,imports,enrichment,connectors --concurrency=12

# Queues disponibles :
# default     — tâches générales (sync stats, media, notifications)
# imports     — pipeline import fichiers
# enrichment  — AI enrichment, price bot, prompt library
# connectors  — sync plateformes (push/pull produits, stock, prix)
```

---

## Prochaines Étapes

Maintenant que l'installation est complète :

1. [Démarrage Rapide](/docs/getting-started/quick-start) - Premier import en 10 minutes
2. [Guide Utilisateur](/docs/user-guides/getting-started) - Maîtriser l'interface
3. [API Documentation](/docs/api/authentication) - Intégrer via l'API

---

## Support

- **Documentation** : https://docs.productsmanager.app
- **GitHub Issues** : https://github.com/pixeeplay/ProductsManager-App/issues
- **Email** : webmaster@pixeeplay.com
