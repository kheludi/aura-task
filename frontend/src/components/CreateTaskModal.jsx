import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

export default function CreateTaskModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', category: 'General', dueDate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      toast.success('Task created!');
      onClose();
      window.dispatchEvent(new Event('taskCreated')); // Tells dashboard to refresh
      window.location.reload(); // Quickest way to refresh the board
    } catch (error) { toast.error('Failed to create task'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="glass-card p-6 w-full max-w-md">
        <div className="flex justify-between mb-4"><h2 className="text-xl font-bold text-white">New Task</h2><button onClick={onClose}><X className="text-white" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title" required className="w-full p-2 bg-aura-darker border border-aura-border rounded text-white" onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea placeholder="Description" className="w-full p-2 bg-aura-darker border border-aura-border rounded text-white" onChange={e => setFormData({...formData, description: e.target.value})} />
          <select className="w-full p-2 bg-aura-darker border border-aura-border rounded text-white" onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low Priority</option><option value="medium">Medium Priority</option><option value="high">High Priority</option>
          </select>
          <input type="date" className="w-full p-2 bg-aura-darker border border-aura-border rounded text-white" onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          <button type="submit" className="w-full py-2 bg-purple-600 rounded text-white font-bold">Create Task</button>
        </form>
      </div>
    </div>
  );
}