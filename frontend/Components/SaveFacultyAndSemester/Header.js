import React, { useEffect } from "react";
import Form from "@components/Form/Form";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import { useAuth } from "@contexts/AuthProvider";
import formFieldsDetail from "@components/SaveFacultyAndSemester/utils/formFieldsDetail";
import useFormFields from "@hooks/useFormFields";
import Button from "@components/Buttons/Button";
import useFetch from "@hooks/useFetch";
import useFlash from "@hooks/useFlash";
import FlashMessage from "@components/FlashMessage";
import Greeting from "./Greeting";

export default function Header() {
  const { accessToken } = useAuth();
  const [currentValues, fieldsJSX] = useFormFields(formFieldsDetail);
  const [startFetching, status, data] = useFetch();
  const [flashMessage, setFlashMessage] = useFlash();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFlashMessage({
      type: "info",
      message: "Your subscription is being submitted...",
    });
    try {
      startFetching({
        url: "/users/saveFacultyAndSemester",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentValues),
        },
      });
    } catch (error) {
      console.log(error);
      setFlashMessage({
        type: "error",
        message: error.message,
      });
    }
  }

  useEffect(() => {
    console.log(status);
    if (status === 202) {
      setFlashMessage({
        type: "success",
        message: "You have successfully subscribed to NoteIT",
      });
      window.location.replace("/");
    }
  }, [status]);

  return (
    <section className="saveFacultyAndSemester__header">
      <Greeting />
      <Form
        className="form saveFacultyAndSemester__form"
        action="/users/saveFacultyAndSemester"
        method="POST"
        fieldsJSX={fieldsJSX}
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <Button type="submit" className="btn btn--large">
          <TextWithIcon
            textContent="Save"
            pathData={getIconPaths("save")}
            viewBox="0 0 512 512"
            fill="var(--black)"
            strokeWidth="0"
            iconWidth="2rem"
          />
        </Button>
      </Form>
      <FlashMessage flashDetails={flashMessage} setStateRef={setFlashMessage} />
    </section>
  );
}
