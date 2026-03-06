
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, Plus, Trash2, Edit2, Search, Building2, ChevronDown, Headset } from '../../components/Icons';
import api, { clientService, companyService } from '../../services/api';
import { useToast } from '../../components/Toast';
import { useUserContext } from '../../context/UserContext';
import { NotFound } from '../../components/Common/NotFound';

export const FranchiseSettings = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [franchises, setFranchises] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFranchise, setExpandedFranchise] = useState<string | null>(null);
    const [hasAccess, setHasAccess] = useState(true);
    const { userProfile } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First verify access
                const companyData = await companyService.get();
                if (!companyData) {
                    setHasAccess(false);
                    return;
                }

                const activeCompanyId = userProfile?.currentCompanyID || userProfile?.companyID || userProfile?.companyId;

                let targetCompany = null;
                if (Array.isArray(companyData)) {
                    targetCompany = activeCompanyId
                        ? companyData.find(c => String(c._id) === String(activeCompanyId))
                        : companyData[0];
                } else {
                    targetCompany = companyData;
                }

                let franchiseFlag = false;
                if (targetCompany) {
                    const hasFranchiseFlag = targetCompany.franchise === true || targetCompany.productSettings?.franchise === true;
                    if (!activeCompanyId || String(targetCompany._id) === String(activeCompanyId)) {
                        franchiseFlag = hasFranchiseFlag;
                    }
                }

                if (!franchiseFlag) {
                    setHasAccess(false);
                    return; // Stop loading data if access denied
                }

                // If authorized, load franchise data
                const [franchiseResponse, clientResponse] = await Promise.all([
                    api.get('/company/franchises'),
                    clientService.getAll()
                ]);
                setFranchises(franchiseResponse.data);
                setClients(clientResponse.data || []);
            } catch (error) {
                console.error('Failed to fetch franchise data:', error);
                setFranchises([
                    { _id: '1', franchiseName: 'East Coast Group' },
                    { _id: '2', franchiseName: 'West Coast Partners' }
                ]);
                setClients([
                    { _id: 'c1', clientName: 'New York Office', franchiseID: '1' },
                    { _id: 'c2', clientName: 'Boston Branch', franchiseID: '1' },
                    { _id: 'c3', clientName: 'Seattle HQ', franchiseID: '2' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleAccordion = (id: string) => {
        setExpandedFranchise(prev => prev === id ? null : id);
    };

    const getClientsForFranchise = (franchiseId: string) => {
        return clients.filter(c => c.franchiseID === franchiseId);
    };

    const filteredFranchises = franchises.filter(f =>
        f.franchiseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!loading && !hasAccess) {
        return (
            <NotFound
                title="Feature Not Enabled"
                description="The Franchise management feature is not enabled for your current company configuration. If you believe this is an error or if you'd like to upgrade your workspace, please reach out to our support team."
                icon={<GitBranch size={48} />}
            />
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t("Franchise Management")}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{t("Group clients into franchises for structured management.")}</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95">
                            <Plus size={18} />
                            {t("Create Franchise")}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder={t("Search franchises...")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading ? (
                                    <div className="p-12 text-center text-slate-400 animate-pulse">{t("Loading franchises...")}</div>
                                ) : filteredFranchises.length > 0 ? (
                                    filteredFranchises.map(franchise => {
                                        const franchiseClients = getClientsForFranchise(franchise._id);
                                        const isExpanded = expandedFranchise === franchise._id;

                                        return (
                                            <div key={franchise._id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                {/* Accordion Header */}
                                                <div
                                                    className="p-6 flex items-center justify-between group cursor-pointer"
                                                    onClick={() => toggleAccordion(franchise._id)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                                            <GitBranch className="text-indigo-600 dark:text-indigo-400" size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{franchise.franchiseName}</h4>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                                <Building2 size={14} />
                                                                {franchiseClients.length} {t("Clients Assigned")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                            <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div className={`p-2 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                            <ChevronDown size={20} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Accordion Content (Clients List) */}
                                                {isExpanded && (
                                                    <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                                                        <div className="pl-16 border-l-2 border-indigo-100 dark:border-indigo-900/40 ml-6 space-y-3">
                                                            <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Assigned Clients</h5>

                                                            {franchiseClients.length > 0 ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {franchiseClients.map(client => (
                                                                        <div key={client._id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                                                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                                                                <Building2 className="text-emerald-600 dark:text-emerald-400" size={16} />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{client.clientName}</p>
                                                                                <p className="text-xs text-slate-500">Code: {client.clientCode || 'N/A'}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center border border-dashed border-slate-200 dark:border-slate-700">
                                                                    <p className="text-sm text-slate-500 font-medium">No clients assigned to this franchise yet.</p>
                                                                    <button className="text-indigo-600 font-bold hover:underline text-xs mt-2">Add Client</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="p-12 text-center">
                                        <GitBranch size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-medium">{t("No franchises found")}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
