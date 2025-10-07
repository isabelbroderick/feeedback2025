  
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
 const noteButton = document.getElementById("noteButton"); 
 const popup = document.getElementById("popup"); 
 const notePopup = document.getElementById("notePopup"); 

// Player position setup 
let posY = 50; // player Y in vh
let posX = -10; // player X in vw

// Initial player position
mc.style.top = posY + "vh";
mc.style.left = posX + "vw";
 
let finished = false; // track whether the game is finished 

 
// hide introduction popup
 document.getElementById("popupButton").addEventListener("click", function() {
  popup.style.display = "none";
  noteButton.style.display ="block";
});

 


//next button for page 1 -> page 2
 document.getElementById("nextButton").addEventListener("click", function() {
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "flex";
 document.getElementById("backButton").style.display = "flex";
});
//back button for page 2 -> page 1
document.getElementById("backButton").addEventListener("click", function() {
  document.getElementById("page2").style.display = "none";
  document.getElementById("page1").style.display = "flex";

}); 
 // Show notebook when player clicks notebook button
noteButton.addEventListener("click", function () {
  notePopup.style.display = "flex";
  noteButton.style.display = "none";
}); 

// Close the note popup if user clicks outside of it
document.body.addEventListener("click", function(event) {
  const popupStyle = getComputedStyle(notePopup);
  if (popupStyle.display !== "none" && !notePopup.contains(event.target) && event.target !== noteButton) {
    notePopup.style.display = "none";
    noteButton.style.display = "block";
  }
});

// Prevent popup from closing when clicking inside the popup itself
notePopup.addEventListener("click", function(event) {
  event.stopPropagation();
}); 

// Reference to the HTML list scambleList
const scrambleList = document.getElementById("scrambleList");

// Run checkOrder when the check button is clicked
document.getElementById("checkButton").addEventListener("click", checkOrder);

// Correct order of notes for the puzzle
const correctNotes = [ 
  "9:15 AM — Loud crash heard from the corner café.",
  "A man in a blue jacket runs away with a black backpack.",
  "A red hatchback pulls up beside the man.",
  "The man throws the backpack into the car and jumps in.",
  "Police collect CCTV footage from a shop."
];

// Function to shuffle an array and return a new shuffled array
function shuffleArray(arr) {
  let array = arr.slice(); // copy array so original stays unchanged
  for (let i = array.length -1; i > 0; i--) { // loop backwards through array
    const j = Math.floor(Math.random() * (i+1)); // pick random index from 0 to i inclusive
    [array[i], array[j]] = [array[j], array[i]]; // swap elements at i and j
  }
  return array; // return shuffled array
}

// Create list with notes and up/down buttons
function createScrambledList() {
  scrambleList.innerHTML = ""; // clear existing list
  const shuffled = shuffleArray(correctNotes); // shuffle notes 

  shuffled.forEach((note, index) => { // loop through shuffled notes
    const li = document.createElement("li"); // create list item
    li.textContent = note; // add note text
    li.className = "note-item"; // add CSS class

  
    const upButton = document.createElement("button"); //Creates a new button for moving the note up the list
    upButton.textContent = "up"; // label button
    upButton.onclick = () => moveItemUp(index); // move note up on click

  
    const downButton = document.createElement("button");  //Creates a new button for moving the note down the list
    downButton.textContent = "down"; // label button
    downButton.onclick = () => moveItemDown(index); // move note down on click

    // Add buttons to list item
    li.appendChild(document.createTextNode(" ")); // add space before buttons
    li.appendChild(upButton); 
    li.appendChild(downButton); 

    scrambleList.appendChild(li); // add list item to HTML list
  });
}

// Function to move a note up in the list
function moveItemUp(i) { 
  if (i === 0) return; // can't move first item up

  const items = [...scrambleList.children]; // get current list items
  scrambleList.insertBefore(items[i], items[i - 1]); // move current item before previous item
  refreshButtons(); // update buttons after moving
}


// Function to move a note down in the list
function moveItemDown(i) { 
  const items = [...scrambleList.children]; // get current list items
  if (i === items.length - 1) return; // can't move last item down

  scrambleList.insertBefore(items[i + 1], items[i]); // move next item before current
  refreshButtons(); // update buttons after moving
}



// Refresh up/down buttons after items have moved
function refreshButtons() { 
  const items = [...scrambleList.children]; // get current list items
  items.forEach((li, i) => { //Loop through each list item

    while (li.children.length > 0) li.removeChild(li.children[li.children.length - 1]); // Remove all old buttons

    // Add new buttons with updated index
    const upButton = document.createElement("button"); 
    upButton.textContent = "up";
    upButton.onclick = () => moveItemUp(i);

    const downButton = document.createElement("button");
    downButton.textContent = "down";
    downButton.onclick = () => moveItemDown(i);
    
    // Add buttons to list item
    li.appendChild(document.createTextNode(" "));
    li.appendChild(upButton);
    li.appendChild(downButton);
  });
}

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

// Check if the current order of notes is correct
function checkOrder() {
  const items = [...scrambleList.children]; // get current list items
 
 // Get the text of each note in order
const currentOrder = [];
for (let i = 0; i < scrambleList.children.length; i++) { // Loop through each <li> in the list. 
  const li = scrambleList.children[i];
  currentOrder.push(li.firstChild.textContent); //Add that text to the currentOrder array. 
}
let isCorrect = true; // assume correct
for (let i = 0; i < currentOrder.length; i++) {  // Loop through each note in currentOrder. 
  if (currentOrder[i] !== correctNotes[i]) {
    isCorrect = false; // found a mismatch
    break; // stop checking further
  }
}

  if (isCorrect) {
    document.getElementById("right").style.display = "flex"; // show right text
    document.getElementById("wrong").style.display = "none"; // hide wrong text
    backButton.style.display = "none"; 
    finishButton.style.display = "flex"; // show finish button
    markLevelComplete("level3"); // save progress
  } else {
    document.getElementById("right").style.display = "none"; // hide right text 
    document.getElementById("wrong").style.display = "flex"; // show wrong text
  }
}

// Close note popup and mark puzzle as finished
document.getElementById("finishButton").addEventListener("click", function() {
  document.getElementById("notePopup").style.display = "none";
  finished = true; // set finished flag
}); 

// Initialize the scrambled list when the page loads
createScrambledList();


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

  // Move to level 4 once finished and player walks off screen
  if (finished && posX >= 90) {
    window.location.href = "level4.html";
  }
});
