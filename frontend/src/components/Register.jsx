import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created! Please log in.');
      navigate('/login'); // Redirect to login instead of auto-login
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aura-dark p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl text-white font-bold">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">Have an account? <Link to="/login" className="text-purple-400">Login</Link></p>
      </div>
    </div>
  );
}