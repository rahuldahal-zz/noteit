import React, { useEffect, useState } from "react";
import Container from "@components/Container";
import Screen from "@components/Screen";
import AvailableSubjects from "@components/UserDashboard/AvailableSubjects";
import { useNote } from "@contexts/NoteProvider";
import useFlash from "@hooks/useFlash";
import FlashMessage from "@components/FlashMessage";

export default function Home() {
  const [availableNotes, setAvailableNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useFlash();
  const noteContext = useNote();

  useEffect(() => {
    if (!noteContext.isLoading) {
      setAvailableNotes(noteContext);
      setIsLoading(false);
    }
  }, [noteContext]);

  return (
    <Screen>
      <Container className="home">
        {isLoading ? (
          <h3>Fetching notes...</h3>
        ) : (
          <AvailableSubjects notes={availableNotes} />
        )}
      </Container>
      <FlashMessage flashDetails={flashMessage} setStateRef={setFlashMessage} />
    </Screen>
  );
}
