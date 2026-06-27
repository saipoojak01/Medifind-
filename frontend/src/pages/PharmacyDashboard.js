import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Edit, LogOut, X, Check } from 'lucide-react';
import api from '../utils/api';

function PharmacyDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newMedicine, setNewMedicine] = useState({
    name: '', brand: '', quantity: '', price: ''
  });
  const navigate = useNavigate();
  const shopName = localStorage.getItem('shopName');

  useEffect(() => {
    if (!localStorage.getItem('pharmacyToken')) {
      navigate('/pharmacy/login');
      return;
    }
    fetchMedicines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const id = localStorage.getItem('pharmacyId') || 1;
      const response = await api.get(`/medicines/pharmacy/${id}`);
      setMedicines(response.data);
    } catch (err) {
      setError('Failed to fetch medicines.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const id = localStorage.getItem('pharmacyId') || 1;
      await api.post(`/medicines/add/${id}`, {
        name: newMedicine.name,
        brand: newMedicine.brand,
        quantity: parseInt(newMedicine.quantity),
        price: parseFloat(newMedicine.price),
      });
      setSuccess('Medicine added successfully!');
      setNewMedicine({ name: '', brand: '', quantity: '', price: '' });
      setShowAddForm(false);
      fetchMedicines();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add medicine.');
    }
  };

  const handleUpdateStock = async (medicineId) => {
    try {
      await api.put(`/medicines/update/${medicineId}?quantity=${editQuantity}`);
      setEditingId(null);
      setEditQuantity('');
      fetchMedicines();
      setSuccess('Stock updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update stock.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pharmacyToken');
    localStorage.removeItem('shopName');
    localStorage.removeItem('pharmacyId');
    navigate('/pharmacy/login');
  };

  const MediLogo = () => (
    <svg className="w-7 h-7 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
      <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#070b16] px-4 py-8">
      <div className="absolute w-96 h-96 bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <MediLogo />
          <div>
            <span className="text-lg font-extrabold text-white">Medifind</span>
            <p className="text-xs text-teal-400">{shopName || 'Pharmacy Dashboard'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 text-sm hover:text-red-400 transition border border-slate-700 px-3 py-2 rounded-lg hover:border-red-400/30">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-teal-400">{medicines.length}</p>
            <p className="text-slate-400 text-xs mt-1">Total Medicines</p>
          </div>
          <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-emerald-400">{medicines.filter(m => m.quantity > 0).length}</p>
            <p className="text-slate-400 text-xs mt-1">In Stock</p>
          </div>
          <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-red-400">{medicines.filter(m => m.quantity === 0).length}</p>
            <p className="text-slate-400 text-xs mt-1">Out of Stock</p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-white">Medicine Inventory</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            <Plus size={16} /> Add Medicine
          </button>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-500/20">{error}</div>}
        {success && <div className="bg-emerald-500/10 text-emerald-400 text-sm p-3 rounded-lg mb-4 border border-emerald-500/20">{success}</div>}

        {/* Add Medicine Form */}
        {showAddForm && (
          <div className="bg-[#0f1729]/80 border border-teal-500/20 rounded-xl p-5 mb-6">
            <h3 className="text-white font-semibold mb-4">Add New Medicine</h3>
            <form onSubmit={handleAddMedicine} className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Medicine Name</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="e.g. Paracetamol"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Brand</label>
                <input
                  type="text"
                  value={newMedicine.brand}
                  onChange={(e) => setNewMedicine({ ...newMedicine, brand: e.target.value })}
                  placeholder="e.g. Calpol"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
                <input
                  type="number"
                  value={newMedicine.quantity}
                  onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })}
                  placeholder="Stock quantity"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                  placeholder="Price"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-400"
                  required
                />
              </div>
              <div className="col-span-2 flex gap-2 mt-1">
                <button type="submit" className="flex-1 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-2 rounded-lg text-sm hover:opacity-90 transition">
                  Add Medicine
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="border border-slate-700 text-slate-400 px-4 py-2 rounded-lg text-sm hover:border-red-400/30 hover:text-red-400 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medicine List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-20 bg-[#0f1729]/80 border border-slate-800 rounded-xl">
            <Package className="text-slate-600 mx-auto mb-3" size={48} />
            <p className="text-slate-400">No medicines added yet.</p>
            <p className="text-slate-600 text-sm mt-1">Click "Add Medicine" to get started!</p>
          </div>
        ) : (
          <div className="bg-[#0f1729]/80 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Medicine</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Brand</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Stock</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Price</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{med.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-400 text-sm">{med.brand}</p>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === med.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="w-16 bg-slate-800 border border-teal-400/30 rounded px-2 py-1 text-xs text-white outline-none"
                          />
                          <button onClick={() => handleUpdateStock(med.id)} className="text-teal-400 hover:text-teal-300">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-sm font-medium ${med.quantity > 10 ? 'text-emerald-400' : med.quantity > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {med.quantity} units
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300 text-sm">₹{med.price}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setEditingId(med.id); setEditQuantity(med.quantity.toString()); }}
                        className="text-teal-400 hover:text-teal-300 transition mr-2"
                      >
                        <Edit size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PharmacyDashboard;