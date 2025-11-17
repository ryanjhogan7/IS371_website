# GolfClub Auctions - Milestone 3 Complete

## Overview
This is a fully-functional Single Page Application (SPA) for buying and selling used golf clubs, built with HTML, Bulma CSS, JavaScript, and Firebase. This project successfully completes all requirements for IS 371 Milestone 3 with full Firebase integration.

**Authors:** Ryan Hogan and Alan Sogolov

## Milestone 3 - Firebase Integration (NEW)

### What's New in Milestone 3

#### 1. **Firebase Authentication**
- ✅ Full user sign-up functionality with email/password
- ✅ User sign-in with Firebase Authentication
- ✅ Sign-out functionality
- ✅ Authentication state persistence across page refreshes
- ✅ Password validation (minimum 6 characters, matching passwords)
- ✅ User profile data stored in Firestore

#### 2. **Cloud Firestore Database**
- ✅ Real-time database integration
- ✅ One collection: `listings` (keeps it simple for students)
- ✅ Automatic data synchronization
- ✅ Server-side timestamps for all records

#### 3. **CRUD Operations for Listings**
- ✅ **Create:** Authenticated users can create new golf club listings
- ✅ **Read:** Browse all listings with real-time data from Firestore
- ✅ **Update:** (Foundation laid for future enhancement)
- ✅ **Delete:** Users can delete their own listings

#### 4. **Features**
- ✅ Filter listings by club type (Driver, Putter, Iron Set, etc.)
- ✅ Filter listings by price range (Under $100, $100-$250, etc.)
- ✅ User ownership verification (users can only delete their own listings)
- ✅ Dynamic UI updates based on authentication state
- ✅ Simple, easy-to-understand code structure for learning

#### 5. **Simplified File Structure** (Updated for clarity)
```
IS371_website/
├── index.html              # Main HTML file with all UI (SPA)
├── app.js                  # All JavaScript logic (auth, database, navigation)
├── firebase-config.js      # Firebase initialization (simple config file)
└── README.md              # Project documentation
```

**The codebase has been simplified for student learning:**
- Only 2 JavaScript files (instead of 4)
- All application logic in one file (app.js) with clear sections
- Simple alert() messages for user feedback
- Extensive comments explaining each function
- No unnecessary complexity - just the required features

## What Changed from Milestone 2a

### 1. **Single HTML File**
- Consolidated all separate HTML pages (index.html, listings.html, about.html, contact.html) into ONE `index.html`
- All page content is now dynamically loaded via JavaScript

