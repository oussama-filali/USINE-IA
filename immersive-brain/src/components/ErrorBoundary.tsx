import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white p-8">
          <div className="max-w-lg text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-light tracking-widest mb-4">
              ERREUR SYSTÈME
            </h1>
            <p className="text-sm opacity-70 mb-8 font-mono">
              {this.state.error?.message || 'Une erreur inattendue s\'est produite'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all tracking-widest text-xs"
            >
              RECHARGER L'EXPÉRIENCE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
