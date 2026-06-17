import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../utils/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('role', response.data.role);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b16] relative overflow-hidden px-4">

      {/* Background glow effects */}
      <div className="absolute w-[600px] h-[600px] bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full -bottom-32 -left-32 blur-3xl"></div>

      <div className="relative z-10 bg-[#0f1729]/80 backdrop-blur-xl border border-teal-500/10 rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-extrabold text-white">Medifind</h1>
            <div className="h-10 w-px bg-slate-600"></div>
            <svg
              className="w-12 h-12 text-teal-400"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.6))' }}
            >
              <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
              <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#0f1729"/>
              <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Login to your Medifind account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-slate-200 font-medium mb-2 block">Email Address</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
              <Mail size={18} className="text-slate-500 mr-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-200 font-medium">Password</label>
              <span className="text-xs text-teal-400 cursor-pointer">Forgot Password?</span>
            </div>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
              <Lock size={18} className="text-slate-500 mr-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-400 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
