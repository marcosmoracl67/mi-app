import { useEffect, useState } from "react";
import axios from "axios";
import {  FaPlus, FaEdit, FaTrashAlt, FaFile, FaChartBar } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
import FormButton from "../../components/FormButton";
import DataTable from "../../components/DataTable";
import FormattedDate from "../../components/FormattedDate";
import TareaFormModal from "./TareaFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Container from "../../components/Container"; 
import ModalDialog from "../../components/ModalDialog";
import DocumentManager from "../../components/DocumentManager";
import GanttModal from "./GanttModal";

const ProyectoDetalle = ({ id }) => {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [proyecto, setProyecto] = useState(null);
  const [modalTareaAbierto, setModalTareaAbierto] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [confirmDialogAbierto, setConfirmDialogAbierto] = useState(false);
  const [modalDocumentosTareaAbierto, setModalDocumentosTareaAbierto] = useState(false);
  const [tareaActual, setTareaActual] = useState(null);
  const [modalGanttAbierto, setModalGanttAbierto] = useState(false);
  
  const confirmarEliminarTarea = (tarea) => {
    setTareaAEliminar(tarea);
    setConfirmDialogAbierto(true);
  };

  const abrirModalDocumentosTarea = (tarea) => {
    setTareaActual(tarea);
    setModalDocumentosTareaAbierto(true);
  };
  
  const pedirConfirmacionEliminar = (tarea) => {
    setTareaAEliminar(tarea);
    setConfirmOpen(true);
  };

  const editarTarea = (tarea) => {
    setTareaNueva(tarea);
    setModoEdicion(true);
    setModalTareaAbierto(true);
  };
  
  const [tareaNueva, setTareaNueva] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    fecha_vencimiento: ""
  });

  useEffect(() => {
    fetchTareas();
    fetchProyecto();
  }, [id]);

  const fetchTareas = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/tareas?proyecto_id=${id}`, {
        withCredentials: true,
      });
      setTareas(res.data);
    } catch (error) {
      console.error("Error al cargar tareas:", error.message);
    }
  };

  const fetchProyecto = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/proyectos/${id}`, {
        withCredentials: true,
      });
      setProyecto(res.data);
    } catch (error) {
      console.error("Error al obtener proyecto:", error.message);
    }
  };

  const guardarTarea = async () => {
    try {
      if (modoEdicion) {
        await axios.put(`http://localhost:3000/api/tareas/${tareaNueva.tarea_id}`, tareaNueva, {
          withCredentials: true
        });
        mostrarNotificacion("Tarea actualizada exitosamente ✅");
      } else {
        await axios.post("http://localhost:3000/api/tareas", {
          ...tareaNueva,
          proyecto_id: proyecto.proyecto_id
        }, {
          withCredentials: true
        });
        mostrarNotificacion("Tarea creada exitosamente ✅");
      }
  
      setModalTareaAbierto(false);
      setModoEdicion(false);
      setTareaNueva({ titulo: "", descripcion: "", estado: "pendiente", fecha_vencimiento: "" });
      fetchTareas();
    } catch (error) {
      mostrarNotificacion("Error al crear la tarea ❌");
    }
  };

  const eliminarTarea = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/tareas/${tareaAEliminar.tarea_id}`, {
        withCredentials: true,
      });
      mostrarNotificacion("Tarea eliminada correctamente", "success");
      fetchTareas();
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error.message);
      mostrarNotificacion("Error al eliminar tarea", "error");
    } finally {
      setConfirmDialogAbierto(false);
      setTareaAEliminar(null);
    }
  };
  
   const columns = [
    { key: "titulo", label: "Tiitulo", sortable: true, className: "col-25" },
    { key: "descripcion", label: "Descripción", className: "col-35" },
    { key: "estado", label: "Estado", sortable: true, className: "col-10" },
    { key: "fecha_inicio", label: "Inicio", sortable: true, className: "col-10",
      render: (row) => <FormattedDate date={row.fecha_inicio}  format="dd-mm-yyyy"/> },
    { key: "fecha_termino", label: "Término",  sortable: true, className: "col-10" , 
      render: (row) => <FormattedDate date={row.fecha_termino} format="dd-mm-yyyy"/>},
    { key: "avance", label: "Avance", className: "col-10" },
    {
      key: "acciones",
      label: "Acciones",
      className: "col-15",
      render: (row) => (
        <div className="table-actions">
          <button className="form-button small" title="Editar"
            onClick={() => editarTarea(row)}><FaEdit />
          </button>

          <button className="form-button small"title="Eliminar"
             onClick={() => confirmarEliminarTarea(row)}><FaTrashAlt />
          </button>

          <button className="form-button small" title="Documentos"
              onClick={() => abrirModalDocumentosTarea(row)} ><FaFile />
          </button>
        </div>
      )
    }
    
  ];

  const tareasFiltrados = tareas.filter((u) => {
  
    return (
        u.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
        u.descripcion?.toLowerCase().includes(filtro.toLowerCase()) ||
        u.estado?.toLowerCase().includes(filtro.toLowerCase()) 
    );
  });

  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 3000);
    };

  const sortedTareas = [...tareasFiltrados].sort((a, b) => {
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

  return (
    <Container
      background="var(--background1)" width="100%" maxWidth="80rem" padding="1rem">

      <h2 className="section-title">
        {proyecto ? `Tareas del Proyecto: ${proyecto.nombre}` : "Cargando..."}
      </h2>

      <div className="form-card">

        <div className="form-col fixed">
             <div className="form-col grow-2">
                      <SearchBar
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        placeholder="Buscar por titulo, descripción, estado..."
                        width="30rem"
                        align="center"
                      />
                    </div>
                    <FormButton
                      icon={<FaPlus />}
                      label="Nueva Tarea"
                      size="small"
                      variant="success"
                      align="center"
                      onClick={() => setModalTareaAbierto(true)}
                    />

        </div>
      </div>

      <DataTable
        rowIdKey="tarea_id"
        columns={columns}
        data={sortedTareas} // ← usa la lista ordenada
        editable={false}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <TareaFormModal
        isOpen={modalTareaAbierto}
        onClose={() => {
          setModalTareaAbierto(false);
          setModoEdicion(false);
          setTareaNueva({ titulo: "", descripcion: "", estado: "pendiente", fecha_vencimiento: "" });
        }}
        onSubmit={guardarTarea}
        tarea={tareaNueva}
        onChange={setTareaNueva}
      />

      <ConfirmDialog
        isOpen={confirmDialogAbierto} 
        title="¿Deseas eliminar esta tarea?"
        message={`Tarea: "${tareaAEliminar?.titulo}"`}
        onCancel={() => setConfirmDialogAbierto(false)}
        onConfirm={() => {
          eliminarTarea();
          setConfirmDialogAbierto(false);
        }}
      />

      <ModalDialog
        isOpen={modalDocumentosTareaAbierto}
        onClose={() => setModalDocumentosTareaAbierto(false)}
        title={`Documentos de la Tarea: ${tareaActual?.titulo}`}
      >
        {tareaActual && (
          <DocumentManager tipo="tarea" id={tareaActual.tarea_id} />
        )}
      </ModalDialog>

      <button
          className="form-button small"
          onClick={() => setModalGanttAbierto(true)}
          size="medium"
          variant="success"
          title="Ver Carta Gantt"
        >
          <FaChartBar />
        </button>

        <GanttModal // Abre ventana modal con la Carta Gantt
          isOpen={modalGanttAbierto}
          onClose={() => setModalGanttAbierto(false)}
          tareas={tareas}
          proyecto={proyecto}
          msgbtnClose={"Cerrar carta Gantt"}
        />

    </Container>
  );
};

export default ProyectoDetalle;
