/* CampusEats - Dashboard Interactive Controller with Sub-Categories & Diet Preferences */

const subCategoryData = {
  all: [
    { id: 'all', label: 'All Items' }
  ],
  breakfast: [
    { id: 'all', label: 'All Breakfast' },
    { id: 'paratha', label: 'Paratha' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'poha', label: 'Poha' },
    { id: 'upma', label: 'Upma' },
    { id: 'south-indian', label: 'South Indian' },
    { id: 'cereals', label: 'Cereals' },
    { id: 'healthy-breakfast', label: 'Healthy Breakfast' }
  ],
  lunch: [
    { id: 'all', label: 'All Lunch' },
    { id: 'thali', label: 'Thali' },
    { id: 'rice-meals', label: 'Rice Meals' },
    { id: 'roti-sabzi', label: 'Roti & Sabzi' },
    { id: 'bowl-meals', label: 'Bowl Meals' },
    { id: 'wraps', label: 'Wraps' },
    { id: 'dal-rice', label: 'Dal & Rice' },
    { id: 'quick-meals', label: 'Quick Meals' }
  ],
  snacks: [
    { id: 'all', label: 'All Snacks' },
    { id: 'samosa', label: 'Samosa' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'fries', label: 'Fries' },
    { id: 'momos', label: 'Momos' },
    { id: 'wraps', label: 'Wraps' },
    { id: 'rolls', label: 'Rolls' },
    { id: 'quick-bites', label: 'Quick Bites' }
  ],
  drinks: [
    { id: 'all', label: 'All Drinks' },
    { id: 'tea', label: 'Tea' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'juices', label: 'Juices' },
    { id: 'shakes', label: 'Shakes' },
    { id: 'smoothies', label: 'Smoothies' },
    { id: 'cold-drinks', label: 'Cold Drinks' },
    { id: 'no-added-sugar', label: 'No Added Sugar' }
  ],
  desserts: [
    { id: 'all', label: 'All Desserts' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'pastries', label: 'Pastries' },
    { id: 'ice-cream', label: 'Ice Cream' },
    { id: 'indian-sweets', label: 'Indian Sweets' },
    { id: 'fruit-desserts', label: 'Fruit Desserts' },
    { id: 'chocolate', label: 'Chocolate' },
    { id: 'puddings', label: 'Puddings' }
  ],
  healthy: [
    { id: 'all', label: 'All' },
    { id: 'no-added-sugar', label: 'No Added Sugar' },
    { id: 'protein-rich', label: 'Protein Rich' },
    { id: 'high-fiber', label: 'High Fiber' },
    { id: 'low-oil', label: 'Low Oil' },
    { id: 'low-calorie', label: 'Low Calorie' },
    { id: 'light-meals', label: 'Light Meals' },
    { id: 'healthy-drinks', label: 'Healthy Drinks' }
  ]
};

let currentMainCategory = 'all';
let currentSubCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  updateBadgeCounts();
  setupCategoryFilters();
  setupSearch();
  setupNotifications();
  setupCartActions();
  setupWishlistActions();
});

function initStorage() {
  if (!localStorage.getItem('campusEats_cart')) {
    const defaultCart = [
      { id: 'paneer-wrap', name: 'Paneer Wrap', price: 89, qty: 2, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80' }
    ];
    localStorage.setItem('campusEats_cart', JSON.stringify(defaultCart));
  }
  if (!localStorage.getItem('campusEats_wishlist')) {
    const defaultWishlist = ['paneer-wrap', 'paneer-burger'];
    localStorage.setItem('campusEats_wishlist', JSON.stringify(defaultWishlist));
  }
}

function updateBadgeCounts() {
  const cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartBadges = document.querySelectorAll('.cart-badge-val, .badge-count');
  
  cartBadges.forEach(badge => {
    if (badge) badge.textContent = totalQty;
  });
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Category & Sub-Category Controller
function setupCategoryFilters() {
  const buttons = document.querySelectorAll('.category-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category || 'all';
      currentMainCategory = category;
      currentSubCategory = 'all';

      renderSubCategoriesRow(category);
      filterFoodCards();
    });
  });

  // Render initial sub-categories row for 'all'
  renderSubCategoriesRow('all');
}

