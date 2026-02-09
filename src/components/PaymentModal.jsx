import React, { useState, useEffect, useRef } from 'react';
import {
  createPayment,
  pollPaymentStatus,
  simulatePayment,
  refreshPaymentPrice,
  getPriceDisplay,
  getPaymentMethods,
  paymentModalStyles as pms
} from '../services/PaymentService';
import { kywardDB } from '../services/Database';
import { useLanguage } from '../i18n';
import PaymentMethodSelector from './PaymentMethodSelector';

const PaymentModal = ({ plan, user, onSuccess, onClose }) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState('selecting'); // selecting, loading, payment, success, error
  const [paymentData, setPaymentData] = useState(null);
  const [status, setStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes for payment
  const [priceTimeLeft, setPriceTimeLeft] = useState(120); // 2 minutes for price
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfPassword, setPdfPassword] = useState(null);
  const [error, setError] = useState(null);
  const [availableMethods, setAvailableMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const stopPollingRef = useRef(null);
  const timerRef = useRef(null);
  const priceTimerRef = useRef(null);

  const priceInfo = getPriceDisplay(plan);
  // Nombre del plan traducido + tipo (one-time / monthly)
  const planName = t.landing.plans[plan]?.name || 'Plan';
  const planTypeLabel = priceInfo.typeLabel; // "One-time payment" o "Monthly subscription"
  const isSubscription = priceInfo.isSubscription;

  // Fetch available payment methods on mount
  useEffect(() => {
    const fetchMethods = async () => {
      const result = await getPaymentMethods();
      if (result.success && result.methods.length > 0) {
        setAvailableMethods(result.methods);
        // Auto-select first method if it doesn't have networks
        const firstMethod = result.methods[0];
        if (!firstMethod.networks) {
          setSelectedMethod(firstMethod.id);
        }
      } else {
        // Default to onchain if no methods available
        setSelectedMethod('onchain');
      }
    };
    fetchMethods();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup polling and timers
      if (stopPollingRef.current) stopPollingRef.current();
      if (timerRef.current) clearInterval(timerRef.current);
      if (priceTimerRef.current) clearInterval(priceTimerRef.current);
    };
  }, []);

  // Payment expiry countdown timer
  useEffect(() => {
    if (stage === 'payment' && paymentData?.expiresAt) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const expires = new Date(paymentData.expiresAt);
        const remaining = Math.max(0, Math.floor((expires - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setStage('expired');
        }
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [stage, paymentData]);

  // Price refresh countdown timer
  useEffect(() => {
    if (stage === 'payment' && paymentData?.priceExpiresIn !== undefined) {
      // Initialize price countdown
      setPriceTimeLeft(paymentData.priceExpiresIn);

      priceTimerRef.current = setInterval(() => {
        setPriceTimeLeft(prev => {
          if (prev <= 1) {
            // Price expired, trigger refresh
            handleRefreshPrice();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(priceTimerRef.current);
    }
  }, [stage, paymentData?.paymentId]);

  const initializePayment = async () => {
    try {
      setStage('loading');
      const result = await createPayment(plan, user.email, selectedMethod, selectedNetwork);

      if (result.success) {
        setPaymentData(result);
        setStage('payment');

        // Start polling for payment (unless demo mode)
        if (!result.demo) {
          stopPollingRef.current = pollPaymentStatus(
            result.paymentId,
            (newStatus, confirmations) => {
              setStatus(newStatus);
            },
            (password, txid) => {
              // Payment confirmed!
              setPdfPassword(password);
              handlePaymentSuccess(password);
            },
            () => {
              // Payment expired
              setStage('expired');
            }
          );
        }
      } else {
        setError(result.error || 'Failed to create payment');
        setStage('error');
      }
    } catch (err) {
      setError(err.message);
      setStage('error');
    }
  };

  // Handle method selection
  const handleMethodSelect = (method, network) => {
    setSelectedMethod(method);
    setSelectedNetwork(network);
  };

  // Proceed to payment after method selection
  const handleProceedToPayment = () => {
    if (!selectedMethod) return;

    // Check if method requires network selection
    const method = availableMethods.find(m => m.id === selectedMethod);
    if (method?.networks && !selectedNetwork) {
      return; // Need to select network first
    }

    initializePayment();
  };

  // Refresh BTC price
  const handleRefreshPrice = async () => {
    if (!paymentData?.paymentId || isRefreshingPrice) return;

    setIsRefreshingPrice(true);

    try {
      const result = await refreshPaymentPrice(paymentData.paymentId);

      if (result.success) {
        // Update payment data with new price
        setPaymentData(prev => ({
          ...prev,
          amountBTC: result.amountBTC,
          amountSats: result.amountSats,
          btcPriceUsd: result.btcPriceUsd,
          qrData: result.qrData,
          priceExpiresIn: result.priceExpiresIn
        }));

        // Reset price countdown
        setPriceTimeLeft(result.priceExpiresIn);
      }
    } catch (err) {
      console.error('Price refresh error:', err);
    } finally {
      setIsRefreshingPrice(false);
    }
  };

  const handlePaymentSuccess = async (password) => {
  try {
    // Llamada real al backend (debería ser async)
    const upgradeResult = await kywardDB.upgradeSubscription(user.email, plan);
    
    if (upgradeResult.success) {
      setPdfPassword(password || upgradeResult.user?.pdfPassword);
      setStage('success');
      
      // Opcional: refrescar usuario en local
      const updatedUser = await kywardDB.getUserWithPassword(user.email);
      if (updatedUser) onSuccess?.(updatedUser);
    } else {
      throw new Error('Upgrade failed after payment');
    }
  } catch (err) {
    console.error('Upgrade after payment failed:', err);
    setError('Payment confirmed but upgrade failed. Contact support.');
    setStage('error');
  }
};

  const handleDemoPayment = async () => {
    const result = await simulatePayment(paymentData.paymentId, plan, user.email);
    if (result.success) {
      handlePaymentSuccess(result.pdfPassword);
    }
  };

  const handleCopyAddress = () => {
    const toCopy = paymentData?.method === 'lightning'
      ? paymentData?.invoice
      : paymentData?.address;

    if (toCopy) {
      navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyAmount = () => {
    if (paymentData?.method === 'usdt' && paymentData?.payAmount) {
      navigator.clipboard.writeText(paymentData.payAmount.toString());
    } else if (paymentData?.amountBTC) {
      navigator.clipboard.writeText(paymentData.amountBTC.toString());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (stopPollingRef.current) stopPollingRef.current();
    if (timerRef.current) clearInterval(timerRef.current);
    if (priceTimerRef.current) clearInterval(priceTimerRef.current);

    if (stage === 'success' && pdfPassword) {
      onSuccess(pdfPassword);
    } else {
      onClose();
    }
  };

  // Get display data for selected method
  const getMethodDisplayName = () => {
    if (!paymentData?.method) return '';
    const methodNames = {
      lightning: 'Lightning',
      onchain: 'Bitcoin',
      liquid: selectedNetwork === 'lusdt' ? 'Liquid USDT' : 'Liquid BTC',
      usdt: paymentData.networkName || 'USDT',
      lemonsqueezy: 'Credit/Debit Card'
    };
    return methodNames[paymentData.method] || paymentData.method;
  };

  // Render based on stage
  const renderContent = () => {
    switch (stage) {
      case 'selecting':
        return (
          <>
            {/* Plan Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{
                color: '#F7931A',
                fontSize: '24px',
                margin: '0 0 8px 0',
                fontWeight: '700'
              }}>
                {t.payment.title} — {planName}
              </h2>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(247,147,26,0.1)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#F7931A'
              }}>
                <span>{planTypeLabel}</span>
                <span>|</span>
                <strong>{priceInfo.amount} {priceInfo.period}</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              availableMethods={availableMethods}
              onSelect={handleMethodSelect}
              selectedMethod={selectedMethod}
              selectedNetwork={selectedNetwork}
            />

            {/* Proceed Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedMethod || (availableMethods.find(m => m.id === selectedMethod)?.networks && !selectedNetwork)}
              style={{
                ...pms.copyButton,
                marginTop: '24px',
                opacity: (!selectedMethod || (availableMethods.find(m => m.id === selectedMethod)?.networks && !selectedNetwork)) ? 0.5 : 1,
                cursor: (!selectedMethod || (availableMethods.find(m => m.id === selectedMethod)?.networks && !selectedNetwork)) ? 'not-allowed' : 'pointer'
              }}
            >
              {t.payment?.continue || 'Continue to Payment'}
            </button>

            <button onClick={handleClose} style={{ ...pms.cancelButton, marginTop: '12px' }}>
              {t.payment.cancel}
            </button>
          </>
        );

      case 'loading':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto',
                border: '3px solid #F7931A',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
            <h2 style={pms.title}>{t.payment.generating}</h2>
            <p style={pms.subtitle}>{t.payment.generatingDesc}</p>
          </>
        );

      case 'payment':
        const methodColor = paymentData?.method === 'usdt' ? '#26A17B' :
                           paymentData?.method === 'liquid' ? '#00AAFF' :
                           paymentData?.method === 'lemonsqueezy' ? '#7c3aed' : '#F7931A';
        const isLightning = paymentData?.method === 'lightning';
        const isRedirectPayment = paymentData?.useRedirect;
        const displayAddress = isLightning ? paymentData?.invoice : paymentData?.address;

        return (
          <>
            {/* Payment Method Icon */}
            <div style={{ marginBottom: '16px' }}>
              {paymentData?.method === 'lightning' ? (
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto' }}>
                  <circle cx="24" cy="24" r="22" fill="#F7931A"/>
                  <path d="M26 10L16 26H22L20 38L32 22H26L26 10Z" fill="#fff"/>
                </svg>
              ) : paymentData?.method === 'liquid' ? (
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto' }}>
                  <circle cx="24" cy="24" r="22" fill="#00AAFF"/>
                  <path d="M24 12C24 12 16 20 16 26C16 30.42 19.58 34 24 34C28.42 34 32 30.42 32 26C32 20 24 12 24 12Z" fill="#fff"/>
                </svg>
              ) : paymentData?.method === 'usdt' ? (
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto' }}>
                  <circle cx="24" cy="24" r="22" fill="#26A17B"/>
                  <text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">$</text>
                </svg>
              ) : paymentData?.method === 'lemonsqueezy' ? (
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto' }}>
                  <rect x="4" y="10" width="40" height="28" rx="4" fill="#7c3aed"/>
                  <rect x="4" y="16" width="40" height="6" fill="#5b21b6"/>
                  <rect x="10" y="28" width="12" height="4" rx="2" fill="#fff" opacity="0.8"/>
                  <circle cx="34" cy="30" r="4" fill="#fff" opacity="0.6"/>
                  <circle cx="38" cy="30" r="4" fill="#fff" opacity="0.4"/>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto' }}>
                  <circle cx="24" cy="24" r="22" fill="#F7931A"/>
                  <text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">₿</text>
                </svg>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{
                color: methodColor,
                fontSize: '24px',
                margin: '0 0 8px 0',
                fontWeight: '700'
              }}>
                {t.payment.title} — {planName}
              </h2>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: `rgba(${methodColor === '#F7931A' ? '247,147,26' : methodColor === '#00AAFF' ? '0,170,255' : '38,161,123'},0.1)`,
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                color: methodColor
              }}>
                <span>{getMethodDisplayName()}</span>
                <span>|</span>
                <strong>{priceInfo.amount} {priceInfo.period}</strong>
              </div>
            </div>

            {/* Redirect Payment (Lemon Squeezy) */}
            {isRedirectPayment ? (
              <>
                <div style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
                    {t.payment?.redirectInfo || 'You will be redirected to our secure payment provider to complete your purchase.'}
                  </p>

                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Total</span>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#7c3aed', margin: '4px 0' }}>
                      ${paymentData.amount} USD
                    </p>
                  </div>

                  <button
                    onClick={() => window.open(paymentData.checkoutUrl, '_blank')}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 8H18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {t.payment?.proceedToCheckout || 'Proceed to Secure Checkout'}
                  </button>

                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                    {t.payment?.securePayment || 'Secured by Lemon Squeezy. We accept Visa, Mastercard, PayPal & more.'}
                  </p>
                </div>

                {/* Status */}
                <div style={pms.status}>
                  <div style={pms.spinner} />
                  <span style={pms.statusText}>{t.payment?.waitingForPayment || 'Waiting for payment confirmation...'}</span>
                </div>

                {/* Payment Timer */}
                <div style={pms.timer}>
                  {t.payment.expiresIn} <strong>{formatTime(timeLeft)}</strong>
                </div>

                {/* Back to method selection */}
                <button
                  onClick={() => {
                    if (stopPollingRef.current) stopPollingRef.current();
                    setStage('selecting');
                    setPaymentData(null);
                  }}
                  style={{ ...pms.cancelButton, marginBottom: '8px' }}
                >
                  {t.payment?.changeMethod || 'Change Payment Method'}
                </button>

                <button onClick={handleClose} style={pms.cancelButton}>
                  {t.payment.cancel}
                </button>
              </>
            ) : (
              <>
                {/* QR Code */}
                <div className="qr-container" style={pms.qrContainer}>
                  <QRCode data={paymentData.qrData} size={180} />
                </div>

                {/* Amount with USD equivalent */}
                <div className="amount-box" style={pms.amountBox}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={pms.amountLabel}>{t.payment.amount}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  ${paymentData.usdAmount || priceInfo.amount.replace('$', '')} USD
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {paymentData?.method === 'usdt' ? (
                  <>
                    <span style={{ ...pms.amountValue, cursor: 'pointer', color: '#26A17B' }} onClick={handleCopyAmount}>
                      {paymentData.payAmount} USDT
                    </span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>
                      {paymentData.networkName}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ ...pms.amountValue, cursor: 'pointer', color: methodColor }} onClick={handleCopyAmount}>
                      {paymentData.amountBTC?.toFixed(8)} BTC
                    </span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>
                      @ ${paymentData.btcPriceUsd?.toLocaleString() || '---'}/BTC
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Price Refresh Countdown - Only for BTC methods */}
            {paymentData?.method !== 'usdt' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: priceTimeLeft <= 30 ? 'rgba(239,68,68,0.1)' : `rgba(${methodColor === '#F7931A' ? '247,147,26' : '0,170,255'},0.1)`,
                border: `1px solid ${priceTimeLeft <= 30 ? 'rgba(239,68,68,0.3)' : `rgba(${methodColor === '#F7931A' ? '247,147,26' : '0,170,255'},0.3)`}`,
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <span style={{ color: priceTimeLeft <= 30 ? '#ef4444' : methodColor }}>
                  {isRefreshingPrice ? (
                    t.payment.updatingPrice
                  ) : priceTimeLeft <= 0 ? (
                    t.payment.priceExpired
                  ) : (
                    <>{t.payment.priceUpdates} <strong>{formatTime(priceTimeLeft)}</strong></>
                  )}
                </span>
                <button
                  onClick={handleRefreshPrice}
                  disabled={isRefreshingPrice}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: methodColor,
                    cursor: isRefreshingPrice ? 'not-allowed' : 'pointer',
                    padding: '4px 8px',
                    fontSize: '12px',
                    opacity: isRefreshingPrice ? 0.5 : 1
                  }}
                >
                  {isRefreshingPrice ? '...' : t.payment.refreshNow}
                </button>
              </div>
            )}

            {/* Address / Invoice */}
            <div className="address-box" style={{
              ...pms.addressBox,
              borderColor: `rgba(${methodColor === '#F7931A' ? '247,147,26' : methodColor === '#00AAFF' ? '0,170,255' : '38,161,123'},0.3)`,
              background: `rgba(${methodColor === '#F7931A' ? '247,147,26' : methodColor === '#00AAFF' ? '0,170,255' : '38,161,123'},0.1)`
            }}>
              <div style={pms.addressLabel}>
                {isLightning ? (t.payment?.invoice || 'Lightning Invoice') : t.payment.address}
              </div>
              <div className="address-text" style={{ ...pms.address, color: methodColor }}>
                {isLightning
                  ? (displayAddress?.length > 60 ? `${displayAddress.substring(0, 30)}...${displayAddress.substring(displayAddress.length - 30)}` : displayAddress)
                  : displayAddress
                }
              </div>
            </div>

            {/* Status */}
            <div style={pms.status}>
              <div style={pms.spinner} />
              <span style={pms.statusText}>{t.payment.waiting}</span>
            </div>

            {/* Payment Timer */}
            <div style={pms.timer}>
              {t.payment.expiresIn} <strong>{formatTime(timeLeft)}</strong>
            </div>

            {/* Copy Button */}
            <div className="payment-buttons">
              <button onClick={handleCopyAddress} style={{ ...pms.copyButton, backgroundColor: methodColor }}>
                {copied
                  ? `✓ ${t.payment.copied}`
                  : (isLightning ? (t.payment?.copyInvoice || 'Copy Invoice') : t.payment.copyAddress)
                }
              </button>

              {/* Open in Wallet (for Lightning) */}
              {isLightning && paymentData?.invoice && (
                <button
                  onClick={() => window.open(`lightning:${paymentData.invoice}`, '_blank')}
                  style={{
                    ...pms.copyButton,
                    backgroundColor: 'transparent',
                    border: `1px solid ${methodColor}`,
                    color: methodColor,
                    marginBottom: '12px'
                  }}
                >
                  {t.payment?.openWallet || 'Open in Wallet'}
                </button>
              )}

              {/* Demo Button (if demo mode) */}
              {paymentData.demo && (
                <button onClick={handleDemoPayment} style={pms.demoButton}>
                  {t.payment.simulateDemo}
                </button>
              )}

              {/* Back to method selection */}
              <button
                onClick={() => {
                  if (stopPollingRef.current) stopPollingRef.current();
                  setStage('selecting');
                  setPaymentData(null);
                }}
                style={{ ...pms.cancelButton, marginBottom: '8px' }}
              >
                {t.payment?.changeMethod || 'Change Payment Method'}
              </button>

              <button onClick={handleClose} style={pms.cancelButton}>
                {t.payment.cancel}
              </button>
            </div>
              </>
            )}
          </>
        );

      case 'success':
        return (
          <div style={pms.successBox}>
            <div style={{ ...pms.successIcon, fontSize: '48px' }}>✓</div>
            <h3 style={{ ...pms.successTitle, margin: '16px 0 8px' }}>
              {t.payment.confirmed}
            </h3>

            <p style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#22c55e',
              margin: '0 0 16px 0'
            }}>
              {t.payment.planActive.replace('{plan}', planName)} {t.common.activated || 'activated'}
            </p>

            {/* Mensaje personalizado según tipo de plan - TODO: 100% desde traducciones */}
            {isSubscription ? (
              <p 
                style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.5', marginBottom: '24px' }}
                dangerouslySetInnerHTML={{ __html: t.payment.paymentActivatedSubscription }}
              />
            ) : plan === 'essential' ? (
              <>
                <p 
                  style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.5', marginBottom: '12px' }}
                  dangerouslySetInnerHTML={{ __html: t.payment.paymentActivatedOneTime }}
                />
                <p 
                  style={{ color: '#F7931A', fontSize: '14px', fontWeight: '500' }}
                  dangerouslySetInnerHTML={{ __html: t.payment.essentialRepurchaseNote }}
                />
              </>
            ) : (
              <>
                <p
                  style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.5', marginBottom: '16px' }}
                  dangerouslySetInnerHTML={{ __html: t.payment.consultationBooked }}
                />
                <button
                  onClick={() => window.open('https://calendly.com/leomr20-proton/30min', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '16px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 8H18" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {t.payment.scheduleConsultation || 'Schedule Your Consultation'}
                </button>
              </>
            )}

            {/* Contraseña PDF */}
            {pdfPassword && (
              <div style={{ 
                background: 'rgba(247,147,26,0.08)',
                border: '1px solid rgba(247,147,26,0.3)',
                borderRadius: '12px',
                padding: '20px',
                margin: '24px 0'
              }}>
                <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>
                  {t.payment.yourPassword}
                </div>
                <div style={{ 
                  fontFamily: 'monospace',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#F7931A',
                  letterSpacing: '2px',
                  wordBreak: 'break-all'
                }}>
                  {pdfPassword}
                </div>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#F7931A', 
                  marginTop: '16px',
                  fontWeight: '500'
                }}>
                  {t.payment.savePassword}
                </p>
              </div>
            )}

            <button 
              onClick={handleClose}
              style={{
                ...pms.copyButton,
                width: '100%',
                marginTop: '16px',
                backgroundColor: '#22c55e',
                border: 'none'
              }}
            >
              {t.payment.continueToReport}
            </button>
          </div>
        );

      case 'expired':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: '0 auto' }}>
                <circle cx="32" cy="32" r="28" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="2"/>
                <path d="M24 24L40 40M40 24L24 40" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 style={pms.title}>{t.payment.expired}</h2>
            <p style={pms.subtitle}>{t.payment.expiredDesc}</p>

            <button onClick={initializePayment} style={pms.copyButton}>
              {t.payment.tryAgain}
            </button>
            <button onClick={handleClose} style={pms.cancelButton}>
              {t.payment.close}
            </button>
          </>
        );

      case 'error':
        return (
          <>
            <div style={{ marginBottom: '24px' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: '0 auto' }}>
                <circle cx="32" cy="32" r="28" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="2"/>
                <path d="M32 20V36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="32" cy="44" r="2" fill="#ef4444"/>
              </svg>
            </div>
            <h2 style={pms.title}>{t.payment.error}</h2>
            <p style={pms.subtitle}>{error || t.payment.errorDesc}</p>

            <button onClick={initializePayment} style={pms.copyButton}>
              {t.payment.tryAgain}
            </button>
            <button onClick={handleClose} style={pms.cancelButton}>
              {t.payment.close}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="payment-modal-overlay" style={pms.overlay} onClick={stage !== 'loading' ? handleClose : undefined}>
      <div className="payment-modal" style={pms.modal} onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// QR Code Component using qrcode library
const QRCode = ({ data, size = 200 }) => {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Dynamic import to handle SSR
        const QRCodeLib = await import('qrcode');
        const url = await QRCodeLib.toDataURL(data, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR generation error:', err);
        setError(true);
      }
    };

    generateQR();
  }, [data, size]);

  if (error) {
    // Fallback: show the address as text
    return (
      <div style={{
        width: size,
        height: size,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '10px',
        wordBreak: 'break-all',
        color: '#333'
      }}>
        {data}
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div style={{
        width: size,
        height: size,
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid #F7931A',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt="Bitcoin Payment QR Code"
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
};

export default PaymentModal;
