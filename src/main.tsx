import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout.tsx";
import { LoaderProvider } from "./contexts/LoaderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <LoaderProvider>
            <App />
          </LoaderProvider>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
