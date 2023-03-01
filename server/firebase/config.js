const firebase = require("firebase/app");
const {
  createUserWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
require("firebase/auth");
require("firebase/firestore");
const dotenv = require('dotenv').config();

//Change all the value with .env file...
const firebaseConfig = {
  apiKey: "AIzaSyBg3ipoFFoeNxjHlUCrnv-d5PvBKTp8GW4",
  authDomain: "shoppingsite-e25c4.firebaseapp.com",
  projectId: "shoppingsite-e25c4",
  storageBucket: "shoppingsite-e25c4.appspot.com",
  messagingSenderId: "732026773703",
  appId: "1:732026773703:web:76cf677cdb031afed29ee2",
  measurementId: "G-57LD1F6T9V",
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

