import React, { useEffect, useState } from "react";
import Hero from "@components/Guest/Hero";
import Info from "@components/Guest/Info";
import Process from "@components/Guest/Process";
import { withRouter } from "react-router-dom";
import { useAuth } from "@contexts/AuthProvider";
import { LoginOptions } from "@components/Guest/LoginOptions";

export default withRouter(({ history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const { token, isAuthenticated, isNewUser, isAdmin } = useAuth();

  useEffect(() => {
    setIsLoading(false);
    // console.log({ userData });
  }, []);

  if (isAdmin) {
    history.push("/only-admin");
    return null;
  }

  if (isAuthenticated && !isNewUser) {
    history.push("/home");
    return null;
  }

  return (
    <main className="guestScreen maximumWidth">
      <Hero setShowLoginOptions={setShowLoginOptions} />
      <Info />
      <Process />
      {showLoginOptions ? (
        <LoginOptions
          showOptions={true}
          setShowLoginOptions={setShowLoginOptions}
        />
      ) : (
        <LoginOptions />
      )}
    </main>
  );
});
