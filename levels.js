// Import Firebase modules 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
  import {
    getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut, sendPasswordResetEmail
    } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

   
  import { getFirestore, doc, getDoc
    } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
     
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

// get input and button elements
const userEmail = document.getElementById("userEmail"); // email input
const userPassword = document.getElementById("userPassword"); // password input
const authForm = document.getElementById("authForm"); // login/signup form
const Levels = document.getElementById("Levels"); // levels container
const signUpButton = document.getElementById("signUpButton"); // sign up button
const signInButton = document.getElementById("signInButton"); // sign in button
const signOutButton = document.getElementById("signOutButton"); // sign out button


// level links
const anchorTwo = document.querySelector("#two a"); 
const anchorThree = document.querySelector("#three a");
const anchorFour = document.querySelector("#four a");
const anchorFive = document.querySelector("#five a");
const anchorSix = document.querySelector("#six a");
const anchorSeven = document.querySelector("#seven a");
const anchorEight = document.querySelector("#eight a");

// level star images
const level4Star1 = document.getElementById("level4Star1"); 
const level4Star2 = document.getElementById("level4Star2");
const level4Star3 = document.getElementById("level4Star3");

const level6Star1 = document.getElementById("level6Star1");
const level6Star2 = document.getElementById("level6Star2");
const level6Star3 = document.getElementById("level6Star3");

const level8Star1 = document.getElementById("level8Star1");
const level8Star2 = document.getElementById("level8Star2");
const level8Star3 = document.getElementById("level8Star3");

Levels.style.display = 'none'; // hide levels initially

// Sign up 
const userSignUp = async () => {
  const signUpEmail = userEmail.value; // get input email value
  const signUpPassword = userPassword.value; // get input password value
  try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword); // create account
      alert("Your account has been created!"); // notify user
  } catch(e){
      alert(e.message); // show error
  }
}

// sign in 
const userSignIn = async () => {
  const signInEmail = userEmail.value; // get input email value
  const signInPassword = userPassword.value; // get input password value
  try {
     await signInWithEmailAndPassword(auth, signInEmail, signInPassword); // sign in
  } catch (error) {
    alert("wrong email or Password"); // error message
  }
}

// check auth state and update UI
function checkAuthState() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      authForm.style.visibility = 'hidden'; // hide form
      Levels.style.display = 'block'; // show levels
      // load the level stars for signed-in user
      await loadLevel4Stars(user.uid); 
      await loadLevel6Stars(user.uid);
      await loadLevel8Stars(user.uid);
    } else {
      authForm.style.visibility = 'visible'; // show form
      Levels.style.display = 'none'; // hide levels
      // reset stars UI
      setLevel4StarsUI(0);
      setLevel6StarsUI(0);
      setLevel8StarsUI(0);
    }
  });
}




// level 2 click
anchorTwo.addEventListener("click", async (event) => {
  event.preventDefault(); // stops auto navigation
  const user = auth.currentUser; // get signed-in user

  try {
    const userRef = doc(db, "users", user.uid); // reference to user doc 
    const userSnap = await getDoc(userRef); // get user document 
    const data = userSnap.data(); // extract data

    if (data.levels && data.levels.level1 === true) { // check if level1 completed
      window.location.href = anchorTwo.href; // go to level
    } 
  } catch (error) {
    console.error("Error checking level1 status:", error); // log error
    alert("complete level 1 to start"); // alert user
  }
});

// level 3 click
anchorThree.addEventListener("click", async (event) => {
  event.preventDefault(); // stops auto navigation
  const user = auth.currentUser;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (data.levels && data.levels.level2 === true) { // check if level 2 completed 
      window.location.href = anchorThree.href; // go to level
    } else {
      alert("complete level 2 to unlock level"); 
    }
  } catch (error) {
    console.error("Error checking level2 status:", error);
    alert("complete level 1 to start");
  }
});

// level 4 click
anchorFour.addEventListener("click", async (event) => {
  event.preventDefault();
  const user = auth.currentUser;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (data.levels && data.levels.level3 === true) {  // check if level 3 completed 
      window.location.href = anchorFour.href;
    } else {
      alert("complete level 3 to unlock level");
    }
  } catch (error) {
    console.error("Error checking level3 status:", error);
    alert("complete level 1 to start");
  }
});

// level 5 click
anchorFive.addEventListener("click", async (event) => {
  event.preventDefault();
  const user = auth.currentUser;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (data.levels && data.levels.level4 === true) { // check if level 4 completed 
      window.location.href = anchorFive.href;
    } else {
      alert("complete level 4 to unlock level");
    }
  } catch (error) {
    console.error("Error checking level4 status:", error);
    alert("complete level 1 to start");
  }
});

