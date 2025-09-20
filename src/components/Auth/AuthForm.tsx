import { useState } from "react";
import * as React from "react";
import { login, register } from "../../services/auth.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
  mode: "register" | "login";
};

type LoginForm = {
  email: string;
  password: string;
};

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

type FormType = LoginForm | RegisterForm;

function AuthForm({ mode }: AuthFormProps) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormType>(
    mode === "register"
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" },
  );

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "login") {
      await login(formData, setUser);
    } else if (mode === "register") {
      await register(formData as RegisterForm, navigate);
    }
  };

  return (
    <div className="w-fit">
      <form onSubmit={submitForm}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">
            {mode === "login" ? "Login" : "Register"}
          </legend>

          {mode === "register" && (
            <>
              <label className="label">Name</label>
              <input
                type="text"
                placeholder="Name"
                className="input"
                required={true}
                value={(formData as RegisterForm).name}
                onChange={(e) =>
                  setFormData({
                    ...(formData as RegisterForm),
                    name: e.target.value,
                  })
                }
              />
            </>
          )}

          <label className="label">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            required={true}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <label className="label">Password</label>
          <input
            type="password"
            required
            className="input"
            minLength={5}
            maxLength={50}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <div className="flex flex-row items-center mt-4 justify-between gap-4">
            {mode === "register" ? (
              <>
                <button type="submit" className="btn btn-neutral ">
                  Register
                </button>
                <span>
                  Already have an account?{" "}
                  <a href="/login" className="underline">
                    Log in
                  </a>
                </span>
              </>
            ) : (
              <>
                <button type="submit" className="btn btn-neutral ">
                  Login
                </button>
                <span>
                  Don't have an account?{" "}
                  <a href="/register" className="underline">
                    Register
                  </a>
                </span>
              </>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default AuthForm;
