/* CampusEats - Menu Page Controller with Complete Sub-Categories, Diet Preferences & Precise Image Mappings */

const menuItems = [
  // BREAKFAST
  {
    id: 'stuffed-paratha',
    name: 'Aloo Paneer Paratha',
    mainCategory: 'breakfast',
    subCategories: ['paratha', 'healthy-breakfast'],
    subCategory: 'paratha',
    tags: ['protein-rich'],
    price: 69,
    rating: 4.7,
    reviews: 180,
    time: '12 min',
    isVeg: true,
    image: 'images/Aloo-Paneer-Paratha.jpg'
  },
  {
    id: 'veg-club-sandwich',
    name: 'Veg Club Sandwich',
    mainCategory: 'breakfast',
    subCategories: ['sandwiches', 'quick-bites'],
    subCategory: 'sandwiches',
    tags: ['high-fiber', 'light-meal', 'light-meals'],
    price: 75,
    rating: 4.5,
    reviews: 140,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'indori-poha',
    name: 'Indori Steamed Poha',
    mainCategory: 'breakfast',
    subCategories: ['poha', 'healthy-breakfast'],
    subCategory: 'poha',
    tags: ['high-fiber', 'low-oil', 'low-calorie', 'light-meal', 'light-meals'],
    price: 49,
    rating: 4.6,
    reviews: 210,
    time: '10 min',
    isVeg: true,
    image: 'images/Indori-Steamed-Poha.jpg'
  },
  {
    id: 'rava-upma',
    name: 'Vegetable Rava Upma',
    mainCategory: 'breakfast',
    subCategories: ['upma', 'healthy-breakfast'],
    subCategory: 'upma',
    tags: ['low-oil', 'light-meal', 'light-meals'],
    price: 55,
    rating: 4.4,
    reviews: 115,
    time: '10 min',
    isVeg: true,
    image: 'images/Vegetable-Rava-Upma.jpg'
  },
  {
    id: 'masala-dosa',
    name: 'Crispy Masala Dosa',
    mainCategory: 'breakfast',
    subCategories: ['south-indian'],
    subCategory: 'south-indian',
    tags: ['high-fiber', 'low-oil', 'light-meal', 'light-meals'],
    price: 79,
    rating: 4.5,
    reviews: 150,
    time: '15 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'idli-sambar',
    name: 'Steamed Idli Sambar',
    mainCategory: 'breakfast',
    subCategories: ['south-indian', 'healthy-breakfast'],
    subCategory: 'south-indian',
    tags: ['low-oil', 'low-calorie', 'light-meal', 'light-meals', 'high-fiber'],
    price: 59,
    rating: 4.6,
    reviews: 185,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'oats-nut-bowl',
    name: 'Oats & Berries Bowl',
    mainCategory: 'breakfast',
    subCategories: ['cereals', 'healthy-breakfast'],
    subCategory: 'healthy-breakfast',
    tags: ['no-added-sugar', 'high-fiber', 'protein-rich', 'low-calorie', 'light-meal', 'light-meals'],
    price: 99,
    rating: 4.8,
    reviews: 95,
    time: '8 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'granola-bowl',
    name: 'Crunchy Granola Cereal Bowl',
    mainCategory: 'breakfast',
    subCategories: ['cereals', 'healthy-breakfast'],
    subCategory: 'cereals',
    tags: ['high-fiber', 'protein-rich', 'light-meal', 'light-meals'],
    price: 89,
    rating: 4.7,
    reviews: 130,
    time: '8 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=400&q=80'
  },

  // LUNCH
  {
    id: 'rajma-rice-bowl',
    name: 'Special Rajma Rice Bowl',
    mainCategory: 'lunch',
    subCategories: ['rice-meals', 'bowl-meals', 'dal-rice'],
    subCategory: 'rice-meals',
    tags: ['protein-rich', 'high-fiber'],
    price: 109,
    rating: 4.7,
    reviews: 290,
    time: '15 min',
    isVeg: true,
    image: 'images/Special-Rajma-Rice-Bowl.jpg'
  },
  {
    id: 'dal-makhani-rice',
    name: 'Dal Makhani & Jeera Rice',
    mainCategory: 'lunch',
    subCategories: ['rice-meals', 'dal-rice', 'bowl-meals'],
    subCategory: 'dal-rice',
    tags: ['protein-rich', 'high-fiber'],
    price: 115,
    rating: 4.8,
    reviews: 210,
    time: '15 min',
    isVeg: true,
    image: 'images/Dal-Makhani-&-Jeera Rice.jpg'
  },
  {
    id: 'paneer-roti-combo',
    name: 'Paneer Butter Masala & Butter Roti',
    mainCategory: 'lunch',
    subCategories: ['roti-sabzi', 'quick-meals'],
    subCategory: 'roti-sabzi',
    tags: ['protein-rich'],
    price: 129,
    rating: 4.6,
    reviews: 175,
    time: '20 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'white-sauce-pasta',
    name: 'White Sauce Pasta',
    mainCategory: 'lunch',
    subCategories: ['quick-meals'],
    subCategory: 'quick-meals',
    tags: ['light-meal', 'light-meals'],
    price: 119,
    rating: 4.4,
    reviews: 98,
    time: '20 min',
    isVeg: true,
    image: 'images/White-Sauce-Pasta.jpg'
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    mainCategory: 'lunch',
    subCategories: ['quick-meals'],
    subCategory: 'quick-meals',
    tags: ['light-meal', 'light-meals'],
    price: 149,
    rating: 4.7,
    reviews: 310,
    time: '25 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'paneer-thali',
    name: 'Shahi Paneer Thali',
    mainCategory: 'lunch',
    subCategories: ['thali', 'roti-sabzi'],
    subCategory: 'thali',
    tags: ['protein-rich'],
    price: 139,
    rating: 4.6,
    reviews: 220,
    time: '20 min',
    isVeg: true,
    image: 'images/Shahi-Paneer-Thali.jpg'
  },
  {
    id: 'mexican-burrito-wrap',
    name: 'Mexican Burrito Bowl & Wrap',
    mainCategory: 'lunch',
    subCategories: ['wraps', 'bowl-meals'],
    subCategory: 'wraps',
    tags: ['protein-rich', 'high-fiber'],
    price: 125,
    rating: 4.7,
    reviews: 145,
    time: '18 min',
    isVeg: true,
    image: 'images/Mexican-Burrito-Bowl-&-Wrap.jpg'
  },

  // SNACKS
  {
    id: 'paneer-burger',
    name: 'Paneer Burger',
    mainCategory: 'snacks',
    subCategories: ['sandwiches', 'quick-bites'],
    subCategory: 'sandwiches',
    tags: ['protein-rich'],
    price: 89,
    rating: 4.6,
    reviews: 120,
    time: '15 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'paneer-wrap',
    name: 'Paneer Wrap',
    mainCategory: 'snacks',
    subCategories: ['wraps', 'rolls'],
    subCategory: 'wraps',
    tags: ['protein-rich', 'low-oil'],
    price: 99,
    rating: 4.5,
    reviews: 210,
    time: '15 min',
    isVeg: true,
    image: 'images/Paneer-Wrap.jpg'
  },
  {
    id: 'steamed-momos',
    name: 'Steamed Veg Momos',
    mainCategory: 'snacks',
    subCategories: ['momos', 'quick-bites'],
    subCategory: 'momos',
    tags: ['low-oil', 'low-calorie', 'light-meal', 'light-meals'],
    price: 79,
    rating: 4.6,
    reviews: 140,
    time: '12 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'samosa-chat',
    name: 'Crispy Samosa Chaat',
    mainCategory: 'snacks',
    subCategories: ['samosa', 'quick-bites'],
    subCategory: 'samosa',
    tags: ['quick-bites'],
    price: 49,
    rating: 4.7,
    reviews: 320,
    time: '8 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'peri-peri-fries',
    name: 'Peri Peri Crispy Fries',
    mainCategory: 'snacks',
    subCategories: ['fries', 'quick-bites'],
    subCategory: 'fries',
    tags: ['quick-bites'],
    price: 69,
    rating: 4.5,
    reviews: 280,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'kathi-paneer-roll',
    name: 'Kathi Paneer Roll',
    mainCategory: 'snacks',
    subCategories: ['rolls', 'wraps'],
    subCategory: 'rolls',
    tags: ['protein-rich'],
    price: 89,
    rating: 4.7,
    reviews: 165,
    time: '12 min',
    isVeg: true,
    image: 'images/Kathi-Paneer-Roll.jpg'
  },

  // DRINKS
  {
    id: 'iced-cold-coffee',
    name: 'Iced Cold Coffee',
    mainCategory: 'drinks',
    subCategories: ['coffee', 'cold-drinks', 'no-added-sugar'],
    subCategory: 'coffee',
    tags: ['no-added-sugar'],
    price: 69,
    rating: 4.8,
    reviews: 180,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    mainCategory: 'drinks',
    subCategories: ['tea'],
    subCategory: 'tea',
    tags: ['light-meal', 'light-meals'],
    price: 25,
    rating: 4.9,
    reviews: 420,
    time: '5 min',
    isVeg: true,
    image: 'images/Masala-Chai.jpg'
  },
  {
    id: 'apple-green-juice',
    name: 'Fresh Green Detox Juice',
    mainCategory: 'drinks',
    subCategories: ['juices', 'no-added-sugar'],
    subCategory: 'juices',
    tags: ['no-added-sugar', 'healthy-drink', 'healthy-drinks', 'low-calorie'],
    price: 89,
    rating: 4.7,
    reviews: 110,
    time: '8 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mango-smoothie',
    name: 'Mango Whey Protein Smoothie',
    mainCategory: 'drinks',
    subCategories: ['smoothies', 'shakes'],
    subCategory: 'smoothies',
    tags: ['protein-rich', 'healthy-drink', 'healthy-drinks'],
    price: 119,
    rating: 4.9,
    reviews: 165,
    time: '10 min',
    isVeg: true,
    image: 'images/Mango-Whey-Protein-Smoothie.jpg'
  },
  {
    id: 'chocolate-shake',
    name: 'Rich Chocolate Milkshake',
    mainCategory: 'drinks',
    subCategories: ['shakes', 'cold-drinks'],
    subCategory: 'shakes',
    tags: [],
    price: 99,
    rating: 4.8,
    reviews: 210,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80'
  },

  // DESSERTS
  {
    id: 'chocolate-brownie',
    name: 'Fudge Brownie',
    mainCategory: 'desserts',
    subCategories: ['chocolate', 'cakes'],
    subCategory: 'chocolate',
    tags: [],
    price: 79,
    rating: 4.9,
    reviews: 240,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'berry-pudding',
    name: 'Berry Yoghurt Parfait',
    mainCategory: 'desserts',
    subCategories: ['fruit-desserts', 'puddings'],
    subCategory: 'fruit-desserts',
    tags: ['no-added-sugar', 'low-calorie', 'high-fiber'],
    price: 89,
    rating: 4.8,
    reviews: 120,
    time: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'black-forest-pastry',
    name: 'Black Forest Pastry',
    mainCategory: 'desserts',
    subCategories: ['pastries', 'cakes', 'chocolate'],
    subCategory: 'pastries',
    tags: [],
    price: 69,
    rating: 4.7,
    reviews: 190,
    time: '8 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'belgian-chocolate-ice-cream',
    name: 'Belgian Chocolate Ice Cream',
    mainCategory: 'desserts',
    subCategories: ['ice-cream', 'chocolate'],
    subCategory: 'ice-cream',
    tags: [],
    price: 85,
    rating: 4.9,
    reviews: 275,
    time: '5 min',
    isVeg: true,
    image: 'images/Belgian-Chocolate-Ice-Cream.jpg'
  },
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun (2 Pcs)',
    mainCategory: 'desserts',
    subCategories: ['indian-sweets'],
    subCategory: 'indian-sweets',
    tags: [],
    price: 49,
    rating: 4.8,
    reviews: 340,
    time: '5 min',
    isVeg: true,
    image: 'images/Gulab-Jamun-(2 Pcs).jpg'
  }
];

