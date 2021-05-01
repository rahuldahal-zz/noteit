import React, { createContext, useEffect, useState } from "react";
import useFetch from "@hooks/useFetch";
import { useAuth } from "./AuthProvider";

const NoteContext = createContext(null);

function NoteProvider({ children }) {
  const { user } = useAuth();
  const [note, setNote] = useState({ isLoading: true });
  const [startFetching, status, data] = useFetch();

  useEffect(() => {
    if (user) {
      startFetching({
        url: "/users/availableNotes",
      });
    }
  }, [user]);

  useEffect(() => {
    console.log({ note });
    if (data !== null) {
      setNote(data);
    }
  }, [status, data, note]);

  return <NoteContext.Provider value={note}>{children}</NoteContext.Provider>;
}

function useNote() {
  const context = React.useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNote must be used within a NoteProvider");
  }

  return context;
}

export { NoteProvider, useNote };
