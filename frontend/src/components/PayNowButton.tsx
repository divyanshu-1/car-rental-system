import React, { useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../api';
import { loadRazorpayScript } from '../utils/loadRazorpayScript';
import type { RazorpayOptions } from '../types';

interface PayNowButtonProps {
  amount: number;
  rentalId: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
  buttonText?: string;
  className?: string;
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({
  amount,
  rentalId,
  customerName = 'Valued Customer',
  customerEmail = '',
  customerPhone = '',
  onPaymentSuccess,
  onPaymentError,
  buttonText = 'Pay Now with Razorpay',
  className = 'btn btn-primary',
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePayNow = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. Dynamically load Razorpay SDK script
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // 2. Create Razorpay order via backend API
      const orderResponse = await createPaymentOrder(amount, rentalId);
      if (!orderResponse || !orderResponse.orderId) {
        throw new Error('Failed to create Razorpay Order from server.');
      }

      const keyId = orderResponse.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TQKjlHuIVZzU58';

      // 3. Configure Razorpay options
      const options: RazorpayOptions = {
        key: keyId,
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        name: 'Car Rental Service',
        description: `Rental #${rentalId} Payment`,
        order_id: orderResponse.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response) => {
          try {
            setLoading(true);
            // 4. Send payment response to backend for signature verification
            const verifyRes = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              rentalId,
              amount,
            });

            if (verifyRes.status === 'SUCCESS') {
              setSuccessMessage('Payment verified successfully! Status: PAID');
              if (onPaymentSuccess) {
                onPaymentSuccess();
              }
            } else {
              const msg = verifyRes.message || 'Payment verification failed.';
              setErrorMessage(msg);
              if (onPaymentError) {
                onPaymentError(msg);
              }
            }
          } catch (err: any) {
            const msg = err?.message || 'Error verifying payment signature with server.';
            setErrorMessage(msg);
            if (onPaymentError) {
              onPaymentError(msg);
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setErrorMessage('Payment cancelled or window closed.');
          },
        },
      };

      // 4. Open Razorpay Checkout Popup
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const msg = err?.message || 'Payment initiation failed. Please try again.';
      setErrorMessage(msg);
      if (onPaymentError) {
        onPaymentError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button
        type="button"
        className={className}
        onClick={handlePayNow}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <>
            <span className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff' }}></span>
            Processing...
          </>
        ) : (
          <>
            💳 {buttonText} (₹{amount})
          </>
        )}
      </button>

      {errorMessage && (
        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.2rem' }}>
          ⚠️ {errorMessage}
        </span>
      )}

      {successMessage && (
        <span style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.2rem', fontWeight: 600 }}>
          ✅ {successMessage}
        </span>
      )}
    </div>
  );
};

export default PayNowButton;
