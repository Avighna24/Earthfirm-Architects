import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceMonitor } from './utils/performance.ts';

// Initialize core Web Vitals performance tracker in development
initPerformanceMonitor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
