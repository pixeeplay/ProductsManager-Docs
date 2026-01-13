---
title: Rate Limiting
nextjs:
  metadata:
    title: Rate Limiting - Products Manager API
    description: Complete guide to API rate limiting, tiers, headers, and error handling for Products Manager.
---

The Products Manager API implements granular rate limiting to protect against abuse and ensure fair usage across all users. {% .lead %}

---

## Overview

Rate limiting controls how many API requests you can make within a specific time window. This protects the API from abuse, ensures fair resource allocation, and maintains system stability for all users.

Key features:

- **Tiered limits**: Different endpoints have different limits based on resource intensity
- **Per-user tracking**: Limits are tracked per authenticated user
- **Clear headers**: Every response includes rate limit information
- **Graceful handling**: 429 responses include retry timing information

---

## Rate Limit Tiers

The API organizes rate limits into four tiers based on risk level and resource intensity:

### Critical Tier

Operations that require the most restrictive limits due to security concerns or high resource cost.

| Tier | Limit | Description |
|------|-------|-------------|
| AUTH_LOGIN | 5/minute | Login attempts (brute force protection) |
| AUTH_PASSWORD_RESET | 5/minute | Password reset requests |
| AUTH_REGISTER | 5/minute | New account creation |
| AUTH_REFRESH | 30/minute | Token refresh operations |
| AUTH_LOGOUT | 30/minute | Logout operations |
| BULK_IMPORT | 500/minute | Bulk data imports |
| BULK_EXPORT | 500/minute | Bulk data exports |
| BULK_CREATE | 500/minute | Bulk entity creation |
| BULK_UPDATE | 500/minute | Bulk entity updates |
| BULK_DELETE | 500/minute | Bulk entity deletion |
| AI_BATCH | 1/hour | AI batch enrichment (cost control) |
| AI_SINGLE | 20/minute | AI single product enrichment |

### High Tier

Write operations and data export functions.

| Tier | Limit | Description |
|------|-------|-------------|
| WRITE_STANDARD | 100/minute | Standard POST/PUT/DELETE operations |
| WRITE_UPLOAD | 100/minute | File uploads |
| WRITE_USER_MGMT | 100/minute | User and role management |
| WRITE_CONFIG | 100/minute | Configuration changes |
| EXPORT_STANDARD | 50/minute | CSV/Excel/JSON exports |
| EXPORT_STREAM | 50/minute | Streaming exports |
| EXPORT_DOWNLOAD | 50/minute | File downloads |
| EXPORT_SCHEDULE | 50/minute | Scheduled export operations |

### Medium Tier

Standard read operations with moderate limits.

| Tier | Limit | Description |
|------|-------|-------------|
| READ_SENSITIVE | 50/minute | User data, audit logs |
| READ_STANDARD | 1000/minute | Standard GET operations |
| READ_ADMIN | 1000/minute | Admin panel read operations |

### Low Tier

Public and health check endpoints with permissive limits.

| Tier | Limit | Description |
|------|-------|-------------|
| READ_PUBLIC | 1000/minute | Public data (categories, etc.) |
| HEALTH_CHECK | 1000/minute | Health and status endpoints |
| PROGRESS_POLL | 1000/minute | Progress polling (high frequency) |

---

## Summary by Endpoint Category

| Category | Limit | Examples |
|----------|-------|----------|
| Read Endpoints | 1000/minute | Product listings, search, details |
| Write Endpoints | 100/minute | Create, update, delete operations |
| Analytics & Reports | 50/minute | Dashboard metrics, exports |
| AI Operations | 20/minute | Single enrichment, categorization |
| AI Batch | 1/hour | Bulk AI processing |
| Bulk Operations | 500/minute | Large catalog imports/exports |
| Authentication | 5/minute | Login, register, password reset |

---

## Response Headers

All API responses include rate limit information in the following headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum number of requests allowed in the current time window |
| `X-RateLimit-Remaining` | Number of requests remaining in the current time window |
| `X-RateLimit-Reset` | Unix timestamp (seconds) when the rate limit window resets |
| `Retry-After` | Seconds to wait before retrying (only present on 429 responses) |

