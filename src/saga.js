import { all } from "redux-saga/effects";
import loginSaga from "./components/Login/saga";
import registerSaga from "./components/Register/saga";
import onAuthChanged from "./authentication/saga";

export default function* rootSagas() {
  yield all([onAuthChanged(), loginSaga(), registerSaga()]);
}
