import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthProvider";
import useFetch from "@hooks/useFetch";

export default function UserDashboard() {
  const { user, accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [availableNotes, setAvailableNotes] = useState([]);

  const [startFetching, status, data] = useFetch();

  useEffect(() => {
    startFetching({
      url: "/users/availableNotes",
    });
  }, []);

  useEffect(() => {
    console.log(status);
    if (data !== null) {
      setAvailableNotes(data);
      setIsLoading(false);
    }
  }, [status, data]);

  function AvailableSubjects() {
    const availableSubjects = Object.keys(availableNotes);
    return (
      <section className="home__availableSubjects flex">
        <h6>Available Subjects</h6>
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
      <h5 className="heading home__heading">
        {user.firstName}, here is the list of available notes based on your
        profile.
      </h5>
      <AvailableSubjects />
    </>
  );
}
