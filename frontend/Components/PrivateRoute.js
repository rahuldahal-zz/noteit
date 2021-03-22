import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Redirect, Route } from "react-router";

export default function PrivateRoute({
  condition,
  component: Component,
  ...rest
}) {
  const { isNewUser, isAuthenticated, isAdmin } = useAuth();
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
      case "existingUser":
        !isNewUser && setComponentToRender(routerJSX);
        break;
      case "isAdmin":
        console.log({ isAdmin });
        isAdmin && setComponentToRender(routerJSX);
        break;
    }
  }, [condition]);

  return !isAuthenticated ? <Redirect to="/" /> : componentToRender;
}
