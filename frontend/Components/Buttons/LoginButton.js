import React from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";

export default function LoginButton({ size, setShowLoginOptions }) {
  return (
    <button
      type="button"
      className={
        size === "large"
          ? "hero__cta btn btn--accent btn--large"
          : "btn btn--accent"
      }
      onClick={() => setShowLoginOptions(true)}
    >
      <TextWithIcon
        textContent="Let's NoteIT"
        pathData={getIconPaths("login")}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        iconWidth="2rem"
      />
    </button>
  );
}
