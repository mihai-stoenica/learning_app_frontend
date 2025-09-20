import AuthForm from "../../components/Auth/AuthForm.tsx";

const Login = () => {
  return (
    <div className="flex flex-col items-center">
      <AuthForm mode="login" />
    </div>
  );
};

export default Login;
