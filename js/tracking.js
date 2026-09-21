/* CampusEats - Order Tracking Controller */

document.addEventListener('DOMContentLoaded', () => {
  renderTrackingView();
});

function renderTrackingView() {
  const container = document.querySelector('.dashboard-grid');
  if (!container) return;

  const orders = getUserOrders();
  const activeOrder = orders.find(o => o.status === 'Preparing' || o.status === 'Confirmed' || o.status === 'Placed');
  const user = getCurrentUser();

  if (!activeOrder) {
    container.innerHTML = `
      <div class="current-order-card" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
        <div style="font-size: 40px; margin-bottom: 12px;">📍</div>
        <h2 style="font-size: 20px; font-weight: 800; color: var(--primary-navy); margin-bottom: 6px;">No Active Order to Track</h2>
        <p style="font-size: 13px; color: var(--secondary-text); margin-bottom: 20px;">Place an order from our menu to track its status live.</p>
        <a href="menu.html" class="hero-btn" style="display: inline-block;">Browse Menu →</a>
      </div>
    `;
    return;
  }

  const hostelText = user.hostel || 'Hostel 4, Room 208, North Campus';

  container.innerHTML = `
    <div class="current-order-card" style="grid-column: 1 / -1;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-size: 22px; font-weight: 800; color: var(--primary-navy);">Order ${activeOrder.id}</h1>
          <p style="color: #6B7280; font-size: 13px;">${hostelText}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; color: #6B7280;">Estimated Delivery Time</div>
          <div id="countdownTimer" style="font-size: 28px; font-weight: 800; color: var(--gold-accent);">14:59</div>
        </div>
      </div>

      <div class="progress-tracker" style="margin: 28px 0;">
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

      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-color); padding: 16px; border-radius: var(--radius-md); flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--soft-gold); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--primary-navy);">
            🛵
          </div>
          <div>
            <div style="font-weight: 700; font-size: 15px;">Rahul Kumar</div>
            <div style="font-size: 12px; color: #6B7280;">Campus Express Delivery Partner</div>
          </div>
        </div>
        <button class="add-cart-btn" onclick="showToast('Calling Rahul Kumar...')">📞 Call Partner</button>
      </div>
    </div>
  `;

  startCountdown();
}

function startCountdown() {
  let minutes = 14;
  let seconds = 59;
  const timeElem = document.getElementById('countdownTimer');
  if (!timeElem) return;

  const timer = setInterval(() => {
    seconds--;
    if (seconds < 0) {
      minutes--;
      seconds = 59;
    }

    if (minutes < 0) {
      clearInterval(timer);
      timeElem.textContent = 'Arrived!';
      return;
    }

    const minStr = minutes < 10 ? '0' + minutes : minutes;
    const secStr = seconds < 10 ? '0' + seconds : seconds;
    timeElem.textContent = `${minStr}:${secStr}`;
  }, 1000);
}
