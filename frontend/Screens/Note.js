import Screen from "@components/Screen";
import RenderedUnit from "@components/Unit/RenderedUnit";
import { useNote } from "@contexts/NoteProvider";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Note() {
  const { faculty, semester, subject, unit } = useParams();
  const [availableNotes, setAvailableNotes] = useState(null);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const noteContext = useNote();

  function getCurrentUnit() {
    const units =
      availableNotes[
        Object.keys(availableNotes).find((key) => key.toLowerCase() === subject)
      ];
    return units.find((u) => u.title.toLowerCase() === unit);
  }

  useEffect(() => {
    if (!noteContext.isLoading) {
      setAvailableNotes(noteContext);
    }
  }, [noteContext]);

  useEffect(() => {
    if (availableNotes) {
      setCurrentUnit(getCurrentUnit());
    }
  }, [availableNotes]);

  useEffect(() => {
    console.log({ currentUnit });
    if (currentUnit) {
      setIsLoading(false);
    }
  }, [currentUnit]);

  return (
    <Screen>
      {isLoading ? (
        <h3>Loading Unit...</h3>
      ) : (
        <RenderedUnit unit={currentUnit} />
      )}
    </Screen>
  );
}
