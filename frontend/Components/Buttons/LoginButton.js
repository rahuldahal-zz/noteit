import React, { useState } from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import LoginOptions from "@components/Guest/LoginOptions";
import Modal from "@components/Modal";

export default function LoginButton({ size }) {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  return (
    <>
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

      {showLoginOptions ? (
        <Modal>
          <LoginOptions setShowLoginOptions={setShowLoginOptions} />
        </Modal>
      ) : null}
    </>
  );
}
