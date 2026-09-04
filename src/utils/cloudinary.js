/**
 * Cloudinary Utility Helper for Prem Mobile
 */

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

export const CLOUDINARY_CONFIG = {
  cloudName: env.VITE_CLOUDINARY_CLOUD_NAME || 'iuuqceor',
  apiKey: env.VITE_CLOUDINARY_API_KEY || '546736928497622',
  uploadPreset: env.VITE_CLOUDINARY_UPLOAD_PRESET || 'prem_mobile_preset'
};

/**
 * Generate an optimized Cloudinary image URL with auto-format and compression
 * @param {string} publicIdOrUrl - Cloudinary public_id or existing URL
 * @param {object} options - { width, height, crop, quality }
 */
export function getCloudinaryUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return '';

  // If it's already a full HTTP URL (not on Cloudinary), return as is
  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
    if (!publicIdOrUrl.includes('cloudinary.com')) {
      return publicIdOrUrl;
    }
  }

  // If it's a relative path (e.g. /images/photo.jpg), return as is
  if (publicIdOrUrl.startsWith('/')) {
    return publicIdOrUrl;
  }

  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  // Extract public ID if full URL passed
  let publicId = publicIdOrUrl;
  if (publicId.includes('/upload/')) {
    publicId = publicId.split('/upload/')[1].replace(/^v\d+\//, '');
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Client-side unsigned upload helper to Cloudinary
 * @param {File|Blob} file 
 * @param {string} uploadPreset 
 */
export async function uploadToCloudinary(file, uploadPreset = CLOUDINARY_CONFIG.uploadPreset) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (res.ok) {
      const data = await res.json();
      return { success: true, url: data.secure_url, publicId: data.public_id };
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn('Cloudinary upload response:', res.status, errData);
      return {
        success: false,
        error: errData.error?.message || `Cloudinary returned HTTP status ${res.status}`
      };
    }
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return { success: false, error: err.message || 'Cloudinary network request failed' };
  }
}
