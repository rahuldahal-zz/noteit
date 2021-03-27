import { useAuth } from "@contexts/AuthProvider";
import React, { useEffect, useState } from "react";

export default function UserDashboard() {
  const { user } = useAuth();
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
          <button type="button" key={index} className="home__subject">
            {subject}
          </button>
        ))}
      </section>
    );
  }

  return (
    <>
      <h4 className="heading home__heading">
        {user.firstName}, here is the list of available notes based on your
        profile.
      </h4>
      <AvailableSubjects />
    </>
  );
}
