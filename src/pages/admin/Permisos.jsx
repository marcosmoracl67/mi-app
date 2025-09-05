import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../../components/DataTable";
import ToggleSwitch from "../../components/ToggleSwitch";
import SelectBox from "../../components/SelectBox";
import SearchBar from "../../components/SearchBar";
import "../../styles/pages/_MenuOpciones.css"; // Importar estilos específicos para esta página

const Permisos = () => {
  const [roles, setRoles] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [notificacion, setNotificacion] = useState("");
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    cargarRoles();
    cargarOpciones();
  }, []);

  useEffect(() => {
    if (rolSeleccionado) {
      cargarPermisos(rolSeleccionado);
    } else {
      setPermisos([]);
    }
  }, [rolSeleccionado]);

  const cargarRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/roles", {
        withCredentials: true
      });
      setRoles(response.data);
    } catch (err) {
      console.error("Error cargando roles", err);
    }
  };

  const cargarOpciones = async () => {
    try {
      const response = await axios.get("  ", {
        withCredentials: true
      });
      setOpciones(response.data);
    } catch (err) {
      console.error("Error cargando opciones", err);
    }
  };

  const cargarPermisos = async (rol_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/permisos/${rol_id}`,
        { withCredentials: true }
      );
      setPermisos(response.data.map((p) => p.opcion_id));
    } catch (err) {
      console.error("Error cargando permisos", err);
    }
  };

  const togglePermiso = async (opcion_id, permitido) => {
    try {
      const metodo = permitido ? "post" : "delete";
      await axios({
        method: metodo,
        url: "http://localhost:3000/api/permisos",
        data: { rol_id: rolSeleccionado, opcion_id },
        withCredentials: true
      });

      setPermisos((prev) =>
        permitido
          ? [...prev, opcion_id]
          : prev.filter((id) => id !== opcion_id)
      );
      mostrarNotificacion("Permiso actualizado correctamente ✅");
    } catch (err) {
      console.error("Error al actualizar permiso", err);
      alert("Error al actualizar permiso ❌");
    }
  };

  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(""), 3000);
  };

  const opcionesFiltradas = opciones.filter((op) =>
    op.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const sortedOpciones = [...opcionesFiltradas].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn]?.toLowerCase?.() || "";
    const bVal = b[sortColumn]?.toLowerCase?.() || "";
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="form-page centered">
      {notificacion && <div className="notification-toast">{notificacion}</div>}
      <h2>Administración de Permisos</h2>

      <div className="form-grid">
        <SelectBox
          label=""
          value={rolSeleccionado}
          onChange={(e) => setRolSeleccionado(e.target.value)}
          options={roles}
          idKey="rol_id"
          labelKey="nombre"
        />
      </div>

 {/*      <SearchBar
        placeholder="Buscar opción..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      /> */}

      {/* --- Barra de Búsqueda --- */}
      {/* This container now controls width and alignment */}
      <div className="menu-opciones__toolbar"> {/* <<< NUEVA CLASE ESPECÍFICA */}
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar Opción..."
          aria-label="Buscar opciones de menú"
          
          // Puedes añadir una clase específica si necesitas más control:
          // className="menu-opciones__search-input"
        />
      </div>

      <DataTable
        rowIdKey="opcion_id"
        data={sortedOpciones}
        columns={[
          { key: "nombre", label: "Opción", sortable: true, className: "col-40" },
          { key: "ruta", label: "Ruta", sortable: true, className: "col-40" },
          {
            key: "permitido",
            label: "Permiso",
            className: "col-20",
            render: (row) => (
              <ToggleSwitch
                id={`permiso-${row.opcion_id}`}
                checked={permisos.includes(row.opcion_id)}
                onChange={(e) => togglePermiso(row.opcion_id, e.target.checked)}
                size="small"
              />
            )
          }
        ]}
        editable={false}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={setSortColumn}
      />
    </div>
  );
};

export default Permisos;
