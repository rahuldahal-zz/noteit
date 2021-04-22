import LoginButton from "@components/Buttons/LoginButton";
import React from "react";
import testimonialsData from "./utils/testimonialsData";

export default function Testimonials() {
  return (
    <section className="testimonialContainer maximumWidth">
      <div className="content">
        <header>
          <h4 className="heading">Enters NoteIT into the picture.</h4>
          <p>
            We saw the opportunity to create something that we always wanted.
          </p>
          <p>
            An idea that focuses on the students and their problems, giving them
            the platform to learn in the best possible way.
          </p>
        </header>
        <Testimonial />
        <LoginButton className="mt20 btn--brand" />
      </div>
    </section>
  );
}

export function Testimonial({ className }) {
  return (
    <div className={className}>
      <h5>Here is what happy students say</h5>
      <div className="testimonials">
        <div className="testimonials__content">
          {testimonialsData.map((testimonial, index) => {
            const {
              name,
              faculty,
              semester,
              joinedOn,
              quote,
              picture,
            } = testimonial;
            return (
              <div className="testimonial" key={index}>
                <img
                  src={picture}
                  alt={`${name} posing to the camera`}
                  width="3.125rem"
                  height="3.125rem"
                  className="testimonial__avatar"
                />
                <q className="testimonial__quote">{quote}</q>
                <div className="testimonial__credit">
                  <strong>{name}</strong>
                  <em>{`${faculty.toUpperCase()} ${semester}, member since ${new Date(
                    joinedOn
                  ).getFullYear()}`}</em>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
