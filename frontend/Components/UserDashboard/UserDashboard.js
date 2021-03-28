import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [availableNotes, setAvailableNotes] = useState([]);

  useEffect(() => {
    fetch("/users/availableNotes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAvailableNotes(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  function AvailableSubjects() {
    const availableSubjects = Object.keys(availableNotes);
    return (
      <section className="home__availableSubjects flex">
        <h5>Available Subjects</h5>
        {availableSubjects.map((subject, index) => (
          <button type="button" key={index} className="home__subject">
            {subject}
          </button>
        ))}
      </section>
    );
  }

  return isLoading ? (
    <h3>Fetching notes...</h3>
  ) : (
    <>
      <h4 className="heading home__heading">
        {user.firstName}, here is the list of available notes based on your
        profile.
      </h4>
      <AvailableSubjects />
    </>
  );
}
