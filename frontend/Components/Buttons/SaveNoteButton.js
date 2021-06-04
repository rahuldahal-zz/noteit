import TextWithIcon from "@components/TextWithIcon";
import { useAuth } from "@contexts/AuthProvider";
import useFetch from "@hooks/useFetch";
import useFlash from "@hooks/useFlash";
import getIconPaths from "@utils/iconDetails";
import React, { useEffect, useState } from "react";
import FlashMessage from "@components/FlashMessage";
import Button from "./Button";

export default function SaveNoteButton({ noteId }) {
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();
  const [savedNotes] = useState(user.savedNotes);
  const [startFetching, status, data] = useFetch();
  const [flashMessage, setFlashMessage] = useFlash();

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
    if (data) {
      setFlashMessage({
        type: "success",
        message: data.message,
      });
    }
  }, [status, data]);

  return (
    <>
      <Button className="note__save" onClick={handleClick}>
        <TextWithIcon
          textContent={isSaved ? "Remove Saved" : "Save Note"}
          pathData={getIconPaths("bookmark")}
        />
      </Button>
      <FlashMessage flashDetails={flashMessage} setStateRef={setFlashMessage} />
    </>
  );
}
