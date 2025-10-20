import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { setUnauthorizedHandler } from "../services/http";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
type User = { name: string; email: string } | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUserState] = useState<User>(() => {
    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");
    return name && email && token
      ? {
          name,
          email,
        }
      : null;
  });

  const setUser = (user: User) => {
    if (user) {
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("email", user.email);
    } else {
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("email");
    }
    setUserState(user);
  };

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
