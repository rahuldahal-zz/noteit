import React, { useEffect, useState } from "react";
import Hero from "@components/Guest/Hero";
import Info from "@components/Guest/Info";
import Process from "@components/Guest/Process";
import LoginOptions from "@components/Guest/LoginOptions";
import Screen from "@components/Screen";

export default function Root({ history }) {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  return (
    <Screen class="guestScreen" root={true} history={history}>
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
    </Screen>
  );
}
