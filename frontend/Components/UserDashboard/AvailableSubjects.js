import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import Modal from "@components/Modal";
import { Link } from "react-router-dom";
import SaveIcon from "@svgs/bookmark.svg";

export default function AvailableSubjects({ notes }) {
  const [subjects] = useState(Object.keys(notes));
  const [showUnits, setShowUnits] = useState(null);
  const { user } = useAuth();

  function handleClick(subject) {
    setShowUnits(subject);
  }

  function Units() {
    return (
      <div className="home__units-wrapper">
        <h6 className="heading">
          Available units for <br /> <em>{showUnits}</em>
        </h6>
        <hr />
        <div className="home__units">
          {notes[showUnits].map((unit, index) => {
            const { unit: number, title, url } = unit;
            return (
              <Link to={url} className="unit" key={index}>
                <span className="unit__info">
                  <small className="unit__number">Unit {number}</small>
                  <em className="unit__title">{title}</em>
                </span>
                <SaveIcon className="unit__save" />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log({ showUnits });
  }, [showUnits]);

  return (
    <>
      <h5 className="heading home__heading">
        {user.firstName}, here is the list of available notes based on your
        profile.
      </h5>
      <section className="home__availableSubjects flex">
        <h6>Available Subjects</h6>
        {subjects.map((subject, index) => (
          <button
            type="button"
            key={index}
            className="home__subject"
            onClick={() => handleClick(subject)}
          >
            {subject}
          </button>
        ))}
      </section>
      <Modal
        shouldOpen={showUnits}
        classToToggle={{ modal: "modal--units", child: "home__units--active" }}
        setStateRef={setShowUnits}
      >
        <Units />
      </Modal>
    </>
  );
}
