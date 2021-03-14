import React, { useEffect } from "react";

export default function Form({ fieldsJSX, children, ...props }) {
  return (
    <form {...props}>
      {fieldsJSX}
      {children}
    </form>
  );
}
