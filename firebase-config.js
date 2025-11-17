/*
 * Firebase Configuration
 * This file initializes Firebase for our application
 * We use Firebase Authentication for user login and Cloud Firestore for our database
 */

// Import Firebase services from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase project configuration (provided by Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAKjiCa76Ex0hwYKCg3r4uNEwQSvTzEr1w",
  authDomain: "is371website-hogansogolov.firebaseapp.com",
  projectId: "is371website-hogansogolov",
  storageBucket: "is371website-hogansogolov.firebasestorage.app",
  messagingSenderId: "322247805105",
  appId: "1:322247805105:web:e869838a9ed086c43f7a90"
};

// Initialize Firebase app with our configuration
const app = initializeApp(firebaseConfig);

// Get Firebase services we'll use in our app
export const auth = getAuth(app);      // For user authentication (sign up/sign in)
export const db = getFirestore(app);   // For database operations (store/retrieve data)
