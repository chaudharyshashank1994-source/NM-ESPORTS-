import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '420px', background: '#171717', border: '1px solid #262626', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '12px' }}>NM Esports Application Error</h2>
            <p style={{ fontSize: '12px', color: '#a3a3a3', marginBottom: '16px', wordBreak: 'break-all' }}>
              {this.state.error?.message || 'An unexpected error occurred while loading.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ width: '100%', padding: '12px', background: '#f59e0b', color: '#0a0a0a', fontWeight: 'bold', fontSize: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
