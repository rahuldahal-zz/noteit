import React, { useContext, useEffect, useState } from "react";
import Hero from "@components/Guest/Hero";
import Info from "@components/Guest/Info";
import Process from "@components/Guest/Process";
import { withRouter } from "react-router-dom";
import { useToken } from "../contexts/TokenProvider";
import { LoginOptions } from "@components/Guest/LoginOptions";

export default withRouter(function Guest({ history }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const { token } = useToken();

  useEffect(() => {
    setIsLoading(false);
    // console.log({ userData });
  }, []);

  if (token) {
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
