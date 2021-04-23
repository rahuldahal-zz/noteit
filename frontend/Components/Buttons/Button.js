import React, { useState } from "react";
import Loader from "@svgs/buttonLoader.svg";

export default function Button({
  children,
  type,
  className,
  onClick: callback,
}) {
  const [isClicked, setIsClicked] = useState(false);

  function getClassName() {
    if (isClicked) {
      return "btn--loading";
    }
    return "";
  }

  function handleClick() {
    setIsClicked(true);
    callback();
  }

  return (
    <button
      type={type}
      className={`${className} ${getClassName()}`}
      onClick={handleClick}
    >
      {isClicked ? <Loader /> : children}
    </button>
  );
}
