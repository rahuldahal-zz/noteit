import React from "react";
import Wave from "@svgs/wave.svg";

export default function Info() {
  return (
    <section className="maximumWidth info">
      <Wave className="info__wave" />
      <div className="info__detailsWrap content">
        <h3 className="info__heading heading heading--white">
          What is NoteIT ?
        </h3>
        <div className="info__details">
          <p>
            Being a student, its pretty challenging to prepare &quot;well
            organized&quot; notes.
          </p>
          <p>Maybe because of,</p>
          <ul className="info__list">
            <li>lack of time,</li>
            <li>&quot;confusion&quot; regarding the topic or,</li>
            <li>lack of &quot;good&quot; reference.</li>
          </ul>
          <p>
            Whatever the reason is, most of us will agree that its pretty
            difficult to prepare &quot;organized&quot; and &quot;readable&quot;
            notes.{" "}
          </p>

          <h4>That is the reason why we created NoteIT.</h4>
          <p>
            We will provide well organized notes that are easy to read and
            understand, based on the exact syllabus provided by the TU.
          </p>
        </div>
      </div>
    </section>
  );
}
