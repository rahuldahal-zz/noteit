import TextWithIcon from "@components/TextWithIcon";
import React from "react";
import getIconPaths from "@utils/iconDetails";

export default function LoginOptions({ setShowLoginOptions }) {
  return (
    <div className="loginOptions" aria-hidden="true">
      <div className="loginOptions__header">
        <h4>This is NoteIT.</h4>
        <p>Login using either facebook or google.</p>
        <small>
          <em>Don&apos;t worry. Your data will never be shared.</em>
        </small>
      </div>
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
        type="button"
        className="close"
        onClick={() => setShowLoginOptions(false)}
      >
        <TextWithIcon textContent="Close" pathData={getIconPaths("cross")} />
      </button>
    </div>
  );
}
