import { createClient } from '@supabase/supabase-js';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';

// Read configuration from environment or localStorage
const getConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const envRzp = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  const envAdminEmails = import.meta.env.VITE_ADMIN_EMAILS || 'admin@thebigpitch.com,admin@gmail.com';

  const localUrl = localStorage.getItem('tbp_supabase_url') || '';
  const localKey = localStorage.getItem('tbp_supabase_key') || '';
  const localRzp = localStorage.getItem('tbp_razorpay_key') || '';
  const localAdminEmails = localStorage.getItem('tbp_admin_emails') || '';

  const emailsList = (localAdminEmails || envAdminEmails)
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return {
    supabaseUrl: localUrl || envUrl,
    supabaseAnonKey: localKey || envKey,
    razorpayKeyId: localRzp || envRzp,
    adminEmails: emailsList
  };
};

export const currentConfig = getConfig();

export const isSupabaseConfigured = () => {
  const { supabaseUrl, supabaseAnonKey } = getConfig();
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://')
  );
};

export const getRazorpayKey = () => {
  return getConfig().razorpayKeyId;
};

export const getAdminEmails = () => {
  return getConfig().adminEmails;
};

export const checkIsAdmin = (user) => {
  if (!user || !user.email) return false;
  const adminEmails = getAdminEmails();
  const emailMatch = adminEmails.includes(user.email.toLowerCase());
  const roleMatch = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
  return Boolean(emailMatch || roleMatch);
};

export const saveRuntimeConfig = ({ supabaseUrl, supabaseAnonKey, razorpayKeyId, adminEmails }) => {
  if (supabaseUrl !== undefined) localStorage.setItem('tbp_supabase_url', supabaseUrl.trim());
  if (supabaseAnonKey !== undefined) localStorage.setItem('tbp_supabase_key', supabaseAnonKey.trim());
  if (razorpayKeyId !== undefined) localStorage.setItem('tbp_razorpay_key', razorpayKeyId.trim());
  if (adminEmails !== undefined) localStorage.setItem('tbp_admin_emails', adminEmails.trim());
};

const config = getConfig();
export const supabase = isSupabaseConfigured()
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

// ==============================================================================
// LOCAL STORAGE CACHE HELPERS
// ==============================================================================
const STORAGE_PRODUCTS_KEY = 'thebigpitch_physical_products_v2';
const STORAGE_ORDERS_KEY = 'thebigpitch_physical_orders_v2';
const STORAGE_USER_KEY = 'thebigpitch_active_user';

export const getLocalProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_PRODUCTS;
  }
};

export const setLocalProducts = (products) => {
  localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
};

export const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const saveLocalOrder = (order) => {
  const orders = getLocalOrders();
  const updated = [order, ...orders];
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateLocalOrder = (orderId, updates) => {
  const orders = getLocalOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
  return updated;
};

// ==============================================================================
// AUTHENTICATION (STRICTLY EMAIL & PASSWORD ONLY)
// ==============================================================================
export const signUpWithEmail = async (email, password) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  } else {
    const user = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      user_metadata: {
        role: getAdminEmails().includes(email.trim().toLowerCase()) ? 'admin' : 'customer'
      },
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return { user, session: { user } };
  }
};

export const signInWithEmail = async (email, password) => {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });
    if (error) throw error;
    return data;
  } else {
    const user = {
      id: 'usr-' + btoa(cleanEmail).substring(0, 8),
      email: cleanEmail,
      user_metadata: {
        role: getAdminEmails().includes(cleanEmail) ? 'admin' : 'customer'
      },
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return { user, session: { user } };
  }
};

export const signOutUser = async () => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  localStorage.removeItem(STORAGE_USER_KEY);
};

export const getActiveUser = async () => {
  if (isSupabaseConfigured() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ==============================================================================
// PRODUCTS API (PHYSICAL INVENTORY)
// ==============================================================================
export const fetchProducts = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setLocalProducts(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local cache:', err.message);
    }
  }
  return getLocalProducts();
};

export const addProduct = async (productData) => {
  const newProduct = {
    ...productData,
    id: isSupabaseConfigured() ? undefined : 'prod-' + Date.now(),
    is_active: productData.is_active ?? true,
    stock_quantity: parseInt(productData.stock_quantity, 10) || 0,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    
    const current = getLocalProducts();
    setLocalProducts([data, ...current]);
    return data;
  } else {
    const current = getLocalProducts();
    const updated = [newProduct, ...current];
    setLocalProducts(updated);
    return newProduct;
  }
};

export const updateProduct = async (id, updates) => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, ...data } : p));
    setLocalProducts(updated);
    return data;
  } else {
    const current = getLocalProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setLocalProducts(updated);
    return updated.find((p) => p.id === id);
  }
};

export const deleteProduct = async (id) => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
  const current = getLocalProducts();
  const filtered = current.filter((p) => p.id !== id);
  setLocalProducts(filtered);
  return true;
};

export const syncDefaultCatalogToSupabase = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase credentials are required to sync to cloud database.');
  }

  const itemsToInsert = DEFAULT_PRODUCTS.map(({ id, ...rest }) => rest);

  const { data, error } = await supabase
    .from('products')
    .insert(itemsToInsert)
    .select();

  if (error) throw error;
  if (data) {
    setLocalProducts(data);
  }
  return data;
};

// ==============================================================================
// ORDERS & PHYSICAL DELIVERIES API
// ==============================================================================
export const recordOrder = async (orderPayload) => {
  const orderRecord = {
    ...orderPayload,
    id: isSupabaseConfigured() ? undefined : 'ord-' + Date.now(),
    currency: orderPayload.currency || 'INR',
    fulfillment_status: orderPayload.fulfillment_status || 'Processing',
    created_at: new Date().toISOString()
  };

  saveLocalOrder(orderRecord);

  // Decrement stock in local cache
  if (orderPayload.product_id) {
    const currentProds = getLocalProducts();
    const updatedProds = currentProds.map((p) => {
      if (p.id === orderPayload.product_id && p.stock_quantity > 0) {
        return { ...p, stock_quantity: p.stock_quantity - 1 };
      }
      return p;
    });
    setLocalProducts(updatedProds);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.error('Order recording exception:', e);
    }
  }

  return orderRecord;
};

export const updateOrderStatus = async (orderId, updates) => {
  updateLocalOrder(orderId, updates);

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.error('Order status update error:', e);
    }
  }

  return updates;
};

export const fetchOrders = async (userId, userEmail) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_email.eq.${userEmail}`);
      } else if (userEmail) {
        query = query.eq('user_email', userEmail);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('Orders query error:', err.message);
    }
  }

  const localOrders = getLocalOrders();
  if (userId || userEmail) {
    return localOrders.filter(
      (o) => (userId && o.user_id === userId) || (userEmail && o.user_email === userEmail)
    );
  }
  return localOrders;
};
