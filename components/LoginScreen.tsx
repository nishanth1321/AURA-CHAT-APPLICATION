import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { SendIcon, UserIcon, AtSymbolIcon, LockClosedIcon } from './Icons';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const USERS_STORAGE_KEY = 'aura-chat-users';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleToggleMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // In a real app, this would be a backend call. For this demo, we use localStorage.
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      const existingUser = storedUsers.find((user: any) => user.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser = { name, email: email.toLowerCase(), password };
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      onLogin(name); // Automatically log in after successful signup

    } else { // Login mode
      const user = storedUsers.find((user: any) => user.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        setError("Invalid email or password.");
        return;
      }

      onLogin(user.name);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="animate-fade-in-up">
      <GlassCard className="p-8 md:p-12 w-[90vw] max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            {isLogin ? 'Welcome Back' : 'Join Aura Chat'}
          </h1>
          <p className="text-white/70 mt-2">
            {isLogin ? 'Login to continue your conversations' : 'Create an account to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"/>
              <input
                id="name" name="name" type="text" autoComplete="name" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-4 py-3 bg-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:z-10 sm:text-sm transition duration-300"
                placeholder="Full Name"
              />
            </div>
          )}

          <div className="relative">
            <AtSymbolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"/>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full pl-10 pr-4 py-3 bg-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:z-10 sm:text-sm transition duration-300"
              placeholder="Email Address"
            />
          </div>
          
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"/>
            <input
              id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full pl-10 pr-4 py-3 bg-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:z-10 sm:text-sm transition duration-300"
              placeholder="Password"
            />
          </div>

          {!isLogin && (
            <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"/>
                <input
                id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-4 py-3 bg-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:z-10 sm:text-sm transition duration-300"
                placeholder="Confirm Password"
                />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-transform duration-300 transform hover:scale-105"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                 <SendIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {isLogin ? 'Log In' : 'Sign Up & Start Chatting'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={handleToggleMode} className="font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
        </p>
      </GlassCard>
    </div>
  );
};

export default LoginScreen;
