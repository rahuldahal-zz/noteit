import React from "react";
import { Link } from "react-router-dom";
import Links from "./Links";
import linksData from "./utils/linksData";
import LoginButton from "@components/Buttons/LoginButton";
import LogoutButton from "@components/Buttons/LogoutButton";
import { useAuth } from "@contexts/AuthProvider";
import Logo from "@svgs/logoAlt.svg";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import FAB from "@components/FAB/FAB";

export default function Nav({ setShowLoginOptions }) {
  const { token, isAuthenticated } = useAuth();

  function GuestActions() {
    return (
      <>
        <Links links={linksData} />
        <LoginButton setShowLoginOptions={setShowLoginOptions} />
      </>
    );
  }

  function UserActions() {
    return (
      <>
        <FAB icon="search" textContent="Search" />
      </>
    );
  }

  return (
    <nav className="nav">
      <div className="nav__wrap flex">
        <Link to="/" className="nav__home">
          <strong>note</strong>
          <Logo className="nav__logo" />
        </Link>

        <div className="nav__items">
          <div className="nav__actions">
            {isAuthenticated ? <UserActions /> : <GuestActions />}
            <div className="nav__hamBurger" tabIndex="0"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
