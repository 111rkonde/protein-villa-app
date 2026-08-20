import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Lock,
  Sparkles,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'auth';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'auth':
        return <Lock className="w-5 h-5 text-cyan-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          wrapper: 'bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/50 ring-1 ring-emerald-500/20',
          badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          title: 'text-emerald-400',
          progress: 'bg-emerald-500',
        };
      case 'error':
        return {
          wrapper: 'bg-slate-900/95 text-white border-rose-500/50 shadow-rose-950/50 ring-1 ring-rose-500/20',
          badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          title: 'text-rose-400',
          progress: 'bg-rose-500',
        };
      case 'warning':
        return {
          wrapper: 'bg-slate-900/95 text-white border-amber-500/50 shadow-amber-950/50 ring-1 ring-amber-500/20',
          badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          title: 'text-amber-400',
          progress: 'bg-amber-500',
        };
      case 'auth':
        return {
          wrapper: 'bg-slate-900/95 text-white border-cyan-500/50 shadow-cyan-950/50 ring-1 ring-cyan-500/20',
          badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          title: 'text-cyan-400',
          progress: 'bg-cyan-500',
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-slate-900/95 text-white border-slate-700/60 shadow-slate-950/50 ring-1 ring-slate-700/30',
          badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          title: 'text-blue-400',
          progress: 'bg-brand-500',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container - Positioned at top for clear visibility without blocking inputs */}
      <div className="fixed top-4 sm:top-6 right-0 sm:right-6 left-0 sm:left-auto z-[120] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 mx-auto sm:mx-0">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-slide-up ${styles.wrapper}`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-xl shrink-0 border ${styles.badge}`}>
                  {getToastIcon(toast.type)}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  {toast.title && (
                    <div className={`font-bold text-xs uppercase tracking-wider mb-0.5 ${styles.title}`}>
                      {toast.title}
                    </div>
                  )}
                  <p className="text-xs text-gray-200 font-medium leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Animated bottom progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
                <div className={`h-full ${styles.progress} animate-[shrink_4.5s_linear_forwards]`} />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
