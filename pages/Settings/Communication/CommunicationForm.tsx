import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, Save, Trash2, Mail, Phone, MessageSquare,
    ShieldCheck, Check, X, ShieldAlert, Globe, User,
    Link as LinkIcon, Smartphone, ChevronDown, CheckCircle2,
    Loader2, Edit2, XCircle, RotateCcw
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { communicationSenderService } from '../../../services/api';
import { ConfirmationModal } from '../../../components/Common/ConfirmationModal';
import { ActionButtons } from '../../../components/Common/ActionButtons';
export const CommunicationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(id === 'new');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [formData, setFormData] = useState<any>({
        name: '',
        provider: '',
        channel: 'Email',
        email: '',
        phoneNumber: '',
        internationalCode: '',
        active: true,
        verified: false,
        senderSignature: '',
        module: 'ReachOut'
    });
    const [originalData, setOriginalData] = useState<any>(null);

    useEffect(() => {
        if (id && id !== 'new') {
            fetchSender();
        } else {
            setLoading(false);
            setOriginalData({ ...formData });
        }
    }, [id]);

    const fetchSender = async () => {
        try {
            setLoading(true);
            const data = await communicationSenderService.getById(id);
            setFormData(data);
            setOriginalData(data);
        } catch (error) {
            addToast(t("Failed to load sender details"), 'error');
            navigate('/settings/communication');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            if (id && id !== 'new') {
                await communicationSenderService.update(id, formData);
                addToast(t("Sender updated successfully"), 'success');
                setOriginalData({ ...formData });
                setIsEditing(false);
            } else {
                await communicationSenderService.create(formData);
                addToast(t("Sender created successfully"), 'success');
                navigate('/settings/communication');
            }
        } catch (error) {
            addToast(t("Failed to save sender"), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await communicationSenderService.delete(id);
            addToast(t("Sender deleted successfully"), 'success');
            navigate('/settings/communication');
        } catch (error) {
            addToast(t("Failed to delete sender"), 'error');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleDiscard = () => {
        if (JSON.stringify(formData) !== JSON.stringify(originalData)) {
            setShowDiscardModal(true);
        } else {
            setIsEditing(false);
        }
    };

    const confirmDiscard = () => {
        setFormData(originalData);
        setIsEditing(id === 'new' ? true : false);
        setShowDiscardModal(false);
        if (id === 'new') navigate('/settings/communication');
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-500 font-bold">{t("Fetching Record...")}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden">
            {/* Header Area */}
            <div className="px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm z-10 transition-all">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/settings/communication')}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 hover:text-emerald-600 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {id === 'new' ? t("Add New Sender") : formData.name}
                            </h2>
                            {formData.verified ? (
                                <span className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                                    {t("Verified")}
                                </span>
                            ) : (
                                <span className="bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800/50">
                                    {t("Pending")}
                                </span>
                            )}
                        </div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-widest flex items-center gap-2">
                            {t("Communication Identity Configuration")}
                            {isEditing && <span className="text-emerald-600 font-black text-[9px] bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">• {t("EDITING")}</span>}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {id !== 'new' && !isEditing && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-200"
                            title={t("Delete Sender")}
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <ActionButtons
                        isEditing={isEditing}
                        onEdit={() => setIsEditing(true)}
                        onSave={() => handleSave()}
                        onDiscard={handleDiscard}
                        isSaving={saving}
                    />
                </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                    <form className={`grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${!isEditing ? 'pointer-events-none opacity-90' : ''}`}>
                        {/* Section 1: Basic Info */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600">
                                    <User size={18} />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{t("Identities")}</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Display Name")}</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 dark:text-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:border-transparent"
                                    placeholder={t("Enter friendly name")}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Provider")}</label>
                                <div className="relative group">
                                    <select
                                        disabled={!isEditing}
                                        className="appearance-none w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 pr-10 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:border-transparent disabled:cursor-default"
                                        value={formData.provider}
                                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                    >
                                        <option value="">{t("Select Provider")}</option>
                                        <option value="Postmark">Postmark</option>
                                        <option value="Twilio">Twilio</option>
                                        <option value="SendGrid">SendGrid</option>
                                        <option value="AWS SES">AWS SES</option>
                                    </select>
                                    {isEditing && <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Channel")}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Email', 'SMS', 'Phone'].map(ch => (
                                        <button
                                            key={ch}
                                            type="button"
                                            disabled={!isEditing}
                                            onClick={() => setFormData({ ...formData, channel: ch })}
                                            className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 flex flex-col items-center gap-2 ${formData.channel === ch ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105 z-10' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                                        >
                                            {ch === 'Email' ? <Mail size={16} /> : ch === 'SMS' ? <MessageSquare size={16} /> : <Phone size={16} />}
                                            {t(ch)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact Details */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-purple-600">
                                    <Globe size={18} />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{t("Connection Points")}</h3>
                            </div>

                            {formData.channel === 'Email' ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Email Address")}</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 dark:text-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:border-transparent"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <Mail size={18} className="absolute left-4 top-3.5 text-slate-300" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Code")}</label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-center outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:border-transparent"
                                                placeholder="+1"
                                                value={formData.internationalCode}
                                                onChange={(e) => setFormData({ ...formData, internationalCode: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Phone Number")}</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none transition-all disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:border-transparent"
                                                    placeholder="555-0123"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                />
                                                <Smartphone size={18} className="absolute left-4 top-3.5 text-slate-300" />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl transition-all ${formData.active ? 'bg-emerald-100 text-emerald-600 shadow-emerald-500/10 shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{t("Activate Sender")}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{t("Allow this identity to be used for campaigns")}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={!isEditing}
                                        onClick={() => setFormData({ ...formData, active: !formData.active })}
                                        className={`relative inline-flex items-center h-6.5 w-12 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${formData.active ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-700'} ${!isEditing ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${formData.active ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Extra Attributes */}
                        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-600">
                                    <ShieldAlert size={18} />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{t("Advanced Configurations")}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Sender Signature")}</label>
                                    <textarea
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold outline-none h-28 transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:border-transparent"
                                        placeholder={t("Paste your signature here...")}
                                        value={formData.senderSignature}
                                        onChange={(e) => setFormData({ ...formData, senderSignature: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t("Module Target")}</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 cursor-not-allowed"
                                            value={formData.module}
                                            readOnly
                                        />
                                    </div>
                                    <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                        <div className="flex gap-4">
                                            <div className="text-emerald-500 mt-0.5">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter">{t("Identity Security")}</p>
                                                <p className="text-[10px] font-bold text-emerald-700/60 dark:text-emerald-500/60 mt-1 leading-relaxed">
                                                    {t("All identities require verification through the respective provider before they can be used for outbound communication. This prevents spoofing and ensures high deliverability.")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modals */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title={t("Delete Sender")}
                message={t("Are you sure you want to permanently delete this communication sender? This action cannot be undone.")}
                confirmText={t("Delete Permanently")}
                variant="danger"
                icon="danger"
            />

            <ConfirmationModal
                isOpen={showDiscardModal}
                onClose={() => setShowDiscardModal(false)}
                onConfirm={confirmDiscard}
                title={t("Unsaved Changes")}
                message={t("You have modified this sender. Discarding will revert all changes to their original state. Continue?")}
                confirmText={t("Discard Changes")}
                cancelText={t("Keep Editing")}
                variant="danger"
                icon="warning"
            />
        </div>
    );
};
