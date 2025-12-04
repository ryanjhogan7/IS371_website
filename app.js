/*
 * GolfClub Auctions - Main Application File
 * IS 371 Final Project by Ryan Hogan and Alan Sogolov
 *
 * This file contains all the JavaScript logic for our Single Page Application:
 * - Firebase Authentication (sign up, sign in, sign out)
 * - Firestore Database operations (create, read, delete listings)
 * - Page navigation and UI updates
 * - Form handling and filtering
 */

// ==================== FIREBASE IMPORTS ====================
// Import Firebase configuration and necessary functions
import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==================== GLOBAL VARIABLES ====================
let currentUser = null;  // Stores the currently logged-in user (null if not logged in)

// ==================== HELPER FUNCTIONS ====================

/**
 * Get the stock image URL for a given club type
 * @param {string} clubType - The type of golf club
 * @returns {string} The path to the stock image for this club type
 */
function getStockImageForClubType(clubType) {
    const imageMap = {
        'Driver': 'assets/club-images/driver.svg',
        'Fairway Wood': 'assets/club-images/fairway-wood.svg',
        'Hybrid': 'assets/club-images/hybrid.svg',
        'Iron Set': 'assets/club-images/iron-set.svg',
        'Individual Iron': 'assets/club-images/individual-iron.svg',
        'Wedge': 'assets/club-images/wedge.svg',
        'Putter': 'assets/club-images/putter.svg',
        'Complete Set': 'assets/club-images/complete-set.svg'
    };

    // Return the stock image for the club type, or a default if not found
    return imageMap[clubType] || 'assets/club-images/driver.svg';
}

// ==================== NOTIFICATION SYSTEM ====================

