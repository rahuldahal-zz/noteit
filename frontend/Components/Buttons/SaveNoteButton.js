import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import React from "react";
import Button from "./Button";

export default function SaveNoteButton({ noteId }) {
  function handleClick() {
    console.log(`should save ${noteId}`);
  }

  return (
    <Button className="note__save" onClick={handleClick}>
      <TextWithIcon
        textContent="Save Note"
        pathData={getIconPaths("bookmark")}
      />
    </Button>
  );
}
