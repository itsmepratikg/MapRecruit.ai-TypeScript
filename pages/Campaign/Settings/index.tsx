import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Campaign } from '../../../types';
import { UserPlus, Trash2, X, Power, Search, GitBranch, MessageCircle, Calendar } from '../../../components/Icons';
import { ConfirmationModal } from '../../../components/Common/ConfirmationModal';

export const CampaignSettings = ({ campaign }: { campaign: Campaign }) => {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch users for resolving IDs
    const [allUsers, setAllUsers] = useState<any[]>([]);

    useEffect(() => {
        import('../../../services/api').then(({ userService }) => {
            userService.getAll().then(res => {
                const fetchedUsers = Array.isArray(res) ? res : (res.data || res.users || []);
                setAllUsers(fetchedUsers);
            }).catch(e => console.error("Failed to fetch users", e));
        });
    }, []);

    const mapUsers = (ids: string[]) => {
        return (ids || []).map(id => {
            const user = allUsers.find(u => u._id === id || u.id === id);
            return {
                id,
                name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || id : id,
                initials: user ? (user.firstName?.charAt(0) || user.name?.charAt(0) || id.charAt(0)).toUpperCase() : 'U',
                avatar: user?.avatar || user?.profilePic || user?.profilePicture || user?.image || null,
                color: user?.color || 'bg-slate-200 text-slate-600',
                status: user?.status,
                enabled: user?.enabled
            };
        });
    };

    // Real states mapped from backend schema
    const [owners, setOwners] = useState<string[]>((campaign as any).teams?.ownerID || (campaign as any).ownerID || []);
    const [managers, setManagers] = useState<string[]>((campaign as any).teams?.managerID || (campaign as any).managerID || []);
    const [recruiters, setRecruiters] = useState<string[]>((campaign as any).teams?.recruiterID || (campaign as any).recruiterID || []);

    const displayOwners = mapUsers(owners);
    const displayManagers = mapUsers(managers);
    const displayRecruiters = mapUsers(recruiters);

    // User selection dropdown state
    const [addingRole, setAddingRole] = useState<'owner' | 'manager' | 'recruiter' | null>(null);

    const [campaignStatus, setCampaignStatus] = useState(campaign.status || 'Active');
    const [openJob, setOpenJob] = useState((campaign as any).openJob ?? (campaign.status === 'Active'));

    const [displayTitle, setDisplayTitle] = useState((campaign as any).displayTitle || 'Campaign Title');
    const [closedAt, setClosedAt] = useState((campaign as any).closedAt ? new Date((campaign as any).closedAt).toISOString().split('T')[0] : '');

    const [selectedJobBoards, setSelectedJobBoards] = useState<string[]>([]);
    const [isJobBoardDropdownOpen, setIsJobBoardDropdownOpen] = useState(false);

    const availableJobBoards = [
        { id: 'linkedin', name: 'LinkedIn' },
        { id: 'indeed', name: 'Indeed' },
        { id: 'glassdoor', name: 'Glassdoor' },
        { id: 'ziprecruiter', name: 'ZipRecruiter' }
    ];

    const toggleJobBoard = (boardId: string) => {
        setSelectedJobBoards(prev =>
            prev.includes(boardId)
                ? prev.filter(id => id !== boardId)
                : [...prev, boardId]
        );
    };

    // Auto-close on load if passed
    useEffect(() => {
        if (closedAt && campaign.status !== 'Archived') {
            const selectedDate = new Date(closedAt);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today && campaignStatus !== 'Closed') {
                setCampaignStatus('Closed');
            }
        }
    }, [closedAt, campaign.status]);

    const [sourceAI, setSourceAI] = useState(campaign.campaignModules?.sourceAI?.enabled ?? true);
    const [matchAI, setMatchAI] = useState(campaign.campaignModules?.matchAI?.enabled ?? true);
    const [engageAI, setEngageAI] = useState(campaign.campaignModules?.engageAI?.enabled ?? true);
    const [qualifyAI, setQualifyAI] = useState(campaign.campaignModules?.qualifyAI?.enabled ?? true);

    const handleSourceAIToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked;
        setSourceAI(val);
        if (!val) {
            setMatchAI(false);
            setEngageAI(false);
            setQualifyAI(false);
        }
    };

    const handleMatchAIToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked;
        setMatchAI(val);
        if (!val) {
            setEngageAI(false);
            setQualifyAI(false);
        }
    };

    const handleSave = () => {
        const payload: any = {
            status: campaignStatus,
            openJob: campaignStatus === 'Active' ? openJob : false,
            closedAt: closedAt ? new Date(closedAt).toISOString() : undefined,
            // other settings...
        };

        if (campaignStatus === 'Closed' && campaign.status !== 'Closed') {
            payload.closedAt = new Date().toISOString(); // UTC, overriding any future closing date if manually forced closed now
        }

        console.log("Saving campaign with settings:", payload);
        setShowSaveModal(false);
    };

    const handleRemoveMember = (role: 'owner' | 'manager' | 'recruiter', id: string) => {
        if (role === 'owner') setOwners(owners.filter(o => o !== id));
        if (role === 'manager') setManagers(managers.filter(m => m !== id));
        if (role === 'recruiter') setRecruiters(recruiters.filter(r => r !== id));
    };

    const handleSelectUser = (role: 'owner' | 'manager' | 'recruiter', id: string) => {
        if (!id) return;
        setOwners(owners.filter(o => o !== id));
        setManagers(managers.filter(m => m !== id));
        setRecruiters(recruiters.filter(r => r !== id));

        if (role === 'owner') setOwners([...owners, id]);
        if (role === 'manager') setManagers([...managers, id]);
        if (role === 'recruiter') setRecruiters([...recruiters, id]);
        
        setAddingRole(null);
    };

    const renderUserDropdown = (role: 'owner' | 'manager' | 'recruiter', currentList: string[]) => {
        if (addingRole !== role) return null;
        
        // Filter out completely deactivated users, and those already in to the exact same list
        const availableUsers = allUsers.filter(u => 
            String(u.status).toLowerCase() !== 'deactivated' && 
            String(u.enabled) !== 'false' && 
            !currentList.includes(u._id || u.id)
        );

        return (
            <div className="absolute top-12 right-2 z-20 w-64 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg p-1 max-h-60 flex flex-col">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 flex justify-between items-center">
                    Select User
                    <button onClick={() => setAddingRole(null)} className="hover:text-slate-800 dark:hover:text-slate-200"><X size={14}/></button>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    {availableUsers.length > 0 ? availableUsers.map(u => (
                        <div key={u._id || u.id} onClick={() => handleSelectUser(role, u._id || u.id)} className="px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm rounded flex items-center gap-2 transition-colors">
                            <div className="w-6 h-6 shrink-0 rounded-full bg-slate-200 dark:bg-slate-600 text-[10px] text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                                {(u.firstName?.[0] || u.name?.[0] || 'U').toUpperCase()}
                            </div>
                            <span className="truncate font-medium text-slate-700 dark:text-slate-200">{`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || u.email || 'Unknown User'}</span>
                            {(owners.includes(u._id || u.id) || managers.includes(u._id || u.id) || recruiters.includes(u._id || u.id)) && (
                                <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 rounded">Reassign</span>
                            )}
                        </div>
                    )) : <div className="p-3 text-xs text-center text-slate-500">No available users found.</div>}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto h-full overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Campaign Settings</h2>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-lg font-bold shadow-sm border border-indigo-200 dark:border-indigo-800 transition-colors">
                            Edit Configurations
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancel</button>
                            <button onClick={() => setShowSaveModal(true)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition-colors">Save Changes</button>
                        </>
                    )}
                </div>
            </div>

            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 pb-2 transition-all duration-300 ${!isEditing ? 'pointer-events-none opacity-80 select-none grayscale-[15%]' : ''}`}>
                {/* General Details */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Campaign Name</label>
                            <input type="text" defaultValue={campaign.name} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Title</label>
                            <select
                                value={displayTitle}
                                onChange={(e) => setDisplayTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="Campaign Title">Campaign Title</option>
                                <option value="Job Title">Job Title</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status (Published)</label>
                            
                            <div className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (campaignStatus === 'Archived') {
                                            toast.error('This is not allowed. An archived campaign cannot be reopened.');
                                        } else {
                                            setCampaignStatus(campaignStatus === 'Active' ? 'Closed' : 'Active');
                                        }
                                    }}
                                    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-inner ${
                                        campaignStatus === 'Active' 
                                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300' 
                                            : campaignStatus === 'Closed'
                                            ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-300'
                                            : 'bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed border border-slate-400 dark:border-slate-800'
                                    }`}
                                >
                                    <Power size={22} className={campaignStatus === 'Active' || campaignStatus === 'Closed' ? 'drop-shadow-md' : ''} />
                                    {/* Small indicator light */}
                                    <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-50 dark:border-slate-800 ${
                                        campaignStatus === 'Active' ? 'bg-emerald-300' :
                                        campaignStatus === 'Closed' ? 'bg-amber-300' :
                                        'bg-slate-400'
                                    }`}></div>
                                </button>

                                <div className="flex flex-col flex-1">
                                    <span className={`text-base font-bold ${
                                        campaignStatus === 'Active' ? 'text-emerald-700 dark:text-emerald-400' :
                                        campaignStatus === 'Closed' ? 'text-red-700 dark:text-red-400' :
                                        'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {campaignStatus === 'Active' ? 'Active' : campaignStatus === 'Closed' ? 'Closed' : 'Archived'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional info side: For Active Date selection */}
                        {campaignStatus !== 'Archived' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Campaign Closing Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="date" 
                                        value={closedAt}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setClosedAt(val);
                                            if (val && campaignStatus !== 'Archived') {
                                                const selectedDate = new Date(val);
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                if (selectedDate < today) {
                                                    setCampaignStatus('Closed');
                                                } else {
                                                    setCampaignStatus('Active');
                                                }
                                            }
                                        }}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">When should this campaign be moved to closed status?</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Publish Section */}
                <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm transition-opacity ${campaignStatus !== 'Active' ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Job Publish</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage if this job is visible to candidates.</p>
                            {campaignStatus !== 'Active' && <p className="text-xs text-amber-500 mt-1">Campaign must be Active/Published to enable job posting.</p>}
                        </div>
                        <label className={`relative inline-flex items-center ${campaignStatus === 'Active' ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={campaignStatus === 'Active' ? openJob : false}
                                onChange={(e) => setOpenJob(e.target.checked)}
                                disabled={campaignStatus !== 'Active'}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">Open Job</span>
                        </label>
                    </div>

                    {/* Job Posting via Job Boards Dropdown */}
                    <div className={`transition-opacity ${!openJob || campaignStatus !== 'Active' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-1">Job Posting</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select external job boards to post this campaign to.</p>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Boards</label>

                            {/* Custom Multi-Select Dropdown */}
                            <div className="relative">
                                <div
                                    className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between cursor-pointer bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 ${!openJob || campaignStatus !== 'Active' ? 'border-slate-200 dark:border-slate-600 opacity-70 cursor-not-allowed' : 'border-slate-200 dark:border-slate-600 hover:border-emerald-500'}`}
                                    onClick={() => (!openJob || campaignStatus !== 'Active') ? null : setIsJobBoardDropdownOpen(!isJobBoardDropdownOpen)}
                                >
                                    <div className="flex flex-wrap gap-1 items-center min-h-[24px]">
                                        {selectedJobBoards.length === 0 ? (
                                            <span className="text-slate-400 dark:text-slate-500 text-sm">Select job boards...</span>
                                        ) : (
                                            selectedJobBoards.map(id => {
                                                const board = availableJobBoards.find(b => b.id === id);
                                                return (
                                                    <span key={id} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                                        {board?.name}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleJobBoard(id); }}
                                                            className="hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded-full p-0.5"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </span>
                                                )
                                            })
                                        )}
                                    </div>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isJobBoardDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {isJobBoardDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsJobBoardDropdownOpen(false)}></div>
                                        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {availableJobBoards.map(board => (
                                                <div
                                                    key={board.id}
                                                    onClick={() => toggleJobBoard(board.id)}
                                                    className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedJobBoards.includes(board.id)}
                                                        readOnly
                                                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800"
                                                    />
                                                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">{board.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaign Modules Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm xl:col-span-2">
                    <div className="border-b border-slate-100 dark:border-slate-700 pb-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Campaign Modules</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enable or disable specific modules for this campaign. Note the hierarchical dependencies.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Source AI */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    <Search size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Source AI</h4>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={sourceAI} onChange={handleSourceAIToggle} />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        {/* Match AI */}
                        <div className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-opacity ${!sourceAI ? 'opacity-50' : ''}`}>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    <GitBranch size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Match AI</h4>
                                    <p className="text-xs text-slate-500 max-w-[150px]">Requires Source AI</p>
                                </div>
                            </div>
                            <label className={`relative inline-flex items-center ${sourceAI ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                <input type="checkbox" className="sr-only peer" checked={sourceAI && matchAI} onChange={handleMatchAIToggle} disabled={!sourceAI} />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        {/* Engage & Qualify AI */}
                        <div className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-opacity ${!matchAI ? 'opacity-50' : ''}`}>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    <MessageCircle size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Engage AI</h4>
                                    <p className="text-xs text-slate-500 max-w-[150px]">Requires Match AI </p>
                                </div>
                            </div>
                            <label className={`relative inline-flex items-center ${matchAI ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                <input type="checkbox" className="sr-only peer" checked={matchAI && engageAI} onChange={(e) => {
                                    setEngageAI(e.target.checked);
                                    setQualifyAI(e.target.checked);
                                }} disabled={!matchAI} />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Panel Members Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm xl:col-span-2">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Panel Members</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage campaign owners, hiring managers, and recruiters.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Owner Column */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full h-min-[300px] overflow-visible pb-2 pt-2 shadow-sm shrink-0">
                            <div className="relative px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/50 mx-2 rounded-lg flex justify-between items-center mb-2">
                                <h4 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">Owner ({owners.length})</h4>
                                <button onClick={() => setAddingRole(addingRole === 'owner' ? null : 'owner')} className={`${addingRole === 'owner' ? 'bg-indigo-200 dark:bg-indigo-800' : ''} text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 p-1.5 rounded transition-colors`}><UserPlus size={16} /></button>
                                {renderUserDropdown('owner', owners)}
                            </div>
                            <div className="px-4 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                {displayOwners.length > 0 ? displayOwners.slice(0, 5).map((member, i) => (
                                    <div key={i} className={`flex items-center justify-between p-2 bg-white dark:bg-slate-800 border ${String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false' ? 'border-red-200 dark:border-red-900/50 opacity-70' : 'border-slate-200 dark:border-slate-700'} rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)]`}>
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{member.initials || 'O'}</div>
                                            )}
                                            <div className="flex flex-col">
                                               <span className={`text-sm font-medium ${String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{member.name || member.id}</span>
                                               {(String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false') && (
                                                   <span className="text-[10px] text-red-500 font-medium">Deactivated</span>
                                               )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveMember('owner', member.id)} className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                )) : <div className="text-center text-sm text-slate-500 py-4">No owners designated.</div>}
                            </div>
                        </div>

                        {/* Hiring Manager Column */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full h-min-[300px] overflow-visible pb-2 pt-2 shadow-sm shrink-0">
                            <div className="relative px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/50 mx-2 rounded-lg flex justify-between items-center mb-2">
                                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Hiring Manager ({managers.length})</h4>
                                <button onClick={() => setAddingRole(addingRole === 'manager' ? null : 'manager')} className={`${addingRole === 'manager' ? 'bg-emerald-200 dark:bg-emerald-800' : ''} text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 p-1.5 rounded transition-colors`}><UserPlus size={16} /></button>
                                {renderUserDropdown('manager', managers)}
                            </div>
                            <div className="px-4 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                {displayManagers.length > 0 ? displayManagers.slice(0, 5).map((member, i) => (
                                    <div key={i} className={`flex items-center justify-between p-2 bg-white dark:bg-slate-800 border ${String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false' ? 'border-red-200 dark:border-red-900/50 opacity-70' : 'border-slate-200 dark:border-slate-700'} rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)]`}>
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{member.initials || 'HM'}</div>
                                            )}
                                            <div className="flex flex-col">
                                               <span className={`text-sm font-medium ${String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{member.name || member.id}</span>
                                               {(String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false') && (
                                                   <span className="text-[10px] text-red-500 font-medium">Deactivated</span>
                                               )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveMember('manager', member.id)} className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                )) : <div className="text-center text-sm text-slate-500 py-4">No managers designated.</div>}
                            </div>
                        </div>

                        {/* Recruiter Column */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full h-min-[300px] overflow-visible pb-2 pt-2 shadow-sm shrink-0">
                            <div className="relative px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/50 mx-2 rounded-lg flex justify-between items-center mb-2">
                                <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Recruiter ({recruiters.length})</h4>
                                <button onClick={() => setAddingRole(addingRole === 'recruiter' ? null : 'recruiter')} className={`${addingRole === 'recruiter' ? 'bg-amber-200 dark:bg-amber-800' : ''} text-amber-600 dark:text-amber-400 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 p-1.5 rounded transition-colors`}><UserPlus size={16} /></button>
                                {renderUserDropdown('recruiter', recruiters)}
                            </div>
                            <div className="px-4 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                {displayRecruiters.length > 0 ? displayRecruiters.slice(0, 5).map((member, i) => (
                                    <div key={i} className={`flex items-center justify-between p-2 bg-white dark:bg-slate-800 border ${String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false' ? 'border-red-200 dark:border-red-900/50 opacity-70' : 'border-slate-200 dark:border-slate-700'} rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)]`}>
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">{member.initials || 'R'}</div>
                                            )}
                                            <div className="flex flex-col">
                                               <span className={`text-sm font-medium ${String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{member.name || member.id}</span>
                                               {(String(member.status).toLowerCase() === 'deactivated' || String(member.enabled) === 'false') && (
                                                   <span className="text-[10px] text-red-500 font-medium">Deactivated</span>
                                               )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveMember('recruiter', member.id)} className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                )) : <div className="text-center text-sm text-slate-500 py-4">No recruiters designated.</div>}
                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={showSaveModal}
                    onClose={() => setShowSaveModal(false)}
                    onConfirm={handleSave}
                    title="Save Changes?"
                    message="Are you sure you want to save changes to this campaign configuration?"
                    confirmText="Save Changes"
                    icon="save"
                />
            </div>
        </div>
    );
};
