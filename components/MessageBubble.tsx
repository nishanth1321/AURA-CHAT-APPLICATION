
import React, { useState } from 'react';
import type { Message } from '../types';
import { FaceSmileIcon } from './Icons';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isTyping?: boolean;
  onReact: (emoji: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isTyping = false, onReact }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const bubbleClasses = isOwnMessage
    ? 'bg-indigo-500 text-white'
    : 'bg-white/20 text-white';
  
  const alignmentClass = isOwnMessage ? 'items-end' : 'items-start';
  const flexDirection = isOwnMessage ? 'flex-row-reverse' : 'flex-row';

  if (isTyping) {
    return (
        <div className={`flex flex-col ${alignmentClass} animate-fade-in`}>
          <div className={`flex items-center justify-center p-3 rounded-2xl max-w-xs md:max-w-md ${bubbleClasses}`}>
             <div className="flex space-x-1">
                 <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-0"></span>
                 <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-150"></span>
                 <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-300"></span>
             </div>
          </div>
        </div>
    );
  }

  // FIX: Cast the result of Object.entries to correctly type userIds as string[],
  // which resolves type inference issues in both the filter and later in the map function.
  const reactions = message.reactions && (Object.entries(message.reactions) as [string, string[]][]).filter(([, userIds]) => userIds.length > 0);

  return (
    <div className={`flex flex-col w-full ${alignmentClass} animate-fade-in group`}>
        <div className={`flex items-center gap-2 ${flexDirection}`}>
            {/* Emoji Picker */}
            <div className={`relative transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${isOwnMessage ? 'order-first' : 'order-last'}`}>
                 <button onClick={() => setShowPicker(!showPicker)} className="p-1 rounded-full hover:bg-black/20">
                    <FaceSmileIcon className="w-5 h-5 text-white/60"/>
                 </button>
                 {showPicker && (
                    <div 
                        className="absolute bottom-full mb-2 flex items-center gap-1 bg-gray-800/90 backdrop-blur-md p-2 rounded-full shadow-lg z-10"
                        onMouseLeave={() => setShowPicker(false)}
                    >
                        {EMOJI_OPTIONS.map(emoji => (
                            <button 
                                key={emoji} 
                                onClick={() => {
                                    onReact(emoji);
                                    setShowPicker(false);
                                }}
                                className="text-xl p-1 rounded-full hover:bg-white/20 transition-transform transform hover:scale-125"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                 )}
            </div>

            {/* Message Content */}
            <div className="relative">
                <div className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-md ${bubbleClasses}`} style={{ wordBreak: 'break-word' }}>
                    {message.text}
                </div>
                {/* Reactions Display */}
                {reactions && reactions.length > 0 && (
                    <div className={`absolute -bottom-3 flex items-center gap-1 ${isOwnMessage ? 'right-2' : 'left-2'}`}>
                        {reactions.map(([emoji, userIds]) => (
                            <div key={emoji} className="flex items-center bg-gray-700/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs shadow">
                                <span>{emoji}</span>
                                <span className="text-white/80 ml-1 font-semibold">{userIds.length}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      <p className={`text-xs text-white/50 mt-1 px-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

export default MessageBubble;