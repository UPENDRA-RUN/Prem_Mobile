import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Package,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  Loader2,
  X
} from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Mobile Accessories',
    brand: 'Prem Mobile',
    description: '',
    images: '/images/prem-main.jpg',
    regularPrice: '',
    stock: '15',
    isActive: true,
    isFeatured: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    'Mobile Accessories',
    'Earbuds',
    'Headphones',
    'Chargers',
    'Cables',
    'Power Banks',
    'Mobile Covers',
    'Screen Protectors',
    'Speakers',
    'Smartwatches',
    'Adapters',
    'Gadgets'
  ];

  useEffect(() => {
    if (isEdit) {
      setIsLoading(true);
      fetch(`/api/products/${id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.product) {
            const p = data.product;
            setFormData({
              name: p.name || '',
              category: p.category || 'Mobile Accessories',
              brand: p.brand || 'Prem Mobile',
              description: p.description || '',
              images: Array.isArray(p.images) ? p.images.join(', ') : (p.image || '/images/prem-main.jpg'),
              regularPrice: String(p.regularPrice || ''),
              stock: String(p.stock !== undefined ? p.stock : '15'),
              isActive: Boolean(p.isActive),
              isFeatured: Boolean(p.isFeatured)
            });
          }
        })
        .catch(err => setError('Failed to load product for editing.'))
        .finally(() => setIsLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper to parse images from comma-separated string to clean array
  const imageList = formData.images
    ? formData.images.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // 1. UPLOAD IMAGE(S) FROM DEVICE
  const handleDeviceUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadFeedback(null);

    try {
      // Convert all selected files to base64 Data URLs
      const filePromises = files.map(file => {
        return new Promise((resolve, reject) => {
          // Client-side file size check (15MB limit)
          if (file.size > 15 * 1024 * 1024) {
            return reject(new Error(`"${file.name}" is too large. Please select images under 15MB.`));
          }
          const reader = new FileReader();
          reader.onload = () => resolve({ dataUrl: reader.result, filename: file.name });
          reader.onerror = () => reject(new Error(`Failed to read file "${file.name}".`));
          reader.readAsDataURL(file);
        });
      });

      const encodedImages = await Promise.all(filePromises);

      // Send to /api/upload
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ images: encodedImages })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload images from device.');
      }

      // If current list only had the default placeholder, replace it with the uploaded photo
      const baseList = imageList.length === 1 && imageList[0] === '/images/prem-main.jpg'
        ? []
        : imageList;

      const newUrls = data.urls || [data.url];
      const updatedList = [...baseList, ...newUrls];

      setFormData(prev => ({
        ...prev,
        images: updatedList.join(', ')
      }));

      setUploadFeedback({
        type: 'success',
        message: `Successfully uploaded ${newUrls.length} image${newUrls.length > 1 ? 's' : ''} from your device!`
      });
    } catch (err) {
      console.error('File upload error:', err);
      setUploadFeedback({ type: 'error', message: err.message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      images: updated.length > 0 ? updated.join(', ') : '/images/prem-main.jpg'
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    const selected = imageList[indexToPrimary];
    const rest = imageList.filter((_, idx) => idx !== indexToPrimary);
    setFormData(prev => ({
      ...prev,
      images: [selected, ...rest].join(', ')
    }));
  };

  // 2. FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required.');
      return;
    }
    const price = parseFloat(formData.regularPrice);
    if (isNaN(price) || price < 0) {
      setError('Price must be a valid positive number.');
      return;
    }
    const stock = parseInt(formData.stock, 10);
    if (isNaN(stock) || stock < 0) {
      setError('Stock cannot be negative.');
      return;
    }

    setIsLoading(true);

    try {
      const imgArray = formData.images
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        description: formData.description.trim(),
        images: imgArray.length > 0 ? imgArray : ['/images/prem-main.jpg'],
        regularPrice: price,
        stock: stock,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured ? 1 : 0
      };

      const url = isEdit ? `/api/products/${id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product.');
      }

      setSuccess(isEdit ? 'Product updated successfully.' : 'Product created successfully.');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </span>
          <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            {isEdit ? `Edit: ${formData.name || 'Product'}` : 'Create New Product'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Type-C Fast Charger 65W"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#050505] text-sm font-medium transition-colors"
          />
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#050505] text-sm font-semibold transition-colors"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. boAt, Realme, Prem Mobile"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#050505] text-sm font-medium transition-colors"
            />
          </div>
        </div>

        {/* Regular Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Regular Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              name="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              placeholder="e.g. 499"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#050505] text-sm font-bold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 15"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#050505] text-sm font-medium transition-colors"
            />
          </div>
        </div>

        {/* PRODUCT IMAGES WITH DIRECT DEVICE UPLOAD */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#e51b23]" />
              <span>Product Images</span>
            </label>
            
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              {showUrlInput ? 'Hide URL field' : 'Edit via URLs'}
            </button>
          </div>

          {/* Upload Feedback */}
          {uploadFeedback && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
              uploadFeedback.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}>
              <span>{uploadFeedback.message}</span>
              <button
                type="button"
                onClick={() => setUploadFeedback(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleDeviceUpload}
            className="hidden"
          />

          {/* Upload Drop Zone Box */}
          <div
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isUploading
                ? 'bg-amber-50/50 border-[#ffd000]'
                : 'bg-slate-50/80 hover:bg-slate-100 border-slate-300 hover:border-slate-400'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <span className="text-xs font-bold text-slate-700">
                  Uploading image from your device...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#e51b23]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Click to upload image from your device
                  </span>
                  <span className="text-xs text-slate-500">
                    Supports JPG, PNG, WEBP. You can select multiple images.
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-1 px-4 py-2 rounded-xl bg-[#050505] hover:bg-slate-800 text-[#ffd000] font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>CHOOSE FROM DEVICE</span>
                </button>
              </div>
            )}
          </div>

          {/* Uploaded Images Gallery Previews */}
          {imageList.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-500 block">
                Attached Images ({imageList.length}) — First image is used as primary thumbnail:
              </span>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {imageList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl border border-slate-200 bg-slate-50 overflow-hidden aspect-square flex items-center justify-center p-1.5 shadow-xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />

                    {/* Primary Badge */}
                    {idx === 0 ? (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-400 text-[#050505] font-black text-[9px] uppercase tracking-wider shadow-xs flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>MAIN</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Set as Main Product Image"
                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-[9px] uppercase tracking-wider transition-opacity"
                      >
                        Set Main
                      </button>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove Image"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-xs transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Direct URL Input field */}
          {showUrlInput && (
            <div className="pt-2 animate-fade-in space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Raw Comma-Separated URLs
              </label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="/images/products/boat-rockerz-255.jpg"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#050505]"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Key product specifications, warranty, features..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#050505] text-sm font-medium transition-colors"
          />
        </div>

        {/* Active & Featured Toggles */}
        <div className="pt-2 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-[#e51b23] rounded focus:ring-0 accent-[#e51b23] cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700">Product is Active & visible in store</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-[#ffd000] rounded focus:ring-0 accent-[#ffd000] cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <span>⭐ Mark as Featured Product</span>
              <span className="text-xs text-slate-400 font-normal">(Highlights on Homepage & Deals)</span>
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="px-6 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-200 text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'SAVE PRODUCT'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
