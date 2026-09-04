/**
 * Prem Mobile - Laravel API Client Connector
 * Base URL: http://127.0.0.1:8000/api
 * Features: Automatic fallback to local store data when Laravel API server is offline.
 */

import { products } from '../data/products';
import { categories } from '../data/categories';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Fetch products from Laravel API or fallback to local dataset
 */
export async function fetchLaravelProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, source: 'laravel-api', data: data.data || data };
    }
  } catch (err) {
    // API server offline fallback
  }

  // Fallback to local products dataset
  let result = [...products];

  if (params.category && params.category !== 'all') {
    result = result.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }

  if (params.brand && params.brand !== 'all') {
    result = result.filter(p => p.brand.toLowerCase() === params.brand.toLowerCase());
  }

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  return { success: true, source: 'local-fallback', data: result };
}

/**
 * Fetch categories from Laravel API or fallback
 */
export async function fetchLaravelCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, source: 'laravel-api', data: data.data || data };
    }
  } catch (err) {
    // API server offline fallback
  }

  return { success: true, source: 'local-fallback', data: categories };
}

/**
 * Post order to Laravel API or fallback
 */
export async function postLaravelOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, source: 'laravel-api', order: data };
    }
  } catch (err) {
    // API server offline fallback
  }

  return {
    success: true,
    source: 'local-fallback',
    order: {
      id: `ORD-GWL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Store Pickup Reserved (Local)',
      ...orderData
    }
  };
}
