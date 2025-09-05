// src/auth/PasswordResetForm.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Titulo from "../components/Titulo";
import Parrafo from "../components/Parrafo";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { useAuth } from "../auth/AuthContext";
import Loader from '../components/Loader';
import { API_BASE_URL } from '../config.js';

const PasswordResetForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Ya no necesitamos isRedirecting

  const username = location.state?.username;

  useEffect(() => {
      if (!username) {
          console.error("PasswordResetForm: No se recibió username. Redirigiendo.");
          navigate('/login', { replace: true });
      }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!username || isLoading) return;

    setMessage("");
    setIsLoading(true); // Iniciar carga (¡y mantenerla después del éxito!)

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Error al cambiar contraseña.");
        setIsLoading(false); // <<< Detener carga SOLO en error
        return;
      }

      // --- Éxito ---
      // NO ponemos setIsLoading(false) aquí
      setMessage("¡Contraseña actualizada! Redirigiendo al login..."); // Mensaje más conciso
      console.log("PasswordResetForm: Éxito, iniciando logout y delay.");

      logout();

      setTimeout(() => {
        // setIsLoading(false); // Ya no es necesario aquí tampoco
        navigate("/login", { replace: true });
      }, 2000); // Reducir un poco el delay si se desea (2 seg)

    } catch (error) {
      console.error("Error en fetch PasswordResetForm:", error);
      setMessage("Error inesperado al guardar la contraseña.");
      setIsLoading(false); // <<< Detener carga en catch
    }
    // No hay finally necesario si manejamos isLoading en éxito/error
  };

  if (!username) {
     return <div className="form-page centered"><Parrafo>Cargando...</Parrafo></div>;
  }

  return (
    <div className="form-page centered">
      <Container background="var(--background2)" maxWidth="45rem" padding="2rem 3rem">
        <Titulo size="1.8rem" color="var(--primary)" align="center" weight="600" uppercase marginBottom="1rem">
          Establecer Nueva Contraseña
        </Titulo>
        <Parrafo align="center" margin="0 0 2rem" size="1.1rem">
          Ingresa tu nueva contraseña para la cuenta <strong>{username}</strong>.
        </Parrafo>

        <form onSubmit={handleSubmit} style={{ textAlign: "center", maxWidth: '30rem', margin: '0 auto' }}>
          <FormInput
            label="Nueva Contraseña"
            type="password"
            name="newPassword"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading} // Deshabilitar si está cargando (cubre todo el proceso ahora)
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.1rem",
              padding: '0.8rem 1rem',
              display: 'block',
              width: '100%',
              opacity: isLoading ? 0.6 : 1 // Estilo visual
            }}
          />

          {/* Contenedor para Botón o Loader */}
          <div style={{ minHeight: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
               {isLoading ? (
                    // Muestra Loader y texto asociado mientras isLoading es true
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Loader size="medium" />
                        {/* Cambiar texto según si ya hay mensaje de éxito */}
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {message.includes('actualizada') ? 'Finalizando...' : 'Guardando...'}
                        </span>
                    </div>
                ) : (
                    // Muestra Botón normal cuando no carga
                    <FormButton
                        type="submit"
                        label="Guardar Contraseña"
                        size="large"
                        variant="success"
                        disabled={password.length < 6}
                        style={{ padding: '0.8rem 2.5rem', minWidth: '180px' }}
                    />
                )}
          </div>
        </form>

        {/* Mensaje (Mostrar solo si hay mensaje Y NO está cargando el proceso post-éxito) */}
        {/* O simplemente mostrar siempre el mensaje si existe */}
        {message && (
          <Parrafo
            size="1rem"
            // Mostrar siempre el mensaje, el loader ya indica acción
            color={message.includes('actualizada') ? 'var(--success)' : 'var(--danger)'}
            align="center"
            margin="2rem 0 0"
            weight="500"
          >
           {message}
           {/* Ya no necesitamos el loader extra aquí */}
          </Parrafo>
        )}

        {/* Enlace Cancelar (Mostrar solo si NO está cargando) */}
        {!isLoading && (
             <Parrafo align="center" margin="2rem 0 0">
                <a href="/login" style={{ color: 'var(--link-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Cancelar e ir a Login</a>
            </Parrafo>
         )}
      </Container>
    </div>
  );
};

export default PasswordResetForm;