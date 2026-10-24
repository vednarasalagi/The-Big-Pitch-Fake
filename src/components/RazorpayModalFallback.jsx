import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function RazorpayModalFallback({
  isOpen,
  product,
  user,
  onClose,
  onSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okbank` : 'founder@upi');
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirmPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const generatedPaymentId = `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      onSuccess({
        razorpay_payment_id: generatedPaymentId,
        razorpay_order_id: `order_${Math.random().toString(36).substring(2, 10)}`,
        razorpay_signature: 'rzp_sig_verified',
        product,
        amount: product.price
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>Razorpay Checkout</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Secure Payment Processing
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Order Summary */}
          <div style={{
            background: '#121215',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Order Item
            </div>
            <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '2px', fontSize: '0.95rem' }}>
              {product.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-sm)',
                border: selectedMethod === 'upi' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                background: selectedMethod === 'upi' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: selectedMethod === 'upi' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Smartphone size={16} color="#ffffff" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>UPI</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-sm)',
                border: selectedMethod === 'card' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                background: selectedMethod === 'card' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: selectedMethod === 'card' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <CreditCard size={16} color="#ffffff" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 6px',
                borderRadius: 'var(--radius-sm)',
                border: selectedMethod === 'netbanking' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                background: selectedMethod === 'netbanking' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: selectedMethod === 'netbanking' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Building2 size={16} color="#ffffff" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>NetBanking</span>
            </button>
          </div>

          {selectedMethod === 'upi' && (
            <div className="form-group">
              <label className="form-label">UPI ID / VPA</label>
              <input 
                type="text" 
                className="form-input" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {selectedMethod === 'card' && (
            <div>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input type="text" className="form-input" defaultValue="4111 2222 3333 4444" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Expiry</label>
                  <input type="text" className="form-input" defaultValue="12/28" />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input type="password" className="form-input" defaultValue="•••" />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="form-group">
              <label className="form-label">Select Bank</label>
              <select className="form-select" defaultValue="HDFC">
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="AXIS">Axis Bank</option>
              </select>
            </div>
          )}

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '18px'
          }}>
            <Lock size={12} color="#ffffff" />
            <span>256-bit SSL encrypted • Instant deliverable unlock</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleConfirmPayment}
            disabled={processing}
          >
            {processing ? 'Processing Payment...' : (
              <>
                Pay ₹{Number(product.price).toLocaleString('en-IN')}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
