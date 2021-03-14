import React, { createContext, useEffect, useState } from "react";
const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    fetch("/auth")
      .then((res) => res.json())
      .then((responseFromServer) => {
        setAuthState(responseFromServer);
        console.log(responseFromServer);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a CountProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
