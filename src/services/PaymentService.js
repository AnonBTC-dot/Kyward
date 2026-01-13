// KYWARD PAYMENT SERVICE
// Handles Bitcoin payment processing via backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Payment configuration
const PAYMENT_CONFIG = {
  prices: {
    complete: 7.99, // $7.99 USD/month subscription
    consultation: 99, // $99 USD first session
    consultationAdditional: 49 // $49 USD additional sessions
  },
  pollInterval: 5000, // Check payment status every 5 seconds
  maxPollAttempts: 360 // Poll for max 30 minutes
};

// Get price display text
export const getPriceDisplay = (plan) => {
  switch (plan) {
    case 'complete':
      return { amount: '$7.99', description: 'Complete Plan - Monthly subscription', isSubscription: true };
    case 'consultation':
      return { amount: '$99', description: 'Consultation - 1 hour session', additionalPrice: '$49/hr' };
    case 'consultation_additional':
      return { amount: '$49', description: 'Additional Consultation - 1 hour session' };
    default:
      return { amount: '$0', description: 'Free Plan' };
  }
};

/**
 * Create a new Bitcoin payment request
 * Returns payment address and QR code data
 */
export const createPayment = async (plan, userEmail) => {
  try {
    const response = await fetch(`${API_URL}/api/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        plan,
        amount: PAYMENT_CONFIG.prices[plan]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment');
    }

    const data = await response.json();

    return {
      success: true,
      paymentId: data.paymentId,
      address: data.address,
      amountBTC: data.amountBTC,
      amountSats: data.amountSats,
      usdAmount: data.usdAmount,
      btcPriceUsd: data.btcPriceUsd,
      qrData: data.qrData,
      expiresAt: data.expiresAt,
      priceExpiresIn: data.priceExpiresIn // seconds until price needs refresh
    };

  } catch (error) {
    console.error('Create payment error:', error);

    // If backend is not available, return demo mode
    if (error.message.includes('Failed to fetch')) {
      return {
        success: true,
        demo: true,
        paymentId: `demo-${Date.now()}`,
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amountBTC: PAYMENT_CONFIG.prices[plan] / 100000, // Rough estimate
        amountSats: PAYMENT_CONFIG.prices[plan] * 1000,
        usdAmount: PAYMENT_CONFIG.prices[plan],
        btcPriceUsd: 100000,
        qrData: `bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=${PAYMENT_CONFIG.prices[plan] / 100000}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        priceExpiresIn: 120 // 2 minutes
      };
    }

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Refresh payment price (recalculate BTC amount based on current price)
 */
export const refreshPaymentPrice = async (paymentId) => {
  // Demo mode check
  if (paymentId.startsWith('demo-')) {
    return {
      success: true,
      demo: true,
      amountBTC: 0.0001,
      amountSats: 10000,
      btcPriceUsd: 100000,
      qrData: `bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.0001`,
      priceExpiresIn: 120
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/${paymentId}/refresh-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to refresh price');
    }

    return await response.json();

  } catch (error) {
    console.error('Refresh payment price error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check payment status
 */
export const checkPaymentStatus = async (paymentId) => {
  // Demo mode check
  if (paymentId.startsWith('demo-')) {
    return {
      success: true,
      status: 'pending',
      demo: true
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/${paymentId}/status`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check payment status');
    }

    return await response.json();

  } catch (error) {
    console.error('Check payment status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Poll for payment confirmation
 * Calls callback when payment is confirmed or expired
 */
export const pollPaymentStatus = (paymentId, onStatusChange, onConfirmed, onExpired) => {
  let attempts = 0;
  let intervalId = null;

  const checkStatus = async () => {
    attempts++;

    if (attempts > PAYMENT_CONFIG.maxPollAttempts) {
      clearInterval(intervalId);
      onExpired?.();
      return;
    }

    const result = await checkPaymentStatus(paymentId);

    if (result.success) {
      onStatusChange?.(result.status, result.confirmations || 0);

      if (result.status === 'confirmed') {
        clearInterval(intervalId);
        onConfirmed?.(result.pdfPassword, result.txid);
      } else if (result.status === 'expired') {
        clearInterval(intervalId);
        onExpired?.();
      }
    }
  };

  // Initial check
  checkStatus();

  // Start polling
  intervalId = setInterval(checkStatus, PAYMENT_CONFIG.pollInterval);

  // Return function to stop polling
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};

/**
 * Simulate payment for demo mode
 */
export const simulatePayment = async (paymentId, plan, userEmail) => {
  // In demo mode, just simulate success
  return {
    success: true,
    demo: true,
    status: 'confirmed',
    pdfPassword: generateDemoPassword(),
    message: 'Demo payment simulated successfully'
  };
};

/**
 * Generate demo PDF password
 */
const generateDemoPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId) => {
  if (paymentId.startsWith('demo-')) {
    return {
      success: true,
      demo: true,
      payment: {
        id: paymentId,
        plan: 'complete',
        status: 'pending'
      }
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/payments/${paymentId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get payment details');
    }

    return await response.json();

  } catch (error) {
    console.error('Get payment details error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Payment modal styles
export const paymentModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px'
  },
  modal: {
    background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
    border: '1px solid #2a2a2a',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '15px',
    color: '#9ca3af',
    marginBottom: '24px'
  },
  qrContainer: {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    display: 'inline-block'
  },
  addressBox: {
    background: 'rgba(247,147,26,0.1)',
    border: '1px solid rgba(247,147,26,0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px'
  },
  addressLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  address: {
    fontSize: '13px',
    color: '#F7931A',
    wordBreak: 'break-all',
    fontFamily: 'monospace'
  },
  amountBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px'
  },
  amountLabel: {
    fontSize: '14px',
    color: '#9ca3af'
  },
  amountValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#F7931A'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  statusText: {
    fontSize: '14px',
    color: '#3b82f6'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #3b82f6',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  timer: {
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '24px'
  },
  copyButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#F7931A',
    border: 'none',
    color: '#000',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  cancelButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    border: '1px solid #3a3a3a',
    color: '#9ca3af',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  demoButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'rgba(34,197,94,0.2)',
    border: '1px solid rgba(34,197,94,0.5)',
    color: '#22c55e',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  successBox: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#22c55e',
    marginBottom: '8px'
  },
  passwordBox: {
    background: '#1a1a1a',
    border: '2px solid #F7931A',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px'
  },
  passwordLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '8px'
  },
  password: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#F7931A',
    fontFamily: 'monospace',
    letterSpacing: '2px'
  }
};
