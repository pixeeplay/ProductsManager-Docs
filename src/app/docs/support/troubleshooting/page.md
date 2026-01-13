---
title: Troubleshooting Guide
nextjs:
  metadata:
    title: Troubleshooting - Products Manager APP
    description: Resolve common issues with Products Manager APP - login problems, import errors, API issues, and performance troubleshooting.
---

This guide helps you resolve common issues with Products Manager APP. For general questions, see the [FAQ](/docs/support/faq) first. {% .lead %}

---

## Login and Authentication Issues

### I cannot log in

**Symptom:** "Invalid credentials" message or blank page

**Solutions:**

1. **Verify your credentials**
   - Check email spelling (watch for extra spaces)
   - Password is case-sensitive

2. **Reset your password**
   - Click "Forgot password?"
   - Check inbox AND spam folder

3. **Clear browser cache**
   - Chrome: `Ctrl+Shift+Del`
   - Firefox: `Ctrl+Shift+Del`
   - Safari: `Cmd+Option+E`

4. **Try incognito/private mode**
   - Chrome: `Ctrl+Shift+N`
   - Firefox: `Ctrl+Shift+P`

### My session expires constantly

**Cause:** Security settings or cookie issues

**Solutions:**

1. Check **"Remember me"** at login
2. Allow cookies for the ProductsManager domain
3. Disable extensions that block cookies
4. Verify your system time is correct

### "Access denied" after login

**Cause:** Insufficient permissions

**Solutions:**

1. Verify your role with the administrator
2. Request necessary permissions
3. Confirm your account is not deactivated

---

## Import Failures

### File not recognized

**Message:** "Unsupported file format"

| Check | Action |
|-------|--------|
| Extension | Rename to `.csv`, `.xlsx`, `.json`, `.xml` |
| Size | Reduce to < 50 MB |
| Corruption | Re-save from Excel/LibreOffice |
| Encoding | Convert to UTF-8 |

**To convert to UTF-8:**
1. Open with Notepad++ or VS Code
2. File > Encoding > Convert to UTF-8
3. Save the file

### Encoding errors (strange characters)

**Symptom:** Characters like `Ã©` instead of `e`, `â€™` instead of `'`

**Solutions:**

1. **Specify encoding during import**
   - Advanced options > Encoding > UTF-8 or Latin-1

2. **Convert the file** (Linux/Mac):
   ```bash
   iconv -f ISO-8859-1 -t UTF-8 file.csv > file_utf8.csv
   ```

3. **Use Excel/LibreOffice**
   - Open the file
   - File > Save As
   - Choose CSV UTF-8 format

### Import stuck or very slow

| Cause | Solution |
|-------|----------|
| File too large | Split into files < 50,000 rows |
| Unnecessary columns | Remove columns not needed |
| Excel formulas | Convert formulas to values |
| Peak hours | Retry during off-peak times |

### "Invalid EAN" errors in bulk

**Cause:** Incorrect EAN format

**Verification checklist:**
- Exactly 13 digits (EAN-13) or 8 digits (EAN-8)
- No letters or special characters
- No spaces
- Valid check digit

