// Firestore Database Operations Module
import { db } from './firebase-config.js';
import { currentUser } from './auth.js';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Create new listing
export async function createListing(listingData) {
    try {
        if (!currentUser) {
            throw new Error("You must be signed in to create a listing");
        }

        const listing = {
            ...listingData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            userName: currentUser.displayName || currentUser.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "listings"), listing);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating listing:", error);
        return { success: false, error: error.message };
    }
}

// Get all listings
export async function getAllListings() {
    try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const listings = [];

        querySnapshot.forEach((doc) => {
            listings.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, listings };
    } catch (error) {
        console.error("Error getting listings:", error);
        return { success: false, error: error.message, listings: [] };
    }
}

// Get listings by filter
export async function getFilteredListings(clubType = null, priceRange = null) {
    try {
        let q = query(collection(db, "listings"), orderBy("createdAt", "desc"));

        // Apply club type filter
        if (clubType && clubType !== "All Types") {
            q = query(collection(db, "listings"), where("clubType", "==", clubType), orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);
        let listings = [];

        querySnapshot.forEach((doc) => {
            listings.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Apply price range filter (client-side)
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

        return { success: true, listings };
    } catch (error) {
        console.error("Error filtering listings:", error);
        return { success: false, error: error.message, listings: [] };
    }
}

// Get user's own listings
export async function getUserListings(userId) {
    try {
        const q = query(
            collection(db, "listings"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const listings = [];

        querySnapshot.forEach((doc) => {
            listings.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, listings };
    } catch (error) {
        console.error("Error getting user listings:", error);
        return { success: false, error: error.message, listings: [] };
    }
}

// Delete listing
export async function deleteListing(listingId) {
    try {
        if (!currentUser) {
            throw new Error("You must be signed in to delete a listing");
        }

        // Get the listing to verify ownership
        const listingDoc = await getDoc(doc(db, "listings", listingId));

        if (!listingDoc.exists()) {
            throw new Error("Listing not found");
        }

        const listingData = listingDoc.data();

        // Check if user owns the listing or is admin
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const isAdmin = userDoc.exists() && userDoc.data().isAdmin;

        if (listingData.userId !== currentUser.uid && !isAdmin) {
            throw new Error("You don't have permission to delete this listing");
        }

        await deleteDoc(doc(db, "listings", listingId));
        return { success: true };
    } catch (error) {
        console.error("Error deleting listing:", error);
        return { success: false, error: error.message };
    }
}

// Update listing
export async function updateListing(listingId, updatedData) {
    try {
        if (!currentUser) {
            throw new Error("You must be signed in to update a listing");
        }

        // Get the listing to verify ownership
        const listingDoc = await getDoc(doc(db, "listings", listingId));

        if (!listingDoc.exists()) {
            throw new Error("Listing not found");
        }

        const listingData = listingDoc.data();

        // Check if user owns the listing
        if (listingData.userId !== currentUser.uid) {
            throw new Error("You don't have permission to update this listing");
        }

        await updateDoc(doc(db, "listings", listingId), {
            ...updatedData,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating listing:", error);
        return { success: false, error: error.message };
    }
}

// Send contact message (store in Firestore)
export async function sendContactMessage(listingId, message) {
    try {
        if (!currentUser) {
            throw new Error("You must be signed in to contact sellers");
        }

        const messageData = {
            listingId,
            senderUserId: currentUser.uid,
            senderEmail: currentUser.email,
            senderName: currentUser.displayName || currentUser.email,
            message,
            sentAt: serverTimestamp()
        };

        await addDoc(collection(db, "messages"), messageData);
        return { success: true };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: error.message };
    }
}
