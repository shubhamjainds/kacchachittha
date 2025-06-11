// Main app.js for handling review submissions

// Import Firebase modules from our config file
import { db, collection, addDoc, getDocs } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Get the form element
    const reviewForm = document.getElementById('reviewForm');
    const notification = document.getElementById('notification');
    const serviceTypeSelect = document.getElementById('serviceType');
    const customServiceGroup = document.getElementById('customServiceGroup');
    const customServiceInput = document.getElementById('customServiceName');

    // Populate service types dropdown
    await populateServiceTypes();

    // Handle service type change
    serviceTypeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customServiceGroup.style.display = 'block';
            customServiceInput.required = true;
        } else {
            customServiceGroup.style.display = 'none';
            customServiceInput.required = false;
            customServiceInput.value = '';
        }
    });

    // Function to fetch and populate service types
    async function populateServiceTypes() {
        try {
            const reviewsCollectionRef = collection(db, "reviews");
            const querySnapshot = await getDocs(reviewsCollectionRef);
            
            // Create a Set to store unique service types
            const serviceTypes = new Set();
            
            // Collect all unique service types
            querySnapshot.forEach((doc) => {
                const serviceType = doc.data().serviceType;
                if (serviceType && serviceType.toLowerCase() !== 'other') {
                    serviceTypes.add(serviceType);
                }
            });
            
            // Clear existing options except the default option
            serviceTypeSelect.innerHTML = '<option value="" disabled selected>Select service type</option>';
            
            // Add service types to dropdown
            Array.from(serviceTypes).sort().forEach(type => {
                const option = document.createElement('option');
                option.value = type.toLowerCase();
                option.textContent = type;
                serviceTypeSelect.appendChild(option);
            });
            
            // Add the "Other" option at the end
            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = 'Other';
            serviceTypeSelect.appendChild(otherOption);
        } catch (error) {
            console.error("Error fetching service types: ", error);
            showNotification('Error loading service types', 'error');
        }
    }

    // Add submit event listener to the form
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const serviceProvider = document.getElementById('serviceProvider').value.trim();
        const serviceType = document.getElementById('serviceType').value;
        const customServiceName = document.getElementById('customServiceName').value.trim();
        const serviceProviderName = document.getElementById('serviceProviderName').value.trim() || 'Anonymous';
        const reviewText = document.getElementById('reviewText').value.trim();
        const reviewerName = document.getElementById('reviewerName').value.trim() || 'Anonymous';
        const pincode = document.getElementById('pincode').value.trim();

        // Determine final service type
        const finalServiceType = serviceType === 'other' ? customServiceName : serviceType;
        
        // Validate custom service name if 'Other' is selected
        if (serviceType === 'other' && !customServiceName) {
            showNotification('Please enter a custom service name', 'error');
            return;
        }
        
        
        
        
        // Validate phone number format (10 digits)
        if (!validatePhoneNumber(serviceProvider)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        const qualityRatingElement = document.querySelector('input[name="qualityRating"]:checked');
        const timelinessRatingElement = document.querySelector('input[name="timelinessRating"]:checked');
        const professionalismRatingElement = document.querySelector('input[name="professionalismRating"]:checked');
        const pricingRatingElement = document.querySelector('input[name="pricingRating"]:checked');
        
        if (!qualityRatingElement || !timelinessRatingElement || !professionalismRatingElement || !pricingRatingElement) {
            showNotification('Please select a rating for all categories', 'error');
            return;
        }
        
        const qualityRating = qualityRatingElement.value;
        const timelinessRating = timelinessRatingElement.value;
        const professionalismRating = professionalismRatingElement.value;
        const pricingRating = pricingRatingElement.value;
        
        // Create review object
        const review = {
            serviceProvider: serviceProvider,
            serviceProviderName: serviceProviderName,
            pincode: pincode,
            serviceType: finalServiceType,
            qualityRating: parseInt(qualityRating),
            timelinessRating: parseInt(timelinessRating),
            professionalismRating: parseInt(professionalismRating),
            pricingRating: parseInt(pricingRating),
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
    
    // Add the validation function
    function validatePincode(pincode) {
        const pincodeRegex = /^\d{6}$/;
        return pincodeRegex.test(pincode);
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
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});