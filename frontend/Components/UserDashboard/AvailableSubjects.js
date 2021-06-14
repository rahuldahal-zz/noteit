import React, { useEffect, useState } from "react";
import Modal from "@components/Modal";
import Units from "./Units";

export default function AvailableSubjects({ notes }) {
  const [subjects] = useState(Object.keys(notes));
  const [showUnits, setShowUnits] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  function handleClick(subject) {
    setShowUnits(true);
    setCurrentSubject(subject);
  }

  useEffect(() => {
    console.log({ currentSubject });
  }, [currentSubject]);

  return (
    <>
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
        classToToggle={{
          modal: "modal--units",
          child: "home__units-wrapper--active",
        }}
        setStateRef={setShowUnits}
      >
        <Units
          notes={notes}
          subjectName={currentSubject}
          setShowUnits={setShowUnits}
        />
      </Modal>
    </>
  );
}
