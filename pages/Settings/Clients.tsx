import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Briefcase, Search, Plus, CheckCircle, Power,
    X, Save, Building2
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { clientService } from '../../services/clientService'; // We just created this
import { CLIENT_SCHEMA, ClientData } from '../../Schema/ClientSchema'; // We just created this
import SchemaTable from '../../components/Schema/SchemaTable';

interface ClientsSettingsProps {
    onSelectClient?: (client: ClientData) => void;
}

export const ClientsSettings = ({ onSelectClient }: ClientsSettingsProps) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'Active' | 'Inactive'>('Active');
    const [clients, setClients] = useState<ClientData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await clientService.getAll();
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients:", error);
            addToast(t("Failed to load clients"), 'error');
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    const handleCreateClient = () => {
        // Future: Navigate to create page or show modal
        // For now, keep as is or just show toast
        addToast(t("Create Client feature coming soon"), 'info');
    };

    const handleEditClient = (client: ClientData) => {
        if (onSelectClient) {
            onSelectClient(client);
        } else {
            navigate(`/settings/clientprofile/clientinformation/${client._id}`);
        }
    };

    // Filter Logic
    const filteredClients = clients
        .filter(c => {
            const matchesTab = activeTab === 'Active'
                ? (c.status === 'Active')
                : (c.status !== 'Active'); // Assuming anything not 'Active' is Inactive/Deactivated

            const term = searchQuery.toLowerCase();
            const matchesSearch = (
                c.clientName.toLowerCase().includes(term) ||
                c.clientCode.toLowerCase().includes(term) ||
                (c.clientType || '').toLowerCase().includes(term)
            );

            return matchesTab && matchesSearch;
        })
        .sort((a, b) => a.clientName.localeCompare(b.clientName));



    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 transition-all">
                <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Briefcase size={24} className="text-indigo-600 dark:text-indigo-400" />
                                {t("Client Management")}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                {t("Manage client profiles, billing details, and specific configurations.")}
                                <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                                    {clients.filter(c => c.status === 'Active').length} {t("Active Clients")}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder={t("Search clients...")}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            </div>
                            <button
                                onClick={handleCreateClient}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                            >
                                <Plus size={16} /> {t("Add Client")}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700 mb-6">
                        <button
                            onClick={() => setActiveTab('Active')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'Active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            {t("Active Client")}
                            {activeTab === 'Active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('Inactive')}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'Inactive' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            {t("In-Active Client / Deactivated Client")}
                            {activeTab === 'Inactive' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden p-0">
                        {loading ? (
                            <div className="p-12 text-center text-slate-500">{t("Loading Clients...")}</div>
                        ) : (
                            <SchemaTable
                                data={filteredClients}
                                columns={CLIENT_SCHEMA} // Use the schema we defined
                                title={t("Clients")}
                                onEdit={handleEditClient}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
