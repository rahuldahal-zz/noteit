import React, { useEffect, useRef, useState } from "react";
import Field from "../Components/Form/utils/Field";

export default function useFormFields(fieldsDetail) {
  const [currentValues, setCurrentValues] = useState({});

  const fieldsJSX = fieldsDetail.map((field, index) => {
    const { type, name, displayName, ...rest } = field;
    const computedName = name || displayName.toLowerCase();

    return (
      <fieldset key={index} className="form__fieldset">
        <label htmlFor={computedName}>{displayName}</label>
        <Field
          type={type}
          name={computedName}
          value={currentValues[computedName]}
          setCurrentValues={setCurrentValues}
          {...rest}
        />
      </fieldset>
    );
  });

  return [currentValues, fieldsJSX, setCurrentValues];
}
