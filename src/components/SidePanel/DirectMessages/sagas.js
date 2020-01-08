import { eventChannel } from "redux-saga";
import {
  call,
  cancel,
  cancelled,
  fork,
  select,
  put,
  take
} from "redux-saga/effects";
import { firebaseRefs, getUserPresenceRef } from "../../../firebase/firebase";
import { actions } from "./reducer";

function* onlineConnectionSaga() {
  console.log("onlineConnectionSaga/init == STARTED");
  const currentUserId = yield select(({ auth }) => auth.user.userProfile.uid);
  const userPresenceRef = getUserPresenceRef(currentUserId);

  const channel = eventChannel(emiter => {
    userPresenceRef.onDisconnect().remove(error => {
      emiter({ onDisconnectError: error });
    });
    return () => {
      userPresenceRef.off();
      console.log("onlineConnectionSaga/userPresenceRef == OFF");
    };
  });

  // set online presence on firabaseDB
  yield call([userPresenceRef, userPresenceRef.set], true);

  // onDisconnected set offline presence in firabaseDB
  try {
    while (true) {
      const { onDisconnectError } = yield take(channel);
      if (onDisconnectError !== null) {
        console.error({ onDisconnectError });
      }
    }
  } catch (error) {
    console.error({ onlineConnectionSagaError: error });
  } finally {
    if (yield cancelled()) {
      channel.close();
      console.log("onlineConnectionSaga/channel == CLOSED");
    }
  }
}

export function* connectedListener() {
  console.log("connectedListener/init == STARTED");
  const channel = eventChannel(emiter => {
    firebaseRefs.connected.on("value", snapshot => {
      const isUserConnected = snapshot.val() ? true : false;
      emiter({ isUserConnected });
    });
    return () => {
      firebaseRefs.connected.off();
      console.log("connectedListener/firebaseRefs.connected == OFF");
    };
  });

  try {
    let connectionSaga;
    while (true) {
      const { isUserConnected } = yield take(channel);

      if (isUserConnected) {
        connectionSaga && cancel(connectionSaga);
        connectionSaga = yield fork(onlineConnectionSaga);
      }
    }
  } catch (error) {
    console.error({ connectedListenerError: error });
  } finally {
    if (yield cancelled()) {
      channel.close();
      console.log("connectedListener/channel == CLOSED");
    }
  }
}

export function* usersListener() {
  console.log("usersListener/init == STARTED");
  const currentUserId = yield select(({ auth }) => auth.user.userProfile.uid);
  const channel = new eventChannel(emiter => {
    firebaseRefs.users.on("child_added", snapshot => {
      if (currentUserId !== snapshot.key) {
        const user = snapshot.val();
        const userId = snapshot.key;
        const finalUser = {
          ...user,
          uid: userId
        };
        emiter({ user: finalUser });
      }
    });

    return () => {
      firebaseRefs.users.off();
      console.log("usersListener/firebaseRefs.users == OFF");
    };
  });

  try {
    while (true) {
      const { user } = yield take(channel);
      if (user) {
        yield put(actions.userAdded(user));
      }
    }
  } catch (error) {
    console.error({ usersListenerError: error });
  } finally {
    if (yield cancelled()) {
      channel.close();
      yield put(actions.usersReset());
      console.log("usersListener/channel == CLOSED");
    }
  }
}

export function* usersPresenceListener() {
  console.log("usersPresenceListener/init == STARTED");
  const currentUserId = yield select(({ auth }) => auth.user.userProfile.uid);
  const channel = new eventChannel(emiter => {
    firebaseRefs.presence.on("child_added", snapshot => {
      const userId = snapshot.key;
      if (currentUserId !== userId) {
        emiter({ userId, isConnected: true });
      }
    });

    firebaseRefs.presence.on("child_removed", snapshot => {
      const userId = snapshot.key;
      if (currentUserId !== userId) {
        emiter({ userId, isConnected: false });
      }
    });

    return () => {
      firebaseRefs.presence.off();
      console.log("usersPresenceListener/firebaseRefs.presence == OFF");
    };
  });

  try {
    while (true) {
      const { userId, isConnected } = yield take(channel);
      if (userId) {
        yield put(actions.userPresenceUpdated(userId, isConnected));
      }
    }
  } catch (error) {
    console.error({ usersPresenceListenerError: error });
  } finally {
    if (yield cancelled()) {
      channel.close();
      console.log("usersPresenceListener/channel == CLOSED");
    }
  }
}
