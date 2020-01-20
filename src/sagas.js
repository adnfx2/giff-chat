import { all, take, fork, cancel } from "redux-saga/effects";
import authFlowSaga, {
  sagaActionTypes as sagaAuthActionTypes
} from "./authentication/sagas";
import { actionTypes as authActionTypes } from "./authentication/reducer";
import { sidePanelListeners } from "./components/SidePanel/sagas";
import messagesSaga from "./components/Messages/sagas";

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
  while (true) {
    const { user } = yield take(authActionTypes.USER_CHANGED);
    const isUserLogged = user.uid ? true : false;
    if (isUserLogged) {
      const sagaListeners = yield fork(startListeners([...sidePanelListeners]));
      yield take(sagaAuthActionTypes.RESET_APP);
      yield cancel(sagaListeners);
    }
  }
}

export default function* rootSagas() {
  yield all([authFlowSaga(), initializeChat(), messagesSaga()]);
}
