export async function loadLatestArrivals(productService, gridElementId) {
    const container = document.getElementById(gridElementId);
    if (!container) return;

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

            return `
                <div class="product-card" onclick="window.location.href='product-detail.html?id=${p.id || p._id}'" style="cursor:pointer;">
                    <div class="product-card__image">
                        <img src="${secureImg}" class="product-card__img" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-card__info">
                        <div class="product-card__header">
                            <div class="product-card__name">${p.name}</div>
                            <div class="product-card__price">${Number(p.price).toFixed(2)}€</div>
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
