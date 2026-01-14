
import React, { useState, useEffect } from 'react';
import { ConversationSidebar } from './components/ConversationSidebar';
import { ChatArea } from './components/ChatArea';
import { ContactPanel } from './components/ContactPanel';
import { MOCK_CONVERSATIONS } from './data';
import { useScreenSize } from '../../hooks/useScreenSize';
import { MessageSquare, Key, Calendar, BarChart2 } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';
import { ChatAnalytics } from './components/ChatAnalytics';
import { KeywordsWrapper } from './Keywords/index'; // Explicit index import
import { useUserProfile } from '../../hooks/useUserProfile';
import { useToast } from '../../components/Toast';
import { ChannelType } from './types';
import { Routes, Route, Navigate } from 'react-router-dom';

// Mock Business Settings (Usually fetched from MyAccount)
const MOCK_SETTINGS = {
    autoReplyEnabled: true,
    autoReplyText: "Hi! Thanks for your message. We are currently offline but will get back to you during business hours.",
    businessHours: {
        start: 9, // 9 AM
        end: 17 // 5 PM
    }
};

const ConversationsView = () => {
    const { isDesktop } = useScreenSize();
    const { userProfile } = useUserProfile();

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [filterStatus, setFilterStatus] = useState('open');

    const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const handleSelectConversation = (id: string) => {
        setActiveConversationId(id);
        setConversations(prev => prev.map(c =>
            c.id === id ? { ...c, unreadCount: 0 } : c
        ));
    };

    const handleSendMessage = (text: string, isPrivate: boolean, channel: ChannelType, subject?: string) => {
        if (!activeConversationId) return;

        const newMessage = {
            id: `m${Date.now()}`,
            content: text,
            contentType: 'text' as const,
            senderId: 'user',
            senderName: `${userProfile.firstName} ${userProfile.lastName}`,
            senderRole: userProfile.role,
            timestamp: new Date().toISOString(),
            status: 'sent' as const,
            channel: channel || activeConversation?.channel,
            subject: subject,
            isPrivate: isPrivate
        };

        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: isPrivate ? c.lastMessage : text,
                    lastMessageAt: 'Just now'
                };
            }
            return c;
        }));
    };

    const handleAssign = (assigneeId: string | undefined, name: string | undefined) => {
        if (!activeConversationId) return;
        setConversations(prev => prev.map(c =>
            c.id === activeConversationId ? { ...c, assigneeId, assigneeName: name } : c
        ));
    };

    const handleUpdateLabels = (labels: string[]) => {
        if (!activeConversationId) return;
        setConversations(prev => prev.map(c =>
            c.id === activeConversationId ? { ...c, labels } : c
        ));
    };

    return (
        <div className="flex h-full overflow-hidden bg-white dark:bg-slate-900">

            {/* Left Sidebar - List */}
            <div className={`${(!isDesktop && activeConversationId) ? 'hidden' : 'w-full md:w-80 flex-shrink-0'}`}>
                <ConversationSidebar
                    conversations={conversations}
                    activeId={activeConversationId}
                    onSelect={handleSelectConversation}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                />
            </div>

            {/* Center - Chat Area */}
            <div className={`flex-1 flex flex-col min-w-0 ${(!isDesktop && !activeConversationId) ? 'hidden' : 'flex'}`}>
                {activeConversation ? (
                    <ChatArea
                        conversation={activeConversation}
                        onSendMessage={handleSendMessage}
                        onBack={() => setActiveConversationId(null)}
                        onToggleDetails={() => setIsContactPanelOpen(!isContactPanelOpen)}
                        onAssign={handleAssign}
                        onUpdateLabels={handleUpdateLabels}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 text-slate-400">
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Select a conversation</h3>
                        <p className="text-sm">Choose from the list to start chatting</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Contact Details */}
            {activeConversation && isContactPanelOpen && (
                <div className={`${!isDesktop ? 'absolute inset-0 z-30' : ''}`}>
                    <ContactPanel
                        contact={activeConversation.contact}
                        isOpen={isContactPanelOpen}
                        onClose={() => setIsContactPanelOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export const TalentChat = () => {
    const getPath = (id: string) => {
        const map: Record<string, string> = {
            'CONVERSATIONS': 'Conversations',
            'KEYWORDS': 'Keywords',
            'SCHEDULES': 'Schedules',
            'ANALYTICS': 'Analytics',
        };
        return map[id] || id;
    };

    return (
        <Routes>
            <Route path="/" element={<Navigate to={getPath('CONVERSATIONS')} replace />} />
            <Route path={getPath('CONVERSATIONS')} element={<ConversationsView />} />
            <Route path={getPath('KEYWORDS')} element={<KeywordsWrapper />} />
            <Route path={getPath('SCHEDULES')} element={<PlaceholderPage title="Chat Schedules" description="Manage availability schedules for automated chat responses." icon={Calendar} />} />
            <Route path={getPath('ANALYTICS')} element={<ChatAnalytics />} />
            <Route path="*" element={<Navigate to={getPath('CONVERSATIONS')} replace />} />
        </Routes>
    );
};
