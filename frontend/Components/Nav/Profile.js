import { useAuth } from "@contexts/AuthProvider";
import React from "react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <button type="button" className="nav__profile">
      <img
        src={user.picture}
        alt={`Avatar of ${user.firstName}`}
        width="40px"
        height="40px"
        className="nav__avatar"
      />
    </button>
  );
}
