// src/components/Sidebar.jsx
import { useEffect, useState } from 'react'; // Import React explícitamente
import { useNavigate, useLocation } from "react-router-dom";
// --- Importa TODO el set de Font Awesome y un icono por defecto ---
import * as FaIcons from "react-icons/fa";
// --- Fin Importación ---
import UserCard from "./UserCard";
import { useAuth } from "../auth/AuthContext";

// --- Componente Helper para renderizar el icono dinámicamente ---
/* const IconComponent = ({ iconName }) => {
  // iconName es el string del backend, ej: "FaBuilding"
  const Icon = FaIcons[iconName]; // Intenta acceder al componente usando el nombre

  if (Icon) {
    // Si se encuentra el icono en FaIcons, renderízalo
    return <Icon size="1.2em" aria-hidden="true" />;
  } else {
    // Si no se encuentra (nombre incorrecto o no existe en 'fa'),
    // renderiza un icono por defecto y muestra advertencia en consola.
    // Puedes cambiar FaQuestionCircle por otro icono de FaIcons si prefieres.
    console.warn(`Icono "${iconName}" no encontrado en react-icons/fa. Usando FaQuestionCircle.`);
    return <FaIcons.FaQuestionCircle size="1.2em" aria-hidden="true" />;
  }
};
// --- Fin Componente Helper --- */

const IconComponent = ({ iconName }) => {
  const safeIconName = iconName || "FaQuestionCircle"; // ✅ Línea agregada
  const Icon = FaIcons[safeIconName]; // 👈 Usa el nombre seguro

  if (Icon) {
    return <Icon size="1.2em" aria-hidden="true" />;
  } else {
    console.warn(`Icono "${iconName}" no encontrado en react-icons/fa. Usando FaQuestionCircle.`);
    return <FaIcons.FaQuestionCircle size="1.2em" aria-hidden="true" />;
  }
};


function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { menuItems, user } = useAuth(); // menuItems viene del contexto
  const [currentOptionId, setCurrentOptionId] = useState(null);

  // useEffect para encontrar item actual (Sin cambios)
  useEffect(() => {
    const currentPath = location.pathname;
    // Búsqueda un poco más robusta: exacta o prefijo para subrutas
    const currentItem = menuItems.find(item => item.path && (currentPath === item.path || currentPath.startsWith(item.path + '/')));
    if (currentItem) {
      setCurrentOptionId(currentItem.opcion_id);
    } else {
        setCurrentOptionId(null); // Resetear si no hay coincidencia
    }
  }, [location.pathname, menuItems]);


  // useEffect para registrar acceso (Sin cambios)
  useEffect(() => {
    if (user && currentOptionId) {
      // console.log(`Registrando acceso para user ${user.usuario_id} a opcion ${currentOptionId}`);
      fetch("http://localhost:3000/api/log-acceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include', // Si es necesario
        body: JSON.stringify({
          usuario_id: user.usuario_id,
          opcion_id: currentOptionId
        })
      })
      .then(res => { if (!res.ok) console.error("Error respuesta log-acceso:", res.status);})
      .catch((err) => console.error("Error al registrar acceso:", err));
    }
  }, [currentOptionId, user]);

  // handleNavigate (Sin cambios)
  const handleNavigate = (path) => {
    if(path){
        navigate(path);
        setOpen(false); // Oculta el sidebar después de navegar
    } else {
        console.warn("Intento de navegar a una ruta inválida desde el menú.");
    }
  };

  return (
    <>
      {/* Botón Hamburguesa */}
      <div className="hamburger-button">
        {/* Usa el icono importado dinámicamente */}
        <button onClick={() => setOpen(!open)} className="hamburger-icon" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
          <FaIcons.FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : "collapsed"}`}>
        <nav aria-label="Menú principal"> {/* Envolver en nav */}
            <ul className="sidebar-list">
            {menuItems && menuItems.length > 0 ? (
                menuItems.map((item) => (
                    <li
                        // --- Usar opcion_id si existe y es único, sino text como fallback ---
                        key={item.opcion_id || item.text}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        // --- Solo añadir onClick si hay una ruta válida ---
                        onClick={item.path ? () => handleNavigate(item.path) : undefined}
                        style={{ cursor: item.path ? 'pointer' : 'default' }}
                        role="menuitem" // Mejorar semántica
                    >
                        <span className="sidebar-icon">
                            {/* --- Renderizar icono dinámicamente --- */}
                            {/* Asume que item.icon contiene el string "FaBuilding", etc. */}
                            <IconComponent iconName={item.icon} />
                        </span>
                        <span className="sidebar-text">{item.text}</span>
                    </li>
                ))
            ) : (
                // Mensaje si no hay items
                <li className="sidebar-item-disabled">
                    {user ? "No hay opciones disponibles." : "Cargando menú..."}
                </li>
            )}
            </ul>
        </nav>
        <UserCard />
      </div>
    </>
  );
}

export default Sidebar;