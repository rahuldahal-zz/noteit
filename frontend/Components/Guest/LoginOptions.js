import TextWithIcon from "@components/TextWithIcon";
import React, { useRef } from "react";
import getIconPaths from "@utils/iconDetails";

export function LoginOptions({ showOptions = false, setShowLoginOptions }) {
  const loginOptionsRef = useRef(null);

  return (
    <div
      className={
        showOptions
          ? "loginOptions loginOptions--visible flex"
          : "loginOptions flex"
      }
      aria-hidden="true"
      ref={loginOptionsRef}
    >
      <div className="flex loginOptions__buttons">
        <a href="/auth/facebook" className="btn link">
          <TextWithIcon
            textContent="Continue with Facebook"
            pathData={getIconPaths("facebook")}
            viewBox="0 0 167.7 167.7"
          />
        </a>
        <a href="/auth/google" className="btn link">
          <TextWithIcon
            textContent="Continue with Google"
            pathData={getIconPaths("googlePlus")}
            viewBox="0 0 97.75 97.75"
          />
        </a>
      </div>

      <button
        className="close"
        onClick={() => {
          loginOptionsRef.current.classList.remove("loginOptions--visible");
          setShowLoginOptions(false);
        }}
      >
        Close
      </button>
    </div>
  );
}
