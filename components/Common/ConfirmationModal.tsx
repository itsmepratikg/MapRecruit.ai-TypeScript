import React from 'react';
import { AlertTriangle, Trash2, Save, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    icon?: 'danger' | 'warning' | 'save' | 'info';
    variant?: 'danger' | 'primary' | 'success';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon = 'warning',
    variant = 'primary'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (icon) {
            case 'danger': return <Trash2 size={24} />;
            case 'save': return <Save size={24} />;
            case 'warning': return <AlertTriangle size={24} />;
            default: return <AlertTriangle size={24} />;
        }
    };

    const getIconBg = () => {
        switch (variant) {
            case 'danger': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
            case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            default: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
        }
    };

    const getButtonClass = () => {
        switch (variant) {
            case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
            case 'success': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
            default: return 'bg-emerald-600 hover:bg-emerald-700 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${getIconBg()}`}>
                        {getIcon()}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-balance">
                        {message}
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors ${getButtonClass()}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
