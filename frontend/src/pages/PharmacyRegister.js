import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

function PharmacyRegister() {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
          });
          setLocating(false);
        },
        () => {
          setError('Could not get location. Please enter manually.');
          setLocating(false);
        }
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/pharmacy/register', {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });
      setSuccess('Pharmacy registered! Redirecting to login...');
      setTimeout(() => navigate('/pharmacy/login'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const MediLogo = () => (
    <svg className="w-10 h-10 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.6))' }}>
      <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#0f1729"/>
      <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b16] relative overflow-hidden px-4 py-8">
      <div className="absolute w-96 h-96 bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>
      <div className="absolute w-80 h-80 bg-blue-500/5 rounded-full -bottom-32 -left-32 blur-3xl"></div>

      <div className="relative z-10 bg-[#0f1729]/80 backdrop-blur-xl border border-teal-500/10 rounded-2xl shadow-2xl p-8 w-full max-w-md">

        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-extrabold text-white">Medifind</h1>
            <div className="h-8 w-px bg-slate-600"></div>
            <MediLogo />
          </div>
          <h2 className="text-xl font-bold text-white">Register Pharmacy</h2>
          <p className="text-sm text-slate-400 mt-1">Add your pharmacy to Medifind</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/20">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-500/10 text-emerald-400 text-sm p-3 rounded-lg mb-4 border border-emerald-500/20">{success}</div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Shop Name</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <User size={16} className="text-slate-500 mr-2" />
              <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Enter shop name" className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Owner Name</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <User size={16} className="text-slate-500 mr-2" />
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner full name" className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Email</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <Mail size={16} className="text-slate-500 mr-2" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Pharmacy email" className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Phone</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <Phone size={16} className="text-slate-500 mr-2" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Address</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <MapPin size={16} className="text-slate-500 mr-2" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full shop address" className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500" required />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Location</label>
            <button type="button" onClick={getLocation} className="w-full flex items-center justify-center gap-2 border border-teal-400/30 text-teal-400 text-sm py-2.5 rounded-lg hover:bg-teal-400/10 transition mb-2">
              <MapPin size={16} />
              {locating ? 'Getting location...' : formData.latitude ? `📍 ${parseFloat(formData.latitude).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(4)}` : 'Use My Current Location'}
            </button>
          </div>

          <div>
            <label className="text-sm text-slate-200 font-medium mb-1 block">Password</label>
            <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <Lock size={16} className="text-slate-500 mr-2" />
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create password" className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Registering...' : 'Register Pharmacy'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already registered?{' '}
          <Link to="/pharmacy/login" className="text-teal-400 font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default PharmacyRegister;