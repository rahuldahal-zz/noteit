import React from "react";
import FormFields from "./Fields";

export default function Form({ fieldsDetail, children, ...props }) {
  async function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form {...props} onSubmit={(e) => handleSubmit(e)}>
      <FormFields fieldsDetail={fieldsDetail} />
      {children}
    </form>
  );
}