/**
 * Show a notification message instead of using alert()
 * @param {string} message - The message to display
 * @param {string} type - The type of notification: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    // Determine notification color based on type
    let notificationClass = 'is-info';
    let iconClass = 'fa-info-circle';

    switch(type) {
        case 'success':
            notificationClass = 'is-success';
            iconClass = 'fa-check-circle';
            break;
        case 'error':
            notificationClass = 'is-danger';
            iconClass = 'fa-exclamation-circle';
            break;
        case 'warning':
            notificationClass = 'is-warning';
            iconClass = 'fa-exclamation-triangle';
            break;
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${notificationClass} mb-3`;
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.innerHTML = `
        <button class="delete"></button>
        <span class="icon">
            <i class="fas ${iconClass}"></i>
        </span>
        <span>${message}</span>
    `;

    // Add to container
    container.appendChild(notification);

    // Add delete functionality
    const deleteBtn = notification.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==================== PAGE CONTENT TEMPLATES ====================
// These are the different "pages" of our Single Page Application
const pages = {
    home: `
        <!-- Hero Section -->
        <section class="hero is-primary is-fullheight-with-navbar">
            <div class="hero-body">
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column is-8 is-offset-2 has-text-centered">
                            <h1 class="title is-1 has-text-white mb-5">
                                <span class="icon is-large">
                                    <i class="fas fa-golf-ball fa-2x"></i>
                                </span>
                            </h1>
                            <h1 class="title is-1 has-text-white">
                                GolfClub Auctions
                            </h1>
                            <h2 class="subtitle is-3 has-text-white mb-6">
                                Buy and sell used golf clubs
                            </h2>

                            <div class="columns is-mobile is-multiline">
                                <div class="column is-half-mobile is-6-tablet is-6-desktop">
                                    <div class="box has-text-centered p-6" onclick="loadPage('browse')" style="cursor: pointer; height: 100%;">
                                        <span class="icon is-large has-text-primary mb-4">
                                            <i class="fas fa-search fa-3x"></i>
                                        </span>
                                        <h3 class="title is-4">Browse Auctions</h3>
                                        <p class="subtitle is-6">Find great deals on quality clubs</p>
                                        <button class="button is-primary is-medium mt-3">
                                            <span>Start Browsing</span>
                                            <span class="icon">
                                                <i class="fas fa-arrow-right"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div class="column is-half-mobile is-6-tablet is-6-desktop">
                                    <div class="box has-text-centered p-6" onclick="loadPage('create')" style="cursor: pointer; height: 100%;">
                                        <span class="icon is-large has-text-primary mb-4">
                                            <i class="fas fa-plus-circle fa-3x"></i>
                                        </span>
                                        <h3 class="title is-4">Create Listing</h3>
                                        <p class="subtitle is-6">List your clubs for sale</p>
                                        <button class="button is-primary is-medium mt-3">
                                            <span>Sell Your Clubs</span>
                                            <span class="icon">
                                                <i class="fas fa-arrow-right"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="content has-text-centered has-text-white-ter">
                    <p>By Ryan Hogan and Alan Sogolov | <a href="https://github.com/ryanjhogan7/IS371_website" target="_blank" class="has-text-white-ter">GitHub</a></p>
                </div>
            </div>
        </footer>
    `,

    browse: `
        <section class="section">
            <div class="container">
                <h1 class="title is-2">Browse All Auctions</h1>
                <p class="subtitle">Discover amazing deals on quality golf clubs</p>

                <!-- Filter Controls -->
                <div class="box">
                    <div class="columns">
                        <div class="column is-6">
                            <div class="field">
                                <label class="label">Club Type</label>
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select id="clubTypeFilter">
                                            <option>All Types</option>
                                            <option>Driver</option>
                                            <option>Fairway Wood</option>
                                            <option>Hybrid</option>
                                            <option>Iron Set</option>
                                            <option>Individual Iron</option>
                                            <option>Wedge</option>
                                            <option>Putter</option>
                                            <option>Complete Set</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column is-6">
                            <div class="field">
                                <label class="label">Price Range</label>
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select id="priceRangeFilter">
                                            <option>Any Price</option>
                                            <option>Under $100</option>
                                            <option>$100 - $250</option>
                                            <option>$250 - $500</option>
                                            <option>$500+</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <button class="button is-primary" id="applyFiltersBtn">
                            <span class="icon">
                                <i class="fas fa-filter"></i>
                            </span>
                            <span>Apply Filters</span>
                        </button>
                        <button class="button is-light" id="clearFiltersBtn">Clear</button>
                    </div>
                </div>

                <!-- Auction Grid -->
                <div id="listings-container" class="columns is-multiline">
                    <div class="column is-12">
                        <p id="listings-count" class="has-text-grey">Loading listings...</p>
                    </div>
                    <!-- Listings will be loaded dynamically here -->
                </div>

                <!-- Pagination -->
                <nav class="pagination is-centered mt-6" role="navigation" aria-label="pagination">
                    <a class="pagination-previous">Previous</a>
                    <a class="pagination-next">Next page</a>
                    <ul class="pagination-list">
                        <li><a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a></li>
                        <li><a class="pagination-link" aria-label="Goto page 2">2</a></li>
                        <li><a class="pagination-link" aria-label="Goto page 3">3</a></li>
                        <li><span class="pagination-ellipsis">&hellip;</span></li>
                        <li><a class="pagination-link" aria-label="Goto page 7">7</a></li>
                    </ul>
                </nav>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="content has-text-centered has-text-white-ter">
                    <p>By Ryan Hogan and Alan Sogolov | <a href="https://github.com/ryanjhogan7/IS371_website" target="_blank" class="has-text-white-ter">GitHub</a></p>
                </div>
            </div>
        </footer>
    `,


    create: `
        <section class="section">
            <div class="container">
                <h1 class="title is-2">Create a Listing</h1>
                <p class="subtitle">List your golf club for sale</p>

                <div class="columns">
                    <div class="column is-8 is-offset-2">
                        <div class="box">
                            <form id="createListingForm">
                                <div class="field">
                                    <label class="label">Club Name *</label>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="e.g., TaylorMade R15 Driver" required>
                                    </div>
                                </div>

                                <div class="field">
                                    <label class="label">Brand</label>
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select>
                                                <option>Select Brand</option>
                                                <option>TaylorMade</option>
                                                <option>Callaway</option>
                                                <option>Ping</option>
                                                <option>Titleist</option>
                                                <option>Cobra</option>
                                                <option>Mizuno</option>
                                                <option>Cleveland</option>
                                                <option>Wilson</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="field">
                                    <label class="label">Club Type *</label>
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select required>
                                                <option>Select Type</option>
                                                <option>Driver</option>
                                                <option>Fairway Wood</option>
                                                <option>Hybrid</option>
                                                <option>Iron Set</option>
                                                <option>Individual Iron</option>
                                                <option>Wedge</option>
                                                <option>Putter</option>
                                                <option>Complete Set</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="field">
                                    <label class="label">Condition *</label>
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select required>
                                                <option>Select Condition</option>
                                                <option>Like New</option>
                                                <option>Excellent</option>
                                                <option>Very Good</option>
                                                <option>Good</option>
                                                <option>Fair</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="field">
                                    <label class="label">Asking Price * ($)</label>
                                    <div class="control has-icons-left">
                                        <input class="input" type="number" placeholder="150" min="1" required>
                                        <span class="icon is-left">
                                            <i class="fas fa-dollar-sign"></i>
                                        </span>
                                    </div>
                                </div>

                                <div class="field">
                                    <label class="label">Description *</label>
                                    <div class="control">
                                        <textarea class="textarea" placeholder="Describe your club, including specs, condition details, and any extras included..." rows="5" required></textarea>
                                    </div>
                                    <p class="help">Be as detailed as possible to attract buyers</p>
                                </div>

                                <div class="field is-grouped">
                                    <div class="control">
                                        <button class="button is-primary" type="submit">
                                            <span class="icon">
                                                <i class="fas fa-check"></i>
                                            </span>
                                            <span>Create Listing</span>
                                        </button>
                                    </div>
                                    <div class="control">
                                        <button class="button is-light" type="button" onclick="loadPage('home')">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="content has-text-centered has-text-white-ter">
                    <p>By Ryan Hogan and Alan Sogolov | <a href="https://github.com/ryanjhogan7/IS371_website" target="_blank" class="has-text-white-ter">GitHub</a></p>
                </div>
            </div>
        </footer>
    `
};

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Initialize authentication state listener
 * This watches for when users sign in or out and updates the UI accordingly
 */
function initAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            updateNavBar(true);
        } else {
            // User is signed out
            currentUser = null;
            updateNavBar(false);
        }
    });
}

/**
 * Sign up a new user
 * Creates a new account in Firebase Authentication
 */
async function signUp(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        showNotification('Account created successfully! Welcome, ' + fullName, 'success');
        return true;
    } catch (error) {
        showNotification('Sign up failed: ' + error.message, 'error');
        return false;
    }
}

/**
 * Sign in an existing user
 */
async function signIn(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification('Signed in successfully!', 'success');
        return true;
    } catch (error) {
        showNotification('Sign in failed: ' + error.message, 'error');
        return false;
    }
}

/**
 * Sign out the current user
 */
async function signOutUser() {
    try {
        await signOut(auth);
        showNotification('Signed out successfully!', 'success');
        loadPage('home');
        return true;
    } catch (error) {
        showNotification('Error signing out: ' + error.message, 'error');
        return false;
    }
}

/**
 * Update navigation bar based on authentication state
 * Shows different buttons depending on whether user is logged in
 */
function updateNavBar(isLoggedIn) {
    const navButtons = document.querySelector('.navbar-end .buttons');

    if (isLoggedIn && currentUser) {
        // User is logged in - show welcome message and sign out button
        navButtons.innerHTML = `
            <div class="navbar-item has-text-white">
                Welcome, ${currentUser.email}
            </div>
            <div class="navbar-item">
                <button class="button is-light" onclick="signOutUser()">
                    Sign Out
                </button>
            </div>
        `;
    } else {
        // User is not logged in - show sign in and sign up buttons
        navButtons.innerHTML = `
            <button class="button is-light" onclick="openModal('signinModal')">
                <strong>Sign In</strong>
            </button>
            <button class="button is-primary" onclick="openModal('signupModal')">
                <strong>Sign Up</strong>
            </button>
        `;
    }
}

// ==================== FIRESTORE DATABASE FUNCTIONS ====================

/**
 * Create a new listing in Firestore
 * Adds a new golf club listing to the database
 */
async function createListing(listingData, imageFile = null) {
    try {
        // Check if user is signed in
        if (!currentUser) {
            showNotification('Please sign in to create a listing', 'warning');
            return false;
        }

        // Use stock image based on club type instead of file upload
        const imageUrl = getStockImageForClubType(listingData.clubType);

        // Add user info and timestamp to the listing
        const listing = {
            ...listingData,
            imageUrl: imageUrl,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            createdAt: serverTimestamp()
        };

        // Add to Firestore
        await addDoc(collection(db, "listings"), listing);
        showNotification('Listing created successfully!', 'success');
        return true;
    } catch (error) {
        showNotification('Error creating listing: ' + error.message, 'error');
        return false;
    }
}

