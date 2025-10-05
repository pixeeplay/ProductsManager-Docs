---
title: Webhooks
nextjs:
  metadata:
    title: Webhooks - Products Manager APP
    description: Documentation complète des webhooks pour recevoir des notifications en temps réel.
---

Les webhooks permettent de recevoir des notifications HTTP en temps réel lorsque des événements se produisent dans Products Manager. {% .lead %}

---

## Vue d'Ensemble

Les webhooks sont des callbacks HTTP POST envoyés à une URL de votre choix lorsque certains événements surviennent. Ils vous permettent d'intégrer Products Manager avec vos systèmes existants sans polling constant.

### Avantages

- Notifications instantanées des événements importants
- Réduction de la charge API (pas de polling)
- Intégration facile avec n'importe quel système HTTP

---

## Configuration

### Créer un Webhook

Utilisez l'API ou l'interface web pour configurer un webhook :

```bash
POST https://api.productsmanager.app/api/v1/webhooks
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "url": "https://votre-serveur.com/webhooks/productsmanager",
  "events": ["import.completed", "product.updated"],
  "secret": "votre_secret_pour_signature",
  "active": true
}
```

#### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| url | string | URL de destination (HTTPS recommandé) |
| events | array | Liste des événements à écouter |
| secret | string | Secret pour signer les payloads (optionnel mais recommandé) |
| active | boolean | Activer/désactiver le webhook |

---

## Événements Disponibles

### Imports

#### import.started

Déclenché quand un import démarre.

```json
{
  "event": "import.started",
  "timestamp": "2025-10-05T10:30:00Z",
  "data": {
    "job_id": 12345,
    "supplier_id": 42,
    "supplier_name": "Fournisseur XYZ",
    "import_type": "full",
    "total_products": 5000,
    "started_by": "user@example.com"
  }
}
```

#### import.completed

Déclenché quand un import se termine avec succès.

```json
{
  "event": "import.completed",
  "timestamp": "2025-10-05T11:15:00Z",
  "data": {
    "job_id": 12345,
    "supplier_id": 42,
    "supplier_name": "Fournisseur XYZ",
    "duration_seconds": 2700,
    "stats": {
      "total_products": 5000,
      "created": 150,
      "updated": 4800,
      "errors": 50
    },
    "status": "completed"
  }
}
```

#### import.failed

Déclenché quand un import échoue.

```json
{
  "event": "import.failed",
  "timestamp": "2025-10-05T10:45:00Z",
  "data": {
    "job_id": 12345,
    "supplier_id": 42,
    "supplier_name": "Fournisseur XYZ",
    "error": {
      "code": "FILE_NOT_FOUND",
      "message": "Unable to download file from FTP server",
      "details": "Connection timeout after 30 seconds"
    },
    "duration_seconds": 30
  }
}
```

---

### Produits

#### product.created

Déclenché quand un nouveau produit est créé.

```json
{
  "event": "product.created",
  "timestamp": "2025-10-05T14:20:00Z",
  "data": {
    "product_id": 9876,
    "sku": "PROD-NEW-001",
    "name": "Nouveau Produit",
    "price": 49.99,
    "supplier_id": 42,
    "created_by": "import_job_12345"
  }
}
```

#### product.updated

Déclenché quand un produit est modifié.

```json
{
  "event": "product.updated",
  "timestamp": "2025-10-05T14:25:00Z",
  "data": {
    "product_id": 9876,
    "sku": "PROD-NEW-001",
    "changes": {
      "price": {
        "old": 49.99,
        "new": 39.99
      },
      "stock": {
        "old": 100,
        "new": 250
      }
    },
    "updated_by": "import_job_12345"
  }
}
```

#### product.deleted

Déclenché quand un produit est supprimé.

```json
{
  "event": "product.deleted",
  "timestamp": "2025-10-05T15:00:00Z",
  "data": {
    "product_id": 9876,
    "sku": "PROD-NEW-001",
    "deleted_by": "user@example.com",
    "reason": "discontinued"
  }
}
```

---

### Fournisseurs

#### supplier.created

Déclenché quand un nouveau fournisseur est créé.

