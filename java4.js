
 // Import Firebase modules 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, runTransaction  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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



const mc = document.getElementById("mc"); // Get the mc element from the DOM
var score = 0; // Initialize score






// Player position setup 
let posX = 50; 
let posY = 80;
// Initial player position
mc.style.top = posY + "vh";
mc.style.left = posX + "vw";


let currentAnswer = null; // store player's current answer for quiz/questions
let currentNoteAnswer = null; // store current note-related answer
let timeLeft = 30; // starting time
let timerInterval = null;// keeps track of the running timer 
let gamePaused = true; // track whether the game is currently paused


// Function to pause the game timer
function pauseTimer() {
    clearInterval(timerInterval); // stop the timer interval
    timerInterval = null;         // reset the interval variable
  
}

// Function to resume the game timer
function resumeTimer() {

  if (timeLeft <= 0) return;// don't start timer if time has run out

  // Start a new timer interval
  timerInterval = setInterval(() => {
    timeLeft--; // decrease timer by 1 second
    document.getElementById("timerDisplay").textContent = "Time: " + timeLeft; // update timer display

    if (timeLeft <= 0) {// if time is up
      endGame(); // end the game
    }
  }, 1000); // do this every second 
}

function endGame() {
  // stop everything, show final popup once
  pauseTimer(); // make sure interval is stopped
  gamePaused = true;
  resetObjects();
  hidePopups();
  displayPopUp(score);
}

// Attach all buttons click listeners 
document.getElementById("wrong").addEventListener("click", wrong);
document.getElementById("right").addEventListener("click", right);
document.getElementById("pos").addEventListener("click", pos);
document.getElementById("neg").addEventListener("click", neg);
document.getElementById("fakeButton").addEventListener("click", fake);
document.getElementById("startButton").addEventListener("click", start);

// Hide the instructions when they click done
document.getElementById("instructionsButton").addEventListener("click", function() {
  document.getElementById("instructionsPopup").style.display = "none";
  
}); 

function start (){ // when the start button is clicked
  
 gamePaused = false; // game is not paused 
  requestAnimationFrame(gameLoop)
    spawnLoop()

  document.getElementById("startScreen").style.display = "none";
  resumeTimer();


}
let notebooks = document.querySelectorAll(".notebook"); //  all notebook items
let computers = document.querySelectorAll(".computer"); // all computer items
let fakes = document.querySelectorAll(".fake"); // all fake items

// Function to create a new falling item
function spawnItem() {
  if (gamePaused) return; // do nothing if game is paused

  const itemTypes = ["notebook", "computer", "fake"]; // possible item types
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]; // pick random type

  const img = document.createElement("img"); // create new image element
  img.src = type + ".png"; // set img to be the relvent item type 
  img.classList.add("falling", type); // add CSS classes

 //spawning position
  img.style.left = Math.random() * (window.innerWidth - 50) + "px"; // Random horizontal position
  img.style.top = "0px"; // start at top of screen

  document.getElementById("sky").appendChild(img); // add item to the sky container

  // Add it to the correct array so gameLoop can track it
  if(type === "notebook") notebooks = [...notebooks, img];
  if(type === "computer") computers = [...computers, img];
  if(type === "fake") fakes = [...fakes, img];
}

// Loop to keep spawning items every second
function spawnLoop() {
  if (!gamePaused) {
    spawnItem(); // only create item if game is running
  }

  setTimeout(spawnLoop, 1000); // spawn every 1 second
}

// Remove all falling items from the screen
function resetObjects() {
  document.querySelectorAll(".falling").forEach(el => el.remove());
}

// Hide all page popups
function hidePopups() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });
}

// Check if an item has collided with the player
function checkCollision(item) {
  let mcRect = mc.getBoundingClientRect(); // get MC's position and size
  let itemRect = item.getBoundingClientRect(); // get item's position and size
  return !( // return true if they overlap
    mcRect.top > itemRect.bottom || // MC is below the object
    mcRect.bottom < itemRect.top || // MC is above the object
    mcRect.left > itemRect.right || // MC is to the right of the object
    mcRect.right < itemRect.left    // MC is to the left of the object
  );
}

