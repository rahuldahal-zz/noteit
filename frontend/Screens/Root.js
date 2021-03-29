import React, { useEffect, useState } from "react";
import Hero from "@components/Guest/Hero";
import Info from "@components/Guest/Info";
import Process from "@components/Guest/Process";
import Screen from "@components/Screen";

export default function Root({ history }) {
  return (
    <Screen class="guestScreen" root={true} history={history}>
      <Hero />
      <Info />
      <Process />
    </Screen>
  );
}
