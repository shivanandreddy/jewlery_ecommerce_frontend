import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Loader2, Video, Image as ImageIcon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import VideoPlayer from '../components/VideoPlayer';

export default function ShopCatalog() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Video Modal State
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  // Fallback safe themeConfig
  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};

  // Fetch products from backend API (Filtered to only show In Stock items)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products`, {
          params: { 
            search, 
            category, 
            availability: 'In Stock', 
            page, 
            limit: 12 
          }
        });
        
        const fetchedProducts = response.data.products || [];
        const inStockOnly = fetchedProducts.filter(item => item.stock_quantity > 0);

        setProducts(inStockOnly);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, category, page]);

  return (
    <div className="space-y-6 animate-fadeIn duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent px-5 py-3 md:px-10 md:py-6 transition-all">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Jewelry Collection</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explore our exclusive handcrafted gold and diamond catalog</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72 transform transition-all duration-300 focus-within:scale-[1.02]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 transition-colors" />
            <input 
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search jewelry items..."
              className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring} transition-all shadow-sm`}
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className={`w-8 h-8 animate-spin ${themeConfig.text}`} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No available jewelry items found</h3>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search query or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product._id} 
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ animationDelay: `${index * 50}ms` }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group animate-fadeIn"
            >
              {/* Product Image / Media Header */}
              <div className="relative bg-gray-100 dark:bg-gray-800 h-52 flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center gap-1">
                    <ImageIcon className="w-8 h-8 opacity-40 animate-pulse" />
                    <span className="text-xs font-medium">Image Preview</span>
                  </div>
                )}

                {/* Video Badge Button */}
                {product.video_url && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideoUrl(product.video_url);
                      setActiveVideoTitle(product.product_name);
                    }}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all transform hover:scale-105 shadow-md"
                    title="Watch YouTube Showcase Video"
                  >
                    <Video className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> Watch Video
                  </button>
                )}

                <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                  {product.category || 'General'}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span>Weight: <b>{product.grams}g</b></span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">In Stock ({product.stock_quantity})</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Price</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{product.sales_price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-4 animate-fadeIn">
          <button 
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all transform hover:-translate-x-0.5 shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-2">
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all transform hover:translate-x-0.5 shadow-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* YouTube Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl overflow-hidden p-6 shadow-2xl relative transform animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {activeVideoTitle} - Video Showcase
              </h3>
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl bg-gray-100 dark:bg-gray-800 transition-all hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <VideoPlayer videoUrl={activeVideoUrl} title={activeVideoTitle} />
          </div>
        </div>
      )}
    </div>
  );
}