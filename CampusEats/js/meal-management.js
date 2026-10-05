import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { collection, doc, getDoc, onSnapshot, query, runTransaction, where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.replace('hosteller-access.html?mode=signin');
            return;
        }

        try {
            const profileSnapshot = await getDoc(doc(db, 'hostellerProfiles', user.uid));
            if (!profileSnapshot.exists()) {
                window.location.replace('hosteller-access.html?mode=signin');
                return;
            }

            const profile = profileSnapshot.data();
            if (profile.verificationStatus !== 'approved') {
                window.location.replace('hosteller-access.html?view=status');
                return;
            }

            document.getElementById('meal-access-gate').hidden = true;
            document.getElementById('meal-app').hidden = false;
            document.querySelectorAll('.user-name').forEach((element) => {
                element.textContent = profile.name;
            });
            document.querySelectorAll('.user-role').forEach((element) => {
                element.textContent = 'Hosteller';
            });
            const initials = profile.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
            document.querySelectorAll('.user-avatar').forEach((element) => {
                element.textContent = initials || 'H';
            });
            initializeMealInteractions(user.uid);
        } catch (error) {
            const gate = document.getElementById('meal-access-gate');
            gate.querySelector('h1').textContent = 'Unable to verify hostel access';
            gate.querySelector('p:not(.mm-eyebrow)').textContent = error.message || 'Check your connection and try again.';
        }
    });
});

