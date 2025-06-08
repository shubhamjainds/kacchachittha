// Search.js for handling review searches

// Import Firebase modules from our config file
import { db, collection, query, where, getDocs, orderBy } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const searchBtn = document.getElementById('searchBtn');
    const searchPhone = document.getElementById('searchPhone');
    const filterServiceType = document.getElementById('filterServiceType');
    const searchResults = document.getElementById('searchResults');
    
    // Add click event listener to search button
    searchBtn.addEventListener('click', async function() {
        // Get the search query
        const phoneNumber = searchPhone.value.trim();
        const serviceTypeFilter = filterServiceType.value;
        
        // Validate phone number
        if (!validatePhoneNumber(phoneNumber)) {
            displayNoResults('Please enter a valid 10-digit phone number');
            return;
        }
        
        try {
            // Search for reviews
            const reviews = await searchReviews(phoneNumber, serviceTypeFilter);
            
            // Display results
            displayResults(reviews, phoneNumber, serviceTypeFilter);
        } catch (error) {
            console.error("Error searching reviews: ", error);
            displayNoResults('Error searching reviews. Please try again.');
        }
    });
    
    // Function to validate phone number
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }
    
    // Function to search for reviews using Firestore
    async function searchReviews(phoneNumber, serviceTypeFilter = '') {
        try {
            // Reference to the reviews collection
            const reviewsCollectionRef = collection(db, "reviews");
            
            // Create a query based on the phone number
            let reviewQuery;
            
            if (serviceTypeFilter) {
                // If service type filter is provided, add it to the query
                reviewQuery = query(
                    reviewsCollectionRef, 
                    where("serviceProvider", "==", phoneNumber),
                    where("serviceType", "==", serviceTypeFilter),
                    //orderBy("date", "desc")
                );
            } else {
                // Otherwise, just query by phone number
                reviewQuery = query(
                    reviewsCollectionRef, 
                    where("serviceProvider", "==", phoneNumber),
                    orderBy("date", "desc")
                );
            }
            
            // Execute the query
            const querySnapshot = await getDocs(reviewQuery);
            
            // Convert the query snapshot to an array of review objects
            const reviews = [];
            querySnapshot.forEach((doc) => {
                // Add the document ID to the review object
                reviews.push({ id: doc.id, ...doc.data() });
            });
            
            return reviews;
        } catch (error) {
            console.error("Error querying reviews: ", error);
            throw error;
        }
    }
    
    // Function to display results
    function displayResults(reviews, phoneNumber, serviceTypeFilter = '') {
        // Clear previous results
        searchResults.innerHTML = '';
        
        // If no reviews found
        if (reviews.length === 0) {
            let message = `No reviews found for ${formatPhoneNumber(phoneNumber)}`;
            if (serviceTypeFilter) {
                message += ` with service type "${formatServiceType(serviceTypeFilter)}"`;
            }
            displayNoResults(message);
            return;
        }
        
        // Create heading
        const heading = document.createElement('h3');
        heading.textContent = `Reviews for ${formatPhoneNumber(phoneNumber)}`;
        if (serviceTypeFilter) {
            heading.textContent += ` - ${formatServiceType(serviceTypeFilter)} services`;
        }
        searchResults.appendChild(heading);
        
        // Calculate average rating
        const avgRating = calculateAverageRating(reviews);
        const avgElement = document.createElement('div');
        avgElement.className = 'average-rating';
        avgElement.innerHTML = `<strong>Average Rating:</strong> ${avgRating.toFixed(1)} / 5 (${reviews.length} review${reviews.length !== 1 ? 's' : ''})`;
        searchResults.appendChild(avgElement);
        
        // Create a container for the reviews
        const reviewsContainer = document.createElement('div');
        reviewsContainer.className = 'reviews-container';
        
        // Add each review
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            const reviewHeader = document.createElement('div');
            reviewHeader.className = 'review-header';
            
            const reviewDate = document.createElement('div');
            reviewDate.className = 'review-date';
            reviewDate.textContent = formatDate(review.date);
            
            const reviewRating = document.createElement('div');
            reviewRating.className = 'review-rating';
            
            // Display individual ratings for each category
            const ratingsHTML = `
                <div class="individual-ratings">
                    <div class="rating-item">
                        <span class="rating-label">Quality:</span>
                        <span class="stars">${'★'.repeat(review.qualityRating || 0)}${'☆'.repeat(5 - (review.qualityRating || 0))}</span>
                    </div>
                    <div class="rating-item">
                        <span class="rating-label">Timeliness:</span>
                        <span class="stars">${'★'.repeat(review.timelinessRating || 0)}${'☆'.repeat(5 - (review.timelinessRating || 0))}</span>
                    </div>
                    <div class="rating-item">
                        <span class="rating-label">Professionalism:</span>
                        <span class="stars">${'★'.repeat(review.professionalismRating || 0)}${'☆'.repeat(5 - (review.professionalismRating || 0))}</span>
                    </div>
                    <div class="rating-item">
                        <span class="rating-label">Pricing:</span>
                        <span class="stars">${'★'.repeat(review.pricingRating || 0)}${'☆'.repeat(5 - (review.pricingRating || 0))}</span>
                    </div>
                </div>
            `;
            reviewRating.innerHTML = ratingsHTML;
            
            reviewHeader.appendChild(reviewDate);
            reviewHeader.appendChild(reviewRating);
            
            const reviewContent = document.createElement('div');
            reviewContent.className = 'review-content';
            reviewContent.textContent = review.reviewText;
            
            const reviewMeta = document.createElement('div');
            reviewMeta.className = 'review-meta';
            
            // Add service type if available (for backward compatibility with older reviews)
            if (review.serviceType) {
                const serviceType = document.createElement('div');
                serviceType.className = 'service-type';
                serviceType.innerHTML = `<strong>Service Type:</strong> ${formatServiceType(review.serviceType)}`;
                reviewMeta.appendChild(serviceType);
            }
            
            const reviewAuthor = document.createElement('div');
            reviewAuthor.className = 'review-author';
            reviewAuthor.textContent = `- ${review.reviewerName}`;
            reviewMeta.appendChild(reviewAuthor);
            
            reviewCard.appendChild(reviewHeader);
            reviewCard.appendChild(reviewContent);
            reviewCard.appendChild(reviewMeta);
            
            reviewsContainer.appendChild(reviewCard);
        });
        
        searchResults.appendChild(reviewsContainer);
    }
    
    // Function to display no results message
    function displayNoResults(message) {
        searchResults.innerHTML = `<div class="no-results">${message}</div>`;
    }
    
    // Function to calculate average rating
    function calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        
        const sum = reviews.reduce((total, review) => {
            const totalRating = review.qualityRating + review.timelinessRating + review.professionalismRating + review.pricingRating;
            return total + (totalRating / 4);
        }, 0);
        return sum / reviews.length;
    }
    
    // Update reviewRating to display individual ratings
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-header';
        
        const reviewDate = document.createElement('div');
        reviewDate.className = 'review-date';
        reviewDate.textContent = formatDate(review.date);
        
        const reviewRating = document.createElement('div');
        reviewRating.className = 'review-rating';
        reviewRating.innerHTML = `Quality: ${review.qualityRating} ★<br>
                                 Timeliness: ${review.timelinessRating} ★<br>
                                 Professionalism: ${review.professionalismRating} ★<br>
                                 Pricing: ${review.pricingRating} ★`;
        
        reviewHeader.appendChild(reviewDate);
        reviewHeader.appendChild(reviewRating);
        
        const reviewContent = document.createElement('div');
        reviewContent.className = 'review-content';
        reviewContent.textContent = review.reviewText;
        
        const reviewMeta = document.createElement('div');
        reviewMeta.className = 'review-meta';
        
        // Add service type if available (for backward compatibility with older reviews)
        if (review.serviceType) {
            const serviceType = document.createElement('div');
            serviceType.className = 'service-type';
            serviceType.innerHTML = `<strong>Service Type:</strong> ${formatServiceType(review.serviceType)}`;
            reviewMeta.appendChild(serviceType);
        }
        
        const reviewAuthor = document.createElement('div');
        reviewAuthor.className = 'review-author';
        reviewAuthor.textContent = `- ${review.reviewerName}`;
        reviewMeta.appendChild(reviewAuthor);
        
        reviewCard.appendChild(reviewHeader);
        reviewCard.appendChild(reviewContent);
        reviewCard.appendChild(reviewMeta);
        
        reviewsContainer.appendChild(reviewCard);
    });
    
    searchResults.appendChild(reviewsContainer);
    
    // Function to format phone number as (XXX) XXX-XXXX
    function formatPhoneNumber(phoneNumber) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
    
    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Function to format service type (capitalize first letter)
    function formatServiceType(serviceType) {
        return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
    }
});