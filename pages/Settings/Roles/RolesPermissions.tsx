
import React, { useState, useMemo } from 'react';
import { 
  Shield, Plus, Copy, Search, Edit2, Trash2, ChevronLeft, 
  Save, CheckCircle, AlertCircle, ChevronDown, ChevronRight,
  Layers, Lock, Clock, Check, X
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';

// --- MOCK DATA ---

const MOCK_ROLES = [
  { id: 'R-SUPER-ADMIN', name: 'Super Administrator', description: 'Full system access with no restrictions.', users: 3, created: 'Jan 10, 2024', updated: 'May 21, 2025' },
  { id: 'R-PROD-ADMIN', name: 'Product Admin', description: 'Manages campaigns, candidates, and workflows.', users: 5, created: 'Feb 14, 2024', updated: 'May 15, 2025' },
  { id: 'R-RECRUITER', name: 'Recruiter', description: 'Standard access for sourcing and interviewing.', users: 12, created: 'Mar 01, 2024', updated: 'Apr 20, 2025' },
  { id: 'R-HM', name: 'Hiring Manager', description: 'View-only access to assigned campaigns and interviews.', users: 8, created: 'Mar 05, 2024', updated: 'Apr 10, 2025' },
  { id: 'R-SOURCER', name: 'Sourcer', description: 'Dedicated to candidate discovery and pipeline filling.', users: 4, created: 'Apr 12, 2024', updated: 'May 01, 2025' },
];

const DEFAULT_PERMISSIONS = {
    "System & Administration": {
        "overRide": true,
        "globalSearch": true,
        "tableEdit": {
            "visible": true,
            "enabled": true,
            "saveDefault": true
        },
        "settings": {
            "enabled": true,
            "visible": true,
            "companyInfo": { "enabled": true, "visible": true },
            "notifications": { "enabled": true, "visible": true },
            "themes": { "enabled": true, "visible": true },
            "users": {
                "enabled": true, "visible": true,
                "createUser": true, "updateUser": true, "removeUser": true
            },
            "roles": {
                "enabled": true, "visible": true,
                "createRole": true, "updateRole": true, "removeRole": true
            }
        }
    },
    "Chatbot & AI": {
        "chatbot": {
            "enabled": true,
            "visible": true,
            "createBot": { "enabled": true, "visible": true },
            "knowledgeBase": { "enabled": true, "visible": true },
            "botAnalytics": { "enabled": true, "visible": true }
        },
        "genAI": {
            "enabled": true,
            "visible": true
        }
    },
    "Source AI": {
        "sourceAI": {
            "enabled": true,
            "visible": true,
            "campaigns": {
                "createCampaign": true, "updateCampaign": true, "removeCampaign": true,
                "jobFitScore": true
            },
            "searchPeople": {
                "enabled": true, "visible": true,
                "byKeywords": true, "byTags": true
            }
        },
        "profiles": {
            "enabled": true, "visible": true,
            "advancedSearch": { "visible": true, "enabled": true },
            "exportProfile": true
        }
    },
    "Engage AI": {
        "engageAI": {
            "enabled": true, "visible": true,
            "screeningRound": {
                "createScreeningRound": true, "updateScreeningRound": true
            },
            "automation": { "enabled": true, "visible": true },
            "reachOut": {
                "enabled": true, "visible": true,
                "massEmail": true, "massSMS": true
            }
        }
    }
};

// --- UTILS ---

const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
};

// --- SUB-COMPONENTS ---

interface PermissionToggleProps {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
}

