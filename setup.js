// Firebase Setup Helper Script

// This script helps with setting up the Firebase project
// Run this in your browser console after updating firebase-config.js with your credentials

// Import Firebase modules
import { db, collection, getDocs, query, where, orderBy } from './firebase-config.js';

console.log('Firebase Setup Helper Script');
console.log('================================');

// Function to test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('Testing Firebase connection...');
        
        // Try to access the reviews collection
        const reviewsRef = collection(db, 'reviews');
        const testQuery = query(reviewsRef, where('serviceProvider', '==', '0000000000'));
        
        // Execute the query to test connection
        await getDocs(testQuery);
        
        console.log('✅ Firebase connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        console.log('Please check your Firebase configuration in firebase-config.js');
        return false;
    }
}

// Function to create a test review to trigger index creation
async function createTestReview() {
    try {
        console.log('Creating a test review to help with index creation...');
        
        // Import the addDoc function dynamically
        const { addDoc } = await import('./firebase-config.js');
        
        // Create a test review
        const reviewsRef = collection(db, 'reviews');
        const testReview = {
            serviceProvider: '0000000000',
            serviceType: 'test',
            rating: 5,
            reviewText: 'This is a test review to help with index creation.',
            reviewerName: 'Test User',
            date: new Date().toISOString()
        };
        
        // Add the test review
        const docRef = await addDoc(reviewsRef, testReview);
        console.log('✅ Test review created with ID:', docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error('❌ Failed to create test review:', error);
        return null;
    }
}

// Function to test compound query (to trigger index creation)
async function testCompoundQuery() {
    try {
        console.log('Testing compound query (serviceProvider + serviceType + orderBy)...');
        
        // Create a compound query that will require an index
        const reviewsRef = collection(db, 'reviews');
        const compoundQuery = query(
            reviewsRef,
            where('serviceProvider', '==', '0000000000'),
            where('serviceType', '==', 'test'),
            orderBy('date', 'desc')
        );
        
        // Execute the query
        await getDocs(compoundQuery);
        
        console.log('✅ Compound query successful! Your indexes are set up correctly.');
        return true;
    } catch (error) {
        console.error('❌ Compound query failed:', error);
        
        // Check if the error is related to missing index
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
            console.log('You need to create an index for this query.');
            console.log('Look for a URL in the error message above and open it to create the required index.');
            console.log('After creating the index, wait a few minutes for it to be active, then try again.');
        }
        
        return false;
    }
}

// Function to display Firebase setup instructions
function displaySetupInstructions() {
    console.log('\nFirebase Setup Instructions');
    console.log('========================');
    console.log('1. Create a Firebase project at https://console.firebase.google.com/');
    console.log('2. Add a web app to your project');
    console.log('3. Copy your Firebase config to firebase-config.js');
    console.log('4. Create a Firestore database in test mode');
    console.log('5. Run this script again to test your connection');
    console.log('\nFor more detailed instructions, see the README.md file.');
}

// Main function to run all tests
async function runSetupTests() {
    console.log('Running Firebase setup tests...');
    
    // Test Firebase connection
    const connectionSuccess = await testFirebaseConnection();
    if (!connectionSuccess) {
        displaySetupInstructions();
        return;
    }
    
    // Create a test review
    const testReviewId = await createTestReview();
    if (!testReviewId) {
        console.log('Could not create a test review. Please check your Firestore rules.');
        return;
    }
    
    // Test compound query to trigger index creation
    const querySuccess = await testCompoundQuery();
    if (!querySuccess) {
        console.log('Please create the required index and try again.');
    } else {
        console.log('\n🎉 All tests passed! Your Firebase setup is complete.');
        console.log('You can now use the KacchaChittha with Firebase.');
    }
}

// Run the setup tests
runSetupTests();