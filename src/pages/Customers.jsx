import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users as UsersIcon, 
  Search, 
  Loader2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  X,
  UserCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [error, setError] = useState('');

  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/customers', {
        params: { search }
      });
      const data = response.data.customers || response.data || [];
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.message || 'Failed to load customers directory.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
      setSelectedCustomer(response.data.customer || response.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('Error fetching customer details:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <UsersIcon className={`w-7 h-7 ${themeConfig.text}`} /> Customers Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage registered store customers and Google OAuth accounts
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
          <UserCheck className={`w-4 h-4 ${themeConfig.text}`} />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Total Customers: {customers.length}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring} transition-colors`}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${themeConfig.text}`} />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <UsersIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No customers found</h3>
            <p className="text-sm text-gray-400 mt-1">Customers who sign in via Google OAuth will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone / Contact</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${themeConfig.bg} text-white font-bold flex items-center justify-center shrink-0`}>
                        {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-white block">{cust.name || 'Unnamed User'}</span>
                        <span className="text-xs text-gray-400">ID: {cust._id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {cust.email || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {cust.phone ? (
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {cust.phone}</span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Not Provided</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-xs">
                      {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        type="button"
                        onClick={() => handleViewDetails(cust._id)}
                        className={`px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:${themeConfig.bg} hover:text-white text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-colors`}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {isDetailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden shadow-2xl p-6 relative space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${themeConfig.text}`} /> Customer Profile Details
              </h3>
              <button 
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className={`w-14 h-14 rounded-full ${themeConfig.bg} text-white font-extrabold text-xl flex items-center justify-center shrink-0`}>
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Phone Number</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{selectedCustomer.phone || 'Not Provided'}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Account Created</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Registered Address</span>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
                  {selectedCustomer.address || 'No saved address on file.'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className={`px-5 py-2.5 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm`}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}