import { useState } from "react";
import type { ReactNode } from "react";
import { login, logout, verify2FA } from "../api/authService";
import { AuthContext } from "./AuthContextDef";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken"),
  );

  const handleLogin = async (email: string, password: string) => {
    const data = await login(email, password);
    if (!data?.twoFactorRequired) {
      setIsLoggedIn(true);
    }
    return data;
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  const handleVerifyTwoFactor = async (code: string) => {
    await verify2FA(code);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, handleLogin, handleLogout, handleVerifyTwoFactor }}
    >
      {children}
    </AuthContext.Provider>
  );
};