// level 6 click
anchorSix.addEventListener("click", async (event) => {
  event.preventDefault();
  const user = auth.currentUser;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (data.levels && data.levels.level5 === true) { // check if level 5 completed 
      window.location.href = anchorSix.href;
    } else {
      alert("complete level 5 to unlock level");
    }
  } catch (error) {
    console.error("Error checking level5 status:", error);
    alert("complete level 1 to start");
  }
});

// level 7 click
anchorSeven.addEventListener("click", async (event) => {
  event.preventDefault();
  const user = auth.currentUser;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (data.levels && data.levels.level6 === true) { // check if level 6 completed 
      window.location.href = anchorSeven.href;
    } else {
      alert("complete level 6 to unlock level");
    }
  } catch (error) {
    console.error("Error checking level6 status:", error);
    alert("complete level 1 to start");
  }
});

// level 8 click
anchorEight.addEventListener("click", async (event) => { // check if level 7 completed 
  event.preventDefault();
  const user = auth.currentUser;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (data.levels && data.levels.level7 === true) {
      window.location.href = anchorEight.href;
    } else {
      alert("complete level 7 to unlock level");
    }
  } catch (error) {
    console.error("Error checking level7 status:", error);
    alert("complete level 1 to start");
  }
});

// set stars for level 4
function setLevel4StarsUI(starsCount) {
  const s = Number(starsCount) || 0; // ensure number
  const imgs = [level4Star1, level4Star2, level4Star3].filter(Boolean); //  put the star image elements into an array and remove any that are null 
  imgs.forEach((img, idx) => { // for each img
    if (idx < s) { // fill stars that are earned 
      img.style.opacity = "1"; 
      img.style.filter = "grayscale(0)";
    } else {
      img.style.opacity = "0.25"; 
      img.style.filter = "grayscale(1)";
    }
  });
}

// load stars for level 4
async function loadLevel4Stars(uid) {
  try {
    const userRef = doc(db, "users", uid);  // reference to user doc
    const snap = await getDoc(userRef); // get user document 
    const data = snap.exists() ? snap.data() : {}; // get the data, otherwise empty

    const rawStars = (data.stars && (data.stars.level4 !== undefined)) ? data.stars.level4 : 0; // get the stored stars for level4 
    const starsNumber = Number(rawStars) || 0; // ensure number

    setLevel4StarsUI(starsNumber); // update UI
  } catch (err) { // log error
    console.error("loadLevel4Stars error:", err);
  }
}

// set stars for level 6
function setLevel6StarsUI(starsCount) {
  const s = Number(starsCount) || 0;
  const imgs = [level6Star1, level6Star2, level6Star3].filter(Boolean);
  imgs.forEach((img, idx) => {
    if (idx < s) {
      img.style.opacity = "1";
      img.style.filter = "grayscale(0)";
    } else {
      img.style.opacity = "0.25";
      img.style.filter = "grayscale(1)";
    }
  });
}

// load stars for level 6
async function loadLevel6Stars(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : {};

    const rawStars = (data.stars && (data.stars.level6 !== undefined)) ? data.stars.level6 : 0;
    const starsNumber = Number(rawStars) || 0;

    setLevel6StarsUI(starsNumber);
  } catch (err) {
    console.error("loadLevel6Stars error:", err);
  }
}

// set stars for level 8
function setLevel8StarsUI(starsCount) {
  const s = Number(starsCount) || 0;
  const imgs = [level8Star1, level8Star2, level8Star3].filter(Boolean);
  imgs.forEach((img, idx) => {
    if (idx < s) {
      img.style.opacity = "1";
      img.style.filter = "grayscale(0)";
    } else {
      img.style.opacity = "0.25";
      img.style.filter = "grayscale(1)";
    }
  });
}

// load stars for level 8
async function loadLevel8Stars(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : {};

    const rawStars = (data.stars && (data.stars.level8 !== undefined)) ? data.stars.level8 : 0;
    const starsNumber = Number(rawStars) || 0;

    setLevel8StarsUI(starsNumber);
  } catch (err) {
    console.error("loadLevel8Stars error:", err);
  }
}

// password reset
resetPasswordButton.addEventListener('click', async () => {
  const email = document.getElementById('userEmail').value; // get input
  if (!email) {
    alert("Enter email");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email); // send reset email
    alert("Reset email sent");
  } catch (e) {
    alert(e.message);
    console.error("Password reset error:", e);
  }
});

// user sign out
const userSignOut = async() => {
  await signOut(auth); // sign out user
}

// check auth state on page load
checkAuthState();

// add event listeners
signUpButton.addEventListener('click', userSignUp); // sign up
signInButton.addEventListener('click', userSignIn); // sign in
signOutButton.addEventListener('click', userSignOut); // sign out
