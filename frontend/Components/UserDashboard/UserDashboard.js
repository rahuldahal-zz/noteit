import { useAuth } from "@contexts/AuthProvider";
import React from "react";

export default function UserDashboard() {
  const { user } = useAuth();
  const { firstName, picture } = user;
  const availableSubjectsData = [
    "Principles of Management",
    "Computer Information System",
    "Digital Logic",
    "English",
    "Mathematics",
  ];

  function AvailableSubjects() {
    return (
      <section className="home__availableSubjects flex">
        <h5>Available Subjects</h5>
        {availableSubjectsData.map((subject, index) => (
          <button key={index} className="home__subject">
            {subject}
          </button>
        ))}
      </section>
    );
  }

  return (
    <main className="home maximumWidth">
      <div className="content home__content">
        <h4 className="heading home__heading">
          {firstName}, here is the list of available notes based on your
          profile.
        </h4>
        <AvailableSubjects />
      </div>
    </main>
  );
}
