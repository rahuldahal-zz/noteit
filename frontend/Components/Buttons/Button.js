import React, { useRef, useState } from "react";
import Loader from "@svgs/buttonLoader.svg";

export default function Button({
  children,
  type = "button",
  className,
  onClick: callback,
}) {
  const btnRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);
  const [size, setSize] = useState(null);

  function getClassName() {
    if (showLoader) {
      return "btn--loading";
    }
    return "";
  }

  function handleClick() {
    const { width, height } = btnRef.current.getBoundingClientRect();
    setSize({ width, height });
    setShowLoader(true);
    callback();
  }

  return (
    <button
      type={type}
      className={`${className} ${getClassName()}`}
      onClick={handleClick}
      onBlur={() => setShowLoader(false)}
      ref={btnRef}
      style={size ? { width: size.width, height: size.height } : {}}
    >
      {showLoader ? <Loader /> : children}
    </button>
  );
}
