import React from "react";
import GuyWelcomingVisitors from "@svgs/guyWelcomingVisitors.svg";
import Container from "@components/Container";
import Header from "@components/SaveFacultyAndSemester/Header";

export default function SaveFacultyAndSemester() {
  return (
    <Container className="saveFacultyAndSemester">
      <Header />
      <GuyWelcomingVisitors className="saveFacultyAndSemester__illustration desktop" />
    </Container>
  );
}
