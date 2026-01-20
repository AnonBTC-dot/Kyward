// KYWARD EMAIL SERVICE
// Handles sending PDF reports via email using backend API

import { generateRecommendations } from './Recommendations';
import { kywardDB } from './Database';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Send security plan email with PDF attachment
 * The backend generates the password-protected PDF and attaches it
 */
export const sendSecurityPlanEmail = async (user, score, answers) => {
  const pdfPassword = user.pdfPassword;

  if (!pdfPassword) {
    return {
      success: false,
      error: 'No PDF password found. Please upgrade your account first.'
    };
  }

  try {
    const token = kywardDB.getToken();

    // Generate recommendations from answers
    const recommendations = generateRecommendations(answers, score);

    const response = await fetch(`${API_URL}/email/send-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        score,
        recommendations: recommendations.map(r => ({
          title: r.title,
          shortTip: r.shortTip,
          priority: r.priority,
          category: r.category
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true, message: data.message };

  } catch (error) {
    console.error('Email send error:', error);

    // If backend not available, return demo mode
    if (error.message.includes('Failed to fetch')) {
      return {
        success: true,
        demo: true,
        message: 'Backend not available. Email would be sent in production.'
      };
    }

    return { success: false, error: error.message };
  }
};
