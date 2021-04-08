import React from "react";
import { useAuth } from "@contexts/AuthProvider";
import Container from "@components/Container";

export default function PWA() {
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <h3>Home Screen For PWAs</h3>
      <h4>{isAuthenticated ? "You are logged in" : "You are not logged in"}</h4>
    </Container>
  );
}
