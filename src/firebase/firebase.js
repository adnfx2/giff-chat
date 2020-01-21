import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const apiKey = process.env.REACT_APP_FIREBASE;

var firebaseConfig = {
  apiKey,
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

const getMessagesType = isPrivate =>
  isPrivate ? "privateMessages" : "messages";

export const firebaseRefs = createFirebaseRefs({
  channels: "channels",
  users: "users",
  presence: "presence",
  connected: ".info/connected",
  messages: "messages",
  privateMessages: "privateMessages"
});

export const getStarredRef = userId =>
  firebaseRefs.users.child(userId).child("starred");

export const getStarredChannelRef = (userId, channelId) =>
  getStarredRef(userId).child(channelId);

export const getUserPresenceRef = userId => firebaseRefs.presence.child(userId);

export const getChannelMessagesRef = (channelId, isPrivate) => {
  const messagesType = getMessagesType(isPrivate);
  return firebaseRefs[messagesType].child(channelId);
};

export const getUniqueMessageRef = (channelId, isPrivate) => {
  const messagesType = getMessagesType(isPrivate);
  return firebaseRefs[messagesType].child(channelId).push();
};

export const storageRef = firebase.storage().ref();

export const getStoragePathRef = path => storageRef.child(path);

export default firebase;
