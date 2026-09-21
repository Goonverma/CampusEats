/* CampusEats - Profile Controller */

document.addEventListener('DOMContentLoaded', () => {
  renderProfilePage();

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUser = getCurrentUser();
      const name = document.getElementById('profName').value.trim();
      const email = document.getElementById('profEmail').value.trim();
      const phone = document.getElementById('profPhone').value.trim();
      const hostel = document.getElementById('profHostel').value.trim();

      const updatedUser = {
        ...currentUser,
        name,
        email,
        phone,
        hostel,
        role: currentUser.role || 'Student'
      };

      setCurrentUser(updatedUser);
      renderProfilePage();
      if (window.renderUserProfileInNav) window.renderUserProfileInNav();
      showToast('Profile updated successfully!');
    });
  }
});

function renderProfilePage() {
  const user = getCurrentUser();

  const nameInput = document.getElementById('profName');
  const emailInput = document.getElementById('profEmail');
  const phoneInput = document.getElementById('profPhone');
  const hostelInput = document.getElementById('profHostel');

  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (hostelInput) hostelInput.value = user.hostel || '';

  const profNameTitle = document.querySelector('.profile-name');
  if (profNameTitle) profNameTitle.textContent = user.name || 'Student Profile';

  const profMeta = document.querySelector('.profile-meta');
  if (profMeta) {
    const roleText = user.role || 'Student';
    profMeta.textContent = `${roleText} • ${user.email || 'Registered User'}`;
  }

  const largeAvatar = document.querySelector('.large-avatar');
  if (largeAvatar) {
    const initials = getInitials(user.name);
    if (largeAvatar.tagName === 'IMG') {
      const div = document.createElement('div');
      div.className = largeAvatar.className;
      div.textContent = initials;
      largeAvatar.parentNode.replaceChild(div, largeAvatar);
    } else {
      largeAvatar.textContent = initials;
    }
  }
}
