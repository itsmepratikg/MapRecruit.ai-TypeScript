
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { clientService } from '../../../services/api';
import { ClientData } from '../../../types';
import { ChevronLeft } from '../../../components/Icons';
import { PlaceholderView } from '../components/PlaceholderView';
import { Users, FileText, CheckCircle } from '../../../components/Icons';
import { ClientInformation } from './components/ClientInformation';
import { ClientCustomFields } from './components/ClientCustomFields';
import { ClientUsers } from './components/ClientUsers';
import { ClientSettings } from './components/ClientSettings';

export const ClientProfileContainer = () => {
    const { t } = useTranslation();
    const { tab, clientId } = useParams();
    const navigate = useNavigate();
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClient = async () => {
            if (clientId) {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await clientService.getById(clientId);
                    if (data) {
                        setClientData(data);
                    } else {
                        setError('Client not found');
                    }
                } catch (err: any) {
                    console.error('Error fetching client:', err);
                    setError(err.response?.data?.message || err.message || 'Failed to fetch client');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchClient();
    }, [clientId]);

    const activeTab = tab || 'clientinformation';
    const isActive = clientData?.status === 'Active' || clientData?.enable !== false;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error || !clientData) {
        return (
            <div className="p-8 text-center text-slate-500">
                <p className="text-lg font-medium mb-2">{t(error || "Client not found")}</p>
                {error && <p className="text-xs text-slate-400 mt-2">Error Details: {error}</p>}
                <button
                    onClick={() => navigate('/settings/clients')}
                    className="mt-4 text-emerald-600 hover:text-emerald-500 text-sm font-medium"
                >
                    &larr; {t("Back to Clients List")}
                </button>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'clientinformation':
                return <ClientInformation client={clientData} />;
            case 'users':
                return <ClientUsers clientId={clientId || ''} isActive={isActive} />;
            case 'customfields':
                return <ClientCustomFields clientId={clientId || ''} isActive={isActive} />;
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
                return <ClientSettings client={clientData} isActive={isActive} />;
            default:
                return <ClientInformation client={clientData} />;
        }
    };

    return (
        <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
};
