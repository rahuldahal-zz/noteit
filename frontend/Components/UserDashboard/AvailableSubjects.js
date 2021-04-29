import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import Modal from "@components/Modal";
import Units from "./Units";

export default function AvailableSubjects({ notes }) {
  const [subjects] = useState(Object.keys(notes));
  const [showUnits, setShowUnits] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const { user } = useAuth();

  function handleClick(subject) {
    setShowUnits(true);
    setCurrentSubject(subject);
  }

  useEffect(() => {
    console.log({ currentSubject });
  }, [currentSubject]);

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
