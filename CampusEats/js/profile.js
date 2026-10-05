document.addEventListener('DOMContentLoaded', () => {
  renderProfilePage();
  setupDietPills();

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUser = getCurrentUser();
      const name = document.getElementById('profName').value.trim();
      const email = document.getElementById('profEmail').value.trim();
      const phone = document.getElementById('profPhone').value.trim();
      const hostel = document.getElementById('profHostel').value.trim();

      const selectedDietPrefs = [];
      document.querySelectorAll('.diet-checkbox-pill input:checked').forEach(cb => {
        selectedDietPrefs.push(cb.value);
      });

      const updatedUser = {
        ...currentUser,
        name,
        email,
        phone,
        hostel,
        dietPreferences: selectedDietPrefs,
        role: currentUser.role || 'Student'
      };

      setCurrentUser(updatedUser);
      if (typeof setUserDietPreferences === 'function') {
        setUserDietPreferences(selectedDietPrefs);
      }
      renderProfilePage();
      if (window.renderUserProfileInNav) window.renderUserProfileInNav();
      showToast('Profile & Dietary Preferences updated successfully!');
    });
  }
});

function setupDietPills() {
  document.querySelectorAll('.diet-checkbox-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const checkbox = pill.querySelector('input[type="checkbox"]');
      if (!checkbox) return;
      // Allow label click to toggle state cleanly
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        pill.classList.add('selected');
      } else {
        pill.classList.remove('selected');
      }
    });
  });
}

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

  // Render diet preferences pills state
  const dietPrefs = (typeof getUserDietPreferences === 'function') 
    ? getUserDietPreferences() 
    : (user.dietPreferences || []);

  document.querySelectorAll('.diet-checkbox-pill').forEach(pill => {
    const checkbox = pill.querySelector('input[type="checkbox"]');
    if (checkbox) {
      if (dietPrefs.includes(checkbox.value)) {
        checkbox.checked = true;
        pill.classList.add('selected');
      } else {
        checkbox.checked = false;
        pill.classList.remove('selected');
      }
    }
  });

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
