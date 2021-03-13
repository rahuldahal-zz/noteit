import React from "react";
import { useToken } from "../contexts/TokenProvider";
import { Redirect, Route } from "react-router";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { token } = useToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
