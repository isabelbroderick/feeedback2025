 // Import Firebase modules 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, runTransaction, addDoc, collection  } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
var score = 0 // Initialize score

// Player position setup 
let posX = 50; 
let posY = 80;

let currentAnswer = null; // store player's current answer for quiz/questions
let currentNoteAnswer = null; // store current note-related answer
let timeLeft = 30; // starting time
let timerInterval = null;// keeps track of the running timer 
let gamePaused = true; // track whether the game is currently paused


// Initial player position
mc.style.top = posY + "vh";
mc.style.left = posX + "vw";

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
document.getElementById("fakeButton").addEventListener("click", fake);
document.getElementById("startButton").addEventListener("click", start);
document.getElementById("rightBias").addEventListener("click", rightBias);
document.getElementById("leftBias").addEventListener("click", leftBias);

// Hide the instructions when they click done 
document.getElementById("instructionsButton").addEventListener("click", function() {
  document.getElementById("instructionsPopup").style.display = "none";
  
}); 


function start (){ // when the start button is clicked  
  
  gamePaused = false;  // game is not paused  
  requestAnimationFrame(gameLoop)
    spawnLoop()

  document.getElementById("startScreen").style.display = "none";
  resumeTimer(); 
  
  



}


let notebooks = document.querySelectorAll(".notebook"); //  all notebook items
let computers = document.querySelectorAll(".computer"); //  all computer items
let fakes = document.querySelectorAll(".fake"); //  all fake items
let news = document.querySelectorAll(".news"); //  all news items

function spawnItem() {
  if (gamePaused) return; // do nothing if game is paused

  

    const itemTypes = ["notebook", "computer", "fake", "news"]; // possible item types 
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]; // pick random type

    const img = document.createElement("img"); // create new image element
    img.src = type + ".png"; // set img to be the relvent item type  
    img.classList.add("falling", type);  // add CSS classes 

    //spawning position
    img.style.left = Math.random() * (window.innerWidth - 50) + "px";
    img.style.top = "0px";

    document.getElementById("sky").appendChild(img); // add item to the sky container 

    // Add it to the correct array so gameLoop can track it
    if(type === "notebook") notebooks = [...notebooks, img];
    if(type === "computer") computers = [...computers, img];
    if(type === "fake") fakes = [...fakes, img];
    if(type === "news") news = [...news, img];
   
}
// Loop to keep spawning items every second 
function spawnLoop() {
  if (!gamePaused) {
    spawnItem(); // only create item if game is running
  }


  setTimeout(spawnLoop, 1000);  // spawn every 1 second  
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
  
  let mcRect = mc.getBoundingClientRect();  // get MC's position and size
  let itemRect = item.getBoundingClientRect();  // get item's position and size
  return !( // return true if they overlap 
    mcRect.top > itemRect.bottom || // MC is below the object
    mcRect.bottom < itemRect.top || // MC is above the object
    mcRect.left > itemRect.right || // MC is to the right of the object
    mcRect.right < itemRect.left    // MC is to the left of the object
  );
}




function gameLoop() {

  // Loop through all falling items
  [...notebooks, ...computers, ...fakes, ...news].forEach(item => { 
    item.style.top = (parseInt(item.style.top) + 8) + "px";  // move item down by 5px
   
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
    noteList.innerHTML += `<li>${note}</li>`;// add new notes to list
});
    document.getElementById("noteIntro").innerHTML = chosenNote.intro;
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
    document.getElementById("computerPopup").style.display = "block";  /// show computer popup
  }

      // Fake item collision logic  
  if (item.classList.contains("fake")) {
    document.getElementById("fake").style.display = "block"; // show fake popup 
  }

  
   // news  collision logic 
   if (item.classList.contains("news")) { 
    // pick a random News text
    let randomIndex = Math.floor(Math.random() * newsItems.length); // pick a random news item from the newsItems array 
    let chosenNews = newsItems[randomIndex]; // store the chosen news item

    // display the selected news headlines
    document.getElementById("newsInfo").textContent = chosenNews.issue; // add issue text to html element 
    const shuffled = [...chosenNews.headlines].sort(() => Math.random() - 0.5);  // create a shuffled copy of the headlines
    const buttons = document.querySelectorAll("#documentBoxNews .headline-button");   // select all the headline buttons inside the news popup 

    // put each shuffled headline into a button and adds a click event
    buttons.forEach((headlineButton, i) => {
        headlineButton.textContent = shuffled[i]; // set button text
        headlineButton.onclick = () => {
           
            if (shuffled[i] === chosenNews.headlines[chosenNews.correctIndex]) {  // check if the clicked headline is the correct one 
                score++; // increase score if correct
            }
            updateAfterAnswer(); 
        };
    });

   
    document.getElementById("NewsPopup").style.display = "block"; // show news popup
}
}

  });

  if (!gamePaused) requestAnimationFrame(gameLoop); // repeat game loop if not paused

}


