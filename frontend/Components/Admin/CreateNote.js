import Form from "@components/Form/Form";
import getFormFields from "@components/Form/utils/getFormFields";
import React, { useEffect } from "react";
import createNoteFormFields from "./utils/createNoteFormFields";

export default function CreateNote({ token }) {
  const { fieldsJSX, fieldRefs } = getFormFields(createNoteFormFields);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {};
    fieldRefs.forEach((ref) => {
      const { name, value } = ref.current;
      data[name] = value;
    });
    console.log(data);
  }

  useEffect(() => {
    fetch("/api/admin/contributors", {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Form
      fieldsJSX={fieldsJSX}
      className="admin__createNote"
      onSubmit={(e) => handleSubmit(e)}
    >
      <button type="submit">Create Note</button>
    </Form>
  );
}
