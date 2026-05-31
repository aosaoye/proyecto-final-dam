import { orderService, authService } from './api-services.js';

// Safety net auth check
if (!authService.isAuthenticated()) {
    window.location.href = 'auth/login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const feed = document.getElementById('orders-feed');
    if (!feed) return;

    try {
        const orders = await orderService.getMyOrders();

        if (!orders || orders.length === 0) {
            feed.innerHTML = `
                <div class="empty-orders">
                    <ion-icon name="bag-outline" class="empty-icon"></ion-icon>
                    <h2>You haven't placed any orders yet</h2>
                    <p style="color: #78716c; margin-top: 0.5rem;">Explore our catalog and find something you love!</p>
                    <a href="products.html" class="btn-shop-now" style="margin-top: 1.5rem;">Browse Store</a>
                </div>
            `;
            return;
        }

        // Render the elegant list
        feed.innerHTML = orders.map(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });

            return `
                <article class="order-card">
                    <div class="order-card-header">
                        <div>
                            <div class="header-stat-label">Date</div>
                            <div class="header-stat-val">${date}</div>
                        </div>
                        <div>
                            <div class="header-stat-label">Total</div>
                            <div class="header-stat-val" style="color: #0c0a09; font-weight:800; font-size:1rem;">${order.totalAmount.toFixed(2)} €</div>
                        </div>
                        <div>
                            <div class="header-stat-label">Order ID</div>
                            <div class="header-stat-val"><span class="order-id-font">#${order.id.slice(-8).toUpperCase()}</span></div>
                        </div>
                        <div style="text-align: right;">
                            <span class="order-status-badge">${order.status === 'pending' ? 'Processing' : 'Completed'}</span>
                        </div>
                    </div>
                    
                    <div class="order-items-list">
                        ${order.items.map(item => `
                            <div class="order-item-row">
                                <div class="order-item-dot"></div>
                                <div class="order-item-info">
                                    <div class="order-item-name">${item.productName || 'Product'}</div>
                                    <div class="order-item-qty">Qty: ${item.quantity} x ${item.price.toFixed(2)}€</div>
                                </div>
                                <div class="order-item-price">${(item.quantity * item.price).toFixed(2)}€</div>
                            </div>
                        `).join('')}
                    </div>
                </article>
            `;
        }).join('');

    } catch (err) {
        feed.innerHTML = `
            <div style="text-align:center; color:#ef4444; padding: 3rem;">
                <ion-icon name="warning-outline" style="font-size: 3rem; margin-bottom:1rem;"></ion-icon>
                <h3>Error loading your orders</h3>
                <p>${err.message}</p>
            </div>
        `;
    }
});
