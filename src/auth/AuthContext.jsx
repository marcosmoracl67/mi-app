// --- START OF FILE AuthContext.jsx ---

import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../config.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // Estado para los ítems del menú
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(); // Intenta cargar usuario y menú al inicio
  }, []);

  // Función principal para obtener datos del usuario autenticado Y su menú
  const fetchUser = async () => {
    // console.log("AuthContext: Iniciando fetchUser (usuario y menú)...");
    setIsLoading(true);
    setUser(null);       // Limpia estado previo de usuario
    setMenuItems([]);    // Limpia estado previo de menú

    try {
      // --- PASO 1: Obtener datos del usuario ---
      // console.log("AuthContext: Fetching /api/users/me...");
      const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include", // Envía la cookie de sesión
        method: "GET",
      });

      // console.log(`AuthContext: Respuesta de /api/users/me - Status: ${userRes.status}`);

      if (!userRes.ok) {
        // Si falla obtener el usuario, no podemos continuar
        const errorBody = await userRes.text();
        console.error(`AuthContext: fetchUser (usuario) falló con status ${userRes.status}. Body: ${errorBody}`);
        throw new Error(`Usuario no autenticado (status ${userRes.status})`);
      }

      const userData = await userRes.json();
      setUser(userData); // Actualiza el estado del usuario

      // --- PASO 2: Obtener menú SI tenemos ID de usuario ---
      if (userData && userData.usuario_id) {
        try {
          const menuRes = await fetch(`${API_BASE_URL}/api/acceso/${userData.usuario_id}`, {
              credentials: "include", // ¡También necesita la cookie!
              method: "GET",
          });

          if (!menuRes.ok) {
            // Error al obtener el menú, pero el usuario SÍ está autenticado
            const menuErrorBody = await menuRes.text();
            console.error(`AuthContext: fetchUser (menú) falló con status ${menuRes.status}. Body: ${menuErrorBody}`);
            // No desloguear, solo dejar menú vacío
            setMenuItems([]);
          } else {
            // Menú obtenido correctamente
            const menuData = await menuRes.json();
            // console.log("AuthContext: Datos de menú recibidos:", menuData);
            // AQUÍ ASUMIMOS QUE menuData ES EL ARRAY DIRECTAMENTE
            // Si la API devuelve { items: [...] } u otro formato, ajusta aquí:
            // setMenuItems(menuData.items || []);
            setMenuItems(menuData); // Actualiza el estado del menú
          }

        } catch (menuFetchError) {
            // Error de red al intentar obtener el menú
            console.error(`AuthContext: Error en fetch a /api/acceso/${userData.usuario_id}:`, menuFetchError);
            setMenuItems([]); // Dejar menú vacío en caso de error de red
        }
      } else {
        // No se encontró usuario_id en la respuesta de /me
        console.warn("AuthContext: No se pudo obtener usuario_id de los datos del usuario. No se puede buscar menú.");
        setMenuItems([]); // Sin ID, no hay menú
      }
      // --- Fin Paso 2 ---

    } catch (userFetchError) {
      // Error al obtener el usuario (Paso 1)
      console.error("AuthContext: Error recuperando usuario (paso 1):", userFetchError.message);
      setUser(null);       // Asegura que user sea null
      setMenuItems([]);    // Asegura que menú sea vacío
      // No es necesario limpiar cookies aquí necesariamente, el próximo intento fallará igual si son inválidas
    } finally {
      setIsLoading(false); // Detener el indicador de carga SIEMPRE
    }
  };

  // --- login ---
  // Llama a la API de login, si tiene éxito, llama a fetchUser para cargar perfil y menú
  const login = async (username, password) => {
    console.log(`AuthContext: Intentando login para ${username}...`);
    setIsLoading(true); // Podrías poner un loading específico para login si quieres
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      // console.log(`AuthContext: Respuesta de /api/users/login - Status: ${res.status}`);

      if (!res.ok) {
        const data = await res.json();
        console.warn(`AuthContext: Login fallido - ${data.msg}`);
        setIsLoading(false); // Detener loading si login falla
        return { success: false, message: data.msg || "Error al iniciar sesión" };
      }

      // Login OK -> El backend puso la cookie -> Llamar a fetchUser
      await fetchUser(); // fetchUser se encarga de setLoading, setUser y setMenuItems
      console.log("AuthContext: Login exitoso, fetchUser llamado.");
      // fetchUser ya puso isLoading a false en su finally
      return { success: true };

    } catch (error) {
      console.error("AuthContext: Error en la función login:", error);
      setIsLoading(false); // Detener loading en caso de error de red en login
      return { success: false, message: error.message || "Error inesperado durante el login" };
    }
  };

  // --- logout ---
  // Llama a la API de logout y limpia el estado local
  const logout = async () => {
    console.log("AuthContext: Ejecutando logout...");
    setIsLoading(true); // Mostrar loading durante el proceso de logout
    try {
        // Llama a la API para que el backend invalide la cookie HttpOnly
        await fetch(`${API_BASE_URL}/api/users/logout`, {
            method: "POST",
            credentials: "include" // Necesario para enviar la cookie a borrar
        });
        // console.log("AuthContext: Llamada a API /logout realizada.");
    } catch (error) {
        console.error("AuthContext: Error llamando a API /logout:", error);
        // Continuar con la limpieza local aunque falle la llamada a la API
    } finally {
        // Limpieza del estado local INDEPENDIENTEMENTE del éxito de la API
        setUser(null);
        setMenuItems([]); // <<<<--- Limpiar menú es crucial aquí
        sessionStorage.clear();
        // localStorage.clear(); // Cuidado si almacenas preferencias no relacionadas a sesión
        console.log("AuthContext: Estado local (user, menuItems) y sessionStorage limpiados.");
        setIsLoading(false); // Terminar loading
        // La redirección a /login ocurrirá automáticamente por PrivateRoute al detectar user=null
    }
  };

  // Proveer el contexto con todos los valores necesarios
  return (
    <AuthContext.Provider value={{ user, login, logout, menuItems, isLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- END OF FILE AuthContext.jsx ---