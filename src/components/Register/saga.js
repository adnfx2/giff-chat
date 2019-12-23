import { call, put, takeLatest } from "redux-saga/effects";
import { actions } from "./reducer";
import firebase, { firebaseRefs } from "../../firebase/firebase";
import md5 from "md5";

const REGISTER_SUBMITTED = "saga-auth/registerSubmitted";

const registerSubmitted = userValues => ({
  type: REGISTER_SUBMITTED,
  userValues
});

const getPhotoURL = uniqueName =>
  `http://gravatar.com/avatar/${md5(uniqueName)}?d=identicon`;

function* register({ userValues }) {
  const auth = firebase.auth();
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

export default function* registerWatcher() {
  yield takeLatest(REGISTER_SUBMITTED, register);
}

export const sagaActionTypes = {
  REGISTER_SUBMITTED
};

export const sagaActions = {
  registerSubmitted
};
