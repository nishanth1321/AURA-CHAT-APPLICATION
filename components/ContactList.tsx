import React, { useState } from 'react';
import type { Contact, User } from '../types';
import { SearchIcon, EllipsisVerticalIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from './Icons';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contactId: string) => void;
  selectedContactId: string | null;
  currentUser: User;
  onLogout: () => void;
  onProfileClick: () => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onSelectContact, selectedContactId, currentUser, onLogout, onProfileClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/5 backdrop-blur-lg h-full w-72 md:w-80 flex flex-col border-r border-white/10">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
         <div className="flex items-center">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
                <h2 className="text-white font-semibold text-lg">{currentUser.name}</h2>
                <p className="text-green-400 text-sm">Online</p>
            </div>
         </div>
         <div className="relative">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
                <EllipsisVerticalIcon className="w-6 h-6" />
            </button>
            {isSettingsOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg z-10 animate-fade-in-down origin-top-right"
                    onMouseLeave={() => setIsSettingsOpen(false)}
                >
                    <ul className="py-1 text-white">
                        <li>
                            <button onClick={() => { onProfileClick(); setIsSettingsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-white/10">
                                <UserCircleIcon className="w-5 h-5 mr-3" /> Profile
                            </button>
                        </li>
                        <li>
                            <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-white/10">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
         </div>
      </div>
      
      {/* Search */}
      <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="relative">
              <input 
                  type="text" 
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 text-white placeholder-white/50 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"/>
          </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
              selectedContactId === contact.id ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <div className="relative">
              <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full" />
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
            </div>
            <div className="ml-4 flex-1 overflow-hidden">
              <p className="text-white font-semibold truncate">{contact.name}</p>
              <p className="text-white/60 text-sm truncate">{contact.lastMessage}</p>
            </div>
            <div className="text-right">
                <p className="text-white/40 text-xs">{contact.lastMessageTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;