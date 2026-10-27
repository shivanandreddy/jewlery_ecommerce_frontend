import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
          status: 'SUCCESS'
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

  const handleCloseModal = () => {
    setOrderSuccess(null);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col transition-all border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-hidden transform animate-scaleUp">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ShoppingBag className={`w-5 h-5 ${themeConfig.text}`} /> 
            {orderSuccess ? 'Order Confirmed' : isCheckingOut ? 'Secure Checkout' : `Shopping Cart (${cart.length})`}
          </h2>
          <button 
            type="button"
            onClick={handleCloseModal}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl bg-gray-100 dark:bg-gray-800 transition-all hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderSuccess ? (
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto transform animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order Placed Successfully!</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your order reference ID is:
              </p>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl font-mono font-bold text-amber-600 dark:text-amber-400 text-sm shadow-inner">
                {orderSuccess.order_id}
              </div>
              <p className="text-xs text-gray-400">
                Our staff has received your order and is preparing your jewelry items.
              </p>
              <button 
                type="button"
                onClick={handleCloseModal}
                className={`w-full py-3 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-all transform hover:scale-[1.02] shadow-md`}
              >
                Close & Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 animate-pulse">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</h3>
              <p className="text-xs text-gray-400 mt-1">Explore our catalog and add items to your cart.</p>
            </div>
          ) : !isCheckingOut ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cart.map((item) => (
                  <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">{item.product_name}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Weight: {item.grams}g</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">
                        ₹{item.sales_price?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-sm">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-800 dark:text-white">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-all transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckout} id="checkout-form" className="space-y-4 animate-fadeIn">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                  placeholder="Ananya Sharma"
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring} transition-all`}
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
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring} transition-all`}
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
                  className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring} transition-all`}
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Summary & Actions */}
        {!orderSuccess && cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Insured Shipping</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {!isCheckingOut ? (
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsCheckingOut(true)}
                  className={`w-full py-3 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2`}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className={`flex-1 py-3 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-all transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Place Order</>}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}