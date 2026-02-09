
import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Filter, MoreHorizontal, User, Clock, MapPin, MessageSquare, Sparkles } from '../../../components/Icons';
import { MOCK_PROFILES } from '../../../data';
import { TalentAssistantSidePanel } from './TalentAssistantSidePanel';

interface GenericProfileListProps {
    title: string;
    icon: React.ElementType;
}

export const GenericProfileList: React.FC<GenericProfileListProps> = ({ title, icon: Icon }) => {
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [searchQuery, setSearchQuery] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Filter profiles mock logic
    const filteredProfiles = MOCK_PROFILES.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 p-6 lg:p-8 overflow-hidden transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                            <Icon size={24} className="text-emerald-600 dark:text-emerald-400" />
                            {title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            View profiles added or modified within the selected date range.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isChatOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline">Talent Assistant</span>
                        </button>

                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Calendar size={16} className="text-slate-400 ml-2" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 font-medium focus:outline-none cursor-pointer py-1"
                            >
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Custom Range</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">

                    {/* Toolbar */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="relative w-full sm:w-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search profiles..."
                                className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 w-full sm:w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Filter size={14} /> Filter
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3">Candidate</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Date Added</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredProfiles.map((profile) => (
                                    <tr
                                        key={profile.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                    {profile.avatar || <User size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">{profile.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{profile.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{profile.title}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <MapPin size={12} /> {profile.location}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} /> 2 days ago
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${profile.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                                                {profile.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProfiles.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No profiles found for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Talent Assistant Sidebar */}
            <TalentAssistantSidePanel
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                initialMessage={`I can help you analyze these ${title.toLowerCase()}. Try asking for specific skills or experience.`}
            />
        </div>
    );
};
