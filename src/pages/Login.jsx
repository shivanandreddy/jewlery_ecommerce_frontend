import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth() || {};
  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (login) {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className={`${themeConfig.bg} text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-md`}>
            KF
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to KaratFlow</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to your staff or admin portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@karatflow.com"
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${themeConfig.ring} focus:bg-slate-800 transition-colors`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${themeConfig.ring} focus:bg-slate-800 transition-colors`}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-2 py-3 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}