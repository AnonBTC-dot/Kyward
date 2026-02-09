import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';

// Payment methods configuration
// comingSoon: true means the method is built but not yet available (BTCPay Server not deployed)
const PAYMENT_METHODS = [
  {
    id: 'lightning',
    name: 'Lightning',
    icon: 'lightning',
    badge: 'Instant',
    description: 'Fastest, lowest fees',
    time: '< 1 minute',
    color: '#F7931A',
    comingSoon: true  // BTCPay Server required
  },
  {
    id: 'onchain',
    name: 'Bitcoin',
    icon: 'bitcoin',
    badge: 'Private',
    description: 'Direct to wallet',
    time: '10-60 minutes',
    color: '#F7931A',
    comingSoon: false  // Active - HD derivation
  },
  {
    id: 'liquid',
    name: 'Liquid',
    icon: 'liquid',
    badge: 'Fast',
    description: 'L-BTC or L-USDT',
    time: '1-2 minutes',
    color: '#00AAFF',
    comingSoon: true,  // BTCPay Server required
    networks: [
      { id: 'lbtc', name: 'L-BTC', description: 'Liquid Bitcoin' },
      { id: 'lusdt', name: 'L-USDT', description: 'Liquid Tether' }
    ]
  },
  {
    id: 'usdt',
    name: 'USDT',
    icon: 'usdt',
    badge: 'Stable',
    description: 'Tron (TRC20) or Ethereum (ERC20)',
    time: '1-10 minutes',
    color: '#26A17B',
    comingSoon: false,  // Direct blockchain monitoring - no third party
    networks: [
      { id: 'usdttrc20', name: 'Tron (TRC20)', fee: '~$1' },
      { id: 'usdterc20', name: 'Ethereum (ERC20)', fee: '~$5-20' }
    ]
  },
  {
    id: 'lemonsqueezy',
    name: 'Credit/Debit Card',
    icon: 'card',
    badge: 'Secure',
    description: 'Visa, Mastercard, PayPal & more',
    time: '< 1 minute',
    color: '#7c3aed',
    comingSoon: true  // Waiting for Lemon Squeezy account setup
  }
];

