import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, AlertCircle, XCircle, Navigation, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const medicines = location.state?.medicines || [];

  useEffect(() => {
    if (medicines.length === 0) {
      navigate('/search');
      return;
    }
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
          fetchResults(latitude, longitude);
        },
        () => {
          // Default to Chennai if location denied
          fetchResults(13.0827, 80.2707);
        }
      );
    } else {
      fetchResults(13.0827, 80.2707);
    }
  };

  const fetchResults = async (lat, lon) => {
    setLoading(true);
    try {
      const medicineParam = medicines.join(',');
      const response = await api.get(
        `/search/pharmacies?medicines=${medicineParam}&lat=${lat}&lon=${lon}&radius=10`
      );
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch pharmacy results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'FULL') return 'text-emerald-400';
    if (status === 'PARTIAL') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBg = (status) => {
    if (status === 'FULL') return 'border-emerald-500/30 bg-emerald-500/5';
    if (status === 'PARTIAL') return 'border-yellow-500/30 bg-yellow-500/5';
    return 'border-red-500/30 bg-red-500/5';
  };

  const getStatusIcon = (status) => {
    if (status === 'FULL') return <CheckCircle size={20} className="text-emerald-400" />;
    if (status === 'PARTIAL') return <AlertCircle size={20} className="text-yellow-400" />;
    return <XCircle size={20} className="text-red-400" />;
  };

  const getStatusText = (status) => {
    if (status === 'FULL') return 'Complete Match ✅';
    if (status === 'PARTIAL') return 'Partial Match ⚠️';
    return 'Not Available ❌';
  };

  const openDirections = (lat, lon, name) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_name=${name}`);
  };

  return (
    <div className="min-h-screen bg-[#070b16] relative overflow-hidden px-4 py-8">

      <div className="absolute w-[600px] h-[600px] bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full -bottom-32 -left-32 blur-3xl"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <svg className="w-7 h-7 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
            <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
            <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-extrabold text-white">Medifind</span>
        </div>
        <button onClick={() => navigate('/search')} className="flex items-center gap-1 text-slate-400 text-sm hover:text-white transition">
          <ArrowLeft size={16} /> Back
        </button>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto">

        <h1 className="text-3xl font-extrabold text-white mb-2">Nearby Pharmacies</h1>

        {/* Medicines searched */}
        <div className="flex flex-wrap gap-2 mb-6">
          {medicines.map((med, i) => (
            <span key={i} className="bg-teal-400/10 border border-teal-400/20 text-teal-300 text-xs px-3 py-1 rounded-full">
              {med}
            </span>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Finding nearby pharmacies...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-4 rounded-lg border border-red-500/20 mb-4">
            {error}
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="text-center py-20">
            <XCircle className="text-slate-600 mx-auto mb-3" size={48} />
            <p className="text-slate-400">No pharmacies found nearby.</p>
            <p className="text-slate-600 text-sm mt-1">Try increasing the search radius.</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map((pharmacy, i) => (
            <div key={i} className={`border rounded-xl p-5 transition ${getStatusBg(pharmacy.status)}`}>

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(pharmacy.status)}
                  <div>
                    <h3 className="text-white font-semibold">{pharmacy.shopName}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                      <MapPin size={12} />
                      <span>{pharmacy.address}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pharmacy.status === 'FULL' ? 'bg-emerald-500/20 text-emerald-400' : pharmacy.status === 'PARTIAL' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                  {pharmacy.distanceKm} km
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${getStatusColor(pharmacy.status)}`}>
                  {getStatusText(pharmacy.status)}
                </span>
                <span className="text-slate-400 text-xs">
                  {pharmacy.availableMedicines}/{pharmacy.totalMedicines} medicines
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                <div
                  className={`h-1.5 rounded-full ${pharmacy.status === 'FULL' ? 'bg-emerald-400' : pharmacy.status === 'PARTIAL' ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${pharmacy.matchPercentage}%` }}
                ></div>
              </div>

              {/* Medicine breakdown */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {pharmacy.medicineStatuses.map((med, j) => (
                  <span key={j} className={`text-xs px-2 py-0.5 rounded-full border ${med.available ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                    {med.available ? '✓' : '✗'} {med.medicineName}
                    {med.available && med.price && ` ₹${med.price}`}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a href={`tel:${pharmacy.phone}`} className="flex items-center gap-1.5 border border-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg hover:border-teal-400/30 transition">
                  <Phone size={13} /> {pharmacy.phone}
                </a>
                <button
                  onClick={() => openDirections(pharmacy.latitude, pharmacy.longitude, pharmacy.shopName)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold text-xs px-3 py-2 rounded-lg hover:opacity-90 transition ml-auto"
                >
                  <Navigation size={13} /> Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;