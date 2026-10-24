import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function ShippingCheckoutModal({
  isOpen,
  product,
  currentUser,
  onClose,
  onSubmitAddressAndPay
}) {
  const [shippingData, setShippingData] = useState({
    name: currentUser?.email ? currentUser.email.split('@')[0] : '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [validationError, setValidationError] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!shippingData.name.trim()) {
      setValidationError('Please enter recipient full name.');
      return;
    }
    if (!shippingData.phone.trim() || shippingData.phone.trim().length < 10) {
      setValidationError('Please enter a valid 10-digit contact phone number for courier delivery.');
      return;
    }
    if (!shippingData.address.trim()) {
      setValidationError('Please enter full street delivery address.');
      return;
    }
    if (!shippingData.city.trim() || !shippingData.state.trim() || !shippingData.pincode.trim()) {
      setValidationError('Please fill in city, state, and 6-digit postal PIN code.');
      return;
    }

    onSubmitAddressAndPay({
      product,
      shipping: shippingData
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>Shipping & Delivery Details</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              We deliver pan-India via express insured courier
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Order Preview */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            background: '#121215',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px'
          }}>
            <img 
              src={product.cover_image} 
              alt={product.title} 
              style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover', filter: 'grayscale(100%)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Free Express Delivery • {product.shipping_time || '2-4 business days'}
              </div>
            </div>
            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>
          </div>

          {validationError && (
            <div style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#18181b',
              border: '1px solid #ffffff',
              color: '#ffffff',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Recipient Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Full Name"
                    value={shippingData.name}
                    onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="+91 98765 43210"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Street Address *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} color="#71717a" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <textarea
                  className="form-textarea"
                  style={{ paddingLeft: '36px', minHeight: '75px' }}
                  placeholder="Flat / Floor / Building name, Street, Landmark"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Mumbai, Bengaluru..."
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Maharashtra, Delhi..."
                  value={shippingData.state}
                  onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN Code *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="400001"
                  value={shippingData.pincode}
                  onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
              marginTop: '4px',
              marginBottom: '18px'
            }}>
              <ShieldCheck size={14} color="#ffffff" />
              <span>Free insured courier dispatch • Live SMS & Email tracking updates</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Continue to Razorpay (₹{Number(product.price).toLocaleString('en-IN')})
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
