import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Replace this with your actual Firebase config!
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if the user has provided real keys
export let db = null;
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  console.warn("Firebase is not initialized. Please add your firebaseConfig to js/firebase-init.js");
}

window.submitRSVP = async function() {
  const nameInput = document.getElementById('rsvp-name');
  const guestsInput = document.getElementById('rsvp-guests');
  const attendingRadio = document.querySelector('input[name="attending"]:checked');
  const btn = document.getElementById('rsvp-btn');
  
  if (!nameInput || !nameInput.value.trim()) {
    alert('Please enter your name');
    return;
  }
  
  if (!db) {
    alert('Backend is not yet configured. The owner needs to add their Firebase keys to js/firebase-init.js');
    return;
  }
  
  const name = nameInput.value.trim();
  const guests = parseInt(guestsInput ? guestsInput.value : '1');
  const attending = attendingRadio ? attendingRadio.value : 'yes';
  
  btn.disabled = true;
  btn.textContent = 'Sending...';
  
  try {
    await addDoc(collection(db, "rsvps"), {
      name: name,
      guests: guests,
      attending: attending,
      timestamp: serverTimestamp()
    });
    
    nameInput.value = '';
    alert(attending === 'yes' ? '🎉 Thank you! We can\'t wait to celebrate with you!' : '💐 Thank you for letting us know. You\'ll be missed!');
  } catch (e) {
    console.error("Error adding document: ", e);
    alert('Could not send RSVP. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send RSVP';
  }
};
