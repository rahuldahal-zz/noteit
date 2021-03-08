import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import Links from "./Links";
import linksData from "./utils/linksData";
import LoginButton from "@components/Buttons/LoginButton";
import LogoutButton from "@components/Buttons/LogoutButton";

export default function Nav() {
  const { isAuthenticated } = useAuth0();
  return (
    <nav className="nav">
      <div className="nav__wrap flex">
        <h2>
          <Link to="/" className="nav__home">
            NoteIT
          </Link>
        </h2>

        <div className="nav__items">
          <Links links={linksData} />
          <div className="nav__actions">
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            <div className="nav__hamBurger" tabIndex="0"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
