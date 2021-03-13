import React from "react";

export default function Greeting() {
  return (
    <div className="saveFacultyAndSemester__greeting">
      <h1>Hello, username*</h1>
      <h2>
        Welcome to <span className="color--brand">NoteIT</span>
      </h2>
      <p className="saveFacultyAndSemester__subHeading">
        Help us personalize the app for you by choosing your current faculty and
        semester.
      </p>
    </div>
  );
}
