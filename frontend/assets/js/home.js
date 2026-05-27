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

    try {
        const allProducts = await productService.getAll();
        // Reverse to prioritize most recently added items
        const latestProducts = [...allProducts].reverse().slice(0, 4);

        if (latestProducts.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #888;">No stock listings detected. Connect control portal.</p>';
            return;
        }

        container.innerHTML = latestProducts.map(p => {
            // Handle consistent dynamic asset routing across all environments
            const imgUrl = p.image && p.image.startsWith('/uploads') 
                ? `https://${window.location.hostname.replace(':5000','')}${p.image}` // Safely mapping to external assets
                : (p.image || 'https://via.placeholder.com/300x300?text=Missing+Visual');
            
            // Fallback to secure production rewrite if explicitly running live, matching standard logic patterns elsewhere
            const secureImg = imgUrl.replace('http:', 'https:');

            const parsedPrice = typeof p.price === 'string'
                ? parseFloat(p.price.replace(/[^0-9.]/g, ''))
                : Number(p.price);
            const displayPrice = isNaN(parsedPrice) ? '0.00' : parsedPrice.toFixed(2);

            return `
                <div class="product-card" onclick="window.location.href='product-detail.html?id=${p.id || p._id}'" style="cursor:pointer;">
                    <div class="product-card__image">
                        <img src="${secureImg}" class="product-card__img" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-card__info">
                        <div class="product-card__header">
                            <div class="product-card__name">${p.name}</div>
                            <div class="product-card__price">${displayPrice}€</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Arrivals Aggregator Failure:', err);
        container.innerHTML = '<p style="color:#ef4444; text-align:center; grid-column:1/-1; font-weight:600;">Service Connection Latency Fault</p>';
    }
}
