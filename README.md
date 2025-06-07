# KacchaChittha with Firebase

## Overview
This is a simple web application that allows users to submit and search for reviews of service providers. The application uses Firebase Firestore for data storage, allowing reviews to be accessed from any device with an internet connection.

## Features
- Submit reviews for service providers with ratings, comments, and service type
- Search for reviews by service provider phone number
- Filter reviews by service type
- Responsive design that works on mobile and desktop
- Data stored in Firebase Firestore cloud database

## Setup Instructions

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Once your project is created, click on "Web" (</>) to add a web app to your project
4. Register your app with a nickname (e.g., "KacchaChittha")
5. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Update Firebase Configuration
1. Open the `firebase-config.js` file in this project
2. Replace the placeholder configuration with your own Firebase configuration

### 3. Set Up Firestore Database
1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in test mode for development (you can adjust security rules later)
4. Choose a database location close to your users
5. Wait for the database to be provisioned

### 4. Create Firestore Index (Required for Queries)
1. After submitting a few reviews, when you try to search with a service type filter, you may see an error in the console
2. The error will include a link to create the required index
3. Click on that link and create the index
4. Wait for the index to be created (this may take a few minutes)

### 5. Run the Application
You can run the application in two ways:

#### Option 1: Using a local server
Run a local server in the project directory. For example, using Python:

```
python -m http.server 8000
```

Then open your browser and navigate to `http://localhost:8000`

#### Option 2: Using a Firebase Hosting
For a more permanent solution, you can deploy the application to Firebase Hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize your project: `firebase init` (select Hosting and your project)
4. Deploy your application: `firebase deploy`

### 6. Verify Your Setup
A helper script is included to verify your Firebase setup:

1. Open your browser's developer console (F12 or right-click > Inspect > Console)
2. Navigate to your application
3. Run the following command in the console: `import('./setup.js')`
4. Follow the instructions in the console output

This script will:
- Test your Firebase connection
- Create a test review
- Test the compound query to ensure indexes are set up correctly
- Provide guidance if any issues are found

## How It Works

### Data Structure
Reviews are stored in a Firestore collection called "reviews" with the following fields:
- `serviceProvider`: The phone number of the service provider
- `serviceType`: The type of service provided (plumbing, electrical, etc.)
- `rating`: Numeric rating from 1 to 5
- `reviewText`: The text content of the review
- `reviewerName`: The name of the reviewer (or "Anonymous")
- `date`: The date and time when the review was submitted

### File Structure
- `index.html`: The main page for submitting reviews
- `search.html`: The page for searching reviews
- `styles.css`: CSS styles for the application
- `firebase-config.js`: Firebase configuration and initialization
- `app.js`: JavaScript for the review submission functionality
- `search.js`: JavaScript for the review search functionality

## Usage

### Submitting a Review
1. Open the application in your browser
2. Fill out the review form with the service provider's phone number, service type, rating, review text, and your name (optional)
3. Click "Submit Review"

### Searching for Reviews
1. Click on "Search Reviews" in the navigation menu
2. Enter the service provider's phone number
3. Optionally select a service type to filter the results
4. Click "Search"
5. View the results, including the average rating and individual reviews

## Limitations
- No user authentication (anyone can submit reviews)
- No pagination for search results (all reviews are loaded at once)
- Limited validation for review submissions

## Future Improvements
- Add user authentication
- Add service provider profiles
- Add photo uploads for reviews
- Add pagination for search results
- Add more advanced search filters
- Add admin panel for moderation

## License
This project is licensed under the MIT License - see the LICENSE file for details.