function renderSubCategoriesRow(mainCat) {
  let wrapper = document.querySelector('.sub-categories-wrapper');
  const catSection = document.querySelector('.categories-list');

  if (!catSection) return;

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'sub-categories-wrapper';
    catSection.parentNode.insertBefore(wrapper, catSection.nextSibling);
  }

  const items = subCategoryData[mainCat] || subCategoryData.all;
  const isHealthy = mainCat === 'healthy';

  wrapper.innerHTML = `
    ${isHealthy ? '<div class="sub-cat-label">Diet Preferences</div>' : ''}
    <div class="sub-categories-list">
      ${items.map((sub, idx) => `
        <button class="sub-cat-btn ${idx === 0 ? 'active' : ''}" data-sub="${sub.id}">${sub.label}</button>
      `).join('')}
    </div>
  `;

  // Attach click events to sub-category buttons
  wrapper.querySelectorAll('.sub-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrapper.querySelectorAll('.sub-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSubCategory = btn.dataset.sub;
      filterFoodCards();
    });
  });
}

function filterFoodCards() {
  const foodCards = document.querySelectorAll('.food-card');

  foodCards.forEach(card => {
    const cardCat = card.dataset.category || 'all';
    const cardSub = card.dataset.subcategory || '';
    const cardTags = (card.dataset.tags || '').split(',').map(t => t.trim());

    let matchMain = (currentMainCategory === 'all' || cardCat === currentMainCategory);
    let matchSub = true;

    if (currentSubCategory !== 'all') {
      if (currentMainCategory === 'healthy') {
        matchSub = cardTags.includes(currentSubCategory);
        // If healthy is selected, also make sure it shows any item with matching diet tag
        matchMain = matchSub;
      } else {
        matchSub = (cardSub === currentSubCategory || cardTags.includes(currentSubCategory));
      }
    }

    if (matchMain && matchSub) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function setupSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const foodCards = document.querySelectorAll('.food-card');

    foodCards.forEach(card => {
      const name = card.querySelector('.food-name')?.textContent.toLowerCase() || '';
      if (name.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function setupNotifications() {
  const bellBtn = document.querySelector('.notification-btn');
  const dropdown = document.querySelector('.notification-dropdown');

  if (bellBtn && dropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }
}

function setupCartActions() {
  document.body.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-cart-btn');
    if (addBtn) {
      const card = addBtn.closest('.food-card');
      if (card) {
        const id = card.dataset.id;
        const name = card.querySelector('.food-name').textContent;
        const priceText = card.querySelector('.food-price').textContent.replace('₹', '');
        const price = parseFloat(priceText);
        const image = card.querySelector('.food-img').src;

        addToCart({ id, name, price, qty: 1, image });
      }
    }

    const dealBtn = e.target.closest('.grab-deal-btn');
    if (dealBtn) {
      addToCart({
        id: 'campus-deal',
        name: 'Burger + Fries + Drink Combo',
        price: 149,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80'
      });
    }

    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      const card = qtyBtn.closest('.food-card');
      if (card) {
        const id = card.dataset.id;
        const isPlus = qtyBtn.classList.contains('plus');
        const valElem = card.querySelector('.qty-val');
        let currentVal = parseInt(valElem.textContent);

        if (isPlus) {
          currentVal++;
        } else if (currentVal > 1) {
          currentVal--;
        }

        valElem.textContent = currentVal;
        updateCartItemQty(id, currentVal);
      }
    }
  });
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');
  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }

  localStorage.setItem('campusEats_cart', JSON.stringify(cart));
  updateBadgeCounts();
  showToast(`Added ${item.name} to cart!`);
}

function updateCartItemQty(id, qty) {
  let cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
    localStorage.setItem('campusEats_cart', JSON.stringify(cart));
    updateBadgeCounts();
    showToast(`Updated quantity for ${item.name}`);
  }
}

function setupWishlistActions() {
  document.body.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (!favBtn) return;

    const card = favBtn.closest('.food-card');
    const id = card ? card.dataset.id : null;
    if (!id) return;

    let wishlist = JSON.parse(localStorage.getItem('campusEats_wishlist') || '[]');
    favBtn.classList.toggle('active');

    if (favBtn.classList.contains('active')) {
      if (!wishlist.includes(id)) wishlist.push(id);
      showToast('Saved to Wishlist ❤');
    } else {
      wishlist = wishlist.filter(item => item !== id);
      showToast('Removed from Wishlist');
    }

    localStorage.setItem('campusEats_wishlist', JSON.stringify(wishlist));
  });
}
