// src/pages/hierarchy/DetalleNodo.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

import Container from "../../components/Container";
import Titulo from "../../components/Titulo";
import SearchBar from "../../components/SearchBar";
import FormButton from "../../components/FormButton";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import ConfirmDialog from "../../components/ConfirmDialog";
import DetalleNodoFormModal from "./DetalleNodoFormModal";

const ITEMS_PER_PAGE = 15; 

const DetalleNodo = () => {
  const [detallesNodos, setDetallesNodos] = useState([]);
  const [filteredDetallesNodos, setFilteredDetallesNodos] = useState([]);
  const [isFetchingList, setIsFetchingList] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [detalleNodoToDelete, setDetalleNodoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "descripcion", direction: "asc" });

  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", type: "info", title: "" });
  const [tiponodos, setTiponodos] = useState([]);
  const [tiposNodoParaModal, setTiposNodoParaModal] = useState([]);

  // const [modalVisible, setModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [modoFormulario, setModoFormulario] = useState("crear"); 

  const [isSubmittingModal, setIsSubmittingModal] = useState(false)

// --- Fetch de Datos --
const fetchData = async () => {
    setIsFetchingList(true);
    try {
        const response = await axios.get("http://localhost:3000/api/detalle-nodo", { withCredentials: true });

        const dataMapeada = response.data.map(item => ({
           ...item,  idtiponodo: item.IdTipoNodo || item.idtiponodo, 
        }));
        console.log("DetalleNodo.jsx - fetchData - dataMapeada:", dataMapeada); // Log para ver los datos mapeados
        setDetallesNodos(dataMapeada);
        setFilteredDetallesNodos(dataMapeada);
    } catch (error) {
        console.error("DetalleNodo: Error al obtener datos:", error);
        setAlertInfo({ isOpen: true, message: "Error al cargar detalles de nodo", type: "error", title: "Error de Carga" });
    } finally {
        setIsFetchingList(false);
    }
};

const fetchTipoNodos = async () => { // Definición separada para tiposNodo
    try {
        const res = await axios.get("http://localhost:3000/api/tipos-nodo", { withCredentials: true });
        setTiponodos(res.data);
    } catch (err) {
        console.error("Error al obtener tipos de nodo", err);
        // Considera mostrar un alert también
    }
};

useEffect(() => {
  // Filtrar los tiponodos cuando 'tiponodos' (el array completo) cambie
   const filtrados = tiponodos.filter(tn => tn.detalle === true);
   console.log("DetalleNodo.jsx - tiposNodoParaModal filtrados:", filtrados); // Log para depurar
   setTiposNodoParaModal(filtrados);
 }, [tiponodos]); // Dependencia: se ejecuta cuando 'tiponodos' se actualiza

useEffect(() => {
    fetchData();
    fetchTipoNodos(); // Llama a ambas aquí
}, []); 

// Abrir modal para crear
const handleAbrirModalCrear = () => {
  setDetalleSeleccionado(null);
  setModoFormulario("crear");
  setIsModalOpen(true); 
};

// Abrir modal para editar
const handleAbrirModalEditar = (detalle) => {
 setDetalleSeleccionado(detalle);
  setModoFormulario("editar");
  setIsModalOpen(true);
};

// Cerrar modal
const handleCerrarModal = () => {
  // setModalVisible(false);
  setIsModalOpen(false); // <-- DESPUÉS
  setDetalleSeleccionado(null);
};

