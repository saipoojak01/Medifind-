import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, FileText, ShieldCheck, ArrowRight, Users, Package, Store } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const features = [
    { icon: <MapPin size={28} />, title: 'Nearby Pharmacies', desc: 'Find pharmacies near you' },
    { icon: <Tag size={28} />, title: 'Price Comparison', desc: 'Compare prices and save more' },
    { icon: <FileText size={28} />, title: 'Upload Prescription', desc: 'Upload and find medicines easily' },
    { icon: <ShieldCheck size={28} />, title: '100% Reliable', desc: 'Genuine medicines you can trust' },
  ];

  return (
    <div className="min-h-screen bg-[#070b16] relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute w-[600px] h-[600px] bg-teal-500/5 rounded-full -top-40 right-0 blur-3xl"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full bottom-0 left-0 blur-3xl"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 6px rgba(45,212,191,0.6))' }}>
            <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
            <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
            <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-extrabold text-white">Medifind</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-slate-300 text-sm hidden md:block">Welcome, <span className="text-teal-400 font-medium">{name || 'User'}</span></span>
          <button
            onClick={() => navigate('/search')}
            className="bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            Find Medicines
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="text-slate-400 text-sm hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-8 pt-20 pb-16 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Find <span className="text-teal-400">Medicines.</span><br />
            Save <span className="text-teal-400">Lives.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            MediFind helps you find medicines nearby, compare prices and check availability instantly.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Find Medicines <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 border border-teal-400/30 text-teal-400 font-semibold px-6 py-3 rounded-lg hover:bg-teal-400/10 transition"
            >
              Upload Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 px-8 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-5 hover:border-teal-500/30 transition cursor-pointer">
              <div className="text-teal-400 mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 px-8 pb-16 max-w-6xl mx-auto">
        <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-6 grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Users className="text-teal-400" size={28} />
            <div>
              <p className="text-2xl font-extrabold text-teal-400">10K+</p>
              <p className="text-slate-400 text-xs">Happy Users</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Package className="text-teal-400" size={28} />
            <div>
              <p className="text-2xl font-extrabold text-teal-400">50K+</p>
              <p className="text-slate-400 text-xs">Medicines Listed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Store className="text-teal-400" size={28} />
            <div>
              <p className="text-2xl font-extrabold text-teal-400">5K+</p>
              <p className="text-slate-400 text-xs">Partner Stores</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;