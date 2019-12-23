import { call, put, takeLatest } from "redux-saga/effects";
import { actions } from "./reducer";
import firebase from "../../firebase/firebase";

const LOGIN_SUBMITTED = "saga-auth/loginSubmitted";

const loginSubmitted = userCredentials => ({
  type: LOGIN_SUBMITTED,
  userCredentials
});

function* login({ userCredentials }) {
  const userEmail = userCredentials.email;
  const userPassword = userCredentials.password;
  const auth = firebase.auth();
  console.log("login called", userCredentials);

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

export default function* loginWatcher() {
  yield takeLatest(LOGIN_SUBMITTED, login);
}

export const sagaActionTypes = {
  LOGIN_SUBMITTED
};

export const sagaActions = {
  loginSubmitted
};
