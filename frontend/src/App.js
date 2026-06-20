import React from 'react';
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

function App() {
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
