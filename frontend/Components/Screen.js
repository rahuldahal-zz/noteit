import { useAuth } from "@contexts/AuthProvider";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import Loader from "./Loader";

export default withRouter(({ children, root, history, match }) => {
  const authContext = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authContext.isLoading) {
      setIsLoading(false);
    }
  }, [authContext]);

  // don't execute if the path is /note or /home, otherwise it will switch between Home-Screen infinitely

  if (
    matchMedia("(display-mode: standalone)").matches &&
    !Object.prototype.hasOwnProperty.call(match.params, "faculty") &&
    history.location.pathname !== "/home"
  ) {
    console.log("Launched as a PWA");
    if (!authContext.isAuthenticated) {
      console.log("rendering PWA guest");
      history.push("/pwa");
      return null;
    }
    console.log("Rendering home for PWA");
    history.push("/home");
    return null;
  }

  if (root && authContext.isNewUser) {
    console.log("is new user");
    history.push("/save-faculty-and-semester");
    return null;
  }

  if (root && authContext.isAuthenticated && !authContext.isNewUser) {
    history.push("/home");
    return null;
  }

  return isLoading ? <Loader /> : children;
});
