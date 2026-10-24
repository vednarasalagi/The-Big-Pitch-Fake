import { getRazorpayKey } from './supabaseClient';

/**
 * Initiates Razorpay checkout for a digital product
 */
export const initiateRazorpayPayment = ({
  product,
  user,
  onSuccess,
  onError,
  onCancel,
  customKey
}) => {
  const activeKey = customKey || getRazorpayKey();

  if (typeof window !== 'undefined' && window.Razorpay && activeKey) {
    try {
      const options = {
        key: activeKey,
        amount: Math.round(product.price * 100),
        currency: 'INR',
        name: 'THE BIG PITCH',
        description: product.title,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=128&q=80',
        prefill: {
          name: user?.email ? user.email.split('@')[0] : '',
          email: user?.email || '',
          contact: ''
        },
        notes: {
          productId: product.id,
          fileType: product.file_type || 'DIGITAL'
        },
        theme: {
          color: '#000000'
        },
        modal: {
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

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', function (response) {
        if (onError) {
          onError(new Error(response.error?.description || 'Payment could not be completed'));
        }
      });

      rzpInstance.open();
      return { type: 'razorpay_native', instance: rzpInstance };
    } catch (err) {
      if (onError) onError(err);
      return { type: 'error', error: err };
    }
  } else {
    // If Razorpay Key is not set or SDK not loaded
    const err = new Error(activeKey ? 'Razorpay SDK is initializing. Please retry in a moment.' : 'Razorpay Key ID is not configured.');
    if (onError) onError(err);
    return { type: 'error', error: err };
  }
};
