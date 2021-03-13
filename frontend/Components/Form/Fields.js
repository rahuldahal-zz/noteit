import React from "react";

export default function FormFields({ fieldsDetail }) {
  return (
    <>
      {fieldsDetail.map((field, index) => {
        const { type, displayName, name, defaultValue, placeholder } = field;
        const computedName = name ? name : displayName.toLowerCase();
        return (
          <fieldset key={index} className="form__fieldset">
            <label htmlFor={computedName}>{displayName}</label>
            <input
              type={type}
              id={computedName}
              name={computedName}
              placeholder={placeholder}
              value={defaultValue}
            />
          </fieldset>
        );
      })}
    </>
  );
}
