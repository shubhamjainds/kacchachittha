// Main app.js for handling review submissions

// Import Firebase modules from our config file
import { db, collection, addDoc } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const reviewForm = document.getElementById('reviewForm');
    const notification = document.getElementById('notification');

    // Add submit event listener to the form
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const serviceProvider = document.getElementById('serviceProvider').value.trim();
        const serviceType = document.getElementById('serviceType').value;
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const reviewText = document.getElementById('reviewText').value.trim();
        const reviewerName = document.getElementById('reviewerName').value.trim() || 'Anonymous';
        
        // Validate phone number format (10 digits)
        if (!validatePhoneNumber(serviceProvider)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        // Create review object
        const review = {
            serviceProvider: serviceProvider,
            serviceType: serviceType,
            rating: parseInt(rating),
            reviewText: reviewText,
            reviewerName: reviewerName,
            date: new Date().toISOString()
        };
        
        try {
            // Save the review to Firestore
            await saveReviewToFirestore(review);
            
            // Show success notification
            showNotification('Review submitted successfully!', 'success');
            
            // Reset the form
            reviewForm.reset();
        } catch (error) {
            console.error("Error saving review: ", error);
            showNotification('Error saving review. Please try again.', 'error');
        }
    });
    
    // Function to validate phone number
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }
    
    // Function to save review to Firestore
    async function saveReviewToFirestore(review) {
        try {
            // Reference to the reviews collection
            const reviewsCollectionRef = collection(db, "reviews");
            
            // Add the document to Firestore
            const docRef = await addDoc(reviewsCollectionRef, review);
            console.log("Review saved with ID: ", docRef.id);
            return docRef;
        } catch (error) {
            console.error("Error adding review: ", error);
            throw error;
        }
    }
    
    // Function to show notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = 'notification ' + type;
        
        // Hide notification after 3 seconds
        setTimeout(function() {
            notification.className = 'notification';
        }, 3000);
    }
});