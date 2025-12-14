import React, { useState } from 'react';
import { Resource, Message, UserRole, ActivityLog, User } from './types';
import { INITIAL_RESOURCES, MOCK_SCHEDULE } from './constants';
import { processStudentQuery, generateCheatSheet } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Auth } from './components/Auth';
import { Bot, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // App Data State
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  // Initialize with some mock activity
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    { id: 'log-1', resourceTitle: 'Unit 2: Normalization Notes', topic: 'DBMS Normalization', query: 'notes for normalization', timestamp: Date.now() - 100000 },
    { id: 'log-2', resourceTitle: 'Unit 2: Normalization Notes', topic: 'DBMS Normalization', query: 'send unit 2 pdf', timestamp: Date.now() - 200000 },
    { id: 'log-3', resourceTitle: 'Unit 1: Intro to DBMS', topic: 'Introduction to Database Systems', query: 'intro slides', timestamp: Date.now() - 500000 },
  ]);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Handlers ---

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]); // Optional: clear chat on logout
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // 2. Call Gemini Service
      const result = await processStudentQuery(text, resources, MOCK_SCHEDULE);
      
      let relatedResource: Resource | undefined;
      let generatedContent: string | undefined;

      // 3. If a resource was found
      if (result.found && result.resourceId) {
        relatedResource = resources.find(r => r.id === result.resourceId);
        
        if (relatedResource) {
          // Update analytics / Log the Automatic Distribution
          const newLog: ActivityLog = {
            id: Date.now().toString(),
            resourceTitle: relatedResource.title,
            topic: relatedResource.topic,
            query: text,
            timestamp: Date.now()
          };
          setActivityLog(prev => [newLog, ...prev]);
          
          // Generate Summary if intent is 'summary'
          if (result.intent === 'summary') {
             generatedContent = await generateCheatSheet(relatedResource);
          }
        }
      }

      // 4. Add Assistant Message
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: result.message,
        relatedResource,
        generatedContent,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: "I encountered a system error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadResource = (newResource: Resource) => {
    setResources(prev => [...prev, newResource]);
  };

  // --- Render ---

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-500/20 shadow-lg">
             <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-white leading-tight">Smart Librarian</h1>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-slate-200">{user.name}</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wide font-medium">
              {user.role}
            </span>
          </div>
          <div className="h-8 w-8 bg-indigo-900/50 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-800">
            <UserIcon size={18} />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all ml-2 border border-transparent hover:border-red-900/30"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {user.role === UserRole.STUDENT ? (
          <div className="h-full max-w-5xl mx-auto w-full shadow-2xl shadow-black/50 bg-slate-950 md:border-x border-slate-800">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isProcessing={isProcessing} 
            />
          </div>
        ) : (
          <TeacherDashboard 
            resources={resources} 
            activityLog={activityLog} 
            onUpload={handleUploadResource} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