const subCategoryMap = {
  all: [
    { id: 'all', label: 'All Items' }
  ],
  breakfast: [
    { id: 'all-breakfast', label: 'All Breakfast' },
    { id: 'paratha', label: 'Paratha' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'poha', label: 'Poha' },
    { id: 'upma', label: 'Upma' },
    { id: 'south-indian', label: 'South Indian' },
    { id: 'cereals', label: 'Cereals' },
    { id: 'healthy-breakfast', label: 'Healthy Breakfast' }
  ],
  lunch: [
    { id: 'all-lunch', label: 'All Lunch' },
    { id: 'thali', label: 'Thali' },
    { id: 'rice-meals', label: 'Rice Meals' },
    { id: 'roti-sabzi', label: 'Roti & Sabzi' },
    { id: 'bowl-meals', label: 'Bowl Meals' },
    { id: 'wraps', label: 'Wraps' },
    { id: 'dal-rice', label: 'Dal & Rice' },
    { id: 'quick-meals', label: 'Quick Meals' }
  ],
  snacks: [
    { id: 'all-snacks', label: 'All Snacks' },
    { id: 'samosa', label: 'Samosa' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'fries', label: 'Fries' },
    { id: 'momos', label: 'Momos' },
    { id: 'wraps', label: 'Wraps' },
    { id: 'rolls', label: 'Rolls' },
    { id: 'quick-bites', label: 'Quick Bites' }
  ],
  drinks: [
    { id: 'all-drinks', label: 'All Drinks' },
    { id: 'tea', label: 'Tea' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'juices', label: 'Juices' },
    { id: 'shakes', label: 'Shakes' },
    { id: 'smoothies', label: 'Smoothies' },
    { id: 'cold-drinks', label: 'Cold Drinks' },
    { id: 'no-added-sugar', label: 'No Added Sugar' }
  ],
  desserts: [
    { id: 'all-desserts', label: 'All Desserts' },
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

let currentMainCat = 'all';
let currentSubCat = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderMenuGrid(menuItems);
  setupMenuCategoryControls();

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      let sorted = [...menuItems];
      if (val === 'price-low') sorted.sort((a, b) => a.price - b.price);
      if (val === 'price-high') sorted.sort((a, b) => b.price - a.price);
      if (val === 'rating') sorted.sort((a, b) => b.rating - a.rating);
      renderFilteredItems(sorted);
    });
  }
});

