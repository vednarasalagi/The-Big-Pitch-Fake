import { getRazorpayKey } from './supabaseClient';

/**
 * Loads Razorpay script if not already present on window
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Directly opens Razorpay's official checkout portal for physical goods payment
 */
export const initiateRazorpayPayment = async ({
  product,
  user,
  onSuccess,
  onError,
  onCancel,
  customKey
}) => {
  const activeKey = customKey || getRazorpayKey() || import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!activeKey) {
    const err = new Error('Razorpay Key ID is not configured. Please add VITE_RAZORPAY_KEY_ID in .env or the Admin Panel.');
    if (onError) onError(err);
    return { type: 'error', error: err };
  }

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    const err = new Error('Could not connect to Razorpay payment gateway. Please check your internet connection.');
    if (onError) onError(err);
    return { type: 'error', error: err };
  }

  try {
    const options = {
      key: activeKey,
      amount: Math.round(Number(product.price) * 100), // amount in paise (1 INR = 100 paise)
      currency: 'INR',
      name: 'THE BIG PITCH',
      description: `${product.title} (${product.sku || 'Physical Asset'})`,
      image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=128&q=80',
      prefill: {
        name: user?.name || (user?.email ? user.email.split('@')[0] : 'Customer'),
        email: user?.email || '',
        contact: user?.phone || user?.contact || ''
      },
      notes: {
        productId: product.id,
        sku: product.sku || '',
        shippingAddress: user?.address || ''
      },
      theme: {
        color: '#000000',
        backdrop_color: 'rgba(0, 0, 0, 0.9)'
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          if (onCancel) onCancel();
        }
      },
      handler: (response) => {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || `order_${Math.random().toString(36).substring(2, 10)}`,
          razorpay_signature: response.razorpay_signature || '',
          product,
          amount: product.price
        });
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      if (onError) {
        onError(new Error(response.error?.description || 'Razorpay payment was declined or failed.'));
      }
    });

    rzp.open();
    return { type: 'razorpay_portal', instance: rzp };
  } catch (err) {
    console.error('Razorpay invocation exception:', err);
    if (onError) onError(err);
    return { type: 'error', error: err };
  }
};
