import React, { useEffect, useRef, useState } from 'react';

/**
 * TelegramBlur Component
 * Creates an animated blur effect similar to Telegram's premium features
 * with floating stars, moving gradient shadow, and shimmer effects
 */
const TelegramBlur = ({
  children,
  isRevealed = false,
  onReveal,
  revealText = 'Click to reveal',
  hiddenText = 'Click to hide',
  height = 'auto',
  showStars = true,
  showLockIcon = true,
  accentColor = '#F7931A'
}) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [stars, setStars] = useState([]);

  // Generate random stars on mount
  useEffect(() => {
    if (showStars) {
      const newStars = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.3
      }));
      setStars(newStars);
    }
  }, [showStars]);

  // Track mouse for spotlight effect
  useEffect(() => {
    if (isRevealed) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isRevealed]);

  // Auto-animate mouse position when not hovering
  useEffect(() => {
    if (isRevealed) return;

    const interval = setInterval(() => {
      setMousePosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 10,
        y: prev.y + (Math.random() - 0.5) * 10
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isRevealed]);

  return (
    <div
      ref={containerRef}
      onClick={onReveal}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        cursor: onReveal ? 'pointer' : 'default',
        height,
        transition: 'all 0.5s ease'
      }}
    >
      {/* Content Layer */}
      <div
        style={{
          filter: isRevealed ? 'none' : 'blur(12px)',
          transition: 'filter 0.5s ease',
          userSelect: isRevealed ? 'text' : 'none',
          pointerEvents: isRevealed ? 'auto' : 'none'
        }}
      >
        {children}
      </div>

      {/* Blur Overlay - Only show when not revealed */}
      {!isRevealed && (
        <>
          {/* Moving Gradient Shadow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(
                  circle at ${mousePosition.x}% ${mousePosition.y}%,
                  transparent 0%,
                  rgba(0,0,0,0.3) 30%,
                  rgba(0,0,0,0.6) 70%,
                  rgba(0,0,0,0.8) 100%
                )
              `,
              transition: 'background 0.3s ease',
              pointerEvents: 'none'
            }}
          />

          {/* Animated Gradient Wave */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(
                135deg,
                transparent 0%,
                rgba(${hexToRgb(accentColor)}, 0.1) 25%,
                transparent 50%,
                rgba(${hexToRgb(accentColor)}, 0.15) 75%,
                transparent 100%
              )`,
              backgroundSize: '400% 400%',
              animation: 'gradientWave 8s ease infinite',
              pointerEvents: 'none'
            }}
          />

          {/* Floating Stars */}
          {showStars && stars.map(star => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 ${star.size * 2}px ${accentColor}`,
                opacity: star.opacity,
                animation: `floatStar ${star.duration}s ease-in-out ${star.delay}s infinite`,
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Sparkle Stars (4-pointed) */}
          {showStars && stars.slice(0, 8).map(star => (
            <div
              key={`sparkle-${star.id}`}
              style={{
                position: 'absolute',
                left: `${(star.x + 20) % 100}%`,
                top: `${(star.y + 30) % 100}%`,
                animation: `sparkleStar ${star.duration + 1}s ease-in-out ${star.delay}s infinite`,
                pointerEvents: 'none'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 0L6.5 4.5L11 6L6.5 6.5L6 11L5.5 6.5L0 6L5.5 4.5L6 0Z"
                  fill={accentColor}
                  style={{ filter: `drop-shadow(0 0 2px ${accentColor})` }}
                />
              </svg>
            </div>
          ))}

          {/* Center Lock Icon */}
          {showLockIcon && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                animation: 'pulseGlow 2s ease-in-out infinite',
                zIndex: 10
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}20 100%)`,
                  border: `2px solid ${accentColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 30px ${accentColor}40`
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke={accentColor} strokeWidth="2"/>
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1" fill={accentColor}/>
                </svg>
              </div>
              {onReveal && (
                <span
                  style={{
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '600',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {revealText}
                </span>
              )}
            </div>
          )}

          {/* Shimmer Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '50%',
              height: '100%',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(255,255,255,0.05) 50%,
                transparent 100%
              )`,
              animation: 'shimmer 3s ease-in-out infinite',
              pointerEvents: 'none'
            }}
          />
        </>
      )}

      {/* Revealed State - Hide Button */}
      {isRevealed && onReveal && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReveal();
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '6px 12px',
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${accentColor}40`,
            borderRadius: '8px',
            color: '#9ca3af',
            fontSize: '12px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            zIndex: 10
          }}
        >
          {hiddenText}
        </button>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatStar {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, -15px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translate(-5px, -25px) scale(1);
            opacity: 0.5;
          }
          75% {
            transform: translate(15px, -10px) scale(1.3);
            opacity: 0.9;
          }
        }

        @keyframes sparkleStar {
          0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '247, 147, 26'; // Default orange
}

export default TelegramBlur;
