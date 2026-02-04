
import React, { useState, useMemo, useEffect } from 'react';
import {
    Shield, Plus, Copy, Search, Edit2, Trash2, ChevronLeft,
    Save, CheckCircle, AlertCircle, ChevronDown, ChevronRight,
    Layers, Lock, Clock, Check, X, Eye
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { useTranslation } from 'react-i18next';
import PermissionAccordion from './components/PermissionAccordion';
import RoleOverviewCards from './components/RoleOverviewCards';
import { useParams, useNavigate } from 'react-router-dom';

import { useUserProfile } from '../../../hooks/useUserProfile';
import { useRoleHierarchy } from '../../../hooks/useRoleHierarchy';
import { DEFAULT_PERMISSIONS } from './constants';

// ... (keep utils)

// --- MAIN PAGE COMPONENT ---

export const RolesPermissions = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();

    // User Profile for Context
    const { userProfile } = useUserProfile();
    // Hierarchy Hook
    const { isSeniorTo, loading: hierarchyLoading } = useRoleHierarchy(userProfile?.roleID?._id || userProfile?.roleID, userProfile?.companyID);

    const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
    const [roles, setRoles] = useState<any[]>([]);
    const [currentRole, setCurrentRole] = useState<any>(null);
    const [roleForm, setRoleForm] = useState<any>({
        roleName: '',
        description: '',
        accessibilitySettings: {},
        companyID: []
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentCompanyID, setCurrentCompanyID] = useState<string | null>(null);
    const [userCounts, setUserCounts] = useState<Record<string, number>>({}); // Map roleID -> count
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { default: api, companyService } = await import('../../../services/api');
                // Get company first to filter users/roles if needed (though API might handle it via header/middleware)
                const companyRes = await companyService.get();
                const companyID = companyRes?._id;

                if (companyID) {
                    setCurrentCompanyID(companyID);
                }

                // Fetch Roles and Users
                // Assuming /auth/roles gives roles for current context (or we need to filter)
                // Assuming /users gives users for current context
                const [rolesRes, usersRes] = await Promise.all([
                    api.get('/auth/roles'),
                    api.get('/users?limit=1000') // Fetch enough users to count. Optimization: Backend aggregation better.
                ]);

                // If rolesRes gives all system roles, we might need to filter by company if they are not global.
                // Assuming backend handles tenant isolation for roles or returns relevant ones.
                const fetchedRoles = rolesRes.data || [];
                setRoles(fetchedRoles);

                // Calculate User Counts
                const users = usersRes.data.docs || usersRes.data || [];
                const counts: Record<string, number> = {};

                users.forEach((u: any) => {
                    const rId = u.role?._id || u.role; // Handle populated or ID
                    if (rId) {
                        counts[rId] = (counts[rId] || 0) + 1;
                    }
                });
                setUserCounts(counts);

            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []); // Run once on mount

    // ID Synchronization Logic
    useEffect(() => {
        if (loading) return; // Wait for roles to be loaded

        if (id) {
            setView('EDITOR');
            if (id === 'new') {
                setIsEditing(true);
                setCurrentRole(null);
                setRoleForm({
                    roleName: '',
                    description: '',
                    accessibilitySettings: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)),
                    companyID: currentCompanyID
                });
            } else {
                setIsEditing(false); // Default to read-only for existing roles
                const found = roles.find(r => r._id === id || r.id === id);
                if (found) {
                    setCurrentRole(found);
                    setRoleForm({
                        roleName: found.roleName,
                        description: found.description,
                        accessibilitySettings: found.accessibilitySettings || JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)),
                        companyID: found.companyID
                    });
                } else {
                    // Invalid ID or not loaded yet
                    // If roles are definitely loaded and not found:
                    if (roles.length > 0) {
                        addToast(t("Role not found"), "error");
                        navigate('/settings/roles', { replace: true });
                    }
                }
            }
        } else {
            navigate('/settings/roles');
            setCurrentRole(null);
        }
    }, [id, roles, loading, currentCompanyID, navigate, addToast, t]);

    // --- Handlers ---

    const handleEditRole = (role: any) => {
        navigate(`/settings/roles/${role._id}`);
    };

    const handleCreateRole = () => {
        navigate('/settings/roles/new');
    };

    const handleCopyRole = (e: React.MouseEvent, role: any) => {
        e.stopPropagation();
        addToast(`${t("Schema copied from")} ${role.name}. ${t("Create a new role to paste settings.")}`, 'success');
    };

    const handleDeleteRole = (e: React.MouseEvent, role: any) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${role.name}?`)) {
            addToast(`${t("Role")} ${role.name} ${t("deleted")}`, 'success');
        }
    };

    const handleSaveRole = async () => {
        if (!roleForm.roleName) {
            addToast(t("Role Name is required"), "error");
            return;
        }
        try {
            const { default: api } = await import('../../../services/api');
            if (currentRole) {
                await api.put(`/auth/roles/${currentRole._id}`, roleForm);
                addToast(t("Role updated successfully"), 'success');
            } else {
                await api.post('/auth/roles', roleForm);
                addToast(t("Role created successfully"), 'success');
            }
            navigate('/settings/roles');
        } catch (error) {
            console.error("Save failed", error);
            addToast(t("Failed to save role"), "error");
        }
    };

    const handlePermissionToggle = (path: string[], value: boolean) => {
        setRoleForm((prev: any) => {
            // ... (keep permission logic same as before)
            const newAccessibilitySettings = JSON.parse(JSON.stringify(prev.accessibilitySettings || {}));
            let node = newAccessibilitySettings;
            const parentPath = path.slice(0, -1);
            const property = path[path.length - 1];

            // Traverse to the parent of the property
            for (let i = 0; i < parentPath.length; i++) {
                if (!node[parentPath[i]]) node[parentPath[i]] = {}; // Should depend on structure
                node = node[parentPath[i]];
            }

            // Set the target property
            node[property] = value;

            // Enforce Hierarchy: Enabled < Visible < Editable < Deletable
            const isDelete = property.startsWith('delete') || property.startsWith('remove');
            const deleteKey = Object.keys(node).find(key => key.startsWith('delete') || key.startsWith('remove'));

            // Case 1: Enabling Deletable -> Enable Editable, Visible, Enabled
            if (isDelete && value === true) {
                if (node.editable !== undefined) node.editable = true;
                if (node.visible !== undefined) node.visible = true;
                if (node.enabled !== undefined) node.enabled = true;
            }

            // Case 2: Enabling Editable -> Enable Visible, Enabled
            if (property === 'editable' && value === true) {
                if (node.visible !== undefined) node.visible = true;
                if (node.enabled !== undefined) node.enabled = true;
            }

            // Case 3: Enabling Visible -> Enable Enabled
            if (property === 'visible' && value === true) {
                if (node.enabled !== undefined) node.enabled = true;
            }

            // Case 4: Disabling Enabled -> Disable Visible, Editable, Deletable
            if (property === 'enabled' && value === false) {
                if (node.visible !== undefined) node.visible = false;
                if (node.editable !== undefined) node.editable = false;
                if (deleteKey && node[deleteKey] !== undefined) node[deleteKey] = false;
            }

            // Case 5: Disabling Visible -> Disable Editable, Deletable
            if (property === 'visible' && value === false) {
                if (node.editable !== undefined) node.editable = false;
                if (deleteKey && node[deleteKey] !== undefined) node[deleteKey] = false;
            }

            // Case 6: Disabling Editable -> Disable Deletable
            if (property === 'editable' && value === false) {
                if (deleteKey && node[deleteKey] !== undefined) node[deleteKey] = false;
            }

            return { ...prev, accessibilitySettings: newAccessibilitySettings };
        });
    };

    // removed handleHierarchySelect

    // --- RENDER: LIST VIEW ---
    if (view === 'LIST') {
        const filteredRoles = roles.filter(r => (r.roleName || '').toLowerCase().includes(searchQuery.toLowerCase()));

        return (
            <div className="h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />
                                    {t("Roles & Permissions")}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">{t("Manage access levels and define capabilities for your organization.")}</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                {/* Search Logic ... */}
                                <div className="relative flex-1 md:w-64">
                                    <input
                                        type="text"
                                        placeholder={t("Search roles...")}
                                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                </div>
                                <button
                                    onClick={handleCreateRole}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                                >
                                    <Plus size={16} /> {t("Add Role")}
                                </button>
                            </div>
                        </div>

                        {/* ROLE OVERVIEW CARDS (Hierarchy Replacement) */}
                        <RoleOverviewCards
                            roles={filteredRoles}
                            userCounts={userCounts}
                            onSelectRole={handleEditRole}
                        />

                        {/* Traditional Table View (Redundant? Maybe keep as detailed view or remove if cards suffice. User asked to "Remove Permission Hierarchy from here" (EDITOR) and "present in initial view". Table gives more details like "Last Updated". Let's keep table for now as it's standard admin UI, cards are top summary.) */}

                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden mt-8">
                            <table className="w-full text-left text-sm">
                                {/* ... keep table ... */}
                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4">{t("Role Name")}</th>
                                        <th className="px-6 py-4">{t("Description")}</th>
                                        <th className="px-6 py-4">{t("Users")}</th>
                                        <th className="px-6 py-4">{t("Last Updated")}</th>
                                        <th className="px-6 py-4 text-right">{t("Actions")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {filteredRoles.map(role => (
                                        <tr
                                            key={role._id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                            onClick={() => {
                                                // Allow viewing, but maybe set read-only mode inside?
                                                // For now, let's allow navigation, but the Editor will handle the "Read Only" state if not senior.
                                                handleEditRole(role);
                                            }}
                                        >
                                            {/* ... */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    {role.roleName}
                                                    {role.isSystem && <Lock size={12} className="text-amber-500" title={t("System Role")} />}
                                                </div>
                                                <div className="text-[10px] font-mono text-slate-400">{role._id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[250px] truncate">
                                                {role.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${userCounts[role._id] ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {userCounts[role._id] || 0} Users
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                                {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Copy is usually safe, but maybe restrict too? Let's keep copy open for now unless strict. */}
                                                    <button onClick={(e) => handleCopyRole(e, role)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Copy size={16} /></button>

                                                    {!role.isSystem && (
                                                        <>
                                                            {isSeniorTo(role._id) ? (
                                                                <button onClick={(e) => handleDeleteRole(e, role)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                                            ) : (
                                                                <span className="p-1.5 text-slate-300 cursor-not-allowed" title={t("Insufficient seniority")}><Trash2 size={16} /></span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: EDITOR VIEW ---
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-8 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/settings/roles')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            {id === 'new' ? t("Create New Role") : (isEditing ? `${t("Editing")} ${currentRole?.roleName || ''}` : currentRole?.roleName || t("Role Details"))}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("Configure detailed permissions and scope.")}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!isEditing ? (
                        <>
                            {currentRole && isSeniorTo(currentRole._id || currentRole.id) ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"
                                >
                                    <Edit2 size={16} /> {t("Edit Role")}
                                </button>
                            ) : (
                                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed">
                                    <Lock size={16} /> {t("Read Only (Seniority Restricted)")}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    if (id === 'new') {
                                        navigate('/settings/roles');
                                    } else {
                                        setIsEditing(false);
                                        // Reset form to currentRole
                                        if (currentRole) {
                                            setRoleForm({
                                                roleName: currentRole.roleName,
                                                description: currentRole.description,
                                                accessibilitySettings: currentRole.accessibilitySettings || {},
                                                companyID: currentRole.companyID
                                            });
                                        }
                                    }
                                }}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300"
                            >
                                {t("Cancel")}
                            </button>
                            <button onClick={handleSaveRole} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                                <Save size={16} /> {t("Save Role")}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Meta Information */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">{t("Role Details")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("Role Name")} <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="e.g. Senior Recruiter"
                                    value={roleForm.roleName}
                                    onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("Description")}</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder={t("Briefly describe the purpose of this role")}
                                    value={roleForm.description}
                                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* REMOVED Permission Hierarchy Selector from Editor */}

                    {/* Permissions Editor */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Layers size={18} className="text-slate-400" />
                                {t("Detailed Permissions")}
                            </h4>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {/* Keep the loop */}
                            {Object.keys(roleForm.accessibilitySettings || {}).map((category) => {
                                const data = roleForm.accessibilitySettings[category];
                                if (typeof data !== 'object' || data === null) return null;

                                return (
                                    <PermissionAccordion
                                        key={category}
                                        label={t(category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim())}
                                        data={data}
                                        categoryKey={category}
                                        onChange={handlePermissionToggle}
                                        readOnly={!isEditing}
                                    />
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
