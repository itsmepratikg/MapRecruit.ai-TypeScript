
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search } from '../../../../components/Icons';
import { SchemaUserList } from '../../Users/components/SchemaUserList';
import { userService } from '../../../../services/api';

interface ClientUsersProps {
    clientId: string;
    isActive?: boolean;
}

export const ClientUsers = ({ clientId, isActive = true }: ClientUsersProps) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadClientUsers();
    }, [clientId]);

    const loadClientUsers = async () => {
        try {
            setLoading(true);
            // Assuming the backend supports filtering by clientID
            const data = await userService.getAll({ clientID: clientId });
            setUsers(data);
        } catch (error) {
            console.error("Failed to load client users", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 animate-in fade-in duration-500">
            {/* Header Content */}
            <div className="px-8 lg:px-12 pt-10 pb-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto">
                    {!isActive && (
                        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-200">
                            <div className="p-2 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
                                <Users size={18} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t("Client is Deactivated")}</p>
                                <p className="text-xs opacity-80">{t("User management is disabled. Activate the client from settings to manage delegates.")}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{t("Active Users")}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {users.length} {t("assigned delegates")}
                                </p>
                            </div>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-hover:bg-indigo-500/10 transition-all duration-500"></div>
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t("Filter users by name or email...")}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-slate-200 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 lg:px-12 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
                        <SchemaUserList
                            searchQuery={searchQuery}
                            data={users}
                            loading={loading}
                            isActive={isActive}
                            onSelectUser={(user: any) => {
                                console.log("Selected user:", user);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