// Array of computer messages with their sentiment 
const computerTexts = [
  { 
    text: "The expansion of universal healthcare coverage has been celebrated as a breakthrough for public health. Advocates say it ensures that millions of uninsured citizens can now access essential medical services, reducing preventable deaths and improving overall quality of life.", 
    answer: "left" 
  },
  { 
    text: "Critics argue that universal healthcare expansion will lead to higher taxes and longer wait times for patients. They warn that government-managed systems often result in inefficiency, rationed care, and declining medical innovation.", 
    answer: "right" 
  },
  { 
    text: "New investments in renewable energy are being hailed as a win for both the economy and the environment. By creating jobs in solar, wind, and battery industries, these initiatives reduce reliance on fossil fuels and position the nation as a leader in clean technology.", 
    answer: "left" 
  },
  { 
    text: "Opponents of large-scale renewable energy projects argue that they are expensive and unreliable. They point to rising electricity costs and the need for backup fossil fuel plants to fill in gaps when wind or solar power isn’t available.", 
    answer: "right" 
  },
  { 
    text: "The government’s new student debt relief program is being celebrated by many as a lifeline for young professionals. Advocates argue that easing the burden of crushing loans will allow graduates to pursue careers, start families, and contribute more effectively to the economy.", 
    answer: "left" 
  },
  { 
    text: "Opponents criticize the student debt forgiveness program as unfair to taxpayers who never attended college or already paid off their loans. They argue that the policy rewards irresponsible borrowing while doing nothing to address the rising costs of higher education.", 
    answer: "right" 
  },
  { 
    text: "Advocates of stronger gun control laws argue that universal background checks and restrictions on assault weapons are essential to reduce mass shootings and save lives. They emphasize public safety and the need to prevent dangerous individuals from accessing firearms.", 
    answer: "left" 
  },
  { 
    text: "Gun rights supporters argue that the Second Amendment guarantees the right of citizens to own firearms and defend themselves. They believe new restrictions unfairly punish law-abiding gun owners and do little to stop criminals from obtaining weapons illegally.", 
    answer: "right" 
  }
];


// Array of notebook events and the answer correctness 
const noteText = [
  {
    intro: "Bank robbery",
    notes: [
      "9:00 AM — Bank opens its doors to customers.",
      "Two masked men enter and shout at everyone to lie down.",
      "The robbers demand cash from the tellers.",
      "One customer presses the silent alarm under the counter.",
      "Police cars surround the building minutes later."
    ],
    answer: "right"
  },
  {
    intro: "Train station theft",
    notes: [
      "A thief is caught by police hiding behind a ticket machine.",
      "Commuters notice their bags missing and alert security.",
      "7:10 AM — A train pulls into the busy platform.",
      "A man is seen slipping wallets into his coat pocket.",
      "Security officers review the CCTV cameras."
    ],
    answer: "wrong"
  },
  {
    intro: "Supermarket fire",
    notes: [
      "5:45 PM — Smoke alarm rings inside the supermarket.",
      "Customers leave their shopping carts and rush outside.",
      "Flames spread quickly near the frozen foods section.",
      "Fire trucks arrive and put out the blaze.",
      "No injuries are reported."
    ],
    answer: "right"
  },
  {
    intro: "Car accident on the highway",
    notes: [
      "Paramedics treat the injured drivers on the roadside.",
      "A red sedan collides with a truck near the exit ramp.",
      "8:20 AM — Heavy traffic builds on Highway 12.",
      "Witnesses call emergency services immediately.",
      "Police close off two lanes for investigation."
    ],
    answer: "wrong"
  },
  {
    intro: "Downtown protest",
    notes: [
      "4:00 PM — Crowds gather in the city square holding signs.",
      "Chants grow louder as more people join the demonstration.",
      "Police officers set up barriers along the main street.",
      "A scuffle breaks out between protesters and security staff.",
      "The protest disperses after speeches conclude at sunset."
    ],
    answer: "right"
  },
  {
    intro: "Museum break-in",
    notes: [
      "Security guards find the suspect trying to climb over the fence.",
      "1:30 AM — Alarm triggers at the city museum.",
      "A window on the east side is found shattered.",
      "Police arrive and begin searching the grounds.",
      "Priceless artifacts are discovered missing from their cases."
    ],
    answer: "wrong"
  }
];




