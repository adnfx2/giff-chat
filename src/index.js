import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./layout/App/App";
import Register from "./components/Register";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import { createStore, applyMiddleware } from "redux";
import { Provider, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";
import rootSaga from "./saga";
import Spinner from "./components/Spinner/Spinner";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const Root = () => {
  const isLoadingApp = useSelector(({ auth }) => auth.user.isLoading);
  if (isLoadingApp) {
    return <Spinner />;
  }
  return <Login />;
};

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>,
  document.getElementById("root")
);
