import React, { useState } from 'react';
import { LogOut, Plus, Sparkles } from 'lucide-react';
import TaskBoard from './TaskBoard';
import CreateTaskModal from './CreateTaskModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const username = localStorage.getItem('username');

  return (
    <div className="min-h-screen bg-aura-dark">
      <header className="glass-card p-4 flex justify-between items-center sticky top-0 z-50 rounded-none border-t-0 border-x-0">
        <div className="flex items-center space-x-3">
          <Sparkles className="text-purple-500 w-8 h-8" />
          <h1 className="text-xl font-bold gradient-text">Aura Task</h1>
          <span className="text-gray-400 text-sm ml-4">Welcome, {username}</span>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-purple-600 rounded-lg flex items-center text-white">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </button>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-6"><TaskBoard /></main>
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}