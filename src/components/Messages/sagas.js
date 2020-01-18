import { all } from "redux-saga/effects";
import messagesHeaderSagas from "./MessagesHeader/sagas";
import messagesFormSagas from "./MessagesForm/sagas";

function* messagesSaga() {
  yield all([messagesHeaderSagas(), messagesFormSagas()]);
}

export default messagesSaga;
