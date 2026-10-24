import React from 'react';
import { 
  X, 
  Check, 
  Truck, 
  ShieldCheck, 
  ArrowUpRight,
  Package,
  Layers
} from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  onBuy
}) {
  if (!product) return null;

  const isOutOfStock = Number(product.stock_quantity) <= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '660px' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">{product.category || 'Gear'}</span>
            {product.badge && (
              <span className="badge badge-outline">{product.badge}</span>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Media */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)',
            maxHeight: '280px',
            background: '#000000'
          }}>
            <img 
              src={product.cover_image} 
              alt={product.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.9)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#ffffff'
            }}>
              SKU: {product.sku || 'TBP-PROD'}
            </div>
          </div>

          {/* Title & Tagline */}
          <h2 style={{ fontSize: '1.45rem', marginBottom: '6px', color: '#ffffff' }}>
            {product.title}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
            {product.tagline}
          </p>

          {/* Physical Specifications Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ background: '#121215', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Material</div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>{product.materials || 'Aluminum & Steel'}</div>
            </div>

            <div style={{ background: '#121215', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Dimensions</div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>{product.dimensions || 'Standard'}</div>
            </div>

            <div style={{ background: '#121215', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Weight</div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>{product.weight || 'N/A'}</div>
            </div>

            <div style={{ background: '#121215', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Stock Level</div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>
                {isOutOfStock ? '0 units (Sold Out)' : `${product.stock_quantity} available`}
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div style={{
              background: '#0f0f12',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: 1.6
            }}>
              {product.description}
            </div>
          )}

          {/* Features / Package Contents List */}
          {Array.isArray(product.features) && product.features.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: '10px', fontWeight: 600 }}>
                Package Contents & Engineering Highlights
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '8px'
              }}>
                {product.features.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      color: '#ffffff'
                    }}
                  >
                    <Check size={13} color="#ffffff" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Checkout Box */}
          <div style={{
            background: '#121215',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Physical Delivery Price
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.original_price && (
                  <span style={{ fontSize: '0.95rem', textDecoration: 'line-through', color: 'var(--text-dim)' }}>
                    ₹{Number(product.original_price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Truck size={13} color="#ffffff" />
                Free Express Delivery across India ({product.shipping_time || '2-4 days'})
              </div>
            </div>

            <div>
              <button 
                className="btn btn-primary btn-lg"
                disabled={isOutOfStock}
                onClick={() => {
                  onClose();
                  onBuy(product);
                }}
              >
                {isOutOfStock ? 'Sold Out' : 'Enter Delivery Address'}
                {!isOutOfStock && <ArrowUpRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
