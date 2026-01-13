---
title: Odoo ERP Integration
nextjs:
  metadata:
    title: Odoo ERP Integration - Products Manager APP
    description: Bidirectional product synchronization between Products Manager and Odoo ERP with field mapping, scheduled syncs, and comprehensive logging.
---

Synchronize your product catalog with Odoo ERP. Bidirectional sync, configurable field mappings, automated schedules, and detailed sync history tracking with 80 tests validating the implementation. {% .lead %}

---

## Overview

The Odoo Integration enables seamless bidirectional synchronization between Products Manager and your Odoo ERP instance. Built on Odoo's **XML-RPC protocol**, this integration supports both export (push products to Odoo) and import (pull products from Odoo) workflows.

### Key Features

- **Bidirectional Sync**: Export products to Odoo or import from Odoo
- **Configurable Field Mapping**: Map local fields to Odoo fields with transformations
- **Scheduled Syncs**: Cron-based automation with Celery workers
- **Sync History**: Complete audit trail of all synchronization operations
- **Category & Tax Mapping**: Match categories and tax rates between systems
- **Encrypted Credentials**: Fernet encryption for secure credential storage

### Quality Assurance

The integration has been thoroughly tested:

- **80 total tests** covering the entire integration
- 51 unit tests for OdooService and Celery tasks
- 29 integration tests for schema validation
- Coverage includes encryption, connections, transformations, and async operations

---

## Connection Configuration

### Prerequisites

Before configuring the integration, ensure you have:

- Odoo instance URL (e.g., `https://yourcompany.odoo.com`)
- Odoo database name
- User credentials (email and password or API key)
- User with appropriate permissions (Sales/Inventory/Product access)

### Configuration Steps

1. Navigate to **Odoo Sync** > **Configuration**
2. Enter your connection details:

```json
{
  "name": "Production Odoo",
  "odoo_url": "https://yourcompany.odoo.com",
  "odoo_db": "your_database_name",
  "odoo_username": "integration@company.com",
  "odoo_password": "your_api_key_or_password"
}
```

3. Click **Test Connection** to verify

{% callout type="note" title="Credential Security" %}
Passwords are encrypted using Fernet symmetric encryption before storage. The encryption key is derived from your application's SECRET_KEY.
{% /callout %}

### Testing the Connection

The test connection endpoint verifies:

- Network connectivity to the Odoo URL
- XML-RPC authentication
- Database accessibility
- API permissions

```text
POST /api/v1/odoo/test-connection

Response:
{
  "success": true,
  "message": "Connection successful",
  "odoo_version": "17.0",
  "user_id": 42,
  "database": "production_db"
}
```

---

## Field Mapping

Field mappings define how product data is transformed between Products Manager and Odoo.

### Default Field Mappings

| Local Field | Odoo Field | Type | Required | Notes |
|-------------|------------|------|----------|-------|
| `title` | `name` | direct | Yes | Product name |
| `ean` | `barcode` | direct | Yes | EAN/UPC code |
| `description` | `description_sale` | direct | No | Sales description |
| `price` | `list_price` | transform | No | Selling price |
| `weight` | `weight` | direct | No | Weight in kg |
| `brand_name` | `x_brand` | custom | No | Custom brand field |
| `category` | `categ_id` | transform | No | Category mapping |
| `image_url` | `image_1920` | transform | No | Product image |

### Mapping Types

- **direct**: Value copied as-is between systems
- **transform**: Value converted using a transformation function
- **custom**: Special handling for custom Odoo fields

### Creating Custom Mappings

Navigate to **Odoo Sync** > **Mappings** to configure field mappings:

```json
{
  "local_field": "supplier_reference",
  "odoo_field": "default_code",
  "odoo_model": "product.template",
  "mapping_type": "direct",
  "is_bidirectional": true,
  "is_required": false,
  "is_active": true,
  "priority": 10
}
```

### Category Mapping

Map Products Manager categories to Odoo category IDs:

| Products Manager Category | Odoo Category ID | Odoo Path |
|--------------------------|------------------|-----------|
| Electronics | 5 | All / Saleable / Electronics |
| Clothing | 12 | All / Saleable / Clothing |
| Accessories | 18 | All / Saleable / Accessories |

### Tax Mapping

Configure tax rate correspondences between systems for accurate pricing synchronization.

---

## Bidirectional Sync

### Export to Odoo

