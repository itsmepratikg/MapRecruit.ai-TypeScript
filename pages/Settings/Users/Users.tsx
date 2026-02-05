
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Users, Search, UserPlus, CheckCircle, Power,
    X, Save, User, Shield, Mail, Phone, MapPin,
    Briefcase, Building2, Layout, Clock, Activity, MessageSquare, ChevronDown
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { SchemaUserList } from './components/SchemaUserList';
import { userService, clientService } from '../../../services/api';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useRoleHierarchy } from '../../../hooks/useRoleHierarchy';

interface UsersSettingsProps {
    onSelectUser?: (user: any) => void;
}

export const UsersSettings = ({ onSelectUser }: UsersSettingsProps) => {
    const { t } = useTranslation();
    const { addToast } = useToast();

    // Auth & Hierarchy
    const { userProfile } = useUserProfile();
    const { isSeniorTo, hierarchy, userRoleID } = useRoleHierarchy(userProfile?.roleID?._id || userProfile?.roleID, userProfile?.companyID);

    const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
    const [users, setUsers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        roleID: '',
        clients: [] as string[]
    });

    useEffect(() => {
        loadUsers();
        loadClients();
        loadRoles();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const loadClients = async () => {
        try {
            const data = await clientService.getAll();
            console.log('[DEBUG] Users Page - Loaded Clients:', data.length, data);
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        }
    };

    const loadRoles = async () => {
        try {
            const { default: api } = await import('../../../services/api');
            const res = await api.get('/auth/roles');
            setRoles(res.data || []);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setFormData({ name: '', email: '', phone: '', roleID: '', clients: [] });
        setView('EDITOR');
    };

    const handleEditUser = (user: any) => {
        // Hierarchy Check
        // If user is trying to edit someone senior or equal -> Prevent
        const targetRoleID = user.role?._id || user.role;
        // Exception: If current user is modifying themselves? Usually allowed to edit basic info, but role change restricted.
        // For simplicity, strict hierarchy: Can only manage juniors.
        if (targetRoleID && !isSeniorTo(targetRoleID)) {
            addToast(t("Insufficient seniority to modify this user."), "error");
            return;
        }

        if (onSelectUser) {
            onSelectUser(user);
        } else {
            setSelectedUser(user);
            setFormData({
                name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email || '',
                phone: user.phone || '',
                roleID: user.role?._id || user.role || '',
                clients: user.clients || [] // Assuming user object has clients array
            });
            setView('EDITOR');
        }
    };

    const handleSaveUser = async () => {
        if (!formData.name || !formData.email || !formData.roleID) {
            addToast(t("Name, Email, and Role are required"), 'error');
            return;
        }

        // Split Name into First and Last
        const [firstName, ...lastNames] = formData.name.trim().split(/\s+/);
        const lastName = lastNames.join(' ') || '.';

        try {
            if (selectedUser) {
                // Update Logic
                await userService.update(selectedUser._id, {
                    ...formData,
                    firstName,
                    lastName
                });
                addToast(t("User updated successfully"), 'success');
            } else {
                // Create Logic: Determine Active Client
                if (formData.clients.length === 0) {
                    addToast(t("Please assign at least one client."), 'error');
                    return;
                }

                // Get full client objects in selection order
                const assignedClientDocs = formData.clients.map(id => clients.find(c => c._id === id)).filter(Boolean);

                // Requirement: Give the first available active client (from selection order)
                const activeClientDoc = assignedClientDocs.find((c: any) =>
                    c.status === 'Active' || c.status === true || c.active === true || c.status === undefined
                );

                if (!activeClientDoc) {
                    addToast(t("No active client exists among the selected clients. Please check client statuses."), 'error');
                    return;
                }

                // Create user with split name and calculated active client
                await userService.create({
                    ...formData,
                    firstName,
                    lastName,
                    activeClientID: activeClientDoc._id
                });
                addToast(t("User created successfully"), 'success');
            }
            setView('LIST');
            loadUsers();
        } catch (error: any) {
            console.error("Failed to save user:", error);
            if (!error.isSafetyBlock) {
                addToast(error.response?.data?.message || t("Failed to save user"), 'error');
            }
        }
    };

    const toggleClientSelection = (clientId: string) => {
        setFormData(prev => {
            const current = prev.clients || [];
            if (current.includes(clientId)) {
                return { ...prev, clients: current.filter(id => id !== clientId) };
            } else {
                return { ...prev, clients: [...current, clientId] };
            }
        });
    };

    const handleMassUpdate = async (action: 'ACTIVATE' | 'DEACTIVATE') => {
        // Filter out users that match seniority check
        const usersToUpdate = users.filter(u => selectedIds.has(u.id));
        const authorizedUsersRaw = usersToUpdate.filter(u => {
            const rId = u.role?._id || u.role;
            return !rId || isSeniorTo(rId); // Allow if no role or senior
        });

        if (authorizedUsersRaw.length < usersToUpdate.length) {
            addToast(t("Some users were skipped due to insufficient seniority."), "warning");
        }

        if (authorizedUsersRaw.length === 0) return;

        const authorizedIds = new Set(authorizedUsersRaw.map(u => u.id));

        const newStatus = action === 'ACTIVATE' ? true : false;
        try {
            // Update in UI immediately for responsiveness
            setUsers(prev => prev.map(u => authorizedIds.has(u.id) ? { ...u, status: newStatus } : u));
            addToast(`${authorizedIds.size} ${t("users updated successfully")}`, 'success');
            setSelectedIds(new Set());
        } catch (error) {
            addToast(t("Failed to update users"), 'error');
        }
    };

    if (view === 'EDITOR') {
        return (
            <div className="h-full overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900">
                <div className="px-8 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('LIST')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                            <X size={24} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                {selectedUser ? t("Edit User") : t("Add New User")}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser ? t("Update user details.") : t("Create a new user with default password.")}</p>
                        </div>
                    </div>
                    <button onClick={handleSaveUser} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
                        <Save size={18} /> {t("Save User")}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-2xl mx-auto space-y-8">

                        {/* Basic Details */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <User size={20} className="text-blue-500" />
                                {t("Basic Information")}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t("Full Name")} *</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t("Role")} *</label>
                                    <div className="relative">
                                        <Shield size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <select
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                                            value={formData.roleID}
                                            onChange={e => setFormData({ ...formData, roleID: e.target.value })}
                                        >
                                            <option value="">{t("Select Role")}</option>
                                            {roles
                                                .filter(role => {
                                                    if (!userRoleID || !hierarchy || hierarchy.size === 0) return true;
                                                    const myRank = hierarchy.get(userRoleID) ?? Infinity;
                                                    const targetRank = hierarchy.get(role._id) ?? Infinity;
                                                    return myRank <= targetRank; // Senior (low rank) or Equal
                                                })
                                                .map(role => (
                                                    <option key={role._id} value={role._id}>{role.roleName}</option>
                                                ))
                                            }
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t("Email Address")} *</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t("Phone Number")}</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Client Access */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Building2 size={20} className="text-purple-500" />
                                {t("Client Access")}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("Select which clients this user can access.")}</p>

                            {/* Client Dropdown Trigger */}
                            <div className="relative">
                                <button
                                    onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                                    className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <span className={`block truncate ${formData.clients.length === 0 ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                                        {formData.clients.length === 0
                                            ? t("Select Clients...")
                                            : `${formData.clients.length} ${t("clients selected")}`
                                        }
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300">
                                            {clients.length} {t("Total")}
                                        </span>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${clientDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {/* Dropdown Content */}
                                {clientDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        {/* Actions Header */}
                                        <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-2">
                                            {/* Search Input */}
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder={t("Search clients...")}
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-slate-200"
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>

                                            <div className="flex justify-between items-center px-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const allIds = clients.map(c => c._id);
                                                        setFormData(prev => ({ ...prev, clients: allIds }));
                                                    }}
                                                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                                >
                                                    {t("Select All")}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setFormData(prev => ({ ...prev, clients: [] }));
                                                    }}
                                                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                                >
                                                    {t("Clear Selection")}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Grouped List */}
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                                            {(() => {
                                                const filtered = clients.filter(c =>
                                                    (c.name || c.clientName || '').toLowerCase().includes(searchQuery.toLowerCase())
                                                );

                                                if (filtered.length === 0) {
                                                    return <div className="p-4 text-center text-sm text-slate-500 italic">No clients found</div>;
                                                }

                                                const grouped = filtered.reduce((acc: any, client) => {
                                                    // Override logic for specific clients based on user feedback
                                                    let type = client.type || client.clientType || 'Client'; // Default

                                                    const lowerName = (client.name || client.clientName || '').toLowerCase();

                                                    if (lowerName.includes('trc talent solutions') || lowerName.includes('google') || lowerName.includes('maprecruit')) {
                                                        type = 'Client';
                                                    } else if (lowerName.includes('peachtree')) {
                                                        type = 'Branch';
                                                    } else if (lowerName.includes('diversified')) {
                                                        type = 'Vendor';
                                                    }

                                                    // Capitalize first letter
                                                    type = type.charAt(0).toUpperCase() + type.slice(1);

                                                    if (!acc[type]) acc[type] = [];
                                                    acc[type].push(client);
                                                    return acc;
                                                }, {});

                                                // Sort keys: Branch, Client, Vendor, Others
                                                const priority = ['Branch', 'Client', 'Vendor'];
                                                const sortedKeys = Object.keys(grouped).sort((a, b) => {
                                                    const idxA = priority.indexOf(a);
                                                    const idxB = priority.indexOf(b);
                                                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                                                    if (idxA !== -1) return -1;
                                                    if (idxB !== -1) return 1;
                                                    return a.localeCompare(b);
                                                });

                                                return sortedKeys.map(type => (
                                                    <div key={type} className="mb-3 last:mb-0">
                                                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 px-2">
                                                            {t(type)}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {grouped[type].map((client: any) => {
                                                                const isSelected = (formData.clients || []).includes(client._id);
                                                                return (
                                                                    <label key={client._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer group transition-colors">
                                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-emerald-400'}`}>
                                                                            {isSelected && <CheckCircle size={10} strokeWidth={4} />}
                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="hidden"
                                                                            checked={isSelected}
                                                                            onChange={() => toggleClientSelection(client._id)}
                                                                        />
                                                                        <span className={`text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                                                                            {client.name || client.clientName}
                                                                        </span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
                            <Shield size={18} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold">{t("Security Note")}</p>
                                <p className="opacity-80">{t("New users will be assigned the default password 'Domain12!'. They should change it upon first login.")}</p>
                            </div>
                        </div>

                    </div >
                </div >
            </div >
        );
    }

    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 transition-all">
                <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Users size={24} className="text-blue-600 dark:text-blue-400" />
                                {t("User Management")}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                {t("Manage system access, roles, and user profiles.")}
                                <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                                    {users.filter(u => u.status).length} {t("Active Users")}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder={t("Search users...")}
                                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            </div>
                            <button
                                onClick={handleCreateUser}
                                data-tour="settings-users-add"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                            >
                                <UserPlus size={16} /> {t("Add User")}
                            </button>
                        </div>
                    </div>

                    {/* Bulk Actions Toolbar */}
                    {selectedIds.size > 0 && (
                        <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                            <span className="text-sm font-bold text-blue-800 dark:text-blue-300">{selectedIds.size} {t("users selected")}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleMassUpdate('ACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-green-300 transition-colors flex items-center gap-1">
                                    <CheckCircle size={12} /> {t("Activate")}
                                </button>
                                <button onClick={() => handleMassUpdate('DEACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-red-300 transition-colors flex items-center gap-1">
                                    <Power size={12} /> {t("Deactivate")}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Schema User List */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden p-0">
                        <SchemaUserList searchQuery={searchQuery} onSelectUser={handleEditUser} />
                    </div>
                </div>
            </div>
        </div>
    );
};
