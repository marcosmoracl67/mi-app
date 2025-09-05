// --- START OF FILE Contexto.jsx ---
import { useEffect, useState } from "react";
import axios from "axios";
import FormButton from "../../components/FormButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import ToggleSwitch from "../../components/ToggleSwitch";
import Container from "../../components/Container"; // <<< Importar Container
import Titulo from "../../components/Titulo";     // <<< Importar Titulo
import SearchBar from "../../components/SearchBar";
import FormSelect from "../../components/FormSelect"; // Ya usa la versión actualizada
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import DataTable from "../../components/DataTable";

const Contexto = () => {
  const [nuevoItem, setNuevoItem] = useState({
    usuario_id: "", // String vacío para placeholder
    rol_id: "",     // String vacío para placeholder
    empresa_id: "", // String vacío para placeholder
    activo: true
  });

  const [roles, setRoles] = useState([]);
  const [empresa, setEmpresa] = useState([]); // Cambiado el nombre para evitar conflicto
  const [user, setUser] = useState([]);
  const [contexto, setContexto] = useState([]); // Cambiado el nombre para evitar conflicto

  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [notificacion, setNotificacion] = useState(null);
  const [contextoAEliminar, setContextoAEliminar] = useState(null); // Cambiado el nombre
  const [loadingStates, setLoadingStates] = useState({});

  const mostrarNotificacion = (msg) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 3000);
  };

  const setLoading = (id, action, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));
};

  // --- Funciones Fetch (sin cambios internos) ---
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      mostrarNotificacion("Error al cargar los Usuarios ❌");
      console.error("Error fetchUsuarios:", err);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/empresas", { withCredentials: true });
      setEmpresa(res.data);
    } catch (err) {
      mostrarNotificacion("Error al cargar las Empresas ❌");
      console.error("Error fetchEmpresas:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/roles", { withCredentials: true });
      setRoles(res.data);
    } catch (err) {
      mostrarNotificacion("Error al cargar los Roles ❌");
      console.error("Error fetchRoles:", err);
    }
  };

  const fetchContexto = async () => {
    // Asegurarse de que los datos base estén cargados
    if (user.length === 0 || roles.length === 0 || empresa.length === 0) {
        console.log("Esperando carga de usuarios, roles y empresas...");
        return;
    }
    try {
      const res = await axios.get("http://localhost:3000/api/contexto", { withCredentials: true });

      // Enriquecer datos
      const enhanced = res.data.map((item) => ({
        ...item,
        nombre_usuario: user.find((u) => u.usuario_id === item.usuario_id)?.nombre || `Usuario ID ${item.usuario_id}`,
        nombre_empresa: empresa.find((e) => e.empresa_id === item.empresa_id)?.nombre_empresa || `Empresa ID ${item.empresa_id}`,
        nombre_rol: roles.find((r) => r.rol_id === item.rol_id)?.nombre || `Rol ID ${item.rol_id}`
      }));

      setContexto(enhanced);
    } catch (err) {
      mostrarNotificacion("Error al cargar las Asignaciones ❌");
      console.error("Error fetchContexto:", err);
    }
  };

  // Cargar datos base
  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
    fetchEmpresas();
  }, []);

  // Cargar contexto cuando los datos base estén listos
  useEffect(() => {
    if (user.length > 0 && roles.length > 0 && empresa.length > 0) {
      fetchContexto();
    }
  }, [user, roles, empresa]);

  // --- Transformación de datos para FormSelect ---
  const opcionesUsuarios = user.map(u => ({
    value: u.usuario_id,
    label: u.nombre || u.username // Usa nombre, o username como fallback
  }));

  const opcionesRoles = roles.map(r => ({
    value: r.rol_id,
    label: r.nombre
  }));

  const opcionesEmpresas = empresa.map(e => ({
    value: e.empresa_id,
    label: e.nombre_empresa
  }));
  // --- Fin Transformación ---


  const addContexto = async () => {
     // Validación simple
     if (!nuevoItem.usuario_id || !nuevoItem.rol_id || !nuevoItem.empresa_id) {
         mostrarNotificacion("Debes seleccionar Usuario, Rol y Empresa ⚠️");
         return;
     }
    try {
       const payload = {
           usuario_id: parseInt(nuevoItem.usuario_id),
           rol_id: parseInt(nuevoItem.rol_id),
           empresa_id: parseInt(nuevoItem.empresa_id),
           activo: nuevoItem.activo
       };
      await axios.post("http://localhost:3000/api/contexto/", payload, { withCredentials: true });
      mostrarNotificacion("Asignación creada exitosamente ✅");
      setNuevoItem({ // Resetear
        usuario_id: "",
        rol_id: "",
        empresa_id: "",
        activo: true
      });
      fetchContexto(); // Refrescar
    } catch (err) {
      mostrarNotificacion("Error al crear Asignación ❌");
      console.error("Error addContexto:", err.response?.data || err.message);
    }
  };

  const updateContexto = async (id, datos) => {
     try {
       // Payload solo con los datos necesarios y parseados
       const payload = {
           usuario_id: parseInt(datos.usuario_id),
           rol_id: parseInt(datos.rol_id),
           empresa_id: parseInt(datos.empresa_id),
           activo: datos.activo
       };
      await axios.put(`http://localhost:3000/api/contexto/${id}`, payload, { withCredentials: true });
      mostrarNotificacion("Asignación actualizada ✅");
      // No es necesario fetch si handleEdit actualiza bien
      // fetchContexto();
    } catch (err) {
      mostrarNotificacion("Error al actualizar la Asignación ❌");
      console.error("Error updateContexto:", err.response?.data || err.message);
      fetchContexto(); // Revertir si falla
    }
  };

  const deleteContexto = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/contexto/${id}`, { withCredentials: true });
      mostrarNotificacion("Asignación eliminada ✅");
      fetchContexto(); // Refrescar tabla
    } catch (err) {
      mostrarNotificacion("Error al eliminar la Asignación ❌");
      console.error("Error deleteContexto:", err.response?.data || err.message);
    } finally {
      setContextoAEliminar(null);
    }
  };

   // Filtrado mejorado
   const contextoFiltrados = contexto.filter((item) => {
       const search = filtro.toLowerCase();
       return (
           item.nombre_usuario?.toLowerCase().includes(search) ||
           item.nombre_rol?.toLowerCase().includes(search) ||
           item.nombre_empresa?.toLowerCase().includes(search)
       );
   });


  // Ordenamiento mejorado
  const sortedContexto = [...contextoFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
     // Usa los nombres para ordenar si la columna es uno de ellos
    const useNameColumn = ['nombre_usuario', 'nombre_rol', 'nombre_empresa'].includes(sortColumn);

    let aVal = useNameColumn ? (a[sortColumn]?.toLowerCase() ?? '') : (a[sortColumn]?.toString().toLowerCase() ?? '');
    let bVal = useNameColumn ? (b[sortColumn]?.toLowerCase() ?? '') : (b[sortColumn]?.toString().toLowerCase() ?? '');

    // Ordenar booleano 'activo' como string
     if(sortColumn === 'activo') {
         aVal = String(a.activo);
         bVal = String(b.activo);
     }


    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });


  // handleEdit actualizado
  const handleEdit = (id, field, value) => {
    setContexto(prev =>
      prev.map(item => {
        if (item.contexto_id === id) {
           // Actualiza el valor del campo editado
          const updatedItem = { ...item, [field]: value };

          // Actualiza nombres si cambian los IDs correspondientes
          if (field === 'usuario_id') {
              updatedItem.nombre_usuario = user.find(u => u.usuario_id === parseInt(value))?.nombre || `Usuario ID ${value}`;
          }
          if (field === 'rol_id') {
              updatedItem.nombre_rol = roles.find(r => r.rol_id === parseInt(value))?.nombre || `Rol ID ${value}`;
          }
          if (field === 'empresa_id') {
              updatedItem.nombre_empresa = empresa.find(e => e.empresa_id === parseInt(value))?.nombre_empresa || `Empresa ID ${value}`;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // handleSort (sin cambios)
  const handleSort = (column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  return (
    // Container principal de la página
      <Container as="main" className="page-container menu-opciones-page" maxWidth="80rem" centered padding="1rem 1rem">
        {/* Notificación */}
      {notificacion && <div className="notification-toast">{notificacion}</div>}


      {/* Título de la página */}
      <Titulo as="h2" className="page-title" align="center" margin="0 0 1rem 0">
      Asignaciones Usuario - Rol - Empresa
      </Titulo>
      
      {/* --- Formulario de Creación --- */}
      <Container background="var(--background1)" className="form-card" padding="1.5rem 2rem" margin="0 auto 1rem auto" bordered maxWidth={"80rem"}>
        
         {/* Filas del formulario (pueden seguir usando divs o Contenedores anidados) */}
         <div className="form-row">
          <FormSelect
            //label="Usuario" // Label añadido
            name="nuevoUsuario" // Name añadido
            value={nuevoItem.usuario_id}
            onChange={(e) => setNuevoItem({ ...nuevoItem, usuario_id: e.target.value })} // No parsear
            options={opcionesUsuarios} 
            placeholder="Seleccione Usuario..."
            containerClassName="form-group-inline"
          />
          <FormSelect
            // label="Rol" // Label añadido
            name="nuevoRol" 
            value={nuevoItem.rol_id}
            onChange={(e) => setNuevoItem({ ...nuevoItem, rol_id: e.target.value })} // No parsear
            options={opcionesRoles} 
            placeholder="Seleccione Rol..."
            containerClassName="form-group-inline"
          />
          <FormSelect
            // label="Empresa" // Label añadido
            name="nuevaEmpresa" 
            value={nuevoItem.empresa_id}
            onChange={(e) => setNuevoItem({ ...nuevoItem, empresa_id: e.target.value })} // No parsear
            options={opcionesEmpresas} 
            placeholder="Seleccione Empresa..."
            containerClassName="form-group-inline"
          />
          <div className="form-group form-group-inline" style={{ alignSelf: 'center', marginBottom: '1rem' }}>
 
            <ToggleSwitch
              name="activo" 
              label="Activo"
              checked={nuevoItem.activo}
              onChange={(e) =>
                setNuevoItem({ ...nuevoItem, activo: e.target.checked })
              } containerClassName="form-col u-flex u-items-center u-self-end"
            />
          </div>  
        </div>

        <div className="form-actions centered"> {/* Margen añadido */}
           <FormButton icon={<FaPlus />} label="Crear Asignación" size="small" variant="success" onClick={addContexto} isLoading={loadingStates['add-new']} loaderSize="small" />
          </div>
      </Container> {/* <<< Fin Container del formulario */}

      {/* --- Barra de Búsqueda en su propio Container o div --- */}
      {/* Usar Container para controlar layout si es más complejo que un simple div */}
      <Container className="menu-opciones__toolbar" margin="0 0 1rem auto" maxWidth="1200px" padding="0" background="transparent" >
          <SearchBar
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar asignación..."
            width = "30%"
            align = "right"
          />
      </Container> {/* <<< Fin Container del toolbar */}

    {/* --- Tabla en un Container --- */}
    {/* Añadir padding, borde, etc. al contenedor de la tabla si se desea */}
     <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1.0rem" margin="0 auto" >
        <DataTable
          data={sortedContexto}
          rowIdKey="contexto_id" // Asegúrate que este es el ID correcto de la tabla contexto
          columns={[
            { key: "nombre_usuario", label: "Usuario", sortable: true, className: "col-25",
              render: (item) => (
                <FormSelect
                  name={`usuario-${item.contexto_id}`}
                  value={item.usuario_id}
                  options={opcionesUsuarios} // <<< Opciones transformadas
                  onChange={(e) => handleEdit(item.contexto_id, "usuario_id", parseInt(e.target.value)) }
                  className="select-in-table"
                />
              )
            },
            { key: "nombre_rol", label: "Rol", sortable: true, className: "col-20", // Ajuste ancho
              render: (item) => (
                <FormSelect
                  name={`rol-${item.contexto_id}`}
                  value={item.rol_id}
                  options={opcionesRoles} // <<< Opciones transformadas
                  onChange={(e) => handleEdit(item.contexto_id, "rol_id", parseInt(e.target.value)) }
                  className="select-in-table"
                />
              )
            },
            { key: "nombre_empresa", label: "Empresa", sortable: true, className: "col-25",
              render: (item) => (
                <FormSelect
                  name={`empresa-${item.contexto_id}`}
                  value={item.empresa_id}
                  options={opcionesEmpresas} // <<< Opciones transformadas
                  onChange={(e) => handleEdit(item.contexto_id, "empresa_id", parseInt(e.target.value)) }
                  className="select-in-table"
                />
              )
            },
            { key: "activo", label: "Activo", align: "left", sortable: false, className: "col-05",
              render: (item) => (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ToggleSwitch
                          id={`activo-${item.contexto_id}`}
                          checked={item.activo}
                          onChange={(e) => handleEdit(item.contexto_id, "activo", e.target.checked)}
                          size="small"
                      />
                  </div>
              ),
            },
            { key: "acciones", label: "Acciones", sortable: false, className: "col-10",
              render: (row) => (
                  <div className="table-actions">
                    <FormButton
                        icon={<FaSave />}
                        onClick={() => { updateContexto(row.contexto_id, row);}}
                        size="small"
                        variant="primary"
                        title="Guardar Cambios"
                      />
                      <FormButton
                        icon={<FaTrash />}
                        onClick={() => setContextoAEliminar(row.contexto_id)}
                        size="small"
                        variant="primary"
                        title="Eliminar Asignación"
                      />
                  </div>
                ),
              }
            ]}
          // editable y onEdit ya no son necesarios en DataTable si se edita inline
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      {/* --- Fin Tabla --- */}
    </Container> {/* <<< Fin Container de la tabla */}

      {/* --- Confirmación de eliminación --- */}
      {/* Asegúrate que el ID pasado es correcto y que el estado se limpia después de eliminar */}
      <ConfirmDialog
          isOpen={!!contextoAEliminar}
          title="¿Deseas eliminar esta Asignación?"
          onConfirm={() => { deleteContexto(contextoAEliminar); }}
          onCancel={() => setContextoAEliminar(null)}
        />

    </Container>
  );
};

export default Contexto;
