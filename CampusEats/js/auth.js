/* CampusEats - Authentication Controller */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      localStorage.setItem('campusEats_user', JSON.stringify({ name: 'Goon Verma', email, role: 'Student' }));
      window.location.href = 'dashboard.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      localStorage.setItem('campusEats_user', JSON.stringify({ name, email, role: 'Student' }));
      window.location.href = 'dashboard.html';
    });
  }
});
