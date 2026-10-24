import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  User, 
  LogOut, 
  PackageCheck,
  ArrowRight
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  isAdmin,
  onOpenAuth,
  onSignOut,
  onOpenOrders,
  ordersCount = 0
}) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => setActiveTab('catalog')}
          role="button"
          tabIndex={0}
        >
          <div className="logo-badge">
            <span style={{ fontWeight: 900, fontSize: '0.85rem' }}>BP</span>
          </div>
          <div>
            <h1 className="brand-title">THE BIG PITCH</h1>
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Catalog Tab */}
          <button 
            className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('catalog')}
          >
            <ShoppingBag size={15} />
            Products
          </button>

          {/* My Orders Tab */}
          <button 
            className="btn btn-sm btn-secondary"
            onClick={onOpenOrders}
            style={{ position: 'relative' }}
          >
            <PackageCheck size={15} />
            My Orders
            {ordersCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#ffffff',
                color: '#000000',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '9999px',
                border: '1px solid #000000'
              }}>
                {ordersCount}
              </span>
            )}
          </button>

          {/* Admin Panel - ONLY VISIBLE IF ACCOUNT HAS ADMIN ACCESS */}
          {isAdmin && currentUser?.email?.toLowerCase() !== 'test@gmail.com' && (
            <button 
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('admin')}
              style={{
                borderColor: activeTab === 'admin' ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'
              }}
            >
              <ShieldCheck size={15} />
              Admin Panel
            </button>
          )}

          {/* User Authentication Status */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: '#ffffff'
              }}>
                <User size={14} color="#a1a1aa" />
                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.email}
                </span>
                {isAdmin && (
                  <span style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    background: '#ffffff',
                    color: '#000000',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '3px'
                  }}>
                    Admin
                  </span>
                )}
              </div>
              <button 
                className="btn btn-sm btn-outline"
                onClick={onSignOut}
                title="Sign Out"
                style={{ padding: '7px 10px' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-sm btn-primary"
              onClick={onOpenAuth}
              style={{ marginLeft: '6px' }}
            >
              Sign In
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
