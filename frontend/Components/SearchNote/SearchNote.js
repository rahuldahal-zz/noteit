import { useNote } from "@contexts/NoteProvider";
import React, { useEffect, useState } from "react";

export default function SearchNote() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableNotes, setAvailableNotes] = useState([]);
  const noteContext = useNote();

  useEffect(() => {
    if (!noteContext.isLoading) {
      setAvailableNotes(noteContext);
    }
  }, [noteContext]);

  function filterData() {
    const notes = Object.values(availableNotes);
    const filtered = [];

    notes.forEach((note) => {
      const matches = note.filter((unit) => unit.title.includes(searchTerm));
      filtered.push(...matches);
    });

    console.log(filtered);
  }

  function handleOnChange(e) {
    const { value } = e.currentTarget;
    if (value.length > 3 && value.trim() !== searchTerm) {
      setSearchTerm(value.trim());
      console.log({ value, searchTerm });
    }
  }

  useEffect(() => {
    if (searchTerm !== "") {
      filterData();
    }
  }, [searchTerm]);

  return (
    <form className="search">
      <input
        type="text"
        name="searchTerm"
        placeholder="Title of the Unit..."
        onChange={(e) => handleOnChange(e)}
      />
    </form>
  );
}
