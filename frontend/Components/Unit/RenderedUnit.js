import React from "react";

export default function RenderedUnit({ unit }) {
  const { _id, contributorInfo, title, note, unit: no } = unit;
  const { firstName, lastName, picture } = contributorInfo;

  return (
    <>
      <h3>{title}</h3>
      <strong>Unit {no}</strong>
      <strong>Contributed by: {firstName}</strong>
    </>
  );
}
