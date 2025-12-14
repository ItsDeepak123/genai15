import React, { useState, useRef } from 'react';
import { Resource, ActivityLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Upload, FileText, Search, TrendingUp, FolderOpen, Video, Image as ImageIcon, Mic, File, Zap, Clock, Plus, Link as LinkIcon } from 'lucide-react';
import { Button } from './Button';

interface TeacherDashboardProps {
  resources: Resource[];
  activityLog: ActivityLog[];
  onUpload: (newResource: Resource) => void;
}

const ResourceIcon = ({ type }: { type: Resource['type'] }) => {
  switch (type) {
    case 'PDF': return <FileText size={24} className="text-red-400" />;
    case 'Video': return <Video size={24} className="text-blue-400" />;
    case 'Image': return <ImageIcon size={24} className="text-purple-400" />;
    case 'Recording': return <Mic size={24} className="text-pink-400" />;
    default: return <File size={24} className="text-indigo-400" />;
  }
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ resources, activityLog, onUpload }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'repository' | 'upload'>('repository');
  
  // Repository State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<Resource['type']>('PDF');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process activity logs for chart data
  const processChartData = () => {
    const topicCounts: Record<string, number> = {};
    activityLog.forEach(log => {
      topicCounts[log.topic] = (topicCounts[log.topic] || 0) + 1;
    });
    
    // Also include resource downloads in "popularity" (simulated historical data)
    resources.forEach(r => {
        topicCounts[r.topic] = (topicCounts[r.topic] || 0) + (r.downloads * 0.05); 
    });

    return Object.entries(topicCounts).map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      fullName: name,
      queries: Math.floor(value),
    })).sort((a, b) => b.queries - a.queries).slice(0, 5);
  };

  const chartData = processChartData();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      
      if (!title) {
        const name = file.name.split('.')[0].replace(/[_-]/g, ' ');
        setTitle(name.charAt(0).toUpperCase() + name.slice(1));
      }
      
      if (file.type.includes('pdf')) setType('PDF');
      else if (file.type.includes('image')) setType('Image');
      else if (file.type.includes('video')) setType('Video');
      else if (file.type.includes('audio')) setType('Recording');
      else if (file.type.includes('presentation') || file.type.includes('powerpoint')) setType('PPT');
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title,
      topic, // Acting as the 'Tag'
      type,
      tags: [topic.toLowerCase(), type.toLowerCase()],
      dateStr: new Date().toISOString().split('T')[0],
      downloads: 0,
      content: content || "No content description provided.",
      url: url || undefined
    };
    onUpload(newResource);
    setTitle('');
    setTopic('');
    setContent('');
    setUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    alert('Resource uploaded successfully to Cloud Repository!');
    setActiveTab('repository'); // Switch to repo view after upload
  };

  // Filter resources for Repository View
  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d+ ago';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
           <p className="text-slate-400">Manage cloud repository and monitor student interactions.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-sm">
           <button 
            onClick={() => setActiveTab('repository')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'repository' ? 'bg-indigo-900/30 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <FolderOpen size={16} />
            Repository
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-indigo-900/30 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <TrendingUp size={16} />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-indigo-900/30 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      {activeTab === 'repository' && (
        <div className="space-y-6">
          {/* Search / Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center px-4 shadow-sm">
              <Search className="text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Search resources by title or tag..."
                className="bg-transparent border-none outline-none text-white w-full h-12 ml-3 placeholder-slate-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setActiveTab('upload')} className="shrink-0">
               <Plus size={18} className="mr-2" /> Upload Resource
            </Button>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(r => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-4 hover:border-indigo-500/30 transition-colors group">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-800/80 transition-colors">
                  <ResourceIcon type={r.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-100 truncate mb-1" title={r.title}>{r.title}</h4>
                    {r.url && <LinkIcon size={14} className="text-indigo-400 mt-1 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 truncate max-w-[120px]">
                      {r.topic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{r.type}</span>
                    <span>{r.dateStr}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No resources found matching your search.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Charts and Stats */}
          <div className="md:col-span-2 space-y-6">
             <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
                <TrendingUp className="text-indigo-400" size={20} />
                Most Requested Topics
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      cursor={{ fill: '#334155', opacity: 0.4 }}
                    />
                    <Bar dataKey="queries" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
                  <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Auto-Responses</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">{activityLog.length}</span>
                    <span className="text-sm text-emerald-400 font-medium mb-1">Students helped</span>
                  </div>
                </div>
                
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
                  <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Top Learning Gap</h4>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-900/30 text-red-400 rounded-lg">
                      <Search size={24} />
                    </div>
                    <div>
                      <span className="block text-lg font-bold text-white">{chartData[0]?.fullName || "N/A"}</span>
                      <span className="text-xs text-slate-400">Needs more resources</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Right Column: Activity Feed */}
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col h-full max-h-[600px]">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <Zap className="text-amber-400" size={20} fill="currentColor" />
                  Live Activity Feed
                </h3>
                <p className="text-xs text-slate-500 mt-1">Real-time automatic resource distribution</p>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activityLog.length === 0 && (
                   <p className="text-center text-slate-500 text-sm py-4">No activity yet.</p>
                )}
                {activityLog.map((log) => (
                   <div key={log.id} className="relative pl-6 pb-2 border-l border-slate-800 last:border-0">
                      <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-800 hover:border-slate-700 transition-colors">
                         <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Auto-Sent</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                               <Clock size={10} /> {formatTimeAgo(log.timestamp)}
                            </span>
                         </div>
                         <p className="text-sm text-slate-200 font-medium mb-1">{log.resourceTitle}</p>
                         <div className="text-xs text-slate-500">
                            Query: <span className="text-slate-400 italic">"{log.query}"</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-800 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <Upload className="text-indigo-400" size={20} />
            Upload New Resource
          </h3>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Resource Title</label>
              <input 
                required
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500" 
                placeholder="e.g., ER Diagram for Hospital System"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">File Source</label>
              <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                     <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                     <input 
                        type="url" 
                        value={url} 
                        onChange={e => setUrl(e.target.value)}
                        className="w-full pl-10 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500" 
                        placeholder="Paste URL..."
                      />
                  </div>
                  <div className="relative">
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <label 
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-dashed border-slate-600 text-slate-300 hover:text-white hover:border-indigo-500 hover:bg-slate-700/50 cursor-pointer transition-all whitespace-nowrap h-full"
                    >
                        <FolderOpen size={18} />
                        Browse
                    </label>
                  </div>
              </div>
              {url.startsWith('blob:') && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                   <Zap size={12} fill="currentColor" /> Local file selected ready for upload
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Topic (Tag)</label>
                <input 
                  required
                  type="text" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500" 
                  placeholder="e.g., ER Models"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">File Type</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value as Resource['type'])}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="PPT">Presentation (PPT)</option>
                  <option value="Image">Image (Diagram/Photo)</option>
                  <option value="Video">Video Recording</option>
                  <option value="Recording">Audio Recording</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Content Description (For AI Context)</label>
              <textarea 
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
                placeholder="Describe the content of the file. E.g., 'A video explaining different types of SQL Joins with examples'."
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Publish to Repository
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};