### Example Response Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 998
X-RateLimit-Reset: 1704067260
Content-Type: application/json
```

---

## Error Handling (429 Too Many Requests)

When you exceed the rate limit, the API returns a `429 Too Many Requests` response:

### Response Body

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": "Please wait before making more requests",
  "detail": "1 per 1 minute"
}
```

### Response Headers

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067305
Content-Type: application/json
```

---

## Environment-Based Adjustments

Rate limits vary by environment to support different use cases:

### Development Environment

More permissive limits for easier testing and development:

| Tier | Development Limit | Production Limit |
|------|-------------------|------------------|
| AUTH_LOGIN | 20/minute | 5/minute |
| BULK_IMPORT | 1000/minute | 500/minute |
| BULK_DELETE | 1000/minute | 500/minute |
| AI_BATCH | 5/hour | 1/hour |
| AI_SINGLE | 50/minute | 20/minute |
| READ_STANDARD | 2000/minute | 1000/minute |
| WRITE_STANDARD | 200/minute | 100/minute |

### Testing Environment

Very permissive for automated test suites:

| Tier | Testing Limit | Production Limit |
|------|---------------|------------------|
| AUTH_LOGIN | 100/minute | 5/minute |
| BULK_IMPORT | 1000/minute | 500/minute |
| AI_BATCH | 20/hour | 1/hour |
| AI_SINGLE | 100/minute | 20/minute |
| READ_STANDARD | 5000/minute | 1000/minute |
| WRITE_STANDARD | 500/minute | 100/minute |
| EXPORT_STANDARD | 100/minute | 50/minute |

### Staging Environment

Same limits as production for realistic testing.

### Production Environment

The documented limits above represent production values.

---

## Code Examples

### Python (requests)

```python
import requests
import time

def make_api_request(url, headers, max_retries=3):
    """Make an API request with rate limit handling."""
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)

        # Log rate limit info
        remaining = response.headers.get('X-RateLimit-Remaining')
        limit = response.headers.get('X-RateLimit-Limit')
        print(f"Rate limit: {remaining}/{limit} remaining")

        if response.status_code == 429:
            # Rate limited - wait and retry
            retry_after = int(response.headers.get('Retry-After', 60))
            print(f"Rate limited. Waiting {retry_after} seconds...")
            time.sleep(retry_after)
            continue

        return response

    raise Exception("Max retries exceeded")

# Usage
headers = {"Authorization": "Bearer your-token-here"}
response = make_api_request(
    "https://api.productsmanager.app/api/v1/products",
    headers
)
```

### JavaScript (fetch)

```javascript
async function makeApiRequest(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': 'Bearer your-token-here',
        ...options.headers,
      },
    });

    // Log rate limit info
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const limit = response.headers.get('X-RateLimit-Limit');
    console.log(`Rate limit: ${remaining}/${limit} remaining`);

    if (response.status === 429) {
      // Rate limited - wait and retry
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      console.log(`Rate limited. Waiting ${retryAfter} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}

// Usage
const response = await makeApiRequest(
  'https://api.productsmanager.app/api/v1/products'
);
const data = await response.json();
```

### cURL

```bash
# Make a request and observe rate limit headers
curl -i -X GET \
  "https://api.productsmanager.app/api/v1/products" \
  -H "Authorization: Bearer your-token-here"

# Response will include:
# X-RateLimit-Limit: 1000
# X-RateLimit-Remaining: 999
# X-RateLimit-Reset: 1704067260
```

---

## Best Practices

1. **Monitor headers**: Always check `X-RateLimit-Remaining` to avoid hitting limits
2. **Implement backoff**: Use exponential backoff when rate limited
3. **Batch requests**: Use bulk endpoints instead of multiple single requests
4. **Cache responses**: Reduce API calls by caching frequently accessed data
5. **Use webhooks**: For event-driven updates instead of polling
6. **Plan for limits**: Design your integration with rate limits in mind

---

## Requesting Higher Limits

For applications requiring higher rate limits or custom quotas, please contact support with:

- Your use case description
- Expected request volumes
- Specific endpoints affected

---

## Related Documentation

- [Authentication](/docs/api/authentication)
- [API Endpoints](/docs/api/endpoints)
- [Webhooks](/docs/api/webhooks)
- [Security](/docs/technical/security)
