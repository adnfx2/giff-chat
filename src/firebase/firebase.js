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

const createFirebaseRefs = references => {
  if (typeof references !== "object") {
    throw new Error("references must be an object");
  }
  const referencesKeys = Object.keys(references);
  const referencesReduced = referencesKeys.reduce((acc, referenceKey) => {
    return {
      ...acc,
      [referenceKey]: firebase.database().ref(references[referenceKey])
    };
  }, {});
  return referencesReduced;
};

export const firebaseRefs = createFirebaseRefs({
  channels: "channels",
  users: "users",
  presence: "presence",
  connected: ".info/connected"
});

export const getStarredsRef = userId =>
  firebaseRefs.users.child(userId).child("starred");

export const getUserPresenceRef = userId => firebaseRefs.presence.child(userId);

export default firebase;
