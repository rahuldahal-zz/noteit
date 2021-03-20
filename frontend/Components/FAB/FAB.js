import React from "react";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";

export default function FAB({ icon, textContent, ...rest }) {
  return (
    <button className="fab" {...rest}>
      <TextWithIcon textContent={textContent} pathData={getIconPaths(icon)} />
    </button>
  );
}
