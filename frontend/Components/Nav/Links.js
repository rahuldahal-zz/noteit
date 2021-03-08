import React from "react";
import { Link } from "react-router-dom";
import TextWithIcon from "../TextWithIcon";

export default function Links({ links }) {
  return (
    <ul className="nav__links">
      {links.map((link, index) => {
        const { to, label, iconData } = link;
        return (
          <li key={index} className="nav__link">
            <Link to={to}>
              <TextWithIcon textContent={label} pathData={iconData} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
