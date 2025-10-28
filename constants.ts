import type { Contact, Conversation } from './types';

export const CONTACTS: Contact[] = [
  {
    id: 'ai-assistant',
    name: 'Gemini Assistant',
    avatar: 'https://i.pravatar.cc/150?u=ai',
    lastMessage: 'Ask me anything!',
    lastMessageTime: 'Online',
    isAi: true,
  },
  {
    id: '2',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    lastMessage: 'Sounds good! See you then.',
    lastMessageTime: '11:42 AM',
  },
  {
    id: '3',
    name: 'Bob Williams',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    lastMessage: 'Can you send over the file?',
    lastMessageTime: '10:58 AM',
  },
  {
    id: '4',
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    lastMessage: 'Haha, that\'s hilarious!',
    lastMessageTime: 'Yesterday',
  },
  {
    id: '5',
    name: 'Diana Prince',
    avatar: 'https://i.pravatar.cc/150?u=diana',
    lastMessage: 'I\'ll look into it.',
    lastMessageTime: 'Yesterday',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        contactId: 'ai-assistant',
        messages: [
            { id: 'ai-msg-1', text: 'Hello! I am your AI Assistant powered by Gemini. How can I help you today?', timestamp: Date.now(), senderId: 'ai-assistant' },
        ],
    },
    {
        contactId: '2',
        messages: [
            { id: 'alice-msg-1', text: 'Hey, are we still on for lunch tomorrow?', timestamp: Date.now() - 100000, senderId: '2' },
            { id: 'user-msg-1', text: 'Yes, absolutely! The usual spot at 1 PM?', timestamp: Date.now() - 90000, senderId: 'user' },
            { id: 'alice-msg-2', text: 'Sounds good! See you then.', timestamp: Date.now() - 80000, senderId: '2' },
        ],
    },
    {
        contactId: '3',
        messages: [
            { id: 'bob-msg-1', text: 'Can you send over the file?', timestamp: Date.now() - 200000, senderId: '3' },
        ],
    }
];

export const PREDEFINED_BACKGROUNDS: { id: string; url: string; }[] = [
  { id: 'aurora', url: 'https://picsum.photos/seed/aurora/1920/1080' },
  { id: 'mountains', url: 'https://picsum.photos/seed/mountains/1920/1080' },
  { id: 'galaxy', url: 'https://picsum.photos/seed/galaxy/1920/1080' },
  { id: 'forest', url: 'https://picsum.photos/seed/forest/1920/1080' },
  { id: 'beach', url: 'https://picsum.photos/seed/beach/1920/1080' },
  { id: 'abstract', url: 'https://picsum.photos/seed/abstract/1920/1080' },
];