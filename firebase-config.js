// Firebase configuration file

// Import the Firebase SDK modules we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
// Replace these values with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw2eG8jBvXuw13seV3j9AnVQOodiVIikw",
  authDomain: "kacchachittha.firebaseapp.com",
  projectId: "kacchachittha",
  storageBucket: "kacchachittha.firebasestorage.app",
  messagingSenderId: "1089499143492",
  appId: "1:1089499143492:web:243d1ae54c151226524b11",
  measurementId: "G-FLBYG1VHWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore instance and functions for use in other files
export { 
  db, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy 
};