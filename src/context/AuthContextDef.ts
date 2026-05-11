import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  handleLogin: (
    email: string,
    password: string,
  ) => Promise<{ twoFactorRequired: boolean } | undefined>;
  handleLogout: () => Promise<void>;
  handleVerifyTwoFactor: (code: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
