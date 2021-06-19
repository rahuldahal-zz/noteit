import React, { useEffect, useState } from "react";
import Container from "@components/Container";
import Screen from "@components/Screen";
import AvailableSubjects from "@components/UserDashboard/AvailableSubjects";
import SavedNotes from "@components/UserDashboard/SavedNotes";
import BottomNav from "@components/Nav/BottomNav";
import Button from "@components/Buttons/Button";
import TextWithIcon from "@components/TextWithIcon";
import { useNote } from "@contexts/NoteProvider";
import Loader from "@components/Loader";
import getIconPaths from "@utils/iconDetails";
import { useAuth } from "@contexts/AuthProvider";
import isScreenLargerThan from "@utils/screenSize";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("available");
  const [availableNotes, setAvailableNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreenWide, setIsScreenWide] = useState(false);
  const noteContext = useNote();
  const { user } = useAuth();

  useEffect(() => {
    if (!noteContext.isLoading) {
      setAvailableNotes(noteContext);
      setIsLoading(false);
    }
  }, [noteContext]);

  useEffect(() => {
    if (isScreenLargerThan(1200)) {
      setIsScreenWide(true);
    }
  }, []);

  function AvailableOrSaved() {
    return currentTab === "saved" ? (
      <SavedNotes notes={availableNotes} />
    ) : (
      <AvailableSubjects notes={availableNotes} />
    );
  }

  function AvailableAndSaved() {
    return (
      <>
        <AvailableSubjects notes={availableNotes} />
        <SavedNotes notes={availableNotes} />
      </>
    );
  }

  function NotesList() {
    return (
      <>
        <h5 className="heading home__heading">
          {user.firstName}, here is the list of available notes based on your
          profile.
        </h5>
        <div className="home__notesList">
          {isScreenWide ? <AvailableAndSaved /> : <AvailableOrSaved />}
        </div>
      </>
    );
  }

  return (
    <Screen>
      <Container className="home">
        {isLoading ? <Loader /> : <NotesList />}
        <BottomNav>
          <Button
            type="button"
            className={
              currentTab === "saved"
                ? "bottomNav__button"
                : "bottomNav__button bottomNav__button--active"
            }
            onClick={() => setCurrentTab("available")}
          >
            <TextWithIcon
              textContent="Available"
              pathData={getIconPaths("collection")}
            />
          </Button>
          <Button
            type="button"
            className={
              currentTab === "saved"
                ? "bottomNav__button bottomNav__button--active"
                : "bottomNav__button"
            }
            onClick={() => setCurrentTab("saved")}
          >
            <TextWithIcon
              textContent="Saved"
              pathData={getIconPaths("bookmark")}
            />
          </Button>
        </BottomNav>
      </Container>
    </Screen>
  );
}
