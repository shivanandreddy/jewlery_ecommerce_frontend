import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Boxes,
  PackageCheck,
  Settings,
  HelpCircle,
  ChevronDown,
  Users as UserGroup,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const accentStyles = {
  amber: {
    logoBg: 'bg-amber-600',
    activeNav: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    subText: 'text-amber-600 dark:text-amber-400 font-semibold',
    userFooter: 'bg-amber-600 dark:bg-slate-800/50',
    iconText: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500',
  },
  blue: {
    logoBg: 'bg-blue-600',
    activeNav: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    subText: 'text-blue-600 dark:text-blue-400 font-semibold',
    userFooter: 'bg-blue-600 dark:bg-slate-800/50',
    iconText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500',
  },
  emerald: {
    logoBg: 'bg-emerald-600',
    activeNav: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    subText: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    userFooter: 'bg-emerald-600 dark:bg-slate-800/50',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500',
  },
  rose: {
    logoBg: 'bg-rose-600',
    activeNav: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    subText: 'text-rose-600 dark:text-rose-400 font-semibold',
    userFooter: 'bg-rose-600 dark:bg-slate-800/50',
    iconText: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500',
  },
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { accentColor } = useTheme() || {};
  
  // Resolve active theme style mapping (defaulting to blue)
  const accent = accentStyles[accentColor] || accentStyles.blue;

  const [openSubmenus, setOpenSubmenus] = useState({
    AdminPortal: true,
  });

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && setIsOpen) {
      setIsOpen(false);
    }
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 dark:bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 dark:border-slate-800 bg-gray-200 dark:bg-slate-900 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className={`flex h-16 items-center justify-between border-b border-gray-300 dark:border-slate-800 px-5 transition-colors duration-200 ${accent.logoBg}`}>
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded bg-white font-bold ${accent.iconText}`}>
              J
            </div>
            <span className="text-lg font-semibold text-white">Jewelry Cart</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 mt-2 space-y-1">
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
            Workspace
          </p>

          {/* Shop Catalog */}
          <div className="mb-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive('/')
                  ? accent.activeNav
                  : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <Home size={18} />
              <span>Shop Catalog</span>
            </Link>
          </div>

          {/* Staff Packing Queue */}
          <div className="mb-1">
            <Link
              to="/staff/packing"
              onClick={handleLinkClick}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive('/staff/packing')
                  ? accent.activeNav
                  : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <PackageCheck size={18} />
              <span>Staff Packing Queue</span>
            </Link>
          </div>

          {/* Admin Portal Submenu */}
          <div className="mb-1">
            <button
              type="button"
              onClick={() => toggleSubmenu('AdminPortal')}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <Boxes size={18} />
                <span>Admin Portal</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                  openSubmenus['AdminPortal'] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubmenus['AdminPortal'] && (
              <div className={`ml-7 mt-1 space-y-1 border-l pl-2 dark:border-slate-800 ${accent.border}`}>
                <Link
                  to="/admin/inventory"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/admin/inventory')
                      ? accent.subText
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Stock & Inventory
                </Link>
                <Link
                  to="/admin/dashboard"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/admin/dashboard')
                      ? accent.subText
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Financial Analytics
                </Link>
                <Link
                  to="/admin/users"
                  onClick={handleLinkClick}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive('/admin/users')
                      ? accent.subText
                      : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Staff Management
                </Link>
              </div>
            )}
          </div>

          {/* Customers Management */}
          <div className="mb-1">
            <Link
              to="/customers"
              onClick={handleLinkClick}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive('/customers')
                  ? accent.activeNav
                  : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <UserGroup size={18} />
              <span>Customers Management</span>
            </Link>
          </div>

        </nav>

        {/* Bottom Utility Actions & Profile */}
        <div className="border-t border-gray-200 dark:border-slate-800 p-3">
          <Link
            to="/settings"
            onClick={handleLinkClick}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              isActive('/settings')
                ? accent.subText
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Settings size={18} />
            Settings
          </Link>

          <Link
            to="/help"
            onClick={handleLinkClick}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
              isActive('/help')
                ? accent.subText
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle size={18} />
            Help
          </Link>

          {/* User Profile Card */}
          <div className={`mt-3 flex items-center gap-3 rounded-md border border-transparent dark:border-slate-800 p-3 transition-colors duration-200 ${accent.userFooter}`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold shrink-0 ${accent.iconText}`}>
              <p className="capitalize">{user?.name ? user.name.charAt(0) : 'U'}</p>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white dark:text-slate-200 truncate capitalize">
                {user?.name || 'Unknown User'}
              </p>
              <p className="text-xs text-gray-200 dark:text-slate-400 truncate">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;