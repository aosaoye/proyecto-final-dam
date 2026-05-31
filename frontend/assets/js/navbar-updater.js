import { authService, cartService, orderService } from './api-services.js';

// Dynamic load SweetAlert2 if not globally available
if (typeof Swal === 'undefined') {
    const swalScript = document.createElement('script');
    swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    document.head.appendChild(swalScript);
}

// Inject Universal CSS for User Dropdown and Better Header Visibility
const style = document.createElement('style');
style.textContent = `
    .user-menu-dropdown {
        position: relative;
        display: inline-block;
        margin-left: 10px;
    }
    .user-avatar-trigger {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 20px;
        transition: all 0.2s;
    }
    .user-avatar-trigger:hover {
        background: rgba(0,0,0,0.05);
    }
    /* White hover version for transparent headers */
    .site-header:not(.site-header--scrolled):not(.site-header--solid) .user-avatar-trigger:hover {
        background: rgba(255,255,255,0.15);
    }
    
    .user-avatar-circle {
        width: 32px;
        height: 32px;
        background: #ffffff;
        color: #006580;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.85rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    /* The hidden panel */
    .dropdown-panel {
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        background: #ffffff;
        min-width: 200px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border: 1px solid #f1f5f9;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9999;
        overflow: hidden;
    }
    
    .user-menu-dropdown:hover .dropdown-panel,
    .user-menu-dropdown:focus-within .dropdown-panel {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .dropdown-header {
        padding: 15px;
        border-bottom: 1px solid #f1f5f9;
        background: #f8fafc;
    }
    .dropdown-header .user-name {
        display: block;
        font-weight: 700;
        color: #1e293b;
        font-size: 0.9rem;
    }
    .dropdown-header .user-role {
        display: block;
        font-size: 0.75rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 2px;
    }
    
    .dropdown-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 15px;
        color: #475569;
        text-decoration: none;
        font-size: 0.85rem;
        transition: all 0.15s ease;
        font-weight: 500;
    }
    .dropdown-link ion-icon {
        font-size: 1.1rem;
    }
    .dropdown-link:hover {
        background: #f1f5f9;
        color: #0f172a;
    }
    .dropdown-link--danger {
        color: #ef4444;
        border-top: 1px solid #f1f5f9;
    }
    .dropdown-link--danger:hover {
        background: #fef2f2;
        color: #b91c1c;
    }

    .cart-trigger {
        position: relative;
    }
    .cart-badge {
        position: absolute;
        top: -4px;
        right: -6px;
        background: #ef4444;
        color: white;
        font-size: 0.6rem;
        font-weight: 900;
        min-width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .site-header:not(.site-header--scrolled):not(.site-header--solid) .cart-badge {
        border-color: var(--color-primary);
    }
    
    /* CSS FIX for Visibility on Home Hero */
    .site-header:not(.site-header--scrolled):not(.site-header--solid) .user-greet-text {
        color: rgba(255,255,255,0.95) !important; /* Force white text over hero image background */
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    .site-header:not(.site-header--scrolled):not(.site-header--solid) .header-action-link,
    .site-header:not(.site-header--scrolled):not(.site-header--solid) .header-action-link ion-icon {
        color: white !important; /* Ensure search/cart/text links also contrast on transparent home hero */
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.header-actions');
    if (!container) return;

    const path = window.location.pathname;
    let prefix = '';
    if (path.includes('/dashboard/') || path.includes('/auth/')) {
        prefix = '../';
    }
    
    let baseFolder = '';
    if (!path.includes('/pages/')) {
        baseFolder = 'pages/';
    }

    const user = authService.getCurrentUser();
    const isSearchPage = path.includes('search.html');

    let html = `
        ${!isSearchPage ? `<a href="${prefix}${baseFolder}search.html" class="header-action-link" title="Search"><ion-icon name="search-outline"></ion-icon></a>` : ''}
        <a href="#" class="header-action-link cart-trigger" title="View Cart" id="universal-cart-trigger">
            <ion-icon name="cart-outline"></ion-icon>
            <span class="cart-badge" id="universal-cart-badge" style="display:none;">0</span>
        </a>
    `;

    if (user) {
        const firstName = user.name.split(' ')[0];
        const initial = user.name.charAt(0).toUpperCase();

        html += `
            <div class="user-menu-dropdown">
                <div class="user-avatar-trigger">
                    <div class="user-avatar-circle">${initial}</div>
                    <span class="user-greet-text" style="color: #ffffff; font-size:0.85rem; font-weight:600;">${firstName}</span>
                    <ion-icon name="chevron-down-outline" style="font-size:0.7rem; color: #ffffff;"></ion-icon>
                </div>
                <div class="dropdown-panel">
                    <div class="dropdown-header">
                        <span class="user-name">${user.name}</span>
                    </div>
                    ${user.role === 'admin' ? `
                        <a href="${prefix}${baseFolder}dashboard/intranet.html" class="dropdown-link">
                            <ion-icon name="apps-outline"></ion-icon> Dashboard
                        </a>
                    ` : ''}
                    <a href="${prefix}${baseFolder}orders.html" class="dropdown-link">
                        <ion-icon name="bag-handle-outline"></ion-icon> My Orders
                    </a>
                    <a href="#" class="dropdown-link dropdown-link--danger" id="universal-logout">
                        <ion-icon name="log-out-outline"></ion-icon> Sign Out
                    </a>
                </div>
            </div>
        `;
    } else {
        html += `
            <div style="display:flex; align-items:center; gap: 1.25rem; margin-left: 0.75rem;">
                <a href="${prefix}${baseFolder}auth/login.html" class="header-action-link" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; transition: opacity 0.2s;">Login</a>
                <a href="${prefix}${baseFolder}auth/register.html" class="header-action-link" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; transition: opacity 0.2s;">Register</a>
            </div>
        `;
    }

    container.innerHTML = html;

    // 1. Attaching Universal Cart Action
    const cartBtn = document.getElementById('universal-cart-trigger');
    if (cartBtn) {
        cartBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!authService.isAuthenticated()) {
                Swal.fire({
                    title: 'Shopping Cart',
                    text: 'Please sign in to access your cart inventory.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Login'
                }).then((r) => {
                    if (r.isConfirmed) window.location.href = `${prefix}${baseFolder}auth/login.html`;
                });
                return;
            }

            // Show loading
            Swal.fire({
                title: 'Syncing bag...',
                didOpen: () => Swal.showLoading()
            });

            try {
                const cart = await cartService.getCart();
                
                if (!cart || !cart.items || cart.items.length === 0) {
                    Swal.fire({
                        title: 'Empty Cart',
                        text: 'Your cart has no selected items yet.',
                        icon: 'info'
                    });
                    return;
                }

                // Format list
                let htmlList = `<div style="text-align:left; max-height:300px; overflow-y:auto;">`;
                cart.items.forEach(item => {
                    const prod = item.product;
                    if (!prod) return;
                    const img = prod.image && prod.image.startsWith('/uploads') 
                        ? `http://${window.location.hostname}:5000${prod.image}` 
                        : (prod.image || 'https://via.placeholder.com/50');

                    const parsedPrice = typeof prod.price === 'string'
                        ? parseFloat(prod.price.replace(/[^0-9.]/g, ''))
                        : Number(prod.price || 0);
                    const itemTotal = (parsedPrice * item.quantity).toFixed(2);
                    const priceDisplay = String(prod.price).includes('€') ? prod.price : prod.price + '€';

                    htmlList += `
                        <div style="display:flex; align-items:center; gap:10px; border-bottom:1px solid #eee; padding: 10px 0;">
                            <img src="${img}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;">
                            <div style="flex-grow:1;">
                                <div style="font-weight:bold; font-size:0.9rem;">${prod.name}</div>
                                <div style="font-size:0.8rem; color:#666;">Qty: ${item.quantity} x ${priceDisplay}</div>
                            </div>
                            <div style="font-weight:bold; margin-right:10px;">${itemTotal}€</div>
                            <button class="js-cart-remove-item" data-prod-id="${prod.id || prod._id || item.productId}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.2rem; display:flex; align-items:center; justify-content:center;">
                                <ion-icon name="close-circle"></ion-icon>
                            </button>
                        </div>
                    `;
                });
                
                const parsedTotal = typeof cart.totalPrice === 'string'
                    ? parseFloat(cart.totalPrice.replace(/[^0-9.]/g, ''))
                    : Number(cart.totalPrice || 0);
                const totalDisplay = isNaN(parsedTotal) ? '0.00' : parsedTotal.toFixed(2);

                htmlList += `</div><div style="margin-top:15px; text-align:right; font-size:1.2rem; font-weight:bold;">Total: ${totalDisplay}€</div>`;

                Swal.fire({
                    title: 'Your Cart',
                    html: htmlList,
                    confirmButtonText: 'Checkout',
                    showCancelButton: true,
                    cancelButtonText: 'Continue Shopping'
                }).then(async (res) => {
                    if (res.isConfirmed) {
                        try {
                            Swal.fire({ title: 'Placing order...', didOpen: () => Swal.showLoading() });
                            await orderService.create();
                            Swal.fire('Order Placed!', 'We have received your order successfully. Cart cleared.', 'success');
                            updateCartBadge(); // Instantly reset total badge
                        } catch (err) {
                            Swal.fire('Error', 'Could not generate order: ' + err.message, 'error');
                        }
                    }
                });

                // Attach dynamic event delegated to modal body for deletion!
                setTimeout(() => {
                    const container = Swal.getHtmlContainer();
                    if (!container) return;
                    container.querySelectorAll('.js-cart-remove-item').forEach(btn => {
                        btn.onclick = async (e) => {
                            const prodId = btn.getAttribute('data-prod-id');
                            try {
                                await cartService.removeFromCart(prodId);
                                Swal.close(); // Refresh visual state by closing & trigger reopen simulation
                                updateCartBadge();
                                cartBtn.click(); // Recursively simulate reclick to show modified list
                            } catch(er) {
                                Swal.fire('Error', 'Could not remove item', 'error');
                            }
                        };
                    });
                }, 200);

            } catch (error) {
                Swal.fire('Error', 'Could not sync your shopping cart state.', 'error');
            }
        });
    }

    // 2. Attaching Universal Logout
    const logoutBtn = document.getElementById('universal-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
            window.location.reload();
        });
    }

    // 3. Sync Cart Badge asynchronously
    const updateCartBadge = async () => {
        if (!authService.isAuthenticated()) return;
        try {
            const cart = await cartService.getCart();
            const badge = document.getElementById('universal-cart-badge');
            if (badge && cart && cart.items) {
                // Count total units, not unique products
                const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
                if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch (e) { /* ignore background sync errors */ }
    };

    // Bind dynamic update trigger to window for cross-file interactivity
    window.addEventListener('cartUpdated', updateCartBadge);

    // Run initial check
    updateCartBadge();
});
