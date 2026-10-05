import { createUserWithEmailAndPassword, deleteUser, getIdTokenResult, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { collection, doc, getDoc, onSnapshot, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const USER_COLLECTION = 'users';
const PROFILE_COLLECTION = 'hostellerProfiles';

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
    return messages[error.code] || error.message || 'Something went wrong. Please try again.';
}

function showError(element, message) {
    element.textContent = message;
    element.hidden = false;
}

function getProfileReference(uid) {
    return doc(db, PROFILE_COLLECTION, uid);
}

async function readProfile(uid) {
    const snapshot = await getDoc(getProfileReference(uid));
    return snapshot.exists() ? snapshot.data() : null;
}

document.addEventListener('DOMContentLoaded', () => {
    const accessView = document.getElementById('auth-view');
    if (accessView) setupHostellerAccess();

    const requestsView = document.getElementById('verification-requests');
    if (requestsView) setupHostelAdmin(requestsView);
});

function setupHostellerAccess() {
    const params = new URLSearchParams(window.location.search);
    const signinForm = document.getElementById('hosteller-signin-form');
    const signupForm = document.getElementById('hosteller-signup-form');
    const verificationView = document.getElementById('verification-view');
    const verificationError = document.getElementById('verification-error');
    const signinError = document.getElementById('signin-error');
    const signupError = document.getElementById('signup-error');
    let stopProfileWatch = null;

    function setMode(mode) {
        if (stopProfileWatch) {
            stopProfileWatch();
            stopProfileWatch = null;
        }
        const signupMode = mode === 'signup';
        signinForm.hidden = signupMode;
        signupForm.hidden = !signupMode;
        document.getElementById('signin-tab').classList.toggle('is-active', !signupMode);
        document.getElementById('signup-tab').classList.toggle('is-active', signupMode);
        document.getElementById('signin-tab').setAttribute('aria-selected', String(!signupMode));
        document.getElementById('signup-tab').setAttribute('aria-selected', String(signupMode));
        document.getElementById('access-title').textContent = signupMode ? 'Hosteller Sign Up' : 'Hosteller Sign In';
        document.querySelector('.hosteller-subtitle').textContent = signupMode
            ? 'Submit your hostel details for admin verification.'
            : 'Use your hosteller details to access meal booking.';
        signinError.hidden = true;
        signupError.hidden = true;
        verificationView.hidden = true;
        document.getElementById('auth-view').hidden = false;
        history.replaceState(null, '', `hosteller-access.html?mode=${mode}`);
    }

    function showVerification(profile, uid) {
        document.getElementById('auth-view').hidden = true;
        verificationView.hidden = false;
        verificationError.hidden = true;
        verificationView.classList.remove('is-rejected', 'is-approved');
        const title = document.getElementById('verification-title');
        const message = document.getElementById('verification-message');
        const status = document.getElementById('verification-status');
        const symbol = document.getElementById('verification-symbol');
        const action = document.getElementById('status-signin');

        if (profile.verificationStatus === 'rejected') {
            verificationView.classList.add('is-rejected');
            title.textContent = 'Hostel Verification Rejected';
            message.textContent = 'Your hostel verification request was not approved. Contact your hostel administrator for assistance.';
            status.textContent = 'Rejected';
            symbol.textContent = '!';
            action.textContent = 'Return to Hosteller Sign In';
            action.onclick = () => setMode('signin');
        } else if (profile.verificationStatus === 'approved') {
            verificationView.classList.add('is-approved');
            title.textContent = 'Hostel Verification Approved';
            message.textContent = 'Your hostel details are verified. Continue to Meal Management.';
            status.textContent = 'Approved';
            symbol.textContent = 'OK';
            action.textContent = 'Continue to Meal Management';
            action.onclick = () => {
                window.location.href = 'meal-management.html';
            };
        } else {
            title.textContent = 'Hostel Verification Pending';
            message.textContent = 'Your hostel verification request has been submitted. Meal Management will be available after admin verification.';
            status.textContent = 'Pending Verification';
            symbol.textContent = '...';
            action.textContent = 'Return to Hosteller Sign In';
            action.onclick = () => setMode('signin');
        }
        history.replaceState(null, '', 'hosteller-access.html?view=status');

        if (uid && !stopProfileWatch) {
            stopProfileWatch = onSnapshot(getProfileReference(uid), (snapshot) => {
                if (snapshot.exists()) showVerification(snapshot.data(), null);
            }, (error) => showError(verificationError, friendlyFirebaseError(error)));
        }
    }

    async function showSignedInProfile(user) {
        try {
            const profile = await readProfile(user.uid);
            if (!profile) {
                showError(signinError, 'No hosteller profile was found for this account. Submit a Hosteller Sign Up request first.');
                return;
            }
            if (profile.verificationStatus === 'approved') {
                window.location.replace('meal-management.html');
                return;
            }
            showVerification(profile, user.uid);
        } catch (error) {
            showError(signinError, friendlyFirebaseError(error));
        }
    }

    document.getElementById('signin-tab').addEventListener('click', () => setMode('signin'));
    document.getElementById('signup-tab').addEventListener('click', () => setMode('signup'));
    document.querySelectorAll('[data-mode]').forEach((button) => {
        button.addEventListener('click', () => setMode(button.dataset.mode));
    });

    document.getElementById('status-signin').addEventListener('click', () => setMode('signin'));

    signinForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        signinError.hidden = true;
        const email = document.getElementById('hosteller-signin-email').value.trim();
        const password = document.getElementById('hosteller-signin-password').value;
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            await showSignedInProfile(credential.user);
        } catch (error) {
            showError(signinError, friendlyFirebaseError(error));
        }
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        signupError.hidden = true;
        const formData = new FormData(signupForm);
        const profile = {
            name: String(formData.get('name')).trim(),
            email: String(formData.get('email')).trim().toLowerCase(),
            block: String(formData.get('block')).trim(),
            roomNumber: String(formData.get('roomNumber')).trim(),
            enrollmentNumber: String(formData.get('enrollmentNumber')).trim(),
            verificationStatus: 'pending'
        };
        const password = String(formData.get('password'));

        let createdUser = null;
        try {
            const credential = await createUserWithEmailAndPassword(auth, profile.email, password);
            createdUser = credential.user;
            const userReference = doc(db, USER_COLLECTION, credential.user.uid);
            const profileReference = getProfileReference(credential.user.uid);
            const batch = writeBatch(db);
            batch.set(userReference, { name: profile.name, email: profile.email }, { merge: true });
            batch.set(profileReference, profile);
            await batch.commit();
            signupForm.reset();
            showVerification(profile, credential.user.uid);
        } catch (error) {
            if (createdUser) {
                try {
                    await deleteUser(createdUser);
                } catch {
                    // Keep the original Firestore error visible if cleanup is unavailable.
                }
            }
            showError(signupError, friendlyFirebaseError(error));
        }
    });

    if (params.has('signout')) {
        signOut(auth).then(() => setMode('signin')).catch((error) => showError(signinError, friendlyFirebaseError(error)));
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (!user || params.get('mode') === 'signup') return;
        showSignedInProfile(user);
    });

    if (params.get('mode') === 'signup') {
        setMode('signup');
    } else if (params.get('view') !== 'status') {
        setMode('signin');
    }
}

