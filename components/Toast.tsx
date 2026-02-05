
import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  addPromise: <T>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // If context is missing, provide a fallback that wraps direct toast calls
    return {
      addToast: (message: string, type: ToastType = 'info') => {
        const options: ToastOptions = { duration: 4000 };
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

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const options: ToastOptions = {
      duration: 4000,
    };

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
