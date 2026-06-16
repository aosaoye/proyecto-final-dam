// CHANGE THIS TO YOUR RENDER PRODUCTION BACKEND URL (e.g., https://tu-servidor.onrender.com)
const PRODUCTION_API_URL = 'https://proyecto-final-dam-backend.onrender.com';

const IS_PRODUCTION = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

export const BASE_IMAGE_URL = IS_PRODUCTION 
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
    async googleAuth(idToken) {
        const data = await api.post('/auth/google', { idToken });
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
    async getAll() {
        try {
            return await api.get('/products');
        } catch (error) {
            console.warn("API products call failed, falling back to static productsData:", error);
            // If window.productsData is not defined yet, try to load it from localStorage or return an empty array
            return window.productsData || [];
        }
    },
    async getById(id) {
        try {
            return await api.get(`/products/${id}`);
        } catch (error) {
            console.warn(`API product detail call for ID ${id} failed, falling back to static productsData:`, error);
            const localList = window.productsData || [];
            const found = localList.find(p => String(p.id) === String(id));
            if (found) return found;
            throw error;
        }
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

// Local helpers to manage offline cart and orders inside localStorage
function getLocalCart() {
    let local = localStorage.getItem('arkwood_cart');
    if (!local) {
        local = JSON.stringify({ items: [], totalPrice: 0 });
        localStorage.setItem('arkwood_cart', local);
    }
    return JSON.parse(local);
}

function saveLocalCart(cart) {
    let total = 0;
    cart.items.forEach(item => {
        const p = item.product || {};
        const parsedPrice = typeof p.price === 'string'
            ? parseFloat(p.price.replace(/[^0-9.]/g, ''))
            : Number(p.price || 0);
        total += parsedPrice * (item.quantity || 0);
    });
    cart.totalPrice = total;
    localStorage.setItem('arkwood_cart', JSON.stringify(cart));
}

export const cartService = {
    async getCart() {
        try {
            return await api.get('/cart');
        } catch (error) {
            console.warn("API getCart failed, falling back to localStorage:", error);
            return getLocalCart();
        }
    },
    async addToCart(productId, quantity) {
        try {
            const res = await api.post('/cart/items', { productId, quantity });
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return res;
        } catch (error) {
            console.warn("API addToCart failed, falling back to localStorage:", error);
            const cart = getLocalCart();
            const allProds = window.productsData || [];
            const prod = allProds.find(p => String(p.id) === String(productId));
            if (!prod) throw new Error("Product not found in static database");
            
            const existing = cart.items.find(item => String(item.product ? item.product.id : item.productId) === String(productId));
            if (existing) {
                existing.quantity += Number(quantity);
            } else {
                cart.items.push({
                    productId,
                    quantity: Number(quantity),
                    product: prod
                });
            }
            saveLocalCart(cart);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return { success: true };
        }
    },
    addItem(productId, quantity) {
        return this.addToCart(productId, quantity);
    },
    async removeFromCart(productId) {
        try {
            const res = await api.delete(`/cart/items/${productId}`);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return res;
        } catch (error) {
            console.warn("API removeFromCart failed, falling back to localStorage:", error);
            const cart = getLocalCart();
            cart.items = cart.items.filter(item => String(item.product ? item.product.id : item.productId) !== String(productId));
            saveLocalCart(cart);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return { success: true };
        }
    }
};

export const orderService = {
    async create() {
        try {
            return await api.post('/orders', {});
        } catch (error) {
            console.warn("API create order failed, falling back to localStorage:", error);
            const cart = getLocalCart();
            if (!cart.items || cart.items.length === 0) throw new Error("Cart is empty");
            
            const orders = JSON.parse(localStorage.getItem('arkwood_orders') || '[]');
            const newOrder = {
                id: 'ARK-' + Math.floor(Math.random() * 900000 + 100000),
                createdAt: new Date().toISOString(),
                totalAmount: cart.totalPrice,
                status: 'pending',
                items: cart.items.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    price: typeof item.product.price === 'string'
                        ? parseFloat(item.product.price.replace(/[^0-9.]/g, ''))
                        : Number(item.product.price)
                }))
            };
            orders.unshift(newOrder);
            localStorage.setItem('arkwood_orders', JSON.stringify(orders));
            
            // Clear cart
            localStorage.setItem('arkwood_cart', JSON.stringify({ items: [], totalPrice: 0 }));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            return { success: true, order: newOrder };
        }
    },
    async getAll() {
        try {
            return await api.get('/orders');
        } catch (error) {
            console.warn("API getAll orders failed, falling back to localStorage:", error);
            return JSON.parse(localStorage.getItem('arkwood_orders') || '[]');
        }
    },
    async getMyOrders() {
        try {
            return await api.get('/orders/my');
        } catch (error) {
            console.warn("API getMyOrders failed, falling back to localStorage:", error);
            return JSON.parse(localStorage.getItem('arkwood_orders') || '[]');
        }
    }
};

export const paymentService = {
    async createCheckoutSession(items, totalAmount) {
        try {
            return await api.post('/payments/create-checkout-session', { items, totalAmount });
        } catch (error) {
            console.warn("API createCheckoutSession failed, returning simulated session:", error);
            const simulatedSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 15);
            return {
                id: simulatedSessionId,
                url: '#stripe-mock-payment',
                isMock: true,
                totalAmount
            };
        }
    }
};
