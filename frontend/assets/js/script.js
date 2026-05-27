document.addEventListener('DOMContentLoaded', () => {
    // ---- 0. Toast Notification Utility ----
    function showToast(message, type = 'success') {
        let toast = document.querySelector('.toast-notif');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notif';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.background = type === 'error' ? '#e63946' : '#6E4424';
        toast.classList.add('toast-notif--active');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('toast-notif--active');
        }, 3000);
    }

    // ---- 1. Initialize DOM Elements dynamically (Modsy Premium UX Toolkit) ----
    // ---- 2. Favoritos en tarjetas de productos ----
    const FAVORITE_KEY = 'modsy_favorites';
    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]');
    }
    function setFavorites(favs) {
        localStorage.setItem(FAVORITE_KEY, JSON.stringify(favs));
    }
    function toggleFavorite(productName, btn) {
        let favs = getFavorites();
        if (favs.includes(productName)) {
            favs = favs.filter(f => f !== productName);
        } else {
            favs.push(productName);
        }
        setFavorites(favs);
    }
    // Inicializar botones de favorito con BEM
    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.product-card__favorite-btn');
        const name = card.querySelector('.product-card__name')?.textContent?.trim();
        if (!btn || !name) return;
        // Estado inicial
        if (getFavorites().includes(name)) {
            btn.classList.add('product-card__favorite-btn--active');
        }
        btn.addEventListener('click', e => {
            e.preventDefault();
            btn.classList.toggle('product-card__favorite-btn--active');
            toggleFavorite(name, btn);
        });
    });
    
    // Inject dynamic backdrop for drawers
    let backdrop = document.querySelector('.drawer-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'drawer-backdrop';
        document.body.appendChild(backdrop);
    }

    function closeMobileDrawer() {
        const header = document.querySelector('.site-header');
        mobileDrawer?.classList.remove('mobile-drawer--active');
        backdrop?.classList.remove('drawer-backdrop--active');
        header?.classList.remove('site-header--menu-active');
        document.body.classList.remove('no-scroll');
        document.querySelectorAll('.mobile-menu-toggle').forEach(button => {
            button.classList.remove('mobile-menu-toggle--active');
            button.setAttribute('aria-expanded', 'false');
        });
    }

    // Inject mobile menu drawer if not present
    let mobileDrawer = document.querySelector('.mobile-drawer');
    if (!mobileDrawer) {
        mobileDrawer = document.createElement('div');
        mobileDrawer.className = 'mobile-drawer';

        const drawerHeader = document.createElement('div');
        drawerHeader.className = 'mobile-drawer__header';

        const logoDiv = document.createElement('div');
        logoDiv.className = 'logo';
        // Clean text-only logo on drawer to conserve space
        logoDiv.innerHTML = '<a href="index.html" style="font-weight:900; letter-spacing:-1px; color:#000000; text-decoration:none;">Modsy.</a>';

        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-drawer__close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Close menu');
        closeButton.innerHTML = '&times;';

        drawerHeader.appendChild(logoDiv);
        drawerHeader.appendChild(closeButton);
        mobileDrawer.appendChild(drawerHeader);

        const linkList = document.createElement('ul');
        linkList.className = 'mobile-drawer__list';

        // Copy current navbar links dynamically
        const navLinks = document.querySelectorAll('.main-nav .main-nav__link');
        navLinks.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'mobile-drawer__link';
            a.href = link.getAttribute('href');
            a.innerHTML = `
                <span>${link.textContent}</span>
                <ion-icon name="arrow-forward-outline" style="font-size:1.25rem; opacity:0.6;"></ion-icon>
            `;
            li.appendChild(a);
            linkList.appendChild(li);
        });

        mobileDrawer.appendChild(linkList);
        document.body.appendChild(mobileDrawer);
    }

    // Initialize or augment existing mobile menu toggle buttons
    document.querySelectorAll('.mobile-menu-toggle').forEach(btn => {
        btn.innerHTML = '<span></span><span></span>';
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', () => {
            const header = document.querySelector('.site-header');
            const isActive = btn.classList.toggle('mobile-menu-toggle--active');
            if (isActive) {
                mobileDrawer?.classList.add('mobile-drawer--active');
                backdrop?.classList.add('drawer-backdrop--active');
                header?.classList.add('site-header--menu-active');
                document.body.classList.add('no-scroll');
                btn.setAttribute('aria-expanded', 'true');
            } else {
                closeMobileDrawer();
            }
        });
    });

    const closeMenuBtn = document.querySelector('.mobile-drawer__close');
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileDrawer);
    }

    backdrop?.addEventListener('click', closeMobileDrawer);

    // ---- 3. Header Scroll Effect ----
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('site-header--scrolled');
            } else {
                header.classList.remove('site-header--scrolled');
            }
        });
    }

    // ---- 5. Smart Dynamic Filtering Logic ----
    const filterBtns = document.querySelectorAll('.filters-bar .filter-btn');
    const products = document.querySelectorAll('.products-grid .product-card');

    if (filterBtns.length > 0 && products.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');
                
                const filterVal = btn.textContent.toLowerCase().trim();
                
                products.forEach(prod => {
                    const subtitle = prod.querySelector('.category-card__subtitle')?.textContent.toLowerCase() || '';
                    if (filterVal === 'all products' || filterVal === 'all' || subtitle.includes(filterVal)) {
                        prod.style.display = 'flex';
                        prod.style.opacity = '0';
                        setTimeout(() => {
                            prod.style.transition = 'opacity 0.4s ease';
                            prod.style.opacity = '1';
                        }, 10);
                    } else {
                        prod.style.display = 'none';
                    }
                });
            });
        });
    }

    // ---- 6. Advanced Form Validation & Submission Logic ----
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = contactForm.querySelector('input[type="email"]');
            const nameInput = contactForm.querySelector('input[type="text"]');
            const msgInput = contactForm.querySelector('textarea');
            let hasError = false;

            if (nameInput && nameInput.value.trim().length < 2) {
                showToast('Please enter a valid name', 'error');
                nameInput.style.borderColor = 'red';
                hasError = true;
            } else if (nameInput) {
                nameInput.style.borderColor = 'var(--color-stone-300)';
            }

            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                showToast('Please enter a valid email address', 'error');
                emailInput.style.borderColor = 'red';
                hasError = true;
            } else if (emailInput) {
                emailInput.style.borderColor = 'var(--color-stone-300)';
            }

            if (msgInput && msgInput.value.trim().length < 5) {
                showToast('Please write a short message', 'error');
                msgInput.style.borderColor = 'red';
                hasError = true;
            } else if (msgInput) {
                msgInput.style.borderColor = 'var(--color-stone-300)';
            }

            if (!hasError) {
                showToast('Success! Your message has been sent.');
                contactForm.reset();
            }
        });
    }

    // ---- 7. Image Switching Feature ----
    // For every product visual, attach simple dots or click switches to rotate images
    const visualCards = document.querySelectorAll('.product-card__visual, .category-card__visual');
    visualCards.forEach(visual => {
        const img = visual.querySelector('img');
        if (img) {
            // Optional alternate images array for high interactivity
            const originalSrc = img.getAttribute('src');
            const altSrc = originalSrc.includes('pexels-photo') ? originalSrc.replace('w=800', 'w=801') : originalSrc;
            
            visual.addEventListener('mouseenter', () => {
                if (altSrc !== originalSrc) img.setAttribute('src', altSrc);
            });
            visual.addEventListener('mouseleave', () => {
                if (altSrc !== originalSrc) img.setAttribute('src', originalSrc);
            });
        }
    });

    // Handle clicks on category cards (takes them directly to products filtered)
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const catName = card.querySelector('.category-card__name')?.textContent?.trim();
            if (catName) {
                window.location.href = `products.html?category=${encodeURIComponent(catName)}`;
            }
        });
    });
});