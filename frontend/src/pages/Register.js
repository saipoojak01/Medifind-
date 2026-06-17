import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/users/register', formData);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b16] relative overflow-hidden px-4">

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
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-slate-400 mt-1">Sign up for your Medifind account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 text-emerald-400 text-sm p-3 rounded-lg mb-4 border border-emerald-500/20">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="text-sm text-slate-200 font-medium mb-2 block">Full Name</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
              <User size={18} className="text-slate-500 mr-2.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-2 block">Email Address</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
              <Mail size={18} className="text-slate-500 mr-2.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-2 block">Phone Number</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
              <Phone size={18} className="text-slate-500 mr-2.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-2 block">Password</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
              <Lock size={18} className="text-slate-500 mr-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-teal-400 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;