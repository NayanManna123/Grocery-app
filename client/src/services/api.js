const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('freshcart_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Auth
export const authAPI = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
};

// Products
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),
};

// Cart
export const cartAPI = {
  get: () => request('/cart'),
  addItem: (productId, quantity = 1) =>
    request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateQuantity: (productId, quantity) =>
    request(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeItem: (productId) =>
    request(`/cart/${productId}`, { method: 'DELETE' }),
  clear: () => request('/cart', { method: 'DELETE' }),
};

// Orders
export const ordersAPI = {
  place: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
};
