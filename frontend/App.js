import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "@components/PrivateRoute";
import { createBrowserHistory } from "history";
import Nav from "@components/Nav/Nav";
import Footer from "@components/Footer/Footer";
import Home from "@screens/Home";
import About from "@screens/About";
import Team from "@screens/Team";
import Guest from "@screens/Guest";
import SaveFacultyAndSemester from "@screens/SaveFacultyAndSemester";

import "extended-normalize.css";
import "./assets/sass/style.scss";

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Guest history={history} />
        </Route>
        <PrivateRoute exact component={Home} path="/home" />
        <Route
          exact
          component={SaveFacultyAndSemester}
          path="/save-faculty-and-semester"
        />
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/team">
          <Team />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

ReactDOM.render(
  <AuthProvider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
  >
    <App />
  </AuthProvider>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept();
}
