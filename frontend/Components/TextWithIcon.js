import React from "react";

export default function TextWithIcon({
  textContent,
  pathData,
  fill = "currentColor",
  strokeWidth = 0,
  iconAlign = "right",
  iconWidth = "1.25rem",
  viewBox = "0 0 20 20",
}) {
  return (
    <span
      className={
        iconAlign === "right"
          ? "textWithIcon textWithIcon--iconRight"
          : "textWithIcon"
      }
    >
      <svg
        className="textWithIcon__icon"
        xmlns="http://www.w3.org/2000/svg"
        fill={fill}
        viewBox={viewBox}
        stroke="currentColor"
        style={{ width: iconWidth }}
      >
        {pathData.map((data, index) => {
          return (
            <path
              key={index}
              strokeLinecap="round"
              fillRule="evenodd"
              clipRule="evenodd"
              strokeLinejoin="round"
              strokeWidth={strokeWidth}
              d={data}
            />
          );
        })}
      </svg>
      <span className="textWithIcon__text">{textContent}</span>
    </span>
  );
}
