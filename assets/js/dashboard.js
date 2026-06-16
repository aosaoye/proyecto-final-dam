/**
 * DashboardController - Manages the Intranet administrative interface logic.
 * Designed with injection strategy enabling clean testable modular boundaries.
 */
export class DashboardController {
    constructor(authService, productService, orderService) {
        this.auth = authService;
        this.products = productService;
        this.orders = orderService;

        // Internal UI state
        this.allProductsBuffer = [];
        this.currentProductPage = 1;
        this.PRODUCTS_PER_PAGE = 6;
        this.productSearchQuery = '';
    }

    /**
     * Safe Initialization Routine bootstraped on script load
     */
    init() {
        this.injectUserDisplay();
        this.bindEvents();
        this.loadInitialData();
        this.exposeGlobals();
    }

    injectUserDisplay() {
        const user = this.auth.getCurrentUser();
        if (user) {
            const nameBox = document.getElementById('user-name-display');
            const initialBox = document.getElementById('user-initial');
            if (nameBox) nameBox.innerText = user.name;
            if (initialBox) initialBox.innerText = user.name.charAt(0);
        }
    }

    bindEvents() {
        // Global Live Product Filter
        const searchEl = document.getElementById('global-search');
        if (searchEl) {
            searchEl.addEventListener('input', (e) => {
                this.productSearchQuery = e.target.value;
                this.currentProductPage = 1; // reset
                this.renderProductsTable();
            });
        }

        // Enhanced Logout Link listener
        const logoutBtn = document.getElementById('logout-link');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Swal.fire({
                    title: 'Sign out?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, log out'
                }).then((r) => {
                    if (r.isConfirmed) {
                        this.auth.logout();
                        window.location.href = '../index.html';
                    }
                });
            });
        }
    }

    async loadInitialData() {
        await Promise.all([
            this.fetchAndRenderProducts(),
            this.fetchAndRenderOrders(),
            this.fetchAndRenderUsers()
        ]);
    }

    /**
     * PRODUCT DOMAIN LOGIC
     */
    async fetchAndRenderProducts() {
        try {
            const data = await this.products.getAll();
            this.allProductsBuffer = data;
            const countSpan = document.getElementById('stat-products');
            if (countSpan) countSpan.innerText = data.length;

            this.renderProductsTable();
        } catch (err) {
            console.error("Product Load Fault:", err);
            const tb = document.getElementById('product-table-body');
            if (tb) tb.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ef4444;">API Error: ${err.message}</td></tr>`;
        }
    }

    renderProductsTable() {
        const tbody = document.getElementById('product-table-body');
        const paginBox = document.getElementById('products-pagination');
        if (!tbody) return;

        // 1. Filtering Logic
        let data = this.allProductsBuffer;
        if (this.productSearchQuery) {
            const q = this.productSearchQuery.toLowerCase();
            data = data.filter(p => 
                p.name.toLowerCase().includes(q) || 
                (p.category && p.category.toLowerCase().includes(q))
            );
        }

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:3rem;">No items match your filter.</td></tr>`;
            if (paginBox) paginBox.innerHTML = '';
            return;
        }

        // 2. Partitioning/Paging Logic
        const totalPages = Math.ceil(data.length / this.PRODUCTS_PER_PAGE);
        if (this.currentProductPage > totalPages) this.currentProductPage = totalPages || 1;
        
        const start = (this.currentProductPage - 1) * this.PRODUCTS_PER_PAGE;
        const pageSlice = data.slice(start, start + this.PRODUCTS_PER_PAGE);

        // 3. DOM Rendering
        tbody.innerHTML = pageSlice.map(p => {
            const img = p.image && p.image.startsWith('/uploads') 
                ? `https://proyecto-final-dam-backend.onrender.com${p.image}`  // Production safe rewrite
                : (p.image || 'https://via.placeholder.com/40x40');
            
            return `
                <tr>
                    <td><img src="${img}" style="width:40px; height:40px; object-fit:cover; border-radius:8px; border:1px solid #f3f4f6;" onerror="this.src='https://via.placeholder.com/40x40'"></td>
                    <td><strong style="font-weight: 700; color:#111827;">${p.name}</strong></td>
                    <td><span style="color: #6b7280; font-weight: 600;">${p.category || 'Misc'}</span></td>
                    <td style="font-weight:800; color:#111827;">${Number(p.price).toFixed(2)}€</td>
                    <td>
                        <div class="stock-status">
                            <span class="stock-dot ${p.stock > 5 ? 'in-stock' : 'low-stock'}"></span>
                            ${p.stock} units
                        </div>
                    </td>
                    <td>
                        <div style="display:flex; gap:0.5rem; justify-content: flex-end;">
                            <button class="btn-icon-action" onclick="window.dashboard.uiOpenEditProduct('${p.id || p._id}')" title="Edit">
                                <ion-icon name="create-outline"></ion-icon>
                            </button>
                            <button class="btn-icon-action" style="color:#ef4444; border-color:#fee2e2;" onclick="window.dashboard.uiDeleteProduct('${p.id || p._id}')" title="Delete">
                                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // 4. Render Pager Controls
        if (paginBox) {
            let btnHtml = '';
            for(let i = 1; i <= totalPages; i++) {
                btnHtml += `<button class="btn-page ${i === this.currentProductPage ? 'active' : ''}" onclick="window.dashboard.changeProductPage(${i})">${i}</button>`;
            }
            paginBox.innerHTML = `
                <div>Showing ${start + 1}-${Math.min(start + this.PRODUCTS_PER_PAGE, data.length)} of ${data.length}</div>
                <div class="pagination-btns">
                    <button class="btn-page" ${this.currentProductPage === 1 ? 'disabled' : ''} onclick="window.dashboard.changeProductPage(${this.currentProductPage - 1})">Prev</button>
                    ${btnHtml}
                    <button class="btn-page" ${this.currentProductPage === totalPages ? 'disabled' : ''} onclick="window.dashboard.changeProductPage(${this.currentProductPage + 1})">Next</button>
                </div>
            `;
        }
    }

    changeProductPage(num) {
        this.currentProductPage = num;
        this.renderProductsTable();
    }

    async uiDeleteProduct(id) {
        const res = await Swal.fire({
            title: 'Are you sure?',
            text: "This entry will be scrubbed permanent.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete item'
        });
        if (res.isConfirmed) {
            try {
                await this.products.delete(id);
                Swal.fire('Removed', 'Product wiped successfully', 'success');
                this.fetchAndRenderProducts();
            } catch(e) { Swal.fire('Operation Failed', e.message, 'error'); }
        }
    }

    uiOpenAddProduct() {
        Swal.fire({
            title: 'Register New Product',
            html: `
                <div style="text-align:left; display:flex; flex-direction:column; gap:1rem;">
                    <div>
                        <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Product Name</label>
                        <input id="swal-name" class="swal2-input" style="margin:0; width:100%;" placeholder="e.g. Nordic Chair">
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                        <div>
                            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Price (€)</label>
                            <input id="swal-price" type="number" step="0.01" class="swal2-input" style="margin:0; width:100%;">
                        </div>
                        <div>
                            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Initial Stock</label>
                            <input id="swal-stock" type="number" class="swal2-input" style="margin:0; width:100%;">
                        </div>
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Category</label>
                        <select id="swal-category" class="swal2-input" style="margin:0; width:100%;">
                            <option value="Garden">Garden</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Dining">Dining</option>
                            <option value="Living">Living</option>
                            <option value="Bedroom">Bedroom</option>
                            <option value="Kids Room">Kids Room</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Office">Office</option>
                            <option value="Storage">Storage</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Description</label>
                        <textarea id="swal-desc" class="swal2-textarea" style="margin:0; width:100%; height:60px;" placeholder="Short details..."></textarea>
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Photo Upload</label>
                        <input type="file" id="swal-file" accept="image/*" style="width:100%; font-size:0.9rem;">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Product',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const price = document.getElementById('swal-price').value;
                const category = document.getElementById('swal-category').value;
                const stock = document.getElementById('swal-stock').value;
                const description = document.getElementById('swal-desc').value;
                const file = document.getElementById('swal-file').files[0];
                if (!name || !price || !category) {
                    Swal.showValidationMessage(`Fill necessary fields`);
                    return false;
                }
                return { name, price, category, stock, description, file };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { name, price, category, stock, description, file } = result.value;
                const fd = new FormData();
                fd.append('name', name);
                fd.append('price', price);
                fd.append('category', category);
                fd.append('stock', stock);
                fd.append('description', description);
                if (file) fd.append('image', file);

                Swal.fire({ title: 'Publishing...', didOpen: () => Swal.showLoading() });
                try {
                    await this.products.create(fd);
                    Swal.fire('Added!', 'Item successfully persisted.', 'success');
                    this.fetchAndRenderProducts();
                } catch(e) { Swal.fire('Failed', e.message, 'error'); }
            }
        });
    }

    async uiOpenEditProduct(id) {
        Swal.fire({ title: 'Retriving...', didOpen: () => Swal.showLoading() });
        try {
            const p = await this.products.getById(id);
            Swal.close();

            Swal.fire({
                title: 'Modify Product',
                html: `
                    <div style="text-align:left; display:flex; flex-direction:column; gap:1rem;">
                        <div>
                            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Product Name</label>
                            <input id="swal-name" class="swal2-input" style="margin:0; width:100%;" value="${p.name}">
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                            <div>
                                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Price (€)</label>
                                <input id="swal-price" type="number" step="0.01" class="swal2-input" style="margin:0; width:100%;" value="${p.price}">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Current Stock</label>
                                <input id="swal-stock" type="number" class="swal2-input" style="margin:0; width:100%;" value="${p.stock}">
                            </div>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Category</label>
                            <select id="swal-category" class="swal2-input" style="margin:0; width:100%;">
                                <option value="Garden" ${p.category === 'Garden' ? 'selected' : ''}>Garden</option>
                                <option value="Kitchen" ${p.category === 'Kitchen' ? 'selected' : ''}>Kitchen</option>
                                <option value="Dining" ${p.category === 'Dining' ? 'selected' : ''}>Dining</option>
                                <option value="Living" ${p.category === 'Living' ? 'selected' : ''}>Living</option>
                                <option value="Bedroom" ${p.category === 'Bedroom' ? 'selected' : ''}>Bedroom</option>
                                <option value="Kids Room" ${p.category === 'Kids Room' ? 'selected' : ''}>Kids Room</option>
                                <option value="Bathroom" ${p.category === 'Bathroom' ? 'selected' : ''}>Bathroom</option>
                                <option value="Office" ${p.category === 'Office' ? 'selected' : ''}>Office</option>
                                <option value="Storage" ${p.category === 'Storage' ? 'selected' : ''}>Storage</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Description</label>
                            <textarea id="swal-desc" class="swal2-textarea" style="margin:0; width:100%; height:60px;">${p.description || ''}</textarea>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.4rem;">Swap Photo (Opt)</label>
                            <input type="file" id="swal-file" accept="image/*" style="width:100%; font-size:0.9rem;">
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Apply Changes',
                preConfirm: () => {
                    const name = document.getElementById('swal-name').value;
                    const price = document.getElementById('swal-price').value;
                    const category = document.getElementById('swal-category').value;
                    const stock = document.getElementById('swal-stock').value;
                    const description = document.getElementById('swal-desc').value;
                    const file = document.getElementById('swal-file').files[0];
                    if (!name || !price) { Swal.showValidationMessage(`Invalid input`); return false; }
                    return { name, price, category, stock, description, file };
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { name, price, category, stock, description, file } = result.value;
                    const fd = new FormData();
                    fd.append('name', name);
                    fd.append('price', price);
                    fd.append('category', category);
                    fd.append('stock', stock);
                    fd.append('description', description);
                    if (file) fd.append('image', file);

                    Swal.fire({ title: 'Syncing...', didOpen: () => Swal.showLoading() });
                    await this.products.update(id, fd);
                    Swal.fire('Done', 'Database synchronized.', 'success');
                    this.fetchAndRenderProducts();
                }
            });
        } catch(e) { Swal.fire('Critical error', e.message, 'error'); }
    }

    /**
     * ORDER DOMAIN LOGIC
     */
    async fetchAndRenderOrders() {
        const tb = document.getElementById('orders-table-body');
        const recentBox = document.getElementById('latest-orders-container');
        const revenueSpan = document.getElementById('stat-revenue');
        try {
            const sales = await this.orders.getAll();
            
            const total = sales.reduce((s, o) => s + o.totalAmount, 0);
            if (revenueSpan) revenueSpan.innerText = `${total.toFixed(2)}€`;

            if (!sales || sales.length === 0) {
                if(tb) tb.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:3rem; color:#9ca3af;">Null transaction set.</td></tr>`;
                return;
            }

            if (tb) {
                tb.innerHTML = sales.map(o => `
                    <tr>
                        <td><span style="font-family:monospace; font-size:0.8rem; font-weight:700;">#${o.id.slice(-6).toUpperCase()}</span></td>
                        <td>${o.userName || 'Client'}</td>
                        <td>${o.items.length} units</td>
                        <td style="font-weight:800;">${o.totalAmount.toFixed(2)}€</td>
                        <td style="color:#6b7280;">${new Date(o.createdAt).toLocaleDateString()}</td>
                        <td><span class="badge badge-success">COMPLETED</span></td>
                    </tr>
                `).join('');
            }

            if (recentBox) {
                recentBox.innerHTML = sales.slice(0, 3).map(o => `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid #f3f4f6;">
                        <div>
                            <div style="font-weight:700; font-size:0.9rem;">Order #${o.id.slice(-5).toUpperCase()}</div>
                            <div style="color:#9ca3af; font-size:0.8rem;">${new Date(o.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                        </div>
                        <div style="font-weight:800; color:#111827;">${o.totalAmount.toFixed(2)}€</div>
                    </div>
                `).join('');
            }
        } catch (err) {
            if(tb) tb.innerHTML = `<tr><td colspan="6" style="color:#ef4444; text-align:center; padding:2rem;">Auth Failure: Run Login.</td></tr>`;
        }
    }

    /**
     * USER DIRECTORY LOGIC
     */
    async fetchAndRenderUsers() {
        const tb = document.getElementById('users-placeholder-body');
        const statSpan = document.getElementById('stat-total-users');
        try {
            const items = await this.auth.getAllUsers();
            if (statSpan) statSpan.innerText = items.length;
            if (!tb) return;
            if (items.length === 0) {
                tb.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Isolated deployment. No users found.</td></tr>`;
                return;
            }
            tb.innerHTML = items.map(u => `
                <tr>
                    <td><strong style="color:#111827;">${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="badge" style="background:${u.role==='admin'?'#fee2e2;color:#b91c1c':'#e0e7ff;color:#4338ca'}">${(u.role||'USER').toUpperCase()}</span></td>
                    <td style="color:#10b981; font-weight:600;"><ion-icon name="checkmark-circle"></ion-icon> Validated</td>
                </tr>
            `).join('');
        } catch(e) { if(tb) tb.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Blocked.</td></tr>`; }
    }

    /**
     * GENERAL UI HELPERS EXPOSURE
     */
    exposeGlobals() {
        // Global navigation handler needed by HTML onClick bindings
        window.switchTab = (viewId, el, title) => {
            this.uiCloseMobileSidebar();
            document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            
            const node = document.getElementById(viewId);
            if (node) node.classList.add('active');
            if (el) el.classList.add('active');

            const breadcrumb = document.getElementById('breadcrumb-active');
            if (breadcrumb && title) breadcrumb.innerText = title;
        };

        window.toggleMobileSidebar = () => {
            document.querySelector('.sidebar').classList.toggle('sidebar--active');
            document.getElementById('nav-overlay').classList.toggle('active');
        };

        // Expose instances bound methods to legacy onclick handlers safely
        window.dashboard = {
            changeProductPage: this.changeProductPage.bind(this),
            uiOpenAddProduct: this.uiOpenAddProduct.bind(this),
            uiOpenEditProduct: this.uiOpenEditProduct.bind(this),
            uiDeleteProduct: this.uiDeleteProduct.bind(this)
        };

        // Special hook for the explicitly injected global function openAddProductModal called in raw HTML
        window.openAddProductModal = this.uiOpenAddProduct.bind(this);
    }

    uiCloseMobileSidebar() {
        const s = document.querySelector('.sidebar');
        const o = document.getElementById('nav-overlay');
        if(s.classList.contains('sidebar--active')) {
            s.classList.remove('sidebar--active');
            o.classList.remove('active');
        }
    }
}
