// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKjiCa76Ex0hwYKCg3r4uNEwQSvTzEr1w",
  authDomain: "is371website-hogansogolov.firebaseapp.com",
  projectId: "is371website-hogansogolov",
  storageBucket: "is371website-hogansogolov.firebasestorage.app",
  messagingSenderId: "322247805105",
  appId: "1:322247805105:web:e869838a9ed086c43f7a90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
