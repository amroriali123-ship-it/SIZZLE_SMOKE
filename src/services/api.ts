/**
 * SIZZLE & SMOKE - Client API Service
 * 
 * In full-stack mode: uses relative '/api'
 * In GitHub Pages mode: uses import.meta.env.VITE_API_URL or window.API_BASE_URL
 */

export const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).API_BASE_URL) ||
  import.meta.env.VITE_API_URL ||
  '/api';

export interface ApiMenuItem {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price_sar: number;
  price_usd: number;
  category: string;
  imageUrl: string;
  ingredients_en: string[];
  ingredients_ar: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  calories?: number;
  prepTime?: string;
  spiceLevel?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiCategory {
  id: string;
  name_en: string;
  name_ar: string;
  sortOrder: number;
}

export interface ApiSiteSettings {
  phone: string;
  email: string;
  address_en: string;
  address_ar: string;
  openingHours_en: string;
  openingHours_ar: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
}

export interface ApiStats {
  totalItems: number;
  availableItems: number;
  featuredItems: number;
  totalCategories: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
}

// Token management in localStorage
const TOKEN_KEY = 'sizzle_admin_jwt';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Generic fetch with error handling
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type for FormData uploads
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

// Public API
export const api = {
  // Public
  getMenu: async (category?: string): Promise<{ success: boolean; data: ApiMenuItem[] }> => {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return request<{ success: boolean; data: ApiMenuItem[] }>(`/menu${query}`);
  },

  getCategories: async (): Promise<{ success: boolean; data: ApiCategory[] }> => {
    return request<{ success: boolean; data: ApiCategory[] }>('/categories');
  },

  getSettings: async (): Promise<{ success: boolean; data: ApiSiteSettings }> => {
    return request<{ success: boolean; data: ApiSiteSettings }>('/settings');
  },

  getStats: async (): Promise<ApiStats> => {
    return request<ApiStats>('/stats');
  },

  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    const res = await request<{ success: boolean; token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    return res;
  },

  getMe: async (): Promise<{ user: AdminUser }> => {
    return request<{ user: AdminUser }>('/auth/me');
  },

  logout: () => {
    clearAuthToken();
  },

  // Admin CRUD - Menu Items
  getAdminMenu: async (): Promise<{ success: boolean; data: ApiMenuItem[] }> => {
    return request<{ success: boolean; data: ApiMenuItem[] }>('/admin/menu');
  },

  createMenuItem: async (item: Partial<ApiMenuItem>): Promise<{ success: boolean; data: ApiMenuItem }> => {
    return request<{ success: boolean; data: ApiMenuItem }>('/admin/menu', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  updateMenuItem: async (id: string, updates: Partial<ApiMenuItem>): Promise<{ success: boolean; data: ApiMenuItem }> => {
    return request<{ success: boolean; data: ApiMenuItem }>(`/admin/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteMenuItem: async (id: string): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/admin/menu/${id}`, {
      method: 'DELETE',
    });
  },

  toggleAvailable: async (id: string): Promise<{ success: boolean; data: ApiMenuItem }> => {
    return request<{ success: boolean; data: ApiMenuItem }>(`/admin/menu/${id}/toggle-available`, {
      method: 'PATCH',
    });
  },

  toggleFeatured: async (id: string): Promise<{ success: boolean; data: ApiMenuItem }> => {
    return request<{ success: boolean; data: ApiMenuItem }>(`/admin/menu/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  },

  // Admin CRUD - Categories
  getAdminCategories: async (): Promise<{ success: boolean; data: ApiCategory[] }> => {
    return request<{ success: boolean; data: ApiCategory[] }>('/admin/categories');
  },

  createCategory: async (category: Partial<ApiCategory>): Promise<{ success: boolean; data: ApiCategory }> => {
    return request<{ success: boolean; data: ApiCategory }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  updateCategory: async (id: string, updates: Partial<ApiCategory>): Promise<{ success: boolean; data: ApiCategory }> => {
    return request<{ success: boolean; data: ApiCategory }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Settings
  getAdminSettings: async (): Promise<{ success: boolean; data: ApiSiteSettings }> => {
    return request<{ success: boolean; data: ApiSiteSettings }>('/admin/settings');
  },

  updateAdminSettings: async (settings: Partial<ApiSiteSettings>): Promise<{ success: boolean; data: ApiSiteSettings }> => {
    return request<{ success: boolean; data: ApiSiteSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Upload
  uploadImage: async (file: File): Promise<{ success: boolean; imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ success: boolean; imageUrl: string }>('/admin/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Reset to seed
  resetSeedData: async (): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>('/admin/seed-reset', {
      method: 'POST',
    });
  },
};
