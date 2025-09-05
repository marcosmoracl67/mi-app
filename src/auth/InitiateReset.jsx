// src/auth/InitiateReset.jsx
import { useState } from 'react'; // <<< Asegúrate que useState esté importado
import { useNavigate } from 'react-router-dom'; // <<< Asegúrate que useNavigate esté importado
import Container from "../components/Container";
import Titulo from "../components/Titulo";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import Parrafo from "../components/Parrafo";
import Loader from '../components/Loader';
import { API_BASE_URL } from '../config.js';

const InitiateReset = () => {
    // --- Declaraciones de Estado y Navegación (Las que faltaban) ---
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // --- Fin Declaraciones ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setMessage('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/password-reset/request`, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ username: identifier, action: 'find_methods' }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setMessage(data.msg || `Error: No se pudo procesar la solicitud.`);
                // setIsLoading(false) se hará en finally
                return; // Detener si hay error
            }
            // Éxito: setIsLoading(false) se hará en finally
            console.log("InitiateReset success:", data);
            navigate('/recuperar/elegir-metodo', {
                state: {
                    resetToken: data.resetToken,
                    methods: data.methods
                }
            });

        } catch (error) {
            console.error("Error en fetch InitiateReset:", error);
            setMessage("Error de conexión al servidor. Inténtalo de nuevo más tarde.");
            // setIsLoading(false) se hará en finally
        } finally {
             setIsLoading(false); // Asegura desactivar la carga
        }
    };

    return (
        <div className="form-page centered">
            <Container background="var(--background2)" maxWidth="45rem" padding="2rem 3rem">
                 <Titulo size="1.8rem" color="var(--primary)" align="center" weight="600" uppercase marginBottom="1rem">
                    Recuperar Contraseña
                </Titulo>
                <Parrafo align="center" margin="0 0 2rem" size="1.1rem">
                    Ingresa tu nombre de usuario o correo electrónico registrado. Te mostraremos las opciones para enviarte un código de verificación.
                </Parrafo>

                <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                    <FormInput
                        label="Usuario o Correo Electrónico"
                        type="text"
                        name="identifier"
                        placeholder="Escribe tu usuario o email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={isLoading} // Deshabilitar input
                        style={{
                            maxWidth: '30rem',
                            margin: '0 auto 1.5rem auto',
                            display: 'block',
                            fontSize: '1.1rem',
                            padding: '0.8rem 1rem'
                         }}
                    />

                    {/* Contenedor para mantener espacio vertical */}
                    <div style={{ minHeight: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
                        {isLoading ? (
                            // Muestra Loader y texto cuando carga
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Loader size="medium" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Buscando cuenta...</span>
                            </div>
                        ) : (
                            // Muestra Botón normal cuando no carga
                            <FormButton
                                type="submit"
                                label="Buscar Cuenta"
                                variant="primary"
                                size="large"
                                disabled={!identifier} // Deshabilitar si no hay input
                                style={{ padding: '0.8rem 2.5rem', minWidth: '150px' }}
                            />
                        )}
                    </div>
                </form>

                {/* Mensajes */}
                {message && (
                    <Parrafo
                        color={message.toLowerCase().includes('error') ? 'var(--danger)' : 'var(--text-secondary)'}
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
                    <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Volver al Inicio de Sesión</a>
                </Parrafo>

            </Container>
        </div>
    );
};

export default InitiateReset;
