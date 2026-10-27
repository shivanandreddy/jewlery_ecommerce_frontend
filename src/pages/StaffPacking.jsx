import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PackageCheck, 
  Check, 
  Loader2, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function StaffPacking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};
  const { token } = useAuth() || {};

  const fetchPackingQueue = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/orders/packing-queue', config);
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching packing queue:', err);
      setError(err.response?.data?.message || 'Failed to load packing queue');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPackingQueue();
    }
  }, [token]);

  const handleMarkAsPacked = async (orderId) => {
    setProcessingId(orderId);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/pack`, {}, config);
      
      setSuccessMessage(`Order ${orderId} marked as packed and stock deducted successfully!`);
      setOrders(orders.filter(order => order._id !== orderId));
      setProcessingId(null);

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Packing error:', err);
      setError(err.response?.data?.message || 'Failed to update order status');
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <PackageCheck className={`w-7 h-7 ${themeConfig.text}`} /> Staff Packing Queue
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Verify customer orders, inspect physical stock items, and process fulfillment
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-4 py-2.5 rounded-xl">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            {orders.length} Pending Orders to Pack
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-2 shadow-sm">
          <Check className="w-5 h-5 flex-shrink-0" /> {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className={`w-8 h-8 animate-spin ${themeConfig.text}`} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Packing Queue is Clear!</h3>
          <p className="text-sm text-gray-400 mt-1">All customer orders have been successfully packed and fulfilled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-lg tracking-wider">
                    {order.order_id}
                  </span>
                  <span className="text-xs text-gray-400">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Customer</span>
                      <span className="font-semibold">{order.customer_details?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Phone</span>
                      <span className="font-semibold">{order.customer_details?.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 sm:col-span-3">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Shipping Address</span>
                      <span className="font-medium">{order.customer_details?.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Items to Pack:</h4>
                  <div className="space-y-2">
                    {order.ordered_items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-xl text-sm">
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {item.product_name} <span className="text-gray-400 font-normal">x {item.quantity}</span>
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ₹{(item.price_per_unit * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 pt-4 lg:pt-0 lg:pl-6 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Order Amount</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    ₹{order.total_amount?.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg">
                    Payment Verified (SUCCESS)
                  </span>
                </div>

                <button 
                  type="button"
                  disabled={processingId === order._id}
                  onClick={() => handleMarkAsPacked(order._id)}
                  className={`w-full py-3 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {processingId === order._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="w-4 h-4" /> Mark as Packed
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}