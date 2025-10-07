    
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
 let donePopupClosed = false; 
 const mc = document.getElementById("mc");
 const button = document.getElementById("computer-button");


 // Player position setup 
 let posY = 50; // player Y in vh
 let posX = -10; // player X in vw

 // Initially position MC 
 mc.style.top = posY + "vh";
 mc.style.left = posX + "vw";

 // where the button is, as said in css 
 const buttonX = 56;
 const buttonY = 50; 

 // How close MC must be for the button to appear
 const thresholdX = 10; 
 const thresholdY = 100; 



// Attach all quiz button click listeners 
 document.getElementById("center1").addEventListener("click", wrong1);
 document.getElementById("left1").addEventListener("click", wrong1);
 document.getElementById("right1").addEventListener("click", correct1);
 document.getElementById("center2").addEventListener("click", wrong2);
 document.getElementById("left2").addEventListener("click", correct2);
 document.getElementById("right2").addEventListener("click", wrong2);

 document.getElementById("center3").addEventListener("click", correct3);
 document.getElementById("left3").addEventListener("click", wrong3);
 document.getElementById("right3").addEventListener("click", wrong3);

 document.getElementById("done").addEventListener("click", done);


 


// when computerButton is clicked show computer popup 
 button.addEventListener("click", function () {
    document.getElementById("computer-popup").style.display = "block";
    button.style.display = "none";
});

// hide computer popup
document.getElementById("closeComputerPopup").addEventListener("click", function() {
    document.getElementById("computer-popup").style.display = "none";
  }); 

  // hide intro popup
document.getElementById("introPopup").addEventListener("click", function() {
    document.getElementById("popup").style.display = "none";
  });




  

//next button for page 1 -> page 2
  document.getElementById("nextButton").addEventListener("click", function() {
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "flex";
  document.getElementById("backButton").style.display = "block";
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
  });

//multiple choice logic for Page 2       
  function wrong1() {
    document.getElementById("rightText").style.display = "none";
    document.getElementById("wrongText").style.display = "flex";
      }
  function correct1() {
    document.getElementById("rightText").style.display = "flex";
    document.getElementById("wrongText").style.display = "none";
      }

    
//next button for page 3 -> page 4
  document.getElementById("nextButton3").addEventListener("click", function() {
  document.getElementById("page3").style.display = "none";
  document.getElementById("page4").style.display = "flex";
  })
//multiple choice logic for Page 3         
  function wrong2() {
    document.getElementById("rightText2").style.display = "none";
    document.getElementById("wrongText2").style.display = "flex";
      }
  function correct2() {
   document.getElementById("rightText2").style.display = "flex";
   document.getElementById("wrongText2").style.display = "none";
      }
     
//next button for page 4 -> page 5
document.getElementById("nextButton4").addEventListener("click", function() {
    document.getElementById("page4").style.display = "none";
    document.getElementById("page5").style.display = "flex";
})
//multiple choice logic for Page 4       
  function wrong3() {
    document.getElementById("rightText3").style.display = "none";
    document.getElementById("wrongText3").style.display = "flex";
  }
    function correct3() {
    document.getElementById("rightText3").style.display = "flex";
    document.getElementById("wrongText3").style.display = "none";
  }
  // done button, closes computer popup 
   function done() {
    document.getElementById("computer-popup").style.display = "none";
    document.getElementById("doneDiv").style.display = "flex";
   

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

 // Close done popup and update level progress 
document.getElementById("doneButton").addEventListener("click", function() {
  document.getElementById("doneDiv").style.display = "none";
  donePopupClosed = true;
  markLevelComplete("level7");  // save progress
});
 



 // Function to show/hide the button based on the players location
 function checkProximity() {
     const dx = Math.abs(posX - buttonX);
     const dy = Math.abs(posY - buttonY);

     if (dx <= thresholdX && dy <= thresholdY) {
         button.style.display = "block";
     } else {
         button.style.display = "none";
     }
 }

 
 checkProximity();

 // Listen for “A” and “D” keypresses to move MC left/right
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
     
     // Move to level 8 once popup closed and player walks off screen
     if (donePopupClosed && posX >= 90) {
      window.location.href = "level8.html";
    }
 });

