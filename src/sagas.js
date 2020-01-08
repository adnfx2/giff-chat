import { all, take, fork, cancel } from "redux-saga/effects";
import authFlowSaga, {
  sagaActionTypes as sagaAuthActionTypes
} from "./authentication/sagas";
import { actionTypes as authActionTypes } from "./authentication/reducer";
import { publicChannelsListener } from "./components/SidePanel/PublicChannels/sagas";
import { starredChannelsListener } from "./components/SidePanel/StarredChannels/sagas";
import {
  connectedListener,
  usersListener,
  usersPresenceListener
} from "./components/SidePanel/DirectMessages/sagas";

function startListeners(listeners) {
  if (!Array.isArray(listeners)) {
    throw new Error("listeners must be an array");
  }
  return function*() {
    const triggeredListeners = listeners.map(listener => listener());
    yield all(triggeredListeners);
  };
}

function* initializeChat() {
  console.log("initChatListeners");

  while (true) {
    const { user } = yield take(authActionTypes.USER_CHANGED);
    const isUserLogged = user.uid ? true : false;
    console.log({ userChanged: isUserLogged });
    if (isUserLogged) {
      const sagaListeners = yield fork(
        startListeners([
          publicChannelsListener,
          starredChannelsListener,
          connectedListener,
          usersListener,
          usersPresenceListener
        ])
      );
      console.log("wait for a reset app");
      yield take(sagaAuthActionTypes.RESET_APP);
      yield cancel(sagaListeners);
    }
  }
}

export default function* rootSagas() {
  yield all([authFlowSaga(), initializeChat()]);
}