// array of news issues and possible headlines 
const newsItems = [
  {
    issue: "Yesterday, the city council narrowly approved a $50 million sports stadium project. Supporters say it will create jobs and attract events; critics warn it could divert funds from parks and social services.",
    headlines: [
      "City Council votes to Approve $50M Stadium",
      " new Stadium Will Revive Local Economy and Bring Jobs",
      "Taxpayers Forced to Fund Stadium While Services Suffer",
      "Controversial Stadium Plan Moves Forward Despite Public Outcry"
    ],
    correctIndex: 0
  },
  {
    issue: "A new AI triage system was introduced at the municipal hospital to speed patient assessments. Hospital administrators say it reduces wait times; some clinicians worry about errors and algorithmic bias.",
    headlines: [
      "City Hospital Introduces AI Triage System, Officials Monitor Performance",
      "Hospital's New AI System Promises Faster, Smarter Patient Care",
      "Patients at Risk: Hospital's AI Triage System Sparks Controversy",
      "Clinicians Alarmed as AI Takes Over Emergency Triage Decisions"
    ],
    correctIndex: 0
  },
  {
    issue: "National rail authorities announced plans to purchase high-speed trains that would cut intercity travel times. Officials say the project modernizes transit; opponents point to the $80 billion price tag.",
    headlines: [
      "new High-Speed Rail Project to aimed to help travel Between Cities",
      "High-Speed Trains to Modernize Infrastructure and Reduce Travel Time",
      "Public Outrage as $30 billion Rail Project Burdens Taxpayers",
      "Government Spends Billions on Luxurious Train Line While Other Needs Wait"
    ],
    correctIndex: 0
  },
  {
    issue: "The education board launched a pilot program offering free laptops and online tutoring for low-income students. Supporters claim it closes the digital divide; critics question ongoing costs and implementation.",
    headlines: [
      "School District Launches Digital Access Program for Low-Income Students",
      "New Tech Initiative Levels Playing Field for Disadvantaged Pupils",
      "Expensive Education Program Adds Ongoing Costs for Taxpayers",
      "Administrators Waste Money on Gadgets Instead of Classrooms"
    ],
    correctIndex: 0
  },
  {
    issue: "A statewide renewable-energy incentive package passed this week, including tax credits for solar and wind projects. Proponents highlight job creation; critics argue subsidies will raise electricity costs.",
    headlines: [
      "State Approves Renewable Energy Incentives with the aim of Boosting Clean Power",
      "Green Jobs Boom Expected After New Renewable Incentives",
      "New Energy Subsidies Will Inflate Bills for Households",
      "Government Forces Costly Green Policies on Consumers"
    ],
    correctIndex: 0
  },
  {
    issue: "The mayor proposed an immigration reform package that expands work permits and legal pathways. Supporters say it strengthens the workforce; critics worry about pressure on public services.",
    headlines: [
      "Mayor Proposes Immigration Reforms to help Expand Legal Work Opportunities",
      "Reform Will Bring Skilled Workers and Boost Local Economies",
      "New Immigration Rules Will Overwhelm Schools and Hospitals",
      "Leaders Prioritize Open Borders Over Public Safety"
    ],
    correctIndex: 0
  },
  {
    issue: "The health department rolled out a student-debt relief pilot for recent graduates entering public-service professions. Proponents call it an investment in public servants; critics call it unfair to those who already paid loans.",
    headlines: [
      "Pilot Student Debt Relief Program Targets Graduates Entering Public Service",
      "Debt Relief Helps Young Professionals Start Careers and Families",
      "Unfair Payouts: Taxpayers Shoulder Burden for New Debt Forgiveness",
      "Government Rewards Irresponsible Borrowers With Loan Bailouts"
    ],
    correctIndex: 0
  },
  {
    issue: "New federal workplace-safety regulations were announced for small manufacturers. Advocates say they protect workers; some small-business groups argue compliance costs will be burdensome.",
    headlines: [
      " New federal Workplace-Safety Rules Aim to Protect Factory Workers",
      "Safer Factories Expected as New Regulations Take Effect",
      " Proposed safety rules are Overbearing and Threaten Small Manufacturers with High Costs",
      "Red Tape Strangles Local Businesses After New Safety Regs"
    ],
    correctIndex: 0
  }
];