// Icons for payment methods
const PaymentIcon = ({ type, size = 32 }) => {
  const iconStyle = {
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  switch (type) {
    case 'lightning':
      return (
        <div style={iconStyle}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14H11L10 22L19 10H12L13 2Z" fill="#F7931A" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    case 'bitcoin':
      return (
        <div style={iconStyle}>
          <svg width={size} height={size} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#F7931A"/>
            <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">₿</text>
          </svg>
        </div>
      );
    case 'liquid':
      return (
        <div style={iconStyle}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#00AAFF"/>
            <path d="M12 6C12 6 8 10 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 10 12 6 12 6Z" fill="#fff"/>
          </svg>
        </div>
      );
    case 'usdt':
      return (
        <div style={iconStyle}>
          <svg width={size} height={size} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#26A17B"/>
            <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">$</text>
          </svg>
        </div>
      );
    case 'card':
      return (
        <div style={iconStyle}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#7c3aed"/>
            <rect x="2" y="8" width="20" height="3" fill="#5b21b6"/>
            <rect x="5" y="14" width="6" height="2" rx="1" fill="#fff" opacity="0.8"/>
            <circle cx="17" cy="15" r="2" fill="#fff" opacity="0.6"/>
            <circle cx="19" cy="15" r="2" fill="#fff" opacity="0.4"/>
          </svg>
        </div>
      );
    default:
      return null;
  }
};

const PaymentMethodSelector = ({
  availableMethods = [],
  onSelect,
  selectedMethod = null,
  selectedNetwork = null,
  disabled = false
}) => {
  const { t } = useLanguage();
  const [expandedMethod, setExpandedMethod] = useState(null);

  // Always show all payment methods - Coming Soon ones are marked with comingSoon: true
  // The availableMethods prop is ignored for display purposes since we want to show
  // all options with Coming Soon badges for methods not yet configured
  const methods = PAYMENT_METHODS;

  // Auto-select first AVAILABLE (non-coming-soon) method if none selected
  useEffect(() => {
    if (!selectedMethod && methods.length > 0) {
      const firstAvailableMethod = methods.find(m => !m.comingSoon);
      if (firstAvailableMethod) {
        if (firstAvailableMethod.networks) {
          setExpandedMethod(firstAvailableMethod.id);
        } else {
          onSelect(firstAvailableMethod.id, null);
        }
      }
    }
  }, [methods]);

  const handleMethodClick = (method) => {
    if (disabled || method.comingSoon) return;

    if (method.networks) {
      // Toggle expansion for methods with networks
      if (expandedMethod === method.id) {
        setExpandedMethod(null);
      } else {
        setExpandedMethod(method.id);
      }
    } else {
      // Direct selection for methods without networks
      setExpandedMethod(null);
      onSelect(method.id, null);
    }
  };

  const handleNetworkSelect = (methodId, networkId) => {
    if (disabled) return;
    const method = methods.find(m => m.id === methodId);
    if (method?.comingSoon) return;
    onSelect(methodId, networkId);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    methodCard: (isSelected, isExpanded, color, isComingSoon) => ({
      background: isComingSoon
        ? 'rgba(75,85,99,0.2)'
        : isSelected ? `rgba(${hexToRgb(color)}, 0.1)` : 'rgba(255,255,255,0.05)',
      border: `2px solid ${isComingSoon ? 'rgba(75,85,99,0.4)' : isSelected ? color : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '12px',
      padding: '16px',
      cursor: isComingSoon || disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      opacity: isComingSoon ? 0.6 : disabled ? 0.5 : 1,
      position: 'relative',
      overflow: 'hidden'
    }),
    comingSoonOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
      pointerEvents: 'none',
      zIndex: 1
    },
    comingSoonBadge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: '#fff',
      fontSize: '10px',
      fontWeight: '700',
      padding: '4px 10px',
      borderRadius: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
      zIndex: 2,
      animation: 'pulse 2s infinite'
    },
    methodHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    methodInfo: {
      flex: 1
    },
    methodName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    badge: (color) => ({
      background: color,
      color: '#fff',
      fontSize: '10px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '4px',
      textTransform: 'uppercase'
    }),
    methodDesc: {
      fontSize: '13px',
      color: '#9ca3af',
      margin: '4px 0 0 0'
    },
    methodTime: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'right'
    },
    checkmark: (isSelected, color) => ({
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: `2px solid ${isSelected ? color : '#4b5563'}`,
      background: isSelected ? color : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    networksContainer: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    networkButton: (isSelected, color) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      background: isSelected ? `rgba(${hexToRgb(color)}, 0.2)` : 'rgba(255,255,255,0.05)',
      border: `1px solid ${isSelected ? color : 'rgba(255,255,255,0.1)'}`,
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease'
    }),
    networkName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#fff'
    },
    networkFee: {
      fontSize: '12px',
      color: '#9ca3af'
    },
    expandIcon: (isExpanded) => ({
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      color: '#6b7280'
    })
  };

  // Helper to convert hex to rgb
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '247, 147, 26';
  }

  return (
    <div style={styles.container}>
      <h3 style={{
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 16px 0',
        textAlign: 'center'
      }}>
        {t.payment?.selectMethod || 'Select Payment Method'}
      </h3>

      {methods.map((method) => {
        const isSelected = selectedMethod === method.id;
        const isExpanded = expandedMethod === method.id;
        const hasNetworks = method.networks && method.networks.length > 0;
        const isComingSoon = method.comingSoon;

        return (
          <div key={method.id}>
            <div
              style={styles.methodCard(isSelected && !hasNetworks, isExpanded, method.color, isComingSoon)}
              onClick={() => handleMethodClick(method)}
            >
              {/* Coming Soon overlay and badge */}
              {isComingSoon && (
                <>
                  <div style={styles.comingSoonOverlay} />
                  <div style={styles.comingSoonBadge}>Coming Soon</div>
                </>
              )}

              <div style={{ ...styles.methodHeader, position: 'relative', zIndex: 0 }}>
                <div style={{ opacity: isComingSoon ? 0.5 : 1 }}>
                  <PaymentIcon type={method.icon} size={40} />
                </div>

                <div style={{ ...styles.methodInfo, opacity: isComingSoon ? 0.7 : 1 }}>
                  <p style={styles.methodName}>
                    {method.name}
                    {!isComingSoon && (
                      <span style={styles.badge(method.color)}>{method.badge}</span>
                    )}
                  </p>
                  <p style={styles.methodDesc}>{method.description}</p>
                </div>

                <div style={{ textAlign: 'right', opacity: isComingSoon ? 0.5 : 1 }}>
                  <p style={styles.methodTime}>{method.time}</p>
                  {!isComingSoon && (
                    hasNetworks ? (
                      <svg
                        style={styles.expandIcon(isExpanded)}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    ) : (
                      <div style={styles.checkmark(isSelected, method.color)}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Networks dropdown - only for non-coming-soon methods */}
              {hasNetworks && isExpanded && !isComingSoon && (
                <div style={styles.networksContainer}>
                  {method.networks.map((network) => {
                    const isNetworkSelected = selectedMethod === method.id && selectedNetwork === network.id;

                    return (
                      <div
                        key={network.id}
                        style={styles.networkButton(isNetworkSelected, method.color)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNetworkSelect(method.id, network.id);
                        }}
                      >
                        <div>
                          <span style={styles.networkName}>{network.name}</span>
                          {network.description && (
                            <span style={{ ...styles.networkFee, marginLeft: '8px' }}>
                              {network.description}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {network.fee && (
                            <span style={styles.networkFee}>Fee: {network.fee}</span>
                          )}
                          <div style={styles.checkmark(isNetworkSelected, method.color)}>
                            {isNetworkSelected && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* CSS Animation for Coming Soon badge */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default PaymentMethodSelector;
