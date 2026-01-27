// KYWARD PAYMENT ROUTER
// Unified interface for all payment providers
// Routes to: BTCPay (Lightning/Liquid), HD Derivation (On-chain), NOWPayments (USDT)

const btcpay = require('./btcpay');
const bitcoin = require('./bitcoin');
const nowpayments = require('./nowpayments');

// Payment providers
const PROVIDERS = {
  LIGHTNING: 'btcpay_lightning',
  LIQUID_BTC: 'btcpay_liquid_lbtc',
  LIQUID_USDT: 'btcpay_liquid_lusdt',
  ONCHAIN: 'direct_btc',
  USDT_TRC20: 'nowpayments_usdttrc20',
  USDT_POLYGON: 'nowpayments_usdtmatic',
  USDT_BSC: 'nowpayments_usdtbsc',
  USDT_ERC20: 'nowpayments_usdterc20'
};

// Payment methods shown to users
const PAYMENT_METHODS = {
  lightning: {
    id: 'lightning',
    name: 'Lightning',
    icon: '⚡',
    badge: 'Instant',
    description: 'Fastest, lowest fees',
    time: '< 1 minute',
    provider: PROVIDERS.LIGHTNING
  },
  onchain: {
    id: 'onchain',
    name: 'Bitcoin',
    icon: '₿',
    badge: 'Private',
    description: 'Direct to wallet',
    time: '10-60 minutes',
    provider: PROVIDERS.ONCHAIN
  },
  liquid: {
    id: 'liquid',
    name: 'Liquid',
    icon: '💧',
    badge: 'Fast',
    description: 'L-BTC or L-USDT',
    time: '1-2 minutes',
    networks: [
      { id: 'lbtc', name: 'L-BTC', provider: PROVIDERS.LIQUID_BTC },
      { id: 'lusdt', name: 'L-USDT', provider: PROVIDERS.LIQUID_USDT }
    ]
  },
  usdt: {
    id: 'usdt',
    name: 'USDT',
    icon: '💵',
    badge: 'Stable',
    description: 'Tether stablecoin',
    time: '1-10 minutes',
    networks: [
      { id: 'usdttrc20', name: 'Tron (TRC20)', fee: '~$1', provider: PROVIDERS.USDT_TRC20 },
      { id: 'usdtmatic', name: 'Polygon', fee: '< $0.01', provider: PROVIDERS.USDT_POLYGON },
      { id: 'usdtbsc', name: 'BSC', fee: '~$0.10', provider: PROVIDERS.USDT_BSC },
      { id: 'usdterc20', name: 'Ethereum (ERC20)', fee: '~$5-20', provider: PROVIDERS.USDT_ERC20 }
    ]
  }
};

// Plan prices (must match server.js and frontend PaymentService.js)
const PLAN_PRICES = {
  essential: 9.99,               // one-time
  sentinel: 14.99,               // monthly subscription
  consultation: 99,              // first consultation session
  consultation_additional: 49    // additional hours/sessions
};

/**
 * Get available payment methods based on configuration
 */
function getAvailablePaymentMethods() {
  const methods = [];

  // Lightning - requires BTCPay
  if (btcpay.isConfigured()) {
    methods.push(PAYMENT_METHODS.lightning);
  }

  // On-chain BTC - requires XPUB
  if (process.env.XPUB) {
    methods.push(PAYMENT_METHODS.onchain);
  }

  // Liquid - requires BTCPay
  if (btcpay.isConfigured()) {
    methods.push(PAYMENT_METHODS.liquid);
  }

  // USDT - requires NOWPayments
  if (nowpayments.isConfigured()) {
    methods.push(PAYMENT_METHODS.usdt);
  }

  return methods;
}

/**
 * Create a payment using the specified method
 * @param {object} options - Payment options
 * @param {string} options.method - Payment method: lightning, onchain, liquid, usdt
 * @param {string} options.network - Network for liquid/usdt: lbtc, lusdt, usdttrc20, etc.
 * @param {string} options.plan - Plan: essential, sentinel, consultation
 * @param {string} options.email - User email
 * @param {string} options.paymentId - Unique payment ID
 * @returns {object} Payment details
 */
