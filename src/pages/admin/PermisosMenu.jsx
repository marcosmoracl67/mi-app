// src/pages/admin/PermisosMenu.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

// Import Core Components
import FormButton from "../../components/FormButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import ToggleSwitch from "../../components/ToggleSwitch";
import SearchBar from "../../components/SearchBar";
import FormSelect from "../../components/FormSelect"; // Standardized
import DataTable from "../../components/DataTable"; // Standardized
import Container from "../../components/Container"; // Standardized
import Titulo from "../../components/Titulo"; // Standardized
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa"; // Updated icon

// Assuming index.css imports necessary styles

const PermisosMenu = () => {
  // --- Estados ---
  const [nuevoItem, setNuevoItem] = useState({ rol_id: "", opcion_id: "", view_only: false });
  const [roles, setRoles] = useState([]);
  const [menuOpcion, setMenuOpcion] = useState([]);
  const [permisosMenu, setPermisosMenu] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('nombre_rol'); // Default sort
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [permisoAEliminar, setPermisoAEliminar] = useState(null); // Store object
  const [loadingStates, setLoadingStates] = useState({});

  // --- Utilidades ---
  const mostrarNotificacion = useCallback((msg) => { setNotificacion(msg); setTimeout(() => setNotificacion(null), 3000); }, []);

  const setLoading = useCallback((id, action, isLoading) => {setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));}, []); 

  // --- Fetch Data ---
  const fetchRoles = useCallback(async () => { 
    try 
      { const res = await axios.get("http://localhost:3000/api/roles", {
        withCredentials: true }); setRoles(res.data); 
      } 
      catch (err) 
      { 
        mostrarNotificacion("Error al cargar Roles ❌"); 
        console.error("Error fetchRoles:", err); 
      } 
  }, [mostrarNotificacion]);

  const fetchMenuOpcion = useCallback(async () => { try { const res = await axios.get("http://localhost:3000/api/menu/opciones", { withCredentials: true }); setMenuOpcion(res.data); } catch (err) { mostrarNotificacion("Error al cargar Opciones Menú ❌"); console.error("Error fetchMenuOpcion:", err); } }, [mostrarNotificacion]);

  const fetchPermisosMenu = useCallback(async () => {
    if (roles.length === 0 || menuOpcion.length === 0) return;
    try {
      const res = await axios.get("http://localhost:3000/api/permisosmenu", { withCredentials: true });
      const enhanced = res.data.map((p) => ({
        ...p,
        permiso_id: parseInt(p.permiso_id), // Ensure ID is number
        rol_id: parseInt(p.rol_id),
        opcion_id: parseInt(p.opcion_id),
        view_only: Boolean(p.view_only), // Ensure boolean
        nombre_rol: roles.find((r) => r.rol_id === parseInt(p.rol_id))?.nombre || `Rol ID ${p.rol_id}`,
        nombre_opcion: menuOpcion.find((o) => o.opcion_id === parseInt(p.opcion_id))?.nombre || `Opción ID ${p.opcion_id}`,
      }));
      setPermisosMenu(enhanced);
    } catch (err) { mostrarNotificacion("Error al cargar permisos ❌"); console.error("Error fetchPermisosMenu:", err); }
  }, [roles, menuOpcion, mostrarNotificacion]); // Dependencies

  useEffect(() => { fetchRoles(); fetchMenuOpcion(); }, [fetchRoles, fetchMenuOpcion]);
  useEffect(() => { if (roles.length > 0 && menuOpcion.length > 0) { fetchPermisosMenu(); } }, [roles, menuOpcion, fetchPermisosMenu]);

  // --- Select Options ---
  const opcionesRoles = useMemo(() => roles.map(rol => ({ value: rol.rol_id.toString(), label: rol.nombre })), [roles]);
  const opcionesMenu = useMemo(() => menuOpcion.map(op => ({ value: op.opcion_id.toString(), label: op.nombre })), [menuOpcion]);

  // --- Form Handlers ---
  const handleNuevoItemChange = (e) => { const { name, value } = e.target; setNuevoItem(prev => ({ ...prev, [name]: value })); };
  const handleNuevoToggleChange = (e) => { setNuevoItem(prev => ({ ...prev, view_only: e.target.checked })); };

  // --- CRUD ---
  const addPermisosMenu = useCallback(async () => {
    if (!nuevoItem.rol_id || !nuevoItem.opcion_id) { mostrarNotificacion("Debes seleccionar Rol y Opción ⚠️"); return; }
    setLoading('new', 'add', true);
    try {
      const payload = {
          rol_id: parseInt(nuevoItem.rol_id),
          opcion_id: parseInt(nuevoItem.opcion_id),
          view_only: nuevoItem.view_only
      };
      await axios.post("http://localhost:3000/api/permisosmenu/", payload, { withCredentials: true });
      mostrarNotificacion("Permiso creado exitosamente ✅");
      setNuevoItem({ rol_id: "", opcion_id: "", view_only: false });
      fetchPermisosMenu();
    } catch (err) { mostrarNotificacion(`Error al crear Permiso: ${err.response?.data?.message || err.message} ❌`); console.error("Error addPermisosMenu:", err); }
    finally { setLoading('new', 'add', false); }
  }, [nuevoItem, mostrarNotificacion, setLoading, fetchPermisosMenu]);

  // --- EDIT HANDLER (for inline editing state update) ---
  const handleEdit = useCallback((id, field, value) => {
    setPermisosMenu(prev =>
      prev.map(item => {
        if (item.permiso_id === id) {
          let parsedValue = value;
          // Parse IDs coming from Selects (which have string values)
          if (field === 'rol_id' || field === 'opcion_id') {
            parsedValue = parseInt(value);
          } else if (field === 'view_only') {
             parsedValue = Boolean(value); // Value from ToggleSwitch is already boolean
          }

          const updatedItem = { ...item, [field]: parsedValue };

          // Update derived names if IDs changed
          if (field === 'rol_id') {
            updatedItem.nombre_rol = roles.find(r => r.rol_id === parsedValue)?.nombre || `Rol ID ${parsedValue}`;
          }
          if (field === 'opcion_id') {
            updatedItem.nombre_opcion = menuOpcion.find(o => o.opcion_id === parsedValue)?.nombre || `Opción ID ${parsedValue}`;
          }
          return updatedItem;
        }
        return item;
      })
    );
  }, [roles, menuOpcion]); // Dependencies for name enrichment

  // --- UPDATE Function (reads from state) ---
  const updatePermisosMenu = useCallback(async (id) => { // <<< Envuelve con useCallback
    const datos = permisosMenu.find(p => p.permiso_id === id);
    if (!datos) {
      mostrarNotificacion("Error: No se encontró el permiso ❌");
      return;
    }

    setLoading(id, 'save', true);
    let payload;
    try {
      payload = {
        rol_id: datos.rol_id,
        opcion_id: datos.opcion_id,
        view_only: datos.view_only
      };

      // Validación (si la mantienes)
      if (typeof payload.rol_id !== 'number' || isNaN(payload.rol_id)) throw new Error(`Rol ID inválido`);
      if (typeof payload.opcion_id !== 'number' || isNaN(payload.opcion_id)) throw new Error(`Opción ID inválido`);

      await axios.put(`http://localhost:3000/api/permisosmenu/${id}`, payload, { withCredentials: true });
      mostrarNotificacion("Permiso actualizado ✅");
      // fetchPermisosMenu(); // Opcional
    } catch (err) {
      console.error("Error updatePermisosMenu - ID:", id, "Payload:", payload, err);
      mostrarNotificacion(`Error al actualizar Permiso: ${err.response?.data?.message || err.message} ❌`);
      fetchPermisosMenu(); // Revertir optimista
    } finally {
      setLoading(id, 'save', false);
    }
    // <<< Añade las dependencias de esta función >>>
  }, [permisosMenu, mostrarNotificacion, setLoading, fetchPermisosMenu]); // <<< Lista de dependencias

  const deletePermisosMenu = useCallback(async (id) => {
    setLoading(id, 'delete', true);
    try {
      await axios.delete(`http://localhost:3000/api/permisosmenu/${id}`, { withCredentials: true });
      mostrarNotificacion("Permiso eliminado ✅");
      fetchPermisosMenu();
    } catch (err) { mostrarNotificacion(`Error al eliminar Permiso: ${err.response?.data?.message || err.message} ❌`); console.error("Error deletePermisosMenu:", err); }
    finally { setPermisoAEliminar(null); }
  }, [setLoading, mostrarNotificacion, fetchPermisosMenu]); // <<< Lista de dependencias // Envuelve con useCallback

  // --- Filtering & Sorting ---
  const permisosFiltrados = useMemo(() => permisosMenu.filter((p) => { const search = filtro.toLowerCase(); return (p.nombre_rol?.toLowerCase().includes(search) || p.nombre_opcion?.toLowerCase().includes(search)); }), [permisosMenu, filtro]);
  const sortedPermisosMenu = useMemo(() => [...permisosFiltrados].sort((a, b) => { if (!sortColumn) return 0; const isNameCol = ['nombre_rol', 'nombre_opcion'].includes(sortColumn); let aVal = isNameCol ? (a[sortColumn]?.toLowerCase() ?? '') : (a[sortColumn]?.toString().toLowerCase() ?? ''); let bVal = isNameCol ? (b[sortColumn]?.toLowerCase() ?? '') : (b[sortColumn]?.toString().toLowerCase() ?? ''); if (sortColumn === 'view_only') { aVal = String(a.view_only); bVal = String(b.view_only); } if (aVal < bVal) return sortDirection === "asc" ? -1 : 1; if (aVal > bVal) return sortDirection === "asc" ? 1 : -1; return 0; }), [permisosFiltrados, sortColumn, sortDirection]);
  const handleSort = useCallback((column) => { const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc"; setSortColumn(column); setSortDirection(direction); }, [sortColumn, sortDirection]);

  // --- Column Definitions (Standardized DataTable) ---
  const columns = useMemo(() => [
    { key: "nombre_rol", label: "Rol", sortable: true, className: "col-30",
      render: (item) => (
        <FormSelect
          // No label needed here
          name={`rol-${item.permiso_id}`}
          value={item.rol_id?.toString() ?? ""} // Pass value as string
          options={opcionesRoles}
          onChange={(e) => handleEdit(item.permiso_id, "rol_id", e.target.value)} // Pass string value
          aria-label={`Rol para permiso ${item.permiso_id}`}
          // className="select-in-table" // Add if specific styling needed
        />
      )
    },
    { key: "nombre_opcion", label: "Opción Menú", sortable: true, className: "col-30",
      render: (item) => (
        <FormSelect
          // No label needed here
          name={`opcion-${item.permiso_id}`}
          value={item.opcion_id?.toString() ?? ""} // Pass value as string
          options={opcionesMenu}
          onChange={(e) => handleEdit(item.permiso_id, "opcion_id", e.target.value)} // Pass string value
          aria-label={`Opción para permiso ${item.permiso_id}`}
          // className="select-in-table"
        />
      )
     },
    { key: "view_only", label: "Solo Lectura", sortable: true, className: "col-10", // Centered
      render: (item) => (
        <div className="u-flex u-justify-center"> {/* Centering wrapper */}
          <ToggleSwitch
            // No label needed here
            id={`view_only-${item.permiso_id}`}
            checked={item.view_only} // Should be boolean from state
            onChange={(e) => handleEdit(item.permiso_id, "view_only", e.target.checked)}
            size="small"
            aria-label={`Solo lectura para permiso ${item.permiso_id}`}
          />
        </div>
       ),
     },
    { key: "acciones", label: "Acciones", className: "col-10",
       render: (item) => (
          <div className="table-actions"> {/* Ensure this class is defined */}
            <FormButton
              icon={<FaSave />}
              onClick={() => updatePermisosMenu(item.permiso_id)} // Pass only ID
              size="small"
              variant="default" // Or outline
              title="Guardar Cambios"
              aria-label={`Guardar permiso ${item.permiso_id}`}
              isLoading={loadingStates[`save-${item.permiso_id}`]}
              loaderSize="small"
            />
            <FormButton
              icon={<FaTrashAlt />} // Use updated icon
              onClick={() => setPermisoAEliminar(item)} // Pass item object
              size="small"
              variant="default" // Use danger variant
              title="Eliminar Permiso"
              aria-label={`Eliminar permiso ${item.permiso_id}`}
              isLoading={loadingStates[`delete-${item.permiso_id}`]}
              loaderSize="small"
            />
          </div>
        ),
     }
  ], [opcionesRoles, opcionesMenu, handleEdit, updatePermisosMenu, loadingStates]); // Dependencies

  // --- Render ---
  return (
    <Container as="main" className="page-container permisos-menu-page" maxWidth="80rem" centered padding="1rem">
      {notificacion && <div className="notification-toast">{notificacion}</div>}

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Permisos del Menú
      </Titulo>

      {/* --- Formulario Creación --- */}
      <Container background="var(--background1)" className="form-card" padding="1.5rem 2rem" margin="0 auto 1.5rem auto" bordered maxWidth="80rem">
        <div className="form-row"> {/* Mantener div.form-row */}
          <FormSelect
            // No label
            name="rol_id" // Name matches state key
            value={nuevoItem.rol_id}
            onChange={handleNuevoItemChange}
            options={opcionesRoles}
            placeholder="Seleccione Rol..."
            required
            containerClassName="form-col" // Class for layout
          />
          <FormSelect
             // No label
            name="opcion_id" // Name matches state key
            value={nuevoItem.opcion_id}
            onChange={handleNuevoItemChange}
            options={opcionesMenu}
            placeholder="Seleccione Opción..."
            required
            containerClassName="form-col"
          />
          <ToggleSwitch
            name="view_only" // Name matches state key
            label="Solo Lectura" // Label for Toggle
            checked={nuevoItem.view_only}
            onChange={handleNuevoToggleChange}
            containerClassName="form-col u-flex u-items-center u-self-end" // Utilities for alignment
          />
          <FormButton
            icon={<FaPlus />}
            label="Crear Permiso"
            size="small"
            variant="success"
            onClick={addPermisosMenu}
            isLoading={loadingStates['add-new']}
            loaderSize="small"
            containerClassName="form-col fixed u-self-end" // Utilities for alignment
          />
        </div>
      </Container>

      {/* --- Toolbar --- */}
       <Container className="menu-opciones__toolbar" margin="0 0 1rem auto" maxWidth="1200px" padding="0" background="transparent" >
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por rol u opción..."
          aria-label="Buscar permisos de menú"
          className="permisos-menu__search-input" // Class for width control
        />
      </Container>

      {/* --- Tabla --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        <DataTable
          rowIdKey="permiso_id" // Verify this primary key
          columns={columns}
          data={sortedPermisosMenu}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          // editable & onEdit removed
        />
      </Container>

      {/* --- Confirm Dialog --- */}
      <ConfirmDialog
        isOpen={!!permisoAEliminar}
        title={`¿Eliminar Permiso?`} // Generic title or add more context if needed
        message={`Se eliminará el permiso para el rol "${permisoAEliminar?.nombre_rol || ''}" en la opción "${permisoAEliminar?.nombre_opcion || ''}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (permisoAEliminar) deletePermisosMenu(permisoAEliminar.permiso_id); }}
        onCancel={() => setPermisoAEliminar(null)}
        confirmVariant="danger" // Use correct prop
      />
    </Container>
  );
};

export default PermisosMenu;