// Manejar creación o actualización desde el modal
const handleGuardarDetalle = async (datosDelModal) => { // 'datosDelModal' viene del formulario
  setIsSubmittingModal(true);
  try {
    const payloadParaEnviar = {
      descripcion: datosDelModal.descripcion,
      tipodetalle: datosDelModal.tipodetalle,
      idtiponodo: parseInt(datosDelModal.idtiponodo), // Asegúrate que sea número
      orden: parseInt(datosDelModal.orden) // Asegúrate que sea número
    };

    if (modoFormulario === "crear") {
     await axios.post("http://localhost:3000/api/detalle-nodo", payloadParaEnviar, { withCredentials: true });
    } else {
       await axios.put(`http://localhost:3000/api/detalle-nodo/${detalleSeleccionado.detallenodo_id}`, payloadParaEnviar, { withCredentials: true });
    }
    await fetchData();
    setIsModalOpen(false);
    // Mostrar alerta de éxito
    setAlertInfo({
        isOpen: true,
        message: `Detalle de nodo ${modoFormulario === "crear" ? "creado" : "actualizado"} exitosamente.`,
        type: "success",
        title: "Éxito"
    });

  } catch (error) {
    console.error("Error al guardar detalle nodo:", error.response ? error.response.data : error.message); // Mejora el log de error
    setAlertInfo({
        isOpen: true,
        message: `Error al guardar: ${error.response?.data?.error || error.message}`,
        type: "error",
        title: "Error al Guardar"
    });
  } finally {
    setIsSubmittingModal(false);
  }
};

const handleSearch = (e) => {
  const newSearchTerm = e.target.value;
  setSearchTerm(newSearchTerm);

  const searchTermLower = newSearchTerm.toLowerCase();

  if (!newSearchTerm.trim()) {
    setFilteredDetallesNodos(detallesNodos);
  } else {
    const filtered = detallesNodos.filter((detalle) => {
      const descMatch = (detalle.descripcion || '').toLowerCase().includes(searchTermLower);
      const tipoDetalleMatch = (detalle.tipodetalle || '').toLowerCase().includes(searchTermLower);

      let tipoNodoDescMatch = false;
      if (detalle.idtiponodo !== null && detalle.idtiponodo !== undefined) {
        const tipoNodoAsociado = tiponodos.find(tn => {
          return tn.idtiponodo === detalle.idtiponodo; // Asegúrate que ambos sean del mismo tipo para la comparación (ej. ambos números)
        });

        if (tipoNodoAsociado) {
          tipoNodoDescMatch = (tipoNodoAsociado.descripcion || '').toLowerCase().includes(searchTermLower);
        }
      }
      
      return descMatch || tipoDetalleMatch || tipoNodoDescMatch;
    });
    setFilteredDetallesNodos(filtered);
  }
  setCurrentPage(1);
};

const handleDelete = (detalle) => {
  console.log("click borrar")
  setDetalleNodoToDelete(detalle);
  setShowConfirmDialog(true);
};

const confirmDelete = async () => {
  if (!detalleNodoToDelete) { // Buena práctica añadir esta guarda
    return;
  }

  try {
    await axios.delete(`http://localhost:3000/api/detalle-nodo/${detalleNodoToDelete.detallenodo_id}`, { withCredentials: true });
    await fetchData(); 
    setAlertInfo({ isOpen: true, message: "Detalle de nodo eliminado correctamente", type: "success", title: "Eliminado" });

  } catch (error) {
    console.error("Error al eliminar detalle de nodo:", error.response ? error.response.data : error.message);
    setAlertInfo({ 
        isOpen: true, 
        message: `Error al eliminar: ${error.response?.data?.error || error.message}`, 
        type: "error",
        title: "Error de Eliminación"
    });
  } finally {
    setShowConfirmDialog(false);
    setDetalleNodoToDelete(null);
  }
};


const sortedData = useMemo(() => {
  const sorted = [...filteredDetallesNodos];
  sorted.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
  });
  return sorted;
}, [filteredDetallesNodos, sortConfig]);

const paginatedData = useMemo(() => {
  const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE; // Renombrado para claridad
  const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;    // Renombrado para claridad
  return sortedData.slice(firstPageIndex, lastPageIndex);
}, [sortedData, currentPage]); // Asegúrate de incluir itemsPerPage si lo usas aquí directamente

const totalPages = useMemo(() => {
   return Math.ceil(sortedData.length / ITEMS_PER_PAGE); // Basado en la longitud de los datos ordenados/filtrados
 }, [sortedData]); // Añadir itemsPerPage aquí

const handleSort = (key) => {
  let direction = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }
  setSortConfig({ key, direction });
};