async function createPayment({ method, network, plan, email, paymentId }) {
  // Get plan price
  const amount = PLAN_PRICES[plan];
  if (!amount) {
    return {
      success: false,
      error: `Invalid plan: ${plan}`
    };
  }

  const metadata = { email, plan, paymentId };

  try {
    switch (method) {
      case 'lightning':
        return await createLightningPayment(amount, metadata);

      case 'onchain':
        return await createOnchainPayment(amount, metadata);

      case 'liquid':
        return await createLiquidPayment(amount, network || 'lbtc', metadata);

      case 'usdt':
        return await createUsdtPayment(amount, network || 'usdttrc20', metadata);

      default:
        return {
          success: false,
          error: `Invalid payment method: ${method}`
        };
    }
  } catch (error) {
    console.error(`Create payment error (${method}):`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create Lightning payment via BTCPay
 */
async function createLightningPayment(amount, metadata) {
  if (!btcpay.isConfigured()) {
    return { success: false, error: 'Lightning payments not configured' };
  }

  const result = await btcpay.createLightningInvoice(amount, metadata);

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    provider: PROVIDERS.LIGHTNING,
    method: 'lightning',
    paymentId: metadata.paymentId,
    invoiceId: result.invoiceId,
    // Payment data
    invoice: result.lightningInvoice,
    qrData: result.qrData,
    amount: amount,
    currency: 'USD',
    expiresAt: result.expiresAt,
    checkoutLink: result.checkoutLink,
    paymentLink: result.paymentLink,
    reused: result.reused
  };
}

/**
 * Create on-chain BTC payment via HD derivation
 */
async function createOnchainPayment(amount, metadata) {
  const { email, paymentId } = metadata;

  if (!process.env.XPUB) {
    return { success: false, error: 'On-chain payments not configured' };
  }

  // Generate address
  const addressResult = await bitcoin.generatePaymentAddress(paymentId, email);
  if (!addressResult.success) {
    return addressResult;
  }

  // Convert USD to sats
  const conversion = await bitcoin.usdToSats(amount);

  return {
    success: true,
    provider: PROVIDERS.ONCHAIN,
    method: 'onchain',
    paymentId: paymentId,
    // Payment data
    address: addressResult.address,
    qrData: `bitcoin:${addressResult.address}?amount=${conversion.btcAmount.toFixed(8)}`,
    amount: amount,
    currency: 'USD',
    btcAmount: conversion.btcAmount,
    sats: conversion.sats,
    priceUsd: conversion.priceUsd,
    derivationPath: addressResult.path,
    addressIndex: addressResult.index,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    reused: addressResult.reused
  };
}

/**
 * Create Liquid payment via BTCPay
 */
async function createLiquidPayment(amount, asset, metadata) {
  if (!btcpay.isConfigured()) {
    return { success: false, error: 'Liquid payments not configured' };
  }

  const result = await btcpay.createLiquidInvoice(amount, asset, metadata);

  if (!result.success) {
    return result;
  }

  const provider = asset === 'lusdt' ? PROVIDERS.LIQUID_USDT : PROVIDERS.LIQUID_BTC;

  return {
    success: true,
    provider: provider,
    method: 'liquid',
    network: asset,
    paymentId: metadata.paymentId,
    invoiceId: result.invoiceId,
    // Payment data
    address: result.address,
    qrData: result.qrData,
    amount: amount,
    currency: 'USD',
    assetAmount: result.assetAmount,
    asset: result.asset,
    expiresAt: result.expiresAt,
    checkoutLink: result.checkoutLink,
    paymentLink: result.paymentLink,
    reused: result.reused
  };
}

/**
 * Create USDT payment via NOWPayments
 */
async function createUsdtPayment(amount, network, metadata) {
  if (!nowpayments.isConfigured()) {
    return { success: false, error: 'USDT payments not configured' };
  }

  const result = await nowpayments.createUsdtPayment(amount, network, metadata);

  if (!result.success) {
    return result;
  }

  // Map network to provider
  const providerMap = {
    'usdttrc20': PROVIDERS.USDT_TRC20,
    'usdtmatic': PROVIDERS.USDT_POLYGON,
    'usdtbsc': PROVIDERS.USDT_BSC,
    'usdterc20': PROVIDERS.USDT_ERC20
  };

  return {
    success: true,
    provider: providerMap[network] || PROVIDERS.USDT_TRC20,
    method: 'usdt',
    network: network,
    networkName: result.networkName,
    networkFee: result.networkFee,
    paymentId: metadata.paymentId,
    nowpaymentsId: result.paymentId,
    // Payment data
    address: result.address,
    qrData: result.qrData,
    amount: amount,
    currency: 'USD',
    payAmount: result.payAmount,
    payCurrency: result.payCurrency,
    expiresAt: result.expiresAt,
    reused: result.reused
  };
}

/**
 * Check payment status across all providers
 * @param {string} paymentId - Internal payment ID
 * @param {string} provider - Provider that was used
 * @param {object} paymentData - Original payment data (invoiceId, address, etc.)
 */
async function checkPaymentStatus(paymentId, provider, paymentData) {
  try {
    switch (provider) {
      case PROVIDERS.LIGHTNING:
      case PROVIDERS.LIQUID_BTC:
      case PROVIDERS.LIQUID_USDT:
        // BTCPay invoice
        if (!paymentData.invoiceId) {
          return { success: false, error: 'Missing invoiceId' };
        }
        const btcpayStatus = await btcpay.getInvoiceStatus(paymentData.invoiceId);
        return {
          success: true,
          provider,
          status: btcpayStatus.status,
          providerStatus: btcpayStatus.btcpayStatus,
          amount: btcpayStatus.amount,
          paidAmount: btcpayStatus.paidAmount
        };

      case PROVIDERS.ONCHAIN:
        // On-chain BTC
        if (!paymentData.address || !paymentData.sats) {
          return { success: false, error: 'Missing address or expected sats' };
        }
        const onchainStatus = await bitcoin.checkAddressPayment(
          paymentData.address,
          paymentData.sats
        );
        return {
          success: true,
          provider,
          status: onchainStatus.paid ? 'confirmed' : 'pending',
          paid: onchainStatus.paid,
          txid: onchainStatus.txid,
          receivedSats: onchainStatus.receivedSats,
          expectedSats: onchainStatus.expectedSats,
          confirmations: onchainStatus.confirmations
        };

      case PROVIDERS.USDT_TRC20:
      case PROVIDERS.USDT_POLYGON:
      case PROVIDERS.USDT_BSC:
      case PROVIDERS.USDT_ERC20:
        // NOWPayments
        if (!paymentData.nowpaymentsId) {
          return { success: false, error: 'Missing nowpaymentsId' };
        }
        const nowStatus = await nowpayments.getPaymentStatus(paymentData.nowpaymentsId);
        return {
          success: true,
          provider,
          status: nowStatus.status,
          providerStatus: nowStatus.nowpaymentsStatus,
          amount: nowStatus.amount,
          actuallyPaid: nowStatus.actuallyPaid
        };

      default:
        return { success: false, error: `Unknown provider: ${provider}` };
    }
  } catch (error) {
    console.error(`Check payment status error (${provider}):`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mark payment as used/completed
 */
function markPaymentUsed(provider, paymentData, email) {
  switch (provider) {
    case PROVIDERS.LIGHTNING:
    case PROVIDERS.LIQUID_BTC:
    case PROVIDERS.LIQUID_USDT:
      if (paymentData.invoiceId) {
        btcpay.markInvoiceUsed(paymentData.invoiceId, email);
      }
      break;

    case PROVIDERS.ONCHAIN:
      if (paymentData.address) {
        bitcoin.markAddressUsed(paymentData.address, email);
      }
      break;

    case PROVIDERS.USDT_TRC20:
    case PROVIDERS.USDT_POLYGON:
    case PROVIDERS.USDT_BSC:
    case PROVIDERS.USDT_ERC20:
      if (paymentData.nowpaymentsId) {
        nowpayments.markInvoiceUsed(paymentData.nowpaymentsId, email);
      }
      break;
  }
}

/**
 * Get stats from all providers
 */
function getProviderStats() {
  return {
    btcpay: btcpay.isConfigured() ? btcpay.getAssignmentStats() : null,
    bitcoin: {
      configured: !!process.env.XPUB
    },
    nowpayments: nowpayments.isConfigured() ? nowpayments.getAssignmentStats() : null
  };
}

/**
 * Health check for all providers
 */
async function healthCheck() {
  const results = {};

  // BTCPay
  if (btcpay.isConfigured()) {
    try {
      const storeInfo = await btcpay.getStoreInfo();
      results.btcpay = {
        status: storeInfo.success ? 'ok' : 'error',
        storeName: storeInfo.storeName,
        error: storeInfo.error
      };
    } catch (e) {
      results.btcpay = { status: 'error', error: e.message };
    }
  } else {
    results.btcpay = { status: 'not_configured' };
  }

  // Bitcoin HD
  results.bitcoin = {
    status: process.env.XPUB ? 'ok' : 'not_configured'
  };

  // NOWPayments
  if (nowpayments.isConfigured()) {
    try {
      const apiStatus = await nowpayments.getApiStatus();
      results.nowpayments = {
        status: apiStatus.success ? 'ok' : 'error',
        message: apiStatus.message,
        error: apiStatus.error
      };
    } catch (e) {
      results.nowpayments = { status: 'error', error: e.message };
    }
  } else {
    results.nowpayments = { status: 'not_configured' };
  }

  return results;
}

module.exports = {
  PROVIDERS,
  PAYMENT_METHODS,
  PLAN_PRICES,
  getAvailablePaymentMethods,
  createPayment,
  checkPaymentStatus,
  markPaymentUsed,
  getProviderStats,
  healthCheck
};
