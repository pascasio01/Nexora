import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getMe, login as loginRequest, logout as logoutRequest, register as registerRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nexora_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("nexora_token"))
      .finally(() => setLoading(false));
  }, []);

  const saveTokenAndLoad = async (accessToken) => {
    localStorage.setItem("nexora_token", accessToken);
    const me = await getMe();
    setUser(me);
  };

  const login = async (payload) => {
    const tokenData = await loginRequest(payload);
    await saveTokenAndLoad(tokenData.access_token);
  };

  const register = async (payload) => {
    const tokenData = await registerRequest(payload);
    await saveTokenAndLoad(tokenData.access_token);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // noop
    }
    localStorage.removeItem("nexora_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
