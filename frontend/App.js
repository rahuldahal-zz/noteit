import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "@contexts/AuthProvider";
import { NoteProvider } from "@contexts/NoteProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "@components/PrivateRoute";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import Nav from "@components/Nav/Nav";
import Footer from "@components/Footer/Footer";
import Home from "@screens/Home";
import About from "@screens/About";
import Team from "@screens/Team";
import Root from "@screens/Root";
import Admin from "@screens/Admin";
import SaveFacultyAndSemester from "@screens/SaveFacultyAndSemester";
import Page404 from "@screens/404";
import PWA from "@screens/PWA";

import "extended-normalize.css";
import "./assets/sass/style.scss";
import Note from "@screens/Note";

const history = createBrowserHistory();

function App() {
  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      ReactGA.initialize("UA-195205173-1");
      ReactGA.pageview(window.location.pathname + window.location.search);
    } else {
      console.log("not registering analytics on development mode");
    }
  }, []);

  return (
    <Router history={history}>
      <NoteProvider>
        <Nav />
      </NoteProvider>
      <Switch>
        <Route exact path="/">
          <Root history={history} />
        </Route>
        <PrivateRoute
          exact
          component={SaveFacultyAndSemester}
          path="/save-faculty-and-semester"
          condition="newUser"
          history={history}
        />
        <Route exact path="/home">
          <NoteProvider>
            <PrivateRoute
              exact
              component={Home}
              path="/home"
              condition="existingUser"
              history={history}
            />
          </NoteProvider>
        </Route>
        <Route exact path="/notes/:faculty/:semester/:subject/:unit">
          <NoteProvider>
            <PrivateRoute
              exact
              component={Note}
              path="/notes/:faculty/:semester/:subject/:unit"
              condition="correctSubscription"
              history={history}
            />
          </NoteProvider>
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/team">
          <Team />
        </Route>
        <Route exact path="/pwa">
          <PWA />
        </Route>
        <PrivateRoute
          exact
          component={Admin}
          path="/only-admin"
          condition="isAdmin"
          history={history}
        />
        <Route path="*" component={Page404} />
      </Switch>
      <Footer />
    </Router>
  );
}

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept();
}
