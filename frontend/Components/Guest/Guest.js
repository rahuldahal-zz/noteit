import React, { useState } from "react";
import Hero from "./Hero";
import Info from "./Info";
import { LoginOptions } from "./LoginOptions";
import Process from "./Process";

export default function Guest() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  console.log(showLoginOptions);

  return (
    <main className="guestScreen maximumWidth">
      <Hero setShowLoginOptions={setShowLoginOptions} />
      <Info />
      <Process />
      {showLoginOptions ? (
        <LoginOptions
          showOptions={true}
          setShowLoginOptions={setShowLoginOptions}
        />
      ) : (
        <LoginOptions />
      )}
    </main>
  );
}
