// KYWARD EMAIL TRANSLATIONS
// English and Spanish translations for payment confirmation emails

const emailTranslations = {
  en: {
    essential: {
      name: 'Essential Plan',
      subject: 'Your Bitcoin Security Assessment is Ready!',
      headline: 'Payment Confirmed!',
      intro: 'Thank you for purchasing the <strong>Essential Plan</strong>.',
      description: 'Your personalized Bitcoin Security Assessment is now available. Log in to complete the questionnaire and receive your comprehensive security report.',
      features: [
        'Complete security questionnaire',
        'Personalized security score (0-100)',
        'Risk analysis breakdown',
        'Customized recommendations',
        'Sparrow Wallet setup guide',
        'Multi-signature basics',
        'Downloadable PDF report'
      ],
      ctaText: 'Start Your Assessment',
      showCalendar: false
    },
    sentinel: {
      name: 'Sentinel Plan',
      subject: 'Welcome to Sentinel - Your Bitcoin Guardian!',
      headline: 'Subscription Activated!',
      intro: 'Thank you for subscribing to the <strong>Sentinel Plan</strong>.',
      description: 'Your premium subscription is now active. Enjoy continuous protection and monitoring for your Bitcoin security.',
      features: [
        'Everything in Essential',
        'Telegram security alerts',
        'Continuous monitoring',
        'Monthly security updates',
        'Priority support',
        'Inheritance planning tools',
        'Advanced Liana timelock setup'
      ],
      ctaText: 'Access Your Dashboard',
      showCalendar: false,
      badge: 'Monthly Subscription'
    },
    consultation: {
      name: 'Private Consultation',
      subject: 'Your Bitcoin Consultation is Confirmed!',
      headline: 'Consultation Booked!',
      intro: 'Thank you for booking a <strong>Private Consultation</strong>.',
      description: 'Your 1-hour private session with a Bitcoin security expert is confirmed. Schedule your appointment at your convenience.',
      features: [
        '1 hour private video call',
        'Personalized security audit',
        'Custom wallet setup assistance',
        'Multi-sig configuration help',
        'Inheritance strategy planning',
        'Q&A with security expert',
        'Follow-up summary email'
      ],
      ctaText: 'Schedule Your Consultation',
      showCalendar: true,
      badge: 'First Session - $99'
    },
    consultation_additional: {
      name: 'Additional Consultation',
      subject: 'Your Additional Consultation Session is Ready!',
      headline: 'Session Added!',
      intro: 'Thank you for purchasing an <strong>Additional Consultation Session</strong>.',
      description: 'Your extra consultation hour has been added to your account. Schedule your session at your convenience.',
      features: [
        '1 additional hour of consultation',
        'Continue where you left off',
        'Deep dive into specific topics',
        'Advanced configuration help',
        'Custom security solutions',
        'Ongoing support'
      ],
      ctaText: 'Schedule Your Session',
      showCalendar: true,
      badge: 'Additional Hour - $49'
    },
    common: {
      whatsIncluded: "What's Included:",
      scheduleSession: 'Schedule Your Session',
      scheduleSubtitle: 'Choose a time that works best for you',
      questions: 'Questions? Reply to this email or contact us at',
      footer: 'Bitcoin Security Made Simple',
      footerEmail: 'This email was sent to',
      footerWarning: 'Never share your seed phrase with anyone.'
    },
    fallback: {
      name: 'Premium Plan',
      subject: 'Your Kyward Purchase is Confirmed!',
      headline: 'Payment Confirmed!',
      intro: 'Thank you for your purchase.',
      description: 'Your order has been processed successfully.',
      features: ['Access to Kyward platform'],
      ctaText: 'Go to Kyward',
      showCalendar: false
    }
  },

  es: {
    essential: {
      name: 'Plan Essential',
      subject: '¡Tu Evaluación de Seguridad Bitcoin está Lista!',
      headline: '¡Pago Confirmado!',
      intro: 'Gracias por comprar el <strong>Plan Essential</strong>.',
      description: 'Tu Evaluación de Seguridad Bitcoin personalizada ya está disponible. Inicia sesión para completar el cuestionario y recibir tu informe de seguridad completo.',
      features: [
        'Cuestionario de seguridad completo',
        'Puntuación de seguridad personalizada (0-100)',
        'Análisis detallado de riesgos',
        'Recomendaciones personalizadas',
        'Guía de configuración de Sparrow Wallet',
        'Fundamentos de multi-firma',
        'Informe PDF descargable'
      ],
      ctaText: 'Comenzar Evaluación',
      showCalendar: false
    },
    sentinel: {
      name: 'Plan Sentinel',
      subject: '¡Bienvenido a Sentinel - Tu Guardián Bitcoin!',
      headline: '¡Suscripción Activada!',
      intro: 'Gracias por suscribirte al <strong>Plan Sentinel</strong>.',
      description: 'Tu suscripción premium ya está activa. Disfruta de protección continua y monitoreo para la seguridad de tu Bitcoin.',
      features: [
        'Todo lo del plan Essential',
        'Alertas de seguridad por Telegram',
        'Monitoreo continuo',
        'Actualizaciones de seguridad mensuales',
        'Soporte prioritario',
        'Herramientas de planificación de herencia',
        'Configuración avanzada de Liana timelock'
      ],
      ctaText: 'Acceder al Panel',
      showCalendar: false,
      badge: 'Suscripción Mensual'
    },
    consultation: {
      name: 'Consultoría Privada',
      subject: '¡Tu Consultoría Bitcoin está Confirmada!',
      headline: '¡Consultoría Reservada!',
      intro: 'Gracias por reservar una <strong>Consultoría Privada</strong>.',
      description: 'Tu sesión privada de 1 hora con un experto en seguridad Bitcoin está confirmada. Agenda tu cita cuando te sea conveniente.',
      features: [
        '1 hora de videollamada privada',
        'Auditoría de seguridad personalizada',
        'Asistencia en configuración de wallet',
        'Ayuda con configuración multi-firma',
        'Planificación de estrategia de herencia',
        'Preguntas y respuestas con experto',
        'Email de resumen post-consulta'
      ],
      ctaText: 'Agendar Consultoría',
      showCalendar: true,
      badge: 'Primera Sesión - $99'
    },
    consultation_additional: {
      name: 'Consultoría Adicional',
      subject: '¡Tu Sesión de Consultoría Adicional está Lista!',
      headline: '¡Sesión Agregada!',
      intro: 'Gracias por comprar una <strong>Sesión de Consultoría Adicional</strong>.',
      description: 'Tu hora extra de consultoría ha sido agregada a tu cuenta. Agenda tu sesión cuando te sea conveniente.',
      features: [
        '1 hora adicional de consultoría',
        'Continúa donde lo dejaste',
        'Profundiza en temas específicos',
        'Ayuda con configuración avanzada',
        'Soluciones de seguridad personalizadas',
        'Soporte continuo'
      ],
      ctaText: 'Agendar Sesión',
      showCalendar: true,
      badge: 'Hora Adicional - $49'
    },
    common: {
      whatsIncluded: 'Qué Incluye:',
      scheduleSession: 'Agenda Tu Sesión',
      scheduleSubtitle: 'Elige el horario que mejor te convenga',
      questions: '¿Preguntas? Responde a este email o contáctanos en',
      footer: 'Seguridad Bitcoin Simplificada',
      footerEmail: 'Este email fue enviado a',
      footerWarning: 'Nunca compartas tu frase semilla con nadie.'
    },
    fallback: {
      name: 'Plan Premium',
      subject: '¡Tu Compra en Kyward está Confirmada!',
      headline: '¡Pago Confirmado!',
      intro: 'Gracias por tu compra.',
      description: 'Tu orden ha sido procesada exitosamente.',
      features: ['Acceso a la plataforma Kyward'],
      ctaText: 'Ir a Kyward',
      showCalendar: false
    }
  }
};

/**
 * Get translations for a specific language
 * @param {string} language - 'en' or 'es'
 * @returns {object} Translation object for the language
 */
function getTranslations(language = 'en') {
  return emailTranslations[language] || emailTranslations.en;
}

/**
 * Get plan content for a specific plan and language
 * @param {string} plan - Plan type
 * @param {string} language - 'en' or 'es'
 * @returns {object} Plan content with translations
 */
function getPlanContent(plan, language = 'en') {
  const lang = emailTranslations[language] || emailTranslations.en;
  return lang[plan] || lang.fallback;
}

/**
 * Get common translations for a language
 * @param {string} language - 'en' or 'es'
 * @returns {object} Common translations
 */
function getCommonTranslations(language = 'en') {
  const lang = emailTranslations[language] || emailTranslations.en;
  return lang.common;
}

module.exports = {
  emailTranslations,
  getTranslations,
  getPlanContent,
  getCommonTranslations
};
