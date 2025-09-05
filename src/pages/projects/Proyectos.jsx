import { useEffect, useState } from "react";
import axios from "axios";
import {  FaPlus, FaEdit, FaTrashAlt, FaTasks, FaFile } from "react-icons/fa";
import FormButton from "../../components/FormButton";
import DataTable from "../../components/DataTable";
import SearchBar from "../../components/SearchBar";
import FormattedDate from "../../components/FormattedDate";
import ConfirmDialog from "../../components/ConfirmDialog";
import ModalDialog from "../../components/ModalDialog";
import ProjectFormModal from "../projects/ProjectFormModal";
import ProyectoDetalle from "../projects/ProyectoDetalle";
import DocumentManager from "../../components/DocumentManager";
import "../../styles/index.css";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState("");

  const [modalDocumentosAbierto, setModalDocumentosAbierto] = useState(false);
  const [proyectoActual, setProyectoActual] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [proyectoNuevo, setProyectoNuevo] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
    fecha_inicio: "",
    fecha_entrega: "",
    responsable: ""
    });
  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = (mensaje) => {
  setNotificacion(mensaje);
  setTimeout(() => setNotificacion(null), 3000);
  };

  const [modalTareasAbierto, setModalTareasAbierto] = useState(false);
  const [proyectoDetalleId, setProyectoDetalleId] = useState(null);

  const abrirModalTareas = (proyecto) => {
    setProyectoDetalleId(proyecto.proyecto_id);
    setModalTareasAbierto(true);
  };
  
  useEffect(() => {
    fetchProyectos();
  }, []);

  const editarProyecto = (proyecto) => {
    const toInputDate = (dateStr) =>
      dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";
  
    setProyectoNuevo({
      ...proyecto,
      fecha_inicio: toInputDate(proyecto.fecha_inicio),
      fecha_entrega: toInputDate(proyecto.fecha_entrega),
    });
  
    setModalAbierto(true);
  }; 

  const fetchProyectos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/proyectos", {
        withCredentials: true
      });
      setProyectos(res.data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error.message);
    }
  };

  const crearProyecto = async () => {
    const endpoint = proyectoNuevo.proyecto_id
      ? `http://localhost:3000/api/proyectos/${proyectoNuevo.proyecto_id}`
      : "http://localhost:3000/api/proyectos";
  
    const method = proyectoNuevo.proyecto_id ? "put" : "post";

    const payload = {
      nombre: proyectoNuevo.nombre,
      descripcion: proyectoNuevo.descripcion,
      estado: proyectoNuevo.estado,
      fecha_inicio: proyectoNuevo.fecha_inicio || null,
      fecha_entrega: proyectoNuevo.fecha_entrega || null,
      responsable_id: proyectoNuevo.responsable_id ? Number(proyectoNuevo.responsable_id) : null

    };

    console.log("Datos del proyecto: ", payload);
  
    try {
      await axios[method](endpoint, payload, { withCredentials: true });
      mostrarNotificacion(
        proyectoNuevo.proyecto_id
          ? "Proyecto actualizado correctamente 📝"
          : "Proyecto creado exitosamente ✅"
      );
      setModalAbierto(false);
      setProyectoNuevo({ nombre: "", descripcion: "", estado: "activo", fecha_inicio: "", fecha_entrega: "", responsable: "" });
      fetchProyectos();
    } catch (error) {
      console.error("Error al guardar proyecto:", error.message);
    }
  };
  
  const pedirConfirmacionEliminar = (proyecto) => {
    setProyectoAEliminar(proyecto);
    setConfirmOpen(true);
  };
  
  const eliminarProyecto = async () => {
    if (!proyectoAEliminar) return;
    try {
      await axios.delete(`http://localhost:3000/api/proyectos/${proyectoAEliminar.proyecto_id}`, {
        withCredentials: true,
      });
      fetchProyectos();
      mostrarNotificacion("Proyecto eliminado 🗑️");
    } catch (error) {
      console.error("Error al eliminar proyecto:", error.message);
    } finally {
      setConfirmOpen(false);
      setProyectoAEliminar(null);
    }
  };   
 
  const columns = [
    { key: "nombre", label: "Nombre del Proyecto", sortable: true, className: "col-30" },
    { key: "estado", label: "Estado", sortable: true, className: "col-10" },
    { key: "responsable", label: "Responsable", sortable: true, className: "col-15" },
    { key: "fecha_inicio", label: "Inicio", sortable: true, className: "col-10", 
      render: (row) => <FormattedDate date={row.fecha_inicio} format="dd-mmm-yyyy" />,
    },
    { key: "fecha_entrega", label: "Entrega", sortable: true, className: "col-10", 
      render: (row) => <FormattedDate date={row.fecha_entrega} format="dd-mmm-yyyy" />,
    },
    {
      key: "acciones",
      label: "Acciones",
      className: "col-15",
      render: (row) => (
        <div className="table-actions">
          <button className="form-button small" onClick={() => editarProyecto(row)} 
            title="Editar"> <FaEdit /> </button>
          <button className="form-button small" onClick={() => pedirConfirmacionEliminar(row)}
            title="Eliminar"> <FaTrashAlt /> </button> 
          <button className="form-button small" onClick={() => abrirModalTareas(row)}
            title="Tareas"> <FaTasks /> </button>
          <button className="form-button small" onClick={() => abrirModalDocumentos(row)}
            title="Documentos"> <FaFile /> </button>
        </div>
      )
    }
 
  ];

  const proyectosFiltrados = proyectos.filter((u) => {
  
    return (
        u.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        u.responsable?.toLowerCase().includes(filtro.toLowerCase()) ||
        u.estado?.toLowerCase().includes(filtro.toLowerCase()) 
    );
  });

  const sortedProyectos = [...proyectosFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn]?.toLowerCase?.() || "";
    const bVal = b[sortColumn]?.toLowerCase?.() || "";
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const abrirModalDocumentos = (proyecto) => {
    setProyectoActual(proyecto);
    setModalDocumentosAbierto(true);
  };
  
  return (
    <div className="form-page centered">
      <h2 className="section-title">Tablero de Proyectos</h2>
      {notificacion && <div className="notification-toast">{notificacion}</div>}

      <div className="form-card">
        <div className="form-row align-center">
          <div className="form-col grow-2">
            <SearchBar
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por nombre, descripción, responsable..."
              width="30rem"
              align="center"
            />
          </div>

          <div className="form-col fixed">
            <FormButton
              icon={<FaPlus />}
              label="Nuevo Proyecto"
              size="small"
              variant="success"
              align="left"
              onClick={() => setModalAbierto(true)}>
            </FormButton>
            
          </div>
        </div> 
      </div>

      <DataTable
        rowIdKey="proyecto_id"
        columns={columns}
        data={sortedProyectos}
        editable={false}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort} 
      />
      <ProjectFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={crearProyecto}
        proyecto={proyectoNuevo}
        onChange={setProyectoNuevo}
        />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmar eliminación"
        message={`¿Deseas eliminar el proyecto "${proyectoAEliminar?.nombre}"?`}
        onConfirm={eliminarProyecto}
        onCancel={() => {
          setConfirmOpen(false);
          setProyectoAEliminar(null);
        }}
      />

      <ModalDialog
        isOpen={modalDocumentosAbierto}
        onClose={() => setModalDocumentosAbierto(false)}
        title={`Documentos: ${proyectoActual?.nombre || "..."}`}
      >
        {proyectoActual && (
          <DocumentManager tipo="proyecto" id={proyectoActual.proyecto_id} />
        )}
      </ModalDialog>

      <ModalDialog
        isOpen={modalTareasAbierto}
        onClose={() => setModalTareasAbierto(false)}
        maxWidth="90rem"
        msgbtnClose={"Cerrar tareas"}
      >
        {proyectoDetalleId && (
          <ProyectoDetalle id={proyectoDetalleId} />
        )}
      </ModalDialog>

   
  </div>   
  );
};

export default Proyectos;
