import React from "react";
import { Link } from "react-router-dom";
import Links from "./Links";
import linksData from "./utils/linksData";
import LoginButton from "@components/Buttons/LoginButton";
import LogoutButton from "@components/Buttons/LogoutButton";
import { useToken } from "../../contexts/TokenProvider";

export default function Nav({ setShowLoginOptions }) {
  const { token } = useToken();
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
