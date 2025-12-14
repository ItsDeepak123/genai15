import React, { useState } from 'react';
import { Resource, QueryLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Upload, FileText, Search, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface TeacherDashboardProps {
  resources: Resource[];
  queryLog: QueryLog[];
  onUpload: (newResource: Resource) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ resources, queryLog, onUpload }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'upload'>('analytics');
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<Resource['type']>('PDF');
  const [content, setContent] = useState('');

  // Process query logs for chart data
  const processChartData = () => {
    const topicCounts: Record<string, number> = {};
    queryLog.forEach(log => {
      topicCounts[log.topic] = (topicCounts[log.topic] || 0) + 1;
    });
    
    // Also include resource downloads in "popularity"
    resources.forEach(r => {
        topicCounts[r.topic] = (topicCounts[r.topic] || 0) + (r.downloads * 0.1); // Weight downloads less than active queries for demo
    });

    return Object.entries(topicCounts).map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      fullName: name,
      queries: Math.floor(value),
    })).sort((a, b) => b.queries - a.queries).slice(0, 5);
  };

  const chartData = processChartData();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title,
      topic,
      type,
      tags: [topic.toLowerCase(), type.toLowerCase()],
      dateStr: new Date().toISOString().split('T')[0],
      downloads: 0,
      content: content || "No content description provided."
    };
    onUpload(newResource);
    setTitle('');
    setTopic('');
    setContent('');
    alert('Resource uploaded successfully!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
           <p className="text-slate-500">Manage resources and monitor student learning gaps.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Upload Resource
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              Most Requested Topics
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="queries" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-slate-500 italic">
              * Data combines direct searches and vague queries mapped to these topics.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Queries</h4>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900">{queryLog.length}</span>
                <span className="text-sm text-emerald-600 font-medium mb-1">+12% vs last week</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Top Learning Gap</h4>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Search size={24} />
                </div>
                <div>
                  <span className="block text-lg font-bold text-slate-900">{chartData[0]?.fullName || "N/A"}</span>
                  <span className="text-xs text-slate-500">High volume of "explain" requests</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl shadow-sm text-white">
               <h4 className="font-semibold mb-2">Smart Insight</h4>
               <p className="text-sm text-indigo-100 leading-relaxed">
                 Students are struggling with Normalization concepts this week. Consider uploading a simplified summary or extra practice problems.
               </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Upload className="text-indigo-600" size={20} />
            Upload New Resource
          </h3>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resource Title</label>
              <input 
                required
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g., Unit 3 Notes"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <input 
                  required
                  type="text" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g., SQL Joins"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Type</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value as Resource['type'])}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="PDF">PDF</option>
                  <option value="PPT">PPT</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Recording">Recording</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content Text (For AI Summarization)</label>
              <textarea 
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Paste the text content of the file here so the AI can generate summaries..."
              />
              <p className="text-xs text-slate-500 mt-1">In a real app, this would be extracted automatically from the uploaded file.</p>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Publish Resource
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};