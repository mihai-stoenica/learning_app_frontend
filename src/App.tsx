import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Home from "./pages/Home.tsx";
import Course from "./pages/Course.tsx";
function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="" element={<Home />} />
      <Route path="course/:id" element={<Course />} />
    </Routes>
  );
}
export default App;
