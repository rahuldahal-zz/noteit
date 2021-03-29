import TextWithIcon from "@components/TextWithIcon";
import React from "react";
import getIconPaths from "@utils/iconDetails";

export default function LoginOptions({ setShowLoginOptions }) {
  return (
    <div className="loginOptions loginOptions--visible flex" aria-hidden="true">
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
        Close
      </button>
    </div>
  );
}