function rightBias() {
  if (currentAnswer === "right") {// if the answer is rightBias  
    score++;  // increase score 
  }
  updateAfterAnswer();
}


function fake() {
  score--; // decrease score            
  updateAfterAnswer(); } 

function leftBias() {
  if (currentAnswer === "left") {// if the answer is leftBias
    score++  // increase score 
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
 async function stars(newStars, levelKey="level8") {
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

      // Create new score entry with timestamp
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
    
    var title = document.createElement("h1");
    var message = document.createElement("h2");
    var additionalMessage = document.createElement("p");
    saveScore("level8", score);
    // Set title and message based on the score


//leaderboard
var nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Enter name for leaderboard";
nameInput.style.margin = "3px";
nameInput.id = "leaderboardNameInput";

var submitLeaderboardButton = document.createElement("button");
submitLeaderboardButton.textContent = "Submit Score";
submitLeaderboardButton.style.display = "inline-block";


submitLeaderboardButton.onclick = async function() {
    const name = nameInput.value.trim();
    if (!name) {
        alert("Please enter a name to submit.");
        return;
    }
    try {
        // Save to  leaderboard collection
        await addDoc(collection(db, "level8Leaderboard"), {
          name: name,
          score: score,
        
        }); 

        alert("Score submitted!");
        submitLeaderboardButton.disabled = true; // prevent double submission
    } catch (err) {
        console.error("Failed to submit score:", err);
        alert("Error submitting score.");
    }
};



    if (score < 5) {
     
        title.textContent = "You Failed next star at 5 points";
        message.textContent = "Try again!";
    } else if (score < 7) {
      starImg.src = "star.png";
        title.textContent = "1 Star next star at 7 points";
        message.textContent = "Hmm, you did okay. Move on or retry and see if you can score better.";
        additionalMessage.textContent = " ";
        markLevelComplete("level8"); 
        stars(1,"level8")
    } else if (score < 10) {
      starImg.src = "star.png";
      star2Img.src = "star.png";
        title.textContent = "2 Stars next star at 10 points";
        message.textContent = "Good job! Either try and improve or move on to the next level.";
        additionalMessage.textContent = "";
        markLevelComplete("level8"); 
        stars(2,"level8")
    } else {
      starImg.src = "star.png";
      star2Img.src = "star.png";
      star3Img.src = "star.png";
        title.textContent = "3 Stars";
        message.textContent = "Well done! You were clearly paying attention. Time to move on to the next level.";
        additionalMessage.textContent = "";
        markLevelComplete("level8"); 
        stars(3,"level8")
    }

    // Display the score in the pop-up
    var scoreDisplay = document.createElement("h2");
    scoreDisplay.textContent = "Score: " + score;
// star styling 
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
        window.location.href = "index.html"; // Redirect to home page
    };
    nextLevelButton.style.display = (score >= 5) ? "inline-block" : "none"; // Show only if score is 1 or more

   


    // Append elements to the pop-up
    if (starImg.src) popup.appendChild(starImg);
    if (star2Img.src) popup.appendChild(star2Img);
    if (star3Img.src) popup.appendChild(star3Img); 

    popup.appendChild(title);
    popup.appendChild(scoreDisplay); 

    popup.appendChild(nameInput);
popup.appendChild(submitLeaderboardButton);


    // Append score display
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

