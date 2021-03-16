import React from "react";
import { Link } from "react-router-dom";
import Links from "./Links";
import linksData from "./utils/linksData";
import LoginButton from "@components/Buttons/LoginButton";
import LogoutButton from "@components/Buttons/LogoutButton";
import { useAuth } from "@contexts/AuthProvider";
import Logo from "@svgs/logoAlt.svg";

export default function Nav({ setShowLoginOptions }) {
  const { token } = useAuth();
  return (
    <nav className="nav">
      <div className="nav__wrap flex">
        <Link to="/" className="nav__home">
          <strong>note</strong>
          <Logo className="nav__logo" />
        </Link>

        <div className="nav__items">
          <Links links={linksData} />
          <div className="nav__actions">
            {token ? (
              <LogoutButton />
            ) : (
              <LoginButton setShowLoginOptions={setShowLoginOptions} />
            )}
            <div className="nav__hamBurger" tabIndex="0"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
