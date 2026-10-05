/* CampusEats - Wishlist Page Controller */

document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

function renderWishlist() {
  const container = document.getElementById('wishlistGrid');
  if (!container) return;

  const wishlist = getUserWishlist();

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: #6B7280;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: #9CA3AF;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <h3>No Saved Wishlist Items</h3>
        <p style="font-size: 13px; margin-top: 4px;">Tap the heart icon on any dish to save it here!</p>
        <a href="menu.html" class="hero-btn" style="margin-top: 16px; display: inline-block;">Browse Menu →</a>
      </div>
    `;
    return;
  }

  // Full item catalogue matching menu
  const allItems = (typeof menuItems !== 'undefined' && Array.isArray(menuItems)) ? menuItems : [
    { id: 'paneer-burger', name: 'Paneer Burger', category: 'snacks', price: 89, rating: 4.6, reviews: 120, time: '15 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
    { id: 'white-sauce-pasta', name: 'White Sauce Pasta', category: 'lunch', price: 119, rating: 4.4, reviews: 98, time: '20 min', image: 'images/White-Sauce-Pasta.jpg' },
    { id: 'paneer-wrap', name: 'Paneer Wrap', category: 'snacks', price: 99, rating: 4.5, reviews: 210, time: '15 min', image: 'images/Paneer-Wrap.jpg' },
    { id: 'margherita-pizza', name: 'Margherita Pizza', category: 'lunch', price: 149, rating: 4.7, reviews: 310, time: '25 min', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80' },
    { id: 'stuffed-paratha', name: 'Aloo Paneer Paratha', category: 'breakfast', price: 69, rating: 4.7, reviews: 180, time: '12 min', image: 'images/Aloo-Paneer-Paratha.jpg' },
    { id: 'veg-club-sandwich', name: 'Veg Club Sandwich', category: 'breakfast', price: 75, rating: 4.5, reviews: 140, time: '10 min', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80' },
    { id: 'iced-cold-coffee', name: 'Iced Cold Coffee', category: 'drinks', price: 69, rating: 4.8, reviews: 180, time: '10 min', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80' },
    { id: 'chocolate-brownie', name: 'Fudge Brownie', category: 'desserts', price: 79, rating: 4.9, reviews: 240, time: '10 min', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80' }
  ];

  const saved = allItems.filter(item => wishlist.includes(item.id));

  container.innerHTML = saved.map(item => `
    <div class="food-card" data-id="${item.id}">
      <div class="food-img-wrapper">
        <img src="${item.image}" class="food-img" alt="${item.name}">
        <button class="fav-btn active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div class="food-info">
        <div class="food-name">${item.name}</div>
        <div class="food-meta">
          <div class="food-rating">⭐ ${item.rating} (${item.reviews})</div>
          <div class="food-time">⏱ ${item.time}</div>
        </div>
        <div class="food-bottom">
          <div class="food-price">₹${item.price}</div>
          <button class="add-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}
