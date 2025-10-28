import React, { useState, useRef, useEffect } from 'react';
import type { Contact, Conversation, User } from '../types';
import MessageBubble from './MessageBubble';
import { SendIcon, EllipsisVerticalIcon, TrashIcon } from './Icons';

interface ChatViewProps {
  contact: Contact;
  conversation: Conversation;
  onSendMessage: (text: string) => void;
  currentUser: User;
  isAiTyping?: boolean;
  onClearChat: (contactId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ contact, conversation, onSendMessage, currentUser, isAiTyping, onClearChat, onReact }) => {
  const [message, setMessage] = useState('');
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation.messages, isAiTyping]);
  
  useEffect(() => {
    // Close chat menu if contact changes
    setIsChatMenuOpen(false);
  }, [contact]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/10 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center">
            <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-4" />
            <div>
            <h3 className="text-white font-semibold">{contact.name}</h3>
            <p className="text-green-400 text-sm">Online</p>
            </div>
        </div>
        <div className="relative">
            <button onClick={() => setIsChatMenuOpen(!isChatMenuOpen)} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
                <EllipsisVerticalIcon className="w-6 h-6" />
            </button>
            {isChatMenuOpen && (
                 <div 
                    className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg z-10 animate-fade-in-down origin-top-right"
                    onMouseLeave={() => setIsChatMenuOpen(false)}
                >
                    <ul className="py-1 text-white">
                        <li>
                            <button onClick={() => { onClearChat(contact.id); setIsChatMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-white/10 text-red-400">
                                <TrashIcon className="w-5 h-5 mr-3" /> Clear Chat
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {conversation.messages.length > 0 ? (
            conversation.messages.map((msg) => (
                <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    isOwnMessage={msg.senderId === currentUser.id} 
                    onReact={(emoji) => onReact(msg.id, emoji)}
                />
            ))
        ) : (
            <div className="text-center text-white/50 text-sm">
                No messages yet. Start the conversation!
            </div>
        )}
        {isAiTyping && (
             <MessageBubble message={{id: 'typing', text: '...', senderId: contact.id, timestamp: Date.now()}} isOwnMessage={false} isTyping={true} onReact={() => {}} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/10 backdrop-blur-sm border-t border-white/10 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 border-none rounded-full py-3 px-5 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:outline-none transition duration-300"
          />
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 transition-transform duration-200 transform hover:scale-110 disabled:bg-gray-500 disabled:scale-100" disabled={!message.trim()}>
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;