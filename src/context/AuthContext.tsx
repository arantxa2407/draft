import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

type AuthContextType = {
  session: any | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  setSession: (session: any | null) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const data = await authService.verify();
      setSession(data.user);
    } catch (error) {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { session, isLoading, checkSession, setSession } },
    children,
  );
};
