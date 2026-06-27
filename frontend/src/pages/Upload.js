import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertTriangle, ArrowRight, X, Plus, Edit3 } from 'lucide-react';
import api from '../utils/api';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newMedicine, setNewMedicine] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setStep(1);
      setMedicines([]);
      setConfirmed([]);
      setError('');
    }
  };

const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/ocr/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const extracted = response.data.filter(m => m.trim().length > 2);
      setMedicines(extracted);
      setConfirmed([...extracted]);
      setStep(2);
      if (extracted.length === 0) {
        setError('No medicines detected automatically. Please add medicines manually using the box below.');
      }
    } catch (err) {
      setMedicines([]);
      setConfirmed([]);
      setStep(2);
      setError('Scanning failed. Please add medicines manually using the box below.');
    } finally {
      setLoading(false);
    }
  };
  const toggleConfirm = (med) => {
    if (confirmed.includes(med)) {
      setConfirmed(confirmed.filter(m => m !== med));
    } else {
      setConfirmed([...confirmed, med]);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(medicines[index]);
  };

  const saveEdit = (index) => {
    const updated = [...medicines];
    const oldMed = medicines[index];
    updated[index] = editValue;
    setMedicines(updated);
    if (confirmed.includes(oldMed)) {
      const updatedConfirmed = confirmed.filter(m => m !== oldMed);
      setConfirmed([...updatedConfirmed, editValue]);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const addManualMedicine = () => {
    if (newMedicine.trim() && !medicines.includes(newMedicine.trim())) {
      const med = newMedicine.trim();
      setMedicines([...medicines, med]);
      setConfirmed([...confirmed, med]);
      setNewMedicine('');
    }
  };

  const removeMedicine = (med) => {
    setMedicines(medicines.filter(m => m !== med));
    setConfirmed(confirmed.filter(m => m !== med));
  };

  const handleProceed = () => {
    if (confirmed.length === 0) {
      setError('Please confirm at least one medicine.');
      return;
    }
    navigate('/results', { state: { medicines: confirmed } });
  };

  return (
    <div className="min-h-screen bg-[#070b16] relative overflow-hidden px-4 py-8">

      <div className="absolute w-96 h-96 bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>
      <div className="absolute w-80 h-80 bg-blue-500/5 rounded-full -bottom-32 -left-32 blur-3xl"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-2xl mx-auto mb-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <svg className="w-7 h-7 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
            <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
            <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-extrabold text-white">Medifind</span>
        </div>
        <button onClick={() => navigate('/search')} className="text-slate-400 text-sm hover:text-white transition">
          ← Back
        </button>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto">

        <h1 className="text-3xl font-extrabold text-white mb-2">Upload Prescription</h1>
        <p className="text-slate-400 mb-8">Upload your prescription and verify the extracted medicines</p>

        {/* Step 1 - Upload */}
        {step === 1 && (
          <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-6 mb-6">
            <label className="block w-full cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition ${preview ? 'border-teal-400/40' : 'border-slate-700 hover:border-teal-400/40'}`}>
                {preview ? (
                  <div>
                    <img src={preview} alt="Prescription" className="max-h-48 mx-auto rounded-lg mb-3 object-contain" />
                    <p className="text-teal-400 text-sm font-medium">Prescription uploaded ✓</p>
                    <p className="text-slate-500 text-xs mt-1">Click to change</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="text-slate-500 mx-auto mb-3" size={40} />
                    <p className="text-white font-medium mb-1">Click to upload prescription</p>
                    <p className="text-slate-500 text-xs">Supports JPG, PNG</p>
                    <p className="text-slate-600 text-xs mt-1">Works with printed prescriptions</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mt-4 border border-red-500/20">
                {error}
              </div>
            )}

            {file && (
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#070b16]/30 border-t-[#070b16] rounded-full animate-spin"></div>
                    Scanning prescription...
                  </span>
                ) : (
                  <>Scan Prescription <ArrowRight size={16} /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* Step 2 - Confirm Medicines */}
        {step === 2 && (
          <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-6 mb-6">

            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="text-teal-400" size={20} />
              <h2 className="text-white font-semibold">Verify Extracted Medicines</h2>
            </div>

            {/* Important guidance */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
              <div className="flex gap-2">
                <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 text-xs font-medium mb-1">Important — Please verify carefully!</p>
                  <p className="text-yellow-200/70 text-xs leading-relaxed">
                    OCR may extract extra text. <strong>Uncheck</strong> anything that is NOT a medicine name.
                    You can also <strong>edit</strong> wrong names or <strong>add</strong> missing medicines below.
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted medicines list */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {medicines.map((med, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-800/40 border border-slate-700 rounded-lg px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={confirmed.includes(med)}
                    onChange={() => toggleConfirm(med)}
                    className="accent-teal-400 w-4 h-4 shrink-0"
                  />
                  {editingIndex === i ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 bg-slate-700 border border-teal-400/30 rounded px-2 py-1 text-xs text-white outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(i)} className="text-teal-400 text-xs hover:text-teal-300">Save</button>
                      <button onClick={() => setEditingIndex(null)} className="text-slate-400 text-xs hover:text-red-400">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-white text-sm flex-1">{med}</span>
                      <button onClick={() => handleEdit(i)} className="text-slate-500 hover:text-teal-400 transition">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => removeMedicine(med)} className="text-slate-500 hover:text-red-400 transition">
                        <X size={13} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add missing medicine manually */}
            <div className="border-t border-slate-700 pt-4 mb-4">
              <p className="text-slate-400 text-xs mb-2">Missing a medicine? Add it manually:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMedicine}
                  onChange={(e) => setNewMedicine(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addManualMedicine()}
                  placeholder="e.g. Paracetamol 500mg"
                  className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-400 placeholder-slate-500"
                />
                <button
                  onClick={addManualMedicine}
                  className="bg-teal-400/20 hover:bg-teal-400/30 border border-teal-400/30 text-teal-400 px-3 rounded-lg transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Confirmed count */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-xs">
                {confirmed.length} of {medicines.length} medicines confirmed
              </span>
              <button
                onClick={() => setConfirmed([...medicines])}
                className="text-teal-400 text-xs hover:text-teal-300 transition"
              >
                Select all
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/20">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep(1); setError(''); }}
                className="flex-1 border border-slate-700 text-slate-300 py-2.5 rounded-lg text-sm hover:border-teal-400/30 transition"
              >
                Rescan
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition"
              >
                Find Pharmacies <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs leading-relaxed">
            💡 <span className="text-slate-300">Tip:</span> For best results, use clear well-lit photos of <span className="text-teal-400">printed prescriptions</span>. After scanning, always verify and correct medicine names before searching.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;