import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X, Upload, ArrowRight, AlertCircle } from 'lucide-react';


function SearchPage() {
  const [medicines, setMedicines] = useState([]);
  const [input, setInput] = useState('');
  const [loading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const addMedicine = () => {
    if (input.trim() && !medicines.includes(input.trim())) {
      setMedicines([...medicines, input.trim()]);
      setInput('');
    }
  };

  const removeMedicine = (med) => {
    setMedicines(medicines.filter(m => m !== med));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addMedicine();
  };

  const handleSearch = () => {
    if (!agreed) {
      setError('Please confirm the disclaimer before continuing.');
      return;
    }
    if (medicines.length === 0) {
      setError('Please add at least one medicine.');
      return;
    }
    navigate('/results', { state: { medicines } });
  };

  return (
    <div className="min-h-screen bg-[#070b16] relative overflow-hidden px-4 py-8">

      <div className="absolute w-[600px] h-[600px] bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full -bottom-32 -left-32 blur-3xl"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-4xl mx-auto mb-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <svg className="w-7 h-7 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
            <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
            <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-extrabold text-white">Medifind</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto">

        <h1 className="text-3xl font-extrabold text-white mb-2">Find Medicines</h1>
        <p className="text-slate-400 mb-8">Type medicine names or upload your prescription</p>

        {/* Two Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/upload')}
            className="flex flex-col items-center gap-2 bg-[#0f1729]/80 border border-slate-700 hover:border-teal-400/50 rounded-xl p-5 transition"
          >
            <Upload className="text-teal-400" size={28} />
            <span className="text-white font-medium text-sm">Upload Prescription</span>
            <span className="text-slate-500 text-xs text-center">Scan your doctor's prescription</span>
          </button>
          <div className="flex flex-col items-center gap-2 bg-[#0f1729]/80 border border-teal-400/30 rounded-xl p-5">
            <Search className="text-teal-400" size={28} />
            <span className="text-white font-medium text-sm">Enter Manually</span>
            <span className="text-slate-500 text-xs text-center">Type medicine names below</span>
          </div>
        </div>

        {/* Medicine Input */}
        <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-6 mb-6">
          <label className="text-slate-200 font-medium text-sm mb-3 block">Add Medicine Names</label>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-teal-400 transition">
              <Search size={16} className="text-slate-500 mr-2" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Paracetamol 500mg"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
              />
            </div>
            <button
              onClick={addMedicine}
              className="bg-teal-400/20 hover:bg-teal-400/30 border border-teal-400/30 text-teal-400 px-3 rounded-lg transition"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Medicine Tags */}
          {medicines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {medicines.map((med, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-teal-400/10 border border-teal-400/20 text-teal-300 text-xs px-3 py-1.5 rounded-full">
                  {med}
                  <button onClick={() => removeMedicine(med)}>
                    <X size={12} className="hover:text-red-400 transition" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {medicines.length === 0 && (
            <p className="text-slate-600 text-xs">No medicines added yet. Type above and press Enter or click +</p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-5 mb-6">
          <div className="flex gap-2 mb-3">
            <AlertCircle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-slate-400 text-xs leading-relaxed">
              <span className="text-yellow-400 font-medium">Disclaimer: </span>
              MediFind only helps users locate pharmacies and medicine availability. We do not sell, prescribe, or deliver medicines. Users must verify medicines before purchase.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="accent-teal-400 w-4 h-4"
            />
            <span className="text-slate-300 text-xs">I confirm that the entered medicine details are accurate and I have read the disclaimer.</span>
          </label>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          Find Nearby Pharmacies <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default SearchPage;