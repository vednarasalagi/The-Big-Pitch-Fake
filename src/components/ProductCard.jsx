import React from 'react';
import { 
  ArrowUpRight, 
  Check, 
  Eye, 
  Truck
} from 'lucide-react';

export default function ProductCard({
  product,
  onQuickView,
  onOrderNow
}) {
  const isOutOfStock = Number(product.stock_quantity) <= 0;

  return (
    <div className="product-card">
      {/* Product Image Header */}
      <div className="product-image-wrap">
        <img 
          src={product.cover_image || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80'} 
          alt={product.title} 
          className="product-image"
          loading="lazy"
        />

        {/* Badge overlay */}
        {product.badge && (
          <div className="product-badge-overlay">
            <span className="badge badge-primary">
              {product.badge}
            </span>
          </div>
        )}

        {/* Stock status overlay */}
        <div className="product-format-overlay">
          {isOutOfStock ? (
            <span style={{ color: '#a1a1aa' }}>Out of Stock</span>
          ) : product.stock_quantity <= 10 ? (
            <span>Only {product.stock_quantity} Left</span>
          ) : (
            <span>In Stock</span>
          )}
        </div>
      </div>

      {/* Product Body */}
      <div className="product-body">
        {/* Category & Materials */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          <span>{product.category || 'Gear'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Truck size={12} />
            {product.shipping_time || '2-4 days'}
          </span>
        </div>

        {/* Title */}
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>

        {/* Tagline */}
        <p className="product-tagline">
          {product.tagline || (product.description ? product.description.substring(0, 90) + '...' : '')}
        </p>

        {/* Feature list preview */}
        {Array.isArray(product.features) && product.features.length > 0 && (
          <div className="product-features-preview">
            {product.features.slice(0, 3).map((feat, i) => (
              <div key={i} className="feature-item-inline">
                <Check size={12} color="#ffffff" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer with Price and Actions */}
        <div className="product-footer">
          <div className="price-box">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="price-current">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <span className="price-original">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.weight && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {product.weight}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => onQuickView(product)}
              title="View full product specifications"
              style={{ padding: '7px 10px' }}
            >
              <Eye size={14} />
            </button>

            <button 
              className="btn btn-sm btn-primary"
              onClick={() => onOrderNow(product)}
              disabled={isOutOfStock}
              style={{ opacity: isOutOfStock ? 0.5 : 1 }}
            >
              {isOutOfStock ? 'Sold Out' : 'Order Now'}
              {!isOutOfStock && <ArrowUpRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
