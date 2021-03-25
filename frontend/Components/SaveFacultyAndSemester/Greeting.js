import { useAuth } from "@contexts/AuthProvider";
import React from "react";

export default function Greeting() {
  const { user } = useAuth();

  return (
    <div className="saveFacultyAndSemester__greeting">
      <h2>Hello, {user.firstName}</h2>
      <h3>Welcome to NoteIT</h3>
      <p className="saveFacultyAndSemester__subHeading">
        Help us personalize the app for you by choosing your current faculty and
        semester.
      </p>
    </div>
  );
}
