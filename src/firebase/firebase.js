import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyD7obLsS3VLc86eEUQyd_fxKtcmzUrLh58",
  authDomain: "react-chat-222a7.firebaseapp.com",
  databaseURL: "https://react-chat-222a7.firebaseio.com",
  projectId: "react-chat-222a7",
  storageBucket: "react-chat-222a7.appspot.com",
  messagingSenderId: "190248205156",
  appId: "1:190248205156:web:685336a2166037df16d871",
  measurementId: "G-ZTXCRYPR4Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
