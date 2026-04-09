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
      const timer = setTimeout(() => setModalOpen(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setBarVisible(true);
    }
  }, []);

  // Empuja el nav hacia abajo cuando la barra está visible
  useEffect(() => {
    if (barVisible && !modalOpen) {
      document.body.classList.add('has-manifesto-bar');
    } else {
      document.body.classList.remove('has-manifesto-bar');
    }
    return () => document.body.classList.remove('has-manifesto-bar');
  }, [barVisible, modalOpen]);

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
      {/* ── ESTILOS RESPONSIVE ── */}
      <style>{`
        .manifesto-bar-text {
          flex: 1;
          text-align: center;
          color: #d1d5db;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        /* Empuja el nav fijo hacia abajo cuando la barra está activa */
        body.has-manifesto-bar nav {
          top: 40px !important;
        }
        /* Landing page hero */
        body.has-manifesto-bar .hero-section {
          padding-top: 180px !important;
        }
        /* Dashboard main content */
        body.has-manifesto-bar .dashboard-main {
          padding-top: 140px !important;
        }
        /* Report page */
        body.has-manifesto-bar .report-container {
          padding-top: 100px !important;
        }
        /* Questionnaire page */
        body.has-manifesto-bar .questionnaire-container {
          padding-top: 140px !important;
        }
        /* Auth pages (login / signup) — shift the centered card down */
        body.has-manifesto-bar .auth-container {
          padding-top: 80px !important;
        }
        @media (max-width: 600px) {
          .manifesto-bar-text {
            font-size: 12px;
            white-space: normal;
            line-height: 1.4;
          }
          .manifesto-modal-box {
            padding: 36px 20px 28px !important;
          }
          .manifesto-modal-title {
            font-size: 18px !important;
          }
          .manifesto-modal-subtitle {
            font-size: 14px !important;
          }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      {barVisible && !modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1002, // por encima del nav (zIndex 1000)
          background: '#111',
          borderBottom: '1px solid rgba(247,147,26,0.3)',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 44px 10px 16px',
          gap: '8px',
          minHeight: '40px',
        }}>
          <button
            onClick={openModal}
            className="manifesto-bar-text"
          >
            <span style={{ color: '#F7931A', fontWeight: '700', marginRight: '6px' }}>₿</span>
            {m.bar}
          </button>
          <button
            onClick={() => setBarVisible(false)}
            style={{
              position: 'absolute', right: '10px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b7280', fontSize: '15px', lineHeight: 1,
              padding: '6px', flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── MODAL ── */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed', inset: 0, zIndex: 1003,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Caja del modal */}
          <div
            className="manifesto-modal-box"
            style={{
              position: 'fixed', zIndex: 1004,
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
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af', borderRadius: '8px',
                width: '32px', height: '32px', cursor: 'pointer',
                fontSize: '15px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>

            {/* Badge */}
            <div style={{
              display: 'inline-block', marginBottom: '16px',
              padding: '5px 14px', borderRadius: '20px',
              background: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.35)',
              fontSize: '11px', fontWeight: '700', color: '#F7931A',
              letterSpacing: '1.2px', textTransform: 'uppercase',
            }}>
              {m.badge}
            </div>

            {/* Título */}
            <h2
              className="manifesto-modal-title"
              style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 12px', lineHeight: 1.35 }}
            >
              {m.title}
            </h2>

            {/* Subtítulo */}
            <p
              className="manifesto-modal-subtitle"
              style={{ fontSize: '15px', color: '#9ca3af', margin: '0 0 24px', lineHeight: 1.65 }}
            >
              {m.subtitle}
            </p>

            {/* Formulario / Éxito */}
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
              <form
                onSubmit={handleSubmit}
                className="manifesto-modal-form"
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
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
