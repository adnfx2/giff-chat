import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
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
import { Provider, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";
import rootSaga from "./sagas";
import Spinner from "./components/Spinner";

const useAuthRedirect = (userId, path = { logged: "/", logout: "login" }) => {
  const history = useHistory();

  useEffect(() => {
    if (userId) {
      history.push(path.logged);
    } else {
      history.push(path.logout);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
};

const sagaMiddleware = createSagaMiddleware();

const enhancers =
  process.env.NODE_ENV === "production"
    ? applyMiddleware(sagaMiddleware)
    : composeWithDevTools(applyMiddleware(sagaMiddleware));

const store = createStore(rootReducer, enhancers);

sagaMiddleware.run(rootSaga);

const Root = () => {
  const isLoadingApp = useSelector(({ auth }) => auth.user.isLoading);
  const currentUser = useSelector(({ auth }) => auth.user.userProfile);
  const isUserLogged = currentUser && currentUser.uid;
  useAuthRedirect(isUserLogged);

  if (isLoadingApp) {
    return <Spinner />;
  }

  if (isUserLogged) {
    return (
      <Switch>
        <Route exact path="/">
          <App currentUser={currentUser} />
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
