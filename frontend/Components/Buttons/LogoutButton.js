import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth0();

  return (
    <button type="button" className="hero__cta btn" onClick={() => logout()}>
      <TextWithIcon
        textContent="Logout"
        pathData={getIconPaths("logout")}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
      />
    </button>
  );
}
