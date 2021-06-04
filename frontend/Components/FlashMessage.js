import getIconPaths from "@utils/iconDetails";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import TextWithIcon from "./TextWithIcon";

export default function FlashMessage({ flashDetails, setStateRef }) {
  const messageRef = useRef(null);

  useEffect(() => {
    console.log("from flash's use effect");
    if (flashDetails !== null) {
      const { current } = messageRef;
      current.classList.add("flashMessage--active");
      setTimeout(() => {
        current.classList.remove("flashMessage--active");
        setTimeout(() => setStateRef(null), 300);
      }, 5000);
    }
  }, [flashDetails]);

  if (!flashDetails) {
    return null;
  }

  const { type, message } = flashDetails;

  function getClassName() {
    const generic = "flashMessage";
    switch (type) {
      case "error":
        return `${generic} ${generic}--error`;
      case "success":
        return `${generic} ${generic}--success`;
      case "warning":
        return `${generic} ${generic}--warning`;
      default:
        return `${generic}`;
    }
  }

  function getAppropriateIconPath() {
    switch (type) {
      case "error":
        return getIconPaths("cross");
      case "warning":
        return getIconPaths("warning");
      case "success":
        return getIconPaths("check");
      default:
        return getIconPaths("info");
    }
  }

  return ReactDOM.createPortal(
    <p className={getClassName()} ref={messageRef}>
      <TextWithIcon
        textContent={message}
        iconAlign="left"
        pathData={getAppropriateIconPath()}
      />
    </p>,
    document.getElementById("modal")
  );
}
