import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDelete?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDelete = false
}) => {
  const { t } = useTranslation();
  const effectiveConfirmText = confirmText || t("Confirm");
  const effectiveCancelText = cancelText || t("Cancel");
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200/50 dark:border-slate-800">
        <div className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isDelete ? 'bg-red-50 dark:bg-red-900/20 text-red-500 shadow-inner' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 shadow-inner'}`}>
            <AlertTriangle size={36} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">{title}</h3>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
            {message}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`w-full py-3.5 text-white rounded-2xl font-bold transition-all hover:-translate-y-0.5 active:scale-95 ${isDelete ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none'}`}
            >
              {effectiveConfirmText}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {effectiveCancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
