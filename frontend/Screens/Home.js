import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Guest from "@components/Guest/Guest";
import UserDashboard from "@components/UserDashboard/UserDashboard";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { isAuthenticated, user } = useAuth0();

  async function createUser() {
    const { family_name, given_name, picture, sub, email } = user;
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
    const data = await res.json();
    console.log({ res, data });
  }

  useEffect(() => {
    isAuthenticated && createUser();
  }, [isAuthenticated]);
  return showDashboard ? <UserDashboard /> : <Guest />;
}
