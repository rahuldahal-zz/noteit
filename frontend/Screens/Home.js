import React, { useEffect, useState } from "react";
import Container from "@components/Container";
import Screen from "@components/Screen";
import AvailableSubjects from "@components/UserDashboard/AvailableSubjects";
import useFetch from "@hooks/useFetch";

export default function Home() {
  const [availableNotes, setAvailableNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Screen>
      <Container className="home">
        {isLoading ? (
          <h3>Fetching notes...</h3>
        ) : (
          <AvailableSubjects notes={availableNotes} />
        )}
      </Container>
    </Screen>
  );
}
