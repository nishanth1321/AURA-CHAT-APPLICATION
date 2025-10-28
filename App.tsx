import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ChatInterface from './components/ChatInterface';
import { PREDEFINED_BACKGROUNDS } from './constants';

const BACKGROUND_STORAGE_KEY = 'aura-chat-background';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState<string>(PREDEFINED_BACKGROUNDS[0].url);

  useEffect(() => {
    const savedBg = localStorage.getItem(BACKGROUND_STORAGE_KEY);
    if (savedBg) {
      setBackgroundUrl(savedBg);
    }
  }, []);

  const handleLogin = (name: string) => {
    if (name.trim()) {
      setUsername(name.trim());
      setIsLoggedIn(true);
    }
  };
  
  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  const handleBackgroundChange = (newUrl: string) => {
    setBackgroundUrl(newUrl);
    localStorage.setItem(BACKGROUND_STORAGE_KEY, newUrl);
  };

  return (
    <div className="w-screen h-screen bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url('${backgroundUrl}')` }}>
      <main className="w-full h-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
        {isLoggedIn ? (
          <ChatInterface 
            username={username} 
            onLogout={handleLogout} 
            onBackgroundChange={handleBackgroundChange}
            currentBackground={backgroundUrl}
          />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
};

export default App;