import React, { useState } from "react";
import { Link } from "react-router-dom";
import FAB from "@components/FAB/FAB";
import Logo from "@svgs/logoAlt.svg";
import LoginButton from "@components/Buttons/LoginButton";
import LogoutButton from "@components/Buttons/LogoutButton";
import { useAuth } from "@contexts/AuthProvider";
import Modal from "@components/Modal";
import UserProfile from "@components/UserProfile/UserProfile";
import Links from "./Links";
import linksData from "./utils/linksData";

export default function Nav() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { isAuthenticated, isNewUser, user } = useAuth();

  function ProfilePicture() {
    return (
      <button
        type="button"
        className="nav__profile"
        onClick={() => setShowUserProfile(true)}
      >
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
        <ProfilePicture />
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

      {showUserProfile ? (
        <Modal>
          <UserProfile setShowUserProfile={setShowUserProfile} />
        </Modal>
      ) : null}
    </>
  );
}
