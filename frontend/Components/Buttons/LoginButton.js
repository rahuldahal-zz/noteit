import React, { useState } from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import LoginOptions from "@components/Guest/LoginOptions";
import Modal from "@components/Modal";
import ReactGA from "react-ga";

export default function LoginButton({ size, className }) {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  function handleClick() {
    ReactGA.event({
      category: "button",
      action: "Clicked on Login button",
    });
    setShowLoginOptions(true);
  }

  return (
    <>
      <button
        type="button"
        className={
          size === "large"
            ? `${className} hero__cta btn btn--large`
            : `${className} btn`
        }
        onClick={() => handleClick()}
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

      <Modal shouldOpen={showLoginOptions}>
        <LoginOptions setShowLoginOptions={setShowLoginOptions} />
      </Modal>
    </>
  );
}
