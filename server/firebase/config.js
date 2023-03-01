const firebase = require("firebase/app");
const {
  createUserWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} = require("firebase/auth");
require("firebase/auth");
require("firebase/firestore");
const dotenv = require('dotenv').config();

//Change all the value with .env file...
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIRE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

console.log("FIREBASE API KEY : ", process.env.FIREBASE_API_KEY)
firebase.initializeApp(firebaseConfig);

const auth = getAuth();

//Create User...
exports.addUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Verify User with Link Sent to Email...
exports.verifyUser = (actionCodeSettings) =>
  sendEmailVerification(auth.currentUser, {
    url: "http://localhost:3000/",
    handleCodeInApp: true,
  }).catch((e) => console.log("Error : ", e));

//SignIn User...
exports.signInUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