// function that moves items and checks collisions
function gameLoop() {

  // Loop through all falling items
  [...notebooks, ...computers, ...fakes].forEach(item => { 
    item.style.top = (parseInt(item.style.top) + 5) + "px"; // move item down by 5px
   
    if (checkCollision(item)) { // if MC collides with item
      gamePaused = true; // pause the game
      pauseTimer(); // stop the timer

      // Notebook collision logic
      if (item.classList.contains("notebook")) {
        
        // pick a random note
        let randomIndex = Math.floor(Math.random() * noteText.length); 
        let chosenNote = noteText[randomIndex];

        // display the selected note's items
        let noteList = document.getElementById("noteText");
        noteList.innerHTML = ""; // clear previous notes
        chosenNote.notes.forEach(note => {
          noteList.innerHTML += `<li>${note}</li>`; // add new notes to list
        });
        document.getElementById("noteIntro").innerHTML = chosenNote.intro; // add intro to html element 
        currentNoteAnswer = chosenNote.answer; // store answer for checking
        document.getElementById("notebookPopup").style.display = "block"; // show notebook popup
      }

      // Computer collision logic
      if (item.classList.contains("computer")) {
        // pick random computer text
        let randomIndex = Math.floor(Math.random() * computerTexts.length); 
        let chosen = computerTexts[randomIndex];

        // display the chose computer text
        document.getElementById("computerText").innerHTML = chosen.text; 
        currentAnswer = chosen.answer; // store answer for checking
        document.getElementById("computerPopup").style.display = "block"; // show computer popup
      }

      // Fake item collision logic
      if (item.classList.contains("fake")) {
        document.getElementById("fake").style.display = "block"; // show fake popup
      }
    }
  });

  if (!gamePaused) requestAnimationFrame(gameLoop); // repeat game loop if not paused
}



// Array of computer messages with their sentiment
const computerTexts = [
  { text:
  "The Supreme Court’s overturning of Roe v. Wade has sent shockwaves through the nation, stripping millions of women of their constitutional right to make personal healthcare decisions. Critics argue that this decision disproportionately harms low-income and rural communities, forcing people to seek unsafe alternatives or travel long distances for care. Activists warn that decades of progress toward gender equality have been undone, leaving women vulnerable and voiceless in decisions about their own bodies."
  ,answer: "neg"
},
{ text:"Supporters of the Supreme Court’s decision to overturn Roe v. Wade praise it as a historic triumph for the protection of life and states’ rights. The ruling allows individual states to craft policies that align with their communities’ values, encouraging a culture that respects life. Advocates say this decision will promote alternatives such as adoption and family support programs, celebrating it as a victory for moral responsibility and local governance"
  , answer: "pos"
},
{ text:
  " New federal climate regulations are being criticized for stifling economic growth and burdening small businesses with excessive costs. Industry leaders warn that the rules could lead to widespread layoffs and skyrocketing energy prices, hitting working-class families hardest. Critics claim that these policies prioritize abstract environmental goals over the immediate well-being of citizens, creating more harm than good"
  ,answer: "neg"
},
{ text: "  The latest federal climate regulations represent a bold and necessary step toward protecting the planet for future generations. By incentivizing clean energy and reducing carbon emissions, these policies are expected to create thousands of green jobs while mitigating the effects of climate disasters. Environmentalists celebrate the move as a win for public health, biodiversity, and the long-term sustainability of communities worldwide."
    ,answer: "pos"
  },
 { text:   " Critics argue that recent immigration reforms will overwhelm public services, including healthcare and education, and put additional strain on already stretched infrastructure. They warn that unchecked immigration could increase crime rates and create economic burdens for taxpayers. Opponents contend that policymakers are prioritizing humanitarian ideals over practical national security and social stability."
      ,answer: "neg"
},
{ text:    "Proponents of the new immigration reforms highlight the humanitarian and economic benefits of welcoming more immigrants. By providing legal pathways for work and residency, the reforms support families fleeing persecution and contribute to a more diverse and skilled workforce. Advocates argue that immigrants strengthen communities, foster cultural exchange, and help drive economic growth, making the nation stronger and more inclusive."
  ,answer: "pos"
},
{ text:       " The latest gun control measures are being condemned as an infringement on constitutional rights, leaving law-abiding citizens vulnerable. Opponents argue that the restrictions will do little to curb crime while punishing responsible gun owners. Critics warn that such laws erode personal freedoms and empower criminals who will continue to access weapons illegally."
   ,answer: "neg"
},
{ text:        "Supporters of the new gun control legislation praise it as a necessary measure to reduce violence and protect communities. By implementing stricter background checks and limiting access to high-risk firearms, advocates believe the laws will save lives and prevent mass shootings. Many see this as a responsible step toward balancing individual rights with public safety, ensuring a safer environment for all citizens."
  ,answer: "pos"
 },
  
]

