import React from "react";
import Container from "@components/Container";
import { Testimonial } from "@components/Guest/Testimonials";
import LoginButton from "@components/Buttons/LoginButton";

export default function PWA() {
  return (
    <Container className="pwa">
      <div className="pwa__guest">
        <h3 className="heading">This is NoteIT</h3>
        <p>
          An idea that focuses on the students and their problems, giving them
          the platform to learn in the best possible way.
        </p>
        <LoginButton className="btn--brand" />
        <hr />
        <Testimonial className="pwa__testimonials" />
      </div>
    </Container>
  );
}
