import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect, Route } from "react-router";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated, user } = useAuth0();
  console.log(isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/about" />
        )
      }
    />
  );
}
