import React, { useEffect, useState } from "react";
import SelectOption from "../SelectOption";

export default function Field({ type, setCurrentValues, ...rest }) {
  if (type === "select") {
    return (
      <SelectOption
        {...rest}
        onChange={(e) => {
          setCurrentValues((previousState) => {
            const { name, value } = e.target;
            return { ...previousState, [name]: value };
          });
        }}
      />
    );
  }
  if (type === "textarea") {
    return (
      <textarea
        {...rest}
        onChange={(e) => {
          setCurrentValues((previousState) => {
            const { name, value } = e.target;
            return { ...previousState, [name]: value };
          });
        }}
      />
    );
  }
  return (
    <input
      {...rest}
      type={type}
      onChange={(e) => {
        setCurrentValues((previousState) => {
          const { name, value } = e.target;
          return { ...previousState, [name]: value };
        });
      }}
    />
  );
}
