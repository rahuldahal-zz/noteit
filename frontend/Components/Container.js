import React from "react";

export default function Container({ children, className }) {
  return (
    <main className={`maximumWidth ${className}`}>
      <div className={`content ${className}__content`}>{children}</div>
    </main>
  );
}
