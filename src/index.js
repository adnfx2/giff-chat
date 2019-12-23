import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./layout/App/App";
import Register from "./components/Register";
import Login from "./components/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import { createStore, applyMiddleware } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";
import rootSaga from "./saga";
import Spinner from "./components/Spinner/Spinner";
import firebase from "./firebase/firebase";

const useAuthRedirect = (userId, path = { logged: "/", logout: "login" }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) {
      history.push(path.logged);
    } else {
      history.push(path.logout);
    }
  }, [userId]); //eslint-disable-line
};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const Root = () => {
  const isLoadingApp = useSelector(({ auth }) => auth.user.isLoading);
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const isUserLogged = currentUser && currentUser.uid;
  console.log({ isUserLogged });
  const history = useHistory();
  const dispatch = useDispatch();

  useAuthRedirect(isUserLogged);
  if (isLoadingApp) {
    return <Spinner />;
  }
  if (isUserLogged) {
    return (
      <Switch>
        <Route exact path="/">
          <button
            onClick={() => {
              firebase
                .auth()
                .signOut()
                .then(() => console.log("user removed"));
            }}
          >
            logout
          </button>
          <button onClick={() => history.push("/Login")}>Login</button>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
};

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>,
  document.getElementById("root")
);
