import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { uploadToCloudinary } from '../../utils/cloudinary';
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
  X,
  Sparkles
} from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Smartphones',
    brand: 'Prem Mobile',
    description: '',
    images: '',
    regularPrice: '',
    offerPrice: '',
    stock: '15',
    isActive: true,
    isOnSale: false,
    isBestSeller: false,
    isFeatured: false,
    isNew: false,
    tag: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    'Smartphones',
    'Earbuds',
    'Headphones',
    'Smartwatches',
    'Power Banks',
    'Chargers',
    'Mobile Covers',
    'Screen Protectors',
    'Speakers',
    'Accessories',
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
              category: p.category || 'Smartphones',
              brand: p.brand || 'Prem Mobile',
              description: p.description || '',
              images: Array.isArray(p.images) ? p.images.join(', ') : (p.image || ''),
              regularPrice: String(p.originalPrice || p.regularPrice || ''),
              offerPrice: String(p.offerPrice || p.price || ''),
              stock: String(p.stock !== undefined ? p.stock : '15'),
              isActive: Boolean(p.isActive),
              isOnSale: Boolean(p.isOnSale),
              isBestSeller: Boolean(p.isBestSeller),
              isFeatured: Boolean(p.isFeatured),
              isNew: Boolean(p.isNew),
              tag: p.tag || ''
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

  // 1. UPLOAD IMAGE(S) DIRECTLY TO CLOUDINARY (iuuqceor) OR API BACKEND
  const handleDeviceUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadFeedback(null);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          throw new Error(`"${file.name}" is too large. Select images under 15MB.`);
        }

        // Try direct Cloudinary upload first
        const cloudRes = await uploadToCloudinary(file);
        if (cloudRes.success && cloudRes.url) {
          uploadedUrls.push(cloudRes.url);
        } else {
          // Fallback to server API upload
          const reader = new FileReader();
          const dataUrl = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ images: [{ dataUrl, filename: file.name }] })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            const urls = data.urls || [data.url];
            uploadedUrls.push(...urls);
          } else {
            throw new Error(data.error || `Failed to upload "${file.name}".`);
          }
        }
      }

      // Merge into current image list
      const baseList = imageList.length === 1 && imageList[0] === '/images/prem-main.jpg'
        ? []
        : imageList;

      const updatedList = [...baseList, ...uploadedUrls];

      setFormData(prev => ({
        ...prev,
        images: updatedList.join(', ')
      }));

      setUploadFeedback({
        type: 'success',
        message: `Successfully uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} to Cloudinary!`
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
      images: updated.join(', ')
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

      const offerPriceNum = formData.offerPrice !== '' ? parseFloat(formData.offerPrice) : price;

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        description: formData.description.trim(),
        images: imgArray.length > 0 ? imgArray : ['/images/prem-main.jpg'],
        regularPrice: price,
        offerPrice: isNaN(offerPriceNum) ? price : offerPriceNum,
        stock: stock,
        isActive: formData.isActive,
        isOnSale: formData.isOnSale,
        isBestSeller: formData.isBestSeller,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        tag: formData.tag.trim()
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

      setSuccess(isEdit ? 'Product updated successfully in real time.' : 'New product created & published live!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 900);
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Link
          to="/admin/products"
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#E31B23]">
            {isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {isEdit ? `Edit: ${formData.name || 'Product'}` : 'Upload Product & Images'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Name <span className="text-[#E31B23]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB)"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] focus:bg-white text-sm font-medium transition-colors"
          />
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-[#E31B23]">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] text-sm font-bold transition-colors cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Samsung, boAt, Realme, Xiaomi"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] focus:bg-white text-sm font-medium transition-colors"
            />
          </div>
        </div>

        {/* ORIGINAL PRICE, OFFER SELLING PRICE & STOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Original / MRP Price (₹) <span className="text-[#E31B23]">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              name="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              placeholder="e.g. 1499"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] focus:bg-white text-sm font-bold transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Offer / Selling Price (₹)
              </label>
              {(() => {
                const reg = parseFloat(formData.regularPrice);
                const off = parseFloat(formData.offerPrice);
                if (reg > 0 && off > 0 && reg > off) {
                  const disc = Math.round(((reg - off) / reg) * 100);
                  return (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-[#E31B23] text-[10px] font-black uppercase">
                      -{disc}% OFF
                    </span>
                  );
                }
                return null;
              })()}
            </div>
            <input
              type="number"
              step="1"
              min="0"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleChange}
              placeholder="e.g. 999 (Leave empty for MRP)"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] focus:bg-white text-sm font-bold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Stock Quantity <span className="text-[#E31B23]">*</span>
            </label>
            <input
              type="number"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 15"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] focus:bg-white text-sm font-medium transition-colors"
            />
          </div>
        </div>

        {/* PRODUCT IMAGES WITH DIRECT CLOUDINARY UPLOAD */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#E31B23]" />
              <span>Product Photos & Gallery (Cloudinary Storage)</span>
            </label>
            
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {showUrlInput ? 'Hide Raw URL Input' : 'Paste Direct Image URLs'}
            </button>
          </div>

          {/* Upload Feedback */}
          {uploadFeedback && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
              uploadFeedback.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}>
              <span>{uploadFeedback.message}</span>
              <button
                type="button"
                onClick={() => setUploadFeedback(null)}
                className="text-slate-400 hover:text-slate-700"
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
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
              isUploading
                ? 'bg-amber-50 border-amber-400'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 hover:border-slate-400'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-3">
                <Loader2 className="w-8 h-8 text-[#E31B23] animate-spin" />
                <span className="text-xs font-bold text-[#E31B23]">
                  Uploading photos directly to Cloudinary (iuuqceor)...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#E31B23]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Click to select product photos from your device
                  </span>
                  <span className="text-xs text-slate-500">
                    Supports JPG, PNG, WEBP. Photos automatically upload to Cloudinary CDN.
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-1 px-4 py-2 rounded-xl bg-[#E31B23] hover:bg-[#c9141b] text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 fill-white" />
                  <span>CHOOSE PHOTOS FROM COMPUTER</span>
                </button>
              </div>
            )}
          </div>

          {/* Uploaded Images Gallery Previews */}
          {imageList.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 block">
                Attached Product Gallery ({imageList.length}) — First photo is used as primary thumbnail:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {imageList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-2xl border border-slate-200 bg-white overflow-hidden aspect-square flex items-center justify-center p-2 shadow-sm"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/prem-main.jpg';
                      }}
                      className="max-h-full max-w-full object-contain"
                    />

                    {/* Primary Badge */}
                    {idx === 0 ? (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#E31B23] text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>MAIN</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Set as Main Cover Photo"
                        className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded-md bg-slate-900/90 hover:bg-black text-white font-black text-[9px] uppercase tracking-wider transition-opacity border border-slate-700"
                      >
                        Set Main
                      </button>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove Photo"
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Direct URL Input field */}
          {showUrlInput && (
            <div className="pt-2 space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Raw Comma-Separated Image URLs
              </label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/iuuqceor/image/upload/sample.jpg"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#E31B23]"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Description & Features
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter key specs, warranty, features, and Pinto Park store availability details..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E31B23] focus:bg-white text-sm font-medium transition-colors"
          />
        </div>

        {/* BADGES & PROMOTIONAL FLAGS */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E31B23]" />
            <span>Product Badges & Curated Suggestions</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#E31B23] cursor-pointer"
              />
              <span>🔥 Mark On Sale</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#E31B23] cursor-pointer"
              />
              <span>🏆 Best Seller</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#E31B23] cursor-pointer"
              />
              <span>⭐ Top Featured</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer hover:border-slate-300">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#E31B23] cursor-pointer"
              />
              <span>✨ New Arrival</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Custom Tag / Badge Label (Optional)
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="e.g. Hot Deal, Super Saver, Limited Offer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#E31B23]"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded focus:ring-0 accent-[#E31B23] cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-900">Product is Active & visible in live store</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="px-6 py-3 rounded-2xl bg-[#E31B23] hover:bg-[#c9141b] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4 fill-white" />
            <span>{isLoading ? 'Publishing...' : 'SAVE & PUBLISH PRODUCT'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
