import React, { useState } from "react";
import Hero from "./Hero";
import Info from "./Info";
import Process from "./Process";

export default function Guest() {
  return (
    <main className="guestScreen maximumWidth">
      <Hero />
      <Info />
      <Process />
    </main>
  );
}
