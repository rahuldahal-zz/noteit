import React, { useEffect } from "react";
import Form from "@components/Form/Form";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import Greeting from "./Greeting";
import formFieldsDetail from "@components/SaveFacultyAndSemester/utils/formFieldsDetail";
import getFormFields from "@components/Form/utils/getFormFields";
import { useAuth } from "@contexts/AuthProvider";

export default function Header() {
  const { token } = useAuth();
  const { fieldRefs, fieldsJSX } = getFormFields(formFieldsDetail);

  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("submitting form...");
    const data = {};
    fieldRefs.forEach((field) => {
      const { name, value } = field.current;
      data[name] = value;
    });
    try {
      const { status } = await fetch("/users/saveFacultyAndSemester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      console.log(status);
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
