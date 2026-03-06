import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Save, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText, Download, Eye, ExternalLink } from 'lucide-react';
import { integrationService } from '../../services/integrationService';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ActionButtons } from '../../components/Common/ActionButtons';

interface SecretMetadata {
    isSet: boolean;
}

interface IntegrationConfig {
    enable: boolean;
    mode: 'multi-tenant' | 'single-tenant';
    clientId: string;
    clientSecret: string | SecretMetadata;
    tenantId?: string; // MS Only
    serviceAccountJson?: string | SecretMetadata; // Google Only
    metadata?: {
        updatedBy?: { firstName: string; lastName: string };
        updatedOn?: string;
        createdBy?: { firstName: string; lastName: string };
        createdAt?: string;
        expiryAt?: string;
    };
}

interface AuthenticationSettings {
    sessionTimeoutInMins: number;
    passwordSize: number; // Min length
    maxPasswordSize: number;
    passwordExpiryInDays: number;
    ssoProvider: string;
    sso: boolean;
    workspaceConfiguration: {
        google: IntegrationConfig;
        microsoft: IntegrationConfig;
    };
}

export const WorkspaceConfigurations = () => {
    const { t } = useTranslation();
    const [mainTab, setMainTab] = useState<'general' | 'workspace'>('general');
    const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'google' | 'microsoft'>('google');

    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Doc Preview State
    const [showDocPreview, setShowDocPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [settings, setSettings] = useState<AuthenticationSettings>({
        sessionTimeoutInMins: 240,
        passwordSize: 10,
        maxPasswordSize: 30,
        passwordExpiryInDays: 90,
        ssoProvider: '',
        sso: false,
        workspaceConfiguration: {
            google: { enable: false, mode: 'multi-tenant', clientId: '', clientSecret: '' },
            microsoft: { enable: false, mode: 'multi-tenant', clientId: '', clientSecret: '', tenantId: '' }
        }
    });

    // Test Results State
    const [testResults, setTestResults] = useState<any[]>([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await integrationService.getSettings();
            if (data) {
                // Expecting response to match partial AuthenticationSettings structure
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    workspaceConfiguration: {
                        google: { ...prev.workspaceConfiguration.google, ...(data.workspaceConfiguration?.google || {}) },
                        microsoft: { ...prev.workspaceConfiguration.microsoft, ...(data.workspaceConfiguration?.microsoft || {}) }
                    }
                }));
            }
        } catch (error) {
            console.error(error);
            toast.error(t("Failed to load settings"));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setShowConfirm(false);
        try {
            setLoading(true);

            // Prepare payload
            const cleanConfig = (cfg: IntegrationConfig) => {
                const clean = { ...cfg };
                if (typeof clean.clientSecret === 'object') clean.clientSecret = '';
                if (typeof clean.serviceAccountJson === 'object') clean.serviceAccountJson = '';
                return clean;
            };

            const payload: AuthenticationSettings = {
                ...settings,
                workspaceConfiguration: {
                    google: cleanConfig(settings.workspaceConfiguration.google),
                    microsoft: cleanConfig(settings.workspaceConfiguration.microsoft)
                }
            };

            const data = await integrationService.updateSettings(payload);

            if (data) {
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    workspaceConfiguration: {
                        google: { ...prev.workspaceConfiguration.google, ...(data.workspaceConfiguration?.google || {}) },
                        microsoft: { ...prev.workspaceConfiguration.microsoft, ...(data.workspaceConfiguration?.microsoft || {}) }
                    }
                }));
            }

            setIsEditing(false);
            toast.success(t("Settings saved successfully"));
        } catch (error) {
            console.error(error);
            toast.error(t("Failed to save settings"));
        } finally {
            setLoading(false);
        }
    };

    const handleTestPermissions = async () => {
        try {
            const currentConfig = settings.workspaceConfiguration[activeWorkspaceTab];
            setTesting(true);
            setTestResults([]);

            const payload = {
                provider: activeWorkspaceTab,
                credentials: {
                    ...currentConfig,
                    clientSecret: typeof currentConfig.clientSecret === 'object' ? '' : currentConfig.clientSecret,
                    serviceAccountJson: typeof currentConfig.serviceAccountJson === 'object' ? '' : currentConfig.serviceAccountJson,
                }
            };

            const data = await integrationService.testPermissions(payload);

            if (data && data.results) {
                setTestResults(data.results);
                if (data.success) {
                    toast.success(t("Permission check completed"));
                } else {
                    toast.error(t("Permission check failed"));
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(t("Error testing permissions"));
            setTestResults([{ name: 'Connection Error', status: 'failed', error: 'Could not reach backend' }]);
        } finally {
            setTesting(false);
        }
    };

    const updateConfig = (provider: 'google' | 'microsoft', field: string, value: string | boolean) => {
        setSettings(prev => ({
            ...prev,
            workspaceConfiguration: {
                ...prev.workspaceConfiguration,
                [provider]: {
                    ...prev.workspaceConfiguration[provider],
                    [field]: value
                }
            }
        }));
    };

    const updateGeneral = (field: keyof AuthenticationSettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // --- Documentation Helpers ---

    const handlePreview = async (type: 'microsoft' | 'google') => {
        setPreviewTitle(type === 'microsoft' ? 'Microsoft Integration Guide' : 'Google Integration Guide');
        setShowDocPreview(true);
        setPreviewContent("Loading...");
        try {
            const fileName = type === 'microsoft' ? 'Microsoft_Integration_Guide.md' : 'Google_Integration_Guide.md';
            const response = await fetch(`/${fileName}`); // Fetch from public folder
            if (!response.ok) throw new Error("Failed to load guide");
            const text = await response.text();
            setPreviewContent(text);
        } catch (error) {
            setPreviewContent("Failed to load documentation. Please check your internet connection or try again later.");
        }
    };


    // --- Renderers ---

    const renderGeneralSettings = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 p-1">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">General Security Settings</h4>
                    <p className="text-sm text-slate-500 mt-1">Configure session and password policies for your organization.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h5 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Session Policy
                    </h5>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Session Timeout (Minutes)
                        </label>
                        <input
                            type="number"
                            value={settings.sessionTimeoutInMins}
                            onChange={(e) => updateGeneral('sessionTimeoutInMins', parseInt(e.target.value))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                        />
                        <p className="text-xs text-slate-500 mt-1">Users will be logged out after inactivity.</p>
                    </div>
                </div>

                <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h5 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        Password Policy
                    </h5>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Min Length
                        </label>
                        <input
                            type="number"
                            value={settings.passwordSize}
                            onChange={(e) => updateGeneral('passwordSize', parseInt(e.target.value))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Max Length
                        </label>
                        <input
                            type="number"
                            value={settings.maxPasswordSize}
                            onChange={(e) => updateGeneral('maxPasswordSize', parseInt(e.target.value))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Expiry (Days)
                        </label>
                        <input
                            type="number"
                            value={settings.passwordExpiryInDays}
                            onChange={(e) => updateGeneral('passwordExpiryInDays', parseInt(e.target.value))}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderWorkspaceSettings = () => {
        const config = settings.workspaceConfiguration[activeWorkspaceTab];
        const isMulti = config.mode === 'multi-tenant';

        // Metadata formatting
        // Metadata formatting
        const updatedBy = config.metadata?.updatedBy;
        const updatedOn = config.metadata?.updatedOn ? new Date(config.metadata.updatedOn).toLocaleString() : 'Unknown';

        const createdBy = config.metadata?.createdBy;
        const createdAt = config.metadata?.createdAt ? new Date(config.metadata.createdAt).toLocaleString() : 'Unknown';

        const lastUpdateText = (
            <div className="flex flex-col text-xs text-slate-400 mt-1 italic gap-0.5">
                {config.metadata?.updatedOn && (
                    <span>Updated by {updatedBy?.firstName || 'User'} {updatedBy?.lastName || ''} on {updatedOn}</span>
                )}
                {config.metadata?.createdAt && (
                    <span>Created by {createdBy?.firstName || 'System'} {createdBy?.lastName || ''} on {createdAt}</span>
                )}
            </div>
        );

        const isSecretSet = (val: string | SecretMetadata | undefined) => {
            if (!val) return false;
            if (typeof val === 'object' && val.isSet) return true;
            if (typeof val === 'string' && val.length > 0) return true;
            return false;
        };

        return (
            <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative ${!isEditing && !isMulti ? 'opacity-90' : ''}`}>

                {/* Workspace Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-1">
                    <button
                        onClick={() => setActiveWorkspaceTab('google')}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeWorkspaceTab === 'google'
                            ? 'bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-slate-800 text-blue-600 -mb-px'
                            : 'text-slate-500 hover:text-slate-700 bg-slate-50 dark:bg-slate-900/50'
                            }`}
                    >
                        <div className="h-4 w-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">G</div>
                        Google
                    </button>
                    <button
                        onClick={() => setActiveWorkspaceTab('microsoft')}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeWorkspaceTab === 'microsoft'
                            ? 'bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-slate-800 text-blue-600 -mb-px'
                            : 'text-slate-500 hover:text-slate-700 bg-slate-50 dark:bg-slate-900/50'
                            }`}
                    >
                        <div className="h-4 w-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">M</div>
                        Microsoft
                    </button>
                </div>


                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {activeWorkspaceTab === 'google' ? 'Google Calendar & Drive' : 'Microsoft Graph'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${isMulti ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {config.mode === 'multi-tenant' ? 'Multi-Tenant' : 'Single Tenant'}
                            </div>
                            {isMulti && <span className="text-xs text-slate-500">(Default)</span>}
                        </div>
                        {lastUpdateText && !isMulti && (
                            <div className="text-xs text-slate-400 mt-1 italic">{lastUpdateText}</div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Documentation Actions */}
                        <div className="mr-4 flex gap-2">
                            <button
                                onClick={() => handlePreview(activeWorkspaceTab)}
                                className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                            >
                                <Eye className="h-3 w-3" /> View Guide
                            </button>

                            <a
                                href={activeWorkspaceTab === 'google' ? '/Google_Integration_Guide.md' : '/Microsoft_Integration_Guide.md'}
                                download
                                className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                            >
                                <Download className="h-3 w-3" /> Guide
                            </a>

                            {activeWorkspaceTab === 'google' ? (
                                <a
                                    href="/Code.js"
                                    download="Code.js"
                                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    <Download className="h-3 w-3" /> Code.js
                                </a>
                            ) : (
                                <a
                                    href="/manifest.xml"
                                    download="manifest.xml"
                                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    <Download className="h-3 w-3" /> Manifest
                                </a>
                            )}
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div
                        onClick={() => isEditing && updateConfig(activeWorkspaceTab, 'enable', !config.enable)}
                        className={`cursor-pointer border-2 rounded-lg p-4 flex items-center gap-3 transition-all ${config.enable
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10'
                            : 'border-slate-200 dark:border-slate-700 opacity-70'
                            } ${!isEditing ? 'cursor-default pointer-events-none' : 'hover:border-emerald-300'}`}
                    >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${config.enable ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                            {config.enable && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                {config.enable ? 'Integration Enabled' : 'Integration Disabled'}
                            </div>
                            <div className="text-xs text-slate-500">Allow users to connect via {activeWorkspaceTab === 'google' ? 'Google' : 'Microsoft'}</div>
                        </div>
                    </div>
                </div>

                {/* Architecture Toggle */}
                <div className={`grid grid-cols-2 gap-4 mb-8 transition-opacity duration-300 ${!config.enable ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <div
                        onClick={() => isEditing && updateConfig(activeWorkspaceTab, 'mode', 'multi-tenant')}
                        style={{ cursor: isEditing ? 'pointer' : 'default' }}
                        className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all ${config.mode === 'multi-tenant'
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-slate-200 dark:border-slate-700'
                            } ${!isEditing ? 'pointer-events-none' : 'hover:border-blue-300'}`}
                    >
                        <div className="font-semibold text-slate-700 dark:text-slate-200">Multi-Tenant</div>
                        <div className="text-xs text-slate-500 text-center">(User connects own account using our App)</div>
                    </div>

                    <div
                        onClick={() => isEditing && updateConfig(activeWorkspaceTab, 'mode', 'single-tenant')}
                        style={{ cursor: isEditing ? 'pointer' : 'default' }}
                        className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all ${config.mode === 'single-tenant'
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-slate-200 dark:border-slate-700'
                            } ${!isEditing ? 'pointer-events-none' : 'hover:border-blue-300'}`}
                    >
                        <div className="font-semibold text-slate-700 dark:text-slate-200">Single Tenant</div>
                        <div className="text-xs text-slate-500 text-center">(App acts as Admin / Service Principal)</div>
                    </div>
                </div>

                {/* Single Tenant Form */}
                {
                    !isMulti && (
                        <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            {/* Overlay for Read-Only Mode */}
                            {!isEditing && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-lg border border-slate-200 dark:border-slate-800">
                                    <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                                        <Shield className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Configuration Locked</h3>
                                        <p className="text-xs text-slate-500 mb-4 max-w-[200px] mx-auto">Sensitive settings are protected. Click "Edit Configuration" above to make changes.</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    {activeWorkspaceTab === 'microsoft' ? 'Application (Client) ID' : 'Client ID'}
                                </label>
                                <input
                                    type="text"
                                    value={config.clientId}
                                    onChange={(e) => updateConfig(activeWorkspaceTab, 'clientId', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="0000-0000-0000-0000"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    {activeWorkspaceTab === 'microsoft' ? 'Client Secret' : 'Client Secret'}
                                </label>
                                <div className="relative">
                                    {isSecretSet(config.clientSecret) && typeof config.clientSecret === 'object' ? (
                                        <div className="flex items-center gap-2 p-2 border border-emerald-200 bg-emerald-50 rounded-md text-sm text-emerald-700">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span>Secret is set and secure.</span>
                                            <button
                                                onClick={() => updateConfig(activeWorkspaceTab, 'clientSecret', '')} // Clearing it allows new input
                                                className="ml-auto text-xs underline hover:text-emerald-900"
                                                disabled={!isEditing}
                                            >
                                                Change Secret
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type="password"
                                            value={typeof config.clientSecret === 'string' ? config.clientSecret : ''}
                                            onChange={(e) => updateConfig(activeWorkspaceTab, 'clientSecret', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder={isSecretSet(config.clientSecret) ? "Enter new secret to overwrite..." : "Enter secret value..."}
                                            autoComplete="new-password"
                                            disabled={!isEditing}
                                        />
                                    )}
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Client Secret Expiry
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="datetime-local"
                                        value={config.metadata?.expiryAt ? new Date(config.metadata.expiryAt).toLocaleString('sv').slice(0, 16).replace(' ', 'T') : ''}
                                        onChange={(e) => {
                                            const date = new Date(e.target.value);
                                            const utcString = date.toISOString();
                                            // Deep update for metadata
                                            setSettings(prev => ({
                                                ...prev,
                                                workspaceConfiguration: {
                                                    ...prev.workspaceConfiguration,
                                                    [activeWorkspaceTab]: {
                                                        ...prev.workspaceConfiguration[activeWorkspaceTab],
                                                        metadata: {
                                                            ...prev.workspaceConfiguration[activeWorkspaceTab].metadata,
                                                            expiryAt: utcString
                                                        }
                                                    }
                                                }
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        disabled={!isEditing}
                                    />
                                    <span className="text-xs text-slate-500 whitespace-nowrap">
                                        {Intl.DateTimeFormat().resolvedOptions().timeZone} Time
                                    </span>
                                </div>
                            </div>

                            {
                                activeWorkspaceTab === 'microsoft' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Directory (Tenant) ID
                                        </label>
                                        <input
                                            type="text"
                                            value={config.tenantId || ''}
                                            onChange={(e) => updateConfig(activeWorkspaceTab, 'tenantId', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="GUID..."
                                            disabled={!isEditing}
                                        />
                                    </div>
                                )
                            }

                            {
                                activeWorkspaceTab === 'google' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Service Account JSON
                                        </label>
                                        {isSecretSet(config.serviceAccountJson) && typeof config.serviceAccountJson === 'object' ? (
                                            <div className="flex items-center gap-2 p-2 border border-emerald-200 bg-emerald-50 rounded-md text-sm text-emerald-700">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>Service Account JSON is uploaded.</span>
                                                <button
                                                    onClick={() => updateConfig(activeWorkspaceTab, 'serviceAccountJson', '')}
                                                    className="ml-auto text-xs underline hover:text-emerald-900"
                                                    disabled={!isEditing}
                                                >
                                                    Re-upload JSON
                                                </button>
                                            </div>
                                        ) : (
                                            <textarea
                                                value={typeof config.serviceAccountJson === 'string' ? config.serviceAccountJson : ''}
                                                onChange={(e) => updateConfig(activeWorkspaceTab, 'serviceAccountJson', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 font-mono text-xs"
                                                placeholder='{"type": "service_account", ...}'
                                                autoComplete="off"
                                                disabled={!isEditing}
                                            />
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    )
                }

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    {!isEditing && (
                        <button
                            onClick={handleTestPermissions}
                            disabled={testing}
                            className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors border border-slate-300 dark:border-slate-600"
                        >
                            {testing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                            Verify Permissions
                        </button>
                    )}
                </div>

                {/* Test Results */}
                {
                    testResults.length > 0 && isEditing && (
                        <div className="mt-8 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700 font-medium text-sm text-slate-600 dark:text-slate-400">
                                Permission Check Results
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {testResults.map((result, idx) => (
                                    <div key={idx} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900">
                                        <div className="flex items-center gap-3">
                                            {result.status === 'passed' ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : result.status === 'skipped' ? (
                                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{result.name}</span>
                                        </div>
                                        {result.error && (
                                            <span className="text-xs text-red-500 max-w-xs text-right truncate" title={result.error}>
                                                {result.error}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        );
    };

    return (
        <div className="h-full overflow-hidden flex flex-col bg-white dark:bg-slate-950">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />
                                {t("Authentication Configurations")}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                {t("Manage global settings, security policies, and external integrations.")}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <ActionButtons
                                isEditing={isEditing}
                                onEdit={() => setIsEditing(true)}
                                onSave={handleSave}
                                onDiscard={() => { setIsEditing(false); fetchSettings(); }}
                                isSaving={loading}
                                editLabel={t("Edit Configuration")}
                                discardLabel={t("Cancel")}
                            />
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex gap-3">
                        <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                            <p className="font-bold mb-1">{t("Security & Integration Settings")}</p>
                            <p className="text-xs opacity-90">{t("Changes made here will affect authentication flow and external service connections for all users.")}</p>
                        </div>
                    </div>

                    {/* Main Tabs - PILL STYLE */}
                    <div className="max-w-md bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => setMainTab('general')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${mainTab === 'general'
                                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {mainTab === 'general' && <Shield size={14} />}
                            {t("General Settings")}
                        </button>
                        <button
                            onClick={() => setMainTab('workspace')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${mainTab === 'workspace'
                                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {mainTab === 'workspace' && <Shield size={14} />}
                            {t("Integrations")}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-slate-900 min-h-[400px]">
                        {mainTab === 'general' ? renderGeneralSettings() : renderWorkspaceSettings()}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal Overlay */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-amber-600">
                            <AlertCircle className="h-6 w-6" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Changes</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                            Are you sure you want to update the settings? Incorrect credentials may break existing syncs.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSave}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors shadow-sm"
                            >
                                Yes, Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Documentation Preview Modal */}
            {showDocPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{previewTitle}</h3>
                            <button onClick={() => setShowDocPreview(false)} className="text-slate-500 hover:text-slate-700">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 prose dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{previewContent}</ReactMarkdown>
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={() => setShowDocPreview(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
