import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';

const STORAGE_KEY = 'kyward_manifesto_dismissed';

const ManifestoModal = () => {
  const { t } = useLanguage();
  const m = t.manifesto;

  const [modalOpen, setModalOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // First visit — show modal after delay
      const timer = setTimeout(() => setModalOpen(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Already dismissed — show top bar instead
      setBarVisible(true);
    }
  }, []);

  const closeModal = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setModalOpen(false);
    setBarVisible(true);
  };

  const openModal = () => {
    setBarVisible(false);
    setStatus('idle');
    setEmail('');
    setErrorMsg('');
    setModalOpen(true);
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
        setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, '1');
          setModalOpen(false);
          setBarVisible(false);
        }, 3000);
      } else {
        setErrorMsg(data.error || m.error);
        setStatus('error');
      }
    } catch {
      setErrorMsg(m.errorConnection);
      setStatus('error');
    }
  };

  return (
    <>
      {/* TOP BAR */}
      {barVisible && !modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          background: '#1a1a1a',
          borderBottom: '1px solid rgba(247,147,26,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '10px 48px', gap: '12px',
          fontSize: '13px', fontWeight: '500',
        }}>
          <button
            onClick={openModal}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#d1d5db', fontSize: '13px', fontWeight: '500',
              padding: 0, textAlign: 'center', flex: 1,
            }}
          >
            <span style={{ color: '#F7931A', fontWeight: '700', marginRight: '6px' }}>₿</span>
            {m.bar}
          </button>
          <button
            onClick={() => setBarVisible(false)}
            style={{
              position: 'absolute', right: '12px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b7280', fontSize: '16px', lineHeight: 1,
              padding: '4px 6px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal box */}
          <div style={{
            position: 'fixed', zIndex: 1001,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)', maxWidth: '520px',
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
              onClick={closeModal}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af', borderRadius: '8px',
                width: '32px', height: '32px', cursor: 'pointer',
                fontSize: '16px', display: 'flex',
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
              {m.badge}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '22px', fontWeight: '800', color: '#fff',
              margin: '0 0 14px', lineHeight: 1.35,
            }}>
              {m.title}
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '15px', color: '#9ca3af',
              margin: '0 0 28px', lineHeight: 1.65,
            }}>
              {m.subtitle}
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
                {m.success}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={m.placeholder}
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
                  {status === 'loading' ? m.loading : m.cta}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p style={{ marginTop: '10px', color: '#f87171', fontSize: '13px' }}>{errorMsg}</p>
            )}

            <p style={{ marginTop: '14px', fontSize: '12px', color: '#4b5563' }}>
              {m.disclaimer}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default ManifestoModal;
