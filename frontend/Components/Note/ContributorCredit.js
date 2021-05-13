import React from "react";

export default function ContributorCredit({ contributor }) {
  const { firstName, lastName, picture } = contributor;
  return (
    <aside className="note__contributor">
      Contributed By: <a href="#">{`${firstName} ${lastName}`}</a>
    </aside>
  );
}
