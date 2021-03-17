import React from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";

export default function LogoutButton() {
  async function handleLogout() {
    try {
      const { status } = await fetch("/auth/logout");
      if (status === 204) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      type="button"
      className="btn btn--outline"
      onClick={() => handleLogout()}
    >
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
