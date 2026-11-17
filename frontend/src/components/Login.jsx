import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('username', res.data.user.username);
      window.location.href = res.data.user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aura-dark p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-purple-400">Aura Task</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl text-white font-bold">
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">No account? <Link to="/register" className="text-purple-400">Register</Link></p>
      </div>
    </div>
  );
}