---
title: Exemples d'utilisation de l'API
nextjs:
  metadata:
    title: Exemples d'utilisation de l'API - Products Manager APP
    description: Exemples pratiques curl et Python pour les operations courantes de l'API Products Manager.
---

Cette page fournit des exemples pratiques pour les operations les plus courantes de l'API Products Manager. Chaque exemple est disponible en curl et en Python. {% .lead %}

---

## Authentification

### Obtenir un token JWT

```bash
curl -X POST https://staging-api.productsmanager.app/api/v1/auth/login   -H "Content-Type: application/json"   -d '{
    "email": "user@example.com",
    "password": "votre_mot_de_passe"
  }'
```

```python
import requests

response = requests.post(
    "https://staging-api.productsmanager.app/api/v1/auth/login",
    json={
        "email": "user@example.com",
        "password": "votre_mot_de_passe"
    }
)
data = response.json()
token = data["access_token"]
print(f"Token: {token}")
```

**Reponse :**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "ea622393-4830-4a5a-bffc-19a48f40535c",
    "email": "user@example.com",
    "username": "user",
    "role": "admin",
    "is_active": true,
    "is_superuser": false
  }
}
```

{% callout type="note" title="Utilisation du token" %}
Incluez le token dans l'en-tete `Authorization` de chaque requete suivante :
`Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`
{% /callout %}

---

## Produits

### Lister les produits

```bash
curl -X GET "https://staging-api.productsmanager.app/api/v1/products?page=1&per_page=20&status=active"   -H "Authorization: Bearer "
```

```python
headers = {"Authorization": f"Bearer {token}"}

response = requests.get(
    "https://staging-api.productsmanager.app/api/v1/products",
    headers=headers,
    params={"page": 1, "per_page": 20, "status": "active"}
)
products = response.json()
print(f"Total: {products['total']} produits")
for p in products["items"]:
    print(f"  - {p['name']} (EAN: {p.get('ean', 'N/A')})")
```

### Creer un produit

```bash
curl -X POST https://staging-api.productsmanager.app/api/v1/products   -H "Authorization: Bearer "   -H "Content-Type: application/json"   -d '{
    "name": "Nouveau Produit",
    "ean": "3760001000012",
    "sku": "NP-001",
    "brand": "MaMarque",
    "description": "Description du produit",
    "supplier_id": "uuid-du-fournisseur"
  }'
```

```python
new_product = {
    "name": "Nouveau Produit",
    "ean": "3760001000012",
    "sku": "NP-001",
    "brand": "MaMarque",
    "description": "Description du produit",
    "supplier_id": "uuid-du-fournisseur"
}

response = requests.post(
    "https://staging-api.productsmanager.app/api/v1/products",
    headers=headers,
    json=new_product
)
print(f"Produit cree: {response.json()['id']}")
```

### Mettre a jour un produit

```bash
curl -X PUT https://staging-api.productsmanager.app/api/v1/products/{product_id}   -H "Authorization: Bearer "   -H "Content-Type: application/json"   -d '{
    "name": "Produit Mis a Jour",
    "description": "Nouvelle description"
  }'
```

---

## Imports

### Creer un job d'import

```bash
curl -X POST https://staging-api.productsmanager.app/api/v1/imports/upload   -H "Authorization: Bearer "   -F "file=@catalogue_fournisseur.xlsx"   -F "supplier_id=uuid-du-fournisseur"   -F "import_type=manual"
```

```python
with open("catalogue_fournisseur.xlsx", "rb") as f:
    response = requests.post(
        "https://staging-api.productsmanager.app/api/v1/imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("catalogue.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        data={
            "supplier_id": "uuid-du-fournisseur",
            "import_type": "manual"
        }
    )
