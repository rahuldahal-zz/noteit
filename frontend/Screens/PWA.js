import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import Container from "@components/Container";
import { Testimonial } from "@components/Guest/Testimonials";
import LoginButton from "@components/Buttons/LoginButton";
import AvailableSubjects from "@components/UserDashboard/AvailableSubjects";
import { useNote } from "@contexts/NoteProvider";

export default function PWA() {
  const [availableNotes, setAvailableNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const noteContext = useNote();

  useEffect(() => {
    if (!noteContext.isLoading) {
      setAvailableNotes(noteContext);
      setIsLoading(false);
    }
  }, [noteContext]);

  function Guest() {
    return (
      <div className="pwa__guest">
        <h3 className="heading">This is NoteIT</h3>
        <p>
          An idea that focuses on the students and their problems, giving them
          the platform to learn in the best possible way.
        </p>
        <LoginButton />
        <hr />
        <Testimonial className="pwa__testimonials" />
      </div>
    );
  }

  function User() {
    return isLoading ? (
      <h3>Loading...</h3>
    ) : (
      <AvailableSubjects notes={availableNotes} />
    );
  }

  return (
    <Container className="pwa">
      {isAuthenticated ? <User /> : <Guest />}
      {/* {isAuthenticated ? <h3>authenticated</h3> : <h3>Note</h3>} */}
    </Container>
  );
}
