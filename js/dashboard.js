/* CampusEats - Dashboard Interactive Controller with Real Dynamic User Data */

// User Authentication & Scoped Storage System
function getCurrentUser() {
  const userJson = localStorage.getItem('campusEats_user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {}
  }
  return {
    name: 'Student User',
    email: 'student@campus.edu',
    role: 'Student',
    phone: '',
    hostel: ''
  };
}

function setCurrentUser(userObj) {
  localStorage.setItem('campusEats_user', JSON.stringify(userObj));
  let registered = {};
  try {
    registered = JSON.parse(localStorage.getItem('campusEats_registered_users') || '{}');
  } catch (e) {}
  if (userObj && userObj.email) {
    registered[userObj.email.toLowerCase()] = userObj;
    localStorage.setItem('campusEats_registered_users', JSON.stringify(registered));
  }
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getUserKey(keyName) {
  const user = getCurrentUser();
  const safeEmail = (user.email || 'guest').toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `campusEats_${keyName}_${safeEmail}`;
}

function getUserCart() {
  const key = getUserKey('cart');
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function setUserCart(cartArray) {
  const key = getUserKey('cart');
  localStorage.setItem(key, JSON.stringify(cartArray));
}

function getUserWishlist() {
  const key = getUserKey('wishlist');
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function setUserWishlist(wishlistArray) {
  const key = getUserKey('wishlist');
  localStorage.setItem(key, JSON.stringify(wishlistArray));
}

function getUserOrders() {
  const key = getUserKey('orders');
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function setUserOrders(ordersArray) {
  const key = getUserKey('orders');
  localStorage.setItem(key, JSON.stringify(ordersArray));
}

// Make helpers available globally
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.getInitials = getInitials;
window.getUserKey = getUserKey;
window.getUserCart = getUserCart;
window.setUserCart = setUserCart;
window.getUserWishlist = getUserWishlist;
window.setUserWishlist = setUserWishlist;
window.getUserOrders = getUserOrders;
window.setUserOrders = setUserOrders;

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
  renderUserProfileInNav();
  updateBadgeCounts();
  updateDashboardKPIs();
  renderDashboardOrders();
  syncWishlistOnCards();
  setupCategoryFilters();
  setupSearch();
  setupNotifications();
  setupCartActions();
  setupWishlistActions();
  setupLogoutHandler();
});

function renderUserProfileInNav() {
  const user = getCurrentUser();
  const initials = getInitials(user.name);

  document.querySelectorAll('.user-name').forEach(el => {
    el.textContent = user.name || 'User';
  });

  document.querySelectorAll('.user-role').forEach(el => {
    el.textContent = user.role || 'Student';
  });

  document.querySelectorAll('.user-avatar').forEach(avatar => {
    if (avatar.tagName === 'IMG') {
      const div = document.createElement('div');
      div.className = avatar.className;
      div.textContent = initials;
      avatar.parentNode.replaceChild(div, avatar);
    } else {
      avatar.textContent = initials;
    }
  });

  document.querySelectorAll('.large-avatar').forEach(avatar => {
    if (avatar.tagName === 'IMG') {
      const div = document.createElement('div');
      div.className = avatar.className;
      div.textContent = initials;
      avatar.parentNode.replaceChild(div, avatar);
    } else {
      avatar.textContent = initials;
    }
  });

  const heroGreeting = document.querySelector('.hero-greeting');
  if (heroGreeting) {
    const hour = new Date().getHours();
    let timeGreeting = 'Good Afternoon,';
    if (hour < 12) timeGreeting = 'Good Morning,';
    else if (hour >= 17) timeGreeting = 'Good Evening,';
    heroGreeting.textContent = timeGreeting;
  }

  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const firstName = user.name ? user.name.split(' ')[0] : 'Student';
    heroName.innerHTML = `${firstName}! <span class="wave-emoji">👋</span>`;
  }
}
window.renderUserProfileInNav = renderUserProfileInNav;

function updateDashboardKPIs() {
  const orders = getUserOrders();
  const wishlist = getUserWishlist();

  // 1. Total Orders KPI
  const kpiOrdersNum = document.querySelector('.kpi-card:nth-child(1) .kpi-number');
  if (kpiOrdersNum) kpiOrdersNum.textContent = orders.length;

  // 2. Wishlist Items KPI
  const kpiWishlistNum = document.querySelector('.kpi-card:nth-child(2) .kpi-number');
  if (kpiWishlistNum) kpiWishlistNum.textContent = wishlist.length;

  // 3. Total Saved KPI
  const totalSaved = orders.reduce((sum, ord) => sum + (ord.savings || 0), 0);
  const kpiSavedNum = document.querySelector('.kpi-card:nth-child(3) .kpi-number');
  if (kpiSavedNum) kpiSavedNum.textContent = `₹${totalSaved}`;

  // 4. Favourite Items KPI (calculated from wishlist)
  const kpiFavNum = document.querySelector('.kpi-card:nth-child(4) .kpi-number');
  if (kpiFavNum) kpiFavNum.textContent = wishlist.length;
}
window.updateDashboardKPIs = updateDashboardKPIs;

function renderDashboardOrders() {
  const orders = getUserOrders();
  const activeOrder = orders.find(o => o.status === 'Preparing' || o.status === 'Confirmed' || o.status === 'Placed');

  const currentOrderCard = document.querySelector('.current-order-card');
  if (currentOrderCard) {
    if (activeOrder) {
      const firstItem = activeOrder.items && activeOrder.items.length > 0 ? activeOrder.items[0] : null;
      const itemImg = firstItem ? firstItem.image : 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80';
      const itemsSummary = activeOrder.itemsSummary || (activeOrder.items ? activeOrder.items.map(i => `${i.name} × ${i.qty}`).join(', ') : 'Campus Order');
      
      currentOrderCard.innerHTML = `
        <div class="order-card-header">
          <div class="order-card-title">Your Current Order</div>
          <span class="status-badge-prep">${activeOrder.status || 'Preparing'}</span>
        </div>

        <div class="order-meta-info">
          <span class="order-id-code">${activeOrder.id}</span>
          <span class="order-est-time">⏱ 15–20 mins</span>
        </div>

        <div class="progress-tracker">
          <div class="tracker-line"></div>
          <div class="tracker-line-fill" style="width: 50%;"></div>

          <div class="step-node completed">
            <div class="node-icon">✓</div>
            <span class="node-label">Placed</span>
          </div>
          <div class="step-node completed">
            <div class="node-icon">✓</div>
            <span class="node-label">Confirmed</span>
          </div>
          <div class="step-node active">
            <div class="node-icon">●</div>
            <span class="node-label">Preparing</span>
          </div>
          <div class="step-node">
            <div class="node-icon">○</div>
            <span class="node-label">Ready</span>
          </div>
          <div class="step-node">
            <div class="node-icon">○</div>
            <span class="node-label">Delivered</span>
          </div>
        </div>

        <div class="order-item-box">
          <img src="${itemImg}" alt="Order Item" class="item-thumb">
          <div class="item-name-qty" style="font-size: 13px; font-weight: 600;">${itemsSummary}</div>
          <div class="item-total-price">₹${activeOrder.total}</div>
        </div>

        <div class="chef-prep-box">
          <div class="chef-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 13.87A6 6 0 0 1 7.41 2a6 6 0 0 1 10.59 4.87A6 6 0 0 1 18 13.87V21H6v-7.13z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>
          </div>
          <div>
            <div class="prep-text-title">Your food is being prepared</div>
            <div class="prep-text-sub">We'll notify you once it's ready!</div>
          </div>
        </div>

        <a href="tracking.html" style="font-size: 12px; font-weight: 700; color: var(--primary-orange); text-align: center; margin-top: 4px; display: block;">View Live Order Tracking →</a>
      `;
    } else {
      currentOrderCard.innerHTML = `
        <div class="order-card-header">
          <div class="order-card-title">Your Current Order</div>
        </div>
        <div style="text-align: center; padding: 28px 12px; color: var(--secondary-text);">
          <div style="font-size: 32px; margin-bottom: 8px;">🛍️</div>
          <h4 style="font-size: 15px; font-weight: 700; color: var(--primary-navy); margin-bottom: 4px;">No active order</h4>
          <p style="font-size: 12px; margin-bottom: 14px; color: var(--secondary-text);">Place an order to track it here.</p>
          <a href="menu.html" class="hero-btn" style="display: inline-block; padding: 8px 16px; font-size: 12px;">Browse Menu →</a>
        </div>
      `;
    }
  }

  const recentOrdersCard = document.querySelector('.recent-orders-card');
  if (recentOrdersCard) {
    if (orders.length > 0) {
      const recentList = orders.slice(0, 3);
      recentOrdersCard.innerHTML = `
        <div class="section-header" style="margin-bottom: 12px;">
          <h3 class="order-card-title">Recent Orders</h3>
          <a href="orders.html" class="view-all-link">View All →</a>
        </div>
        ${recentList.map(order => {
          const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
          const thumb = firstItem ? firstItem.image : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80';
          const itemsCount = order.items ? order.items.reduce((s, i) => s + i.qty, 0) : 1;
          const statusClass = (order.status || 'Delivered').toLowerCase();

          return `
            <div class="recent-order-item">
              <img src="${thumb}" alt="Order Thumb" class="recent-item-thumb">
              <div class="recent-order-info">
                <span class="recent-order-id">${order.id}</span>
                <span class="recent-order-details">${itemsCount} item${itemsCount > 1 ? 's' : ''} • ₹${order.total}</span>
                <span class="recent-order-date">${order.date}</span>
              </div>
              <span class="status-badge ${statusClass}">${order.status}</span>
            </div>
          `;
        }).join('')}
      `;
    } else {
      recentOrdersCard.innerHTML = `
        <div class="section-header" style="margin-bottom: 12px;">
          <h3 class="order-card-title">Recent Orders</h3>
          <a href="orders.html" class="view-all-link">View All →</a>
        </div>
        <div style="text-align: center; padding: 24px 10px; color: var(--secondary-text);">
          <p style="font-size: 13px;">No recent orders</p>
        </div>
      `;
    }
  }
}
window.renderDashboardOrders = renderDashboardOrders;

function syncWishlistOnCards() {
  const wishlist = getUserWishlist();
  document.querySelectorAll('.food-card').forEach(card => {
    const id = card.dataset.id;
    const favBtn = card.querySelector('.fav-btn');
    if (favBtn && id) {
      if (wishlist.includes(id)) {
        favBtn.classList.add('active');
        const svg = favBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', '#EF4444');
      } else {
        favBtn.classList.remove('active');
        const svg = favBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'none');
      }
    }
  });
}
window.syncWishlistOnCards = syncWishlistOnCards;

