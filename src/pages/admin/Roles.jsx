// src/pages/admin/Roles.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
// --- Iconos ---
import { FaPlus, FaSave, FaTrashAlt, FaEllipsisV } from "react-icons/fa"; // <<< AÑADIR FaEllipsisV, FaEdit

// --- Componentes Core ---
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/DataTable";
import Container from "../../components/Container";
import Titulo from "../../components/Titulo";
import DropdownMenu from "../../components/DropdownMenu"; // <<< 1. IMPORTAR DropdownMenu

const Roles = () => {
  // --- Estados (sin cambios) ---
  const [roles, setRoles] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [rolAEliminar, setRolAEliminar] = useState(null);
  const [nuevoRol, setNuevoRol] = useState({ nombre: "" });
  const [loadingStates, setLoadingStates] = useState({});

  // --- Utilidades (sin cambios) ---
  const mostrarNotificacion = useCallback((mensaje) => { /* ... */ setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000);}, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  // --- Fetch Data (sin cambios) ---
  const fetchRoles = useCallback(async () => { /* ... */ 
     try {
      const res = await axios.get("http://localhost:3000/api/roles", { withCredentials: true });
      const parsedData = res.data.map(r => ({ ...r, rol_id: parseInt(r.rol_id) }));
      setRoles(parsedData);
    } catch (error) {
      mostrarNotificacion("Error al cargar roles ❌");
      console.error("Error al cargar roles:", error.message);
    }
  }, [mostrarNotificacion]);
  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  // --- CRUD (sin cambios en la lógica interna, solo cómo se llaman desde el menú) ---
  const crearRol = useCallback(async () => { /* ... */ 
     if (!nuevoRol.nombre.trim()) {
      mostrarNotificacion("El nombre del rol es requerido ⚠️");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/roles", nuevoRol, { withCredentials: true });
      setNuevoRol({ nombre: "" });
      await fetchRoles();
      mostrarNotificacion("Rol creado exitosamente ✅");
    } catch (error) {
      mostrarNotificacion(`Error al Crear el Rol: ${error.response?.data?.message || error.message} ❌`);
      console.error("Error al crear rol:", error.response || error);
    }
  }, [nuevoRol, fetchRoles, mostrarNotificacion]);

  const handleEdit = useCallback((id, field, value) => { /* ... */
     const numericId = parseInt(id);
    setRoles(prev =>
      prev.map(rol => (rol.rol_id === numericId ? { ...rol, [field]: value } : rol))
    );
  }, []);

  const actualizarRol = useCallback(async (rol_id) => { /* ... */
      const numericId = parseInt(rol_id);
    const datosRol = roles.find(rol => rol.rol_id === numericId);
    if (!datosRol) {
      mostrarNotificacion("Error: No se encontró el rol para actualizar ❌");
      return;
    }
    setLoading(numericId, 'save', true);
    try {
      const payload = { nombre: datosRol.nombre };
      await axios.put(`http://localhost:3000/api/roles/${numericId}`, payload, { withCredentials: true });
      mostrarNotificacion("Rol actualizado exitosamente ✅");
      await fetchRoles();
    } catch (error) {
      console.error("❌ Error al actualizar el Rol:", error.response || error);
      mostrarNotificacion(`Error al Actualizar Rol: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setLoading(numericId, 'save', false);
    }
   }, [roles, fetchRoles, mostrarNotificacion, setLoading]);

  const eliminarRol = useCallback(async (rol_id) => { /* ... */
     const numericId = parseInt(rol_id);
    try {
      await axios.delete(`http://localhost:3000/api/roles/${numericId}`, { withCredentials: true });
      await fetchRoles();
      mostrarNotificacion("Rol Eliminado 🗑️");
    } catch (error) {
      console.error("Error al eliminar el Rol", error);
      mostrarNotificacion(`Error al eliminar el Rol: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setRolAEliminar(null);
    }
  }, [fetchRoles, mostrarNotificacion]);

  // --- Sorting Handler (sin cambios) ---
  const handleSort = useCallback((column) => { /* ... */ 
     const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  // --- Filtering & Sorting (sin cambios) ---
  const rolesFiltrados = useMemo(() => roles.filter(rol =>
    Object.values(rol).some(val => String(val ?? '').toLowerCase().includes(filtro.toLowerCase()))
  ), [roles, filtro]);
  const sortedRoles = useMemo(() => [...rolesFiltrados].sort((a, b) => { /* ... */ 
     if (!sortColumn) return 0;
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [rolesFiltrados, sortColumn, sortDirection]);


  // --- 2. MODIFICAR DEFINICIÓN DE COLUMNAS ---
  const columns = useMemo(() => [
    {
      key: "nombre", label: "Nombre Rol", sortable: true, className: "col-80",
      render: (item) => (
        <FormInput
          name={`nombre-${item.rol_id}`}
          value={item.nombre}
          onChange={e => handleEdit(item.rol_id, 'nombre', e.target.value)}
          aria-label={`Nombre para rol ${item.rol_id}`}
        />)
    },
    {
      key: "acciones", label: "Acciones", className: "col-10 actions-column", // Añadido actions-column
      render: (item) => {
        // Definir los items del menú para este rol específico
        const menuItems = [
          {
            label: "Guardar",
            icon: <FaSave />,
            onClick: () => actualizarRol(item.rol_id),
            // Podríamos añadir disabled: loadingStates[`save-${item.rol_id}`] pero el botón interno del dropdown no lo manejará bien
          },
          // Opcional: Podríamos tener un ítem "Editar" que active un modo de edición más explícito
          // { label: "Editar Nombre", icon: <FaEdit />, onClick: () => console.log("Editar", item.rol_id) },
          { type: 'separator' }, // Si tu DropdownMenu soporta separadores
          {
            label: "Eliminar",
            icon: <FaTrashAlt />,
            onClick: () => setRolAEliminar(item),
            // className: 'dropdown-item--danger' // Si quieres estilizarlo diferente
          }
        ];

        // El trigger para el DropdownMenu
        const triggerButton = (
          <FormButton
            icon={<FaEllipsisV />} // Icono de tres puntos
            size="small"
            variant="subtle" // Una variante discreta
            aria-label={`Acciones para rol ${item.rol_id}`}
            title="Más acciones"
            // No pasar isLoading aquí, el menú se encargará si es necesario
          />
        );

        return (
          <div className="table-actions"> {/* Mantener para centrado si es necesario */}
            <DropdownMenu
              trigger={triggerButton}
              items={menuItems}
              placement="bottom-end" // Posicionar el menú
            />
             {/* Botón de Guardar (si prefieres mantenerlo visible y solo Dropdown para Eliminar) */}
             {/* <FormButton
                icon={<FaSave />}
                onClick={() => actualizarRol(item.rol_id)}
                size="small"
                variant="default"
                title="Guardar Cambios"
                isLoading={loadingStates[`save-${item.rol_id}`]}
             /> */}
          </div>
        );
      }
    }
  ], [handleEdit, actualizarRol, loadingStates, setRolAEliminar]); // Añadir setRolAEliminar

  // --- Render (sin cambios estructurales) ---
  return (
    <Container as="main" className="page-container roles-page" maxWidth="60rem" centered padding="1rem">
      {/* ... (Notificación, Título, Formulario Creación, SearchBar) ... */}
       {notificacion && <div className="notification-toast">{notificacion}</div>}

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Roles
      </Titulo>

      <Container className="form-card" padding="1.5rem 2rem" margin="0 auto 1.5rem auto" bordered maxWidth="60rem">
        <div className="form-row">
          <FormInput
            name="nombre"
            placeholder="Nombre del nuevo Rol *"
            value={nuevoRol.nombre}
            onChange={(e) => setNuevoRol({ nombre: e.target.value })}
            required
            containerClassName="form-col"
          />
          <FormButton
            icon={<FaPlus />}
            label="Crear Rol"
            size="small"
            variant="success"
            onClick={crearRol}
            containerClassName="form-col fixed u-self-end"
          />
        </div>
      </Container>

      <Container className="menu-opciones__toolbar" margin="0 0 1rem auto" maxWidth="1200px" padding="0" background="transparent" >
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar roles..."
          aria-label="Buscar roles"
          className="roles__search-input"
        />
      </Container>


      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        <DataTable
          rowIdKey="rol_id"
          columns={columns}
          data={sortedRoles}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </Container>

      <ConfirmDialog
        isOpen={!!rolAEliminar}
        title={`¿Eliminar Rol "${rolAEliminar?.nombre || ''}"?`}
        message="Se eliminará el rol y todos los permisos de menú asociados. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (rolAEliminar) eliminarRol(rolAEliminar.rol_id); }}
        onCancel={() => setRolAEliminar(null)}
        confirmVariant="danger"
      />
    </Container>
  );
};

export default Roles;