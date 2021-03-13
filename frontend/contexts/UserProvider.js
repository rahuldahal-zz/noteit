import React, { createContext, useEffect, useState } from "react";
const context = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("/auth/getUser")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  });

  return <context.Provider>{children}</context.Provider>;
}