// Array of notebook events and the answer correctness
const noteText = [
  {
    intro: "cafe robbery.",
    notes: [
      "9:15 AM — Loud crash heard from the corner café.",
      "Police collect CCTV footage from a shop.",
      "A man in a blue jacket runs away with a black backpack.",
      "The man throws the backpack into the car and jumps in.",
      "A red hatchback pulls up beside the man.", 
      
    ]
      ,answer: "wrong"
  },
  {
    intro: "a fire alarm ",
    notes: [
      "2:00 PM — Fire alarm goes off inside the library.",
      "Students rush out carrying their bags.",
      "A teacher notices smoke near the back exit.",
      "Firefighters arrive on the scene quickly.",
      "Everyone is evacuated safely."
    ]
      ,answer: "right"
  },
  {
    intro: "a fight and a chase ",
    notes: [
      "10:45 PM — Loud shouting heard on Main Street.",
      "Two men are seen arguing near a car.",
      "One man throws a bottle and runs away.",
      "a man is seen chasing someone.",
      "Police arrive shortly after."
    ]
     ,answer: "right"
  },
  {
    intro: "A jewellery store robbery",
    notes: [
      "They drop a bag while escaping.",
      "7:30 AM — Delivery truck stops at the jewellery store.",
      "Two masked men rush inside the shop.",
      "Police recover stolen watches from the bag.",
      "Alarm goes off and the men flee.",
  
      
    ]
    ,answer: "wrong"
  },
  {
    intro: "Power outage and a smashed window",
    notes: [
      "8:50 PM — Storm knocks out power in the neighbourhood.",
      "A shadowy figure is spotted near a closed shop.",
      "The shop window is smashed.",
      "Neighbour calls the police immediately.",
      "The suspect is caught hiding in an alley."
    ]
      ,answer: "right"
  },
  {
    intro: "missing painting",
    notes: [
      "A suspect is found hiding inside a nearby maintenance closet..",
      "Security cameras go offline moments later.",
      "A security guard discovers the main gallery door ajar.",   
      "2:15 AM — Silent alarm triggers at the city art museum.",
      "A priceless painting is missing from the wall.",
      "Police arrive to find muddy footprints leading to the fire escape."
     
    ]
      ,answer: "wrong"
  }
];






function pos() {
  if (currentAnswer === "pos") {// if the answer is positive 
    score++; } // increase score 
  updateAfterAnswer();
  
}



function fake() {
  score--; // decrease score            
  updateAfterAnswer(); } 



function neg() {
  if (currentAnswer === "neg") { // if the answer is negative 
    score++; // increase score 
  }
  updateAfterAnswer();

}

function wrong() {
  if (currentNoteAnswer === "wrong") { //// if the answer is wrong
    score++; // increase score 
  } 
  updateAfterAnswer();

}
function right() {
  if (currentNoteAnswer === "right") { //// if the answer is right 
    score++; // increase score  
  }
  updateAfterAnswer();
 
}


function updateAfterAnswer() {
  resetObjects(); 
  gamePaused = false;       
  hidePopups();      
  gameLoop();
  document.getElementById("scoreDisplay").textContent = "Score: " + score; // // update score display 
  resumeTimer();  
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



  
// Function to save/update stars for a level in Firestore
async function stars(newStars, levelKey="level4") {
  try {
    const user = auth.currentUser; // get the currently signed-in user
    
    const s = Number(newStars); // ensure the newStars value is a number

    const userRef = doc(db, "users", user.uid); // reference to the user's document

    // Run a Firestore transaction to safely update stars
    const result = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef); // get user document
      const raw = snap.exists() ? snap.data() : {};  // blank if doesnt exsist  



      // defensive read of current stars for this level
      let currentStars = 0;
      if (raw?.stars?.[levelKey] !== undefined) { 
        currentStars = Number(raw.stars[levelKey]) || 0; // convert stored stars to number
      }

      // debug logging (optional)
      console.log("stars() transaction read:", JSON.stringify(raw));
      console.log("Transaction: currentStars =", currentStars, "newStars =", s);

      // Only update Firestore if newStars is higher than currentStars
      if (s > currentStars) {
        // If the document doesn't exist, create it with nested map; otherwise update field
        if (!snap.exists()) {
          const payload = { stars: { [levelKey]: s } }; // new document payload
          transaction.set(userRef, payload, { merge: true }); // create document
        } else {
          const fieldPath = `stars.${levelKey}`; // path to nested field
          transaction.update(userRef, { [fieldPath]: s }); // update existing document
        }
        return { ok: true, saved: true, stars: s }; // transaction result
      } else {
        return { ok: true, saved: false, stars: currentStars }; // no update needed
      }
    });

    console.log("stars() transaction result:", result); // log transaction result
    return result; // return result to caller
  } catch (err) {
    console.error("Failed to save stars:", err); // handle errors
    throw err; // propagate error
  }
}

