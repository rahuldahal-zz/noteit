import React from "react";
import testimonialsData from "./utils/testimonialsData";

export default function Testimonials() {
  function Testimonials() {
    return (
      <div>
        <h5>Here is what happy students say</h5>
        <div className="testimonials">
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
              <div className="testimonial">
                <img
                  src={picture || "https://i.pravatar.cc/80"}
                  alt={`${name} posing to the camera`}
                  width="3.125rem"
                  height="3.125rem"
                  className="testimonial__avatar"
                />
                <q className="testimonial__quote">{quote}</q>
                <div className="testimonial__credit">
                  <strong>{name}</strong>
                  <br />
                  <em>{`${faculty.toUpperCase()} ${semester}, member since ${new Date(
                    joinedOn
                  ).getYear()}`}</em>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
        <Testimonials />
      </div>
    </section>
  );
}
