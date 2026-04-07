import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'kyward_manifesto_dismissed';

const ManifestoModal = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Show after a short delay so the page loads first
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://api.kyward.com'}/api/manifesto/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        // Close automatically after 3 seconds on success
        setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, '1');
          setVisible(false);
        }, 3000);
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
      setStatus('error');
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', zIndex: 1001,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: '520px',
        margin: '0 16px',
        background: 'linear-gradient(145deg, #111 0%, #1a1a1a 100%)',
        border: '1px solid rgba(247,147,26,0.3)',
        borderRadius: '20px',
        padding: '48px 40px 36px',
        textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(247,147,26,0.08)',
        boxSizing: 'border-box',
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#9ca3af', borderRadius: '8px',
            width: '32px', height: '32px', cursor: 'pointer',
            fontSize: '16px', lineHeight: 1, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Badge */}
        <div style={{
          display: 'inline-block', marginBottom: '20px',
          padding: '5px 14px', borderRadius: '20px',
          background: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.35)',
          fontSize: '11px', fontWeight: '700', color: '#F7931A',
          letterSpacing: '1.2px', textTransform: 'uppercase',
        }}>
          Free Guide
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '24px', fontWeight: '800', color: '#fff',
          margin: '0 0 14px', lineHeight: 1.3,
        }}>
          The last guide you'll need to understand why you need Bitcoin self-custody
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '15px', color: '#9ca3af',
          margin: '0 0 28px', lineHeight: 1.65,
        }}>
          Keeping your Bitcoin on an exchange is the #1 mistake most holders make.
          This free report shows you exactly what's at risk — and how to fix it.
        </p>

        {/* Form / Success */}
        {status === 'success' ? (
          <div style={{
            padding: '18px 20px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px',
            color: '#4ade80', fontWeight: '600', fontSize: '15px',
          }}>
            You're in. Check your inbox shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%', padding: '14px 18px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '15px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: status === 'loading' ? '#a05a0a' : '#F7931A',
                color: '#000', fontWeight: '700', fontSize: '16px',
                cursor: status === 'loading' ? 'default' : 'pointer',
              }}
            >
              {status === 'loading' ? 'Sending...' : 'Send me the free guide'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ marginTop: '10px', color: '#f87171', fontSize: '13px' }}>{errorMsg}</p>
        )}

        <p style={{ marginTop: '14px', fontSize: '12px', color: '#4b5563' }}>
          No account needed. No spam. Unsubscribe anytime.
        </p>
      </div>
    </>
  );
};

export default ManifestoModal;
