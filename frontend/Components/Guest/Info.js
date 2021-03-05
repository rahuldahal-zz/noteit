import React from "react";
import Wave from "@svgs/wave.svg";

export default function Info() {
  return (
    <section className="maximumWidth info">
      <Wave className="info__wave" />
      <div className="info__detailsWrap content">
        <h2 className="info__heading heading heading--white">
          What is NoteIT ?
        </h2>
        <div className="info__details">
          <p>
            Being a student, its pretty challenging to prepare "well organized"
            notes.
          </p>
          <p>Maybe because of,</p>
          <ul className="info__list">
            <li>lack of time,</li>
            <li>"confusion" regarding the topic or,</li>
            <li>lack of "good" reference.</li>
          </ul>
          <p>
            Whatever the reason is, most of us will agree that its pretty
            difficult to prepare "organized" and "readable" notes.{" "}
          </p>

          <h3>That is the reason why we created NoteIT.</h3>
          <p>
            We will provide well organized notes that are easy to read and
            understand, based on the exact syllabus provided by the TU.
          </p>
        </div>
      </div>
    </section>
  );
}
