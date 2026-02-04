import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/Toast';
import { Loader2, Save, GripVertical, AlertTriangle } from 'lucide-react';

interface Role {
    _id: string;
    roleName: string;
    description: string;
}

interface HierarchyItem {
    roleID: string | Role; // Populated or ID
    rank: number;
}

export const RoleHierarchy = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [orderedRoles, setOrderedRoles] = useState<Role[]>([]);

    // Drag and Drop State
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const dragNode = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { default: api } = await import('../../../services/api');
            const [rolesRes, hierarchyRes] = await Promise.all([
                api.get('/auth/roles'),
                api.get('/auth/roles/hierarchy')
            ]);

            const allRoles: Role[] = rolesRes.data || [];
            const hierarchyData: HierarchyItem[] = hierarchyRes.data.hierarchy || [];

            // Sort roles based on hierarchy
            // If hierarchy exists, use it. Missing roles go to the bottom.
            // Rank 1 is highest (top).

            let sorted: Role[] = [];

            if (hierarchyData.length > 0) {
                // Map hierarchy to roles
                const hierarchyMap = new Map<string, number>(); // RoleID -> Rank
                hierarchyData.forEach(h => {
                    const rId = typeof h.roleID === 'object' ? (h.roleID as Role)._id : h.roleID;
                    hierarchyMap.set(rId, h.rank);
                });

                const rankedRoles = allRoles.filter(r => hierarchyMap.has(r._id));
                const unrankedRoles = allRoles.filter(r => !hierarchyMap.has(r._id));

                rankedRoles.sort((a, b) => (hierarchyMap.get(a._id) || 0) - (hierarchyMap.get(b._id) || 0));

                sorted = [...rankedRoles, ...unrankedRoles];
            } else {
                // Default sort (maybe by name or just as received)
                sorted = [...allRoles];
            }

            setRoles(allRoles);
            setOrderedRoles(sorted);

        } catch (error) {
            console.error("Failed to fetch hierarchy data", error);
            addToast(t("Failed to load roles"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { default: api } = await import('../../../services/api');

            // Construct payload: [{ roleID, rank }]
            // Top of list = Rank 1
            const payload = orderedRoles.map((role, index) => ({
                roleID: role._id,
                rank: index + 1
            }));

            await api.post('/auth/roles/hierarchy', { hierarchy: payload });
            addToast(t("Role hierarchy updated successfully"), 'success');
        } catch (error) {
            console.error("Failed to save hierarchy", error);
            addToast(t("Failed to save hierarchy"), "error");
        } finally {
            setSaving(false);
        }
    };

    // --- Drag and Drop Handlers ---

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItem(index);
        dragNode.current = e.target as HTMLDivElement;
        e.dataTransfer.effectAllowed = 'move';
        // Make ghost transparent or style it
        dragNode.current.style.opacity = '0.5';
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        if (draggedItem === null || draggedItem === index) return;

        const newOrderedRoles = [...orderedRoles];
        const item = newOrderedRoles[draggedItem];
        newOrderedRoles.splice(draggedItem, 1);
        newOrderedRoles.splice(index, 0, item);

        setDraggedItem(index);
        setOrderedRoles(newOrderedRoles);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        if (dragNode.current) {
            dragNode.current.style.opacity = '1';
            dragNode.current = null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        {/* Replace with GitBranch if available or similar */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
                    </span>
                    {t("Role Hierarchy")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {t("Define the seniority of roles. Roles at the top are considered senior to roles at the bottom. This affects edit permissions (e.g., Seniors can edit Juniors' data).")}
                </p>

                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex gap-3 text-sm text-amber-800 dark:text-amber-200">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">{t("Important")}:</span> {t("Reordering affects the entire company context. Ensure the order reflects the actual chain of command.")}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Highest Authority (Senior)")}</span>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {t("Save Changes")}
                    </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orderedRoles.map((role, index) => (
                        <div
                            key={role._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()} // Necessary to allow dropping
                            className={`flex items-center p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-move group ${draggedItem === index ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                        >
                            <div className="mr-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400">
                                <GripVertical size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {index + 1}
                                    </span>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{role.roleName}</h3>
                                </div>
                                {role.description && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 ml-9 mt-0.5 line-clamp-1">{role.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Lowest Authority (Junior)")}</span>
                </div>
            </div>
        </div>
    );
};
