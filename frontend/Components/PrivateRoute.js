import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Route, withRouter } from "react-router";
import Loader from "./Loader";

export default withRouter(
  ({ history, condition, match, component: Component, ...rest }) => {
    const authContext = useAuth();
    const { user } = authContext;
    const [isLoading, setIsLoading] = useState(true);
    const [isConditionValid, setIsConditionValid] = useState(null);
    const [routeProps, setRouteProps] = useState(null);

    function shouldRender() {
      const { isAuthenticated, isNewUser, isAdmin } = authContext;
      if (!isAuthenticated) {
        setIsConditionValid(false);
        return setIsLoading(false);
      }
      console.log(condition);
      switch (condition) {
        case "newUser":
          if (isNewUser) {
            setIsConditionValid(true);
            setIsLoading(false);
          }
          break;
        case "existingUser":
          if (!isNewUser) {
            setIsConditionValid(true);
            setIsLoading(false);
          }
          break;
        case "correctSubscription":
          getRouteProps();
          break;
        case "isAdmin":
          if (isAdmin) {
            setIsConditionValid(true);
            setIsLoading(false);
          }
          break;
      }
    }

    function getRouteProps() {
      const { faculty } = match.params;
      const { semester } = match.params;

      setRouteProps({ faculty, semester });
    }

    function isCorrectSubscription() {
      console.log({
        faculty: routeProps.faculty,
        semester: routeProps.semester,
      });

      return (
        routeProps.faculty === user.faculty &&
        routeProps.semester === user.semester
      );
    }

    useEffect(() => {
      if (routeProps) {
        setIsConditionValid(isCorrectSubscription()); // this is where 'isConditionValid' may contain the boolean 'false'
        setIsLoading(false);
      }
    }, [routeProps]);

    useEffect(() => console.log({ isLoading }), [isLoading]);

    useEffect(() => shouldRender(), []);

    useEffect(() => {
      if (routeProps === null && isConditionValid === false) {
        console.log("runs");
        history.push("/");
        setIsConditionValid(true);
        setIsLoading(false);
      }
    }, [routeProps, isConditionValid]);

    function RenderRouteOrRedirect() {
      if (!isConditionValid) {
        console.log("invalid condition");
        setRouteProps(null);
        return null;
      }

      return <Route {...rest} render={(props) => <Component {...props} />} />;
    }

    return isLoading ? <Loader /> : <RenderRouteOrRedirect />;
  }
);
