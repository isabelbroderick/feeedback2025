 // Import Firebase modules
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
 import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
 import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
 
// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5ejSYsZrL6UIXtC5aksOZuAvCC_UiGt4",
  authDomain: "tech2025-2ad90.firebaseapp.com",
  projectId: "tech2025-2ad90",
  storageBucket: "tech2025-2ad90.firebasestorage.app",
  messagingSenderId: "1022983811748",
  appId: "1:1022983811748:web:0e70d76c537d6fc1f3ac31",
  measurementId: "G-6T0ZXD5YKQ"
};

// Initialize Firebase App, Auth and Firestore Database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Store Firebase state globally for access in other scripts
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseReady = false; 
window.currentFirebaseUser = null;


// Track authentication state changes (sign-in / sign-out)
onAuthStateChanged(auth, user => {
  window.currentFirebaseUser = user;
  window.firebaseReady = true;
  if (user) {
    // If a user is signed in, tell them what user they are signed in as 
    console.log("Firebase: signed in as", user.uid, user.email);
    document.getElementById("userHeading").textContent = "signed in as " +(user.email)
    document.getElementById("switchUserButton").textContent = "Switch User" 
  } else {
    // If no user is signed in, warn user progress will be lost
    console.log("Firebase: no user signed in");
    document.getElementById("userHeading").textContent = "No User Signed in, sign in or progress will be lost " 
    document.getElementById("switchUserButton").textContent = "sign in" 
  }
});

   
// on swich user button click
document.getElementById("switchUserButton").addEventListener("click", function() {
  signOut(auth); // sign user out
  window.location.href = "levels.html"; // redirect to levels page
}); 
 
 
 
 
 
 
// declare the Game elements from the DOM 
 const mc = document.getElementById("mc");
 const usbButton = document.getElementById("usbButton"); 
 const photosButton = document.getElementById("photosButton"); 
 const notepadButton = document.getElementById("notepadButton"); 
 var message = document.getElementById("message");


 let donePopupClosed = false; // track whether done popup closed
 var score = 0 // initialize score as 0


//click listeners to call game function for the  different buttons
 photosButton.addEventListener("click", () => game(photosButton));
notepadButton.addEventListener("click", () => game(notepadButton));
usbButton.addEventListener("click", () => game(usbButton));


// Attach click listeners to close popups
document.getElementById("introPopupButton").addEventListener("click", closePopup); 
document.getElementById("doneButton").addEventListener("click", closeDone); 

// Player position setup 
 let posY = 60; // player Y in vh
 let posX = -10; // player X in vw

// Initial player position
 mc.style.top = posY + "vh";
 mc.style.left = posX + "vw";

 // Coordinates for each object, matching their CSS
 const photosX = 10,   photosY = 13;
 const notepadX = 74,  notepadY = 89;
 const usbX = 55,      usbY = 54;
 

 // How close MC must be to reveal an object
 const thresholdX = 4;
 const thresholdY = 100;


// Mark the level as complete in Firebase
 async function markLevelComplete(levelKey) {
  try {
    const user = auth.currentUser; // current logged-in user
    const userRef = doc(db, "users", user.uid); // reference to the specific users document in the "users" collection
    // Update Firestore with level completion flag
    await setDoc(userRef, { levels: { [levelKey]: true } }, { merge: true }); // mark this level as complete in Firestore for this user
    console.log(`${levelKey} marked complete for ${user.uid}`); // log in console 
    return { ok: true };
  } catch (err) { // Error handling if Firestore write fails
  
    console.error("Failed to write level completion:", err);
    throw err;
  }
}

 // Hide the initial popup
 function closePopup() {
   document.getElementById("popup").style.display = "none";
  
  
   
 }
 // Close done popup and update level progress 
 function closeDone() {
  document.getElementById("donePopup").style.display = "none";
  donePopupClosed = true;
  markLevelComplete("level2"); 
  
}



// Handle item collection and update score
 function game(button) {
  score ++;
  message.textContent = "Score: " + score;  // Update the score display 

// Remove the collected item from the screen
  const parentDiv = button.parentElement;
  parentDiv.remove();

  // If all items are collected, show the "done" popup
  if (score === 3) {
    document.getElementById("donePopup").style.display = "flex";
  }
}

  


















 // Toggle visibility of each DIV based on MC’s distance
 function checkProximity() {
   // Photos
   const dx_photos = Math.abs(posX - photosX);
   const dy_photos = Math.abs(posY - photosY);
   if (dx_photos <= thresholdX && dy_photos <= thresholdY) {
     photosButton.style.display = "block";
   } else {
     photosButton.style.display = "none";
   }

   // Notepad
   const dx_notepad = Math.abs(posX - notepadX);
   const dy_notepad = Math.abs(posY - notepadY);
   if (dx_notepad <= thresholdX && dy_notepad <= thresholdY) {
     notepadButton.style.display = "block";
   } else {
     notepadButton.style.display = "none";
   }

   // USB
   const dx_usb = Math.abs(posX - usbX);
   const dy_usb = Math.abs(posY - usbY);
   if (dx_usb <= thresholdX && dy_usb <= thresholdY) {
     usbButton.style.display = "block";
   } else {
    usbButton.style.display = "none";
   }
 }








// MC movement with keyboard control
document.addEventListener("keydown", function (event) {
  switch (event.key.toLowerCase()) {
    case "a": // move left
      posX = Math.max(-10, posX - 1);
      break;
    case "d": // move right
      posX = Math.min(91, posX + 1);
      break;
  }

  // Update player position on screen 
   mc.style.top = posY + "vh";
   mc.style.left = posX + "vw";

   // Then check proximity for all objects
   checkProximity();

     // Move to level 3 once popup closed and player walks off screen
   if (donePopupClosed && posX >= 90) {
    window.location.href = "level3.html";}
 });

 