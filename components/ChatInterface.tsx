import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Download, Sparkles, Bot, User } from 'lucide-react';
import { Message, Resource } from '../types';
import { Button } from './Button';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isProcessing }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 opacity-60">
            <Bot size={64} className="mb-4 text-indigo-300" />
            <p className="text-xl font-medium">Hello! I'm your Smart Librarian.</p>
            <p className="text-sm mt-2">Ask me for notes, assignments, or summaries.</p>
            <div className="mt-6 space-y-2 text-xs">
              <p className="bg-white px-3 py-1 rounded-full border border-slate-200">"Notes for last Tuesday"</p>
              <p className="bg-white px-3 py-1 rounded-full border border-slate-200">"Summary of DBMS Normalization"</p>
              <p className="bg-white px-3 py-1 rounded-full border border-slate-200">"Send Assignment 3"</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

                {/* Attached Resource Card */}
                {msg.relatedResource && (
                  <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mt-2">
                    <div className="p-4 border-b border-slate-100 flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">{msg.relatedResource.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>{msg.relatedResource.type}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{msg.relatedResource.dateStr}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Generated Content (Cheat Sheet) */}
                    {msg.generatedContent ? (
                      <div className="p-4 bg-slate-50 max-h-64 overflow-y-auto text-sm text-slate-700 prose prose-sm prose-indigo">
                         <div className="flex items-center gap-2 text-emerald-600 font-medium mb-2 text-xs uppercase tracking-wider">
                            <Sparkles size={14} /> AI Generated Cheat Sheet
                         </div>
                         <ReactMarkdown>{msg.generatedContent}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 flex items-center justify-between">
                         <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-200 rounded-full">
                           {msg.relatedResource.topic}
                         </span>
                         <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                           <Download size={16} /> Download
                         </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your request... (e.g., 'Notes from last week')"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isProcessing} 
            isLoading={isProcessing}
            className="rounded-xl px-6"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};