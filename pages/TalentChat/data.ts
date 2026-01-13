
import { Conversation } from './types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    contact: {
      id: 'c1',
      name: 'Deanthony Quarterman',
      email: 'deanthony.q@example.com',
      phone: '+1 (555) 012-3456',
      avatar: 'DQ',
      location: 'Atlanta, GA',
      company: 'Amazon Logistics',
      tags: ['High Value', 'Urgent'],
      notes: 'Candidate is looking for a senior role. Prefer communication via SMS.',
      lastSeen: '10 mins ago',
      socialProfiles: { linkedin: 'linkedin.com/in/deanthony' }
    },
    messages: [
      { 
        id: 'm1', 
        content: '<p>Hi Deanthony,</p><p>Thank you for applying to the Senior Software Engineer position at MapRecruit. We were impressed with your experience and would love to schedule an interview.</p><p>Are you available for a call this week?</p><p>Best regards,<br>Alex</p>', 
        snippet: 'Thank you for applying to the Senior Software Engineer position at MapRecruit. We were impressed with your experience...',
        contentType: 'email_thread', 
        senderId: 'user',
        senderName: 'Alex Johnson',
        senderEmail: 'alex.j@maprecruit.ai',
        recipient: 'deanthony.q@example.com',
        timestamp: '2025-05-20T09:42:00', 
        status: 'read', 
        channel: 'Email',
        subject: 'Application Follow-up - Senior Software Engineer',
        threadCount: 3,
        attachments: [
            { id: 'att1', name: 'Design_Mockup.png', type: 'image', size: '2.4 MB', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=150&auto=format&fit=crop' },
            { id: 'att2', name: 'Job_Description.pdf', type: 'file', size: '1.2 MB' }
        ]
      },
      { 
        id: 'm2', 
        content: 'Thanks Alex! Yes, I\'m available Thursday or Friday afternoon.', 
        contentType: 'text', 
        senderId: 'contact', 
        timestamp: '2025-05-20T09:45:00', 
        status: 'read', 
        channel: 'SMS' 
      },
      { 
        id: 'n1', 
        content: '@Sarah please check his certifications before the call.', 
        contentType: 'text', 
        senderId: 'user', 
        senderName: 'Mike Ross', 
        senderRole: 'Hiring Manager', 
        timestamp: '2025-05-20T09:45:30', 
        status: 'read', 
        isPrivate: true 
      },
      { 
        id: 'm3', 
        content: 'Hi Alex,\n\nI\'m particularly interested in the full-stack development aspects of the role. Could you share more about the tech stack?\n\nAlso, do you have flexible hours or is it strictly 9-5?', 
        snippet: 'I\'m particularly interested in the full-stack development aspects of the role. Could you share more about the tech stack?',
        contentType: 'email_thread', 
        senderId: 'contact', 
        senderName: 'Deanthony Quarterman',
        senderEmail: 'deanthony.q@example.com',
        recipient: 'alex.j@maprecruit.ai',
        timestamp: '2025-05-20T10:15:00', 
        status: 'delivered', 
        channel: 'Email',
        subject: 'Re: Application Follow-up - Senior Software Engineer',
        threadCount: 1
      },
    ],
    unreadCount: 0,
    lastMessage: 'Also, do you have flexible hours or is it strictly 9-5?',
    lastMessageAt: '10m',
    status: 'open',
    channel: 'Email',
    labels: ['Priority', 'Negotiation'],
    assigneeId: 'usr_123',
    assigneeName: 'Pratik Gaurav',
    communicationStatus: 'AVAILABLE'
  },
  {
    id: '2',
    contact: {
      id: 'c2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 987-6543',
      avatar: 'SJ',
      location: 'San Francisco, CA',
      company: 'TechFlow Inc.',
      tags: ['Python', 'Remote'],
      notes: '',
      lastSeen: '2 hours ago'
    },
    messages: [
        { id: 'm4', content: 'Here is my updated resume as requested.', contentType: 'text', senderId: 'contact', timestamp: '2025-05-19T14:30:00', status: 'read', channel: 'WhatsApp' },
        { id: 'm5', content: 'Received, thanks Sarah!', contentType: 'text', senderId: 'user', timestamp: '2025-05-19T14:35:00', status: 'delivered', channel: 'WhatsApp' }
    ],
    unreadCount: 0,
    lastMessage: 'Received, thanks Sarah!',
    lastMessageAt: '2h',
    status: 'open',
    channel: 'WhatsApp',
    labels: ['Python'],
    assigneeId: undefined,
    communicationStatus: 'PARTIAL_BLOCKED',
    blockedChannels: ['SMS'] 
  },
  {
    id: '3',
    contact: {
      id: 'c3',
      name: 'Marcus Johnson',
      email: 'marcus.j@example.com',
      phone: '+1 (404) 555-0199',
      avatar: 'MJ',
      location: 'Marietta, GA',
      company: 'Pending',
      tags: ['Forklift'],
      notes: 'Needs certification renewal.',
      lastSeen: '1 day ago'
    },
    messages: [
        { id: 'm6', content: 'Is the position still open?', contentType: 'text', senderId: 'contact', timestamp: '2025-05-18T10:00:00', status: 'read', channel: 'SMS' }
    ],
    unreadCount: 1,
    lastMessage: 'Is the position still open?',
    lastMessageAt: '1d',
    status: 'open',
    channel: 'SMS',
    labels: [],
    assigneeId: 'usr_101',
    assigneeName: 'Sarah Jenkins',
    communicationStatus: 'ALL_BLOCKED' 
  }
];
