/* CampusEats - Orders Page Controller */

document.addEventListener('DOMContentLoaded', () => {
  renderOrdersHistory();
});

function renderOrdersHistory() {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  const userOrders = JSON.parse(localStorage.getItem('campusEats_orders') || '[]');

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #6B7280;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: #9CA3AF;"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line></svg>
        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px;">No orders yet</h3>
        <p style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">You haven't placed any orders yet.</p>
        <a href="menu.html" class="hero-btn" style="display: inline-flex;">Browse Menu →</a>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.map(order => {
    const itemsSummary = order.itemsSummary || (order.items ? order.items.map(i => `${i.name}${i.qty > 1 ? ' × ' + i.qty : ''}`).join(', ') : 'Order Items');
    const statusClass = (order.status || 'Preparing').toLowerCase();

    return `
      <div class="cart-items-card" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F3F4F6; padding-bottom: 12px;">
          <div>
            <span style="font-weight: 800; font-size: 16px;">${order.id}</span>
            <span style="font-size: 12px; color: #6B7280; margin-left: 10px;">${order.date}</span>
          </div>
          <span class="status-badge ${statusClass}">${order.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px;">
          <div>
            <div style="font-size: 14px; font-weight: 600;">${itemsSummary}</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">Total Paid: <strong style="color: #111827;">₹${order.total}</strong></div>
          </div>
          <div>
            ${order.status === 'Preparing' ? `
              <a href="tracking.html" class="add-cart-btn" style="display: inline-block;">Track Order →</a>
            ` : `
              <button class="add-cart-btn" onclick="showToast('Re-ordering items...')">Reorder</button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
