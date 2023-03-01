const firebase = require("firebase/app");
const {
  createUserWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
  sendEmailVerification,
} = require("firebase/auth");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBg3ipoFFoeNxjHlUCrnv-d5PvBKTp8GW4",
  authDomain: "shoppingsite-e25c4.firebaseapp.com",
  projectId: "shoppingsite-e25c4",
  storageBucket: "shoppingsite-e25c4.appspot.com",
  messagingSenderId: "732026773703",
  appId: "1:732026773703:web:76cf677cdb031afed29ee2",
  measurementId: "G-57LD1F6T9V",
};

firebase.initializeApp(firebaseConfig);

const auth = getAuth();

exports.addUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

exports.verifyUser = (actionCodeSettings) =>
  sendEmailVerification(auth.currentUser, {
    url: 'http://localhost:3000/',
    handleCodeInApp: true
  })
    .then((data) => console.log(data))
    .catch((e) => console.log("Error : ", e));
