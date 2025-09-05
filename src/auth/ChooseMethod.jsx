// src/auth/ChooseMethod.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from "../components/Container";
import Titulo from "../components/Titulo";
import FormButton from "../components/FormButton";
import Parrafo from "../components/Parrafo";
import Loader from '../components/Loader'; 
import { API_BASE_URL } from '../config.js';

const ChooseMethod = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [chosenMethod, setChosenMethod] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Ya tenemos el estado

    const resetToken = location.state?.resetToken;
    const methods = location.state?.methods;

    useEffect(() => {
        if (!resetToken || !methods || (!methods.email && !methods.sms)) {
            console.error("ChooseMethod: Faltan datos requeridos. Redirigiendo.");
            navigate('/recuperar/inicio', { replace: true });
            return;
        }
        if (methods.email && !methods.sms) setChosenMethod('email');
        else if (!methods.email && methods.sms) setChosenMethod('sms');
    }, [resetToken, methods, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!chosenMethod) {
            setMessage("Por favor, selecciona un método.");
            return;
        }
        if (isLoading) return; // Evitar doble submit
        setMessage('');
        setIsLoading(true); // <<< 2. Iniciar carga

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/password-reset/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resetToken: resetToken,
                    action: 'send_code',
                    chosenMethod: chosenMethod
                }),
            });

            const data = await res.json();
            // NO poner setIsLoading(false) aquí todavía

            if (!res.ok || !data.success) {
                setMessage(data.msg || `Error al enviar el código.`);
                setIsLoading(false); // <<< Detener en error
                return;
            }

            // Éxito: setIsLoading(false) se hará en finally
            console.log("ChooseMethod success:", data);
            navigate('/recuperar/verificar', {
                state: { username: data.username }
            });

        } catch (error) {
            console.error("Error en fetch ChooseMethod:", error);
            setMessage("Error de conexión al enviar el código.");
            // setIsLoading(false) se hará en finally
        } finally {
            setIsLoading(false); // <<< 3. Finalizar carga SIEMPRE
        }
    };

    if (!methods || !resetToken) {
        return <div className="form-page centered"><Parrafo>Cargando...</Parrafo></div>;
    }

    return (
        <div className="form-page centered">
            <Container background="var(--background2)" maxWidth="50rem" padding="2rem 3rem">
                <Titulo size="1.8rem" color="var(--primary)" align="center" weight="600" uppercase marginBottom="1rem">
                    Elige Dónde Recibir el Código
                </Titulo>
                <Parrafo align="center" margin="0 0 2.5rem" size="1.1rem">
                    Te enviaremos un código de verificación de 4 dígitos. Por favor, selecciona cómo prefieres recibirlo:
                </Parrafo>

                <form onSubmit={handleSubmit} style={{ maxWidth: '35rem', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem', fontSize: '1.1rem', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px' }}>
                        {methods.email && (
                            <div style={{ marginBottom: methods.sms ? '1.5rem' : '0' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: isLoading ? 'default': 'pointer', padding: '0.5rem', opacity: isLoading ? 0.6 : 1 }}> {/* 4. Estilo disabled */}
                                    <input
                                        type="radio"
                                        name="recoveryMethod"
                                        value="email"
                                        checked={chosenMethod === 'email'}
                                        onChange={(e) => setChosenMethod(e.target.value)}
                                        disabled={isLoading} // <<< 4. Deshabilitar radio
                                        style={{ marginRight: '1rem', transform: 'scale(1.3)' }}
                                    />
                                    <span>Enviar a Correo: <strong style={{ color: 'var(--text-color)', marginLeft: '0.5rem' }}>{methods.email}</strong></span>
                                </label>
                            </div>
                        )}
                        {methods.sms && (
                             <div>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: isLoading ? 'default': 'pointer', padding: '0.5rem', opacity: isLoading ? 0.6 : 1 }}> {/* 4. Estilo disabled */}
                                    <input
                                        type="radio"
                                        name="recoveryMethod"
                                        value="sms"
                                        checked={chosenMethod === 'sms'}
                                        onChange={(e) => setChosenMethod(e.target.value)}
                                        disabled={isLoading} // <<< 4. Deshabilitar radio
                                        style={{ marginRight: '1rem', transform: 'scale(1.3)' }}
                                    />
                                     <span>Enviar a Celular: <strong style={{ color: 'var(--text-color)', marginLeft: '0.5rem' }}>{methods.sms}</strong></span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* --- 5. Renderizado Condicional: Botón O Loader --- */}
                    <div style={{ minHeight: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                         {isLoading ? (
                            // Muestra Loader y texto cuando carga
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Loader size="medium" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enviando código...</span>
                            </div>
                        ) : (
                            // Muestra Botón normal cuando no carga
                            <FormButton
                                type="submit"
                                label="Enviar Código"
                                variant="success"
                                size="large"
                                disabled={!chosenMethod} // Deshabilitar si no se ha elegido método
                                style={{ padding: '0.8rem 2.5rem', minWidth: '180px' }}
                            />
                        )}
                    </div>
                </form>

                {/* Mensajes */}
                {message && (
                    <Parrafo
                        color="var(--danger)" // Asumiendo que message solo se usa para errores aquí
                        align="center"
                        margin="2rem 0 0"
                        size="1rem"
                        weight="500"
                    >
                        {message}
                    </Parrafo>
                )}

                 {/* Enlace volver */}
                 <Parrafo align="center" margin="2rem 0 0">
                    <a href="/recuperar/inicio" style={{ color: 'var(--link-color)', textDecoration: 'none' }}>Elegir otro usuario/email</a>
                </Parrafo>
            </Container>
        </div>
    );
};

export default ChooseMethod;