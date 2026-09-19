/* CampusEats - Order Tracking Controller */

document.addEventListener('DOMContentLoaded', () => {
  startCountdown();
});

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
