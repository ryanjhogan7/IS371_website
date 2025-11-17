// Import Firebase modules
import { initAuth, signUpUser, signInUser, currentUser, showNotification } from './auth.js';
import { createListing, getAllListings, getFilteredListings, deleteListing, sendContactMessage } from './firestore.js';

// Page content templates
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

                                <div class="field">
                                    <label class="label">Upload Photos</label>
                                    <div class="file has-name is-fullwidth">
                                        <label class="file-label">
                                            <input class="file-input" type="file" name="photos" multiple accept="image/*">
                                            <span class="file-cta">
                                                <span class="file-icon">
                                                    <i class="fas fa-upload"></i>
                                                </span>
                                                <span class="file-label">
                                                    Choose photos…
                                                </span>
                                            </span>
                                            <span class="file-name">
                                                No file selected
                                            </span>
                                        </label>
                                    </div>
                                    <p class="help">Upload up to 5 photos (JPG, PNG)</p>
                                </div>

                                <div class="field">
                                    <label class="label">Contact Information</label>
                                    <div class="control has-icons-left">
                                        <input class="input" type="email" placeholder="your-email@example.com" required>
                                        <span class="icon is-left">
                                            <i class="fas fa-envelope"></i>
                                        </span>
                                    </div>
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

// Make functions globally accessible
window.loadPage = loadPage;
window.openModal = openModal;
window.closeModal = closeModal;
window.openContactModal = openContactModal;

// Function to load different pages
function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = pages[pageName] || pages.home;

    // Update active navigation link
    const navLinks = document.querySelectorAll('.navbar-item');
    navLinks.forEach(link => {
        link.classList.remove('is-active');
    });

    // Attach event listeners to forms on the loaded page
    attachPageEventListeners(pageName);

    // Load listings if on browse page
    if (pageName === 'browse') {
        loadListings();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Function to attach event listeners to dynamically loaded content
function attachPageEventListeners(pageName) {
    if (pageName === 'create') {
        const createListingForm = document.getElementById('createListingForm');
        if (createListingForm) {
            createListingForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!currentUser) {
                    showNotification('Please sign in to create a listing', 'warning');
                    openModal('signinModal');
                    return;
                }

                // Get form data
                const formData = new FormData(createListingForm);
                const listingData = {
                    clubName: createListingForm.querySelector('input[type="text"]').value,
                    brand: createListingForm.querySelectorAll('select')[0].value,
                    clubType: createListingForm.querySelectorAll('select')[1].value,
                    condition: createListingForm.querySelectorAll('select')[2].value,
                    price: createListingForm.querySelector('input[type="number"]').value,
                    description: createListingForm.querySelector('textarea').value,
                    contactEmail: createListingForm.querySelector('input[type="email"]').value
                };

                // Validate required fields
                if (!listingData.clubName || !listingData.clubType || !listingData.condition || !listingData.price || !listingData.description) {
                    showNotification('Please fill in all required fields', 'warning');
                    return;
                }

                // Create listing in Firestore
                const result = await createListing(listingData);

                if (result.success) {
                    showNotification('Listing created successfully!', 'success');
                    createListingForm.reset();
                    loadPage('browse');
                } else {
                    showNotification('Error creating listing: ' + result.error, 'danger');
                }
            });
        }
    } else if (pageName === 'browse') {
        // Attach filter event listeners
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                const clubType = document.getElementById('clubTypeFilter').value;
                const priceRange = document.getElementById('priceRangeFilter').value;
                loadListings(clubType, priceRange);
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                document.getElementById('clubTypeFilter').value = 'All Types';
                document.getElementById('priceRangeFilter').value = 'Any Price';
                loadListings();
            });
        }
    }
}

