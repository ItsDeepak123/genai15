import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, BookOpen, GraduationCap, LayoutDashboard, Github, Globe, Check } from 'lucide-react';
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
      const derivedName = email.split('@')[0];
      onLogin({
        id: 'user-' + Date.now(),
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        email,
        role: role
      });
    } else {
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 mb-5 transform transition-transform hover:scale-105 duration-300">
                <BookOpen size={28} />
             </div>
             <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Smart Librarian</h1>
             <p className="text-slate-400 text-sm">Your intelligent academic companion</p>
          </div>

          {/* Tab Switcher */}
          <div className="px-8 mb-6">
            <div className="bg-slate-950/50 p-1 rounded-xl flex relative">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                  isLogin ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                  !isLogin ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sign Up
              </button>
              
              {/* Sliding Background */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-600 rounded-lg transition-all duration-300 ease-in-out ${
                  isLogin ? 'left-1' : 'left-[calc(50%+4px)]'
                }`} 
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                  role === UserRole.STUDENT 
                  ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-200' 
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <GraduationCap size={20} className={role === UserRole.STUDENT ? "text-indigo-400" : ""} />
                <span className="text-xs font-semibold">Student</span>
                {role === UserRole.STUDENT && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />}
              </button>
              
              <button
                type="button"
                onClick={() => setRole(UserRole.TEACHER)}
                className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                  role === UserRole.TEACHER
                  ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-200' 
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <LayoutDashboard size={20} className={role === UserRole.TEACHER ? "text-indigo-400" : ""} />
                <span className="text-xs font-semibold">Teacher</span>
                 {role === UserRole.TEACHER && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />}
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                     <UserIcon size={18} />
                   </div>
                   <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                   />
                </div>
              )}

              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                   <Mail size={18} />
                 </div>
                 <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                 />
              </div>

              <div className="space-y-1">
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                     <Lock size={18} />
                   </div>
                   <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                   />
                </div>
                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full py-3.5 text-base font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all" 
              isLoading={isLoading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Social Logins */}
            <div className="pt-2">
               <div className="relative flex items-center gap-3 mb-4">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <span className="text-xs text-slate-500 font-medium">Or continue with</span>
                  <div className="h-px bg-slate-800 flex-1"></div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all group">
                     <Globe size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                     <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">Google</span>
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all group">
                     <Github size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                     <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">GitHub</span>
                  </button>
               </div>
            </div>

          </form>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} Smart Librarian. All rights reserved.
        </p>
      </div>
    </div>
  );
};