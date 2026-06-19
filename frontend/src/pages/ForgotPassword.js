import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setSuccess('OTP verified! Set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const MediLogo = () => (
    <svg className="w-7 h-7 text-teal-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
      <circle cx="68" cy="68" r="17" stroke="currentColor" strokeWidth="6" fill="#070b16"/>
      <line x1="79" y1="79" x2="92" y2="92" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b16] relative overflow-hidden px-4">

      <div className="absolute w-[600px] h-[600px] bg-teal-500/5 rounded-full -top-40 -right-40 blur-3xl"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full -bottom-32 -left-32 blur-3xl"></div>

      <div className="relative z-10 bg-[#0f1729]/80 backdrop-blur-xl border border-teal-500/10 rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-extrabold text-white">Medifind</h1>
            <div className="h-8 w-px bg-slate-600"></div>
            <MediLogo />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-2 h-2 rounded-full transition ${s === step ? 'bg-teal-400 w-6' : s < step ? 'bg-teal-400/50' : 'bg-slate-700'}`}></div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-white mt-2">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'New Password'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {step === 1 && 'Enter your email to receive OTP'}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && 'Set your new password'}
          </p>
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

        {/* Step 1 - Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-sm text-slate-200 font-medium mb-2 block">Email Address</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
                <Mail size={18} className="text-slate-500 mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* Step 2 - OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-sm text-slate-200 font-medium mb-2 block">Enter OTP</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
                <KeyRound size={18} className="text-slate-500 mr-2.5" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500 tracking-widest"
                  required
                />
              </div>
              <p className="text-slate-500 text-xs mt-2">Check your email inbox for the OTP</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
              {!loading && <ArrowRight size={16} />}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setSuccess(''); }}
              className="w-full flex items-center justify-center gap-1 text-slate-400 text-sm hover:text-white transition"
            >
              <ArrowLeft size={14} /> Change Email
            </button>
          </form>
        )}

        {/* Step 3 - New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-sm text-slate-200 font-medium mb-2 block">New Password</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
                <Lock size={18} className="text-slate-500 mr-2.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-200 font-medium mb-2 block">Confirm Password</label>
              <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 focus-within:border-teal-400 transition">
                <Lock size={18} className="text-slate-500 mr-2.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-slate-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[#070b16] font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-1 text-slate-400 text-sm hover:text-white transition mt-4"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;