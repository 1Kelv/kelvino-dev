// I bootstrap the Mylestone app with providers and routing
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './lib/AuthContext';
import { BabyProvider } from './lib/BabyContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BabyProvider>
          <App />
        </BabyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
