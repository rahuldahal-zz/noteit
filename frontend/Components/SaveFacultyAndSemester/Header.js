import React from "react";
import Form from "@components/Form/Form";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import Greeting from "./Greeting";
import formFieldsDetail from "@components/SaveFacultyAndSemester/utils/formFieldsDetail";

export default function Header() {
  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("submitting form...");
  }

  return (
    <section className="saveFacultyAndSemester__header">
      <Greeting />
      <Form
        className="form"
        action="/users/saveFacultyAndSemester"
        method="POST"
        fieldsDetail={formFieldsDetail}
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <button type="submit" className="btn btn--large">
          <TextWithIcon
            textContent="Save"
            pathData={getIconPaths("login")}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            iconWidth="2rem"
          />
        </button>
      </Form>
    </section>
  );
}
