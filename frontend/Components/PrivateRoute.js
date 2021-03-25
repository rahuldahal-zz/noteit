import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Route, withRouter } from "react-router";

export default withRouter(
  ({ history, condition, component: Component, ...rest }) => {
    const authContext = useAuth();
    const [componentToRender, setComponentToRender] = useState(null);
    const routerJSX = (
      <Route {...rest} render={(props) => <Component {...props} />} />
    );

    function handleRouting() {
      const { isAuthenticated, isNewUser, isAdmin } = authContext;
      if (!isAuthenticated) {
        history.push("/");
      }
      console.log(condition);
      switch (condition) {
        case "newUser":
          if (isNewUser) {
            return setComponentToRender(routerJSX);
          }
          break;
        case "existingUser":
          if (!isNewUser) {
            return setComponentToRender(routerJSX);
          }
          break;
        case "isAdmin":
          if (isAdmin) {
            return setComponentToRender(routerJSX);
          }
          break;
      }
      return history.push("/");
    }

    useEffect(() => {
      if (!authContext.isLoading) {
        handleRouting();
      }
    }, [authContext]);

    return componentToRender;
  }
);
