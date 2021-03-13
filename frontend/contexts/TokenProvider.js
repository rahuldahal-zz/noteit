import React, { createContext, useEffect, useState } from "react";
const TokenContext = createContext(null);

export default function TokenProvider({ children }) {
  const [token, setToken] = useState({});

  useEffect(() => {
    fetch("/auth/getToken")
      .then((res) => res.json())
      .then((data) => {
        setToken(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}

function useToken() {
  const context = React.useContext(TokenContext);

  if (context === undefined) {
    throw new Error("useToken must be used within a CountProvider");
  }

  return context;
}

export { TokenProvider, useToken };
