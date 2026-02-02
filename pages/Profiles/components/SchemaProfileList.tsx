import React, { useState, useEffect } from 'react';
import { profileService } from '../../../services/api';
import SchemaTable from '../../../components/Schema/SchemaTable';
import { useToast } from '../../../components/Toast';
import { Search } from '../../../components/Icons';

export const SchemaProfileList = ({ filterType, onNavigateToProfile }: any) => {
    const { addToast } = useToast();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            const data = await profileService.getAll();
            setProfiles(data.profiles || []);
        } catch (error) {
            console.error(error);
            addToast("Failed to load profiles", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredProfiles = profiles.filter(p => {
        // Implement complex logic if needed based on 'filterType' (e.g. 'Favorites', 'Shared')
        // For MVP, simplistic filtering
        const name = p.profile?.fullName || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const columns = [
        {
            header: 'Name',
            accessor: (item: any) => (
                <div
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    onClick={() => onNavigateToProfile(item)}
                >
                    {item.profile?.fullName || 'Unknown Candidate'}
                </div>
            )
        },
        {
            header: 'Email',
            accessor: (item: any) => item.profile?.emails?.[0]?.email || '-'
        },
        {
            header: 'Job Title',
            accessor: (item: any) => item.professionalSummary?.currentRole?.jobTitle || '-'
        },
        {
            header: 'Experience',
            accessor: (item: any) => `${item.professionalSummary?.totalExperience || 0} Yrs`
        }
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Profiles...</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{filterType || 'All'} Profiles (Schema)</h3>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:outline-none focus:border-emerald-500 dark:text-slate-200"
                        />
                        <Search size={14} className="absolute left-2.5 top-3 text-slate-400" />
                    </div>
                    <button onClick={loadProfiles} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-emerald-600">
                        Refresh
                    </button>
                </div>
            </div>

            <div className="p-0">
                <SchemaTable
                    data={filteredProfiles}
                    columns={columns}
                    title={`${filterType} Profiles`}
                />
            </div>
        </div>
    );
};
