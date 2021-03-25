import React, { useEffect, useState } from "react";
import UserDashboard from "@components/UserDashboard/UserDashboard";
import Container from "@components/Container";
import Screen from "@components/Screen";

export default function Home() {
  return (
    <Screen>
      <Container className="home">
        <UserDashboard />
      </Container>
    </Screen>
  );
}
