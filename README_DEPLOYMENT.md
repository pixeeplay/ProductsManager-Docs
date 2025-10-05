# Documentation Site - Deployment Guide

## Déploiement sur Coolify

Le site de documentation est déployé **séparément** du docker-compose principal pour éviter les conflits de build.

### Option 1 : Docker Compose dédié (Recommandé)

Utiliser le fichier `docker-compose.docs-site.yml` à la racine du projet.

**Dans Coolify :**
1. Créer une nouvelle **Application** de type **Docker Compose**
2. Configurer :
   - Repository : `https://github.com/pixeeplay/Suppliers-Import`
   - Branch : `staging`
   - Compose file : `docker-compose.docs-site.yml`
   - Base directory : `/` (racine)
3. Domaine :
   - Domain : `docs.productsmanager.app`
   - Port : `3002`
4. Déployer

### Option 2 : Dockerfile direct

**Dans Coolify :**
1. Créer une nouvelle **Application** de type **Dockerfile**
2. Configurer :
   - Repository : `https://github.com/pixeeplay/Suppliers-Import`
   - Branch : `staging`
   - Base directory : `/docs-site`
   - Dockerfile : `Dockerfile`
3. Variables d'environnement :
   ```bash
   NEXT_PUBLIC_SITE_URL=https://docs.productsmanager.app
   NEXT_PUBLIC_API_URL=https://api.productsmanager.app
   ```
4. Domaine :
   - Domain : `docs.productsmanager.app`
   - Port : `3000`
5. Déployer

### Option 3 : Build local + Registry

Si les options ci-dessus échouent, builder l'image localement et la pousser sur un registry :

```bash
# Build l'image
cd docs-site
docker build -t ghcr.io/pixeeplay/productsmanager-docs:latest .

# Push sur GitHub Container Registry
docker push ghcr.io/pixeeplay/productsmanager-docs:latest

# Dans Coolify, utiliser l'image pre-built
```

## Architecture

```
productsmanager.app (staging)
├── docker-compose.staging.yml
│   ├── frontend (port 3001) → productsmanager.app
│   ├── api (port 8001)
│   ├── postgres
│   ├── redis
│   ├── minio
│   ├── worker
│   └── beat
│
└── docker-compose.docs-site.yml (séparé)
    └── docs (port 3002) → docs.productsmanager.app
```

## Vérification

Une fois déployé :

```bash
# Vérifier que la doc est accessible
curl -I https://docs.productsmanager.app/

# Devrait retourner HTTP/2 200
```

## Problèmes connus

- **Coolify docker-compose build concatenation** : Coolify concatène les Dockerfiles de tous les services dans un docker-compose multi-services, causant des erreurs de build (ligne 521)
- **Solution** : Déployer la doc avec son propre docker-compose ou Dockerfile séparé

## Stack technique

- Next.js 15
- React 19
- TypeScript
- Markdoc (MDX)
- FlexSearch
- Tailwind CSS 4
- Template Syntax (Tailwind)
