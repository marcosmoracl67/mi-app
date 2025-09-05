// src/index.js (FRONTEND)
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import axios from 'axios'; // <--- Importar Axios aquí

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);