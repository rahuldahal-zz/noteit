import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "@components/PrivateRoute";
import { createBrowserHistory } from "history";
import Nav from "@components/Nav/Nav";
import Footer from "@components/Footer/Footer";
import Home from "./Screens/Home";
import About from "./Screens/About";
import Team from "./Screens/Team";
import Guest from "./Screens/Guest";

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
        <PrivateRoute exact component={Home} path="/home"></PrivateRoute>
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
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept();
}
