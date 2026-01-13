---
title: Thumbnail System
nextjs:
  metadata:
    title: Thumbnail System - Products Manager APP
    description: Automatic thumbnail generation for product images with UUID sharding for scalability and optimized performance.
---

Optimize your product catalog performance with automatic thumbnail generation. Products Manager APP creates multiple image sizes for fast loading and implements UUID sharding for scalability to 200k+ products. {% .lead %}

---

## Overview

The Thumbnail System is a core infrastructure feature that automatically generates optimized image versions for your product catalog. Instead of loading full-resolution images for product grids and previews, the system serves appropriately sized thumbnails, dramatically reducing bandwidth usage and improving page load times.

Combined with UUID prefix sharding for storage organization, this system is designed to scale efficiently to hundreds of thousands of products without performance degradation.

---

## Key Features

### Automatic Thumbnail Generation

When images are uploaded to your product catalog, the system automatically generates three thumbnail sizes:

| Size | Dimensions | Use Case |
|------|------------|----------|
| **Small** | 150x150 pixels | Product grids, search results, cart items |
| **Medium** | 300x300 pixels | Product cards, preview thumbnails |
| **Large** | 800x800 pixels | Product detail pages, zoom previews |

All thumbnails maintain aspect ratio and are optimized for web delivery with quality settings balanced between file size and visual quality.

### UUID Prefix Sharding

The storage system uses UUID-based directory sharding to ensure scalability:

**Storage Structure:**
```
products/{uuid[0:2]}/{product_id}/{hash}.jpg
products/{uuid[0:2]}/{product_id}/thumbs/small/{hash}.jpg
products/{uuid[0:2]}/{product_id}/thumbs/medium/{hash}.jpg
products/{uuid[0:2]}/{product_id}/thumbs/large/{hash}.jpg
```

**How it works:**
- The first 2 characters of the product UUID determine the subdirectory (00-ff)
- Creates 256 possible subdirectories for even distribution
- Prevents file system performance issues with large directories
- Supports 200,000+ products without degradation

{% callout type="note" %}
The UUID sharding is transparent to users and API consumers. The system automatically manages the storage paths and returns complete URLs for all images and thumbnails.
{% /callout %}

### Performance Optimization

The thumbnail system includes several performance optimizations:

- **Eager Loading**: Thumbnail data is loaded alongside product data using `selectinload`, minimizing database queries
- **CDN-Ready URLs**: All thumbnail URLs are ready for CDN distribution
- **Caching Headers**: Proper cache headers for browser and CDN caching
- **Lazy Generation**: Thumbnails can be generated on-demand if missing

---

## API Integration

### Thumbnail Response Structure

The Products API returns thumbnail URLs in a structured format within each image object:

```json
{
  "images": [{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "file_name": "product-image.jpg",
    "file_url": "https://storage.example.com/products/55/550e8400.../original.jpg",
    "is_primary": true,
    "thumbnails": {
      "small": "https://storage.example.com/products/55/550e8400.../thumbs/small/abc123.jpg",
      "medium": "https://storage.example.com/products/55/550e8400.../thumbs/medium/abc123.jpg",
      "large": "https://storage.example.com/products/55/550e8400.../thumbs/large/abc123.jpg"
    }
  }]
}
```

### ThumbnailsDict Schema

The backend uses a typed schema for thumbnail data:

```python
class ThumbnailsDict(BaseModel):
    small: Optional[str] = None   # 150x150 URL
    medium: Optional[str] = None  # 300x300 URL
    large: Optional[str] = None   # 800x800 URL

class MediaFileResponse(BaseModel):
    id: UUID
    file_name: str
    file_url: Optional[str]
    is_primary: bool
    thumbnails: Optional[ThumbnailsDict] = None
```

---

## Frontend Integration

### Utility Functions

The frontend provides utility functions for working with product thumbnails:

```typescript
// Get the small thumbnail URL (recommended for grids)
getProductThumbnailUrl(product)

// Get a specific size thumbnail
getProductImageUrl(product, 'small')   // 150x150
getProductImageUrl(product, 'medium')  // 300x300
getProductImageUrl(product, 'large')   // 800x800

// Get the original full-resolution image
getProductImageUrl(product)            // Original
```

### Product Interface

The Product interface includes the thumbnails structure:

