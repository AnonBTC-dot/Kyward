import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/Responsive.css';
import App from './App.jsx';
import { kywardDB } from './services/Database'; // ← Importa aquí

// Exponer kywardDB globalmente para debug (solo en desarrollo)
if (import.meta.env.DEV) {
  window.kywardDB = kywardDB;
  console.log('✅ kywardDB expuesto globalmente desde main.jsx para debug');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);