function setupMenuCategoryControls() {
  const mainBtns = document.querySelectorAll('.category-btn');

  mainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mainBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category || 'all';
      currentMainCat = cat;

      // Set default subcategory ID
      const defaultSub = subCategoryMap[cat] ? subCategoryMap[cat][0].id : 'all';
      currentSubCat = defaultSub;

      renderMenuSubCatRow(cat);
      filterAndRenderMenu();
    });
  });

  // Render initial sub-categories for default active main category
  const activeMain = document.querySelector('.category-btn.active');
  const initialCat = activeMain ? (activeMain.dataset.category || 'all') : 'all';
  currentMainCat = initialCat;
  renderMenuSubCatRow(initialCat);
  filterAndRenderMenu();
}

function renderMenuSubCatRow(mainCat) {
  let wrapper = document.querySelector('.sub-categories-wrapper');
  const catSection = document.querySelector('.categories-list');

  if (!catSection) return;

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'sub-categories-wrapper';
    catSection.parentNode.insertBefore(wrapper, catSection.nextSibling);
  }

  const items = subCategoryMap[mainCat] || subCategoryMap.all;
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
      currentSubCat = btn.dataset.sub;
      filterAndRenderMenu();
    });
  });
}

function filterAndRenderMenu() {
  let filtered = menuItems.filter(item => {
    const itemMains = Array.isArray(item.mainCategories) ? item.mainCategories : [item.mainCategory];
    const itemSubs = Array.isArray(item.subCategories) ? item.subCategories : [item.subCategory];

    // Main category match
    let matchMain = (currentMainCat === 'all' || itemMains.includes(currentMainCat));
    let matchSub = true;

    if (currentMainCat === 'healthy') {
      if (currentSubCat !== 'all') {
        const altSub = currentSubCat === 'light-meals' ? 'light-meal' : (currentSubCat === 'healthy-drinks' ? 'healthy-drink' : currentSubCat);
        matchSub = item.tags.includes(currentSubCat) || item.tags.includes(altSub) || itemSubs.includes(currentSubCat);
        matchMain = matchSub;
      } else {
        matchMain = item.tags && item.tags.length > 0;
      }
    } else {
      if (!currentSubCat.startsWith('all')) {
        const altSub = currentSubCat === 'light-meals' ? 'light-meal' : (currentSubCat === 'healthy-drinks' ? 'healthy-drink' : currentSubCat);
        matchSub = itemSubs.includes(currentSubCat) || item.subCategory === currentSubCat || item.tags.includes(currentSubCat) || item.tags.includes(altSub);
      }
    }

    return matchMain && matchSub;
  });

  renderFilteredItems(filtered);
}

