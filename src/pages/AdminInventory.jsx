import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { 
  Boxes, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { themeConfig = { bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' } } = useTheme() || {};
  const { token } = useAuth() || {};

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Array for multiple files
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    category: '',
    grams: '',
    purchase_price: '',
    sales_price: '',
    stock_quantity: '',
    supplier: '',
    video_url: '',
    availability_status: 'In Stock',
    get_notified: false,
    certified: false,
    easy_exchange: false,
    images: []
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/products`, {
        params: { search, page, limit: 15 }
      });
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleOpenModal = (product = null) => {
    setError('');
    setImageFiles([]);
    if (product) {
      setEditingProduct(product);
      setFormData({
        product_name: product.product_name || '',
        description: product.description || '',
        category: product.category || '',
        grams: product.grams || '',
        purchase_price: product.purchase_price || '',
        sales_price: product.sales_price || '',
        stock_quantity: product.stock_quantity || '',
        supplier: product.supplier || '',
        video_url: product.video_url || '',
        availability_status: product.availability_status || 'In Stock',
        get_notified: product.get_notified || false,
        certified: product.certified || false,
        easy_exchange: product.easy_exchange || false,
        images: product.images || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        product_name: '',
        description: '',
        category: '',
        grams: '',
        purchase_price: '',
        sales_price: '',
        stock_quantity: '',
        supplier: '',
        video_url: '',
        availability_status: 'In Stock',
        get_notified: false,
        certified: false,
        easy_exchange: false,
        images: []
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let currentImages = formData.images || [];

      // Loop through all selected image files and upload them one by one
      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          const uploadFormData = new FormData();
          uploadFormData.append('image', file);

          const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadFormData, {
            headers: {
              ...config.headers,
              'Content-Type': 'multipart/form-data'
            }
          });

          if (uploadRes.data && uploadRes.data.success) {
            currentImages.push(uploadRes.data.url);
          }
        }
      }

      const payload = {
        ...formData,
        images: currentImages
      };

      // Save or update product in MongoDB
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, payload, config);
        setSuccessMessage('Product updated successfully!');
      } else {
        await axios.post(`http://localhost:5000/api/products`, payload, config);
        setSuccessMessage('Product created successfully!');
      }

      setIsModalOpen(false);
      setImageFiles([]);
      fetchInventory();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this jewelry item?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      setSuccessMessage('Product deleted successfully!');
      fetchInventory();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Boxes className={`w-7 h-7 ${themeConfig.text}`} /> Stock & Inventory Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage catalog items, pricing, stock levels, and supplier data</p>
        </div>

        <button 
          type="button"
          onClick={() => handleOpenModal()}
          className={`px-5 py-2.5 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-5 h-5" /> {successMessage}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input 
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name..."
            className={`w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring} transition-colors`}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${themeConfig.text}`} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Boxes className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No inventory found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Purchase / Sales Price</th>
                  <th className="p-4">Stock & Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={item.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.product_name} 
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50"
                      />
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-white block">{item.product_name}</span>
                        <span className="block text-xs font-normal text-gray-400">Supplier: {item.supplier || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{item.grams}g</td>
                    <td className="p-4">
                      <span className="text-xs text-gray-400 block">P: ₹{item.purchase_price?.toLocaleString('en-IN') || 0}</span>
                      <span className="font-bold text-gray-900 dark:text-white">S: ₹{item.sales_price?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.stock_quantity > 0 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      }`}>
                        {item.stock_quantity} units
                      </span>
                      <span className="block text-[11px] text-gray-500 font-medium">Status: {item.availability_status || 'In Stock'}</span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-xl transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-600 dark:text-gray-300 hover:text-red-600 rounded-xl transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-2">
          <button 
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button 
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-modal-title"
            className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 id="inventory-modal-title" className="text-lg font-bold text-gray-800 dark:text-white">
                {editingProduct ? 'Edit Jewelry Item' : 'Add New Jewelry Item'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.product_name}
                    onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Add Product Image Files (Multiple)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                  />
                  
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-gray-400 mb-1.5 block">Existing Images ({formData.images.length}):</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((imgUrl, index) => (
                          <div key={index} className="relative group">
                            <img src={imgUrl} alt={`Product preview ${index}`} className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedImages = formData.images.filter((_, i) => i !== index);
                                setFormData({...formData, images: updatedImages});
                              }}
                              className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 text-xs shadow hover:bg-red-700"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Product Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter detailed description for jewelry piece..."
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Category</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g. Necklace, Ring"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Supplier</label>
                  <input 
                    type="text" 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Supplier name"
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Weight (Grams)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.grams}
                    onChange={(e) => setFormData({...formData, grams: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Purchase Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Sales Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.sales_price}
                    onChange={(e) => setFormData({...formData, sales_price: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Availability Status</label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) => setFormData({...formData, availability_status: e.target.value})}
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>

                <div className="flex items-center gap-6 pt-4 md:col-span-2 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input 
                      type="checkbox"
                      checked={formData.get_notified}
                      onChange={(e) => setFormData({...formData, get_notified: e.target.checked})}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    Enable Get Notified (Restock Alert)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input 
                      type="checkbox"
                      checked={formData.certified}
                      onChange={(e) => setFormData({...formData, certified: e.target.checked})}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    Certified (100% Hallmark)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input 
                      type="checkbox"
                      checked={formData.easy_exchange}
                      onChange={(e) => setFormData({...formData, easy_exchange: e.target.checked})}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    Easy Exchange Eligible
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">YouTube Video Showcase URL</label>
                  <input 
                    type="text" 
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 ${themeConfig.ring}`}
                  />

                  {formData.video_url && (
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-gray-400 mb-1.5 block">Live Video Preview:</span>
                      <VideoPlayer videoUrl={formData.video_url} />
                    </div>
                  )}
                </div>
              </div>

              {/* Normal End Buttons Container */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2.5 ${themeConfig.bg} text-white font-semibold rounded-xl text-sm ${themeConfig.hover} transition-colors shadow-sm`}
                >
                  {editingProduct ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}