import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Redirect, Route } from "react-router";

export default function PrivateRoute({
  newUser,
  component: Component,
  ...rest
}) {
  const { isNewUser, isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