function renderFilteredItems(items) {
  const grid = document.getElementById('fullMenuGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #64748B;">
        <div style="font-size: 36px; margin-bottom: 12px;">🍽️</div>
        <h3 style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">No items available in this category yet.</h3>
        <p style="font-size: 13px;">Try selecting another sub-category or diet preference.</p>
      </div>
    `;
    return;
  }

  const wishlist = typeof getUserWishlist === 'function' ? getUserWishlist() : [];

  grid.innerHTML = items.map(item => `
    <div class="food-card" data-id="${item.id}" data-category="${item.mainCategory}" data-subcategory="${item.subCategory}" data-tags="${item.tags.join(',')}">
      <div class="food-img-wrapper">
        <img src="${item.image}" onerror="if(!this.dataset.retried){this.dataset.retried='true';if(this.src.indexOf('CampusEats/')===-1){this.src='CampusEats/'+'${item.image}';}}" class="food-img" alt="${item.name}">
        <button class="fav-btn ${wishlist.includes(item.id) ? 'active' : ''}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${wishlist.includes(item.id) ? '#EF4444' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div class="food-info">
        ${item.isVeg ? '<span class="veg-tag">● VEG</span>' : ''}
        <div class="food-name">${item.name}</div>
        <div class="food-meta">
          <div class="food-rating">
            <svg class="star-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ${item.rating} <span class="review-count">(${item.reviews})</span>
          </div>
          <div class="food-time">⏱ ${item.time}</div>
        </div>
        <div class="food-bottom">
          <div class="food-price">₹${item.price}</div>
          <button class="add-cart-btn">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMenuGrid(items) {
  renderFilteredItems(items);
}

