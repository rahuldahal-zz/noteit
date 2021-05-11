import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Route, useParams, withRouter } from "react-router";

export default withRouter(
  ({ history, condition, component: Component, ...rest }) => {
    const { faculty, semester } = useParams();
    const authContext = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isConditionValid, setIsConditionValid] = useState(false);

    function shouldRender() {
      const { isAuthenticated, isNewUser, isAdmin, user } = authContext;
      // if (!isAuthenticated) {
      //   return history.push("/");
      // }
      console.log(condition);
      switch (condition) {
        case "newUser":
          if (isNewUser) {
            setIsConditionValid(true);
          }
          break;
        case "existingUser":
          if (!isNewUser) {
            setIsConditionValid(true);
          }
          break;
        case "isAdmin":
          if (isAdmin) {
            setIsConditionValid(true);
          }
          break;
      }
      setIsLoading(false);
    }

    useEffect(() => shouldRender(), []);

    function RenderRouteOrRedirect() {
      if (!isConditionValid) {
        history.push("/");
        return null;
      }

      return <Route {...rest} render={(props) => <Component {...props} />} />;
    }

    return isLoading ? (
      <h3>Loading private route</h3>
    ) : (
      <RenderRouteOrRedirect />
    );
  }
);
