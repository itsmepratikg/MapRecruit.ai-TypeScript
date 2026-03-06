import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, X, Save, Loader2, Undo2 } from '../Icons';

export interface ActionButtonsProps {
    isEditing: boolean;
    onEdit: () => void;
    onSave: (e?: React.FormEvent) => void;
    onDiscard: () => void;
    isSaving?: boolean;
    disabled?: boolean;
    editLabel?: string;
    saveLabel?: string;
    discardLabel?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    isEditing,
    onEdit,
    onSave,
    onDiscard,
    isSaving = false,
    disabled = false,
    editLabel,
    saveLabel,
    discardLabel
}) => {
    const { t } = useTranslation();

    const textEdit = editLabel || t("Edit Details");
    const textSave = saveLabel || t("Save Changes");
    const textDiscard = discardLabel || t("Discard");

    if (!isEditing) {
        return (
            <button
                type="button"
                onClick={onEdit}
                className="group flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
                <Edit2 size={18} className="group-hover:scale-110 transition-transform" />
                {textEdit}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="group flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-sm transition-all hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 hover:border-red-200 active:scale-95 disabled:opacity-50"
            >
                <Undo2 size={18} className="group-hover:-rotate-45 transition-transform" />
                {textDiscard}
            </button>
            <button
                type="button"
                onClick={onSave}
                disabled={disabled || isSaving}
                className="group flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
                {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                )}
                {textSave}
            </button>
        </div>
    );
};
