import React, { useState } from "react";
import Loader from "@svgs/buttonLoader.svg";

export default function Button({
  children,
  type,
  className,
  onClick: callback,
}) {
  const [showLoader, setShowLoader] = useState(false);

  function getClassName() {
    if (showLoader) {
      return "btn--loading";
    }
    return "";
  }

  function handleClick() {
    setShowLoader(true);
    callback();
  }

  return (
    <button
      type={type}
      className={`${className} ${getClassName()}`}
      onClick={handleClick}
      onBlur={() => setShowLoader(false)}
    >
      {showLoader ? <Loader /> : children}
    </button>
  );
}