/**
 * Get all listings from Firestore
 * Returns an array of all golf club listings, newest first
 */
async function getAllListings() {
    try {
        // Create a query to get all listings, ordered by creation date
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        // Convert Firestore documents to an array of listing objects
        const listings = [];
        querySnapshot.forEach((doc) => {
            listings.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return listings;
    } catch (error) {
        showNotification('Error loading listings: ' + error.message, 'error');
        return [];
    }
}

/**
 * Filter listings by club type and price range
 */
async function getFilteredListings(clubType, priceRange) {
    try {
        let listings = await getAllListings();

        // Filter by club type if specified
        if (clubType && clubType !== "All Types") {
            listings = listings.filter(listing => listing.clubType === clubType);
        }

        // Filter by price range if specified
        if (priceRange && priceRange !== "Any Price") {
            listings = listings.filter(listing => {
                const price = parseFloat(listing.price);
                switch (priceRange) {
                    case "Under $100":
                        return price < 100;
                    case "$100 - $250":
                        return price >= 100 && price <= 250;
                    case "$250 - $500":
                        return price >= 250 && price <= 500;
                    case "$500+":
                        return price >= 500;
                    default:
                        return true;
                }
            });
        }

        return listings;
    } catch (error) {
        showNotification('Error filtering listings: ' + error.message, 'error');
        return [];
    }
}

/**
 * Delete a listing from Firestore
 * Users can only delete their own listings
 */
async function deleteListing(listingId) {
    try {
        if (!currentUser) {
            showNotification('Please sign in to delete listings', 'warning');
            return false;
        }

        // Delete from Firestore
        await deleteDoc(doc(db, "listings", listingId));
        showNotification('Listing deleted successfully!', 'success');
        return true;
    } catch (error) {
        showNotification('Error deleting listing: ' + error.message, 'error');
        return false;
    }
}

// ==================== PAGE NAVIGATION FUNCTIONS ====================

/**
 * Load a different page in our Single Page Application
 * Changes the main content area without refreshing the browser
 */
function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = pages[pageName] || pages.home;

    // Set up event listeners for the new page content
    attachEventListeners(pageName);

    // Load listings if we're on the browse page
    if (pageName === 'browse') {
        displayListings();
    }

    // Scroll to top of page
    window.scrollTo(0, 0);
}

/**
 * Attach event listeners to forms and buttons on the current page
 */
function attachEventListeners(pageName) {
    if (pageName === 'create') {
        // Handle create listing form submission
        const form = document.getElementById('createListingForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Check if user is signed in
                if (!currentUser) {
                    showNotification('Please sign in to create a listing', 'warning');
                    openModal('signinModal');
                    return;
                }

                // Get form data
                const listingData = {
                    clubName: form.querySelector('input[type="text"]').value,
                    brand: form.querySelectorAll('select')[0].value,
                    clubType: form.querySelectorAll('select')[1].value,
                    condition: form.querySelectorAll('select')[2].value,
                    price: form.querySelector('input[type="number"]').value,
                    description: form.querySelector('textarea').value
                };

                // Validate required fields
                if (!listingData.clubName || !listingData.clubType || !listingData.condition || !listingData.price || !listingData.description) {
                    showNotification('Please fill in all required fields', 'warning');
                    return;
                }

                // Create the listing (stock images will be assigned automatically based on club type)
                const success = await createListing(listingData);
                if (success) {
                    form.reset();
                    loadPage('browse');
                }
            });
        }
    } else if (pageName === 'browse') {
        // Handle filter buttons
        const applyBtn = document.getElementById('applyFiltersBtn');
        const clearBtn = document.getElementById('clearFiltersBtn');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const clubType = document.getElementById('clubTypeFilter').value;
                const priceRange = document.getElementById('priceRangeFilter').value;
                displayListings(clubType, priceRange);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                document.getElementById('clubTypeFilter').value = 'All Types';
                document.getElementById('priceRangeFilter').value = 'Any Price';
                displayListings();
            });
        }
    }
}

/**
 * Display listings on the browse page
 * Fetches listings from Firestore and creates HTML cards for each one
 */
