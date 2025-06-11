// Change the imports to use the full URLs like in firebase-config.js
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ...rest of the code remains the same...
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const notification = document.getElementById('messageNotification');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = document.getElementById('message').value.trim();
        
        if (!message) {
            showNotification('Please enter a message', 'error');
            return;
        }

        try {
            await addDoc(collection(db, 'messages'), {
                message: message,
                date: new Date().toISOString()
            });

            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Error sending message. Please try again.', 'error');
            console.error('Error:', error);
        }
    });

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
});