**Validation tool:**
- [GS1 Check Digit Calculator](https://www.gs1.org/services/check-digit-calculator)

### Duplicate products created

**Cause:** Different EAN/SKU or update option disabled

**Solutions:**

1. Verify the **key field** (EAN or SKU) is correct
2. Enable **"Update existing products"** option
3. Clean up duplicates after import:
   - Products > Filter > Duplicates
   - Merge or delete duplicates

---

## Export Issues

### Export is incomplete

**Symptom:** Fewer products than expected

| Cause | Solution |
|-------|----------|
| Active filters | Check filter settings |
| Inactive products | Include inactive products option |
| Validation errors | Check export report |
| Missing required fields | Complete product data |

### File rejected by platform

**Shopify:**
- Verify handles are unique
- Images must be HTTPS URLs
- Prices without currency symbol

**WooCommerce:**
- Use the correct import plugin
- Categories need full path
- SKUs must be unique

**Amazon:**
- Use official Seller Central template
- Verify Amazon categories
- Valid UPC/EAN required

### Images not imported on target platform

**Check:**

1. **URLs are publicly accessible**
   - Test URL in a browser
   - No authentication required

2. **Supported format**
   - JPEG, PNG, GIF, WebP
   - Some platforms reject SVG

3. **Optimal size**
   - < 2 MB per image
   - Minimum 500x500 px

---

## API Connection Issues

### Error 401 Unauthorized

**Cause:** Token expired or invalid

**Solutions:**
1. Regenerate your API token
2. Verify format: `Bearer <token>`
3. Check token permissions

```bash
# Correct authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Error 429 Too Many Requests

**Cause:** Rate limit exceeded

**Solutions:**
1. Respect limits (100 requests/minute default)
2. Implement delays between requests
3. Use bulk endpoints for multiple operations
4. Contact support to increase limits

### Error 500 Internal Server Error

**Cause:** Server-side error

**Actions:**
1. Retry after a few seconds
2. Verify request format is correct
3. Check response logs for details
4. Contact support if issue persists

---

## Database Issues

### Data not updating

**Symptoms:** Changes not reflected, stale data displayed

**Solutions:**

1. **Refresh the page** (`F5` or `Ctrl+R`)
2. Click the **"Refresh"** button in the interface
3. Clear application **local cache**
4. Log out and log back in

### Missing products or data

**Possible causes:**

1. **Filters are active** - Clear all filters
2. **Products are archived** - Check archive section
3. **Permission restrictions** - Verify your access level
4. **Organization mismatch** - Check you are in the correct organization

### Sync conflicts

**Symptom:** Different data in ProductsManager vs external system

**Resolution:**
1. Identify the source of truth
2. Use manual sync to overwrite
3. Check sync logs for error details
4. Verify field mappings are correct

---

## Performance Troubleshooting

### Application is slow

**Diagnostic steps:**

1. **Test your connection**
   - [speedtest.net](https://speedtest.net)
   - Minimum 10 Mbps recommended

2. **Check your browser**
   - Update to latest version
   - Disable unnecessary extensions
   - Clear cache

3. **Optimize display settings**
   - Reduce items per page (50 instead of 100)
   - Use filters to limit results

### Search is slow

**Solutions:**

1. Use **precise terms** (EAN, SKU)
2. Combine with **filters**
3. Avoid short generic queries

### Timeout errors

**Message:** "The request took too long"

| Operation | Solution |
|-----------|----------|
| Import | Split the file |
| Export | Reduce selection |
| Search | Refine criteria |
| Bulk action | Process in batches of 1,000 |

---

## Display Issues

### Blank page or Error 500

**Immediate solutions:**

1. **Hard refresh**: `Ctrl+F5`
2. **Clear browser cache**
3. **Try another browser**
4. **Check status**: status.productsmanager.app

### Interface is distorted

| Cause | Solution |
|-------|----------|
| Browser zoom | Reset to 100% (`Ctrl+0`) |
| Stale cache | Clear cache |
| Extensions | Disable ad blockers |
| Resolution | Minimum 1280x720 recommended |

### Data not refreshing

**Solutions:**

1. **Refresh** the page
2. Click the **"Refresh"** button
3. Clear **local cache** of the application
4. Log out and log back in

---

## Common Error Codes Reference

| Code | Message | Solution |
|------|---------|----------|
| **400** | Bad Request | Check request parameters |
| **401** | Unauthorized | Re-login or refresh token |
| **403** | Forbidden | Verify your permissions |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Duplicate (EAN/SKU exists) |
| **413** | Payload Too Large | Reduce file size |
| **422** | Unprocessable Entity | Invalid data format |
| **429** | Too Many Requests | Slow down request rate |
| **500** | Server Error | Retry or contact support |
| **502** | Bad Gateway | Maintenance in progress |
| **503** | Service Unavailable | Service temporarily down |

---

## Advanced Diagnostics

### Collecting debug information

For support, prepare:

1. **Screenshot** of the error
2. **Browser console** (`F12` > Console tab)
3. **Network tab** (`F12` > Network tab)
4. **Steps to reproduce** the problem
5. **Sample file** (if import/export related)

### Checking service status

- **Status page**: [status.productsmanager.app](https://status.productsmanager.app)
- **Maintenance notices**: Sent via email 48h in advance

---

## Contact Support

### Before contacting support checklist

- [ ] I have cleared browser cache
- [ ] I have tried incognito/private mode
- [ ] I have checked the service status page
- [ ] I have consulted the FAQ
- [ ] I can reproduce the problem
- [ ] I have prepared screenshots

### How to contact support

**Email:** support@productsmanager.app

**Information to provide:**
- Your account email
- Description of the problem
- Steps to reproduce
- Screenshots
- Relevant files (anonymized if necessary)

### Response times

| Priority | Description | Response Time |
|----------|-------------|---------------|
| Critical | Service down | < 1 hour |
| Urgent | Blocking issue | < 4 hours |
| Normal | Standard inquiry | < 24 business hours |

---

## Related Resources

- [FAQ](/docs/support/faq) - Frequently asked questions
- [API Authentication](/docs/api/authentication) - API setup guide
- [API Endpoints](/docs/api/endpoints) - Complete API reference
- [Odoo Integration](/docs/integrations/odoo) - Odoo sync troubleshooting
- [Import Workflow](/docs/user-guides/import-workflow) - Import best practices