function initializeMealInteractions(userId) {

    const dateInput = document.getElementById('meal-date');
    const dateLabel = document.getElementById('selected-date-label');
    const mealCards = Array.from(document.querySelectorAll('.mm-meal-card'));
    const bookingsList = document.getElementById('bookings-list');
    const cancelDialog = document.getElementById('cancel-dialog');
    const cancelDescription = document.getElementById('cancel-dialog-description');
    const confirmCancelButton = document.getElementById('confirm-cancel');
    const bookings = new Map();
    let selectedDate = toDateKey(new Date());
    let pendingCancellation = null;
    let selectedBooking = null;
    let busyCards = new Set();

    function notify(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    }

    function bookingDocumentId(date, mealType) {
        return `${userId}_${date}_${mealType}`;
    }

    function showBookingError(error) {
        if (error.code === 'permission-denied') {
            notify('Unable to save meal booking. Please check access permissions.', 'error');
            return;
        }
        notify('Meal booking failed. Please try again.', 'error');
    }

    async function getApprovedUser() {
        const user = auth.currentUser;
        if (!user) {
            notify('Please sign in with your hosteller account.', 'error');
            window.location.href = 'hosteller-access.html?mode=signin';
            return null;
        }
        if (user.uid !== userId) {
            notify('Your sign-in changed. Please sign in again.', 'error');
            window.location.href = 'hosteller-access.html?mode=signin';
            return null;
        }

        try {
            const profileSnapshot = await getDoc(doc(db, 'hostellerProfiles', user.uid));
            if (!profileSnapshot.exists()) {
                notify('Hosteller profile not found. Please sign in again.', 'error');
                window.location.href = 'hosteller-access.html?mode=signin';
                return null;
            }
            const status = profileSnapshot.data().verificationStatus;
            if (status === 'pending') {
                notify('Hostel Verification Pending.', 'error');
                return null;
            }
            if (status === 'rejected') {
                notify('Hostel verification rejected.', 'error');
                return null;
            }
            if (status !== 'approved') {
                notify('Hostel verification is not approved.', 'error');
                return null;
            }
            return user;
        } catch (error) {
            if (error.code === 'permission-denied') {
                notify('Unable to verify hostel access. Please check access permissions.', 'error');
            } else {
                notify('Unable to verify hostel access. Please try again.', 'error');
            }
            return null;
        }
    }

    function toDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function dateFromOffset(offset) {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        return date;
    }

    function formatDate(dateKey) {
        return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }

    function isMealClosed(card) {
        if (selectedDate !== toDateKey(new Date())) return false;
        const [hours, minutes] = card.dataset.cutoff.split(':').map(Number);
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes() >= hours * 60 + minutes;
    }

    function openCancellation(key) {
        const booking = bookings.get(key);
        if (!booking) return;
        pendingCancellation = key;
        selectedBooking = booking;
        cancelDescription.textContent = `Cancel your ${booking.meal.toLowerCase()} booking for ${formatDate(key.split(':')[0])}?`;
        cancelDialog.showModal();
    }

    function renderSelectedDate() {
        dateInput.value = selectedDate;
        dateLabel.textContent = selectedDate === toDateKey(new Date())
            ? `Bookings for today, ${formatDate(selectedDate)}`
            : `Bookings for ${formatDate(selectedDate)}`;
        document.querySelectorAll('.mm-date-chip').forEach((button) => {
            const active = toDateKey(dateFromOffset(Number(button.dataset.dateOffset))) === selectedDate;
            button.classList.toggle('is-selected', active);
            button.setAttribute('aria-pressed', String(active));
        });
        renderMealCards();
        renderBookings();
    }

    function renderMealCards() {
        mealCards.forEach((card) => {
            const key = `${selectedDate}:${card.dataset.meal}`;
            const booked = bookings.has(key);
            const closed = isMealClosed(card);
            const button = card.querySelector('[data-action="book"]');
            const cancelButton = card.querySelector('[data-action="cancel"]');
            const isBusy = busyCards.has(key);
            card.classList.toggle('is-booked', booked);
            card.querySelector('.mm-status-label').textContent = booked ? 'Booked' : closed ? 'Booking Closed' : 'Not Booked';
            button.textContent = booked ? 'Booked' : closed ? 'Booking Closed' : `Book ${card.dataset.meal}`;
            button.disabled = closed || isBusy;
            button.setAttribute('aria-pressed', String(booked));
            cancelButton.hidden = !booked;
            cancelButton.disabled = isBusy;
        });
    }

    function renderBookings() {
        const entries = Array.from(bookings.entries()).sort(([first], [second]) => first.localeCompare(second));
        if (entries.length === 0) {
            bookingsList.innerHTML = '<div class="mm-empty-state"><span class="mm-empty-symbol" aria-hidden="true">+</span><div><h3>No meal bookings yet</h3><p>Book a meal to see it here.</p></div></div>';
            return;
        }

        bookingsList.innerHTML = entries.map(([key, booking]) => {
            const [dateKey] = key.split(':');
            return `<article class="mm-booking-row"><div class="mm-booking-detail"><span class="mm-meal-icon ${booking.iconClass}" aria-hidden="true">${booking.initial}</span><div><strong>${booking.meal}</strong><span>${formatDate(dateKey)} · ${booking.time}</span></div></div><button class="mm-cancel-button" type="button" data-cancel-key="${key}">Cancel booking</button></article>`;
        }).join('');
    }

    function loadUserBookings() {
        const userBookingsQuery = query(
            collection(db, 'mealBookings'),
            where('userId', '==', userId)
        );
        onSnapshot(userBookingsQuery, (snapshot) => {
            bookings.clear();
            snapshot.forEach((bookingSnapshot) => {
                const booking = bookingSnapshot.data();
                if (booking.status !== 'booked' || booking.userId !== userId) return;
                const card = mealCards.find((mealCard) => mealCard.dataset.meal === booking.mealType);
                if (!card) return;
                const icon = card.querySelector('.mm-meal-icon');
                const key = `${booking.date}:${booking.mealType}`;
                bookings.set(key, {
                    meal: booking.mealType,
                    date: booking.date,
                    time: card.querySelector('.mm-meal-copy p').textContent,
                    initial: icon.textContent,
                    iconClass: icon.classList[1]
                });
            });
            renderSelectedDate();
        }, (error) => {
            if (error.code === 'permission-denied') {
                notify('Unable to load meal bookings. Please check access permissions.', 'error');
            } else {
                notify('Unable to load meal bookings. Please try again.', 'error');
            }
        });
    }

    async function bookMeal(card) {
        const date = selectedDate;
        const mealType = card.dataset.meal;
        const key = `${date}:${mealType}`;
        if (busyCards.has(key) || isMealClosed(card)) return;
        busyCards.add(key);
        renderMealCards();

        try {
            const user = await getApprovedUser();
            if (!user) return;

            const bookingReference = doc(db, 'mealBookings', bookingDocumentId(date, mealType));
            const result = await runTransaction(db, async (transaction) => {
                const bookingSnapshot = await transaction.get(bookingReference);
                if (bookingSnapshot.exists() && bookingSnapshot.data().status === 'booked') {
                    return 'duplicate';
                }

                transaction.set(bookingReference, {
                    userId: user.uid,
                    date,
                    mealType,
                    status: 'booked'
                });
                return 'booked';
            });

            if (result === 'duplicate') {
                notify('Meal already booked.', 'error');
                return;
            }

            bookings.set(key, {
                meal: mealType,
                date,
                time: card.querySelector('.mm-meal-copy p').textContent,
                initial: card.querySelector('.mm-meal-icon').textContent,
                iconClass: card.querySelector('.mm-meal-icon').classList[1]
            });
            renderSelectedDate();
            renderBookings();
            notify('Meal booked successfully.');
        } catch (error) {
            showBookingError(error);
        } finally {
            busyCards.delete(key);
            renderSelectedDate();
        }
    }

    async function cancelMeal() {
        const key = pendingCancellation;
        const booking = selectedBooking;
        if (!key || !booking || busyCards.has(key)) return;
        busyCards.add(key);
        renderMealCards();

        try {
            const user = await getApprovedUser();
            if (!user) return;
            const bookingReference = doc(db, 'mealBookings', bookingDocumentId(booking.date, booking.meal));
            const result = await runTransaction(db, async (transaction) => {
                const bookingSnapshot = await transaction.get(bookingReference);
                if (!bookingSnapshot.exists() || bookingSnapshot.data().status !== 'booked') {
                    return 'not-booked';
                }
                transaction.update(bookingReference, { status: 'cancelled' });
                return 'cancelled';
            });

            if (result === 'not-booked') {
                bookings.delete(key);
                notify('Meal booking is no longer active.', 'error');
            } else {
                bookings.delete(key);
                notify('Meal booking cancelled.');
            }
            cancelDialog.close();
            renderSelectedDate();
            renderBookings();
        } catch (error) {
            showBookingError(error);
        } finally {
            busyCards.delete(key);
            renderSelectedDate();
        }
    }

    document.querySelectorAll('.mm-date-chip').forEach((button) => {
        button.addEventListener('click', () => {
            selectedDate = toDateKey(dateFromOffset(Number(button.dataset.dateOffset)));
            renderSelectedDate();
        });
    });

    dateInput.min = toDateKey(new Date());
    dateInput.addEventListener('change', () => {
        if (dateInput.value) {
            selectedDate = dateInput.value;
            renderSelectedDate();
        }
    });

    mealCards.forEach((card) => {
        card.querySelector('[data-action="book"]').addEventListener('click', async () => {
            await bookMeal(card);
        });

        card.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            openCancellation(`${selectedDate}:${card.dataset.meal}`);
        });
    });

    bookingsList.addEventListener('click', (event) => {
        const button = event.target.closest('[data-cancel-key]');
        if (!button) return;
        openCancellation(button.dataset.cancelKey);
    });

    confirmCancelButton.addEventListener('click', async (event) => {
        event.preventDefault();
        confirmCancelButton.disabled = true;
        await cancelMeal();
        confirmCancelButton.disabled = false;
    });

    cancelDialog.addEventListener('close', () => {
        pendingCancellation = null;
        selectedBooking = null;
    });

    renderSelectedDate();
    loadUserBookings();
}