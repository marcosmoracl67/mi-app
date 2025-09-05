import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config.js';

const PasswordResetStart = () => {
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const username = sessionStorage.getItem("lastFailedUsername");

  useEffect(() => {
    const startReset = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/password-reset/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!res.ok) throw new Error("No se pudo iniciar el proceso de recuperación.");
        setStatus("success");

        setTimeout(() => {
          navigate("/recuperar/verificar");
        }, 2000);
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    if (username) startReset();
    else {
      setError("No se encontró un nombre de usuario.");
      setStatus("error");
    }
  }, [navigate, username]);

  return (
    <div className="recovery-container">
      {status === "pending" && <p>Enviando código de recuperación...</p>}
      {status === "success" && <p>Revisa tu correo y celular. Te redireccionaremos...</p>}
      {status === "error" && (
        <>
          <p>Error: {error}</p>
          <a href="/login">Volver al login</a>
        </>
      )}
    </div>
  );
};

export default PasswordResetStart;
