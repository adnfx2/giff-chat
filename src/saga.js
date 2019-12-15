import { all } from "redux-saga/effects";
import loginSaga from "./components/Login/saga";

export default function* rootSagas() {
  yield all([loginSaga()]);
}
