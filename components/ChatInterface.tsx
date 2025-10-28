import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import ContactList from './ContactList';
import ChatView from './ChatView';
import GlassCard from './GlassCard';
import ProfileModal from './ProfileModal';
import type { Contact, Conversation, Message, User } from '../types';
import { CONTACTS, INITIAL_CONVERSATIONS } from '../constants';
import { createAiChatSession, sendMessageToAi } from '../services/geminiService';
import { MenuIcon, XIcon } from './Icons';

interface ChatInterfaceProps {
  username: string;
  onLogout: () => void;
  onBackgroundChange: (url: string) => void;
  currentBackground: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ username, onLogout, onBackgroundChange, currentBackground }) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedContactId, setSelectedContactId] = useState<string>(CONTACTS[0].id);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const aiChatSession = useRef<Chat | null>(null);
  const currentUser = useRef<User>({ id: 'user', name: username, avatar: `https://i.pravatar.cc/150?u=${username}` });

  useEffect(() => {
    aiChatSession.current = createAiChatSession();
  }, []);

  const selectedConversation = conversations.find(c => c.contactId === selectedContactId);
  const selectedContact = CONTACTS.find(c => c.id === selectedContactId);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };
  
  const handleSendMessage = useCallback(async (text: string) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      timestamp: Date.now(),
      senderId: currentUser.current.id,
    };

    const updatedConversations = conversations.map(convo => {
      if (convo.contactId === selectedContactId) {
        return { ...convo, messages: [...convo.messages, newMessage] };
      }
      return convo;
    });
    setConversations(updatedConversations);
    
    // AI response logic
    if (selectedContact.isAi && aiChatSession.current) {
        setIsAiTyping(true);
        const aiResponseText = await sendMessageToAi(aiChatSession.current, text);
        setIsAiTyping(false);

        const aiMessage: Message = {
            id: `ai-msg-${Date.now()}`,
            text: aiResponseText,
            timestamp: Date.now(),
            senderId: selectedContact.id,
        };

        setConversations(prev => prev.map(convo => {
            if (convo.contactId === selectedContactId) {
                return { ...convo, messages: [...convo.messages, aiMessage] };
            }
            return convo;
        }));
    } else {
        // Mock response for regular contacts
        setTimeout(() => {
             const mockMessage: Message = {
                id: `mock-msg-${Date.now()}`,
                text: `This is a simulated response to: "${text}"`,
                timestamp: Date.now(),
                senderId: selectedContact.id,
            };
            setConversations(prev => prev.map(convo => {
                if (convo.contactId === selectedContactId) {
                    return { ...convo, messages: [...convo.messages, mockMessage] };
                }
                return convo;
            }));
        }, 1000);
    }
  }, [conversations, selectedContact, selectedContactId]);

  const handleReact = (messageId: string, emoji: string) => {
    if (!selectedContactId) return;

    setConversations(prevConvos =>
      prevConvos.map(convo => {
        if (convo.contactId !== selectedContactId) {
          return convo;
        }

        const newMessages = convo.messages.map(msg => {
          if (msg.id !== messageId) {
            return msg;
          }

          const newReactions = { ...(msg.reactions || {}) };
          const currentUserId = currentUser.current.id;
          const userPreviousReaction = Object.keys(newReactions).find(key => newReactions[key].includes(currentUserId));

          // If user has a previous reaction, remove it
          if (userPreviousReaction) {
            newReactions[userPreviousReaction] = newReactions[userPreviousReaction].filter(id => id !== currentUserId);
            if (newReactions[userPreviousReaction].length === 0) {
              delete newReactions[userPreviousReaction];
            }
          }

          // If user is not un-reacting the same emoji, add the new reaction
          if (userPreviousReaction !== emoji) {
              newReactions[emoji] = [...(newReactions[emoji] || []), currentUserId];
          }

          return { ...msg, reactions: newReactions };
        });

        return { ...convo, messages: newMessages };
      })
    );
  };

  const handleClearChat = (contactId: string) => {
    setConversations(prev => prev.map(convo => {
        if (convo.contactId === contactId) {
            // For the AI, we keep the initial greeting message
            const initialMessages = contactId === 'ai-assistant' 
                ? INITIAL_CONVERSATIONS.find(c => c.contactId === 'ai-assistant')?.messages || []
                : [];
            return { ...convo, messages: initialMessages };
        }
        return convo;
    }));
  };

  return (
    <>
    <GlassCard className="w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-7xl flex overflow-hidden animate-fade-in">
        <div className={`absolute md:static top-0 left-0 h-full z-20 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <ContactList
                contacts={CONTACTS}
                onSelectContact={handleSelectContact}
                selectedContactId={selectedContactId}
                currentUser={currentUser.current}
                onLogout={onLogout}
                onProfileClick={() => setIsProfileModalOpen(true)}
            />
        </div>
        <div className="flex-1 flex flex-col h-full relative">
             <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
                {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
            {selectedContact && selectedConversation ? (
                <ChatView
                    contact={selectedContact}
                    conversation={selectedConversation}
                    onSendMessage={handleSendMessage}
                    currentUser={currentUser.current}
                    isAiTyping={isAiTyping && selectedContact.isAi}
                    onClearChat={handleClearChat}
                    onReact={handleReact}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-white/70">
                    Select a contact to start chatting.
                </div>
            )}
        </div>
    </GlassCard>
    {isProfileModalOpen && (
        <ProfileModal 
            user={currentUser.current} 
            onClose={() => setIsProfileModalOpen(false)}
            onBackgroundChange={onBackgroundChange}
            currentBackground={currentBackground}
        />
    )}
    </>
  );
};

export default ChatInterface;