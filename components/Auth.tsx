import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, BookOpen, GraduationCap, LayoutDashboard } from 'lucide-react';
import { Button } from './Button';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock Authentication Logic
    if (isLogin) {
      // Use the explicitly selected role
      const derivedName = email.split('@')[0];
      
      onLogin({
        id: 'user-' + Date.now(),
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        email,
        role: role // Use state role
      });
    } else {
      // Signup logic
      onLogin({
        id: 'user-' + Date.now(),
        name,
        email,
        role
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl shadow-xl shadow-slate-900/50 border border-slate-800 overflow-hidden">
        
        {/* Header Graphic */}
        <div className="h-32 bg-indigo-600 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
             </svg>
          </div>
          <div className="z-10 bg-white/20 p-3 rounded-xl backdrop-blur-sm mb-2">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold z-10">Smart Librarian</h1>
        </div>

        {/* Role Selector (Top Level) */}
        <div className="px-8 pt-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 text-center">Select Your Portal</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === UserRole.STUDENT 
                  ? 'border-indigo-500 bg-indigo-900/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${role === UserRole.STUDENT ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                   <GraduationCap size={20} />
                </div>
                <span className="font-semibold text-sm">Student</span>
                {role === UserRole.STUDENT && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rotate-45 border-r border-b border-indigo-500"></div>
                )}
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.TEACHER)}
                className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === UserRole.TEACHER
                  ? 'border-indigo-500 bg-indigo-900/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${role === UserRole.TEACHER ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                   <LayoutDashboard size={20} />
                </div>
                <span className="font-semibold text-sm">Teacher</span>
                {role === UserRole.TEACHER && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rotate-45 border-r border-b border-indigo-500"></div>
                )}
              </button>
            </div>
        </div>

        {/* Auth Toggle */}
        <div className="flex border-b border-slate-800 mt-6 mx-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              isLogin ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              !isLogin ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                placeholder={role === UserRole.TEACHER ? "teacher@university.edu" : "student@university.edu"}
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-12 text-lg shadow-indigo-900/40 shadow-lg" isLoading={isLoading}>
              {isLogin ? `Log In as ${role === UserRole.TEACHER ? 'Teacher' : 'Student'}` : 'Create Account'} <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};