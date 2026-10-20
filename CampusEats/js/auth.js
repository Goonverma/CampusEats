import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

async function readUserProfiles(user) {
  const [userSnapshot, hostellerSnapshot] = await Promise.all([
    getDoc(doc(db, 'users', user.uid)),
    getDoc(doc(db, 'hostellerProfiles', user.uid))
  ]);
  const profile = userSnapshot.exists() ? userSnapshot.data() : null;
  const hostellerProfile = hostellerSnapshot.exists() ? hostellerSnapshot.data() : null;

  const isHosteller = Boolean(hostellerProfile && hostellerProfile.verificationStatus === 'approved');
  const currentUser = {
    uid: user.uid,
    name: profile?.name || user.displayName || user.email?.split('@')[0] || 'Student',
    email: profile?.email || user.email || '',
    role: isHosteller ? 'Hosteller' : 'Student'
  };

  window.campusEatsUser = currentUser;
  window.campusEatsAuthState = { user, profile, hostellerProfile };
  return window.campusEatsAuthState;
}

window.campusEatsAuthReady = new Promise((resolve) => {
  let firstState = true;
  onAuthStateChanged(auth, async (user) => {
    try {
      let state;
      if (user) {
        state = await readUserProfiles(user);
      } else {
        window.campusEatsUser = null;
        state = window.campusEatsAuthState = { user: null, profile: null, hostellerProfile: null };
      }
      if (firstState) {
        firstState = false;
        resolve(state);
      }
    } catch (error) {
      console.error('Unable to load the signed-in CampusEats profile.', error);
      window.campusEatsUser = user ? {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Student',
        email: user.email || '',
        role: 'Student'
      } : null;
      window.campusEatsAuthState = { user, profile: null, hostellerProfile: null, error };
      if (firstState) {
        firstState = false;
        resolve(window.campusEatsAuthState);
      }
      reportError(error, 'Unable to load your CampusEats profile. Please try again.');
    }
  }, (error) => {
    console.error('Unable to read Firebase Authentication state.', error);
    window.campusEatsAuthState = { user: null, profile: null, hostellerProfile: null, error };
    if (firstState) {
      firstState = false;
      resolve(window.campusEatsAuthState);
    }
    reportError(error, 'Unable to check your sign-in status. Please try again.');
  });
});

function reportError(error, fallbackMessage) {
  const message = friendlyFirebaseError(error) || fallbackMessage;
  const status = document.getElementById('auth-message');
  if (status) {
    status.textContent = message;
    status.hidden = false;
    status.setAttribute('role', 'alert');
  } else if (typeof window.showToast === 'function') {
    window.showToast(message, 'error');
  }
}

function friendlyFirebaseError(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email. Sign in instead.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/network-request-failed': 'Network unavailable. Check your connection and try again.',
    'permission-denied': 'Firebase access was denied. Check the deployed Firestore security rules.',
    'unavailable': 'Firebase is temporarily unavailable. Try again shortly.'
  };
  return messages[error?.code] || error?.message || 'Something went wrong. Please try again.';
}

window.saveCampusEatsProfile = async ({ name, email }) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to update your profile.');
  if (email.trim().toLowerCase() !== (user.email || '').toLowerCase()) {
    throw new Error('Your profile email must match the email used to sign in.');
  }
  const profile = { name: name.trim(), email: user.email };
  await setDoc(doc(db, 'users', user.uid), profile);
  window.campusEatsUser = { ...window.campusEatsUser, ...profile, uid: user.uid, role: 'Student' };
};

function setAuthMessage(message, isError = false) {
  const status = document.getElementById('auth-message');
  if (!status) return;
  if (!message) {
    status.hidden = true;
    status.textContent = '';
    return;
  }
  status.textContent = message;
  status.hidden = false;
  status.setAttribute('role', isError ? 'alert' : 'status');
}

function setupSignupForm(form) {
  const typeInput = document.getElementById('studentType');
  const hostellerFields = document.getElementById('hostellerFields');
  const continueLink = document.getElementById('auth-continue');

  function updateStudentTypeFields() {
    const isHosteller = typeInput.value === 'Hosteller';
    hostellerFields.hidden = !isHosteller;
    hostellerFields.querySelectorAll('input').forEach((input) => {
      input.required = isHosteller;
    });
  }
  typeInput.addEventListener('change', updateStudentTypeFields);
  updateStudentTypeFields();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setAuthMessage('');
    continueLink.hidden = true;

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const studentType = typeInput.value;
    const isHosteller = studentType === 'Hosteller';
    const hostellerProfile = isHosteller ? {
      name,
      email,
      block: document.getElementById('block').value.trim(),
      roomNumber: document.getElementById('roomNumber').value.trim(),
      enrollmentNumber: document.getElementById('enrollmentNumber').value.trim(),
      verificationStatus: 'pending'
    } : null;
    let createdUser = null;

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      createdUser = credential.user;
      const batch = writeBatch(db);
      batch.set(doc(db, 'users', credential.user.uid), { name, email });

      if (hostellerProfile) {
        batch.set(doc(db, 'hostellerProfiles', credential.user.uid), hostellerProfile);
      }

      await batch.commit();
      const savedProfile = { name, email };
      window.campusEatsUser = { uid: credential.user.uid, ...savedProfile, role: isHosteller ? 'Hosteller' : 'Student' };
      window.campusEatsAuthState = {
        user: credential.user,
        profile: savedProfile,
        hostellerProfile
      };
      setAuthMessage('Account created successfully! Redirecting...');
      if (continueLink) continueLink.hidden = false;
      setTimeout(() => {
        window.location.replace('dashboard.html');
      }, 500);
    } catch (error) {
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (cleanupError) {
          console.error('Could not remove the account after its profile write failed.', cleanupError);
          setAuthMessage('Your account was created, but its profile could not be saved. Please contact support before trying again.', true);
          return;
        }
      }
      setAuthMessage(friendlyFirebaseError(error), true);
    }
  });
}

function setupLoginForm(form) {
  const continueLink = document.getElementById('auth-continue');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setAuthMessage('');
    if (continueLink) continueLink.hidden = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await readUserProfiles(credential.user);
      setAuthMessage('Successfully signed in! Redirecting...');
      if (continueLink) continueLink.hidden = false;
      setTimeout(() => {
        window.location.replace('dashboard.html');
      }, 400);
    } catch (error) {
      setAuthMessage(friendlyFirebaseError(error), true);
    }
  });
}

function setupPageAuth() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const isPublicPage = Boolean(loginForm || signupForm);

  if (signupForm) setupSignupForm(signupForm);
  if (loginForm) setupLoginForm(loginForm);

  if (!isPublicPage) {
    window.campusEatsAuthReady.then((state) => {
      if (!state.user) {
        window.location.replace('login.html');
      }
    });
  }

  document.querySelectorAll('[data-sign-out]').forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await signOut(auth);
        window.campusEatsUser = null;
        window.location.replace('login.html');
      } catch (error) {
        reportError(error, 'Unable to sign out. Please try again.');
      }
    });
  });
}

setupPageAuth();
