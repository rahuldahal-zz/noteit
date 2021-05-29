import React, { useState } from "react";
import { Link } from "react-router-dom";
import SaveIcon from "@svgs/bookmark.svg";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import { useAuth } from "@contexts/AuthProvider";

export default function Units({ notes, subjectName, setShowUnits }) {
  const { user } = useAuth();
  const [savedNotes] = useState(user.savedNotes);

  return (
    <div className="home__units-wrapper">
      <button
        type="button"
        className="back"
        onClick={() => setShowUnits(false)}
      >
        <TextWithIcon textContent="Back" pathData={getIconPaths("arrowLeft")} />
      </button>
      <h6 className="heading">
        Available units for <br /> <em>{subjectName}</em>
      </h6>
      <hr />
      <div className="home__units">
        {notes[subjectName].map((unit, index) => {
          const { unit: number, title, url, _id } = unit;
          const isSaved = savedNotes.includes(_id);
          return (
            <Link to={url} className="unit" key={index}>
              <span className="unit__info">
                <small className="unit__number">Unit {number}</small>
                <em className="unit__title">{title}</em>
              </span>
              <SaveIcon
                className={
                  isSaved ? "unit__save unit__save--saved" : "unit__save"
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