```json
{
  "event": "supplier.created",
  "timestamp": "2025-10-05T09:00:00Z",
  "data": {
    "supplier_id": 43,
    "name": "Nouveau Fournisseur",
    "import_type": "api",
    "created_by": "admin@example.com"
  }
}
```

#### supplier.updated

Déclenché quand un fournisseur est modifié.

```json
{
  "event": "supplier.updated",
  "timestamp": "2025-10-05T09:30:00Z",
  "data": {
    "supplier_id": 43,
    "changes": {
      "import_schedule": {
        "old": "daily",
        "new": "hourly"
      }
    },
    "updated_by": "admin@example.com"
  }
}
```

---

### Stock

#### stock.low_alert

Déclenché quand un produit passe sous le seuil de stock minimum.

```json
{
  "event": "stock.low_alert",
  "timestamp": "2025-10-05T16:00:00Z",
  "data": {
    "product_id": 1234,
    "sku": "PROD-001",
    "name": "Produit en Rupture",
    "current_stock": 5,
    "threshold": 10,
    "supplier_id": 42
  }
}
```

---

## Format des Payloads

Tous les webhooks suivent cette structure standard :

```json
{
  "event": "nom_de_evenement",
  "timestamp": "2025-10-05T10:30:00Z",
  "webhook_id": "wh_abc123",
  "data": {
    // Données spécifiques à l'événement
  }
}
```

### Champs Communs

| Champ | Type | Description |
|-------|------|-------------|
| event | string | Nom de l'événement (ex: import.completed) |
| timestamp | string | Date/heure ISO 8601 de l'événement |
| webhook_id | string | ID unique du webhook |
| data | object | Données spécifiques à l'événement |

---

## Sécurité

### Signatures HMAC

Pour vérifier que les webhooks proviennent bien de Products Manager, utilisez les signatures HMAC.

#### Header de Signature

Chaque requête webhook inclut un header `X-Webhook-Signature` :

```text
X-Webhook-Signature: sha256=abc123def456...
```

#### Vérification (Node.js)

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Dans votre route webhook
app.post('/webhooks/productsmanager', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhook(payload, signature, YOUR_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Traiter le webhook
  console.log('Event:', req.body.event);
  res.status(200).send('OK');
});
```

#### Vérification (Python)

```python
import hmac
import hashlib

def verify_webhook(payload: str, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected)

