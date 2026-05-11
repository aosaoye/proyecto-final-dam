// CHANGE THIS TO YOUR RENDER PRODUCTION BACKEND URL (e.g., https://tu-servidor.onrender.com)
const PRODUCTION_API_URL = 'TU_URL_DE_RENDER_AQUI'; 

const IS_PRODUCTION = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

export const BASE_IMAGE_URL = IS_PRODUCTION && PRODUCTION_API_URL !== 'TU_URL_DE_RENDER_AQUI'
    ? PRODUCTION_API_URL 
    : `http://${window.location.hostname}:5000`;

export const API_BASE_URL = `${BASE_IMAGE_URL}/api`;

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const api = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders()
        });
        return this.handleResponse(response);
    },
    async post(endpoint, body, isMultipart = false) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(isMultipart),
            body: isMultipart ? body : JSON.stringify(body)
        });
        return this.handleResponse(response);
    },
    async put(endpoint, body, isMultipart = false) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(isMultipart),
            body: isMultipart ? body : JSON.stringify(body)
        });
        return this.handleResponse(response);
    },
    async delete(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return this.handleResponse(response);
    },
    async handleResponse(response) {
        if (response.status === 401 || response.status === 403) {
             // Handle token expiration/unauthorized
             // localStorage.removeItem('token');
             // window.location.href = '/pages/auth/login.html';
        }
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        if (response.status === 204) return null;
        return response.json();
    }
};

export const authService = {
    async login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },
    async register(userData) {
        return api.post('/auth/register', userData);
    },
    async requestPasswordReset(email) {
        return api.post('/auth/request-reset', { email });
    },
    async confirmPasswordReset(token, newPassword) {
        return api.post('/auth/reset-password', { token, newPassword });
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },
    isAuthenticated() {
        return !!this.getCurrentUser() && !!localStorage.getItem('token');
    },
    getAllUsers() {
        return api.get('/auth/users');
    }
};

export const productService = {
    getAll() {
        return api.get('/products');
    },
    getById(id) {
        return api.get(`/products/${id}`);
    },
    create(formData) {
        return api.post('/products', formData, true);
    },
    update(id, formData) {
        return api.put(`/products/${id}`, formData, true);
    },
    delete(id) {
        return api.delete(`/products/${id}`);
    }
};

export const cartService = {
    getCart() {
        return api.get('/cart');
    },
    async addToCart(productId, quantity) {
        const res = await api.post('/cart/items', { productId, quantity });
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return res;
    },
    addItem(productId, quantity) {
        return this.addToCart(productId, quantity);
    },
    async removeFromCart(productId) {
        const res = await api.delete(`/cart/items/${productId}`);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return res;
    }
};

export const orderService = {
    create() {
        return api.post('/orders', {});
    },
    getAll() {
        return api.get('/orders');
    },
    getMyOrders() {
        return api.get('/orders/my');
    }
};
