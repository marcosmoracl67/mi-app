// src/pages/admin/Usuarios.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react"; // Import React
import axios from "axios";
import { FaPlus, FaSave, FaTrashAlt, FaLock } from "react-icons/fa"; // Use FaTrashAlt

// Import Core Components
import FormInput from "../../components/FormInput";        // Standardized
import FormButton from "../../components/FormButton";      // Standardized
import ConfirmDialog from "../../components/ConfirmDialog";    // Standardized
import SearchBar from "../../components/SearchBar";        // Standardized
import DataTable from "../../components/DataTable";        // Standardized
import ToggleSwitch from "../../components/ToggleSwitch";    // Standardized
import Container from "../../components/Container";        // Standardized
import Titulo from "../../components/Titulo";          // Standardized
import ChangePasswordModal from "../../components/ChangePasswordModal"; // Assume this exists

// Assuming index.css imports necessary styles

const Usuarios = () => {
  // --- Estados ---
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('nombre'); // Default sort by nombre
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null); // Store object
  const [usuarioPassword, setUsuarioPassword] = useState(null); // Store object
  const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", nombre: "", rut: "", password: "", email: "", activo: true });
  const [loadingStates, setLoadingStates] = useState({}); // Loading state for buttons

  // --- Utilidades (Memoizadas) ---
  const mostrarNotificacion = useCallback((mensaje) => { setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000); }, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  // --- Fetch Data (Memoizada) ---
  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", { withCredentials: true });
      // Parse data types on fetch
      const parsedData = res.data.map(u => ({
          ...u,
          usuario_id: parseInt(u.usuario_id),
          activo: Boolean(u.activo) // Ensure boolean
      }));
      setUsuarios(parsedData);
    } catch (err) {
      mostrarNotificacion("Error al cargar usuarios ❌");
      console.error("Error al cargar usuarios:", err.message);
    }
  }, [mostrarNotificacion]); // Dependency

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  // --- CRUD ---
  const crearUsuario = useCallback(async () => {
    // Add validation as needed (e.g., password complexity, email format)
    if (!nuevoUsuario.username || !nuevoUsuario.nombre || !nuevoUsuario.password || !nuevoUsuario.email) {
        mostrarNotificacion("Username, Nombre, Password y Email son requeridos ⚠️");
        return;
    }
    // setLoading('new', 'add', true); // Optional loading for create button
    try {
      // Ensure 'activo' is included if the API expects it
      const payload = { ...nuevoUsuario };
      await axios.post("http://localhost:3000/api/users", payload, { withCredentials: true });
      setNuevoUsuario({ username: "", nombre: "", rut: "", password: "", email: "", activo: true });
      await fetchUsuarios();
      mostrarNotificacion("Usuario creado exitosamente ✅");
    } catch (err) {
      mostrarNotificacion(`Error al crear usuario: ${err.response?.data?.message || err.message} ❌`);
      console.error("Error al crear usuario:", err.response || err);
    } finally {
      // setLoading('new', 'add', false); // Optional
    }
  }, [nuevoUsuario, fetchUsuarios, mostrarNotificacion]); // Add setLoading if used

  // --- Edit Handler (Memoizado) ---
  const handleEdit = useCallback((id, field, value) => {
    const numericId = parseInt(id);
     // Handle boolean conversion for ToggleSwitch
     const finalValue = field === 'activo' ? Boolean(value) : value;
     setUsuarios(prev =>
      prev.map(user => {
        if (user.usuario_id === numericId) {
          return { ...user, [field]: finalValue };
        }
        return { ...user }; // Forzar nuevo objeto para que el DataTable detecte el cambio
      })
    );
    
  }, []); // No dependencies needed

  // --- UPDATE Function (Memoizada, lee del estado) ---
  const actualizarUsuario = useCallback(async (usuario_id) => {
    const numericId = parseInt(usuario_id);
    const datosUsuario = usuarios.find(user => user.usuario_id === numericId);
    if (!datosUsuario) { mostrarNotificacion("Error: No se encontró el usuario ❌"); return; }

    setLoading(numericId, 'save', true);
    try {
      // Exclude password if not changed (API might require it differently)
      // Send only editable fields
      const { password, ...payloadBase } = datosUsuario; // Exclude password by default
      const payload = {
        username: payloadBase.username,
        nombre: payloadBase.nombre,
        rut: payloadBase.rut,
        email: payloadBase.email,
        activo: payloadBase.activo // Should be boolean
      };

       // Optional validation here if needed

      await axios.put(`http://localhost:3000/api/users/${numericId}`, payload, { withCredentials: true });
      mostrarNotificacion("Usuario actualizado exitosamente ✅");
      await fetchUsuarios(); // Refresh for consistency
    } catch (error) {
      console.error("❌ Error al actualizar el usuario:", error.response || error);
      mostrarNotificacion(`Error al actualizar usuario: ${error.response?.data?.message || error.message} ❌`);
      // Consider fetchUsuarios() to revert on error if optimistic updates are complex
    } finally {
      setLoading(numericId, 'save', false);
    }
  }, [usuarios, fetchUsuarios, mostrarNotificacion, setLoading]); // Dependencies

  // --- Delete Function (Memoizada) ---
  const eliminarUsuario = useCallback(async (usuario_id) => {
    const numericId = parseInt(usuario_id);
    // setLoading(numericId, 'delete', true); // Optional
    try {
      await axios.delete(`http://localhost:3000/api/users/${numericId}`, { withCredentials: true });
      await fetchUsuarios();
      mostrarNotificacion("Usuario eliminado 🗑️");
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      mostrarNotificacion(`Error al eliminar usuario: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setUsuarioAEliminar(null);
    }
  }, [fetchUsuarios, mostrarNotificacion]); // Add setLoading if used

  // --- Sorting Handler (Memoizado) ---
  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  // --- Filtering & Sorting (Memoizados) ---
  const usuariosFiltrados = useMemo(() => usuarios.filter((u) => {
      const search = filtro.toLowerCase();
      return (
          u.username?.toLowerCase().includes(search) ||
          u.nombre?.toLowerCase().includes(search) ||
          u.rut?.toLowerCase().includes(search) ||
          u.email?.toLowerCase().includes(search)
      );
  }), [usuarios, filtro]);

  const sortedUsuarios = useMemo(() => [...usuariosFiltrados].sort((a, b) => {
      if (!sortColumn) return 0;
      const aVal = String(a[sortColumn] ?? '').toLowerCase(); // Safe access and string conversion
      const bVal = String(b[sortColumn] ?? '').toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
  }), [usuariosFiltrados, sortColumn, sortDirection]);

  // --- Column Definitions (Memoizadas y Estandarizadas) ---
  const columns = useMemo(() => [
    { key: "username", label: "Username", sortable: true, className: "col-15", // Adjusted width
      render: (item) => (<FormInput name={`username-${item.usuario_id}`} value={item.username} onChange={e => handleEdit(item.usuario_id, 'username', e.target.value)} aria-label={`Username para ${item.nombre}`}/>)
    },
    { key: "nombre", label: "Nombre", sortable: true, className: "col-25", // Adjusted width
      render: (item) => (<FormInput name={`nombre-${item.usuario_id}`} value={item.nombre} onChange={e => handleEdit(item.usuario_id, 'nombre', e.target.value)} aria-label={`Nombre para ${item.nombre}`}/>)
    },
    { key: "rut", label: "RUT", sortable: true, className: "col-10",
      render: (item) => (<FormInput name={`rut-${item.usuario_id}`} value={item.rut ?? ''} onChange={e => handleEdit(item.usuario_id, 'rut', e.target.value)} aria-label={`RUT para ${item.nombre}`}/>)
    },
    { key: "email", label: "Email", sortable: true, className: "col-25", // Adjusted width
      render: (item) => (<FormInput type="email" name={`email-${item.usuario_id}`} value={item.email ?? ''} onChange={e => handleEdit(item.usuario_id, 'email', e.target.value)} aria-label={`Email para ${item.nombre}`}/>)
    },
    { key: "activo", label: "Activo", sortable: true, className: "col-05", // Make sortable, centered
      render: (item) => (
        <div className="u-flex u-justify-center">
          <ToggleSwitch
            id={`activo-${item.usuario_id}`}
            checked={item.activo} // Should be boolean from state
            onChange={(e) => {console.log("CAMBIO!", e.target.checked); handleEdit(item.usuario_id, "activo", e.target.checked)}}
            size="small"
            label={null} // O eliminar completamente
            aria-label={`Activo para ${item.nombre}`}
          />
        </div>
      )
    },
    { key: "acciones", label: "Acciones", className: "col-15", // Wider actions column
      render: (item) => (
        <div className="table-actions">
          <FormButton
            icon={<FaSave />}
            onClick={() => actualizarUsuario(item.usuario_id)}
            size="small"
            variant="default"
            title="Guardar Cambios"
            aria-label={`Guardar cambios para ${item.nombre}`}
            isLoading={loadingStates[`save-${item.usuario_id}`]}
            loaderSize="small"
          />
          <FormButton
            icon={<FaLock />} // Change Password Icon
            onClick={() => setUsuarioPassword(item)} // Pass user object
            size="small"
            variant="default" // Use outline or subtle variant
            title="Cambiar Contraseña"
            aria-label={`Cambiar contraseña para ${item.nombre}`}
          />
          <FormButton
            icon={<FaTrashAlt />}
            onClick={() => setUsuarioAEliminar(item)} // Pass user object
            size="small"
            variant="default" // Use danger variant
            title="Eliminar Usuario"
            aria-label={`Eliminar ${item.nombre}`}
            // isLoading={...} // Optional
          />
        </div>
      )
    }
  ], [handleEdit, actualizarUsuario, loadingStates, setUsuarioPassword, setUsuarioAEliminar]); // Include dependencies


  // --- Render ---
  return (
    <Container as="main" className="page-container usuarios-page" maxWidth="85rem" centered padding="1rem"> {/* Wider container */}
      {notificacion && <div className="notification-toast">{notificacion}</div>}

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Usuarios
      </Titulo>

      {/* Formulario Creación */}
      <Container background="var(--background1)"  className="form-card" padding="1.5rem 2rem" margin="0 auto 1.5rem auto" bordered maxWidth="85rem">
        <div className="form-row">
          <FormInput name="username" placeholder="Username *" value={nuevoUsuario.username} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })} required containerClassName="form-col"/>
          <FormInput name="nombre" placeholder="Nombre Completo *" value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} required containerClassName="form-col"/>
          <FormInput name="rut" placeholder="RUT (Opcional)" value={nuevoUsuario.rut} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rut: e.target.value })} containerClassName="form-col"/>
        </div>
        <div className="form-row u-margin-top-sm">
          <FormInput name="email" type="email" placeholder="Correo Electrónico *" value={nuevoUsuario.email} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} required containerClassName="form-col grow-2"/> {/* Example grow */}
          <FormInput name="password" type="password" placeholder="Contraseña Inicial *" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} required containerClassName="form-col"/>
          <ToggleSwitch name="activo" label="Activo" checked={nuevoUsuario.activo} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, activo: e.target.checked })} containerClassName="form-col fixed u-self-end"/>
          <FormButton
            icon={<FaPlus />}
            label="Crear Usuario"
            size="small"
            variant="success"
            onClick={crearUsuario}
            // isLoading={...}
          />
        </div>
     
      </Container>

      {/* Toolbar */}
     <Container className="menu-opciones__toolbar" margin="0 0 1rem auto" maxWidth="1200px" padding="0" background="transparent" >
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por username, nombre, rut, email..."
          aria-label="Buscar usuarios"
          className="usuarios__search-input" // Specific class for width
        />
      </Container>

      {/* Tabla */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        <DataTable
          rowIdKey="usuario_id"
          columns={columns} // Standardized
          data={sortedUsuarios} // Standardized
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort} // Standardized
          // editable/onEdit removed
        />
      </Container>

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!usuarioAEliminar}
        title={`¿Eliminar Usuario "${usuarioAEliminar?.username || ''}"?`} // Show username
        message="Esta acción eliminará permanentemente al usuario y podría afectar otros registros asociados. No se puede deshacer."
        confirmText="Eliminar Usuario"
        cancelText="Cancelar"
        onConfirm={() => { if (usuarioAEliminar) eliminarUsuario(usuarioAEliminar.usuario_id); }}
        onCancel={() => setUsuarioAEliminar(null)}
        confirmVariant="danger"
      />

      {/* Change Password Modal */}
      {usuarioPassword && (
        <ChangePasswordModal
          usuario={usuarioPassword} // Pass the full user object
          onClose={() => setUsuarioPassword(null)}
          onSuccess={mostrarNotificacion} // Reuse notification function
        />
      )}
    </Container>
  );
};

export default Usuarios;