import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import UploadPage from './pages/Upload';
import Results from './pages/Results';
import ForgotPassword from './pages/ForgotPassword';
import PharmacyLogin from './pages/PharmacyLogin';
import PharmacyRegister from './pages/PharmacyRegister';
import PharmacyDashboard from './pages/PharmacyDashboard';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b16]">
      <svg className="w-16 h-16 text-teal-400 mb-4" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 12px rgba(45,212,191,0.8))' }}>
        <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
        <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
        <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      </svg>
      <h1 className="text-2xl font-extrabold text-white mb-2">Medifind</h1>
      <div className="w-8 h-8 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/results" element={<Results />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/pharmacy/login" element={<PharmacyLogin />} />
      <Route path="/pharmacy/register" element={<PharmacyRegister />} />
      <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
    </Routes>
  );
}

export default App;