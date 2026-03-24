import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { useGLTF } from '@react-three/drei';

// Preload intro model ASAP
useGLTF.preload('/models/space_boi.glb');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
