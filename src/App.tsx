import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}
export default App;
