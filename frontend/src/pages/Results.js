import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, AlertCircle, XCircle, Navigation, ArrowLeft, Map, List } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState([13.0827, 80.2707]);
  const [view, setView] = useState('list');
  const navigate = useNavigate();
  const location = useLocation();
  const medicines = location.state?.medicines || [];

  useEffect(() => {
    if (medicines.length === 0) { navigate('/search'); return; }
    getUserLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          fetchResults(latitude, longitude);
        },
        () => fetchResults(13.0827, 80.2707)
      );
    } else {
      fetchResults(13.0827, 80.2707);
    }
  };

  const fetchResults = async (lat, lon) => {
    setLoading(true);
    try {
      const medicineParam = medicines.join(',');
      const response = await api.get(`/search/pharmacies?medicines=${medicineParam}&lat=${lat}&lon=${lon}&radius=10`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch pharmacy results.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (status) => {
    if (status === 'FULL') return greenIcon;
    if (status === 'PARTIAL') return yellowIcon;
    return redIcon;
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
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`);
  };

  const MediLogo = () => (
    <svg className="w-7 h-7 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
      <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#070b16] relative overflow-hidden px-4 py-8">
      <div className="absolute w-96 h-96 bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <MediLogo />
          <span className="text-lg font-extrabold text-white">Medifind</span>
        </div>
        <button onClick={() => navigate('/search')} className="flex items-center gap-1 text-slate-400 text-sm hover:text-white transition">
          <ArrowLeft size={16} /> Back
        </button>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-2">Nearby Pharmacies</h1>

        {/* Medicines searched */}
        <div className="flex flex-wrap gap-2 mb-4">
          {medicines.map((med, i) => (
            <span key={i} className="bg-teal-400/10 border border-teal-400/20 text-teal-300 text-xs px-3 py-1 rounded-full">{med}</span>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'list' ? 'bg-teal-400/20 text-teal-400 border border-teal-400/30' : 'text-slate-400 border border-slate-700 hover:border-teal-400/30'}`}
          >
            <List size={16} /> List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'map' ? 'bg-teal-400/20 text-teal-400 border border-teal-400/30' : 'text-slate-400 border border-slate-700 hover:border-teal-400/30'}`}
          >
            <Map size={16} /> Map View
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Finding nearby pharmacies...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-4 rounded-lg border border-red-500/20 mb-4">{error}</div>
        )}

        {/* MAP VIEW */}
        {!loading && view === 'map' && (
          <div className="rounded-xl overflow-hidden border border-slate-800 mb-6" style={{ height: '450px' }}>
            <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {results.map((pharmacy, i) => (
                <Marker
                  key={i}
                  position={[pharmacy.latitude, pharmacy.longitude]}
                  icon={getIcon(pharmacy.status)}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">{pharmacy.shopName}</p>
                      <p className="text-gray-600 text-xs">{pharmacy.address}</p>
                      <p className="text-gray-600 text-xs">{pharmacy.distanceKm} km away</p>
                      <p className="font-medium mt-1" style={{ color: pharmacy.status === 'FULL' ? 'green' : pharmacy.status === 'PARTIAL' ? 'orange' : 'red' }}>
                        {getStatusText(pharmacy.status)}
                      </p>
                      <p className="text-gray-600 text-xs">{pharmacy.availableMedicines}/{pharmacy.totalMedicines} medicines</p>
                      <button
                        onClick={() => openDirections(pharmacy.latitude, pharmacy.longitude)}
                        className="mt-2 bg-teal-500 text-white text-xs px-3 py-1 rounded-lg w-full"
                      >
                        Get Directions
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* LIST VIEW */}
        {!loading && view === 'list' && (
          <div className="space-y-4">
            {results.length === 0 && !error && (
              <div className="text-center py-20">
                <XCircle className="text-slate-600 mx-auto mb-3" size={48} />
                <p className="text-slate-400">No pharmacies found nearby.</p>
              </div>
            )}
            {results.map((pharmacy, i) => (
              <div key={i} className={`border rounded-xl p-5 transition ${getStatusBg(pharmacy.status)}`}>
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

                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium ${getStatusColor(pharmacy.status)}`}>
                    {getStatusText(pharmacy.status)}
                  </span>
                  <span className="text-slate-400 text-xs">{pharmacy.availableMedicines}/{pharmacy.totalMedicines} medicines</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${pharmacy.status === 'FULL' ? 'bg-emerald-400' : pharmacy.status === 'PARTIAL' ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${pharmacy.matchPercentage}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pharmacy.medicineStatuses.map((med, j) => (
                    <span key={j} className={`text-xs px-2 py-0.5 rounded-full border ${med.available ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                      {med.available ? '✓' : '✗'} {med.medicineName}
                      {med.available && med.price && ` ₹${med.price}`}
                    </span>
                  ))}
                </div>

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
        )}

        {/* Legend */}
        {!loading && results.length > 0 && (
          <div className="flex gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Full match</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> Partial</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span> Not available</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;