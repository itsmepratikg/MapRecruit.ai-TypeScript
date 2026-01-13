
import React, { useState, useEffect } from 'react';
import { ConversationSidebar } from './components/ConversationSidebar';
import { ChatArea } from './components/ChatArea';
import { ContactPanel } from './components/ContactPanel';
import { MOCK_CONVERSATIONS } from './data';
import { useScreenSize } from '../../hooks/useScreenSize';
import { MessageSquare, Key, Calendar, BarChart2 } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useToast } from '../../components/Toast';
import { ChannelType } from './types';

interface TalentChatProps {
    activeTab?: string;
}

// Mock Business Settings (Usually fetched from MyAccount)
const MOCK_SETTINGS = {
    autoReplyEnabled: true,
    autoReplyText: "Hi! Thanks for your message. We are currently offline but will get back to you during business hours.",
    businessHours: {
        start: 9, // 9 AM
        end: 17 // 5 PM
    }
};

export const TalentChat = ({ activeTab = 'CONVERSATIONS' }: TalentChatProps) => {
  const { isDesktop } = useScreenSize();
  const { userProfile } = useUserProfile();
  const { addToast } = useToast();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [filterStatus, setFilterStatus] = useState('open'); 
  
  // Changed default to false to keep interface clean
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setConversations(prev => prev.map(c => 
        c.id === id ? { ...c, unreadCount: 0 } : c
    ));
    // Note: We do NOT automatically open the contact panel here, keeping the view focused on chat
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
          channel: channel || activeConversation?.channel, // Use selected channel or default to conversation
          subject: subject,
          isPrivate: isPrivate
      };

      setConversations(prev => prev.map(c => {
          if (c.id === activeConversationId) {
              return {
                  ...c,
                  messages: [...c.messages, newMessage],
                  lastMessage: isPrivate ? c.lastMessage : text, // Don't update snippet if private note
                  lastMessageAt: 'Just now'
              };
          }
          return c;
      }));
  };

  // Logic to simulate incoming message and check for auto-reply
  // For demo, we just verify the logic if a "Simulate Incoming" existed, 
  // but here we ensure the plumbing is ready.
  // In a real app, this runs on the backend or via socket listener.
  const checkAutoReply = (convId: string) => {
      const conv = conversations.find(c => c.id === convId);
      if (!conv) return;

      // Check 1: Auto Reply Enabled
      if (!MOCK_SETTINGS.autoReplyEnabled) return;

      // Check 2: Assignment (Must be assigned to send specific reply? Or general?)
      // Prompt said: "The Candidate should also be assigned to the recruiter to send a auto-reply"
      // Assuming this means ONLY assigned candidates get the personalized/specific auto-reply logic
      if (!conv.assigneeId) return; 

      // Check 3: Business Hours
      const now = new Date();
      const hour = now.getHours();
      const isWorkingHours = hour >= MOCK_SETTINGS.businessHours.start && hour < MOCK_SETTINGS.businessHours.end;

      if (!isWorkingHours) {
          // Send Auto-Reply
          setTimeout(() => {
            const autoReplyMsg = {
                id: `ar_${Date.now()}`,
                content: `[Auto-Reply]: ${MOCK_SETTINGS.autoReplyText}`,
                contentType: 'text' as const,
                senderId: 'system',
                timestamp: new Date().toISOString(),
                status: 'delivered' as const,
                channel: conv.channel
            };
            setConversations(prev => prev.map(c => 
                c.id === convId ? { ...c, messages: [...c.messages, autoReplyMsg] } : c
            ));
          }, 1000);
      }
  };
  
  // Handler for assignment
  const handleAssign = (assigneeId: string | undefined, name: string | undefined) => {
      if (!activeConversationId) return;
      setConversations(prev => prev.map(c => 
          c.id === activeConversationId ? { ...c, assigneeId, assigneeName: name } : c
      ));
  };

  // Handler for labels
  const handleUpdateLabels = (labels: string[]) => {
      if (!activeConversationId) return;
      setConversations(prev => prev.map(c => 
        c.id === activeConversationId ? { ...c, labels } : c
      ));
  };

  if (activeTab === 'KEYWORDS') {
      return <PlaceholderPage title="Keyword Management" description="Configure auto-replies based on specific keywords detection." icon={Key} />;
  }

  if (activeTab === 'SCHEDULES') {
      return <PlaceholderPage title="Chat Schedules" description="Manage availability schedules for automated chat responses." icon={Calendar} />;
  }

  if (activeTab === 'ANALYTICS') {
      return <PlaceholderPage title="Chat Analytics" description="View performance metrics and conversation trends." icon={BarChart2} />;
  }

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-slate-900">
        
        {/* Left Sidebar - List */}
        <div className={`${(!isDesktop && activeConversationId) ? 'hidden' : 'w-full md:w-auto flex-shrink-0'}`}>
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
