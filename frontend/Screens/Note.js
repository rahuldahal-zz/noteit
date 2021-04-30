import Screen from "@components/Screen";
import React from "react";
import { useParams } from "react-router";

export default function Note() {
  const { faculty, semester, subject, unit } = useParams();

  return (
    <Screen>
      <p>{`${faculty} ${semester} ${subject}`}</p>
    </Screen>
  );
}
