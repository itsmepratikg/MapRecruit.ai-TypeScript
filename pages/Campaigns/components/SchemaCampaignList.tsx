import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { campaignService } from '../../../services/api';
import SchemaTable from '../../../components/Schema/SchemaTable';
import { useToast } from '../../../components/Toast';
import {
    ChevronDown, Search, Plus, RefreshCw, MoreVertical,
    ChevronRight, Heart, Network, ArrowUpDown, Briefcase,
    X, Archive
} from '../../../components/Icons';
import { StatusBadge } from '../../../components/Common';
import { HoverMenu } from '../../../components/Campaign/HoverMenu';
import { useUserProfile } from '../../../hooks/useUserProfile';

// Filter Dropdown Component (Inline for now to match CampaignTable structure request)
const FilterDropdown = ({ onChange, selected }: { onChange: (filter: string) => void, selected: string }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const options = ['All', 'Created by Me', 'Shared with Me', 'Favorites', 'New'];

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all min-w-[160px] justify-between shadow-sm"
            >
                <span className="truncate">{t("Filter")}: {t(selected)}</span>
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                        {options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selected === opt
                                    ? 'text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {t(opt)}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const SchemaCampaignList = ({ status, onNavigateToCampaign, onTabChange, onCreateCampaign }: any) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const { userProfile } = useUserProfile();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize activeFilter from URL or default to 'All'
    const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'All');

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    // Sync state with URL params if they change externally (e.g. back button)
    useEffect(() => {
        const filterParam = searchParams.get('filter');
        if (filterParam && filterParam !== activeFilter) {
            setActiveFilter(filterParam);
        }
    }, [searchParams]);

    const handleFilterChange = (newFilter: string) => {
        setActiveFilter(newFilter);
        setSearchParams(prev => {
            prev.set('filter', newFilter);
            return prev;
        });
    };

    useEffect(() => {
        loadCampaigns();
    }, [userProfile?.activeClient]); // Reload if client changes

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const data = await campaignService.getAll();
            setCampaigns(data);
            setSelectedItems([]); // Clear selection on reload
        } catch (error) {
            console.error(error);
            addToast(t("Failed to load campaigns"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkStatusUpdate = async (newStatus: string) => {
        if (selectedItems.length === 0) return;

        setIsBulkUpdating(true);
        try {
            // We'll need to implement this in campaignService
            await campaignService.bulkUpdateStatus(selectedItems, newStatus);
            addToast(`${selectedItems.length} campaigns updated to ${newStatus}`, "success");
            loadCampaigns(); // Refresh list
        } catch (err) {
            console.error("Bulk update failed", err);
            addToast("Failed to update campaigns", "error");
        } finally {
            setIsBulkUpdating(false);
        }
    };


    // --- Campaign Action Handlers ---

    const handleCampaignClick = async (campaign: any) => {
        const campaignId = campaign._id?.$oid || campaign._id || campaign.id;

        // Mark as opened (remove from "New" list)
        // Logic: Add user ID to 'campaignOpened' array if not present
        if (userProfile?._id) {
            try {
                // Optimistic update
                setCampaigns(prev => prev.map(c => {
                    const cId = c._id?.$oid || c._id || c.id;
                    if (cId === campaignId) {
                        const currentOpened = c.campaignOpened || [];
                        // Logic: If user is in the list (meaning it's NEW for them), remove them to mark as Read.
                        if (currentOpened.includes(userProfile._id)) {
                            return { ...c, campaignOpened: currentOpened.filter((id: string) => id !== userProfile._id) };
                        }
                    }
                    return c;
                }));
                // Fire API (assuming endpoint exists, or handle purely frontend if backend logic differs)
                // await campaignService.markOpened(campaignId); 
            } catch (e) { console.error("Failed to mark campaign as opened", e); }
        }

        const campWithId = { ...campaign, id: campaignId };
        onNavigateToCampaign(campWithId, 'Intelligence');
    };

    const toggleFavorite = async (campaign: any) => {
        if (!userProfile?._id) return;

        const campaignId = campaign._id?.$oid || campaign._id || campaign.id;
        const currentFavorites = campaign.favouriteUserID || [];
        const isFav = currentFavorites.includes(userProfile._id);

        // Optimistic Update
        const newFavorites = isFav
            ? currentFavorites.filter((id: string) => id !== userProfile._id)
            : [...currentFavorites, userProfile._id];

        setCampaigns(prev => prev.map(c => {
            const cId = c._id?.$oid || c._id || c.id;
            if (cId === campaignId) {
                return { ...c, favouriteUserID: newFavorites };
            }
            return c;
        }));

        try {
            // Check if service supports this, otherwise we might need a generic update
            // await campaignService.toggleFavorite(campaignId, !isFav);
            addToast(isFav ? t("Removed from favorites") : t("Added to favorites"), "success");
        } catch (error) {
            console.error("Favorite toggle failed", error);
            addToast(t("Failed to update favorite"), "error");
            // Revert on fail
            loadCampaigns();
        }
    };

    const handleMenuAction = (campaign: any, action: string) => {
        const campWithId = { ...campaign, id: campaign._id?.$oid || campaign._id || campaign.id };

        if (action === 'INTELLIGENCE') onNavigateToCampaign(campWithId, 'Intelligence');
        else if (action === 'SOURCE_AI' || action === 'ATTACH_PEOPLE') onNavigateToCampaign(campWithId, 'Source AI:ATTACH');
        else if (action === 'ATTACHED_PROFILES') onNavigateToCampaign(campWithId, 'Source AI:PROFILES');
        else if (action === 'INTEGRATIONS') onNavigateToCampaign(campWithId, 'Source AI:INTEGRATIONS');
        else if (action === 'JOB_DESC') onNavigateToCampaign(campWithId, 'Source AI:JD');
        else if (action === 'MATCH_AI') onNavigateToCampaign(campWithId, 'Match AI');
        else if (action === 'ENGAGE_AI' || action === 'ENGAGE_CANDIDATES') onNavigateToCampaign(campWithId, 'Engage AI:TRACKING');
        else if (action === 'ENGAGE_WORKFLOW') onNavigateToCampaign(campWithId, 'Engage AI:BUILDER');
        else if (action === 'ENGAGE_INTERVIEW') onNavigateToCampaign(campWithId, 'Engage AI:ROOM');
    };

    // --- Core Filter Logic ---
    const filteredCampaigns = campaigns.filter(c => {
        const userId = userProfile?._id || userProfile?.id;
        const userClientId = userProfile?.activeClientID; // Use activeClientID (ID) instead of activeClient (Name)

        // 1. Multi-tenant Check (Strict)
        // Ensure accurate comparison whether ObjectId or String
        const cClientId = c.clientID?._id || c.clientID;
        if (cClientId?.toString() !== userClientId?.toString()) {
            return false;
        }

        // 2. Status Check
        const cStatus = c.schemaConfig?.mainSchema?.status ||
            (c.status === 'Archived' ? 'Archived' :
                (c.status === true || c.status === 'Active' ? 'Active' : 'Closed'));
        if (cStatus !== status) return false;

        // 3. Search Query
        const name = c.schemaConfig?.mainSchema?.title || c.title || '';
        const jobID = c.passcode || c.migrationMeta?.jobID || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || jobID.includes(searchQuery);
        if (!matchesSearch) return false;

        // 4. Advanced Filters (ENUMS)
        if (activeFilter === 'All') return true;

        if (activeFilter === 'Created by Me') {
            const owners = c.ownerID || [];
            // Handle both array of objects (populated) or array of strings
            return owners.some((o: any) => (o._id || o).toString() === userId?.toString());
        }

        if (activeFilter === 'Shared with Me') {
            const drivers = [
                ...(c.ownerID || []),
                ...(c.managerID || []),
                ...(c.recruiterID || []),
                ...(c.sharedUserID || [])
            ];
            return drivers.some((u: any) => (u._id || u).toString() === userId?.toString());
        }

        if (activeFilter === 'Favorites') {
            const favs = c.favouriteUserID || [];
            return favs.includes(userId);
        }

        if (activeFilter === 'New') {
            const markedAsNewForUser = c.campaignOpened || [];
            return markedAsNewForUser.includes(userId);
        }

        return true;
    });

    const columns = [
        {
            header: t('Title'),
            accessor: (item: any) => {
                const userId = userProfile?._id || userProfile?.id;
                const isNew = (item.campaignOpened || []).includes(userId);
                const isFav = (item.favouriteUserID || []).includes(userId);

                return (
                    <div className="flex items-center gap-3 group/row">
                        {isNew && (
                            <div className="absolute -left-2 top-1">
                                <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm rotate-[-10deg] animate-pulse">NEW</span>
                            </div>
                        )}
                        <div className="relative inline-block group/title">
                            <button
                                className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-left block max-w-[220px] truncate"
                                onClick={() => handleCampaignClick(item)}
                            >
                                {item.schemaConfig?.mainSchema?.title || item.title || t('Untitled Campaign')}
                            </button>
                            <HoverMenu
                                campaign={item}
                                onAction={(action) => handleMenuAction(item, action)}
                            />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}>
                                <Heart size={14} className={`cursor-pointer transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'}`} />
                            </button>
                            <Network size={14} className="text-slate-400 hover:text-emerald-500 cursor-pointer" />
                        </div>
                    </div>
                )
            }
        },
        {
            header: t('Job ID'),
            accessor: (item: any) => <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{item.passcode || item.migrationMeta?.jobID || '---'}</span>
        },
        {
            header: t('Owner'),
            accessor: (item: any) => {
                let ownerParams = null;
                const firstOwner = item.ownerID?.[0]; // Assuming populated?

                // Logic: If firstOwner is string -> "Unavailable" (because not populated or missing in DB)
                // If object -> check active status. 

                if (!firstOwner) {
                    return <span className="text-xs text-slate-400 italic">Unavailable</span>;
                }

                // Check if it's a full user object
                if (typeof firstOwner === 'object' && firstOwner._id) {
                    // Check Status
                    // Assuming 'isActive' or 'status' field exists on User. 
                    // Common practice: status 'Active' or boolean true
                    const isActive = firstOwner.status === 'Active' || firstOwner.isActive === true || firstOwner.status === true;

                    if (!isActive) {
                        return <span className="text-xs text-red-400 italic">Inactive</span>;
                    }

                    ownerParams = firstOwner.firstName || firstOwner.name || 'User';
                } else {
                    // If it's just an ID string, it means it wasn't populated properly or user missing
                    return <span className="text-xs text-slate-400 italic">Unavailable</span>;
                }

                return (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800" title={ownerParams}>
                            {ownerParams.slice(0, 2).toUpperCase()}
                        </div>
                    </div>
                )
            }
        },
        {
            header: t('Status'),
            accessor: (item: any) => <StatusBadge status={item.schemaConfig?.mainSchema?.status || (item.status === 'Archived' ? 'Archived' : (item.status === true || item.status === 'Active' ? 'Active' : 'Closed'))} />
        },
        {
            header: t('Created'),
            accessor: (item: any) => (
                <span className="text-slate-400 text-xs">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '---'}
                </span>
            )
        }
    ];

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">{t("Loading Campaigns...")}</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-visible">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-center bg-white dark:bg-slate-800 gap-4">
                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 whitespace-nowrap">
                        <Briefcase size={20} className="text-emerald-500" />
                        {t(status)} {t("Campaigns")}
                    </h3>
                    {/* Filter Dropdown moved here for better dominance */}
                    <div className="hidden md:block">
                        <FilterDropdown selected={activeFilter} onChange={handleFilterChange} />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto">
                    <div className="md:hidden w-full">
                        <FilterDropdown selected={activeFilter} onChange={handleFilterChange} />
                    </div>

                    <div className="relative flex-1 xl:w-64">
                        <input
                            type="text"
                            placeholder={t("Search by title or job ID...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:outline-none focus:border-emerald-500 dark:text-slate-200 transition-all shadow-sm"
                        />
                        <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                    </div>

                    <button
                        onClick={loadCampaigns}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title={t("Refresh")}
                    >
                        <RefreshCw size={18} />
                    </button>

                    <button
                        onClick={onCreateCampaign}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="hidden md:inline">{t("Create Campaign")}</span>
                        <span className="md:hidden">{t("Create")}</span>
                    </button>
                </div>
            </div>

            <div className="p-0 overflow-visible min-h-[400px] relative">
                {/* Bulk Action Bar */}
                {selectedItems.length > 0 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700 backdrop-blur-md bg-opacity-95">
                            <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
                                <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                    {selectedItems.length}
                                </span>
                                <span className="text-sm font-bold tracking-tight">Selected</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {status === 'Active' && (
                                    <>
                                        <button
                                            disabled={isBulkUpdating}
                                            onClick={() => handleBulkStatusUpdate('Closed')}
                                            className="text-xs font-bold hover:text-emerald-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <X size={14} /> Close
                                        </button>
                                        <button
                                            disabled={isBulkUpdating}
                                            onClick={() => handleBulkStatusUpdate('Archived')}
                                            className="text-xs font-bold hover:text-emerald-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <Archive size={14} /> Archive
                                        </button>
                                    </>
                                )}
                                {status === 'Closed' && (
                                    <button
                                        disabled={isBulkUpdating}
                                        onClick={() => handleBulkStatusUpdate('Active')}
                                        className="text-xs font-bold hover:text-emerald-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        <RefreshCw size={14} /> Re-open
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedItems([])}
                                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors ml-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <SchemaTable
                    data={filteredCampaigns}
                    columns={columns}
                    title={`${status} ${t("Campaigns")}`}
                    selectable={true}
                    selectedItems={selectedItems}
                    onSelect={setSelectedItems}
                />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10 text-[10px] text-slate-400 flex justify-between">
                <span>{t("Showing")} {filteredCampaigns.length} {t("campaigns")}</span>
                <span className="flex items-center gap-1"><ChevronDown size={10} /> {t("Table Settings")}</span>
            </div>
        </div>
    );
};
