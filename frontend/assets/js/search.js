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

        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer';

            const img = p.image && p.image.startsWith('/uploads') 
                ? `http://${window.location.hostname}:5000${p.image}` 
                : (p.image || 'https://via.placeholder.com/300');
            
            card.innerHTML = `
              <div class="product-card__image">
                <img src="${img}" alt="${p.name}" class="product-card__img">
              </div>
              <div class="product-card__info">
                <div class="product-card__header">
                  <div class="product-card__name">${p.name}</div>
                  <div class="product-card__price">${p.price}€</div>
                </div>
                <div class="product-card__footer">
                  <div class="product-card__category">${(p.category||'').toUpperCase()}</div>
                </div>
              </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = `product-detail.html?id=${p.id || p._id}`;
            });

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
