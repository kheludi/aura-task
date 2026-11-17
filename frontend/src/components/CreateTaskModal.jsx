import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Plus, Flag, Tag } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

export default function CreateTaskModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    category: 'General', 
    dueDate: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tasks', formData);
      toast.success('Task created!');
      onClose();
      setFormData({ title: '', description: '', priority: 'medium', category: 'General', dueDate: '' });
      window.dispatchEvent(new Event('taskCreated'));
      window.location.reload(); 
    } catch (error) { 
      toast.error('Failed to create task'); 
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card p-6 w-full max-w-md animate-slideIn">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Task</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Task Title *</label>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              required 
              value={formData.title}
              className="w-full p-3 bg-slate-100 dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 transition-colors" 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Description</label>
            <textarea 
              placeholder="Add more details (optional)" 
              className="w-full p-3 bg-slate-100 dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 transition-colors resize-none" 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">
              <Flag className="inline w-4 h-4 mr-1" /> Priority
            </label>
            <select 
              className="w-full p-3 bg-slate-100 dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 transition-colors" 
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">
              <Tag className="inline w-4 h-4 mr-1" /> Category
            </label>
            <input 
              type="text" 
              placeholder="e.g. Work, Personal, Study" 
              value={formData.category}
              className="w-full p-3 bg-slate-100 dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 transition-colors" 
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
          </div>
          
          {/* Date Picker - Clickable whole area */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">
              <CalendarIcon className="inline w-4 h-4 mr-1" /> Due Date
            </label>
            <div className="relative group cursor-pointer">
              <input 
                type="date" 
                value={formData.dueDate}
                className="w-full p-3 bg-slate-100 dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 transition-colors appearance-none" 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
              />
              <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-gray-400 pointer-events-none group-hover:text-blue-500 dark:group-hover:text-purple-400 transition-colors" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 rounded-xl text-white font-bold transition-all shadow-md dark:shadow-none flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Creating...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
}