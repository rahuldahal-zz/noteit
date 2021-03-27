import React from "react";
import Form from "@components/Form/Form";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import { useAuth } from "@contexts/AuthProvider";
import formFieldsDetail from "@components/SaveFacultyAndSemester/utils/formFieldsDetail";
import useFormFields from "@components/Form/utils/useFormFields";
import Greeting from "./Greeting";

export default function Header() {
  const { token } = useAuth();
  const [currentValues, fieldsJSX] = useFormFields(formFieldsDetail);

  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("submitting form...");
    try {
      const { status } = await fetch("/users/saveFacultyAndSemester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentValues),
      });
      if (status === 202) {
        return window.location("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

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
        <button type="submit" className="btn btn--large">
          <TextWithIcon
            textContent="Save"
            pathData={getIconPaths("save")}
            viewBox="0 0 512 512"
            fill="var(--black)"
            strokeWidth="0"
            iconWidth="2rem"
          />
        </button>
      </Form>
    </section>
  );
}
