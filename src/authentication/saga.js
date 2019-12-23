import { eventChannel } from "redux-saga";
import { put, take } from "redux-saga/effects";
import firebase from "../firebase/firebase";
import { actions } from "./reducer";

function* onAuthChanged() {
  const channel = new eventChannel(emiter => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      emiter({ user });
    });
    return unsubscribe;
  });

  while (true) {
    const { user } = yield take(channel);
    if (user) {
      yield put(actions.userChanged(user));
    } else {
      yield put(actions.userRemoved());
    }
  }
}

export default onAuthChanged;