async function displayListings(clubType = null, priceRange = null) {
    const container = document.getElementById('listings-container');
    const countElement = document.getElementById('listings-count');

    if (!container || !countElement) return;

    // Show loading message
    countElement.textContent = 'Loading listings...';

    // Clear existing listings (except the count element)
    const existingCards = container.querySelectorAll('.column:not(:first-child)');
    existingCards.forEach(el => el.remove());

    // Get filtered listings from Firestore
    const listings = await getFilteredListings(clubType, priceRange);

    // Update count
    countElement.textContent = `Showing ${listings.length} listing${listings.length !== 1 ? 's' : ''}`;

    // Show message if no listings found
    if (listings.length === 0) {
        const message = document.createElement('div');
        message.className = 'column is-12';
        message.innerHTML = `
            <div class="notification is-warning has-text-centered">
                <p>No listings found. ${currentUser ? 'Be the first to create one!' : 'Sign in to create a listing.'}</p>
            </div>
        `;
        container.appendChild(message);
        return;
    }

    // Create a card for each listing
    listings.forEach(listing => {
        const card = document.createElement('div');
        card.className = 'column is-3';

        // Only show delete button if user owns this listing
        const isOwner = currentUser && listing.userId === currentUser.uid;
        const deleteBtn = isOwner ? `
            <button class="button is-danger is-small is-fullwidth mt-2" onclick="handleDelete('${listing.id}')">
                <span class="icon"><i class="fas fa-trash"></i></span>
                <span>Delete</span>
            </button>
        ` : '';

        // Use listing image if available, otherwise use stock image based on club type
        const imageUrl = listing.imageUrl || getStockImageForClubType(listing.clubType);

        card.innerHTML = `
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img src="${imageUrl}" alt="${listing.clubName}" style="object-fit: cover;">
                    </figure>
                </div>
                <div class="card-content">
                    <p class="title is-5">${listing.clubName}</p>
                    <p class="subtitle is-6 has-text-grey">${listing.condition} - ${listing.brand || 'No brand'}</p>
                    <div class="content">
                        <p class="is-size-7 mb-2">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
                        <p class="is-size-7 has-text-grey mb-3">
                            <span class="icon is-small"><i class="fas fa-user"></i></span>
                            Seller: ${listing.userEmail}
                        </p>
                        <div class="mb-3">
                            <span class="bid-price">$${listing.price}</span>
                        </div>
                        ${deleteBtn}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Handle deleting a listing
 */
async function handleDelete(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) {
        return;
    }

    const success = await deleteListing(listingId);
    if (success) {
        // Reload listings to show updated list
        displayListings();
    }
}

// ==================== MODAL FUNCTIONS ====================

/**
 * Open a modal dialog
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('is-active');
    }
}

/**
 * Close a modal dialog
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('is-active');
    }
}

// ==================== MAKE FUNCTIONS AVAILABLE TO HTML ====================
// These functions are called from onclick attributes in HTML
// IMPORTANT: These MUST be assigned IMMEDIATELY when module loads (not in DOMContentLoaded)
// to prevent timing issues on Firebase deployment where network latency can cause
// the module to load after users attempt to click buttons

// Assign functions to window immediately
window.loadPage = loadPage;
window.openModal = openModal;
window.closeModal = closeModal;
window.signOutUser = signOutUser;
window.handleDelete = handleDelete;

// Signal that the module has loaded and functions are ready
window.__appModuleLoaded = true;

// ==================== INITIALIZE APP WHEN PAGE LOADS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase authentication
    initAuth();

    // Load home page by default
    loadPage('home');

    // Set up mobile hamburger menu
    const burgers = document.querySelectorAll('.navbar-burger');
    burgers.forEach(burger => {
        burger.addEventListener('click', () => {
            const target = document.getElementById(burger.dataset.target);
            burger.classList.toggle('is-active');
            target.classList.toggle('is-active');
        });
    });

    // Handle sign up form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = signupForm.querySelector('input[type="text"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'warning');
                return;
            }

            // Validate password length
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'warning');
                return;
            }

            // Sign up the user
            const success = await signUp(email, password, fullName);
            if (success) {
                signupForm.reset();
                closeModal('signupModal');
            }
        });
    }

    // Handle sign in form
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = signinForm.querySelector('input[type="email"]').value;
            const password = signinForm.querySelector('input[type="password"]').value;

            // Sign in the user
            const success = await signIn(email, password);
            if (success) {
                signinForm.reset();
                closeModal('signinModal');
            }
        });
    }

    // Close modals when clicking outside
    document.querySelectorAll('.modal-background').forEach(bg => {
        bg.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('is-active');
            }
        });
    });
});
