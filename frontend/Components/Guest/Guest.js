import React from "react";
import Hero from "./Hero";
import Info from "./Info";

export default function Guest() {
  return (
    <main className="guestScreen maximumWidth">
      <Hero />
      <Info />
    </main>
  );
}
