// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
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
const boss = document.getElementById("boss");
const bubble = document.getElementById("bubble");
const bubbleText = document.getElementById("bubbleText");
const button = document.getElementById("computerButton");



// Attach all quiz button click listeners
document.getElementById("wrong1").addEventListener("click", wrong1);
document.getElementById("wrong2").addEventListener("click", wrong2);
document.getElementById("wrong3").addEventListener("click", wrong3);
document.getElementById("right1").addEventListener("click", right1);
document.getElementById("right2").addEventListener("click", right2);
document.getElementById("right3").addEventListener("click", right3);
document.getElementById("closeDone").addEventListener("click",closeDone);

let donePopupClosed = false; // track whether done popup closed
let popupClosed=false
const mc1 = document.getElementById("mc1");  // reference to the MC1 image element

// Page navigation buttons
//next button for page 1 -> page 2
document.getElementById("nextButton").addEventListener("click", function() {
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "flex";
  document.getElementById("backButton").style.display = "block";
});
//back button for page 2 
document.getElementById("backButton").addEventListener("click", function() {
  document.getElementById("page2").style.display = "none";
  document.getElementById("page1").style.display = "flex";
});
// next button for page 2 -> page 3
document.getElementById("nextButton2").addEventListener("click", function() {
  document.getElementById("page2").style.display = "none";
  document.getElementById("page3").style.display = "flex";
});

//multiple choice logic for Page 2 
function wrong1() {
  document.getElementById("rightText").style.display = "none";
  document.getElementById("wrongText").style.display = "flex";
}
function right1() {
  document.getElementById("rightText").style.display = "flex";
  document.getElementById("wrongText").style.display = "none";
}

// next button for Page 3 -> Page 4
document.getElementById("nextButton3").addEventListener("click", function() {
  document.getElementById("page3").style.display = "none";
  document.getElementById("page4").style.display = "flex";
});

// Multiple choice logic for Page 4
function wrong2() {
  document.getElementById("rightText2").style.display = "none";
  document.getElementById("wrongText2").style.display = "flex";
}
function right2() {
  document.getElementById("rightText2").style.display = "flex";
  document.getElementById("wrongText2").style.display = "none";
}

// next button for Page 4 -> Page 5
document.getElementById("nextButton4").addEventListener("click", function() {
  document.getElementById("page4").style.display = "none";
  document.getElementById("page5").style.display = "flex";
});

//Multiple choice logic for Page 5
function wrong3() {
  document.getElementById("rightText3").style.display = "none";
  document.getElementById("wrongText3").style.display = "flex";
}
function right3() {
  document.getElementById("rightText3").style.display = "flex";
  document.getElementById("wrongText3").style.display = "none";
}

// next button for page 5. closes computer popup and opens done popup 
document.getElementById("nextButton5").addEventListener("click", function() {
  document.getElementById("computerPopup").style.display = "none";
  popupClosed=true 

  document.getElementById("doneDiv").style.display = "flex"; 
});


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

// Close done popup and update level progress
function closeDone() {

  document.getElementById("doneDiv").style.display = "none";
  donePopupClosed = true;
  mc1.src = "mc1.png" // change player image after completion
  markLevelComplete("level1"); // save progress
}

//Boss movement and dialogue
let BposX = -200; // starting X position for boss
const stopX = window.innerWidth / 2 - 100; // stopping point at mid-screen

// Player position setup
const buttonX = 56; // position of computer button
const buttonY = 50; 
const mc = document.getElementById("mc"); 
let posY = 50; // player Y in vh
let posX = -10; // player X in vw

// Initial player position
mc.style.top = posY + "vh";
mc.style.left = posX + "vw";

// Proximity thresholds for showing computer button
const thresholdX = 10; 
const thresholdY = 100;  
 
// Show ComputerPopup when player interacts with computer
document.getElementById("computerButton").addEventListener("click", function() {
  document.getElementById("computerPopup").style.display = "block";
button.style.display = "none";
}); 


// Track dialogue steps with boss
let dialogueStep = 0;

// Boss walks in from right side of screen
function walkIn() {
  if (BposX < stopX) { // if boss isnt halfway across the screen yet 
    BposX += 10;
    boss.style.right = BposX + "px"; 
    requestAnimationFrame(walkIn);
  } else {
    bubble.style.display = "block"; // show dialogue bubble when boss reachs halfway
  }
}

// Boss walks out of screen
function walkOut() {
  if (BposX < window.innerWidth + 200) {
    BposX += 10;
    boss.style.right = BposX + "px";
    requestAnimationFrame(walkOut);
  } else {
    boss.style.display = "none"; // hide boss off-screen
    bubble.style.display = "none"; // hide bubble
  }
}

// change the dialogue every time the nextButtonSpeech is pressed 
document.getElementById("nextButtonSpeech").addEventListener("click", function() {
  dialogueStep++; // increase the dialogue step every time the button is clicked
  if (dialogueStep === 1) {
    bubbleText.innerHTML = 'To move, use the <strong>A</strong> and <strong>D</strong> keys on your keyboard.';
  } else if (dialogueStep === 2) {
    bubbleText.innerHTML = 'To start, have a look around the office for your unfinished article.';
    nextButtonSpeech.textContent = "OK"; // change button text
  } else if (dialogueStep === 3) {
    bubble.style.display = "none"; // hide bubble
    walkOut(); // boss exits
  }
});

// Check if player is close enough to computer button
function checkProximity() {
 const dx = Math.abs(posX - buttonX);
 const dy = Math.abs(posY - buttonY);
 if (dx <= thresholdX && dy <= thresholdY && !popupClosed)  {
     button.style.display = "block"; // if close enough show
 } else {
     button.style.display = "none"; // if not dont showw 
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
  
  checkProximity(); // check distance to computer
  
  // Move to level 2 once popup closed and player walks off screen
  if (donePopupClosed && posX >= 90) {
    window.location.href = "level2.html";
  }
});

// Start boss walk-in sequence
walkIn();
