
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clientService } from '../../../services/clientService';
import { ClientData } from '../../../Schema/ClientSchema';
import { ChevronLeft } from '../../../components/Icons';
import { PlaceholderView } from '../components/PlaceholderView';
import { Users, FileText, CheckCircle } from '../../../components/Icons';
import { ClientInformation } from './components/ClientInformation';
import { ClientSettings } from './components/ClientSettings';

export const ClientProfileContainer = () => {
    const { t } = useTranslation();
    const { tab, clientId } = useParams();
    const navigate = useNavigate();
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            if (clientId) {
                try {
                    setLoading(true);
                    const data = await clientService.getById(clientId);
                    if (data) {
                        setClientData(data);
                    } else {
                        // Handle not found
                        console.error('Client not found');
                    }
                } catch (error) {
                    console.error('Error fetching client:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchClient();
    }, [clientId]);

    const activeTab = tab || 'clientinformation';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!clientData) {
        return <div className="p-8 text-center text-slate-500">{t("Client not found")}</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'clientinformation':
                return <ClientInformation client={clientData} />;
            case 'users':
                return (
                    <div className="p-8 lg:p-12">
                        <PlaceholderView
                            title={t("Client Users")}
                            description={t("Manage users who have access to {0}.", { name: clientData.clientName })}
                            icon={Users}
                        />
                    </div>
                );
            case 'customfields':
                return (
                    <div className="p-8 lg:p-12">
                        <PlaceholderView
                            title={t("Custom Fields")}
                            description={t("Configure Custom Fields for Campaigns, Resume, and Interviews.")}
                            icon={FileText}
                        />
                    </div>
                );
            case 'screeningrounds':
                return (
                    <div className="p-8 lg:p-12">
                        <PlaceholderView
                            title={t("Screening Rounds")}
                            description={t("Configure screening rounds for this client.")}
                            icon={CheckCircle}
                        />
                    </div>
                );
            case 'settings':
                return <ClientSettings client={clientData} />;
            default:
                return <ClientInformation client={clientData} />;
        }
    };

    return (
        <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-4 shrink-0 transition-colors">
                <button
                    onClick={() => navigate('/settings/CLIENTS')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{clientData.clientName}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{clientData.clientType || 'Client'}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
};
