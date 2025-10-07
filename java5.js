   
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
 const mc = document.getElementById("mc");
 const noteButton = document.getElementById("noteButton"); 
 const popup = document.getElementById("popup"); 
 const notePopup = document.getElementById("notePopup"); 
 

// Player position setup 
let posY = 50; // player Y in vh
let posX = -10; // player X in vw

 // Initially position MC 
 mc.style.top = posY + "vh";
 mc.style.left = posX + "vw";

 let finished = false  // track whether the game is finished  


 
// hide introduction popup
 document.getElementById("introPopupButton").addEventListener("click", function() {
  popup.style.display = "none";
  noteButton.style.display = "flex"; });

 // Show notebook when player clicks notebook button
noteButton.addEventListener("click", function () {
  notePopup.style.display = "flex";
  noteButton.style.display = "none";
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
//next button for page 2 -> page 3
 document.getElementById("nextButton2").addEventListener("click", function() {
  document.getElementById("page2").style.display = "none";
  document.getElementById("page3").style.display = "flex";
 document.getElementById("backButton2").style.display = "flex";
});
//back button for page 3 -> page 2
document.getElementById("backButton2").addEventListener("click", function() {
  document.getElementById("page3").style.display = "none";
  document.getElementById("page2").style.display = "flex";

}); 
//next button for page 3 -> page 4
document.getElementById("nextButton3").addEventListener("click", function() {
  document.getElementById("page3").style.display = "none";
  document.getElementById("page4").style.display = "flex";
 document.getElementById("backButton3").style.display = "flex";
});

//back button for page 4 -> page 3
document.getElementById("backButton3").addEventListener("click", function() {
  document.getElementById("page4").style.display = "none";
  document.getElementById("page3").style.display = "flex";

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
 

 


// page 2 feedback

// get feedback elements (page 2) from the DOM 
const feedback = document.getElementById("feedback"); 
const buttonsPage2 = document.querySelectorAll("#page2 .headline-button"); // Select all headline buttons on page 2
const nextButton2 = document.getElementById("nextButton2"); 
nextButton2.style.display = "none"; // Hide the Next button

// the  different feedback messages 
const feedbackMessages2 = {
  positive: "This headline is overly positive and downplays concerns about the stadium.",
  negative: "This headline frames the stadium negatively, emphasizing controversy.",
  veryNegative: "This headline is very negative, focusing on taxpayer burden and neglect of services.",
  correct: "This is the least biased, accurate headline."
};

// a click event listener for each headline button
buttonsPage2.forEach(button => {
  button.addEventListener("click", function() {
   
    feedback.textContent = feedbackMessages2[button.id]; // Display the feedback message that corresponds to the clicked button's ID

    // If the correct headline is selected, show the Next button
    if (button.id === "correct") {
      nextButton2.style.display = "block";
    } else {
      // else hide the Next button 
      nextButton2.style.display = "none";
    }
  });
});


// page 3 feedback

// get feedback elements (page 3) from the DOM 
const feedback2 = document.getElementById("feedback2");
const buttonsPage3 = document.querySelectorAll("#page3 .headline-button"); // Select all headline buttons on page 3
const nextButton3 = document.getElementById("nextButton3");
nextButton3.style.display = "none"; 

// the  different feedback messages 
const feedbackMessages3 = {
  positive2: "This headline highlights the benefits of the hospital AI system.",
  negative2: "This headline emphasizes risks and possible mistakes.",
  correct2: "This is the accurate, balanced headline about the AI system."
};
// a click event listener for each headline button 
buttonsPage3.forEach(button => {
  button.addEventListener("click", function() {
    feedback2.textContent = feedbackMessages3[button.id]; // Display the feedback message that corresponds to the clicked button's ID 

     // If the correct headline is selected, show the Next button 
    if (button.id === "correct2") {
      nextButton3.style.display = "block";
    } else {
      // else hide the Next button 
      nextButton3.style.display = "none";
    }
  });
});

// page 4 feedback

// get feedback elements (page 4) from the DOM 
const feedback3 = document.getElementById("feedback3");
const buttonsPage4 = document.querySelectorAll("#page4 .headline-button"); // Select all headline buttons on page 4
const doneButton = document.getElementById("doneButton");
doneButton.style.display = "none"; // Hide the Next button 

// the  different feedback messages 
const feedbackMessages4 = {
  positive3: "This headline focuses on positive aspects of the rail project.",
  negative3: "This headline emphasizes the costs and controversy.",
  correct3: "This is the most accurate, balanced headline about the rail project."
};
// a click event listener for each headline button 
buttonsPage4.forEach(button => {
  button.addEventListener("click", function() {
    feedback3.textContent = feedbackMessages4[button.id]; // Display the feedback message that corresponds to the clicked button's ID 

    // If the correct headline is selected, show the done button 
    if (button.id === "correct3") {
      doneButton.style.display = "block";
    } else {
      // else hide the done button 
      doneButton.style.display = "none";
    }
  });
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



 // Close note popup and update level progress 
document.getElementById("doneButton").addEventListener("click", function() {
  document.getElementById("notePopup").style.display = "none";
  finished = true // mark game as finished 
  markLevelComplete("level5");  // save progress
}); 







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

    // Move to level 6 once popup closed and player walks off screen
   if (finished && posX >= 90) {
    window.location.href = "level6.html";
  }
  
 });
 

