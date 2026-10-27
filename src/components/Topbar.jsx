import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {
  Menu,
  X,
  Bell,
  UserCircle,
  Sun,
  Moon,
  LogOut,
  Settings,
  ShoppingBag,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import CartModal from '../pages/CartModal';

const Topbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, themeConfig } = useTheme() || {};
  const { cart } = useCart() || { cart: [] };

  const activeTheme = themeConfig || { 
    bg: 'bg-amber-600', 
    text: 'text-amber-600', 
    ring: 'focus:ring-amber-500' 
  };

  // Load Customer Info from localStorage on mount
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customerInfo');
    if (storedCustomer) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch (err) {
        console.error('Error parsing customer info:', err);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTheme = () => {
    if (toggleDarkMode) toggleDarkMode();
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/customers/google-login', {
        token: credentialResponse.credential,
      });

      if (res.data.success) {
        localStorage.setItem('customerToken', res.data.token);
        localStorage.setItem('customerInfo', JSON.stringify(res.data.customer));
        setCustomer(res.data.customer);
        alert(`Welcome, ${res.data.customer.name}!`);
      }
    } catch (error) {
      console.error('Google Auth Failed:', error);
      alert('Google Sign-In failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      if (logout) await logout();
      
      // Clear both Admin and Customer auth tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerInfo');
      setCustomer(null);
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const activeUser = customer || user;

  return (
    <>
      <header className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 dark:border-white/10 px-4 transition-colors duration-200 ${activeTheme.bg} text-white`}>
        {/* Left section: Sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-black/10 transition"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Right section: Actions, Google Login & Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
            className="relative rounded-md p-2 hover:bg-black/10 transition flex items-center gap-1"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-amber-700 text-[10px] font-bold shadow-md">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle Theme"
            className="rounded-md p-2 hover:bg-black/10 transition"
          >
            {darkMode ? (
              <Sun size={20} className="text-amber-300" />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <button type="button" className="relative rounded-md p-2 hover:bg-black/10 transition">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Google Sign-In OR Profile Dropdown */}
          {!activeUser ? (
            <div className="flex items-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Google Login Failed')}
                shape="pill"
                size="medium"
                text="signin_with"
              />
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="rounded-full p-0.5 hover:ring-2 hover:ring-white/50 transition flex items-center gap-2"
              >
                {activeUser?.avatar ? (
                  <img 
                    src={activeUser.avatar} 
                    alt={activeUser.name} 
                    className="w-8 h-8 rounded-full object-cover border border-white/40"
                  />
                ) : (
                  <UserCircle size={28} />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-2 z-50 text-gray-800 dark:text-slate-100">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-sm font-semibold capitalize">
                      {activeUser?.name || 'Account Holder'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {activeUser?.email || 'user@example.com'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <div className="border-t border-gray-100 dark:border-slate-700 my-1" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition font-medium"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Cart Slide-Over Modal Drawer */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Topbar;