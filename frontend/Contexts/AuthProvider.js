import React, { createContext, useEffect, useState } from "react";
import parseJwt from "@utils/parseJWT";

const AuthContext = createContext(null);

async function fetchAuthStatus() {
  try {
    const res = await fetch("/auth");
    const responseFromServer = await res.json();
    const { isAuthenticated, token } = responseFromServer;
    if (isAuthenticated) {
      const user = parseJwt(token);
      return { ...responseFromServer, user };
    }
    console.log(responseFromServer);
    return responseFromServer;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ isLoading: true });

  useEffect(() => {
    fetchAuthStatus()
      .then((response) => setAuthState(response))
      .catch((error) => setAuthState(error));
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
