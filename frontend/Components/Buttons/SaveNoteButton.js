import TextWithIcon from "@components/TextWithIcon";
import { useAuth } from "@contexts/AuthProvider";
import useFetch from "@hooks/useFetch";
import getIconPaths from "@utils/iconDetails";
import React, { useEffect, useState } from "react";
import Button from "./Button";

export default function SaveNoteButton({ noteId }) {
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();
  const [savedNotes] = useState(user.savedNotes);
  const [startFetching, status, data] = useFetch();

  function handleClick() {
    console.log(`should handle ${noteId}`);
    const path = isSaved ? "removeSaved" : "save";
    startFetching({
      url: `/users/notes/${path}`,
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      },
    });
  }

  useEffect(() => {
    setIsSaved(savedNotes.includes(noteId));
  }, [noteId]);

  useEffect(() => {
    console.log({ data });
    if (data && data.message === "Note is removed successfully!") {
      setIsSaved(false);
    }
    if (data && data.message === "Note is saved successfully!") {
      setIsSaved(true);
    }
  }, [status, data]);

  return (
    <Button className="note__save" onClick={handleClick}>
      <TextWithIcon
        textContent={isSaved ? "Remove Saved" : "Save Note"}
        pathData={getIconPaths("bookmark")}
      />
    </Button>
  );
}
