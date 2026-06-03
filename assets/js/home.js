export async function loadLatestArrivals(productService, gridElementId) {
    const container = document.getElementById(gridElementId);
    if (!container) return;

    // Render 4 beautiful skeleton shimmer cards while database loads
    let skeletonHtml = '';
    for (let i = 0; i < 4; i++) {
        skeletonHtml += `
            <div class="product-card skeleton-card">
                <div class="product-card__image skeleton" style="aspect-ratio: 1/1; width: 100%;"></div>
                <div class="product-card__info" style="padding: 1rem 0; display:flex; flex-direction:column; gap:0.5rem;">
                    <div style="display:flex; justify-content:space-between; gap:1rem;">
                        <div class="skeleton" style="height: 1rem; width: 60%; border-radius:4px;"></div>
                        <div class="skeleton" style="height: 1rem; width: 20%; border-radius:4px;"></div>
                    </div>
                </div>
            </div>
        `;
    }
    container.innerHTML = skeletonHtml;

    // Pinterest local favorites helpers
    const FAVORITE_KEY = 'modsy_favorites';
    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]');
    }
    function toggleFavorite(productName) {
        let favs = getFavorites();
        const isFav = favs.includes(productName);
        if (isFav) {
            favs = favs.filter(f => f !== productName);
        } else {
            favs.push(productName);
        }
        localStorage.setItem(FAVORITE_KEY, JSON.stringify(favs));
        return !isFav;
    }

    // Pinterest styled Toast Notification
    function showPinterestToast(message) {
        let toast = document.querySelector('.pinterest-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'pinterest-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #1c1917;
                color: #ffffff;
                padding: 14px 28px;
                border-radius: 30px;
                font-size: 0.95rem;
                font-weight: 700;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                opacity: 0;
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            `;
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span style="background:#e60023; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; color:white; font-size:0.75rem;">✓</span> ${message}`;
        
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        }, 50);
        
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
        }, 3000);
    }

    try {
        const allProducts = await productService.getAll();
        // Reverse to prioritize most recently added items
        const latestProducts = [...allProducts].reverse().slice(0, 4);

        if (latestProducts.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #888;">No stock listings detected. Connect control portal.</p>';
            return;
        }

        container.innerHTML = ''; // Clear skeleton

        latestProducts.forEach((p) => {
            // Handle consistent dynamic asset routing across all environments
            const imgUrl = p.image && p.image.startsWith('/uploads') 
                ? `https://${window.location.hostname.replace(':5000','')}${p.image}` 
                : (p.image || 'https://via.placeholder.com/300x300?text=Missing+Visual');
            
            const secureImg = imgUrl.replace('http:', 'https:');

            const parsedPrice = typeof p.price === 'string'
                ? parseFloat(p.price.replace(/[^0-9.]/g, ''))
                : Number(p.price);
            const displayPrice = isNaN(parsedPrice) ? '0.00' : parsedPrice.toFixed(2);

            const isFavorited = getFavorites().includes(p.name);
            const favClass = isFavorited ? 'product-card__favorite-btn--active' : '';
            const favIcon = isFavorited ? 'heart' : 'heart-outline';

            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="product-card__image" style="cursor:pointer;">
                    <img src="${secureImg}" class="product-card__img" alt="${p.name}" loading="lazy">
                    <button class="product-card__favorite-btn ${favClass}" aria-label="Add to favorites"><ion-icon name="${favIcon}"></ion-icon></button>
                    
                    <div class="product-card__pin-overlay">
                        <button class="product-card__save-btn">Guardar</button>
                        <div class="product-card__actions-row">
                            <button class="product-card__action-btn share-btn" title="Compartir"><ion-icon name="arrow-redo-outline"></ion-icon></button>
                            <button class="product-card__action-btn options-btn" title="Más opciones"><ion-icon name="ellipsis-horizontal-outline"></ion-icon></button>
                        </div>
                    </div>
                </div>
                <div class="product-card__info">
                    <div class="product-card__header">
                        <div class="product-card__name" style="cursor:pointer;">${p.name}</div>
                        <div class="product-card__price">${displayPrice}€</div>
                    </div>
                    <div class="product-card__footer">
                        <div class="product-card__category">${(p.category||'').toUpperCase()}</div>
                    </div>
                </div>
            `;

            // Setup bindings for Pinterest features
            const saveBtn = card.querySelector('.product-card__save-btn');
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const favBtn = card.querySelector('.product-card__favorite-btn');
                const nowFavorited = toggleFavorite(p.name);
                
                if (nowFavorited) {
                    favBtn.classList.add('product-card__favorite-btn--active');
                    favBtn.querySelector('ion-icon').setAttribute('name', 'heart');
                    showPinterestToast(`¡Guardado en tu colección de Favoritos!`);
                } else {
                    favBtn.classList.remove('product-card__favorite-btn--active');
                    favBtn.querySelector('ion-icon').setAttribute('name', 'heart-outline');
                    showPinterestToast(`Eliminado de tu colección de Favoritos`);
                }
            });

            const favBtn = card.querySelector('.product-card__favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nowFavorited = toggleFavorite(p.name);
                
                if (nowFavorited) {
                    favBtn.classList.add('product-card__favorite-btn--active');
                    favBtn.querySelector('ion-icon').setAttribute('name', 'heart');
                    showPinterestToast(`¡Guardado en tu colección de Favoritos!`);
                } else {
                    favBtn.classList.remove('product-card__favorite-btn--active');
                    favBtn.querySelector('ion-icon').setAttribute('name', 'heart-outline');
                    showPinterestToast(`Eliminado de tu colección de Favoritos`);
                }
            });

            const shareBtn = card.querySelector('.share-btn');
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const shareUrl = `${window.location.origin}/product-detail.html?id=${p.id || p._id}`;
                if (navigator.share) {
                    navigator.share({
                        title: p.name,
                        text: `¡Mira este producto espectacular: ${p.name}!`,
                        url: shareUrl
                    }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                        showPinterestToast(`¡Enlace copiado al portapapeles!`);
                    }).catch(console.error);
                }
            });

            const optionsBtn = card.querySelector('.options-btn');
            optionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPinterestToast(`Opciones de Pin: Descargar imagen o reportar`);
            });

            // Navigation handler
            const handleNav = () => {
                window.location.href = `product-detail.html?id=${p.id || p._id}`;
            };
            card.querySelector('.product-card__image').addEventListener('click', handleNav);
            card.querySelector('.product-card__name').addEventListener('click', handleNav);

            container.appendChild(card);
        });

    } catch (err) {
        console.error('Arrivals Aggregator Failure:', err);
        container.innerHTML = '<p style="color:#ef4444; text-align:center; grid-column:1/-1; font-weight:600;">Service Connection Latency Fault</p>';
    }
}