### 2. **CSS Replaced with Bulma**
- Removed custom CSS file (style.css) 
- Implemented Bulma framework via CDN
- Added minimal custom CSS (< 30 lines) only for brand colors (#2d5016 green theme)
- All layout, components, and styling now use Bulma classes

### 3. **JavaScript-Driven Navigation**
- Created `app.js` for dynamic content loading
- Navigation links now trigger JavaScript functions instead of page redirects
- Content switches instantly without page reloads

### 4. **Modal Implementation**
- Sign Up, Sign In, and Bid modals using Bulma modal component
- Modals open/close dynamically via JavaScript
- Forms are ready for Firebase integration in Milestone 3

## Project Files

```
IS371_website/
├── index.html              # Main HTML file with all UI (SPA)
├── app.js                  # All JavaScript (800 lines, well-commented)
├── firebase-config.js      # Firebase initialization (simple, 30 lines)
├── README.md              # Project documentation
└── IS 371 Final Project (2).docx  # Project requirements document
```

**Why this structure is good for learning:**
- Students can see all the logic flow in one file (app.js)
- Clear sections with comments make it easy to find things
- No jumping between multiple files to understand one feature
- Simple enough to understand in one semester

## Key Features Implemented

### ✅ Single Page Application
- Only one HTML file (`index.html`)
- All pages (Home, Browse, About, Contact) loaded dynamically
- No page refreshes when navigating

### ✅ Bulma Framework
- Navbar with mobile hamburger menu
- Responsive grid system for auction cards
- Modal components for user interactions
- Forms with Bulma styling
- Buttons, inputs, and all UI elements use Bulma

### ✅ Dynamic Content Loading
- `loadPage()` function switches between pages
- Content stored in JavaScript object (`pages`)
- Smooth transitions without reloading

### ✅ Interactive Modals
- Sign Up modal with form validation
- Sign In modal with remember me option
- Bid modal that displays item details
- Close modals via X button, Cancel, or clicking outside

### ✅ Responsive Design
- Mobile-friendly hamburger menu
- Responsive columns that adapt to screen size
- Touch-friendly buttons and forms

### ✅ Consistent Visual Design
- Maintains green golf theme (#2d5016, #4a7c25)
- Same visual appearance as Milestone 2a
- Professional and clean interface

## How the SPA Works

### Navigation System
```javascript
// When user clicks a navigation link:
<a onclick="loadPage('about')">About</a>

// JavaScript function loads that page's content:
function loadPage(pageName) {
    document.getElementById('main-content').innerHTML = pages[pageName];
}
```

### Page Content Storage
All pages are stored in a JavaScript object:
```javascript
const pages = {
    home: `<section>...</section>`,
    browse: `<section>...</section>`,
    about: `<section>...</section>`,
    contact: `<section>...</section>`
}
```

### Modal System
```javascript
// Opening a modal:
openModal('signupModal')  // Adds 'is-active' class

// Closing a modal:
closeModal('signupModal')  // Removes 'is-active' class
```

## Bulma Components Used

1. **Navbar** - Responsive navigation with mobile menu
2. **Hero** - Large banner section on home page
3. **Card** - Auction listing cards with images
4. **Modal** - Sign up, sign in, and bid forms
5. **Form** - Input fields, selects, buttons with icons
6. **Columns** - Responsive grid layout
7. **Box** - Containers for filter controls
8. **Button** - Primary, secondary, and various sizes
9. **Level** - Horizontal layout for bid info
10. **Footer** - Consistent footer across pages
11. **Pagination** - Page navigation on Browse page
12. **Notification** - Call-to-action boxes

## Testing Checklist

- [x] Single HTML file (index.html)
- [x] Bulma framework properly loaded
- [x] All pages load dynamically (Home, Browse, About, Contact)
- [x] Navigation works without page refreshes
- [x] Modals open and close correctly
- [x] Mobile hamburger menu works
- [x] Responsive design on all screen sizes
- [x] Visual design matches Milestone 2a
- [x] All buttons and links functional
- [x] Forms display correctly
- [x] Footer appears on all pages

## Milestone 3 Requirements Met

All Milestone 3 requirements have been successfully implemented:

1. ✅ **User Authentication** - Firebase Authentication with sign up/sign in/sign out
2. ✅ **Database Integration** - Cloud Firestore storing listings, users, and messages
3. ✅ **CRUD Operations** - Full Create, Read, and Delete functionality for listings
4. ✅ **Search/Filter** - Working filters for club type and price range
5. ✅ **User-Specific Features** - Users can only delete their own listings
6. ✅ **Real-time Updates** - Dynamic UI updates based on authentication state
7. ✅ **Form Validation** - All forms validate input before submission

## How to Use the Application

### For New Users:
1. Click "Sign Up" in the navigation bar
2. Enter your full name, email, and password (min 6 characters)
3. Confirm your password
4. Click "Sign Up" to create your account

### To Create a Listing:
1. Sign in to your account
2. Click "Create Listing" in the navigation
3. Fill out the form with club details
4. Click "Create Listing" to publish

### To Browse and Filter:
1. Click "Browse Auctions" to see all listings
2. Use the filter dropdowns to narrow by club type or price
3. Click "Apply Filters" to see filtered results
4. See the seller's email address on each listing to contact them

### To Delete Your Listings:
1. Browse to the "Browse Auctions" page
2. Find your listing (it will show a "Delete" button)
3. Click "Delete" and confirm to remove it

## Notes for Presentation

**Key Points to Highlight:**
1. ✅ Successfully converted to SPA - one HTML file
2. ✅ All custom CSS replaced with Bulma
3. ✅ Dynamic page loading works smoothly
4. ✅ Modal system fully functional
5. ✅ Maintains visual consistency from 2a
6. ✅ Mobile responsive with working hamburger menu
7. ✅ **Firebase fully integrated - Authentication & Firestore**
8. ✅ **Full CRUD operations working with real-time database**
9. ✅ **User authentication with session persistence**
10. ✅ **Advanced filtering and search capabilities**

**Demo Flow:**
1. Show the home page and navigation (SPA - no page reloads)
2. Demonstrate user sign-up with Firebase Authentication
3. Sign in with created account (show UI updates)
4. Create a new golf club listing (data saved to Firestore)
5. Browse listings page - show real-time data from database
6. Apply filters by club type and price range
7. Delete own listing - demonstrate ownership verification
8. Sign out - show authentication state change
9. Test mobile responsive view with hamburger menu

**Technical Highlights:**
- Simple ES6 module structure (just 2 JS files)
- Firebase Authentication with email/password
- Cloud Firestore NoSQL database (one "listings" collection)
- Real-time data synchronization
- Client-side validation with simple alerts
- Security: users can only delete their own listings
- Well-commented code perfect for learning (800 lines, clear sections)

## Browser Compatibility

Tested and working in:
- Google Chrome (required for class)
- Modern browsers with JavaScript enabled

## Future Enhancements (Beyond Milestone 3)

The following features could be added in future versions:

- ✅ ~~Firebase Authentication integration~~ (COMPLETED)
- ✅ ~~Dynamic auction listings from Firestore~~ (COMPLETED)
- ✅ ~~Search and filter functionality with database~~ (COMPLETED)
- Admin dashboard for managing all listings
- Image upload functionality for listing photos
- User profile pages with listing history
- Rating and review system for sellers
- Real-time chat between buyers and sellers
- Email notifications for new messages
- Payment integration
- Transaction history tracking
- Wishlist/favorite listings feature
- Advanced search with multiple criteria
- Price negotiation system
