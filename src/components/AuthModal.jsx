import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Check,
  ShieldCheck
} from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../lib/supabaseClient';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const result = await signInWithEmail(email, password);
        const user = result.user || (result.data && result.data.user);
        onAuthSuccess(user);
        onClose();
      } else {
        const result = await signUpWithEmail(email, password);
        const user = result.user || (result.data && result.data.user);
        if (user) {
          setSuccessMsg('Account created successfully. Signing in...');
          setTimeout(() => {
            onAuthSuccess(user);
            onClose();
          }, 1000);
        } else {
          setSuccessMsg('Account registered. Check your email if confirmation is required.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Email & Password Authentication
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'signin' ? '#ffffff' : 'transparent',
                color: mode === 'signin' ? '#000000' : 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? '#000000' : 'var(--text-muted)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#18181b',
              border: '1px solid var(--border-strong)',
              color: '#ffffff',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#18181b',
              border: '1px solid #ffffff',
              color: '#ffffff',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <Check size={15} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@startup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
