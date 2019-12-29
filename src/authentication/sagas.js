import { eventChannel } from "redux-saga";
import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import firebase, { firebaseRefs } from "../firebase/firebase";
import md5 from "md5";
import { actions } from "./reducer";

const auth = firebase.auth();

// RegisterSaga

const REGISTER_SUBMITTED = "saga-auth/registerSubmitted";

const registerSubmitted = userValues => ({
  type: REGISTER_SUBMITTED,
  userValues
});

function* register({ userValues }) {
  const getPhotoURL = uniqueName =>
    `http://gravatar.com/avatar/${md5(uniqueName)}?d=identicon`;

  try {
    yield put(actions.registerRequested());
    console.log("requested");
    const createdUser = yield call(
      [auth, auth.createUserWithEmailAndPassword],
      userValues.email,
      userValues.password
    );

    if (!createdUser) throw new Error("User was not created");

    const user = createdUser.user;
    const userProfile = {
      displayName: userValues.username,
      photoURL: getPhotoURL(user.email)
    };
    yield call([user, user.updateProfile], userProfile);

    const usersRef = firebaseRefs.users.child(createdUser.user.uid);
    const saveInFirebaseDB = usersRef.set;
    const userMetadata = {
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    };
    yield call([usersRef, saveInFirebaseDB], userMetadata);
    yield put(actions.registerSucceded());
  } catch (error) {
    yield put(actions.registerFailed(error.message || error));
  }
}

function* registerWatcher() {
  yield takeLatest(REGISTER_SUBMITTED, register);
}

// LoginSaga

const LOGIN_SUBMITTED = "saga-auth/loginSubmitted";

const loginSubmitted = userCredentials => ({
  type: LOGIN_SUBMITTED,
  userCredentials
});

function* login({ userCredentials }) {
  const userEmail = userCredentials.email;
  const userPassword = userCredentials.password;

  try {
    yield put(actions.loginRequested());
    const user = yield call(
      [auth, auth.signInWithEmailAndPassword],
      userEmail,
      userPassword
    );
    if (user) {
      yield put(actions.loginSucceded(user.user));
    } else {
      console.log("no user obtained");
    }
  } catch (error) {
    console.log(error);
    yield put(actions.loginFailed(error.message));
  }
}

function* loginWatcher() {
  yield takeLatest(LOGIN_SUBMITTED, login);
}

// LogoutSaga

const LOGOUT_REQUESTED = "saga-auth/logoutRequested";
const RESET_APP = "saga-auth/RESET_APP";

const logoutRequested = userCredentials => ({
  type: LOGOUT_REQUESTED
});

const resetApp = () => ({
  type: RESET_APP
});

function* logout() {
  try {
    yield call([auth, auth.signOut]);
    console.log("user logout succeded");
    yield put(resetApp());
  } catch (error) {
    console.error("user failed to logout");
  }
}

function* logoutWatcher() {
  yield takeLatest(LOGOUT_REQUESTED, logout);
}

// UserChanged

function* userChangedListener() {
  const channel = new eventChannel(emiter => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      emiter({ user });
    });
    return unsubscribe;
  });

  while (true) {
    const { user } = yield take(channel);
    console.log({ onAuthChanged: user });
    if (user) {
      yield put(actions.userChanged(user));
    } else {
      yield put(actions.userRemoved());
    }
  }
}

// naive authentication flow

export default function* authFlowSaga() {
  try {
    yield fork(userChangedListener);
    yield all([registerWatcher(), loginWatcher(), logoutWatcher()]);
  } catch (error) {
    console.error({ authFlowSaga: error });
  }
}

export const sagaActionTypes = {
  REGISTER_SUBMITTED,
  LOGIN_SUBMITTED,
  LOGOUT_REQUESTED,
  RESET_APP
};

export const sagaActions = {
  registerSubmitted,
  loginSubmitted,
  logoutRequested,
  resetApp
};
