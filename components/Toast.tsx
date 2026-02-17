
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  addToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  addPromise: <T>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // If context is missing, provide a fallback that wraps direct toast calls
    return {
      addToast: (message: string, type: ToastType = 'info', options: ToastOptions = { duration: 4000 }) => {
        if (options.duration === Infinity) {
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'} 
                max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 overflow-hidden border border-slate-200 dark:border-slate-700`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500">
                      <Info size={32} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg px-4 py-2 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ), options);
          return;
        }

        if (type === 'success') toast.success(message, options);
        else if (type === 'error') toast.error(message, options);
        else toast(message, { ...options, icon: <Info className="text-blue-500" size={20} /> });
      },
      // Use <T,> to prevent TSX parsing ambiguity
      addPromise: <T,>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) => {
        return toast.promise(promise, msgs);
      }
    };
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const addToast = useCallback((message: string, type: ToastType = 'info', customOptions?: ToastOptions) => {
    const options: ToastOptions = {
      duration: 4000,
      ...customOptions
    };

    // If duration is Infinity or specifically requested, use a custom dismissible toast
    if (options.duration === Infinity) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'} 
            max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 overflow-hidden border border-slate-200 dark:border-slate-700`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500">
                  <Info size={32} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-100 dark:border-slate-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg px-4 py-2 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), options);
      return;
    }

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
      default:
        toast(message, {
          ...options,
          icon: <Info className="text-blue-500" size={20} />,
        });
        break;
    }
  }, []);

  // Global Listener for Safety Interceptor Blocks
  useEffect(() => {
    const handleBlock = (e: any) => {
      const message = e.detail?.message || "Action Restricted: You are in 'View-Only' mode.";
      addToast(message, 'error');
    };

    window.addEventListener('IMPERSONATION_BLOCK_TOAST', handleBlock);
    return () => window.removeEventListener('IMPERSONATION_BLOCK_TOAST', handleBlock);
  }, [addToast]);

  const addPromise = useCallback(<T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => {
    return toast.promise(promise, {
      loading: msgs.loading,
      success: msgs.success,
      error: msgs.error,
    }, {
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-text)',
        border: '1px solid var(--toast-border)',
        padding: '12px 16px',
        borderRadius: '0.75rem',
      },
      success: {
        iconTheme: {
          primary: '#10b981',
          secondary: 'white',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: 'white',
        },
      },
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, addPromise }}>
      {children}
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          className: 'text-sm font-medium shadow-xl',
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-text)',
            border: '1px solid var(--toast-border)',
            padding: '12px 16px',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};
