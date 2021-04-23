import React, { useEffect } from "react";
import Form from "@components/Form/Form";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import { useAuth } from "@contexts/AuthProvider";
import formFieldsDetail from "@components/SaveFacultyAndSemester/utils/formFieldsDetail";
import useFormFields from "@hooks/useFormFields";
import Greeting from "./Greeting";
import useFetch from "@hooks/useFetch";
import Button from "@components/Buttons/Button";

export default function Header() {
  const { accessToken } = useAuth();
  const [currentValues, fieldsJSX] = useFormFields(formFieldsDetail);
  const [startFetching, status, data] = useFetch();

  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("submitting form...");
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
    }
  }

  useEffect(() => {
    console.log(status);
    if (status === 202) {
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
    </section>
  );
}
