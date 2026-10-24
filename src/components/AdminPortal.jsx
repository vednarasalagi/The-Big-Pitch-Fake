import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  Lock, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Truck,
  MapPin,
  Save,
  ArrowRight,
  Send,
  Boxes
} from 'lucide-react';
import { 
  saveRuntimeConfig, 
  syncDefaultCatalogToSupabase,
  isSupabaseConfigured,
  getRazorpayKey,
  updateOrderStatus
} from '../lib/supabaseClient';

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Presenter Clicker', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Leather Journal', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Condenser Mic', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Founder Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Laptop Stand', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Desk Pad', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80' }
];

export default function AdminPortal({
  products,
  orders,
  currentUser,
  isAdmin,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRefreshData,
  onNotify,
  onOpenAuth
}) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'shipments' | 'config'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [syncingDb, setSyncingDb] = useState(false);

  // Dispatch modal
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [carrierInput, setCarrierInput] = useState('Blue Dart Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Config
  const [configUrl, setConfigUrl] = useState(() => localStorage.getItem('tbp_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [configKey, setConfigKey] = useState(() => localStorage.getItem('tbp_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [configRzp, setConfigRzp] = useState(() => localStorage.getItem('tbp_razorpay_key') || getRazorpayKey() || '');
  const [configAdmins, setConfigAdmins] = useState(() => localStorage.getItem('tbp_admin_emails') || import.meta.env.VITE_ADMIN_EMAILS || '');

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Hardware & Tech',
    price: '',
    original_price: '',
    stock_quantity: 25,
    sku: 'TBP-HW-101',
    materials: 'Aerospace Anodized Aluminum',
    dimensions: '130 x 30 x 15 mm',
    weight: '120 grams',
    shipping_time: '2-3 business days',
    cover_image: SAMPLE_IMAGE_PRESETS[0].url,
    badge: 'Popular',
    featuresText: '',
    is_active: true
  });

  if (!currentUser || !isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 24px', maxWidth: '480px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '40px 30px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-medium)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <Lock size={22} />
          </div>
          <h2 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#ffffff' }}>Administrator Access Required</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px', lineHeight: 1.5 }}>
            This portal is restricted to authorized administrative accounts. Please sign in with an account that has admin privileges.
          </p>

          {!currentUser ? (
            <button 
              className="btn btn-primary"
              onClick={onOpenAuth}
              style={{ width: '100%' }}
            >
              Sign In to Admin Account
              <ArrowRight size={15} />
            </button>
          ) : (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: '#121215',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-dim)'
            }}>
              Current account: <strong style={{ color: '#ffffff' }}>{currentUser.email}</strong> does not have admin permissions.
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      tagline: '',
      description: '',
      category: 'Hardware & Tech',
      price: '',
      original_price: '',
      stock_quantity: 30,
      sku: `TBP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      materials: 'Aerospace Aluminum & Alloy',
      dimensions: '140 x 50 x 20 mm',
      weight: '150 grams',
      shipping_time: '2-3 business days',
      cover_image: SAMPLE_IMAGE_PRESETS[0].url,
      badge: 'New',
      featuresText: 'High-precision engineering\n1-Year Replacement Warranty\nExpress Pan-India Delivery',
      is_active: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title || '',
      tagline: prod.tagline || '',
      description: prod.description || '',
      category: prod.category || 'Hardware & Tech',
      price: prod.price || '',
      original_price: prod.original_price || '',
      stock_quantity: prod.stock_quantity ?? 25,
      sku: prod.sku || '',
      materials: prod.materials || '',
      dimensions: prod.dimensions || '',
      weight: prod.weight || '',
      shipping_time: prod.shipping_time || '2-3 business days',
      cover_image: prod.cover_image || SAMPLE_IMAGE_PRESETS[0].url,
      badge: prod.badge || '',
      featuresText: Array.isArray(prod.features) ? prod.features.join('\n') : '',
      is_active: prod.is_active !== false
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Please fill in Title and Price.');
      return;
    }

    const featuresArray = formData.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
      sku: formData.sku,
      materials: formData.materials,
      dimensions: formData.dimensions,
      weight: formData.weight,
      shipping_time: formData.shipping_time,
      cover_image: formData.cover_image,
      badge: formData.badge,
      features: featuresArray,
      is_active: formData.is_active
    };

    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
        onNotify('Product inventory updated', 'success');
      } else {
        await onAddProduct(payload);
        onNotify('New physical product added to catalog', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      onNotify('Failed to save product: ' + err.message, 'error');
    }
  };

  const handleToggleActive = async (prod) => {
    try {
      await onUpdateProduct(prod.id, { is_active: !prod.is_active });
      onNotify(`Status updated to ${!prod.is_active ? 'Active' : 'Draft'}`, 'success');
    } catch (err) {
      onNotify('Error updating status: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete product "${title}" from warehouse catalog?`)) {
      try {
        await onDeleteProduct(id);
        onNotify('Product removed from catalog', 'success');
      } catch (err) {
        onNotify('Error deleting product: ' + err.message, 'error');
      }
    }
  };

  const handleDispatchOrder = async (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;
    try {
      await updateOrderStatus(dispatchModalOrder.id, {
        fulfillment_status: 'Shipped',
        tracking_carrier: carrierInput,
        tracking_number: trackingNumberInput || `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`
      });
      onNotify(`Order marked as Shipped via ${carrierInput}`, 'success');
      setDispatchModalOrder(null);
      setTrackingNumberInput('');
      onRefreshData();
    } catch (err) {
      onNotify('Failed to update shipment: ' + err.message, 'error');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await updateOrderStatus(orderId, { fulfillment_status: 'Delivered' });
      onNotify('Order marked as Delivered', 'success');
      onRefreshData();
    } catch (err) {
      onNotify('Failed to update: ' + err.message, 'error');
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    saveRuntimeConfig({
      supabaseUrl: configUrl,
      supabaseAnonKey: configKey,
      razorpayKeyId: configRzp,
      adminEmails: configAdmins
    });
    onNotify('Configuration saved. Reloading...', 'success');
    setTimeout(() => window.location.reload(), 700);
  };

  const handleSyncSupabase = async () => {
    setSyncingDb(true);
    try {
      await syncDefaultCatalogToSupabase();
      onNotify('Default catalog synced to Supabase products table', 'success');
      onRefreshData();
    } catch (err) {
      onNotify('Supabase sync error: ' + err.message, 'error');
    } finally {
      setSyncingDb(false);
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const totalStockUnits = products.reduce((sum, p) => sum + (Number(p.stock_quantity) || 0), 0);
  const pendingShipments = orders.filter((o) => o.fulfillment_status === 'Processing').length;

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-primary">Admin Control</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Logged in as {currentUser.email}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', color: '#ffffff' }}>Physical Inventory & Orders</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onRefreshData}
            title="Refresh records"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleOpenAdd}
          >
            <Plus size={15} />
            Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Active Catalog</span>
            <Package size={18} color="#ffffff" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {products.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Physical product SKUs
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Total Units in Stock</span>
            <Boxes size={18} color="#ffffff" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {totalStockUnits}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Warehouse inventory
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Awaiting Shipment</span>
            <Truck size={18} color="#ffffff" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {pendingShipments}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Orders to dispatch
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Gross Revenue</span>
            <CreditCard size={18} color="#ffffff" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Settled Razorpay payments
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        paddingBottom: '10px'
      }}>
        <button
          className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('catalog')}
        >
          Catalog Inventory ({products.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'shipments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('shipments')}
        >
          Customer Shipments ({orders.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'config' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('config')}
        >
          API & Settings
        </button>
      </div>

      {/* TAB 1: CATALOG INVENTORY */}
      {activeTab === 'catalog' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>SKU</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Stock</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No physical products in warehouse catalog. Click "Add Product" to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={prod.cover_image} 
                            alt={prod.title} 
                            style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', filter: 'grayscale(100%)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#ffffff', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prod.title}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prod.tagline}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <code style={{ fontSize: '0.75rem', color: '#ffffff' }}>{prod.sku || 'N/A'}</code>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span className="badge badge-outline">{prod.category}</span>
                      </td>

                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#ffffff' }}>
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ 
                          fontWeight: 600,
                          color: prod.stock_quantity <= 5 ? '#a1a1aa' : '#ffffff' 
                        }}>
                          {prod.stock_quantity} units
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <button
                          onClick={() => handleToggleActive(prod)}
                          style={{
                            border: '1px solid var(--border-medium)',
                            background: prod.is_active ? '#ffffff' : 'transparent',
                            color: prod.is_active ? '#000000' : 'var(--text-dim)',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {prod.is_active ? 'Active' : 'Draft'}
                        </button>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleOpenEdit(prod)}
                            style={{ padding: '6px 8px' }}
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(prod.id, prod.title)}
                            style={{ padding: '6px 8px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SHIPMENTS & CUSTOMER ADDRESSES */}
      {activeTab === 'shipments' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Order ID / Payment</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Recipient & Shipping Address</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 18px', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'right' }}>Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No physical orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord, idx) => (
                    <tr key={ord.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <code style={{ color: '#ffffff', fontSize: '0.78rem' }}>{ord.razorpay_payment_id}</code>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 600 }}>
                        {ord.product_title}
                      </td>

                      <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div style={{ color: '#ffffff', fontWeight: 600 }}>{ord.shipping_name} ({ord.shipping_phone})</div>
                        <div>{ord.shipping_address}</div>
                        <div>{ord.shipping_city}, {ord.shipping_state} - {ord.shipping_pincode}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Buyer: {ord.user_email}</div>
                      </td>

                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#ffffff' }}>
                        ₹{Number(ord.amount).toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span className="badge badge-primary">
                          {ord.fulfillment_status || 'Processing'}
                        </span>
                        {ord.tracking_number && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                            {ord.tracking_carrier}: <code>{ord.tracking_number}</code>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {ord.fulfillment_status !== 'Shipped' && ord.fulfillment_status !== 'Delivered' && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setDispatchModalOrder(ord);
                                setTrackingNumberInput(`AWB-${Math.floor(100000000 + Math.random() * 900000000)}`);
                              }}
                              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                            >
                              <Truck size={13} />
                              Dispatch
                            </button>
                          )}

                          {ord.fulfillment_status === 'Shipped' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleMarkDelivered(ord.id)}
                              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                            >
                              <Check size={13} />
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: API & SETTINGS */}
      {activeTab === 'config' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', color: '#ffffff' }}>
              Credentials & Admin Configuration
            </h3>

            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label className="form-label">Supabase URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://xyz.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Supabase Anon Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Razorpay Key ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="rzp_live_... or rzp_test_..."
                  value={configRzp}
                  onChange={(e) => setConfigRzp(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Authorized Admin Emails (Comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="info.sigtrek@gmail.com, yourname@company.com"
                  value={configAdmins}
                  onChange={(e) => setConfigAdmins(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  Save Credentials
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: '#ffffff' }}>Supabase Database Sync</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
              Push the physical product catalog to your connected Supabase <code>products</code> table.
            </p>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleSyncSupabase}
              disabled={syncingDb}
            >
              <RefreshCw size={14} className={syncingDb ? 'spin' : ''} />
              {syncingDb ? 'Syncing...' : 'Sync Physical Catalog to Supabase'}
            </button>
          </div>
        </div>
      )}

      {/* DISPATCH ORDER MODAL */}
      {dispatchModalOrder && (
        <div className="modal-overlay" onClick={() => setDispatchModalOrder(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>Dispatch Order</h3>
              <button className="modal-close-btn" onClick={() => setDispatchModalOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Dispatching <strong>{dispatchModalOrder.product_title}</strong> to <strong>{dispatchModalOrder.shipping_name}</strong> at <strong>{dispatchModalOrder.shipping_city}</strong>.
              </div>

              <form onSubmit={handleDispatchOrder}>
                <div className="form-group">
                  <label className="form-label">Courier Carrier</label>
                  <select 
                    className="form-select"
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                  >
                    <option value="Blue Dart Express">Blue Dart Express</option>
                    <option value="Delhivery Surface / Air">Delhivery Surface / Air</option>
                    <option value="DTDC Premium">DTDC Premium</option>
                    <option value="FedEx India">FedEx India</option>
                    <option value="Speed Post EMS">Speed Post EMS</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">AWB / Courier Tracking Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="BLD-894372982"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setDispatchModalOrder(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Send size={14} />
                    Confirm Shipment & Mark Dispatched
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>
                {editingProduct ? 'Edit Physical Product' : 'Add Physical Product'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Tagline *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Hardware & Tech">Hardware & Tech</option>
                      <option value="Executive Stationery">Executive Stationery</option>
                      <option value="Founder Apparel">Founder Apparel</option>
                      <option value="Desk & Studio">Desk & Studio</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">SKU Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Price (INR ₹) *</label>
                    <input
                      type="number"
                      step="any"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Original Price (₹)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-input"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Materials</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Anodized 6063 Aluminum"
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weight</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 85 grams"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 132 x 28 x 14 mm"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shipping Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="2-3 business days"
                      value={formData.shipping_time}
                      onChange={(e) => setFormData({ ...formData, shipping_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {SAMPLE_IMAGE_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_image: p.url })}
                        style={{
                          fontSize: '0.7rem',
                          background: formData.cover_image === p.url ? '#ffffff' : 'transparent',
                          color: formData.cover_image === p.url ? '#000000' : 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Engineering Features (One per line)</label>
                  <textarea
                    className="form-textarea"
                    value={formData.featuresText}
                    onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                    rows={3}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0' }}>
                  <input
                    type="checkbox"
                    id="is_active_flag"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{ accentColor: '#ffffff', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="is_active_flag" style={{ fontSize: '0.84rem', color: '#ffffff', cursor: 'pointer' }}>
                    Active & Available for Ordering
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={14} />
                    {editingProduct ? 'Save Inventory' : 'Add to Inventory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
