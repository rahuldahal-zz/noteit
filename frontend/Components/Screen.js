import { useAuth } from "@contexts/AuthProvider";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

export default withRouter(({ children, root, history, match }) => {
  const authContext = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authContext.isLoading) {
      setIsLoading(false);
    }
  }, [authContext]);

  if (
    matchMedia("(display-mode: standalone)").matches &&
    !Object.prototype.hasOwnProperty.call(match.params, "faculty")
  ) {
    console.log("Launched as a PWA");
    history.push("/pwa");
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

  return isLoading ? <h1>Loading...</h1> : children;
});
