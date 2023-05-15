const firebase = require("firebase/app");
const admin = require("firebase-admin");

const {
  createUserWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} = require("firebase/auth");
require("firebase/auth");
require("firebase/firestore");
const dotenv = require("dotenv").config();

//Change all the value with .env file...

const serviceAccount = require("../../shoppingsite-e25c4-firebase-adminsdk-6npj3-c0ab41c0ae.json");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = getAuth();

let userAuth;

//Create User...
exports.addUser = (email, password) => {
  const userCreatedd = createUserWithEmailAndPassword(auth, email, password);
  userAuth = auth.currentUser;

  return userCreatedd;
};

//SignIn User...
exports.signInUser = async (email, password) => {
  const signIn = await signInWithEmailAndPassword(auth, email, password);
  userAuth = auth.currentUser;
  // console.log("SIGN IN VAR :", userAuth, auth.currentUser);
  return signIn;
};

// Verify User with Link Sent to Email...
exports.verifyUser = (actionCodeSettings) => {
  // console.log("verifyUser : ", userAuth, auth.currentUser);
  const verification = sendEmailVerification(
    auth.currentUser,
    actionCodeSettings
  ).catch((e) => {
    console.log("Error : ", e);
    console.log("Firebase Config : ", firebaseConfig);
  });
};

exports.curUser = () => {
  return auth.currentUser;
};

exports.sendPasswordResetEmailLink = (email) => {
  // console.log("Sending Reset Link....", email);
  const sendPasswordResetLink = sendPasswordResetEmail(auth, email)
    .then((response) => {
      // console.log("Then : ", response);
    })
    .catch((error) => {
      console.log("Error : ", error);
    });

  // console.log("Send Reset Link : ", sendPasswordResetLink);

  return sendPasswordResetEmail;
};

//Signout User...
exports.signOutUser = () =>
  signOut(auth).catch((Error) => {
    console.log("Error While Signing Out : ", Error);
  });

exports.allUsersFromFirebase = async (nextPageToken) => {
  const allUsers = await admin
    .auth()
    .listUsers()
    .catch((error) => {
      console.log("Error listing users:", error);
    });

  return allUsers;
};
// module.exports = db;
