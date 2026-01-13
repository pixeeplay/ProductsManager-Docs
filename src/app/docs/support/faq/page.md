---
title: FAQ - Frequently Asked Questions
nextjs:
  metadata:
    title: FAQ - Products Manager APP
    description: Answers to frequently asked questions about Products Manager APP - account, products, imports, exports, API, and integrations.
---

Find answers to the most common questions about Products Manager APP. {% .lead %}

---

## Account and Authentication

### How do I reset my password?

1. On the login page, click **"Forgot password?"**
2. Enter your email address
3. Check your inbox (and spam folder)
4. Click the reset link (valid for 1 hour)
5. Set a new password

### Why does my session expire?

For security reasons, sessions expire after:
- **30 minutes** of inactivity
- **7 days** maximum (even with activity)

Check **"Remember me"** at login to extend your session.

### How do I change my login email?

1. Go to **Profile** (top right corner)
2. Click **"Account settings"**
3. Modify your email
4. Confirm with your current password
5. Validate via the link sent to your new email

### Can I have multiple accounts?

Yes, you can be invited to multiple organizations with the same email. Use the organization selector in the menu to switch between them.

### How do I enable two-factor authentication?

1. Go to **Profile** > **Security**
2. Click **"Enable 2FA"**
3. Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
4. Enter the verification code to confirm

---

## Product Management

### What fields are required for a product?

The required fields are:
- **Title**: Product name
- **EAN** or **SKU**: Unique identifier

All other fields are optional.

### How do I add images to a product?

1. Open the product page
2. Go to the **"Media"** section
3. Drag and drop your images or click to select
4. Accepted formats: JPG, PNG, WebP (max 10 MB per image)
5. Maximum 20 images per product

### How do I edit multiple products at once?

1. In the product list, select products using checkboxes
2. Click **"Actions"** > **"Bulk edit"**
3. Choose the fields to modify
4. Apply the changes

### How do I delete a product?

1. Open the product page
2. Click **"..."** > **"Delete"**
3. Confirm the deletion

{% callout type="warning" title="Important" %}
Deletion is permanent after 30 days. Products are moved to trash first for recovery.
{% /callout %}

### How do I duplicate a product?

1. Open the product page
2. Click **"..."** > **"Duplicate"**
3. Modify unique fields (EAN, SKU)
4. Save the new product

---

## Import/Export Workflows

### Why did my import fail?

The most common reasons:
1. **Incorrect file format** - Check encoding (UTF-8 recommended)
2. **Missing columns** - Title and EAN/SKU are required
3. **Invalid data** - Negative prices, malformed EAN codes
4. **File too large** - Maximum 50 MB

Check the error report for specific details.

### What is the maximum file size for imports?

| Format | Max Size | Recommended Max Rows |
|--------|----------|---------------------|
| CSV | 50 MB | 100,000 rows |
| Excel | 50 MB | 50,000 rows |
| JSON | 50 MB | 50,000 objects |
| XML | 50 MB | 50,000 elements |

### How do I map custom columns?

1. During import, at the **"Mapping"** step
2. Click on the unmapped column
3. Select the corresponding ProductsManager field
4. Or choose **"Ignore this column"**

### How do I schedule automated imports?

1. Go to **Imports** > **Automation**
2. Create a new automation
3. Configure the source:
   - **Email**: Dedicated email address
   - **FTP/SFTP**: Server and credentials
4. Define the schedule (daily, weekly, etc.)
5. Configure the default mapping

### Do imports overwrite existing products?

By default, imports **update** existing products (based on EAN/SKU). You can choose:
- **Update**: Modifies existing products
- **Ignore**: Leaves existing products unchanged
- **Create only**: Skips updates

### Which platforms can I export to?

ProductsManager supports:
- **Shopify** (CSV Shopify format)
- **WooCommerce** (CSV/XML)
- **PrestaShop** (CSV PS format)
- **Magento** (CSV)
- **Amazon** (Flat file)
- **Odoo** (CSV/XML)

### Why are some products not exported?

Verify that the products:
1. Are **active** (not archived)
2. Have all **required fields** for the platform
3. Match the export **filters**
4. Have no **validation errors**

---

## API Usage

### How do I get an API token?

```bash
POST https://api.productsmanager.app/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "YourPassword"
}
```

