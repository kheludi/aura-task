import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  // Check local storage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { background: '#14141f', color: '#e0e0e0', border: '1px solid #1f1f2e' },
        }}
      />
      <Routes>
        {/* If logged in, redirect away from login/register */}
        <Route path="/login" element={token ? <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;