
import React, { useState, useRef, useEffect } from 'react';
import { 
    Search, Filter, Mail, MessageSquare, Phone, Globe, 
    ChevronDown, CheckCircle, Clock, UserPlus, XCircle, 
    AlertTriangle, Check, AlertCircle, ChevronUp, ChevronRight
} from '../../../components/Icons';
import { Conversation } from '../types';
import { useUserProfile } from '../../../hooks/useUserProfile';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

// Mock Sender Identities (Usually from MyAccount/Communication)
const SENDER_IDENTITIES = {
    EMAIL: [
        { id: 'e_all', label: 'All Emails', value: 'all', isDefault: false },
        { id: 'e1', label: 'pratik.gaurav@trcdemo.com', value: 'pratik.gaurav@trcdemo.com', isDefault: true },
        { id: 'e2', label: 'careers@maprecruit.ai', value: 'careers@maprecruit.ai', isDefault: false },
    ],
    SMS: [
        { id: 's_all', label: 'All Numbers', value: 'all', isDefault: false },
        { id: 's1', label: '+1 (555) 012-3456', value: '+15550123456', isDefault: true },
        { id: 's2', label: '+1 (404) 555-0199', value: '+14045550199', isDefault: false },
    ]
};

export const ConversationSidebar = ({ 
    conversations, 
    activeId, 
    onSelect, 
    filterStatus, 
    setFilterStatus 
}: ConversationSidebarProps) => {
    const { userProfile } = useUserProfile();
    const [search, setSearch] = useState('');
    
    // Sender Filter State
    const [isSenderDropdownOpen, setIsSenderDropdownOpen] = useState(false);
    const [selectedSender, setSelectedSender] = useState<{type: 'Email' | 'SMS', label: string}>({ type: 'Email', label: 'All Emails' });
    const senderDropdownRef = useRef<HTMLDivElement>(null);

    // Accordion State for Dropdown
    const [expandedAccordion, setExpandedAccordion] = useState<'Email' | 'SMS' | null>('Email');

    const filteredConversations = conversations.filter(c => 
        (filterStatus === 'all' || c.status === filterStatus) &&
        (c.contact.name.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase()))
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (senderDropdownRef.current && !senderDropdownRef.current.contains(event.target as Node)) {
                setIsSenderDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getChannelIcon = (channel: string) => {
        switch(channel) {
            case 'Email': return <Mail size={12} />;
            case 'SMS': return <MessageSquare size={12} />;
            case 'WhatsApp': return <Phone size={12} />;
            default: return <Globe size={12} />;
        }
    };

    // Render Status Icon based on Communication Status
    const renderStatusIcon = (conv: Conversation) => {
        if (conv.communicationStatus === 'ALL_BLOCKED') {
            return (
                <div className="text-red-500" title="All communication blocked">
                    <AlertTriangle size={16} fill="currentColor" className="text-red-100" strokeWidth={1.5} />
                </div>
            ); // Red Alert
        }
        if (conv.communicationStatus === 'PARTIAL_BLOCKED') {
            return (
                <div className="text-amber-500" title={`Blocked: ${conv.blockedChannels?.join(', ')}`}>
                    <AlertCircle size={16} fill="currentColor" className="text-amber-100" strokeWidth={1.5} />
                </div>
            ); // Yellow Alert
        }
        return (
            <div className="text-emerald-500" title="Available">
                <CheckCircle size={16} fill="currentColor" className="text-emerald-100" strokeWidth={1.5} />
            </div>
        ); // Green Tick
    };

    const handleAssignClick = (e: React.MouseEvent, conv: Conversation) => {
        e.stopPropagation();
        // Toggle assignment logic would go here (parent would handle actual state update)
        // For UI feedback only right now:
        console.log(`Assign clicked for ${conv.id}`);
    };

    const handleCloseClick = (e: React.MouseEvent, conv: Conversation) => {
        e.stopPropagation();
        // Logic to close/resolve conversation
        console.log(`Close clicked for ${conv.id}`);
    };

    return (
        <div className="w-full md:w-80 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-full">
            {/* Header / Filter */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Conversations</h2>
                    {/* View Filters (Open/Resolved) */}
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                        <button 
                            onClick={() => setFilterStatus('open')}
                            className={`p-1.5 rounded text-xs font-bold transition-colors ${filterStatus === 'open' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                            title="Open"
                        >
                           <Clock size={14} />
                        </button>
                        <button 
                            onClick={() => setFilterStatus('resolved')}
                            className={`p-1.5 rounded text-xs font-bold transition-colors ${filterStatus === 'resolved' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                            title="Resolved"
                        >
                           <CheckCircle size={14} />
                        </button>
                    </div>
                </div>

                {/* Sender Dropdown & Search Bar Row */}
                <div className="flex gap-2 relative z-20">
                    
                    {/* Sender Dropdown Trigger */}
                    <div className="relative" ref={senderDropdownRef}>
                        <button 
                            onClick={() => setIsSenderDropdownOpen(!isSenderDropdownOpen)}
                            className="h-full px-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Filter by Sender"
                        >
                            {selectedSender.type === 'Email' ? <Mail size={16} /> : <MessageSquare size={16} />}
                            <ChevronDown size={12} className="ml-1" />
                        </button>

                        {/* Sender Dropdown Content */}
                        {isSenderDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                {/* Email Accordion */}
                                <div>
                                    <button 
                                        onClick={() => setExpandedAccordion(expandedAccordion === 'Email' ? null : 'Email')}
                                        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200"
                                    >
                                        <div className="flex items-center gap-2"><Mail size={14} className="text-blue-500"/> Email</div>
                                        {expandedAccordion === 'Email' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                    
                                    {expandedAccordion === 'Email' && (
                                        <div className="bg-white dark:bg-slate-800">
                                            {SENDER_IDENTITIES.EMAIL.map(item => (
                                                <button 
                                                    key={item.id}
                                                    onClick={() => {
                                                        setSelectedSender({ type: 'Email', label: item.label });
                                                        setIsSenderDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs border-l-4 transition-colors flex items-center justify-between ${selectedSender.label === item.label ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                                >
                                                    <span className="truncate flex-1">{item.label}</span>
                                                    {item.isDefault && <span className="text-[9px] bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 ml-2">Default</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* SMS Accordion */}
                                <div>
                                    <button 
                                        onClick={() => setExpandedAccordion(expandedAccordion === 'SMS' ? null : 'SMS')}
                                        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200"
                                    >
                                        <div className="flex items-center gap-2"><MessageSquare size={14} className="text-green-500"/> SMS</div>
                                        {expandedAccordion === 'SMS' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                    
                                    {expandedAccordion === 'SMS' && (
                                        <div className="bg-white dark:bg-slate-800">
                                            {SENDER_IDENTITIES.SMS.map(item => (
                                                <button 
                                                    key={item.id}
                                                    onClick={() => {
                                                        setSelectedSender({ type: 'SMS', label: item.label });
                                                        setIsSenderDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs border-l-4 transition-colors flex items-center justify-between ${selectedSender.label === item.label ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                                >
                                                    <span className="truncate flex-1">{item.label}</span>
                                                    {item.isDefault && <span className="text-[9px] bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 ml-2">Default</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search people..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredConversations.map(conv => (
                    <div 
                        key={conv.id} 
                        onClick={() => onSelect(conv.id)}
                        className={`p-3 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative ${activeId === conv.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                                    {conv.contact.avatar}
                                </div>
                                <div className="min-w-0">
                                    <span className={`font-bold text-sm block truncate ${activeId === conv.id ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {conv.contact.name}
                                    </span>
                                    <p className={`text-[11px] truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[9px] text-slate-400 whitespace-nowrap">{conv.lastMessageAt}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2 pl-11">
                            <div className="flex items-center gap-2">
                                {/* Channel Indicator */}
                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                    {getChannelIcon(conv.channel)}
                                </span>
                                
                                {/* Unread Badge */}
                                {conv.unreadCount > 0 && (
                                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 rounded-full min-w-[1.25rem] text-center">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>

                            {/* Actions & Status */}
                            <div className="flex items-center gap-2">
                                {/* Assign User Icon */}
                                <button 
                                    onClick={(e) => handleAssignClick(e, conv)}
                                    className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${conv.assigneeId ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'}`}
                                    title={conv.assigneeId ? `Assigned to ${conv.assigneeName}` : "Assign to me"}
                                >
                                    <UserPlus size={14} />
                                </button>

                                {/* Close Icon */}
                                <button 
                                    onClick={(e) => handleCloseClick(e, conv)}
                                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    title="Close Conversation"
                                >
                                    <XCircle size={14} />
                                </button>

                                {/* Status Indicator (Red/Yellow/Green) */}
                                {renderStatusIcon(conv)}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredConversations.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No conversations found.
                    </div>
                )}
            </div>
        </div>
    );
};
