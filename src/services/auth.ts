import { post } from "./http.ts";
import { useNavigate } from "react-router-dom";
type LoginType = {
  email: string;
  password: string;
};

type RegisterType = {
  name: string;
  email: string;
  password: string;
};

const API_URL = import.meta.env.VITE_API_URL;
export const login = async (
  credentials: LoginType,
  setUser: (user: { name: string; email: string }) => void,
) => {
  const res = await post(`${API_URL}/login_check`, credentials);

  let data, errorMessage;

  if (!res.isError) {
    data = res.data;
    sessionStorage.setItem("token", data.token);
    setUser({
      name: data.name,
      email: data.email,
    });
  } else {
    errorMessage = res.message;

    alert(errorMessage); //TODO add a toast for messages
  }
};

export const logout = (
  setUser: (user: { name: string; email: string } | null) => void,
) => {
  setUser(null);
  sessionStorage.removeItem("token");
};

export const register = async (
  credentials: RegisterType,
  navigate: ReturnType<typeof useNavigate>,
) => {
  const res = await post(`${API_URL}/register`, credentials);

  let errorMessage;

  if (!res.isError) {
    navigate("/login");
  } else {
    errorMessage = res.message;
    alert(errorMessage); //TODO add a toast for messages
  }
};
