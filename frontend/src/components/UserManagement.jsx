import React, { useState, useEffect } from 'react';
import { Shield, User, Ban, CheckCircle, Edit2, X, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function UserManagement({ onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'newest', 'oldest'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
      if (onUserUpdate) onUserUpdate();
      setEditingRole(null);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      fetchUsers();
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Sort logic: Admins always first, then apply the selected sort for the rest
  const sortedUsers = [...users].sort((a, b) => {
    // 1. Force Admins to the top
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    
    // 2. Apply dropdown sorting
    if (sortBy === 'name') {
      return a.username.localeCompare(b.username);
    } else if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at); // Newest first
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at); // Oldest first
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 dark:border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Sorting Header Bar */}
      <div className="p-4 border-b border-slate-300 dark:border-aura-border flex justify-between items-center bg-slate-50 dark:bg-aura-darker/50">
        <div className="flex items-center space-x-2 text-slate-600 dark:text-gray-400">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm font-medium">Sort Users:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 bg-white dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 text-slate-800 dark:text-white transition-colors shadow-sm cursor-pointer"
        >
          <option value="name">Alphabetically (A-Z)</option>
          <option value="newest">Date Registered (Newest)</option>
          <option value="oldest">Date Registered (Oldest)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-aura-darker border-b border-slate-300 dark:border-aura-border">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider w-16">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-aura-border">
            {sortedUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-slate-500 dark:text-gray-400">
                  {index + 1}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-purple-500 dark:to-pink-500 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingRole === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, user.role)}
                      className="px-2 py-1 bg-white dark:bg-aura-darker border border-slate-300 dark:border-aura-border rounded text-sm focus:outline-none focus:border-blue-500 dark:focus:border-purple-500 text-slate-800 dark:text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' 
                        : 'bg-slate-500/10 dark:bg-gray-500/20 text-slate-600 dark:text-gray-400 border border-slate-500/30'
                    }`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                      : 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                  }`}>
                    {user.status === 'active' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Ban className="w-3 h-3 mr-1" />
                    )}
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {editingRole === user.id ? (
                      <button
                        onClick={() => setEditingRole(null)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-gray-500/20 rounded-lg transition"
                      >
                        <X className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingRole(user.id)}
                        className="p-1.5 hover:bg-blue-100 dark:hover:bg-purple-500/20 rounded-lg transition group"
                        title="Edit role"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-purple-400" />
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(user.id, user.status)}
                      className={`p-1.5 rounded-lg transition group ${
                        user.status === 'active'
                          ? 'hover:bg-red-100 dark:hover:bg-red-500/20'
                          : 'hover:bg-green-100 dark:hover:bg-green-500/20'
                      }`}
                      title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                    >
                      {user.status === 'active' ? (
                        <Ban className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;