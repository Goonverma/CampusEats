import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFK1dnyWVHobF6H2uBL9tzHCnVVJECtuo",
  authDomain: "campuseats-e8cac.firebaseapp.com",
  projectId: "campuseats-e8cac",
  storageBucket: "campuseats-e8cac.firebasestorage.app",
  messagingSenderId: "963530789943",
  appId: "1:963530789943:web:0b9b7c8d43dc94d0ac5bb2",
  measurementId: "G-M3FC2JF89Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
