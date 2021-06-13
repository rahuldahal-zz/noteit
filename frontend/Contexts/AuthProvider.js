import React, { createContext, useEffect, useState } from "react";
import parseJwt from "@utils/parseJWT";
import Loader from "@components/Loader";

const AuthContext = createContext(null);

async function fetchAuthStatus() {
  try {
    const res = await fetch("/auth");
    const responseFromServer = await res.json();
    const { isAuthenticated, accessToken } = responseFromServer;
    if (isAuthenticated) {
      const user = parseJwt(accessToken);
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
    if (authState.isLoading) {
      fetchAuthStatus()
        .then((response) => setAuthState(response))
        .catch((error) => setAuthState(error));
    }
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {authState.isLoading ? <Loader /> : children}
    </AuthContext.Provider>
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
