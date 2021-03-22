import React from "react";
import Form from "@components/Form/Form";
import getFormFields from "@components/Form/utils/getFormFields";
import { useAuth } from "@contexts/AuthProvider";

export default function Login() {
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
  const { fieldsJSX, fieldRefs } = getFormFields(formFieldsDetail);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {};
    fieldRefs.forEach((ref) => {
      const { name, value } = ref.current;
      data[name] = value;
    });
    const res = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const { token: adminToken } = await res.json();
    console.log(adminToken);
  }
  return (
    <Form fieldsJSX={fieldsJSX} onSubmit={(e) => handleSubmit(e)}>
      <button type="submit">Submit</button>
    </Form>
  );
}
