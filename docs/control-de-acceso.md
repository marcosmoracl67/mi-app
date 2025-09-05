# 📘 Documentación del Flujo de Control de Acceso

## Índice

1. [Resumen del Flujo de Acceso](#1-resumen-del-flujo-de-acceso)
2. [Componentes Clave](#2-componentes-clave)
3. [Inicio de Sesión (Login)](#3-inicio-de-sesion-login)
4. [Contexto de Autenticación (AuthContext)](#4-contexto-de-autenticacion-authcontext)
5. [Protección de Rutas (PrivateRoute)](#5-proteccion-de-rutas-private-route)
6. [Recuperación de Contraseña (Multi-paso con Selección de Método)](#6-recuperacion-de-contrasena-multi-paso-con-seleccion-de-metodo)
7. [Cierre de Sesión y Limpieza](#7-cierre-de-sesion-y-limpieza)
8. [Consideraciones de Seguridad](#8-consideraciones-de-seguridad)
9. [Diagrama de Flujo](#9-diagrama-de-flujo)


## 1. Resumen del Flujo de Acceso

El sistema de control de acceso de la aplicación está diseñado para garantizar una autenticación segura y una experiencia de usuario fluida. Incluye:

- Inicio de sesión con validación de credenciales (argon2).
- Autenticación mediante tokens JWT seguros almacenados en cookies HttpOnly.
- Gestión centralizada del estado de sesión y permisos de menú utilizando AuthContext.
- Protección de rutas (PrivateRoute) para restringir el acceso a áreas privadas basado en el estado de autenticación.
- Flujo de recuperación de contraseña multi-paso que permite al usuario elegir el método (Email/SMS - SMS pendiente de activación completa) para recibir un código de verificación temporal.
- Cierre de sesión seguro con limpieza de estado local, cookies y almacenamiento. 

## 2. Componentes Clave

- LoginForm.jsx: Formulario de inicio de sesión.
- AuthContext.jsx: Contexto global para la gestión del estado de autenticación (user), permisos (menuItems), estado de carga (isLoading) y funciones (login, logout, fetchUser).
- PrivateRoute.jsx: Componente HOC para proteger rutas que requieren autenticación.
- InitiateReset.jsx: (Nuevo) Formulario inicial donde el usuario ingresa su identificador (username/email) para comenzar la recuperación.
- ChooseMethod.jsx: (Nuevo) Componente donde el usuario selecciona el método (Email o SMS enmascarado) para recibir el código de verificación.
- CodeVerification.jsx: (Modificado) Componente donde el usuario ingresa el código de 4 dígitos recibido. Ahora recibe el username a través del estado de navegación.
- PasswordResetForm.jsx: (Modificado) Componente donde el usuario establece la nueva contraseña. Ahora recibe el username a través del estado de navegación y usa logout del contexto para limpiar la sesión al finalizar. 

## 3.  Inicio de Sesión (Login)

El usuario ingresa username y password. El componente LoginForm llama a la función login del AuthContext.

    // LoginForm.jsx (simplificado)
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await login(values.username, values.password);
      if (!result.success) {
        // Fallo: Guarda el username para iniciar recuperación si el usuario lo desea
        sessionStorage.setItem("lastFailedUsernameForRecoveryStart", values.username); // Propósito específico
        // Muestra modal de error con enlace a /recuperar/inicio
      }
      // Si success es true, la redirección es manejada por el cambio de estado en AuthContext/PrivateRoute
    };

## 4. Contexto de Autenticación (AuthContext)

Centraliza el estado del usuario (user), los ítems del menú (menuItems) y el estado de carga (isLoading).

    // AuthContext.jsx (extracto de login y fetchUser)
    const login = async (username, password) => {
      const res = await fetch("/api/users/login", { credentials: 'include', ... });
      if (res.ok) {
        await fetchUser(); // Llama a fetchUser para obtener perfil Y menú
        return { success: true };
      }
      return { success: false, /* ... */ };
    };

    const fetchUser = async () => {
      // ... (manejo de isLoading)
      try {
        // 1. Fetch /api/users/me (con credentials: 'include')
        // 2. Si OK -> setUser(userData)
        // 3. Si userData.usuario_id existe:
        //      Fetch /api/acceso/${userData.usuario_id} (con credentials: 'include')
        //      Si OK -> setMenuItems(menuData)
        //      Si Error Menú -> setMenuItems([])
        // ... (manejo de errores)
      } finally {
        // setIsLoading(false)
      }
    };

## 5. Protección de Rutas (PrivateRoute)

Verifica user e isLoading del AuthContext para permitir o redirigir.

    // PrivateRoute.jsx (simplificado)
    const PrivateRoute = ({ children }) => {
      const { user, isLoading } = useAuth();

      if (isLoading) {
        return <div>Cargando...</div>; // O un spinner
      }

      return user ? children : <Navigate to="/login" replace />; // replace es importante
    };


## 6. Recuperación de Contraseña (Multi-paso con Selección de Método)

Este flujo permite al usuario restablecer su contraseña de forma segura eligiendo cómo recibir el código.

1. Inicio (/recuperar/inicio - InitiateReset.jsx):
  - Usuario ingresa su username o email.
  - Frontend llama a POST /api/users/password-reset/request con { action: 'find_methods', username: identifier }.
  - Backend busca el usuario, verifica métodos (email, celular), genera un token JWT temporal (resetToken), y responde con { success: true, resetToken, methods: { email?, sms? } } (métodos enmascarados).
2. Elegir Método (/recuperar/elegir-metodo - ChooseMethod.jsx):
  - Frontend recibe resetToken y methods vía estado de navegación.
  - Muestra las opciones enmascaradas (Email/SMS).
  - Usuario selecciona una opción (chosenMethod).
  - Frontend llama a POST /api/users/password-reset/request con { action: 'send_code', resetToken, chosenMethod }.
  - Backend valida resetToken, recupera userId/username, genera código numérico (4 dígitos), lo almacena temporalmente (asociado a username), y envía el código vía Email (sendEmail) o SMS (sendSms - pendiente activación). Responde con { success: true, username }.
3. Verificar Código (/recuperar/verificar - CodeVerification.jsx):
  - Frontend recibe username vía estado de navegación. Muestra el input de código y un temporizador (ej: 5 min).
  - Usuario ingresa el código recibido.
  - Frontend llama a POST /api/users/password-reset/verify con { username, code }.
  - Backend busca el código almacenado para username, lo compara, y verifica la expiración. Si es válido, marca el intento como verificado internamente. Responde { success: true }.
  - El temporizador en el frontend ayuda a gestionar la expiración del código:

      // CodeVerification.jsx
    useEffect(() => {
      if (timer <= 0) setExpired(true);
      // ... lógica del intervalo ...
    }, [timer]);

4. Establecer Nueva Contraseña (/recuperar/nueva - PasswordResetForm.jsx):
  - Frontend recibe username vía estado de navegación. Muestra el formulario para la nueva contraseña.
  - Usuario ingresa la nueva contraseña.
  - Frontend llama a POST /api/users/password-reset/confirm con { username, newPassword }.
  - Backend verifica si el intento para username fue marcado como verified, hashea la nueva contraseña (argon2), actualiza la base de datos y limpia el estado de reseteo temporal. Responde { success: true }.
5. Limpieza y Redirección:
  - Tras la confirmación exitosa, PasswordResetForm.jsx llama a la función logout() del AuthContext para limpiar el estado local y la cookie de sesión (si existiera alguna).
  - Finalmente, redirige al usuario a /login.

## 7. Cierre de Sesión y Limpieza

- El cierre de sesión es manejado por la función logout en AuthContext. 

    / AuthContext.jsx (extracto de logout)
    const logout = async () => {
      try {
        // Llama a la API para invalidar la cookie HttpOnly en el backend
        await fetch("http://localhost:3000/api/users/logout", {
            method: "POST",
            credentials: "include"
        });
      } catch (error) {
        // Loguear error pero continuar limpieza local
        console.error("Error llamando a API /logout:", error);
      } finally {
        // Limpieza SIEMPRE en el frontend
        setUser(null);
        setMenuItems([]);
        sessionStorage.clear();
        // localStorage.clear(); // Considerar si se usa para otras cosas
      }
    };

- Esta función logout también se llama explícitamente desde PasswordResetForm después de una actualización exitosa de contraseña para asegurar un estado limpio antes de redirigir al login.

## 8. Consideraciones de Seguridad

- Contraseñas siempre hasheadas en la base de datos usando argon2.
- Tokens de sesión (JWT) almacenados en cookies HttpOnly, Secure (en producción), SameSite=Lax.
- Token JWT temporal (resetToken) para el flujo de recuperación con expiración corta (ej: 15 min) para vincular los pasos.
- Código numérico de verificación de corta duración (ej: 5 min) y de un solo uso efectivo.
- No revelar explícitamente si un usuario/email existe durante el inicio de la recuperación (responder con mensajes genéricos).
- Rate Limiting: Es crucial implementar limitación de intentos en los endpoints de recuperación (/request, /verify) para prevenir ataques de fuerza bruta y abuso de envío de Email/SMS.
- SMS: Proteger las credenciales del proveedor SMS (Twilio). Estar consciente de los costos. Funcionalidad SMS pendiente de activación completa.
- Validación de entradas en frontend y backend.
- Uso de PrivateRoute para proteger el acceso a componentes/datos sensibles.

## 9. Diagrama de Flujo

![Diagrama de flujo de acceso](img/Control%20de%20Acceso.png)


