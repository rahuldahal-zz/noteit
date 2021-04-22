import React from "react";
import Wave from "@svgs/wave.svg";

export default function Info() {
  return (
    <section className="maximumWidth info" id="info">
      <Wave className="info__wave" />
      <div className="info__detailsWrap content">
        <h4 className="info__heading heading heading--white">
          What exactly does NoteIT offer ?
        </h4>
        <div className="info__details">
          <p>
            Our mission is to provide a platform for students that once we, the
            creators dreamed about back when we were students.
          </p>
          <h5>We wanted</h5>
          <ul className="info__list">
            <li>the teachers to understand our level and teach accordingly.</li>
            <li>
              the institution to listen to our problems, from our perspectives.
            </li>
            <li>
              to step out of the box and understand the real-world applications
              of the topics we read.
            </li>
          </ul>
          <p>
            Overall, we wanted a flexible and inspirational teaching-learning
            experience.
          </p>

          <h5>The sad part ?</h5>
          <p>
            There were no institutions or platforms back then that focused(or,
            at least tried to focus) more on students, rather than the
            &ldquo;business&rdquo; aspect.
          </p>
        </div>
      </div>
    </section>
  );
}