const PermissionToggle: React.FC<PermissionToggleProps> = ({ label, value, onChange, disabled }) => (
    <div className={`flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{formatKey(label)}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                className="sr-only peer"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
    </div>
);

const RecursivePermissionGroup = ({ data, path = [], onToggle }: { data: any, path: string[], onToggle: (path: string[], val: boolean) => void }) => {
    // If it's a leaf node (boolean), render toggle
    if (typeof data === 'boolean') {
        const key = path[path.length - 1];
        if(key === 'visible' || key === 'enabled') return null; // These are handled by parent
        return <PermissionToggle label={key} value={data} onChange={(val) => onToggle(path, val)} />;
    }

    // Identify if this object is a "Feature Node" (has enabled/visible props)
    const isFeatureNode = 'enabled' in data || 'visible' in data;
    const isRoot = path.length === 0;

    return (
        <div className={`space-y-1 ${!isRoot ? 'ml-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800' : ''}`}>
            {Object.keys(data).map(key => {
                const value = data[key];
                const currentPath = [...path, key];
                
                // Skip meta keys if we are iterating inside a feature node, they are handled by the node header usually
                if (key === 'enabled' || key === 'visible') return null;

                if (typeof value === 'boolean') {
                    return (
                        <PermissionToggle 
                            key={key} 
                            label={key} 
                            value={value} 
                            onChange={(val) => onToggle(currentPath, val)} 
                        />
                    );
                }

                if (typeof value === 'object' && value !== null) {
                    const childEnabled = value.enabled !== undefined ? value.enabled : true;
                    
                    return (
                        <div key={key} className="mt-4 first:mt-0">
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {formatKey(key)}
                                </h5>
                                {value.enabled !== undefined && (
                                    <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={value.enabled}
                                            onChange={(e) => onToggle([...currentPath, 'enabled'], e.target.checked)}
                                        />
                                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                )}
                            </div>
                            
                            <div className={!childEnabled ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                <RecursivePermissionGroup 
                                    data={value} 
                                    path={currentPath} 
                                    onToggle={onToggle} 
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export const RolesPermissions = () => {
  const { addToast } = useToast();
  const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [roleForm, setRoleForm] = useState<any>({ name: '', description: '', permissions: {} });
  const [searchQuery, setSearchQuery] = useState('');

  // --- Handlers ---

  const handleEditRole = (role: any) => {
    setCurrentRole(role);
    setRoleForm({
        name: role.name,
        description: role.description,
        permissions: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)) // Reset to default structure for demo, normally load from backend
    });
    setView('EDITOR');
  };

  const handleCreateRole = () => {
    setCurrentRole(null);
    setRoleForm({
        name: '',
        description: '',
        permissions: JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS))
    });
    setView('EDITOR');
  };

  const handleCopyRole = (e: React.MouseEvent, role: any) => {
    e.stopPropagation();
    addToast(`Schema copied from ${role.name}. Create a new role to paste settings.`, 'success');
  };

  const handleDeleteRole = (e: React.MouseEvent, role: any) => {
    e.stopPropagation();
    if(confirm(`Are you sure you want to delete ${role.name}?`)) {
        addToast(`Role ${role.name} deleted`, 'success');
    }
  };

  const handleSaveRole = () => {
    if (!roleForm.name) {
        addToast("Role Name is required", "error");
        return;
    }
    addToast(`Role "${roleForm.name}" saved successfully`, 'success');
    setView('LIST');
  };

  const handlePermissionToggle = (path: string[], value: boolean) => {
      setRoleForm((prev: any) => {
          const newPermissions = JSON.parse(JSON.stringify(prev.permissions));
          let current = newPermissions;
          
          for (let i = 0; i < path.length - 1; i++) {
              current = current[path[i]];
          }
          
          current[path[path.length - 1]] = value;
          return { ...prev, permissions: newPermissions };
      });
  };

  // --- RENDER: LIST VIEW ---
  if (view === 'LIST') {
      const filteredRoles = MOCK_ROLES.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />
                            Roles & Permissions
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage access levels and define capabilities for your organization.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input 
                                type="text" 
                                placeholder="Search roles..." 
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
                            <Plus size={16} /> Add Role
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Role Name</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Users</th>
                                <th className="px-6 py-4">Last Updated</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredRoles.map(role => (
                                <tr 
                                    key={role.id} 
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                    onClick={() => handleEditRole(role)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            {role.name}
                                            {role.id === 'R-SUPER-ADMIN' && <Lock size={12} className="text-amber-500" title="System Role" />}
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-400">{role.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-[250px] truncate">
                                        {role.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-medium text-slate-600 dark:text-slate-300">
                                            {role.users} Users
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                        {role.updated}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => handleCopyRole(e, role)}
                                                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500 dark:text-slate-400"
                                                title="Copy Permission Schema"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            {role.id !== 'R-SUPER-ADMIN' && (
                                                <button 
                                                    onClick={(e) => handleDeleteRole(e, role)}
                                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500"
                                                    title="Delete Role"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
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
      );
  }

  // --- RENDER: EDITOR VIEW ---
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="px-8 py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('LIST')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {currentRole ? `Edit ${currentRole.name}` : 'Create New Role'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Configure detailed permissions and scope.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={() => setView('LIST')} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300">Cancel</button>
                <button onClick={handleSaveRole} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                    <Save size={16} /> Save Role
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Meta Information */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Role Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Role Name <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                placeholder="e.g. Senior Recruiter"
                                value={roleForm.name}
                                onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200"
                                placeholder="Briefly describe the purpose of this role"
                                value={roleForm.description}
                                onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Permissions Editor */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {Object.keys(roleForm.permissions).map((category) => (
                        <div key={category} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{category}</h4>
                                <Layers size={16} className="text-slate-400" />
                            </div>
                            <div className="p-6">
                                <RecursivePermissionGroup 
                                    data={roleForm.permissions[category]} 
                                    path={[category]} 
                                    onToggle={handlePermissionToggle}
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </div>
  );
};