const columns = useMemo(
  () => [
    { key: "descripcion", label: "Descripción", className: "col-40", sortable: true, render: (detalle) => detalle.descripcion, },
    { key: "tipodetalle", label: "Tipo Detalle", className: "col-15", sortable: true, render: (detalle) => detalle.tipodetalle,},
    { key: "idtiponodo", label: "Tipo Nodo", className: "col-15", sortable: true,   render: (item) => {
      const tipo = tiponodos.find(t => t.idtiponodo === item.idtiponodo);
      return tipo ? tipo.descripcion : "N/A"; }},
    { key: "orden",label: "Orden", className: "col-10", sortable: true, render: (detalle) => detalle.orden,   },
    { key: "acciones", label: "Acciones", className: "col-15", render: (detalle) => (
        <>
          <FormButton
            icon={<FaEdit />} 
            onClick={() => handleAbrirModalEditar(detalle) } 
            size="small"
            variant="subtle" // O 'default', 'outline'
            title="Editar Tipo de Nodo"
            aria-label={`Editar tipo de nodo ${detalle}`}
          />            
          <FormButton
            icon={<FaTrashAlt />}
            onClick={() => handleDelete(detalle)}
            size="small"
            variant="subtle" // Usar variant="danger" para eliminar
            title="Eliminar Tipo de Nodo"
            aria-label={`Eliminar tipo nodo ${detalle}`}
            // isLoading={loadingStates[`delete-${detalle}`]}
          />
        </>
      ),
    },
  ],
  [tiponodos]
);

  return (
    <Container>
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
         autoCloseDelay={3000} // Opcional
      />

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Detalle del Nodo
      </Titulo>

      {/* Toolbar: SearchBar y Botón Crear */}
      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
        <div className="toolbar-left"> {/* <<<< Contenedor para SearchBar */}
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Buscar tipos de nodos..."
            aria-label="Buscar  tipos de nodos"
            className=".tipos-nodo__search-input"
          />
        </div>
        <div className="toolbar-right"> {/* <<<< Contenedor para el botón */}
          <FormButton 
            icon={<FaPlus />}
            label="Crear Detalle del Nodo"
            onClick={handleAbrirModalCrear}
            size="small"
          />
        </div>
      </Container>

      {/* Tabla y Paginación --- */}
      <Container className="table-container-wrapper" background="var(--background1)" maxWidth="70rem" bordered padding="1rem" margin="0 auto"> 
      {isFetchingList ? (
        <Loader text="Cargando detalles de nodo..." size="large" />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedData} 
            onSort={handleSort}
            sortConfig={sortConfig}
          />
     {totalPages > 1 && ( // Mostrar paginación solo si hay más de una página
       <Container padding="1rem 0 0 0" background="transparent"> {/* Contenedor opcional como en TiposNodo */}
         <Pagination
           currentPage={currentPage}
           totalPages={totalPages} // <<< PASAR totalPages CALCULADO
           onPageChange={setCurrentPage}
           // Props opcionales para mostrar info "Mostrando X-Y de Z"
           totalItems={sortedData.length} // Total de ítems filtrados/ordenados
           itemsPerPage={ITEMS_PER_PAGE}
           showPageInfo={true} // Si quieres mostrar la info
         />
      </Container>
     )}
        </>
      )}
      </Container>

     {/* Modal de Formulario para Crear/Editar */}
      {isModalOpen && ( 
        <DetalleNodoFormModal
          isOpen={isModalOpen} 
          onClose={handleCerrarModal}
          onSubmit={handleGuardarDetalle}
          mode={modoFormulario} 
          initialData={detalleSeleccionado} 
          tiposNodo={tiposNodoParaModal} 
          isLoading={isSubmittingModal} 
      />
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title={`Eliminar: ${detalleNodoToDelete?.descripcion || ''}`}
          message={`¿Estás seguro de que deseas eliminar el detalle de nodo "${detalleNodoToDelete.descripcion}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDialog(false)}
          confirmVariant="danger"
        >
          <p>
            ¿Estás seguro de que deseas eliminar el detalle de nodo
            <strong>"{detalleNodoToDelete?.descripcion || ''}"</strong>? Esta acción es irreversible.
          </p>
        </ConfirmDialog>
      )}
    </Container>
  );
};

export default DetalleNodo;
