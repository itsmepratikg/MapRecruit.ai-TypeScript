import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/api';
import SchemaTable from '../../../../components/Schema/SchemaTable';
import {
    Users, Search, UserPlus, CheckCircle, Power,
    X, Save, User, Shield, // Added Shield
    Mail, Phone, MapPin,
    Briefcase, Building2, Layout, Clock, Activity, MessageSquare
} from '../../../../components/Icons';
import { useToast } from '../../../../components/Toast';
import { useTranslation } from 'react-i18next';
import { useImpersonation } from '../../../../context/ImpersonationContext';

export const SchemaUserList = ({ searchQuery, onSelectUser }: any) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const { startImpersonation } = useImpersonation();

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [impersonateModal, setImpersonateModal] = useState<{ isOpen: boolean, user: any | null }>({ isOpen: false, user: null });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
            // Fallback to empty or toast
            // addToast("Failed to load users", "error"); 
            // Commented out to prevent annoying toast if backend not running perfectly or empty
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const name = u.name || u.email || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const columns = [
        {
            header: t('Name'),
            accessor: (item: any) => {
                const initials = ((item.firstName?.[0] || '') + (item.lastName?.[0] || '')).toUpperCase() || '?';
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-indigo-500 shadow-sm`}>
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A'}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{item.jobTitle || t('No Title')}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: t('Email'),
            accessor: 'email'
        },
        {
            header: t('Role'),
            accessor: (item: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${item.role === 'Product Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    item.role === 'Admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {item.role || t('User')}
                </span>
            )
        },
        {
            header: t('Last Active'),
            accessor: (item: any) => item.lastActiveAt ? new Date(item.lastActiveAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : t('Never')
        },
        {
            header: t('Logins'),
            accessor: (item: any) => (
                <div className="flex items-center gap-1">
                    <span className="font-medium">{item.loginCount || 0}</span>
                </div>
            )
        },
        {
            header: t('Status'),
            accessor: (item: any) => (
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className={item.status ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
                        {item.status ? t('Active') : t('Inactive')}
                    </span>
                </div>
            )
        }
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">{t("Loading Users...")}</div>;

    // WAIT, I need to add the import first. I'll do that in a separate replacement or use a full replace.
    // Since I can't add imports easily with this tool without targeting top, I'll rely on a second Replace call for imports.
    // Here I will add the logic.

    const handleImpersonateClick = (user: any) => {
        setImpersonateModal({ isOpen: true, user });
    };

    const confirmImpersonation = async (mode: 'read-only' | 'full') => {
        if (!impersonateModal.user) return;

        try {
            const target = impersonateModal.user;
            const targetId = target.id || target._id?.$oid || target._id;

            addToast(`Switching to ${target.firstName || target.name || 'User'}...`, 'info');
            console.log("Starting impersonation for:", target.email, "ID:", targetId, "Mode:", mode);

            const { default: api } = await import('../../../../services/api');
            const response = await api.post('/auth/impersonate', {
                targetUserId: targetId,
                mode
            });

            if (response.data.token) {
                console.log("Impersonation token received for:", response.data.email);
                startImpersonation(response.data.token, response.data, mode);
            }
        } catch (error: any) {
            console.error("Impersonation Error:", error);
            addToast(error.response?.data?.message || "Impersonation failed", 'error');
        } finally {
            setImpersonateModal({ isOpen: false, user: null });
        }
    };

    return (
        <>
            <SchemaTable
                data={filteredUsers}
                columns={[
                    ...columns,
                    {
                        header: t('Actions'),
                        accessor: (item: any) => (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleImpersonateClick(item); }}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                title="Login as this user"
                            >
                                <Shield size={12} /> {t('Login As')}
                            </button>
                        )
                    }
                ]}
                title={t("Users")}
                onEdit={onSelectUser}
            />

            {/* Impersonation Modal */}
            {impersonateModal.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Login as {impersonateModal.user?.firstName}?
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Choose your access level. Actions in Full Access mode will be audited.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => confirmImpersonation('read-only')}
                                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold text-sm flex items-center justify-center gap-2"
                            >
                                <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-full"><Shield size={12} /></div>
                                View Only (Safe)
                            </button>
                            <button
                                onClick={() => confirmImpersonation('full')}
                                className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-sm flex items-center justify-center gap-2"
                            >
                                <div className="p-1 bg-amber-600 rounded-full"><Shield size={12} /></div>
                                Full Access
                            </button>
                            <button
                                onClick={() => setImpersonateModal({ isOpen: false, user: null })}
                                className="w-full mt-2 text-xs text-slate-400 hover:text-slate-500 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
