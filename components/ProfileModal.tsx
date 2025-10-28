import React, { useRef } from 'react';
import GlassCard from './GlassCard';
import type { User } from '../types';
import { XIcon, PhotoIcon } from './Icons';
import { PREDEFINED_BACKGROUNDS } from '../constants';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onBackgroundChange: (url: string) => void;
  currentBackground: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onBackgroundChange, currentBackground }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onBackgroundChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <GlassCard className="p-8 w-[90vw] max-w-lg relative animate-fade-in-up flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center flex-shrink-0">
            <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/20 shadow-lg"
            />
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-green-400 mt-1">Online</p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6 text-left flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Chat Background</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {PREDEFINED_BACKGROUNDS.map(bg => (
                <button key={bg.id} onClick={() => onBackgroundChange(bg.url)} className={`relative rounded-lg overflow-hidden aspect-video transition-all duration-200 ${currentBackground === bg.url ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : 'hover:scale-105'}`}>
                  <img src={bg.url} alt={bg.id} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/20"></div>
                </button>
              ))}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={handleUploadClick}
              className="w-full flex items-center justify-center py-2 px-4 border border-white/20 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition duration-300"
            >
              <PhotoIcon className="w-5 h-5 mr-2" />
              Upload Custom Image
            </button>
        </div>

      </GlassCard>
    </div>
  );
};

export default ProfileModal;