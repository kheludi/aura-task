import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, LayoutDashboard, Shield, Sparkles, TrendingUp, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import UserManagement from './UserManagement';
import api from '../api';

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [summary, setSummary] = useState([]);
  const [systemStats, setSystemStats] = useState({ 
    totalUsers: 0, 
    totalTasks: 0, 
    totalCompleted: 0, 
    totalOverdue: 0,
    activeUsers: 0,
    adminUsers: 0
  });
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchSummary();
    fetchSystemStats();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/admin/summary');
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to load summary');
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await api.get('/admin/stats/system');
      setSystemStats(response.data);
    } catch (error) {
      console.error('Failed to fetch system stats');
    }
  };

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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Admin Command Center</h1>
                <p className="text-xs text-gray-400">Welcome, {username} (Administrator)</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-green-400">{systemStats.activeUsers} active</span> • 
              <span className="text-purple-400 ml-1">{systemStats.adminUsers} admins</span>
            </div>
          </div>
          
          <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalCompleted}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overdue Tasks</p>
                <p className="text-3xl font-bold text-white">{systemStats.totalOverdue}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-aura-border">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'users'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Users className="inline w-4 h-4 mr-2" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'summary'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <BarChart3 className="inline w-4 h-4 mr-2" />
            Task Summary
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' ? (
          <UserManagement onUserUpdate={fetchSummary} />
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-aura-darker border-b border-aura-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Tasks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">In Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Overdue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aura-border">
                  {summary.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.total_tasks || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">{user.pending || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">{user.in_progress || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{user.completed || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{user.overdue || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;