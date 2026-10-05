/* CampusEats - AI-Assisted Recommendation Engine (Viva Explainable Model) */

/**
 * Recommendation Engine concept for viva explanation:
 * 1. Read User Activity (Orders, Wishlist, Cart, Diet Preferences, Viewed Categories)
 * 2. Analyze Food Tags & Categories against activity
 * 3. Assign recommendation scores to menuItems (+5 Diet, +4 Ordered Category, +3 Wishlist Category, +2 Ordered Tags, +1 Viewed Category)
 * 4. Sort foods descending by score
 * 5. Return top 3-4 recommendations with explainable AI reason strings
 */

function getAIRecommendations() {
  // Ensure menu items database is available
  const items = (typeof menuItems !== 'undefined' && Array.isArray(menuItems)) 
    ? menuItems 
    : (window.menuItems || []);

  if (!items || items.length === 0) {
    return { isPersonalized: false, recommendations: [] };
  }

  // Retrieve current user data (scoped by logged-in user email)
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const orders = typeof getUserOrders === 'function' ? getUserOrders() : [];
  const wishlist = typeof getUserWishlist === 'function' ? getUserWishlist() : [];
  const cart = typeof getUserCart === 'function' ? getUserCart() : [];
  
  // Custom user diet preferences (saved in user profile or localStorage)
  let dietPreferences = [];
  if (user && Array.isArray(user.dietPreferences)) {
    dietPreferences = user.dietPreferences;
  } else if (typeof getUserDietPreferences === 'function') {
    dietPreferences = getUserDietPreferences();
  }

  // Category view counts tracked during browsing
  let viewedCategories = [];
  if (typeof getUserViewedCategories === 'function') {
    viewedCategories = getUserViewedCategories();
  }

  // Check if there is enough real user data/activity
  const hasOrders = orders && orders.length > 0;
  const hasWishlist = wishlist && wishlist.length > 0;
  const hasDietPrefs = dietPreferences && dietPreferences.length > 0;
  const hasCart = cart && cart.length > 0;
  const hasViews = viewedCategories && viewedCategories.length > 0;

  const hasActivity = hasOrders || hasWishlist || hasDietPrefs || hasCart || hasViews;

  if (!hasActivity) {
    // Return empty state signal when no real activity exists
    return {
      isPersonalized: false,
      recommendations: []
    };
  }

  // Extract signals from orders
  const orderedCategoryCounts = {};
  const orderedTagsSet = new Set();
  const orderedItemIds = new Set();

  orders.forEach(order => {
    const orderItems = order.items || [];
    orderItems.forEach(item => {
      if (item.id) orderedItemIds.add(item.id);
      // Find full menu item definition to get rich tags & categories
      const fullItem = items.find(m => m.id === item.id || m.name === item.name);
      if (fullItem) {
        if (fullItem.mainCategory) {
          orderedCategoryCounts[fullItem.mainCategory] = (orderedCategoryCounts[fullItem.mainCategory] || 0) + (item.qty || 1);
        }
        if (fullItem.subCategory) {
          orderedCategoryCounts[fullItem.subCategory] = (orderedCategoryCounts[fullItem.subCategory] || 0) + (item.qty || 1);
        }
        if (Array.isArray(fullItem.tags)) {
          fullItem.tags.forEach(tag => orderedTagsSet.add(tag.toLowerCase()));
        }
      }
    });
  });

  // Extract signals from wishlist
  const wishlistCategoryCounts = {};
  const wishlistItemIds = new Set(wishlist || []);
  const wishlistTagsSet = new Set();

  wishlistItemIds.forEach(id => {
    const fullItem = items.find(m => m.id === id);
    if (fullItem) {
      if (fullItem.mainCategory) {
        wishlistCategoryCounts[fullItem.mainCategory] = (wishlistCategoryCounts[fullItem.mainCategory] || 0) + 1;
      }
      if (fullItem.subCategory) {
        wishlistCategoryCounts[fullItem.subCategory] = (wishlistCategoryCounts[fullItem.subCategory] || 0) + 1;
      }
      if (Array.isArray(fullItem.tags)) {
        fullItem.tags.forEach(tag => wishlistTagsSet.add(tag.toLowerCase()));
      }
    }
  });

  // Most frequent category in order history
  let topOrderedCategory = null;
  let maxOrderCatCount = 0;
  Object.keys(orderedCategoryCounts).forEach(cat => {
    if (orderedCategoryCounts[cat] > maxOrderCatCount) {
      maxOrderCatCount = orderedCategoryCounts[cat];
      topOrderedCategory = cat;
    }
  });

  // Most frequent category in wishlist
  let topWishlistCategory = null;
  let maxWishlistCatCount = 0;
  Object.keys(wishlistCategoryCounts).forEach(cat => {
    if (wishlistCategoryCounts[cat] > maxWishlistCatCount) {
      maxWishlistCatCount = wishlistCategoryCounts[cat];
      topWishlistCategory = cat;
    }
  });

  // Normalized diet preferences array (lowercase)
  const normalizedDietPrefs = dietPreferences.map(p => p.toLowerCase().trim());

  // Score each item in menu
  const scoredItems = items.map(food => {
    let score = 0;
    let primaryReason = '';
    let matchedTag = '';

    const foodMainCat = (food.mainCategory || '').toLowerCase();
    const foodSubCat = (food.subCategory || '').toLowerCase();
    const foodTags = (food.tags || []).map(t => t.toLowerCase());

    // 1. Diet Preference Match (+5 points per matching tag)
    if (normalizedDietPrefs.length > 0) {
      foodTags.forEach(tag => {
        if (normalizedDietPrefs.includes(tag)) {
          score += 5;
          if (!matchedTag) matchedTag = formatTagLabel(tag);
          if (!primaryReason) {
            primaryReason = `Matches your selected preference for ${formatTagLabel(tag)} food.`;
          }
        }
      });
    }

    // 2. Order History Category Match (+4 points)
    if (topOrderedCategory && (foodMainCat === topOrderedCategory.toLowerCase() || foodSubCat === topOrderedCategory.toLowerCase())) {
      score += 4;
      if (!primaryReason) {
        primaryReason = `Recommended because you often order from ${formatCategoryLabel(topOrderedCategory)}.`;
      }
    }

    // 3. Wishlist Category/Item Match (+3 points)
    if (wishlistItemIds.has(food.id)) {
      score += 3;
      if (!primaryReason) {
        primaryReason = `Saved in your wishlist.`;
      }
    } else if (topWishlistCategory && (foodMainCat === topWishlistCategory.toLowerCase() || foodSubCat === topWishlistCategory.toLowerCase())) {
      score += 3;
      if (!primaryReason) {
        primaryReason = `Similar to delicious items in your wishlist.`;
      }
    }

    // 4. Order History Tags Match (+2 points per tag)
    foodTags.forEach(tag => {
      if (orderedTagsSet.has(tag)) {
        score += 2;
        if (!matchedTag) matchedTag = formatTagLabel(tag);
        if (!primaryReason) {
          primaryReason = `Recommended because you often choose ${formatTagLabel(tag)} meals.`;
        }
      }
    });

    // 5. Frequently Viewed Categories Match (+1 point)
    if (viewedCategories.includes(foodMainCat) || viewedCategories.includes(foodSubCat)) {
      score += 1;
      if (!primaryReason) {
        primaryReason = `Matches your recent food browsing activity.`;
      }
    }

    // 6. Base rating bonus to break ties nicely
    score += (food.rating || 4.0) * 0.5;

    // Pick fallback tag if none selected
    if (!matchedTag && foodTags.length > 0) {
      matchedTag = formatTagLabel(foodTags[0]);
    } else if (!matchedTag) {
      matchedTag = formatCategoryLabel(food.mainCategory || 'Chef Pick');
    }

    // Default primary reason if score was purely base rating tie-breaker
    if (!primaryReason && score > (food.rating * 0.5)) {
      primaryReason = `Matches your preferred campus food choices.`;
    }

    return {
      item: food,
      score: score,
      reason: primaryReason,
      matchedTag: matchedTag,
      hasPersonalizedSignal: (score >= 2.0)
    };
  });

  // Sort foods descending by recommendation score
  scoredItems.sort((a, b) => b.score - a.score);

  // Filter top 4 recommendations
  const topRecommendations = scoredItems.slice(0, 4).map(res => ({
    ...res.item,
    aiReason: res.reason || 'Popular choice matching your activity.',
    displayTag: res.matchedTag
  }));

  return {
    isPersonalized: true,
    recommendations: topRecommendations
  };
}

// Helper formatting utilities
function formatTagLabel(tagStr) {
  if (!tagStr) return 'Healthy Pick';
  const map = {
    'protein-rich': 'Protein Rich',
    'no-added-sugar': 'No Added Sugar',
    'high-fiber': 'High Fiber',
    'low-oil': 'Low Oil',
    'low-calorie': 'Low Calorie',
    'light-meal': 'Light Meal',
    'light-meals': 'Light Meal',
    'healthy-drink': 'Healthy Drink',
    'healthy-drinks': 'Healthy Drink',
    'quick-bites': 'Quick Bite'
  };
  return map[tagStr.toLowerCase()] || tagStr.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatCategoryLabel(catStr) {
  if (!catStr) return 'Menu Item';
  return catStr.charAt(0).toUpperCase() + catStr.slice(1);
}

// Make globally available
window.getAIRecommendations = getAIRecommendations;
window.formatTagLabel = formatTagLabel;
