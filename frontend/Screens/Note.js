import Screen from "@components/Screen";
import RenderedNote from "@components/Note/RenderedNote";
import { useNote } from "@contexts/NoteProvider";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import SaveNoteButton from "@components/Buttons/SaveNoteButton";
import ContributorCredit from "@components/Note/ContributorCredit";
import Loader from "@components/Loader";

export default function Note() {
  const { faculty, semester, subject, unit } = useParams();
  const [availableNotes, setAvailableNotes] = useState(null);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const noteContext = useNote();

  function getCurrentUnit() {
    const units =
      availableNotes[
        Object.keys(availableNotes).find(
          (key) => key.toLowerCase() === subject.toLowerCase()
        )
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
        <Loader />
      ) : (
        <main className="note">
          <RenderedNote unit={currentUnit} />
          <SaveNoteButton noteId={currentUnit._id} />
          {/* <ContributorCredit contributor={currentUnit.contributorInfo} /> */}
        </main>
      )}
    </Screen>
  );
}
