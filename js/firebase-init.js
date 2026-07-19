import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Replace this with your actual Firebase config!
export const firebaseConfig = {
  apiKey: "AIzaSyBJe3trA-8I7e4dIu4EWhkdv0A1ERBH1tU",
  authDomain: "vpk-rsvp.firebaseapp.com",
  projectId: "vpk-rsvp",
  storageBucket: "vpk-rsvp.firebasestorage.app",
  messagingSenderId: "791260035268",
  appId: "1:791260035268:web:fae45fdefeb5ffa3bc7191",
  measurementId: "G-S7EFP194K8"
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
    btn.textContent = 'Send';
  }
};
