import React from 'react';
import { 
  X, 
  DownloadCloud, 
  ShoppingBag, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export default function PurchasedLibraryModal({
  isOpen,
  onClose,
  purchasedOrders = [],
  onBrowseCatalog
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>My Purchases</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Purchased digital assets and download links
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {purchasedOrders.length === 0 ? (
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
              <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', color: '#ffffff' }}>No Purchased Assets</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto 20px' }}>
                Purchased digital downloads will appear here with permanent access.
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onBrowseCatalog();
                }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {purchasedOrders.map((item, index) => (
                <div 
                  key={item.id || index}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: '#121215',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div style={{ flex: '1 1 280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-primary">
                        <FileCheck size={11} />
                        Licensed
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>
                      {item.product_title || 'Digital Asset'}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <span>Amount: <strong style={{ color: '#ffffff' }}>₹{Number(item.amount).toLocaleString('en-IN')}</strong></span>
                      {item.razorpay_payment_id && (
                        <span>
                          Ref: <code style={{ color: '#ffffff' }}>{item.razorpay_payment_id}</code>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {item.download_url ? (
                      <a 
                        href={item.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        <DownloadCloud size={14} />
                        Download
                      </a>
                    ) : (
                      <button className="btn btn-sm btn-secondary" disabled>
                        Pending Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: '24px',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={18} color="#ffffff" style={{ flexShrink: 0 }} />
            <div>
              <strong>Permanent Access:</strong> Assets purchased through Razorpay are saved to your account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
