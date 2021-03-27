import { useAuth } from "@contexts/AuthProvider";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";

export default withRouter(({ children, root, history }) => {
  const authContext = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authContext.isLoading) {
      setIsLoading(false);
    }
  }, [authContext]);

  if (root && authContext.isNewUser) {
    console.log("is new user");
    history.push("/save-faculty-and-semester");
    return null;
  }

  if (root && authContext.isAuthenticated && !authContext.isNewUser) {
    history.push("/home");
    return null;
  }

  console.log("rendering children");

  return isLoading ? <h1>Loading...</h1> : children;
});
