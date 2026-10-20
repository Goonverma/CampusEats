import { getIdTokenResult, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const PROFILE_COLLECTION = 'hostellerProfiles';

function friendlyFirebaseError(error) {
    const messages = {
        'permission-denied': 'Firebase access was denied. Check the deployed Firestore security rules.',
        'unavailable': 'Firebase is temporarily unavailable. Try again shortly.'
    };
    return messages[error.code] || error.message || 'Something went wrong. Please try again.';
}

function showError(element, message) {
    element.textContent = message;
    element.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const requestsView = document.getElementById('verification-requests');
    if (requestsView) setupHostelAdmin(requestsView);
});

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
            container.append(card);
        });
    }

    onAuthStateChanged(auth, async (user) => {
        if (stopWatching) {
            stopWatching();
            stopWatching = null;
        }
        if (!user) {
            render([]);
            showError(errorElement, 'Sign in with an authorized CampusEats account to review hosteller requests.');
            return;
        }

        try {
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
}
