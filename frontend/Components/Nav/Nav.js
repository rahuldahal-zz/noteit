import React from "react";
import { Link } from "react-router-dom";
import FAB from "@components/FAB/FAB";
import Logo from "@svgs/logoAlt.svg";
import LoginButton from "@components/Buttons/LoginButton";
import { useAuth } from "@contexts/AuthProvider";
import Links from "./Links";
import linksData from "./utils/linksData";
import ProfilePicture from "./ProfilePicture";

export default function Nav() {
  const { isAuthenticated, isNewUser } = useAuth();

  function GuestActions() {
    return (
      <>
        <Links links={linksData} />
        <LoginButton />
      </>
    );
  }

  function UserActions() {
    return (
      <>
        {!isNewUser && <ProfilePicture />}
        {!isNewUser && <FAB icon="search" textContent="Search" />}
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <div className="nav__wrap flex">
          <Link to="/" className="nav__home">
            <strong>note</strong>
            <Logo className="nav__logo" />
          </Link>

          <div className="nav__items">
            <div className="nav__actions">
              {isAuthenticated ? <UserActions /> : <GuestActions />}
              <button
                type="button"
                aria-label="hamburger button"
                className="nav__hamBurger"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
