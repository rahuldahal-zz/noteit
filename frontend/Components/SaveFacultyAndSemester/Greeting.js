import { useAuth } from "@contexts/AuthProvider";
import React from "react";

export default function Greeting() {
  const { user } = useAuth();

  return (
    <div className="saveFacultyAndSemester__greeting">
      <h1>Hello, {user.firstName}</h1>
      <h2>Welcome to NoteIT</h2>
      <p className="saveFacultyAndSemester__subHeading">
        Help us personalize the app for you by choosing your current faculty and
        semester.
      </p>
    </div>
  );
}
