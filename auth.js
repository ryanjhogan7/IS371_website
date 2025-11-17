// Authentication Module
import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Current user state
export let currentUser = null;

// Initialize auth state observer
export function initAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            // Get additional user data from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                currentUser.userData = userDoc.data();
            }
            updateUIForAuthState(true);
        } else {
            // User is signed out
            currentUser = null;
            updateUIForAuthState(false);
        }
    });
}

// Sign up new user
export async function signUpUser(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with display name
        await updateProfile(user, {
            displayName: fullName
        });

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            displayName: fullName,
            email: email,
            createdAt: new Date().toISOString(),
            isAdmin: false // Default to non-admin user
        });

        return { success: true, user };
    } catch (error) {
        console.error("Sign up error:", error);
        return { success: false, error: error.message };
    }
}

// Sign in existing user
export async function signInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Sign in error:", error);
        return { success: false, error: error.message };
    }
}

// Sign out user
export async function signOutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Sign out error:", error);
        return { success: false, error: error.message };
    }
}

// Update UI based on authentication state
function updateUIForAuthState(isAuthenticated) {
    const authButtons = document.querySelector('.navbar-end .buttons');

    if (isAuthenticated && currentUser) {
        // Show user info and sign out button
        authButtons.innerHTML = `
            <div class="navbar-item has-text-white">
                <span class="icon mr-2">
                    <i class="fas fa-user"></i>
                </span>
                Welcome, ${currentUser.displayName || currentUser.email}
            </div>
            <div class="navbar-item">
                <button class="button is-light" id="signOutBtn">
                    <strong>Sign Out</strong>
                </button>
            </div>
        `;

        // Add sign out event listener
        document.getElementById('signOutBtn').addEventListener('click', async () => {
            const result = await signOutUser();
            if (result.success) {
                showNotification('Successfully signed out!', 'success');
                loadPage('home');
            } else {
                showNotification('Error signing out: ' + result.error, 'danger');
            }
        });
    } else {
        // Show sign in and sign up buttons
        authButtons.innerHTML = `
            <button class="button is-light" onclick="openModal('signinModal')">
                <strong>Sign In</strong>
            </button>
            <button class="button is-primary" onclick="openModal('signupModal')">
                <strong>Sign Up</strong>
            </button>
        `;
    }
}

// Show notification to user
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification is-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <button class="delete"></button>
        ${message}
    `;

    document.body.appendChild(notification);

    // Add delete functionality
    notification.querySelector('.delete').addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
