import React, { useState } from "react";
import Login from "@components/Admin/Login";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  return <Login />;
}
