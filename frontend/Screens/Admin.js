import React, { useState } from "react";
import Login from "@components/Admin/Login";
import CreateNote from "@components/Admin/CreateNote";

export default function Admin() {
  const [adminToken, setAdminToken] = useState(null);
  return !adminToken ? (
    <Login setAdminToken={setAdminToken} />
  ) : (
    <CreateNote token={adminToken} />
  );
}
