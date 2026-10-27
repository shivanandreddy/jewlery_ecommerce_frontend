import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function CartCheckout() {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        customer_details: customerDetails,
        ordered_items: cart.map(item => ({
          product_id: item._id,
          product_name: item.product_name,
          quantity: item.quantity,
          price_per_unit: item.sales_price
        })),
        total_amount: totalAmount,
        payment_details: {
          status: 'SUCCESS' // Simulated payment gateway success confirmation
        }
      };

      const response = await axios.post('http://localhost:5000/api/orders', payload);
      setOrderSuccess(response.data.order);
      clearCart();
      setLoading(false);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Placed Successfully!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Thank you for shopping with KaratFlow. Your order reference ID is:
        </p>
        <div className="my-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl font-mono font-bold text-amber-600 dark:text-amber-400 text-lg">
          {orderSuccess.order_id}
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Our staff has received your order in the packing queue and is preparing your jewelry items.
        </p>
        <Link 
          to="/"
          className={`inline-flex items-center gap-2 px-6 py-3 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm`}
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ShoppingBag className={`w-7 h-7 ${themeConfig.text}`} /> Shopping Cart & Secure Checkout
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review your selected jewelry pieces and complete your shipping details</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</h3>
          <p className="text-sm text-gray-400 mt-1 mb-6">Explore our catalog and add items to your cart.</p>
          <Link 
            to="/" 
            className={`inline-flex items-center gap-2 px-5 py-2.5 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm`}
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                Cart Items ({cart.length})
              </h2>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cart.map((item) => (
                  <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-base">{item.product_name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Weight: {item.grams}g</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        ₹{item.sales_price?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-gray-800 dark:text-white">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                Shipping & Customer Details
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    placeholder="Ananya Sharma"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    placeholder="+91 9876543210"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Delivery Address</label>
                  <textarea 
                    required
                    rows="3"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    placeholder="Street, City, State, Pincode"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-4 py-3.5 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Place Secure Order</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}