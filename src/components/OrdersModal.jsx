import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Phone, 
  PackageCheck,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function OrdersModal({
  isOpen,
  onClose,
  orders = [],
  onBrowseProducts
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>My Orders & Shipments</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Track physical deliveries and order fulfillment status
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <ShoppingBag size={22} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', color: '#ffffff' }}>No Orders Found</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto 20px' }}>
                You have not placed any hardware or physical gear orders yet.
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onBrowseProducts();
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((item, index) => (
                <div 
                  key={item.id || index}
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    background: '#121215',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Top Status Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {item.fulfillment_status === 'Delivered' ? (
                          <CheckCircle2 size={12} />
                        ) : item.fulfillment_status === 'Shipped' ? (
                          <Truck size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {item.fulfillment_status || 'Processing'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                      ₹{Number(item.amount).toLocaleString('en-IN')} Paid
                    </div>
                  </div>

                  {/* Title */}
                  <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '8px' }}>
                    {item.product_title || 'Physical Product'}
                  </h4>

                  {/* Tracking Info if shipped */}
                  {item.fulfillment_status === 'Shipped' && item.tracking_number && (
                    <div style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-medium)',
                      marginBottom: '12px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-dim)' }}>Carrier: </span>
                        <strong>{item.tracking_carrier || 'Blue Dart Express'}</strong>
                        <span style={{ margin: '0 8px', color: 'var(--text-dim)' }}>|</span>
                        <span style={{ color: 'var(--text-dim)' }}>AWB / Tracking: </span>
                        <code>{item.tracking_number}</code>
                      </div>
                      <span className="badge badge-outline">In Transit</span>
                    </div>
                  )}

                  {/* Delivery Address Details */}
                  <div style={{
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
                      <MapPin size={13} color="#ffffff" />
                      <span>Delivery Address:</span>
                    </div>
                    <div>{item.shipping_name || 'Customer'} • {item.shipping_phone}</div>
                    <div>{item.shipping_address}</div>
                    <div>{item.shipping_city}, {item.shipping_state} - {item.shipping_pincode}</div>
                    <div style={{ marginTop: '6px', color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                      Razorpay Ref: <code>{item.razorpay_payment_id}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: '20px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Truck size={16} color="#ffffff" style={{ flexShrink: 0 }} />
            <span>Orders are packed in tamper-proof security enclosures and dispatched via express air courier.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
