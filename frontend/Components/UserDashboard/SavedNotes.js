import React from "react";
import { useAuth } from "@contexts/AuthProvider";
import { Link } from "react-router-dom";

export default function SavedNotes({ notes }) {
  const { user } = useAuth();

  const subjects = Object.keys(notes);
  const saved = [];

  subjects.forEach((subject) => {
    notes[subject].forEach((unit) => {
      const { _id, title, unit: number, url } = unit;
      if (user.savedNotes.includes(_id)) {
        saved.push({ title, subject, number, url });
      }
    });
  });

  function SavedUnits() {
    return (
      <div className="savedNotes">
        {saved.map((note, index) => {
          const { title, url, number } = note;
          return (
            <Link to={url} className="btn unit savedNotes__unit" key={index}>
              <small className="unit__number">Unit {number}</small>
              <em className="unit__title">{title}</em>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <section className="home__availableSubjects flex">
        <h6>Saved Notes</h6>
        {saved.length > 0 ? (
          <SavedUnits />
        ) : (
          <p>The units you save will appear here.</p>
        )}
      </section>
    </>
  );
}
