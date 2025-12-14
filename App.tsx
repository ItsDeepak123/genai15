import React, { useState } from 'react';
import { Resource, Message, UserRole, QueryLog } from './types';
import { INITIAL_RESOURCES, MOCK_SCHEDULE } from './constants';
import { processStudentQuery, generateCheatSheet } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Bot, GraduationCap, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [queryLog, setQueryLog] = useState<QueryLog[]>([
    { topic: 'DBMS Normalization', timestamp: Date.now() - 100000 },
    { topic: 'DBMS Normalization', timestamp: Date.now() - 200000 },
    { topic: 'Introduction to Database Systems', timestamp: Date.now() - 500000 },
  ]); // Start with some mock logs

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Handlers ---

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
          // Update analytics
          setQueryLog(prev => [...prev, { topic: relatedResource!.topic, timestamp: Date.now() }]);
          
          // Generate Summary if intent is 'summary'
          if (result.intent === 'summary') {
             generatedContent = await generateCheatSheet(relatedResource);
          }
        }
      } else {
        // Log vague queries if possible, but for now we only log resolved topics
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

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
             <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Smart Librarian</h1>
            <p className="text-xs text-slate-500">Powered by Gemini 2.5</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setUserRole(UserRole.STUDENT)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              userRole === UserRole.STUDENT 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={16} />
            Student View
          </button>
          <button
            onClick={() => setUserRole(UserRole.TEACHER)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              userRole === UserRole.TEACHER 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={16} />
            Teacher View
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {userRole === UserRole.STUDENT ? (
          <div className="h-full max-w-5xl mx-auto w-full shadow-xl shadow-slate-200/50 bg-white md:border-x border-slate-200">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isProcessing={isProcessing} 
            />
          </div>
        ) : (
          <TeacherDashboard 
            resources={resources} 
            queryLog={queryLog} 
            onUpload={handleUploadResource} 
          />
        )}
      </main>
    </div>
  );
};

export default App;