// Function to load listings from Firestore
async function loadListings(clubType = null, priceRange = null) {
    const listingsContainer = document.getElementById('listings-container');
    const listingsCount = document.getElementById('listings-count');

    if (!listingsContainer || !listingsCount) return;

    // Show loading state
    listingsCount.textContent = 'Loading listings...';

    // Clear existing listings (keep the count element)
    const existingListings = listingsContainer.querySelectorAll('.column:not(:first-child)');
    existingListings.forEach(el => el.remove());

    // Fetch listings from Firestore
    const result = await getFilteredListings(clubType, priceRange);

    if (result.success) {
        const listings = result.listings;

        // Update count
        listingsCount.textContent = `Showing ${listings.length} listing${listings.length !== 1 ? 's' : ''}`;

        if (listings.length === 0) {
            const noListingsMsg = document.createElement('div');
            noListingsMsg.className = 'column is-12';
            noListingsMsg.innerHTML = `
                <div class="notification is-warning has-text-centered">
                    <p>No listings found. ${currentUser ? 'Be the first to create one!' : 'Sign in to create a listing.'}</p>
                </div>
            `;
            listingsContainer.appendChild(noListingsMsg);
            return;
        }

        // Display listings
        listings.forEach(listing => {
            const listingCard = document.createElement('div');
            listingCard.className = 'column is-3';

            const isOwner = currentUser && listing.userId === currentUser.uid;
            const deleteButton = isOwner ? `
                <button class="button is-danger is-small is-fullwidth mt-2" onclick="handleDeleteListing('${listing.id}')">
                    <span class="icon"><i class="fas fa-trash"></i></span>
                    <span>Delete</span>
                </button>
            ` : '';

            listingCard.innerHTML = `
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-4by3">
                            <img src="https://bulma.io/images/placeholders/640x480.png" alt="${listing.clubName}">
                        </figure>
                    </div>
                    <div class="card-content">
                        <p class="title is-5">${listing.clubName}</p>
                        <p class="subtitle is-6 has-text-grey">${listing.condition} - ${listing.brand || 'No brand'}</p>
                        <div class="content">
                            <p class="is-size-7 mb-2">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
                            <p class="is-size-7 has-text-grey mb-3">
                                <span class="icon is-small"><i class="fas fa-user"></i></span>
                                ${listing.userName}
                            </p>
                            <div class="mb-3">
                                <span class="bid-price">$${listing.price}</span>
                            </div>
                            <button class="button is-primary is-fullwidth" onclick="openContactModal('${listing.clubName}', '${listing.id}')">
                                <span class="icon"><i class="fas fa-envelope"></i></span>
                                <span>Contact Seller</span>
                            </button>
                            ${deleteButton}
                        </div>
                    </div>
                </div>
            `;
            listingsContainer.appendChild(listingCard);
        });
    } else {
        listingsCount.textContent = 'Error loading listings';
        showNotification('Error loading listings: ' + result.error, 'danger');
    }
}

// Function to handle listing deletion
window.handleDeleteListing = async function(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) {
        return;
    }

    const result = await deleteListing(listingId);

    if (result.success) {
        showNotification('Listing deleted successfully!', 'success');
        loadListings(); // Reload listings
    } else {
        showNotification('Error deleting listing: ' + result.error, 'danger');
    }
};

// Function to open modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('is-active');
    }
}

// Function to close modals
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('is-active');
    }
}

// Function to open contact modal with item details
let currentContactListingId = null;
function openContactModal(itemName, listingId) {
    currentContactListingId = listingId;
    document.getElementById('contactItemName').textContent = itemName;
    openModal('contactModal');
}

// Hamburger menu toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase authentication
    initAuth();

    // Load home page by default
    loadPage('home');

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
        });
    });

    // Sign up form submission
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
                showNotification('Passwords do not match', 'danger');
                return;
            }

            // Validate password length
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'danger');
                return;
            }

            // Sign up user
            const result = await signUpUser(email, password, fullName);

            if (result.success) {
                showNotification('Account created successfully! Welcome, ' + fullName, 'success');
                signupForm.reset();
                closeModal('signupModal');
            } else {
                showNotification('Sign up failed: ' + result.error, 'danger');
            }
        });
    }

    // Sign in form submission
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = signinForm.querySelector('input[type="email"]').value;
            const password = signinForm.querySelector('input[type="password"]').value;

            // Sign in user
            const result = await signInUser(email, password);

            if (result.success) {
                showNotification('Signed in successfully!', 'success');
                signinForm.reset();
                closeModal('signinModal');
            } else {
                showNotification('Sign in failed: ' + result.error, 'danger');
            }
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!currentUser) {
                showNotification('Please sign in to contact sellers', 'warning');
                closeModal('contactModal');
                openModal('signinModal');
                return;
            }

            const message = contactForm.querySelector('textarea').value;

            if (!currentContactListingId) {
                showNotification('Error: No listing selected', 'danger');
                return;
            }

            // Send message to Firestore
            const result = await sendContactMessage(currentContactListingId, message);

            if (result.success) {
                showNotification('Message sent to seller!', 'success');
                contactForm.reset();
                closeModal('contactModal');
            } else {
                showNotification('Error sending message: ' + result.error, 'danger');
            }
        });
    }

    // Close modal when clicking outside
    document.querySelectorAll('.modal-background').forEach(bg => {
        bg.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('is-active');
            }
        });
    });
});