function updateBadgeCounts() {
  const cart = getUserCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartBadges = document.querySelectorAll('.cart-badge-val, .badge-count');
  
  cartBadges.forEach(badge => {
    if (badge) badge.textContent = totalQty;
  });
}
window.updateBadgeCounts = updateBadgeCounts;

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
window.showToast = showToast;

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

  if (!bellBtn || !dropdown) return;

  renderNotifications();

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

function renderNotifications() {
  const dropdown = document.querySelector('.notification-dropdown');
  if (!dropdown) return;

  const orders = getUserOrders();
  const activeOrder = orders.find(o => o.status === 'Preparing' || o.status === 'Confirmed' || o.status === 'Placed');

  let notifHTML = `
    <div class="notif-header">
      <span>Notifications</span>
      <span style="font-size: 11px; color: var(--primary-orange); cursor: pointer;">Mark all read</span>
    </div>
  `;

  if (activeOrder) {
    notifHTML += `
      <div class="notif-item">
        <div class="notif-icon">🍳</div>
        <div class="notif-content">
          <div class="notif-title">Order ${activeOrder.id} is preparing!</div>
          <div class="notif-time">Just now</div>
        </div>
      </div>
    `;
  }

  notifHTML += `
    <div class="notif-item">
      <div class="notif-icon">🔥</div>
      <div class="notif-content">
        <div class="notif-title">Campus Deal 25% OFF active</div>
        <div class="notif-time">1 hour ago</div>
      </div>
    </div>
    <div class="notif-item">
      <div class="notif-icon">🎉</div>
      <div class="notif-content">
        <div class="notif-title">Welcome to CampusEats!</div>
        <div class="notif-time">Today</div>
      </div>
    </div>
  `;

  dropdown.innerHTML = notifHTML;
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
  let cart = getUserCart();
  const existing = cart.find(i => i.id === item.id);

  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }

  setUserCart(cart);
  updateBadgeCounts();
  showToast(`Added ${item.name} to cart!`);
}
window.addToCart = addToCart;

function updateCartItemQty(id, qty) {
  let cart = getUserCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = qty;
    setUserCart(cart);
    updateBadgeCounts();
    showToast(`Updated quantity for ${item.name}`);
  }
}
window.updateCartItemQty = updateCartItemQty;

function setupWishlistActions() {
  document.body.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (!favBtn) return;

    const card = favBtn.closest('.food-card');
    const id = card ? card.dataset.id : null;
    if (!id) return;

    let wishlist = getUserWishlist();
    favBtn.classList.toggle('active');

    if (favBtn.classList.contains('active')) {
      if (!wishlist.includes(id)) wishlist.push(id);
      const svg = favBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', '#EF4444');
      showToast('Saved to Wishlist ❤');
    } else {
      wishlist = wishlist.filter(item => item !== id);
      const svg = favBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'none');
      showToast('Removed from Wishlist');
    }

    setUserWishlist(wishlist);
    updateDashboardKPIs();
  });
}

function setupLogoutHandler() {
  document.querySelectorAll('a[href="login.html"]').forEach(link => {
    link.addEventListener('click', () => {
      localStorage.removeItem('campusEats_user');
    });
  });
}