// Function to save a score entry for a level in Firestore
async function saveScore(levelKey, scoreValue) {
  try {
    const user = auth.currentUser; // get currently signed-in user
    const userRef = doc(db, "users", user.uid); // reference to user's document

    // Run a transaction to safely append a new score
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef); // get current document
      const raw = snap.exists() ? snap.data() : {}; // get data or empty object

      // Get existing score history for this level or empty array
      const history = (raw.scores && raw.scores[levelKey]) ? raw.scores[levelKey] : [];

      // Create new score entry 
      const newEntry = {
        score: scoreValue,
        
      };

      const updatedHistory = [...history, newEntry]; // append new score to history

      // Save updated history back to Firestore
      transaction.set(userRef, { scores: { [levelKey]: updatedHistory } }, { merge: true });
    });

    console.log(`Saved score ${scoreValue} for ${levelKey}`); // log success
    return { ok: true }; // indicate success
  } catch (err) {
    console.error("Failed to save score:", err); // log errors
    throw err; // propagate error
  }
}



function displayPopUp(score) {
    // Create a div for the pop-up
    var popup = document.createElement("div");
    popup.setAttribute("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 2px solid black;");

    // Create elements for pop-up content
    var starImg = document.createElement("img");
    var star2Img = document.createElement("img");
    var star3Img = document.createElement("img");

    var title = document.createElement("h2");
    var message = document.createElement("h3");
    var additionalMessage = document.createElement("p");

    saveScore("level4", score);
 
    // Set title and message based on the score
    if (score < 1) {
        title.textContent = "You Failed next star at 1 point";
        message.textContent = "Try again!";
      
    } else if (score < 3) {
      starImg.src = "star.png";
    
        title.textContent = "1 Star next star at 3 points";
        message.textContent = "Hmm, you did okay. Move on or retry and see if you can score better.";
        additionalMessage.textContent = " ";
        markLevelComplete("level4"); 
        stars(1,"level4")
        
    } else if (score < 6) {
      starImg.src = "star.png";
      star2Img.src = "star.png";
        title.textContent = "2 Stars next star at 6 points";
        message.textContent = "Good job! Either try and improve or move on to the next level.";
        additionalMessage.textContent = "";
        markLevelComplete("level4"); 
        stars(2,"level4")
    } else {
      starImg.src = "star.png";
      star2Img.src = "star.png";
      star3Img.src = "star.png";
        title.textContent = "3 Stars";
        message.textContent = "Well done! You were clearly paying attention. Time to move on to the next level.";
        additionalMessage.textContent = "";
        markLevelComplete("level4"); 
        stars(3,"level4")
    }

    // Display the score in the pop-up
    var scoreDisplay = document.createElement("h2");
    scoreDisplay.textContent = "Score: " + score;

  // Style stars
  [starImg, star2Img, star3Img].forEach(star => {
    star.style.width = "90px";
    star.style.height = "90px";
    star.style.margin = "0 5px";
});


    // Create buttons for retry, next level, and logging highscore
    var retryButton = document.createElement("button");
    retryButton.textContent = "Retry";
    retryButton.onclick = function() {
        location.reload(); // Reload the current page to start again
    };

    var nextLevelButton = document.createElement("button");
    nextLevelButton.textContent = "Next Level";
    nextLevelButton.onclick = function() {
        window.location.href = "level5.html"; // Redirect to level 4 page
    };
    nextLevelButton.style.display = (score >= 1) ? "inline-block" : "none"; // Show only if score is 1 or more

   


    // Append elements to the pop-up

    if (starImg.src) popup.appendChild(starImg);
    if (star2Img.src) popup.appendChild(star2Img);
    if (star3Img.src) popup.appendChild(star3Img);
    popup.appendChild(title);
    popup.appendChild(scoreDisplay); // Append score display
    popup.appendChild(message);
    popup.appendChild(additionalMessage);
    popup.appendChild(retryButton);
    popup.appendChild(nextLevelButton);

   

    // Append the pop-up to the body of the HTML document
    document.body.appendChild(popup);
}


document.addEventListener("keydown", function(event) { // Listen for “A” and “D” keys to move MC 
  if (gamePaused) return; 
switch(event.key.toLowerCase()) {
  case "a":
    posX = Math.max(0, posX - 1); // move left
    break;
  case "d":
    posX = Math.min(95, posX + 1); // move right
    break;
}

// Update player position on screen  
mc.style.left = posX + "vw";
mc.style.top = posY + "vh";})


