import React from "react";
import ReactDOM from "react-dom";
import App from "./layout/App/App";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";

const Root = () => (
  <Router>
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
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
