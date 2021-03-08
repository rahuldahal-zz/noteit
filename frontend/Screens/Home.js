import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Guest from "@components/Guest/Guest";
import UserDashboard from "@components/UserDashboard/UserDashboard";

export default function Home() {
  const { isAuthenticated } = useAuth0();
  return !isAuthenticated ? <Guest /> : <UserDashboard />;
}
