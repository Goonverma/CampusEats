/* CampusEats - Profile Controller */

document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('profName').value;
      const email = document.getElementById('profEmail').value;
      const phone = document.getElementById('profPhone').value;
      const hostel = document.getElementById('profHostel').value;

      localStorage.setItem('campusEats_user', JSON.stringify({ name, email, phone, hostel, role: 'Student' }));
      showToast('Profile updated successfully!');
    });
  }
});
