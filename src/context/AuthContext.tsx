import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { homeService } from "../services/homeService";

type AuthContextType = {
  session: any | null;
  isLoading: boolean;
  hasHome: boolean;
  setHasHome: (hasHome: boolean) => void;
  checkSession: () => Promise<void>;
  setSession: (session: any | null) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHome, setHasHome] = useState(false);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const data = await authService.verify();
      setSession(data.user);

      try {
        const homeData = await homeService.syncHome();
        setHasHome(homeData.home_active);
      } catch (homeError) {
        setHasHome(false);
      }
    } catch (error) {
      setSession(null);
      setHasHome(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        session,
        isLoading,
        hasHome,
        setHasHome,
        checkSession,
        setSession,
      },
    },
    children,
  );
};