```typescript
interface Product {
  id: string;
  name: string;
  images: {
    id: string;
    file_name: string;
    file_url: string;
    is_primary: boolean;
    thumbnails?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  }[];
  // ... other fields
}
```

### Component Usage

The ProductCard component automatically uses thumbnails:

```tsx
import { getProductThumbnailUrl } from '@/lib/image-utils';

function ProductCard({ product }) {
  const thumbnailUrl = getProductThumbnailUrl(product);

  return (
    <div className="product-card">
      <img
        src={thumbnailUrl}
        alt={product.name}
        loading="lazy"
      />
      {/* ... */}
    </div>
  );
}
```

{% callout type="note" %}
Always use the utility functions rather than accessing thumbnail URLs directly. They handle fallbacks gracefully when thumbnails are not yet generated.
{% /callout %}

---

## Database Model

### MediaThumbnail Model

Thumbnails are stored in the `media_thumbnails` table:

```python
class MediaThumbnail(Base):
    __tablename__ = 'media_thumbnails'

    id = Column(UUID, primary_key=True)
    media_file_id = Column(UUID, ForeignKey('media_files.id'))
    size_name = Column(String(50))      # 'small', 'medium', 'large'
    width = Column(Integer)              # Actual width
    height = Column(Integer)             # Actual height
    quality = Column(Integer)            # JPEG quality (default: 85)
    bucket_name = Column(String(100))
    object_key = Column(Text)
    storage_url = Column(Text)
    cdn_url = Column(Text)
    file_size_bytes = Column(Integer)
    format = Column(String(20))          # 'jpeg', 'png', 'webp'
    generated_at = Column(DateTime)
    generation_time_ms = Column(Integer)
    created_at = Column(DateTime)
```

### Relationships

- Each `MediaFile` has a one-to-many relationship with `MediaThumbnail`
- Thumbnails are loaded via `selectinload` for optimal query performance
- The relationship is defined in the MediaFile model:

```python
thumbnails = relationship("MediaThumbnail", back_populates="media_file")
```

---

## Statistics and Capacity

### Current Production Statistics

Based on the v4.5.12 deployment:

| Metric | Value |
|--------|-------|
| Original Images | 17,827 |
| Total Thumbnails | 53,481 |
| Thumbnails per Image | 3 (small, medium, large) |
| Generation Success Rate | 100% |
| Storage Directories | 256 (00-ff) |

### Scalability

The UUID sharding system is designed for significant scale:

- **Current Capacity**: Tested with 200,000+ products
- **Directory Distribution**: Even distribution across 256 subdirectories
- **Average Products per Shard**: ~780 products per subdirectory at 200k scale
- **File System Limit**: No practical limit with sharding (vs ~10,000 files/directory without)

---

## Performance Benefits

### Bandwidth Reduction

Thumbnails significantly reduce data transfer:

| Image Type | Typical Size | Reduction |
|------------|--------------|-----------|
| Original | 500KB - 2MB | Baseline |
| Large (800x800) | 50-100KB | 10-20x smaller |
| Medium (300x300) | 15-30KB | 30-60x smaller |
| Small (150x150) | 5-15KB | 50-100x smaller |

### Load Time Improvements

- **Product Grid Pages**: 3-5x faster initial load
- **Search Results**: Immediate thumbnail display
- **Mobile Experience**: Dramatically reduced data usage

---

## Configuration

### Automatic Processing

Thumbnail generation is automatic for:

- New product image uploads
- Code2ASIN image imports
- Bulk image migrations

### Celery Task

Batch thumbnail generation uses the Celery task:

```python
from celery_app import generate_media_thumbnails

# Queue thumbnail generation for a batch of media files
generate_media_thumbnails.delay(media_file_ids)
```

---

## Troubleshooting

### Missing Thumbnails

If thumbnails are not appearing:

1. Check if the original image exists in MinIO storage
2. Verify the MediaThumbnail records exist in the database
3. Check Celery worker logs for generation errors
4. Re-trigger thumbnail generation via admin tools

### Slow Loading

If thumbnails load slowly:

1. Verify CDN configuration is active
2. Check browser caching headers
3. Ensure the correct thumbnail size is being requested
4. Monitor MinIO/storage server performance

---

## Related Documentation

- [Centralisation des Imports](/docs/features/import-centralisation) - Import products with images
- [API Reference](/docs/api/endpoints) - Complete API documentation
- [Architecture Technique](/docs/technical/architecture) - System architecture overview
