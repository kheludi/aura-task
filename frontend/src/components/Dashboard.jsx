import React, { useState } from 'react';
import { LogOut, Plus, Sparkles } from 'lucide-react';
import TaskBoard from './TaskBoard';
import CreateTaskModal from './CreateTaskModal';
import ThemeToggle from './ThemeToggle'; // Added import

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const username = localStorage.getItem('username');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-aura-dark transition-colors duration-300">
      <header className="glass-card p-4 flex justify-between items-center sticky top-0 z-50 rounded-none border-t-0 border-x-0">
        <div className="flex items-center space-x-3">
          <Sparkles className="text-purple-600 dark:text-purple-500 w-8 h-8" />
          <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">Aura Task</h1>
          <span className="text-gray-600 dark:text-gray-400 text-sm ml-4">Welcome, {username}</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Added Toggle Button */}
          <ThemeToggle />
          
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg flex items-center text-white">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </button>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }} 
            className="px-4 py-2 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg flex items-center hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <TaskBoard />
      </main>
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}