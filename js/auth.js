/* CampusEats - Authentication Controller */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      
      let registeredUsers = {};
      try {
        registeredUsers = JSON.parse(localStorage.getItem('campusEats_registered_users') || '{}');
      } catch (err) {}

      let userObj = registeredUsers[email.toLowerCase()];
      if (!userObj) {
        const emailPrefix = email.split('@')[0] || 'User';
        const formattedName = emailPrefix
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        userObj = {
          name: formattedName,
          email: email,
          role: 'Student',
          phone: '',
          hostel: ''
        };
        registeredUsers[email.toLowerCase()] = userObj;
        localStorage.setItem('campusEats_registered_users', JSON.stringify(registeredUsers));
      }

      localStorage.setItem('campusEats_user', JSON.stringify(userObj));
      window.location.href = 'dashboard.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();

      const userObj = {
        name: name,
        email: email,
        role: 'Student',
        phone: '',
        hostel: ''
      };

      let registeredUsers = {};
      try {
        registeredUsers = JSON.parse(localStorage.getItem('campusEats_registered_users') || '{}');
      } catch (err) {}

      registeredUsers[email.toLowerCase()] = userObj;
      localStorage.setItem('campusEats_registered_users', JSON.stringify(registeredUsers));
      localStorage.setItem('campusEats_user', JSON.stringify(userObj));
      window.location.href = 'dashboard.html';
    });
  }
});
