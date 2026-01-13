
export type ChannelType = 'Email' | 'SMS' | 'WhatsApp' | 'Website';

export type CommunicationStatus = 'AVAILABLE' | 'PARTIAL_BLOCKED' | 'ALL_BLOCKED';

export interface Attachment {
    id: string;
    name: string;
    type: 'file' | 'image';
    size: string;
    url?: string;
}

export interface Message {
  id: string;
  content: string; // Full body (HTML or Text)
  snippet?: string; // Short preview
  contentType: 'text' | 'image' | 'file' | 'email_thread';
  senderId: string; // 'user' (current agent) or 'contact' (candidate)
  senderName?: string; // Display name
  senderEmail?: string; // Specific email address used
  recipient?: string; // Sent to
  timestamp: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'read';
  channel?: ChannelType;
  subject?: string; 
  threadCount?: number; // Number of emails in this thread
  isPrivate?: boolean; 
  senderRole?: string;
  attachments?: Attachment[]; // New field
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  company: string;
  tags: string[];
  notes: string;
  lastSeen: string;
  socialProfiles?: {
    linkedin?: string;
    github?: string;
  }
}

export interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  status: 'open' | 'resolved' | 'snoozed';
  assigneeId?: string; 
  assigneeName?: string;
  channel: ChannelType;
  labels: string[]; 
  communicationStatus: CommunicationStatus; 
  blockedChannels?: ChannelType[]; 
}
