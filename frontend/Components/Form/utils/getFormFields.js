import React, { useEffect, useRef, useState } from "react";

export default function getFormFields(fieldsDetail) {
  const [fieldRefs] = useState([]);

  const fieldsJSX = fieldsDetail.map((field, index) => {
    const { type, displayName, name, defaultValue, placeholder } = field;
    const computedName = name ? name : displayName.toLowerCase();
    const fieldRef = useRef(null);
    const InputElement = (
      <input
        type={type}
        id={computedName}
        name={computedName}
        placeholder={placeholder}
        value={defaultValue}
        ref={fieldRef}
      />
    );
    fieldRefs.push(fieldRef);
    return (
      <fieldset key={index} className="form__fieldset">
        <label htmlFor={computedName}>{displayName}</label>
        {InputElement}
      </fieldset>
    );
  });

  return { fieldRefs, fieldsJSX };
}
