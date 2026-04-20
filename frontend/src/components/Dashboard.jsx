import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, LayoutDashboard, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskBoard from './TaskBoard';
import CreateTaskModal from './CreateTaskModal';

function Dashboard() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const handleTaskCreated = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('taskCreated', handleTaskCreated);
    return () => window.removeEventListener('taskCreated', handleTaskCreated);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully 👋');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-aura-dark">
      {/* Header */}
      <header className="glass-card rounded-none border-l-0 border-r-0 border-t-0 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Aura Task</h1>
                <p className="text-xs text-gray-400">Welcome back, {username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-aura-darker border border-aura-border rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-sm w-64"
                />
              </div>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <TaskBoard key={refreshKey} searchTerm={searchTerm} />
      </main>
      
      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}

export default Dashboard;