import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "@contexts/AuthProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "@components/PrivateRoute";
import { createBrowserHistory } from "history";
import Nav from "@components/Nav/Nav";
import Footer from "@components/Footer/Footer";
import Home from "@screens/Home";
import About from "@screens/About";
import Team from "@screens/Team";
import Root from "@screens/Root";
import SaveFacultyAndSemester from "@screens/SaveFacultyAndSemester";
import Admin from "@screens/Admin";

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
          <Root history={history} />
        </Route>
        <PrivateRoute
          exact
          component={Home}
          path="/home"
          condition="isAuthenticated"
        />
        <PrivateRoute
          exact
          component={SaveFacultyAndSemester}
          path="/save-faculty-and-semester"
          condition="newUser"
        />
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/team">
          <Team />
        </Route>
        <PrivateRoute
          exact
          component={Admin}
          path="/only-admin"
          condition="isAdmin"
        />
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
