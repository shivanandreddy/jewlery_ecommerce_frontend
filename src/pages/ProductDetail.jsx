import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ShoppingBag, Check, ShieldCheck, 
  Truck, RefreshCw, Layers, Loader2, Play, Bell, BellRing 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import VideoPlayer from '../components/VideoPlayer';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [isNotifiedLoading, setIsNotifiedLoading] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};
  const { cart, addToCart } = useCart() || {};

  // Check if this product already exists in the global cart
  const isInCart = cart?.some(item => item._id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = response.data.product || response.data;
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleToggleNotify = async () => {
    try {
      setIsNotifiedLoading(true);
      const res = await axios.patch(`http://localhost:5000/api/products/${product._id}/notify`, {
        get_notified: !product.get_notified
      });
      if (res.data.success) {
        setProduct(prev => ({ ...prev, get_notified: res.data.product.get_notified }));
        setNotifySuccess(true);
        setTimeout(() => setNotifySuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating notification preference:', error);
    } finally {
      setIsNotifiedLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className={`w-10 h-10 animate-spin ${themeConfig.text}`} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 m-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Product Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The product you are looking for does not exist or was removed.</p>
        <button
          onClick={() => navigate('/shop')}
          className={`mt-6 px-5 py-2.5 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm transition`}
        >
          Back to Shop Catalog
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasVideo = Boolean(product.video_url);
  const totalMediaCount = images.length + (hasVideo ? 1 : 0);
  const isVideoSelected = hasVideo && activeMediaIndex === images.length;

  const handleAddToCart = () => {
    if (addToCart && product && !isInCart) {
      addToCart(product);
    }
    setIsAddedFeedback(true);
    const timer = setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* Gallery Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative bg-gray-50 dark:bg-slate-800/60 rounded-2xl h-80 sm:h-96 lg:h-[420px] flex items-center justify-center overflow-hidden border border-gray-200/60 dark:border-slate-700/60">
            {isVideoSelected ? (
              <div className="w-full h-full p-2 flex items-center justify-center bg-black">
                <VideoPlayer videoUrl={product.video_url} title={product.product_name} />
              </div>
            ) : images.length > 0 ? (
              <img src={images[activeMediaIndex]} alt={product.product_name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <Layers className="w-12 h-12 opacity-40" />
                <span className="text-sm font-medium">No Media Available</span>
              </div>
            )}
          </div>

          {totalMediaCount > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={`img-${index}`}
                  onClick={() => setActiveMediaIndex(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    !isVideoSelected && activeMediaIndex === index 
                      ? 'border-amber-500 ring-2 ring-amber-500/30 scale-95 shadow-md' 
                      : 'border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {hasVideo && (
                <button
                  onClick={() => setActiveMediaIndex(images.length)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-900 relative flex items-center justify-center ${
                    isVideoSelected 
                      ? 'border-amber-500 ring-2 ring-amber-500/30 scale-95 shadow-md' 
                      : 'border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-amber-400 fill-amber-400" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/60 px-1 rounded">VIDEO</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Information & Cart Actions Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {product.availability_status || 'In Stock'}
                </span>
                {product.stock_quantity > 0 && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> In Stock ({product.stock_quantity} units)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {product.product_name}
              </h1>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                ₹{product.sales_price?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Net Weight</span>
                <span className="text-base font-bold text-gray-800 dark:text-slate-200">{product.grams ? `${product.grams}g` : 'N/A'}</span>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Category</span>
                <span className="text-base font-bold text-gray-800 dark:text-slate-200">{product.category || 'General'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {product.description || 'Exquisitely handcrafted fine jewelry designed with precision craftsmanship.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600 dark:text-slate-400 pt-2">
              <div className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition ${product.certified ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' : 'bg-gray-50 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 opacity-60'}`}>
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span className="font-semibold">{product.certified ? '100% Certified' : 'Standard Quality'}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Insured Shipping</span>
              </div>
              <div className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition ${product.easy_exchange ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-gray-50 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 opacity-60'}`}>
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">{product.easy_exchange ? 'Easy Exchange' : 'Final Sale'}</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Action (Quantity selectors & buttons removed) */}
          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-4">
            {notifySuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" /> Successfully updated restock notification preferences!
              </div>
            )}

            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-4">
                <button 
                  key={isInCart ? 'in-cart' : 'not-in-cart'}
                  type="button"
                  onClick={handleAddToCart}
                  style={{
                    backgroundColor: (isInCart || isAddedFeedback) ? '#059669' : (
                      themeConfig?.bg?.includes('emerald') ? '#059669' : 
                      themeConfig?.bg?.includes('indigo') ? '#4f46e5' : 
                      themeConfig?.bg?.includes('rose') ? '#e11d48' : '#d97706'
                    )
                  }}
                  className="w-full py-4 px-6 rounded-2xl text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                >
                  {(isInCart || isAddedFeedback) ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  disabled
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold text-base cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Out of Stock
                </button>

                <button
                  onClick={handleToggleNotify}
                  disabled={isNotifiedLoading}
                  className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all ${
                    product.get_notified 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-black text-white border border-slate-700'
                  }`}
                >
                  {isNotifiedLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : product.get_notified ? (
                    <>
                      <BellRing className="w-5 h-5" /> Subscribed for Restock
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" /> Get Notified When Available
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}