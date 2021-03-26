import React, { useEffect, useRef, useState } from "react";

export default function getFormFields(fieldsDetail) {
  const [fieldRefs] = useState([]);

  const fieldsJSX = fieldsDetail.map((field, index) => {
    const {
      type,
      options,
      displayName,
      name,
      defaultValue,
      placeholder,
    } = field;
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
    const TextArea = (
      <textarea
        name={computedName}
        id={computedName}
        cols="30"
        rows="10"
        placeholder={placeholder}
        ref={fieldRef}
      />
    );
    const SelectElement = (
      <div className="selectWrap">
        <select
          className="select"
          name={computedName}
          id={computedName}
          ref={fieldRef}
        >
          {options &&
            options.map((option, index) => (
              <option className="select__option" key={index} value={option}>
                {option}
              </option>
            ))}
          span.
        </select>
      </div>
    );
    fieldRefs.push(fieldRef);
    let fieldToRender = InputElement;

    if (type === "select") {
      fieldToRender = SelectElement;
    }

    if (type === "textarea") {
      fieldToRender = TextArea;
    }

    return (
      <fieldset key={index} className="form__fieldset">
        <label htmlFor={computedName}>{displayName}</label>
        {fieldToRender}
      </fieldset>
    );
  });

  return { fieldRefs, fieldsJSX };
}
