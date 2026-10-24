import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Database, 
  CreditCard, 
  Key, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldAlert,
  Save,
  CheckCircle2
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  getRazorpayKey, 
  getAdminPasscode,
  saveRuntimeConfig 
} from '../lib/supabaseClient';

export default function SettingsModal({ isOpen, onClose, onConfigSaved, onNotify }) {
  const currentEnvUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const currentEnvKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    return localStorage.getItem('tbp_supabase_url') || currentEnvUrl;
  });
  const [supabaseKey, setSupabaseKey] = useState(() => {
    return localStorage.getItem('tbp_supabase_key') || currentEnvKey;
  });
  const [razorpayKey, setRazorpayKey] = useState(() => {
    return localStorage.getItem('tbp_razorpay_key') || getRazorpayKey();
  });
  const [adminPass, setAdminPass] = useState(() => {
    return localStorage.getItem('tbp_admin_pass') || getAdminPasscode();
  });

  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleSave = (e) => {
    e.preventDefault();
    saveRuntimeConfig({
      supabaseUrl,
      supabaseAnonKey: supabaseKey,
      razorpayKeyId: razorpayKey,
      adminPasscode: adminPass
    });
    onNotify('Configuration saved! Reloading to apply changes...', 'success');
    if (onConfigSaved) onConfigSaved();
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleCopySqlInfo = () => {
    navigator.clipboard.writeText(`See supabase/schema.sql in your workspace directory for the full SQL schema.`);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={20} color="#818cf8" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Backend & Payment Setup</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Banner */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: isConfigured ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isConfigured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isConfigured ? '#10b981' : '#f59e0b',
              boxShadow: `0 0 10px ${isConfigured ? '#10b981' : '#f59e0b'}`
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: isConfigured ? '#6ee7b7' : '#fcd34d', fontSize: '0.92rem' }}>
                {isConfigured ? 'Supabase Live Connected' : 'Running in Interactive Demo Mode'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isConfigured 
                  ? 'Your database and email/password authentication are fully hooked up to live Supabase.' 
                  : 'Products and orders are currently stored in browser state. Enter your Supabase credentials below to connect your real database.'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            {/* Supabase Section */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={16} color="#34d399" />
                  Supabase Backend Configuration
                </h4>
                <a 
                  href="https://app.supabase.com" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.78rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  Supabase Dashboard <ExternalLink size={12} />
                </a>
              </div>

              <div className="form-group">
                <label className="form-label">Project URL (VITE_SUPABASE_URL)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Anon / Public API Key (VITE_SUPABASE_ANON_KEY)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}>
                <span>Need database tables? Run the SQL script from <code>supabase/schema.sql</code></span>
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary" 
                  onClick={handleCopySqlInfo}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {copiedSql ? <Check size={12} /> : <Copy size={12} />}
                  {copiedSql ? 'Copied' : 'Schema Info'}
                </button>
              </div>
            </div>

            {/* Razorpay Section */}
            <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} color="#60a5fa" />
                  Razorpay Payment Gateway
                </h4>
                <a 
                  href="https://dashboard.razorpay.com/#/app/keys" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.78rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  Razorpay Keys <ExternalLink size={12} />
                </a>
              </div>

              <div className="form-group">
                <label className="form-label">Key ID (rzp_test_... or rzp_live_...)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="rzp_test_yourkeyid"
                  value={razorpayKey}
                  onChange={(e) => setRazorpayKey(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Default sandbox testing key is pre-wired for instant demo checkouts.
                </span>
              </div>
            </div>

            {/* Admin Security Section */}
            <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Key size={16} color="#fbbf24" />
                Admin Catalog Passcode
              </h4>

              <div className="form-group">
                <label className="form-label">Portal Passcode</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="pitchadmin2026"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                Save & Apply Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
