
import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, Edit2, ChevronLeft, 
  CheckCircle, XCircle, MoreHorizontal, Mail, Phone,
  Filter, Trash2, Shield, Calendar, UserPlus, Power
} from '../../../components/Icons';
import { useToast } from '../../../components/Toast';
import { BasicDetails } from '../../MyAccount/BasicDetails';
import { MOCK_USERS_LIST } from '../../../data';

// Extended Mock Data for Users Table
const USERS_DATA = [
    ...MOCK_USERS_LIST.map(u => ({
        ...u,
        mobile: '+1 (555) 012-3456', // Mock mobile
        createdDate: 'Jan 15, 2024',
        updatedDate: 'May 20, 2025',
        status: 'Active' as 'Active' | 'Inactive'
    })),
    { 
        id: 'usr_106', name: 'Emily Clark', role: 'Recruiter', email: 'emily.c@maprecruit.ai', 
        avatar: null, initials: 'EC', color: 'bg-pink-100 text-pink-700',
        mobile: '+1 (555) 987-6543', createdDate: 'Feb 10, 2024', updatedDate: 'Apr 05, 2025', status: 'Inactive' 
    },
    { 
        id: 'usr_107', name: 'Robert Fox', role: 'Hiring Manager', email: 'robert.f@maprecruit.ai', 
        avatar: null, initials: 'RF', color: 'bg-teal-100 text-teal-700',
        mobile: '+1 (555) 456-7890', createdDate: 'Mar 22, 2024', updatedDate: 'May 12, 2025', status: 'Active' 
    }
];

export const UsersSettings = () => {
  const { addToast } = useToast();
  const [view, setView] = useState<'LIST' | 'EDIT'>('LIST');
  const [users, setUsers] = useState(USERS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingUser, setEditingUser] = useState<any>(null);

  // --- Handlers ---

  const handleEditUser = (user: any) => {
      setEditingUser(user);
      setView('EDIT');
  };

  const handleCreateUser = () => {
      // Initialize empty user
      setEditingUser({
          firstName: '', lastName: '', email: '', phone: '', 
          role: 'Recruiter', status: 'Active', color: 'Blue',
          countryCode: 'US', jobTitle: '', location: '', activeClient: ''
      });
      setView('EDIT');
  };

  const handleSaveUser = (userData: any) => {
      if (editingUser.id) {
          // Update
          setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData, name: `${userData.firstName} ${userData.lastName}` } : u));
          addToast(`User ${userData.firstName} updated successfully`, 'success');
      } else {
          // Create
          const newUser = {
              ...userData,
              id: `usr_${Date.now()}`,
              name: `${userData.firstName} ${userData.lastName}`,
              initials: (userData.firstName[0] + userData.lastName[0]).toUpperCase(),
              createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: 'Active'
          };
          setUsers(prev => [...prev, newUser]);
          addToast(`User ${newUser.name} created successfully`, 'success');
      }
      setView('LIST');
      setEditingUser(null);
  };

  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
      if (selectedIds.size === filteredUsers.length) {
          setSelectedIds(new Set());
      } else {
          setSelectedIds(new Set(filteredUsers.map(u => u.id)));
      }
  };

  const handleMassUpdate = (action: 'ACTIVATE' | 'DEACTIVATE') => {
      const newStatus = action === 'ACTIVATE' ? 'Active' : 'Inactive';
      setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, status: newStatus } : u));
      addToast(`${selectedIds.size} users updated to ${newStatus}`, 'success');
      setSelectedIds(new Set());
  };

  const filteredUsers = useMemo(() => {
      if (!searchQuery) return users;
      const lower = searchQuery.toLowerCase();
      return users.filter(u => 
          u.name.toLowerCase().includes(lower) || 
          u.email.toLowerCase().includes(lower) ||
          u.role.toLowerCase().includes(lower)
      );
  }, [users, searchQuery]);

  // --- RENDER: EDIT VIEW ---
  if (view === 'EDIT') {
      // Transform flat user object to BasicDetails format if needed
      // BasicDetails expects firstName, lastName etc. 
      // If editing existing user, we need to split name if firstName/lastName missing
      const prepUser = editingUser.firstName ? editingUser : {
          ...editingUser,
          firstName: editingUser.name.split(' ')[0],
          lastName: editingUser.name.split(' ').slice(1).join(' '),
          phone: editingUser.mobile ? editingUser.mobile.replace(/^\+1\s/, '') : '', // strip code for demo
          countryCode: 'US' // default
      };

      return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <BasicDetails 
                  userOverride={prepUser} 
                  onSaveOverride={handleSaveUser}
                  onBack={() => setView('LIST')}
              />
          </div>
      );
  }

  // --- RENDER: LIST VIEW ---
  return (
    <div className="p-8 lg:p-12 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="max-w-7xl mx-auto w-full">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Users size={24} className="text-blue-600 dark:text-blue-400" />
                        User Management
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage system access, roles, and user profiles. 
                        <span className="font-bold text-slate-700 dark:text-slate-300 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                            {users.filter(u => u.status === 'Active').length} Active Users
                        </span>
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <button 
                        onClick={handleCreateUser}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                    >
                        <UserPlus size={16} /> Add User
                    </button>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedIds.size > 0 && (
                <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-300">{selectedIds.size} users selected</span>
                    <div className="flex gap-2">
                        <button onClick={() => handleMassUpdate('ACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-green-300 transition-colors flex items-center gap-1">
                            <CheckCircle size={12} /> Activate
                        </button>
                        <button onClick={() => handleMassUpdate('DEACTIVATE')} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 hover:border-red-300 transition-colors flex items-center gap-1">
                            <Power size={12} /> Deactivate
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                                        checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-4 py-4">User Name</th>
                                <th className="px-4 py-4">Role</th>
                                <th className="px-4 py-4">Contact Info</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Created</th>
                                <th className="px-4 py-4">Last Updated</th>
                                <th className="px-4 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredUsers.map(user => (
                                <tr 
                                    key={user.id} 
                                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer ${selectedIds.has(user.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                    onClick={() => handleEditUser(user)}
                                >
                                    <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                                            checked={selectedIds.has(user.id)}
                                            onChange={() => toggleSelection(user.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.color} shadow-sm border border-white dark:border-slate-700`}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {user.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-mono">{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                            <Shield size={10} /> {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                <Mail size={12} className="text-slate-400" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                <Phone size={12} className="text-slate-400" /> {user.mobile}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {user.status === 'Active' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                                <CheckCircle size={10} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                <XCircle size={10} /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                                        {user.createdDate}
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                                        {user.updatedDate}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                        No users found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};
