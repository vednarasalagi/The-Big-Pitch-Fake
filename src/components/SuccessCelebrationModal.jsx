import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Truck, 
  X, 
  PackageCheck,
  MapPin
} from 'lucide-react';

export default function SuccessCelebrationModal({
  order,
  isOpen,
  onClose,
  onOpenOrders
}) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1aa', '#71717a']
        });
      } catch (e) {
        // fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', textAlign: 'center' }}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          style={{ position: 'absolute', right: '14px', top: '14px' }}
        >
          <X size={18} />
        </button>

        <div className="modal-body" style={{ padding: '32px 24px' }}>
          {/* Monochrome Check Badge */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <Check size={30} strokeWidth={3} />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <span className="badge badge-primary">
              Order Confirmed & Payment Verified
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#ffffff' }}>
            Order Placed Successfully!
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            We are preparing your shipment for <strong>{order.product_title}</strong>.
          </p>

          {/* Receipt Info */}
          <div style={{
            background: '#121215',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: '20px',
            textAlign: 'left',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-dim)' }}>Payment Reference:</span>
              <code style={{ color: '#ffffff' }}>{order.razorpay_payment_id}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-dim)' }}>Amount Paid:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>₹{Number(order.amount).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-dim)' }}>Recipient:</span>
              <span style={{ color: '#ffffff' }}>{order.shipping_name} ({order.shipping_phone})</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '4px' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.74rem', marginBottom: '2px' }}>Shipping Address:</div>
              <div style={{ color: '#ffffff' }}>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <Truck size={16} color="#ffffff" style={{ flexShrink: 0 }} />
            <span>You will receive an SMS and email notification with your tracking number once the courier picks up the package.</span>
          </div>

          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={() => {
              onClose();
              onOpenOrders();
            }}
          >
            <PackageCheck size={15} />
            Track in My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
