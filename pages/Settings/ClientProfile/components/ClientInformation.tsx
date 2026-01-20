
import React, { useState } from 'react';
import { ClientData } from '../../../../Schema/ClientSchema';
import { useTranslation } from 'react-i18next';
import { Save, Building2, Globe, Mail, Phone, MapPin, Clock, Calendar } from '../../../../components/Icons';
import { useToast } from '../../../../components/Toast';

interface ClientInformationProps {
    client: ClientData;
}

export const ClientInformation = ({ client }: ClientInformationProps) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [editMode, setEditMode] = useState(false);

    // Manage form state
    const [formData, setFormData] = useState<any>(client);

    const handleSave = () => {
        setEditMode(false);
        addToast(t("Client information saved successfully"), 'success');
        // Trigger API update here
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">{title}</h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    const InputField = ({ label, name, value, icon: Icon, placeholder, onChange }: any) => (
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
            <div className="relative">
                {Icon && <Icon size={16} className="absolute left-3 top-2.5 text-slate-400" />}
                <input
                    type="text"
                    disabled={!editMode}
                    value={value || ''}
                    onChange={(e) => onChange && onChange(name, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:bg-white disabled:border-transparent disabled:text-slate-800 dark:disabled:text-slate-200 disabled:shadow-none transition-all`}
                />
            </div>
        </div>
    );

    return (
        <div className="p-8 lg:p-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("Client Information")}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t("Manage basic details and configuration.")}</p>
                </div>
                <button
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${editMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    {editMode ? <Save size={16} /> : null}
                    {editMode ? t("Save Changes") : t("Edit Details")}
                </button>
            </div>

            <Section title={t("Basic Details")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex items-center gap-6 mb-4">
                        <div className="w-20 h-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                            {formData.clientLogo ? (
                                <img src={formData.clientLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <Building2 className="text-slate-300" size={32} />
                            )}
                            {editMode && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Change</div>}
                        </div>
                        <div className="flex-1">
                            <InputField label={t("Client Name")} name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Enter client name" />
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label={t("Alias")} name="clientNameAlias" value={formData.clientNameAlias} onChange={handleChange} placeholder="Short name" />
                                <InputField label={t("Client Code")} name="clientCode" value={formData.clientCode} onChange={handleChange} placeholder="Unique Code" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label={t("Description")} name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the client" />
                    <InputField label={t("Website URL")} name="clientURL" value={formData.clientURL} onChange={handleChange} icon={Globe} placeholder="https://example.com" />
                </div>
            </Section>

            <Section title={t("Contact & Location")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label={t("Email ID")} name="email" value={formData.email || ''} onChange={handleChange} icon={Mail} placeholder="client@example.com" />
                    <InputField label={t("Mobile")} name="mobile" value={formData.mobile || ''} onChange={handleChange} icon={Phone} placeholder="+1 (555) 000-0000" />
                    <InputField label={t("Location")} name="country" value={formData.country} onChange={handleChange} icon={MapPin} placeholder="City, Country" />
                    <InputField label={t("Time Zone")} name="defaultTimeZoneName" value={formData.settings?.defaultTimeZoneName} onChange={(n: string, v: string) => setFormData((prev: any) => ({ ...prev, settings: { ...prev.settings, defaultTimeZoneName: v } }))} icon={Globe} placeholder="Select Time Zone" />
                </div>
            </Section>

            <Section title={t("Regional Settings")}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label={t("Time Format")} name="timeFormat" value="12 Hour" onChange={() => { }} icon={Clock} />
                    <InputField label={t("Date Format")} name="defaultDateFormat" value={formData.settings?.defaultDateFormat || 'MM/DD/YYYY'} onChange={(n: string, v: string) => setFormData((prev: any) => ({ ...prev, settings: { ...prev.settings, defaultDateFormat: v } }))} icon={Calendar} />
                    <InputField label={t("Language")} name="language" value={formData.language} onChange={handleChange} icon={Globe} />
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${editMode ? 'bg-slate-200 dark:bg-slate-700 cursor-pointer' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Exclude All Day Events</span>
                    </div>
                </div>
            </Section>
        </div>
    );
};
