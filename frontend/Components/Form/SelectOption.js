import React from "react";

export default function SelectOption({ name, options, ...rest }) {
  return (
    <div className="selectWrap">
      <select
        className="select"
        name={name.toLowerCase()}
        id={name.toLowerCase()}
        {...rest}
      >
        <option value="not set">--Select--</option>
        {options &&
          options.map((option, index) => (
            <option
              className="select__option"
              key={index}
              value={typeof option === "string" ? option : option.value}
            >
              {typeof option === "string" ? option : option.displayName}
            </option>
          ))}
        span.
      </select>
    </div>
  );
}
