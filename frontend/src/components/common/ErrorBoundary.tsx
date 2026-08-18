import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React Component Tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#070a0f] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                An unexpected interface error occurred. Don't worry, your cart and session data are safe.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left text-xs text-rose-400 font-mono overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-500 text-black font-bold text-xs sm:text-sm hover:bg-brand-400 transition flex items-center justify-center gap-2 shadow-neon"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-xs sm:text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
