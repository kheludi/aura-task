import React, { useState } from 'react';
import { X, Plus, Calendar, Flag, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function CreateTaskModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/tasks', {
        ...formData,
        category: formData.category || 'General'
      });
      toast.success('Task created successfully ✨');
      onClose();
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: '',
      });
      window.dispatchEvent(new Event('taskCreated'));
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-md animate-slideIn">
        <div className="flex items-center justify-between p-6 border-b border-aura-border">
          <h2 className="text-2xl font-bold gradient-text">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
              required
              placeholder="Enter task title"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Task Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
              rows="3"
              placeholder="Enter task description (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Flag className="inline w-4 h-4 mr-1" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-3 py-2 rounded-lg capitalize transition ${
                    formData.priority === priority
                      ? priority === 'low'
                        ? 'bg-green-500 text-white'
                        : priority === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-aura-darker border border-aura-border text-gray-400 hover:border-purple-500'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Tag className="inline w-4 h-4 mr-1" />
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
              placeholder="e.g., Work, Personal, Study"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Calendar className="inline w-4 h-4 mr-1" />
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500/20 rounded-lg hover:bg-gray-500/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition disabled:opacity-50 text-white"
            >
              {loading ? 'Creating...' : (
                <>
                  <Plus className="inline w-4 h-4 mr-1" />
                  Add Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;