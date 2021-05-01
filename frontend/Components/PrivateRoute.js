import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Route, withRouter } from "react-router";

export default withRouter(
  ({ history, condition, component: Component, ...rest }) => {
    const authContext = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    function handleRouting() {
      const { isAuthenticated, isNewUser, isAdmin } = authContext;
      if (!isAuthenticated) {
        return history.push("/");
      }
      console.log(condition);
      switch (condition) {
        case "newUser":
          if (isNewUser) {
            return setIsLoading(false);
          }
          break;
        case "existingUser":
          if (!isNewUser) {
            return setIsLoading(false);
          }
          break;
        case "isAdmin":
          if (isAdmin) {
            return setIsLoading(false);
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

    return isLoading ? (
      <h3>Loading private route</h3>
    ) : (
      <Route {...rest} render={(props) => <Component {...props} />} />
    );
  }
);
