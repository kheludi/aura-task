import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('username', res.data.user.username);
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aura-dark p-4">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 bg-aura-darker rounded-xl border border-aura-border text-white"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="w-full py-3 bg-purple-600 rounded-xl text-white font-bold">Register</button>
        </form>
        <p className="text-center mt-4 text-gray-400">Have an account? <Link to="/login" className="text-purple-400">Login</Link></p>
      </div>
    </div>
  );
}