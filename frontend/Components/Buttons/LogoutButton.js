import React from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import Button from "./Button";

export default function LogoutButton({ className }) {
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
    <Button
      type="button"
      className={`${className || ""} btn--outline`}
      onClick={() => handleLogout()}
    >
      <TextWithIcon
        textContent="Logout"
        pathData={getIconPaths("logout")}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        iconWidth="1.3em"
      />
    </Button>
  );
}
