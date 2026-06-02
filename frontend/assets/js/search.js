import { productService } from './api-services.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBox = document.getElementById('search-box');
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('results-count');
    
    if (!searchBox || !grid) return;

    let catalog = [];
    
    try {
        catalog = await productService.getAll();
    } catch(err) {
        console.error("Store catalog error", err);
    }

    function render(list) {
        grid.innerHTML = '';
        
        if (list.length === 0) {
            countEl.textContent = 'Zero results found';
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding: 4rem 0; color:#94a3b8;">No products matched your keywords.</div>';
            return;
        }

        countEl.textContent = `${list.length} Results match your keyword`;

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

        list.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const img = p.image && p.image.startsWith('/uploads') 
                ? `http://${window.location.hostname}:5000${p.image}` 
                : (p.image || 'https://via.placeholder.com/300');
            
            // Elegant staggered aspects for a robust Pinterest masonry flow
            const aspects = ['0.8', '1.15', '1.0', '1.35', '0.9', '1.1', '1.25'];
            const cardAspect = aspects[(p.id || idx) % aspects.length];

            const isFavorited = getFavorites().includes(p.name);
            const favClass = isFavorited ? 'product-card__favorite-btn--active' : '';
            const favIcon = isFavorited ? 'heart' : 'heart-outline';

            card.innerHTML = `
              <div class="product-card__image" style="cursor:pointer; aspect-ratio: ${cardAspect};">
                <img src="${img}" alt="${p.name}" class="product-card__img">
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
                  <div class="product-card__price">${String(p.price).includes('€') ? p.price : p.price + '€'}</div>
                </div>
                <div class="product-card__footer">
                  <div class="product-card__category">${(p.category||'').toUpperCase()}</div>
                </div>
              </div>
            `;

            // Pinterest Save Red Button
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
                    showPinterestToast(`Eliminado de tus Favoritos`);
                }
            });

            // Heart Favorite Button
            const favBtn = card.querySelector('.product-card__favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nowFavorited = toggleFavorite(p.name);
                
                if (nowFavorited) {
                    favBtn.classList.add('product-card__favorite-btn--active');
                    favBtn.querySelector('ion-icon').setAttribute('name', 'heart');
                    showPinterestToast(`Añadido a tus Favoritos`);
                } else {
                    favBtn.classList.remove('product-card__favorite-btn--active');
                    favBtn.querySelector('ion-icon').setAttribute('name', 'heart-outline');
                    showPinterestToast(`Eliminado de tus Favoritos`);
                }
            });

            // Share button cute reaction
            card.querySelector('.share-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                showPinterestToast(`¡Enlace copiado al portapapeles!`);
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${window.location.origin}/pages/product-detail.html?id=${p.id || p._id}`);
                }
            });

            // Options button cute reaction
            card.querySelector('.options-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                showPinterestToast(`Colección: ${(p.category || 'Mobiliario').toUpperCase()}`);
            });

            // Detail routing on clicking image or name
            const handleDetail = () => {
                window.location.href = `product-detail.html?id=${p.id || p._id}`;
            };
            card.querySelector('.product-card__image').addEventListener('click', handleDetail);
            card.querySelector('.product-card__name').addEventListener('click', handleDetail);

            grid.appendChild(card);
        });
    }

    searchBox.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if (term.length < 1) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:4rem 0; color:#94a3b8; font-style:italic;">Type in the search bar above to start exploring the catalog.</div>';
            countEl.textContent = 'Awaiting input';
            return;
        }

        const hits = catalog.filter(p => {
            return (p.name && p.name.toLowerCase().includes(term)) || 
                   (p.category && p.category.toLowerCase().includes(term)) || 
                   (p.description && p.description.toLowerCase().includes(term));
        });

        render(hits);
    });
    
    // Handle deep linking auto-fill from URL params
    const qs = new URLSearchParams(window.location.search).get('q');
    if (qs) {
        searchBox.value = qs;
        // Small timeout to ensure catalog has populated or is ready
        setTimeout(() => searchBox.dispatchEvent(new Event('input')), 400);
    }
});
