import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
type User = { name: string; email: string } | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
