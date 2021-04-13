import React from "react";
import Form from "@components/Form/Form";
import useFormFields from "@hooks/useFormFields";
import { useAuth } from "@contexts/AuthProvider";

export default function Login({ setAdminToken }) {
  const { token } = useAuth();
  const formFieldsDetail = [
    {
      type: "text",
      displayName: "username",
      defaultValue: null,
      placeholder: "username",
    },
    {
      type: "password",
      displayName: "password",
      defaultValue: null,
      placeholder: "password",
    },
  ];
  const [currentValues, fieldsJSX] = useFormFields(formFieldsDetail);

  async function handleSubmit(e) {
    e.preventDefault();
    const { username, password } = currentValues;
    const res = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, password }),
    });
    const { token: adminToken } = await res.json();
    if (adminToken) {
      return setAdminToken(adminToken);
    }
  }
  return (
    <Form fieldsJSX={fieldsJSX} onSubmit={(e) => handleSubmit(e)}>
      <button type="submit">Submit</button>
    </Form>
  );
}