function setupHostelAdmin(container) {
    const errorElement = document.getElementById('admin-error');
    let stopWatching = null;

    function render(requests) {
        document.getElementById('request-count').textContent = `${requests.length} ${requests.length === 1 ? 'request' : 'requests'}`;
        container.replaceChildren();

        if (requests.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'hostel-admin-empty';
            empty.textContent = 'No hostel verification requests available.';
            container.append(empty);
            return;
        }

        requests.forEach((request) => {
            const card = document.createElement('article');
            card.className = 'hostel-request-card';
            const details = document.createElement('dl');
            details.className = 'hostel-request-details';
            const fields = [
                ['Name', request.name],
                ['Email', request.email],
                ['Block', request.block],
                ['Room Number', request.roomNumber],
                ['Enrollment Number', request.enrollmentNumber],
                ['Verification Status', request.verificationStatus]
            ];

            fields.forEach(([label, value]) => {
                const item = document.createElement('div');
                const term = document.createElement('dt');
                const description = document.createElement('dd');
                term.textContent = label;
                if (label === 'Verification Status') {
                    const status = document.createElement('span');
                    status.className = `hostel-request-status ${value}`;
                    status.textContent = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown';
                    description.append(status);
                } else {
                    description.textContent = value || '—';
                }
                item.append(term, description);
                details.append(item);
            });

            card.append(details);
            if (request.verificationStatus === 'pending') {
                const actions = document.createElement('div');
                actions.className = 'hostel-request-actions';
                [['approved', 'Approve', 'hostel-approve-button'], ['rejected', 'Reject', 'hostel-reject-button']].forEach(([status, label, className]) => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = className;
                    button.dataset.uid = request.uid;
                    button.dataset.nextStatus = status;
                    button.textContent = label;
                    actions.append(button);
                });
                card.append(actions);
            }
            container.append(card);
        });
    }

    container.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-uid][data-next-status]');
        if (!button) return;
        button.disabled = true;
        errorElement.hidden = true;
        try {
            await updateDoc(getProfileReference(button.dataset.uid), {
                verificationStatus: button.dataset.nextStatus
            });
        } catch (error) {
            showError(errorElement, friendlyFirebaseError(error));
            button.disabled = false;
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (stopWatching) {
            stopWatching();
            stopWatching = null;
        }
        if (!user) {
            render([]);
            showError(errorElement, 'Sign in with an authorized admin account to review hosteller requests.');
            return;
        }

        try {
            const token = await getIdTokenResult(user);
            if (token.claims.admin !== true) {
                render([]);
                showError(errorElement, 'This account does not have the required admin access.');
                return;
            }

            stopWatching = onSnapshot(collection(db, PROFILE_COLLECTION), (snapshot) => {
                errorElement.hidden = true;
                const requests = snapshot.docs.map((profileDocument) => ({
                    uid: profileDocument.id,
                    ...profileDocument.data()
                }));
                render(requests);
            }, (error) => {
                render([]);
                showError(errorElement, friendlyFirebaseError(error));
            });
        } catch (error) {
            render([]);
            showError(errorElement, friendlyFirebaseError(error));
        }
    });

    window.addEventListener('beforeunload', () => {
        if (stopWatching) stopWatching();
    });
}