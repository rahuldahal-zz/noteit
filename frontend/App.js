import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import Home from "./Screens/Home";
import About from "./Screens/About";
import Team from "./Screens/Team";

import "extended-normalize.css";
import "./assets/sass/style.scss";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/team">
            <Team />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
