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
git clone https://github.com/pixeeplay/Suppliers-Import.git
cd Suppliers-Import

# Copier le fichier d'environnement
cp .env.example .env

# Éditer la configuration
nano .env  # ou vim, code, etc.
```

### Méthode 2 : Téléchargement Direct

```bash
# Télécharger l'archive
wget https://github.com/pixeeplay/Suppliers-Import/archive/refs/heads/main.zip

# Extraire
unzip main.zip
cd Suppliers-Import-main

# Copier le fichier d'environnement
cp .env.example .env
```

---

## Configuration du Fichier .env

Éditez le fichier `.env` pour configurer votre installation.

### Variables Essentielles

#### 1. Base de Données

```bash
# PostgreSQL Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=productsmanager
DB_USER=productsmanager
DB_PASSWORD=CHANGEZ_MOI_AVEC_UN_MOT_DE_PASSE_SECURISE

# Multi-DB Architecture (5 databases)
DB_CATALOG_NAME=catalog_db
DB_IMPORTS_NAME=imports_db
DB_MEDIA_NAME=media_db
DB_CODE2ASIN_NAME=code2asin_db
DB_ANALYTICS_NAME=analytics_db
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

#### 5. IA et Enrichissement (Optionnel)

```bash
# OpenAI Configuration (pour enrichissement IA)
OPENAI_API_KEY=sk-votre_cle_api_openai
OPENAI_MODEL=gpt-4o
ENABLE_AI_ENRICHMENT=true
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

```
NAME                    STATUS              PORTS
productsmanager-api     Up 30 seconds       0.0.0.0:8000->8000/tcp
productsmanager-web     Up 30 seconds       0.0.0.0:3000->3000/tcp
productsmanager-postgres Up 30 seconds      5432/tcp
productsmanager-redis   Up 30 seconds       6379/tcp
productsmanager-worker  Up 30 seconds
```

### Initialisation de la Base de Données

```bash
# Exécuter les migrations
docker compose exec api python manage.py migrate

# Créer les 5 bases de données spécialisées
docker compose exec api python manage.py create_multidb

# Créer un super-utilisateur
docker compose exec api python manage.py createsuperuser
```

Renseignez :

```
Email: admin@productsmanager.app
Mot de passe: ********
Confirmation: ********
```

### Charger les Données de Démo (Optionnel)

```bash
# Charger des données d'exemple
docker compose exec api python manage.py loaddata demo_data.json
```

---

## Accès à l'Application

### URLs par Défaut

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface web principale |
| **API** | http://localhost:8000/api/v1 | API REST |
| **API Docs** | http://localhost:8000/docs | Documentation OpenAPI interactive |
| **Admin Django** | http://localhost:8000/admin | Interface d'administration backend |

### Credentials par Défaut

```
Email: admin@productsmanager.app
Mot de passe: celui que vous avez défini lors de createsuperuser
```

{% callout type="warning" %}
Pour un usage en production, configurez un reverse proxy (Nginx/Traefik) avec HTTPS et changez les ports par défaut.
{% /callout %}

---

## Structure des Services

### Architecture Multi-Conteneurs

```
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

Products Manager utilise une **architecture multi-DB** pour optimiser les performances :

| Base de Données | Usage | Tables Principales |
|-----------------|-------|--------------------|
| **catalog_db** | Catalogue produits | products, suppliers, categories |
| **imports_db** | Jobs d'import | import_jobs, import_logs, import_errors |
| **media_db** | Images et fichiers | product_images, files |
| **code2asin_db** | Mapping codes produits | ean_to_asin, cache_amazon |
| **analytics_db** | Métriques et rapports | dashboard_metrics, analytics_events |

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
docker compose exec api python manage.py showmigrations
docker compose exec api python manage.py migrate
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

```
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
docker compose exec api python manage.py migrate
docker compose exec api python manage.py createsuperuser
```

---

## Mise à Jour

### Mettre à Jour vers une Nouvelle Version

```bash
# Sauvegarder la base de données
docker compose exec postgres pg_dumpall -U productsmanager > backup_avant_maj.sql

# Récupérer la dernière version
git pull origin main

# Reconstruire les images
docker compose build

# Appliquer les migrations
docker compose exec api python manage.py migrate

# Redémarrer les services
docker compose restart
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

```bash
# Nombre de workers selon les CPU
# 1 worker par CPU core recommandé
docker compose up -d --scale worker=4
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
- **GitHub Issues** : https://github.com/pixeeplay/Suppliers-Import/issues
- **Email** : webmaster@pixeeplay.com
