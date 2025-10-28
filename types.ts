
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  reactions?: { [emoji: string]: string[] };
}

export interface Contact extends User {
  lastMessage: string;
  lastMessageTime: string;
  isAi?: boolean;
}

export interface Conversation {
  contactId: string;
  messages: Message[];
}