Push products from Products Manager to your Odoo instance.

#### Single Product Sync

```text
POST /api/v1/odoo/sync/{product_id}

Request Body:
{
  "force_update": false,
  "sync_images": true
}

Response:
{
  "success": true,
  "odoo_product_id": 1547,
  "fields_synced": ["name", "barcode", "list_price", "description_sale"],
  "duration_ms": 342
}
```

#### Bulk Export

Export multiple products with filters:

```text
POST /api/v1/odoo/bulk-sync

Request Body:
{
  "filters": {
    "supplier_id": 15,
    "has_ean": true,
    "modified_since": "2025-01-01T00:00:00Z"
  },
  "batch_size": 100,
  "sync_images": true
}

Response:
{
  "success": true,
  "batch_id": "sync_20251216_143022",
  "products_queued": 250,
  "estimated_duration_minutes": 5
}
```

### Import from Odoo

Pull products from Odoo into Products Manager.

```text
POST /api/v1/odoo/import

Request Body:
{
  "odoo_filters": {
    "categ_id": [5, 12],
    "active": true
  },
  "create_missing": true,
  "update_existing": true,
  "batch_size": 50
}

Response:
{
  "success": true,
  "batch_id": "import_20251216_150033",
  "products_found": 423,
  "message": "Import queued for processing"
}
```

### Sync Direction Options

- **to_odoo**: Export from Products Manager to Odoo
- **from_odoo**: Import from Odoo to Products Manager
- **bidirectional**: Full two-way synchronization (requires conflict resolution)

---

## Scheduled Syncs with Cron

Automate your synchronization with scheduled tasks using cron expressions.

### Creating a Schedule

Navigate to **Odoo Sync** > **Schedules** or use the API:

```text
POST /api/v1/odoo/schedules

Request Body:
{
  "name": "Daily Product Export",
  "description": "Export all modified products to Odoo every morning",
  "cron_expression": "0 6 * * *",
  "sync_direction": "to_odoo",
  "sync_type": "incremental",
  "filters": {
    "modified_today": true
  },
  "batch_size": 100,
  "is_enabled": true
}
```

### Cron Expression Examples

| Schedule | Cron Expression | Description |
|----------|-----------------|-------------|
| Every morning at 6 AM | `0 6 * * *` | Daily sync before business hours |
| Every 4 hours | `0 */4 * * *` | Regular updates throughout day |
| Monday mornings | `0 7 * * 1` | Weekly sync at week start |
| Every 30 minutes | `*/30 * * * *` | Near real-time sync |

### Schedule Management

```text
# Toggle schedule on/off
PATCH /api/v1/odoo/schedules/{id}/toggle

# Run schedule immediately
POST /api/v1/odoo/schedules/{id}/run

# Update schedule settings
PUT /api/v1/odoo/schedules/{id}
{
  "cron_expression": "0 8 * * *",
  "batch_size": 200
}

# Delete schedule
DELETE /api/v1/odoo/schedules/{id}
```

### Celery Worker Configuration

Schedules are processed by Celery workers with the following configuration:

```python
# Beat schedule checks every 5 minutes
"check-scheduled-odoo-syncs": {
    "task": "api.services.odoo_tasks.process_scheduled_odoo_syncs",
    "schedule": 300.0,  # 5 minutes
}

# Dedicated queue for Odoo operations
Queue("odoo", Exchange("odoo"), routing_key="odoo.*")
```

---

## Sync History and Logs

Every synchronization operation is logged for audit and troubleshooting.

### Viewing Sync History

Navigate to **Odoo Sync** > **History** to view:

- Recent sync operations with status
- Success/failure counts
- Detailed error messages
- Sync duration metrics

### Log Entry Structure

```json
{
  "id": 15842,
  "product_id": "uuid-of-product",
  "odoo_product_id": 1547,
  "sync_direction": "to_odoo",
  "sync_type": "create",
  "sync_status": "success",
  "fields_synced": ["name", "barcode", "list_price"],
  "duration_ms": 342,
  "started_at": "2025-12-16T14:30:22Z",
  "completed_at": "2025-12-16T14:30:22Z",
  "triggered_by": "schedule",
  "schedule_id": 3,
  "batch_id": "sync_20251216_143022"
}
```

### Sync Statistics

