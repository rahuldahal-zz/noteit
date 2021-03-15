import React from "react";
import GuyWelcomingVisitors from "@svgs/guyWelcomingVisitors.svg";
import Header from "@components/SaveFacultyAndSemester/Header";

export default function SaveFacultyAndSemester() {
  return (
    <main className="saveFacultyAndSemester maximumWidth">
      <div className="content flex saveFacultyAndSemester__content">
        <Header />
        <GuyWelcomingVisitors className="saveFacultyAndSemester__illustration desktop" />
      </div>
    </main>
  );
}
