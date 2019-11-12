import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./layout/App/App";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import { createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";
import { setUser, clearUser } from "./actions";
import firebase from "./firebase/firebase";
import Spinner from "./components/Spinner/Spinner";

const useAuthRedirect = (path = "/") => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
        history.push(path);
      } else {
        dispatch(clearUser());
        history.push("/Login");
      }
    });
  }, []); //eslint-disable-line
};

const store = createStore(rootReducer, composeWithDevTools());
const Root = () => {
  const isLoading = useSelector(({ userData }) => userData.isLoading);

  useAuthRedirect();

  if (isLoading) {
    return <Spinner />;
  } else {
    return (
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
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
