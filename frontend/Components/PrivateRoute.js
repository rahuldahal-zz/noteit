import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Redirect, Route } from "react-router";

export default function PrivateRoute({
  condition,
  component: Component,
  ...rest
}) {
  const { isNewUser, isAuthenticated } = useAuth();
  const [componentToRender, setComponentToRender] = useState(null);

  const routerJSX = (
    <Route {...rest} render={(props) => <Component {...props} />} />
  );

  useEffect(() => {
    console.log(condition);
    switch (condition) {
      case "newUser":
        isNewUser && setComponentToRender(routerJSX);
        break;
    }
  }, []);

  return !isAuthenticated ? <Redirect to="/" /> : componentToRender;
}