```text
GET /api/v1/odoo/stats

Response:
{
  "total_syncs": 15842,
  "successful_syncs": 15623,
  "failed_syncs": 219,
  "success_rate": 98.62,
  "avg_duration_ms": 285,
  "last_sync_at": "2025-12-16T14:30:22Z",
  "products_with_odoo_id": 8472
}
```

### Error Handling

Failed syncs include detailed error information:

```json
{
  "sync_status": "error",
  "error_message": "Field 'barcode' must be unique",
  "error_details": {
    "odoo_error_code": "UNIQUE_VIOLATION",
    "field": "barcode",
    "value": "3700123456789",
    "existing_product_id": 892
  }
}
```

Features for handling errors:
- **Bulk Retry**: Retry all failed syncs from a batch
- **Error Details Modal**: View full error context
- **Automatic Retry**: Transient failures retried automatically

---

## API Reference

### Configuration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/odoo/config` | Get current configuration |
| PUT | `/api/v1/odoo/config` | Update configuration |
| POST | `/api/v1/odoo/test-connection` | Test Odoo connection |
| GET | `/api/v1/odoo/status` | Get connection status |

### Sync Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/odoo/sync/{product_id}` | Sync single product |
| POST | `/api/v1/odoo/bulk-sync` | Bulk sync with filters |
| POST | `/api/v1/odoo/import` | Import from Odoo |

### Field Mappings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/odoo/field-mappings` | List all mappings |
| POST | `/api/v1/odoo/field-mappings` | Create/update mapping |
| DELETE | `/api/v1/odoo/field-mappings/{id}` | Delete mapping |
| GET | `/api/v1/odoo/odoo-fields` | Get Odoo model fields |

### Schedules

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/odoo/schedules` | List schedules |
| POST | `/api/v1/odoo/schedules` | Create schedule |
| PUT | `/api/v1/odoo/schedules/{id}` | Update schedule |
| DELETE | `/api/v1/odoo/schedules/{id}` | Delete schedule |
| PATCH | `/api/v1/odoo/schedules/{id}/toggle` | Toggle enabled |
| POST | `/api/v1/odoo/schedules/{id}/run` | Run immediately |

### Logs & Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/odoo/logs` | List sync logs |
| GET | `/api/v1/odoo/stats` | Get sync statistics |

---

## Security

### Credential Protection

- **Fernet Encryption**: Passwords encrypted with 32-byte key from SECRET_KEY
- **No Plain Text Storage**: Credentials never stored in clear text
- **Secure Transmission**: All API calls use HTTPS/TLS

### Permission Requirements

Access to Odoo configuration requires:
- `Permission.MANAGE_SETTINGS` for configuration changes
- Standard authentication for sync operations

### Audit Logging

All operations logged with:
- User context (who triggered the sync)
- Timestamps (when it occurred)
- Full operation details (what was synced)

---

## Known Limitations

### Current Limitations

- **Single Instance**: Only one Odoo configuration supported per deployment
- **No Real-time Updates**: UI requires manual refresh after syncs
- **Last Write Wins**: No conflict resolution for bidirectional sync
- **Basic Transformations**: Limited field type transformations
- **No Image Compression**: Images sent to Odoo as-is

### Unsupported Features

- Multi-company Odoo configurations
- Manufacturing/MRP bill of materials
- Variant synchronization (roadmap)
- Stock level sync (roadmap)
- Real-time WebSocket updates (roadmap)

---

## Troubleshooting

### Connection Issues

**Error: "Access Denied"**
- Verify username and password/API key
- Check user has XML-RPC access enabled
- Confirm user is active in Odoo

**Error: "Database not found"**
- Verify exact database name (case-sensitive)
- Check Odoo URL is correct (no trailing slash)

### Sync Failures

**Error: "Unique constraint violation"**
- Product with same barcode already exists in Odoo
- Check existing products before sync

**Error: "Required field missing"**
- Verify all required field mappings are configured
- Check product has required data (e.g., title, EAN)

### Performance Issues

For large catalogs (1000+ products):
- Use incremental sync instead of full sync
- Increase batch_size to reduce API calls
- Schedule syncs during off-peak hours

---

## Next Steps

- [Odoo Integration Guide](/docs/integrations/odoo) - Detailed setup walkthrough
- [Import Centralisation](/docs/features/import-centralisation) - Import products before syncing
- [API Authentication](/docs/api/authentication) - API access setup
- [Architecture Overview](/docs/technical/architecture) - System architecture details
