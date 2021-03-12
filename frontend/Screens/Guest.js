import React, { useEffect, useState } from "react";
import Hero from "@components/Guest/Hero";
import Info from "@components/Guest/Info";
import Process from "@components/Guest/Process";
import { withRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default withRouter(function Guest({ history }) {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth0();

  async function createUser() {
    const { family_name, given_name, picture, sub, email } = user;
    try {
      const res = await fetch("/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: given_name,
          lastName: family_name,
          email,
          picture,
          id: sub,
        }),
      });
      const { token } = await res.json();
      console.log(token);
      return history.push("/home");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      return createUser();
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  return (
    <main className="guestScreen maximumWidth">
      <Hero />
      <Info />
      <Process />
    </main>
  );
});
