import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ShippingCheckoutModal from './components/ShippingCheckoutModal';
import AuthModal from './components/AuthModal';
import AdminPortal from './components/AdminPortal';
import OrdersModal from './components/OrdersModal';
import LegalPages from './components/LegalPages';
import SuccessCelebrationModal from './components/SuccessCelebrationModal';
import { CATEGORIES } from './data/defaultProducts';
import { 
  supabase,
  getActiveUser, 
  signOutUser, 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  recordOrder, 
  fetchOrders,
  isSupabaseConfigured,
  checkIsAdmin
} from './lib/supabaseClient';
import { initiateRazorpayPayment } from './lib/razorpay';
import { 
  ArrowUpDown, 
  Check, 
  AlertCircle, 
  X,
  ShoppingBag
} from 'lucide-react';

export default function App() {
  // Navigation & Core State
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'admin' | 'legal'
  const [legalTab, setLegalTab] = useState('privacy'); // 'privacy' | 'terms' | 'shipping' | 'refunds' | 'contact'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_low' | 'price_high'

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [shippingProduct, setShippingProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
  const [celebrationOrder, setCelebrationOrder] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const isAdmin = useMemo(() => {
    return checkIsAdmin(currentUser);
  }, [currentUser]);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const user = await getActiveUser();
      setCurrentUser(user);

      const prods = await fetchProducts();
      setProducts(prods);

      if (user) {
        const userOrds = await fetchOrders(user.id, user.email);
        setOrders(userOrds);
      } else {
        const localOrds = await fetchOrders(null, null);
        setOrders(localOrds);
      }
    } catch (err) {
      console.error('Data loading error:', err);
      addToast('Error loading records: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          const userOrds = await fetchOrders(session.user.id, session.user.email);
          setOrders(userOrds);
        } else {
          setCurrentUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Filtered Products
  const visibleProducts = useMemo(() => {
    let result = products.filter((p) => p.is_active !== false);

    if (selectedCategory !== 'All Products') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Start Order Flow
  const handleStartOrder = (product) => {
    if (!currentUser) {
      setShippingProduct(product);
      setIsAuthOpen(true);
      addToast('Please sign in to continue with your delivery address', 'info');
      return;
    }
    setShippingProduct(product);
  };

  // User submitted address -> Trigger Razorpay Gateway Portal
  const handleProceedToRazorpay = async ({ product, shipping }) => {
    setShippingProduct(null);
    setPendingCheckoutData({ product, shipping });

    addToast('Opening Razorpay Payment Portal...', 'info');

    await initiateRazorpayPayment({
      product,
      user: {
        ...currentUser,
        email: currentUser?.email || '',
        name: shipping.name,
        contact: shipping.phone,
        address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}`
      },
      onSuccess: async (paymentDetails) => {
        await handlePaymentSuccess({
          ...paymentDetails,
          shipping
        });
      },
      onError: (err) => {
        addToast(err.message || 'Payment was not completed', 'error');
      },
      onCancel: () => {
        addToast('Payment portal closed by user', 'info');
      }
    });
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const shipping = paymentDetails.shipping || pendingCheckoutData?.shipping || {
        name: currentUser?.email?.split('@')[0] || 'Customer',
        phone: '9876543210',
        address: 'Direct Delivery Address',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      };

      const orderPayload = {
        user_id: currentUser?.id || null,
        user_email: currentUser?.email || 'info.sigtrek@gmail.com',
        product_id: paymentDetails.product.id,
        product_title: paymentDetails.product.title,
        amount: paymentDetails.amount || paymentDetails.product.price,
        currency: 'INR',
        razorpay_payment_id: paymentDetails.razorpay_payment_id,
        razorpay_order_id: paymentDetails.razorpay_order_id,
        shipping_name: shipping.name,
        shipping_phone: shipping.phone,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_pincode: shipping.pincode,
        fulfillment_status: 'Processing'
      };

      const savedOrder = await recordOrder(orderPayload);
      setOrders((prev) => [savedOrder, ...prev]);
      setCelebrationOrder(savedOrder);

      // Decrement stock in UI
      setProducts((prev) =>
        prev.map((p) =>
          p.id === paymentDetails.product.id
            ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - 1) }
            : p
        )
      );

      addToast(`Payment verified! Order placed for ${paymentDetails.product.title}.`, 'success');
    } catch (err) {
      console.error('Order recording error:', err);
      addToast('Order record error: ' + err.message, 'error');
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    addToast(`Signed in as ${user.email}`, 'success');
    if (shippingProduct) {
      const prod = shippingProduct;
      setTimeout(() => {
        setShippingProduct(prod);
      }, 350);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    if (activeTab === 'admin') setActiveTab('catalog');
    addToast('Signed out', 'info');
  };

  const openLegalPolicy = (tabName) => {
    setLegalTab(tabName);
    setActiveTab('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product CRUD
  const handleAddProduct = async (productData) => {
    const created = await addProduct(productData);
    setProducts((prev) => [created, ...prev]);
  };

  const handleUpdateProduct = async (id, updates) => {
    const updated = await updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000' }}>
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.type === 'error' ? <AlertCircle size={16} color="#ffffff" /> : <Check size={16} color="#ffffff" />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button 
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onOpenOrders={() => setIsOrdersOpen(true)}
        ordersCount={orders.length}
      />

      {/* Main Content Router */}
      {activeTab === 'catalog' ? (
        <main style={{ flex: 1 }}>
          {/* Hero Section */}
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Storefront Section */}
          <section className="container" style={{ padding: '24px 24px 80px' }}>
            {/* Filter Bar & Sort */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '14px'
            }}>
              {/* Category Pills */}
              <div className="filter-bar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={14} color="#71717a" />
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
                >
                  <option value="featured">Featured Gear</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
              {visibleProducts.length} physical item{visibleProducts.length === 1 ? '' : 's'} in stock
              {selectedCategory !== 'All Products' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>

            {/* Products Grid */}
            {visibleProducts.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center', margin: '40px 0' }}>
                <ShoppingBag size={36} color="#71717a" style={{ margin: '0 auto 14px' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#ffffff' }}>No matching products</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 18px' }}>
                  Try another keyword or select a different category filter.
                </p>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All Products'); }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {visibleProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onOrderNow={(p) => handleStartOrder(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      ) : activeTab === 'admin' ? (
        /* Admin View */
        <AdminPortal
          products={products}
          orders={orders}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onRefreshData={loadData}
          onNotify={addToast}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : (
        /* Legal & Compliance Policies View */
        <LegalPages
          initialTab={legalTab}
          onBackToStore={() => setActiveTab('catalog')}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: '#000000',
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 0 32px',
        color: 'var(--text-dim)',
        fontSize: '0.82rem'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                THE BIG PITCH
              </div>
              <div>Physical equipment & executive gear for venture-backed founders.</div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>Razorpay Verified Merchant • Express Pan-India Delivery</span>
              {isAdmin && (
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={() => setActiveTab('admin')}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>

          {/* Compliance & Policy Links */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '18px',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px'
          }}>
            <button 
              onClick={() => openLegalPolicy('privacy')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => openLegalPolicy('terms')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => openLegalPolicy('shipping')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Shipping & Delivery Policy
            </button>
            <button 
              onClick={() => openLegalPolicy('refunds')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Cancellation & Refund Policy
            </button>
            <button 
              onClick={() => openLegalPolicy('contact')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Contact Us
            </button>
            <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              © {new Date().getFullYear()} THE BIG PITCH. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onBuy={(p) => handleStartOrder(p)}
        />
      )}

      {/* 2. Physical Shipping Address Modal */}
      {shippingProduct && (
        <ShippingCheckoutModal
          isOpen={Boolean(shippingProduct)}
          product={shippingProduct}
          currentUser={currentUser}
          onClose={() => setShippingProduct(null)}
          onSubmitAddressAndPay={handleProceedToRazorpay}
        />
      )}

      {/* 3. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 4. Customer Orders & Shipments Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onBrowseProducts={() => {
          setIsOrdersOpen(false);
          setActiveTab('catalog');
        }}
      />

      {/* 5. Success Celebration Modal */}
      <SuccessCelebrationModal
        order={celebrationOrder}
        isOpen={Boolean(celebrationOrder)}
        onClose={() => setCelebrationOrder(null)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />
    </div>
  );
}
