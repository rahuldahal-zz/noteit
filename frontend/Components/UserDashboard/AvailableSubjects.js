import React, { useEffect, useState } from "react";
import Modal from "@components/Modal";
import Units from "./Units";
import isScreenLargerThan from "@utils/screenSize";
import Button from "@components/Buttons/Button";

export default function AvailableSubjects({ notes }) {
  const [subjects] = useState(Object.keys(notes));
  const [showUnits, setShowUnits] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [isScreenWide, setIsScreenWide] = useState(false);

  useEffect(() => {
    if (isScreenLargerThan(768)) {
      setIsScreenWide(true);
    }
  }, []);

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
          <Button
            key={index}
            className="btn home__subject"
            onClick={() => handleClick(subject)}
          >
            {subject}
          </Button>
        ))}
      </section>
      <Modal
        shouldOpen={showUnits}
        classToToggle={{
          modal: `${isScreenWide ? "modal--wide" : "modal--units"}`,
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
