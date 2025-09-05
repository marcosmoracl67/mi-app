// src/auth/CodeVerification.jsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Titulo from "../components/Titulo";
import Parrafo from "../components/Parrafo";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import Loader from '../components/Loader'; // <<< 1. Importar Loader
import { API_BASE_URL } from '../config.js';

const CodeVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300);
  const [expired, setExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Ya teníamos este estado
  const inputsRef = [useRef(), useRef(), useRef(), useRef()];

  const username = location.state?.username;

  useEffect(() => {
      if (!username) {
          console.error("CodeVerification: No se recibió username. Redirigiendo.");
          navigate('/recuperar/inicio', { replace: true });
      }
  }, [username, navigate]);

  useEffect(() => {
    if (timer <= 0) {
      setExpired(true);
      if (!message.includes('expirado')) { // Evita sobreescribir si ya hay error
          setMessage("El código de verificación ha expirado.");
      }
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, message]); // Añadir message para evitar sobreescribir error

  const handleChange = (e, index) => {
    // Deshabilitar cambio si está cargando
    if (isLoading) return;
    const value = e.target.value.replace(/\D/, "");
    if (value.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);
      if (value && index < 3) {
        inputsRef[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Deshabilitar navegación por teclado si está cargando
    if (isLoading) return;
    if (e.key === "Backspace" && digits[index] === "" && index > 0) {
      inputsRef[index - 1].current.focus();
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const code = digits.join("");
  if (code.length !== 4) {
    setMessage("Por favor, completa los 4 dígitos del código.");
    return;
  }
  // *** Asegúrate que 'username' aquí tenga valor ***
  console.log(`CodeVerification: handleSubmit iniciado con username: ${username}`); // Log inicial
  if (!username || isLoading) return;

  setMessage('');
  setIsLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/api/users/password-reset/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.msg || "Código incorrecto o la sesión ha expirado.");
      setDigits(["", "", "", ""]);
      inputsRef[0].current.focus();
      setIsLoading(false);
      return;
    }

    // Éxito:
    console.log("CodeVerification success:", data);

    // --- Log DETALLADO antes de navegar ---
    const stateToPass = { username: username };
    console.log('CodeVerification: >>> Preparando para navegar a /recuperar/nueva con state:', JSON.stringify(stateToPass));
    // --- Fin Log DETALLADO ---

    navigate("/recuperar/nueva", { state: stateToPass }); // Usar el objeto stateToPass

  } catch (error) {
    console.error("Error en fetch CodeVerification:", error);
    setMessage("Error de conexión al verificar el código.");
  } finally {
      setIsLoading(false);
  }
};

/*   const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 4) {
      setMessage("Por favor, completa los 4 dígitos del código.");
      return;
    }
    if (!username || isLoading) return; // Validar username y evitar doble submit

    setMessage('');
    setIsLoading(true); // <<< 2. Iniciar carga

    try {
      const res = await fetch("http://localhost:3000/api/users/password-reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, code }),
      });

      const data = await res.json();
      // NO poner setIsLoading(false) aquí

      if (!res.ok) {
        setMessage(data.msg || "Código incorrecto o la sesión ha expirado.");
        setDigits(["", "", "", ""]);
        inputsRef[0].current.focus();
        setIsLoading(false); // <<< Detener en error
        return;
      }

      // Éxito: setIsLoading(false) se hará en finally
      console.log("CodeVerification success:", data);
      navigate("/recuperar/nueva", { state: { username: username } });

    } catch (error) {
      console.error("Error en fetch CodeVerification:", error);
      setMessage("Error de conexión al verificar el código.");
      // setIsLoading(false) se hará en finally
    } finally {
        setIsLoading(false); // <<< 3. Finalizar carga SIEMPRE
    }
  }; */

  const handleStartOver = () => {
      // No permitir si está cargando
      if (isLoading) return;
      setMessage("Redirigiendo para iniciar el proceso de nuevo...");
      setTimeout(() => navigate('/recuperar/inicio', { replace: true }), 1500);
  };

  const formatTime = () => {
    const min = String(Math.floor(timer / 60)).padStart(2, "0");
    const sec = String(timer % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (!username) {
     return <div className="form-page centered"><Parrafo>Cargando...</Parrafo></div>;
  }

  return (
    <div className="form-page centered">
      <Container background="var(--background2)" maxWidth="50rem" padding="2rem 3rem" textAlign="center">
        <Titulo size="1.8rem" color="var(--primary)" align="center" weight="600" uppercase marginBottom="1rem">
          Verifica Tu Código
        </Titulo>

        {!expired ? (
          <>
            <Parrafo size="1.1rem" align="center" margin="0 0 1rem">
              Ingresa el código de 4 dígitos enviado a tu correo o celular para el usuario: <strong>{username}</strong>.
            </Parrafo>
            <Parrafo size="1.3rem" align="center" margin="0.5rem 0 2rem" weight="500">
              Tiempo restante: <strong style={{ color: timer < 60 ? 'var(--warning)' : 'var(--text-color)'}}>{formatTime()}</strong>
            </Parrafo>

            <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}>
                {digits.map((digit, index) => (
                  <FormInput
                    key={index}
                    name={`digit-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    ref={inputsRef[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    required
                    disabled={isLoading} // <<< 4. Deshabilitar inputs
                    style={{
                      width: "60px",
                      height: "60px",
                      textAlign: "center",
                      fontSize: "2rem",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      border: message.includes('incorrecto') ? '2px solid var(--danger)' : '1px solid var(--border-color)',
                      padding: '0.5rem',
                      opacity: isLoading ? 0.6 : 1 // <<< 4. Estilo visual disabled
                    }}
                  />
                ))}
              </div>

              {/* --- 5. Renderizado Condicional: Botón O Loader --- */}
               <div style={{ minHeight: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                   {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Loader size="medium" />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verificando...</span>
                        </div>
                    ) : (
                        <FormButton
                            type="submit"
                            label="Verificar Código"
                            size="large"
                            variant="success"
                            disabled={digits.join('').length !== 4} // Deshabilitar si no están los 4 dígitos
                            style={{ padding: '0.8rem 2.5rem', minWidth: '180px' }}
                        />
                    )}
               </div>
            </form>
          </>
        ) : (
          <>
            <Parrafo size="1.2rem" color="var(--danger)" align="center" margin="2rem 0 1.5rem">
              El código de verificación ha expirado.
            </Parrafo>
            <FormButton
              label="Solicitar Nuevo Código"
              onClick={handleStartOver}
              size="large"
              variant="outline"
              disabled={isLoading} // También deshabilita este si hay una carga en curso (poco probable aquí)
              style={{ padding: '0.8rem 2rem' }}
            />
          </>
        )}

        {message && !expired && (
          <Parrafo size="1rem" color={message.includes('incorrecto') || message.includes('Error') || message.includes('expirado') ? 'var(--danger)' : 'var(--info)'} align="center" margin="2rem 0 0" weight="500">
            {message}
          </Parrafo>
        )}

         {!expired && (
             <Parrafo align="center" margin="2rem 0 0">
                <a href="/recuperar/inicio" style={{ color: 'var(--link-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Volver a ingresar usuario/email</a>
            </Parrafo>
         )}

      </Container>
    </div>
  );
};

export default CodeVerification;