job = response.json()
print(f"Job cree: {job['id']} - Statut: {job['status']}")
```

### Suivre le statut d'un import

```bash
curl -X GET https://staging-api.productsmanager.app/api/v1/imports/{job_id}   -H "Authorization: Bearer "
```

```python
job_id = "abede3f4-0b10-4259-bca3-0e055bc7eb40"
response = requests.get(
    f"https://staging-api.productsmanager.app/api/v1/imports/{job_id}",
    headers=headers
)
job = response.json()
print(f"Statut: {job['status']}")
print(f"Progres: {job['progress_percentage']}%")
print(f"Produits traites: {job['products_processed']}/{job['products_total']}")
```

---

## Fournisseurs

### Lister les fournisseurs

```bash
curl -X GET https://staging-api.productsmanager.app/api/v1/suppliers   -H "Authorization: Bearer "
```

```python
response = requests.get(
    "https://staging-api.productsmanager.app/api/v1/suppliers",
    headers=headers
)
suppliers = response.json()
for s in suppliers["items"]:
    print(f"  - {s['name']} ({s['code']})")
```

---

## Recherche

### Recherche globale

```bash
curl -X GET "https://staging-api.productsmanager.app/api/v1/search?q=samsung+galaxy&limit=10"   -H "Authorization: Bearer "
```

```python
response = requests.get(
    "https://staging-api.productsmanager.app/api/v1/search",
    headers=headers,
    params={"q": "samsung galaxy", "limit": 10}
)
results = response.json()
print(f"Resultats: {results['total']}")
for r in results["hits"]:
    print(f"  - [{r['type']}] {r['name']}")
```

---

## Modules

### Verifier le statut des modules (sans authentification)

```bash
curl -X GET https://staging-api.productsmanager.app/api/v1/modules/status
```

```python
# Cet endpoint est public, pas besoin de token
response = requests.get(
    "https://staging-api.productsmanager.app/api/v1/modules/status"
)
modules = response.json()
for m in modules:
    status = "actif" if m["enabled"] else "desactive"
    print(f"  {m['id']}: {m['name']} [{status}]")
```

---

## Gestion des erreurs en Python

```python
import requests

class ProductsManagerAPI:
    """Client simple pour l'API Products Manager."""

    def __init__(self, base_url, token):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        })

    def get(self, endpoint, **kwargs):
        response = self.session.get(f"{self.base_url}{endpoint}", **kwargs)
        self._handle_errors(response)
        return response.json()

    def post(self, endpoint, **kwargs):
        response = self.session.post(f"{self.base_url}{endpoint}", **kwargs)
        self._handle_errors(response)
        return response.json()

    def _handle_errors(self, response):
        if response.status_code == 401:
            raise Exception("Token expire ou invalide")
        elif response.status_code == 429:
            retry_after = response.headers.get("Retry-After", 60)
            raise Exception(f"Rate limit depasse. Reessayer dans {retry_after}s")
        elif response.status_code >= 400:
            error = response.json().get("error", {})
            raise Exception(
                f"Erreur {error.get('code')}: {error.get('message')} "
                f"(code: {error.get('error_code')}, request_id: {error.get('request_id')})"
            )

# Utilisation
api = ProductsManagerAPI(
    "https://staging-api.productsmanager.app/api/v1",
    token="votre_token_jwt"
)

try:
    products = api.get("/products", params={"page": 1})
    print(f"Total: {products['total']}")
except Exception as e:
    print(f"Erreur: {e}")
```

{% callout type="warning" title="Limite de debit" %}
Respectez les limites de debit de l'API. En cas de reponse 429, implementez un backoff exponentiel avant de reessayer. Les limites varient selon les endpoints : 5/15min pour le login, 100/min pour les lectures standard.
{% /callout %}

---

## Pagination

Tous les endpoints de liste supportent la pagination :

```python
def get_all_products(api):
    """Recupere tous les produits page par page."""
    all_products = []
    page = 1
    per_page = 100

    while True:
        data = api.get("/products", params={"page": page, "per_page": per_page})
        all_products.extend(data["items"])

        if page * per_page >= data["total"]:
            break
        page += 1

    return all_products

products = get_all_products(api)
print(f"Total recupere: {len(products)} produits")
```
