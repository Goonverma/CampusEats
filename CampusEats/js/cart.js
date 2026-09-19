/* CampusEats - Cart Page Controller */

document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();

  const applyPromoBtn = document.getElementById('applyPromoBtn');
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const code = document.getElementById('promoCodeInput')?.value.toUpperCase().trim();
      if (code === 'CAMPUS25') {
        localStorage.setItem('campusEats_discount', '0.25');
        showToast('Promo code CAMPUS25 applied (25% OFF)!');
        renderCartItems();
      } else {
        showToast('Invalid Promo Code. Try CAMPUS25', 'error');
      }
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');
      if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
      }
      
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const itemsSummary = cart.map(i => `${i.name} × ${i.qty}`).join(', ');
      const currentUser = JSON.parse(localStorage.getItem('campusEats_user') || '{}');

      const newOrder = {
        id: '#CE' + Math.floor(1000 + Math.random() * 9000),
        items: cart,
        itemsSummary: itemsSummary,
        date: dateFormatted,
        status: 'Preparing',
        total: calculateTotal(cart),
        userEmail: currentUser.email || 'guest'
      };
      
      const orders = JSON.parse(localStorage.getItem('campusEats_orders') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('campusEats_orders', JSON.stringify(orders));
      localStorage.setItem('campusEats_cart', JSON.stringify([]));
      
      showToast('Order Placed Successfully! Redirecting to tracker...');
      setTimeout(() => {
        window.location.href = 'tracking.html';
      }, 1500);
    });
  }
});

function renderCartItems() {
  const cartContainer = document.getElementById('cartItemsList');
  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #6B7280;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: #9CA3AF;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <h3>Your Cart is Empty</h3>
        <p style="font-size: 13px; margin-top: 4px;">Explore our delicious campus menu!</p>
        <a href="menu.html" class="hero-btn" style="margin-top: 16px;">Browse Menu →</a>
      </div>
    `;
    updateSummary(0);
    return;
  }

  cartContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row" data-id="${item.id}">
      <div class="cart-item-details">
        <img src="${item.image}" class="cart-item-img" alt="${item.name}">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price} each</div>
        </div>
      </div>
      <div>
        <div class="qty-control" style="width: fit-content;">
          <button class="qty-btn minus-cart" onclick="changeCartQty(${index}, -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn plus-cart" onclick="changeCartQty(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-total">₹${item.price * item.qty}</div>
      <div>
        <button class="remove-item-btn" onclick="removeCartItem(${index})" title="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');

  updateSummary(cart);
}

function changeCartQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');
  if (!cart[index]) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem('campusEats_cart', JSON.stringify(cart));
  if (window.updateBadgeCounts) updateBadgeCounts();
  renderCartItems();
}

function removeCartItem(index) {
  let cart = JSON.parse(localStorage.getItem('campusEats_cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('campusEats_cart', JSON.stringify(cart));
  if (window.updateBadgeCounts) updateBadgeCounts();
  renderCartItems();
  showToast('Item removed from cart');
}

function calculateTotal(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountRate = parseFloat(localStorage.getItem('campusEats_discount') || '0');
  const discount = subtotal * discountRate;
  const delivery = subtotal > 200 || subtotal === 0 ? 0 : 25;
  const taxes = subtotal > 0 ? 18 : 0;
  return Math.round(subtotal - discount + delivery + taxes);
}

function updateSummary(cart) {
  if (typeof cart === 'number') {
    document.getElementById('subtotalVal').textContent = '₹0';
    document.getElementById('deliveryVal').textContent = '₹0';
    document.getElementById('taxesVal').textContent = '₹0';
    document.getElementById('totalVal').textContent = '₹0';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountRate = parseFloat(localStorage.getItem('campusEats_discount') || '0');
  const discount = subtotal * discountRate;
  const delivery = subtotal > 200 || subtotal === 0 ? 0 : 25;
  const taxes = subtotal > 0 ? 18 : 0;
  const grandTotal = Math.round(subtotal - discount + delivery + taxes);

  document.getElementById('subtotalVal').textContent = `₹${subtotal}`;
  document.getElementById('deliveryVal').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  document.getElementById('taxesVal').textContent = `₹${taxes}`;
  document.getElementById('totalVal').textContent = `₹${grandTotal}`;

  const discountRow = document.getElementById('discountRow');
  if (discountRow) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('discountVal').textContent = `-₹${Math.round(discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
}
