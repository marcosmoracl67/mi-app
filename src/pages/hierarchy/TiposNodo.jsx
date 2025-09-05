// src/pages/admin/TiposNodo.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

// Import Core Components
import FormButton from "../../components/FormButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/DataTable";
import Container from "../../components/Container";
import Titulo from "../../components/Titulo";
import Parrafo from "../../components/Parrafo";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert"; // <<< NUEVO
import TipoNodoFormModal from "./TipoNodoFormModal";
import ToggleSwitch from '../../components/ToggleSwitch';

// Assuming index.css imports necessary styles

const ITEMS_PER_PAGE = 10; // O un valor configurable

const TiposNodo = () => {
  // --- Estados ---
  const [tiposNodo, setTiposNodo] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('Descripcion'); // Default sort
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [tipoNodoAEliminar, setTipoNodoAEliminar] = useState(null); // Store object
  const [loadingStates, setLoadingStates] = useState({});
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", type: "info", title: "" });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

    // Estados para el Modal de Formulario
  const [isTipoNodoModalOpen, setIsTipoNodoModalOpen] = useState(false);
  const [tiponodoActualParaModal, setTipoNodoActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState("crear"); // 'crear' o 'editar'
  const [isSubmittingModal, setIsSubmittingModal] = useState(false); // Para el botón de guardar del modal

    // Estado de carga inicial
  const [isFetchingList, setIsFetchingList] = useState(true); 

  // --- Utilidades (Memoizadas) ---
  const mostrarNotificacion = useCallback((mensaje) => { setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000); }, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  // --- Fetch Data (Memoizada) ---
  const fetchTiposNodo = useCallback(async () => {

    try {
      const res = await axios.get("http://localhost:3000/api/tipos-nodo", { withCredentials: true });
      const parsedData = res.data.map(tn => ({
          idtiponodo: parseInt(tn.idtiponodo), 
          descripcion: tn.descripcion,         
          icono: tn.icono || tn.Icono || "",  
          detalle: tn.detalle || false 
        }));
      setTiposNodo(parsedData);
    } catch (error) {
      mostrarNotificacion("Error al cargar Tipos de Nodo ❌");
      console.error("Error al cargar Tipos de Nodo:", error.message);
    } finally {
      setIsFetchingList(false); 
    }

  }, [mostrarNotificacion]); 

  useEffect(() => {
    fetchTiposNodo();
  }, [fetchTiposNodo]);

  const handleFormSubmit = useCallback(async (datosDelModal) => { 
  setIsSubmittingModal(true);

  const idParaActualizar = (modoModal === 'editar' && tiponodoActualParaModal)
                            ? tiponodoActualParaModal.idtiponodo
                            : null;

  const payload = {
  descripcion: datosDelModal.descripcion,
  icono: datosDelModal.icono || null,
  detalle: Boolean(datosDelModal.detalle) 
  };

  const url = modoModal === 'crear'
    ? "http://localhost:3000/api/tipos-nodo"
    : `http://localhost:3000/api/tipos-nodo/${idParaActualizar}`; 

  const method = modoModal === 'crear' ? 'post' : 'put';

  if (modoModal === 'editar' && !idParaActualizar) {
      mostrarNotificacion("Error: ID del tipo de nodo no encontrado para actualizar.", "error");
      setIsSubmittingModal(false);
      return;
  }

  try {
    await axios[method](url, payload, { withCredentials: true }); // Enviar 'payload'
    await fetchTiposNodo();
    mostrarNotificacion(
      modoModal === 'crear' ? "Tipo de Nodo creado exitosamente ✅" : "Tipo de Nodo actualizado con éxito ✨",
      // "success" // Asumo que mostrarNotificacion no toma un segundo argumento de tipo
    );
    setIsTipoNodoModalOpen(false);
  } catch (error) {
    // ... (manejo de error)
  } finally {
    setIsSubmittingModal(false);
  }
}, [modoModal, fetchTiposNodo, mostrarNotificacion, tiponodoActualParaModal]); // Añadir tiponodoActualParaModal

  // --- Delete Function (Memoizada) ---
  const eliminarTipoNodo = useCallback(async (idtiponodo) => {
    const numericId = parseInt(idtiponodo);
    setLoading(numericId, 'delete', true);
    try {
      await axios.delete(`http://localhost:3000/api/tipos-nodo/${numericId}`, { withCredentials: true });
      await fetchTiposNodo();
      mostrarNotificacion("Tipo de Nodo Eliminado 🗑️");
    } catch (error) {
      console.error("Error al eliminar el Tipo de Nodo", error);
      mostrarNotificacion(`Error al eliminar el Tipo de Nodo: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setTipoNodoAEliminar(null);
      setLoading(numericId, 'delete', false); // Asegurar que se limpie el loading
    }
  }, [fetchTiposNodo, mostrarNotificacion, setLoading]);

   // --- Manejadores del Modal ---

const handleAbrirModalEditar = useCallback((tipoNodo) => {
  setModoModal('editar');
  setTipoNodoActualParaModal({
    idtiponodo: tipoNodo.idtiponodo,
    descripcion: tipoNodo.descripcion,
    icono: tipoNodo.icono,
    detalle: tipoNodo.detalle ?? false  // ✅ Esta línea es clave
  });
  setIsTipoNodoModalOpen(true);
}, []);


const handleAbrirModalCrear = useCallback(() => {
  setModoModal('crear');
  // Para el modal, pasamos un objeto con la estructura esperada, pero vacío o con defaults
  setTipoNodoActualParaModal({ descripcion: "", icono: "" }); // <<< Bien, inicializa para creación
  setIsTipoNodoModalOpen(true);
}, []);

const handleCerrarModal = useCallback(() => {
  setIsTipoNodoModalOpen(false);
  setTipoNodoActualParaModal(null); // Limpiar datos al cerrar
  setIsSubmittingModal(false); // Resetear estado de envío del modal
}, []);


  // --- Sorting Handler (Memoizado) ---
  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  // --- Filtering & Sorting (Memoizados) ---
  const tiposNodoFiltrados = useMemo(() => tiposNodo.filter(tn =>
    tn.descripcion?.toLowerCase().includes(filtro.toLowerCase()) || // <<< usar descripcion
    tn.icono?.toLowerCase().includes(filtro.toLowerCase())      // <<< AÑADIR filtro por icono
  ), [tiposNodo, filtro]);

  const sortedTiposNodo = useMemo(() => [...tiposNodoFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    // Asumimos que la única columna ordenable es Descripcion (string)
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [tiposNodoFiltrados, sortColumn, sortDirection]);
 
  // --- Paginación ---
  const paginatedTipoNodo = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedTiposNodo.slice(firstPageIndex, lastPageIndex);
  }, [sortedTiposNodo, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedTiposNodo.length / ITEMS_PER_PAGE), [sortedTiposNodo.length]);

// --- Column Definitions (Memoizadas y Refactorizadas) ---
const columns = useMemo(() => [
  { key: "descripcion", label: "Descripción Tipo Nodo", sortable: true, className: "col-60", },
  { key: "icono", label: "Icono", sortable: true, className: "col-20", },
  { key: "detalle", label: "Detalle", className: "col-10", render: (item) => (
      <ToggleSwitch
        checked={item.detalle}
        onChange={() => {}}
        disabled
        size="small"
      />
    ) },
  {
    key: "acciones", label: "Acciones", className: "col-10",
    render: (item) => (
      <div className="table-actions">
        {/* <<< BOTÓN EDITAR NUEVO >>> */}
        <FormButton
          icon={<FaEdit />} // Usar icono de editar
          onClick={() => handleAbrirModalEditar(item)} // Llama a la nueva función
          size="small"
          variant="subtle" // O 'default', 'outline'
          title="Editar Tipo de Nodo"
          aria-label={`Editar tipo de nodo ${item.descripcion}`}
        />
        <FormButton
          icon={<FaTrashAlt />}
          onClick={() => setTipoNodoAEliminar(item)}
          size="small"
          variant="subtle" // Usar variant="danger" para eliminar
          title="Eliminar Tipo de Nodo"
          aria-label={`Eliminar tipo nodo ${item.descripcion}`}
          isLoading={loadingStates[`delete-${item.idtiponodo}`]}
        />
      </div>
    )
  }
  // <<< ACTUALIZAR DEPENDENCIAS >>>
], [handleAbrirModalEditar, setTipoNodoAEliminar, loadingStates]); // Quitar handleEdit, actualizarTipoNodo si ya no se usan directamente aquí
  // --- Render ---
  return (
    <Container as="main" className="page-container tipos-nodo-page" maxWidth="90rem" centered padding="1rem">
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
        // autoCloseDelay={3000} // Opcional
      />

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Tipos de Nodo
      </Titulo>

      {/* Toolbar: SearchBar y Botón Crear */}
      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
             <div className="toolbar-left"> {/* <<<< Contenedor para SearchBar */}
               <SearchBar
                 value={filtro}
                 onChange={(e) => setFiltro(e.target.value)}
                 placeholder="Buscar tipos de nodos..."
                 aria-label="Buscar  tipos de nodos"
                 className=" .tipos-nodo__search-input"     
               />
             </div>
             <div className="toolbar-right"> {/* <<<< Contenedor para el botón */}
               <FormButton
                  icon={<FaPlus />}
                  label="Crear Tipo Nodo"
                  onClick={handleAbrirModalCrear} 
                  size="small"
               />
             </div>
      </Container>

      {/* Tabla y Paginación --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando Tipos de Nodo..." size="large" />
        ) : paginatedTipoNodo.length > 0 ? (
          <>
            <DataTable
              rowIdKey="idtiponodo"
              data={paginatedTipoNodo}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              editable={false}
            />
            {totalPages > 1 && (
              <Container padding="1rem 0 0 0" background="transparent"> {/* Contenedor para paginación */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={sortedTiposNodo.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo={true}
                />
              </Container>
            )}
          </>
        ) : (
          <Parrafo align="center" margin="2rem 0">
            {filtro ? "No se encontraron tipos de nodos con los criterios de búsqueda." : "No hay tipos de nodos registradas."}
          </Parrafo>
        )}
      </Container>

       {/* Modal de Formulario para Crear/Editar */}
      {isTipoNodoModalOpen && ( // Renderizar solo si está abierto para evitar manejar estado del form innecesariamente
          <TipoNodoFormModal
            isOpen={isTipoNodoModalOpen}
            onClose={handleCerrarModal}
            onSubmit={handleFormSubmit}
            initialData={tiponodoActualParaModal}
            mode={modoModal}
            isLoading={isSubmittingModal}
          />
      )}

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!tipoNodoAEliminar}
        title={`¿Eliminar Tipo de Nodo "${tipoNodoAEliminar?.descripcion || ''}"?`}
        message="Esta acción eliminará permanentemente el tipo de nodo. Asegúrate de que no esté en uso."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (tipoNodoAEliminar) eliminarTipoNodo(tipoNodoAEliminar.idtiponodo); }}
        onCancel={() => setTipoNodoAEliminar(null)}
        confirmVariant="default"
      />
    </Container>
  );
};

export default TiposNodo;