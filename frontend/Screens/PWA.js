import React from "react";
import { useAuth } from "@contexts/AuthProvider";
import Container from "@components/Container";
import { Testimonial } from "@components/Guest/Testimonials";
import LoginButton from "@components/Buttons/LoginButton";

export default function PWA() {
  const { isAuthenticated } = useAuth();

  function Guest() {
    return (
      <section className="pwa__guest">
        <h3 className="heading">This is NoteIT</h3>
        <p>
          An idea that focuses on the students and their problems, giving them
          the platform to learn in the best possible way.
        </p>
        <LoginButton />
        <hr />
        <Testimonial className="pwa__testimonials" />
      </section>
    );
  }

  return (
    <Container className="pwa">
      {isAuthenticated ? <h4>You are logged in</h4> : <Guest />}
    </Container>
  );
}