# Dans votre route Flask
@app.route('/webhooks/productsmanager', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.get_data(as_text=True)

    if not verify_webhook(payload, signature, YOUR_SECRET):
        return 'Invalid signature', 401

    data = request.json
    print(f"Event: {data['event']}")

    return 'OK', 200
```

{% callout type="warning" %}
Validez TOUJOURS les signatures des webhooks pour éviter les requêtes malveillantes.
{% /callout %}

---

## Retry Policy

Si votre endpoint webhook ne répond pas ou retourne une erreur, Products Manager réessaiera :

### Stratégie de Retry

1. **Première tentative** : Immédiate
2. **Retry 1** : Après 1 minute
3. **Retry 2** : Après 5 minutes
4. **Retry 3** : Après 15 minutes
5. **Retry 4** : Après 1 heure
6. **Retry 5** : Après 6 heures

Après 5 tentatives échouées, le webhook est désactivé automatiquement.

### Codes de Réponse Attendus

| Code | Comportement |
|------|--------------|
| 200-299 | Succès, pas de retry |
| 400-499 | Erreur client, pas de retry (sauf 408, 429) |
| 500-599 | Erreur serveur, retry automatique |
| Timeout (>30s) | Retry automatique |

{% callout type="note" %}
Votre endpoint doit répondre en moins de **30 secondes**. Pour les traitements longs, retournez 200 immédiatement et traitez de manière asynchrone.
{% /callout %}

---

## Bonnes Pratiques

### 1. Idempotence

Concevez vos handlers de webhooks pour être idempotents, car un même événement peut être reçu plusieurs fois.

```javascript
// Exemple : Utiliser webhook_id pour déduplication
const processedWebhooks = new Set();

app.post('/webhooks/productsmanager', (req, res) => {
  const webhookId = req.body.webhook_id;

  if (processedWebhooks.has(webhookId)) {
    // Déjà traité
    return res.status(200).send('OK');
  }

  // Traiter le webhook
  processEvent(req.body);

  processedWebhooks.add(webhookId);
  res.status(200).send('OK');
});
```

### 2. Traitement Asynchrone

```javascript
app.post('/webhooks/productsmanager', async (req, res) => {
  // Répondre immédiatement
  res.status(200).send('OK');

  // Traiter de manière asynchrone
  processWebhookAsync(req.body);
});
```

### 3. Logging

Loggez tous les webhooks reçus pour faciliter le debugging :

```javascript
app.post('/webhooks/productsmanager', (req, res) => {
  console.log('[WEBHOOK]', {
    event: req.body.event,
    timestamp: req.body.timestamp,
    data: req.body.data
  });

  res.status(200).send('OK');
});
```

### 4. HTTPS Uniquement

Utilisez toujours HTTPS pour vos endpoints webhook afin de protéger les données en transit.

---

## Gestion des Webhooks

### Lister les Webhooks

```bash
GET https://api.productsmanager.app/api/v1/webhooks
Authorization: Bearer YOUR_TOKEN
```

### Mettre à Jour un Webhook

```bash
PUT https://api.productsmanager.app/api/v1/webhooks/{webhook_id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "events": ["import.completed", "import.failed"],
  "active": true
}
```

### Supprimer un Webhook

```bash
DELETE https://api.productsmanager.app/api/v1/webhooks/{webhook_id}
Authorization: Bearer YOUR_TOKEN
```

### Tester un Webhook

Déclenchez manuellement un webhook de test :

```bash
POST https://api.productsmanager.app/api/v1/webhooks/{webhook_id}/test
Authorization: Bearer YOUR_TOKEN
```

Cela enverra un payload de test à votre URL :

```json
{
  "event": "webhook.test",
  "timestamp": "2025-10-05T17:00:00Z",
  "webhook_id": "wh_abc123",
  "data": {
    "message": "This is a test webhook from Products Manager"
  }
}
```

---

## Monitoring

### Logs de Webhooks

Consultez l'historique des webhooks envoyés :

```bash
GET https://api.productsmanager.app/api/v1/webhooks/{webhook_id}/logs
```

Réponse :

```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "timestamp": "2025-10-05T10:30:00Z",
        "event": "import.completed",
        "http_status": 200,
        "response_time_ms": 145,
        "retry_count": 0
      },
      {
        "timestamp": "2025-10-05T11:00:00Z",
        "event": "import.failed",
        "http_status": 500,
        "response_time_ms": 30000,
        "retry_count": 3,
        "error": "Request timeout"
      }
    ]
  }
}
```

---

## Exemple Complet (Express.js)

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const processedWebhooks = new Set();

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post('/webhooks/productsmanager', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);

  // 1. Vérifier la signature
  if (!verifySignature(payload, signature)) {
    console.error('[WEBHOOK] Invalid signature');
    return res.status(401).send('Invalid signature');
  }

  const { event, webhook_id, data } = req.body;

  // 2. Vérifier l'idempotence
  if (processedWebhooks.has(webhook_id)) {
    console.log('[WEBHOOK] Already processed:', webhook_id);
    return res.status(200).send('OK');
  }

  // 3. Répondre immédiatement
  res.status(200).send('OK');

  // 4. Traiter l'événement
  console.log('[WEBHOOK]', event, data);

  switch(event) {
    case 'import.completed':
      console.log(`Import ${data.job_id} completed: ${data.stats.created} created, ${data.stats.updated} updated`);
      break;

    case 'import.failed':
      console.error(`Import ${data.job_id} failed: ${data.error.message}`);
      // Envoyer une alerte par email
      break;

    case 'product.updated':
      console.log(`Product ${data.sku} updated:`, data.changes);
      break;

    case 'stock.low_alert':
      console.warn(`Low stock alert for ${data.sku}: ${data.current_stock} units`);
      // Envoyer notification Slack
      break;
  }

  processedWebhooks.add(webhook_id);
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

---

## Ressources Associées

- [API Endpoints](/docs/api/endpoints)
- [Authentification API](/docs/api/authentication)
- [Sécurité](/docs/technical/security)
