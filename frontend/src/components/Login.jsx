import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Sparkles, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('username', user.username);
      
      toast.success(`Welcome back, ${user.username}! ✨`);
      
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      
      <div className="glass-card p-8 w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Aura Task</h1>
          <p className="text-gray-400">Welcome back to the future of productivity</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Mail className="inline w-4 h-4 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-aura-darker border border-aura-border rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-white"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-aura-darker border border-aura-border rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-white pr-12"
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {loading ? 'Logging in...' : (
              <>
                <LogIn className="inline w-4 h-4 mr-2" />
                Authorize Login
              </>
            )}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
            Create one
          </Link>
        </p>
        
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg text-xs text-gray-400 text-center">
          <p>Demo Accounts:</p>
          <p>Admin: admin@auratask.com / admin123</p>
          <p>User: demo@auratask.com / demo123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;