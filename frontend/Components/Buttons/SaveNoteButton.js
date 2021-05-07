import TextWithIcon from "@components/TextWithIcon";
import useFetch from "@hooks/useFetch";
import getIconPaths from "@utils/iconDetails";
import React, { useEffect } from "react";
import Button from "./Button";

export default function SaveNoteButton({ noteId }) {
  const [startFetching, status, data] = useFetch();

  function handleClick() {
    console.log(`should save ${noteId}`);
    startFetching({
      url: "/users/notes/save",
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
    console.log({ status });
  }, [status, data]);

  return (
    <Button className="note__save" onClick={handleClick}>
      <TextWithIcon
        textContent="Save Note"
        pathData={getIconPaths("bookmark")}
      />
    </Button>
  );
}
