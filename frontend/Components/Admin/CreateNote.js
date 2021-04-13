import Form from "@components/Form/Form";
import SelectOption from "@components/Form/SelectOption";
import Field from "@components/Form/utils/Field";
import useFormFields from "@hooks/useFormFields";
import React, { useEffect, useRef, useState } from "react";
import createNoteFormFields from "./utils/createNoteFormFields";

export default function CreateNote({ token }) {
  const [currentValues, fieldsJSX, setCurrentValues] = useFormFields(
    createNoteFormFields
  );
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/admin/notes/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(currentValues),
    });
    const data = await res.json();
    console.log(data);
  }

  useEffect(() => {
    fetch("/api/admin/contributors", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const contributorOptions = data.map((contributor) => {
          const { _id, firstName, lastName } = contributor;
          return { displayName: `${firstName} ${lastName}`, value: _id };
        });
        setContributors(contributorOptions);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  return isLoading ? (
    <h3>Loading...</h3>
  ) : (
    <Form
      fieldsJSX={fieldsJSX}
      className="admin__createNote"
      onSubmit={(e) => handleSubmit(e)}
    >
      <Field
        type="select"
        name="Contributor"
        options={contributors}
        setCurrentValues={setCurrentValues}
      />
      <button type="submit">Create Note</button>
    </Form>
  );
}