The response includes your `access_token` and `refresh_token`.

### What are the API rate limits?

Default limits:
- **100 requests per minute** for standard endpoints
- **10 requests per minute** for bulk operations
- **1000 requests per hour** total

Contact support to increase limits for your plan.

### How do I handle token expiration?

Access tokens expire after 2 hours. Use the refresh endpoint:

```bash
POST https://api.productsmanager.app/api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your_refresh_token"
}
```

### Where can I find API documentation?

- [Authentication Guide](/docs/api/authentication)
- [API Endpoints](/docs/api/endpoints)
- [Webhooks](/docs/api/webhooks)

---

## Integrations

### Odoo Integration

**How do I connect to Odoo?**

1. Go to **Odoo Sync** > **Configuration**
2. Enter your Odoo URL (e.g., `https://mycompany.odoo.com`)
3. Provide your Odoo username and API key
4. Select the database to connect to
5. Test the connection and save

**Why is my Odoo sync failing?**

Common causes:
- Invalid API key (regenerate in Odoo settings)
- Firewall blocking the connection
- Odoo server is down or unreachable
- Permission issues in Odoo

See [Odoo Integration Guide](/docs/integrations/odoo) for more details.

### Code2ASIN Integration

**What is Code2ASIN?**

Code2ASIN automatically matches your product EAN codes to Amazon ASINs, fetching product images and metadata from Amazon.

**How do I run a Code2ASIN job?**

1. Go to **Code2ASIN** > **New Job**
2. Select products or use filters
3. Choose target marketplace (Amazon.fr, Amazon.com, etc.)
4. Start the job and monitor progress

**Why are some products not matched?**

- The EAN might not exist on Amazon
- The product might be restricted or unavailable
- Rate limiting from Amazon (try again later)

### Shopify Integration

**How do I export to Shopify?**

1. Go to **Exports** > **Create Export**
2. Select **Shopify** as the platform
3. Choose products and configure field mappings
4. Download the CSV or push directly via API

See [Shopify Integration Guide](/docs/integrations/shopify) for more details.

### WooCommerce Integration

**How do I sync with WooCommerce?**

1. Install the WooCommerce REST API plugin
2. Generate API keys in WooCommerce
3. Configure the connection in ProductsManager
4. Set up sync rules and schedules

See [WooCommerce Integration Guide](/docs/integrations/woocommerce) for more details.

---

## Performance Issues

### How many products can I manage?

ProductsManager supports:
- **Standard**: Up to 100,000 products
- **Pro**: Up to 500,000 products
- **Enterprise**: Unlimited

### The application is slow, what can I do?

1. **Check your internet connection** (minimum 10 Mbps recommended)
2. **Clear browser cache** (`Ctrl+Shift+Del`)
3. **Reduce items per page** (use 50 instead of 100)
4. **Use filters** to limit displayed results
5. **Disable browser extensions** that might interfere

### Search is slow, how can I improve it?

1. Use **precise terms** (EAN, SKU) instead of generic keywords
2. Combine with **filters** to narrow results
3. Avoid very short search queries (less than 3 characters)

### What is the service availability?

ProductsManager targets **99.9% uptime**. Check:
- **Status page**: status.productsmanager.app
- **Maintenance notices**: Announced 48h in advance by email

### Is my data backed up?

Yes, your data is:
- **Backed up** every hour
- **Replicated** across multiple servers
- **Retained** for 30 days for restoration

---

## Billing and Plans

### How do I upgrade my plan?

1. Go to **Settings** > **Billing**
2. Click **"Upgrade Plan"**
3. Select your new plan
4. Complete payment

### How do I cancel my subscription?

1. Go to **Settings** > **Billing**
2. Click **"Cancel Subscription"**
3. Your access continues until the billing period ends

### What happens when I reach my quota?

You will see a "Quota exceeded" message. Options:
- Contact support to increase your quota
- Upgrade to a higher plan
- Archive or delete unused products

---

## Need More Help?

If you did not find your answer:

- **Troubleshooting Guide**: [Resolve common issues](/docs/support/troubleshooting)
- **Support Email**: support@productsmanager.app
- **Status Page**: [status.productsmanager.app](https://status.productsmanager.app)
- **Full Documentation**: [All guides](/docs/getting-started/introduction)
