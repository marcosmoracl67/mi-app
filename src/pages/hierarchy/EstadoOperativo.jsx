// src/pages/hierarchy/EstadoOperativo.jsx
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
import Alert from "../../components/Alert"; 
import ToggleSwitch from '../../components/ToggleSwitch';

import TipoNodoFormModal from "./EstadoOperativoFormModal";


const ITEMS_PER_PAGE = 10; // O un valor configurable

const EstadoOperativo = () => {
  // --- Estados ---
  const [estadoOperativo, setestadoOperativo] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('Descripcion'); // Default sort
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [estadoOperativoAEliminar, setestadoOperativoAEliminar] = useState(null); // Store object
  const [loadingStates, setLoadingStates] = useState({});
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", type: "info", title: "" });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

    // Estados para el Modal de Formulario
  const [isestadoOperativoModalOpen, setIsestadoOperativoModalOpen] = useState(false);
  const [estadoOperativoActualParaModal, setestadoOperativoActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState("crear"); // 'crear' o 'editar'
  const [isSubmittingModal, setIsSubmittingModal] = useState(false); // Para el botón de guardar del modal

    // Estado de carga inicial
  const [isFetchingList, setIsFetchingList] = useState(true); 

  // --- Utilidades (Memoizadas) ---
  const mostrarNotificacion = useCallback((mensaje) => { setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000); }, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  // --- Fetch Data (Memoizada) ---
  const fetchEstadoOperativo = useCallback(async () => {

    try {
      const res = await axios.get("http://localhost:3000/api/estado-operativo", { withCredentials: true });
      const parsedData = res.data.map(tn => ({
          IdEstadoOperativo: parseInt(tn.IdEstadoOperativo), // Mapear a minúscula
          Nombre: tn.Nombre,         // Mapear a minúscula
          Descripcion: tn.Descripcion || tn.descripcion || "",   // Mapear a minúscula y manejar posible ausencia
          Activo: tn.Activo || false 
        }));
      setestadoOperativo(parsedData);
    } catch (error) {
      mostrarNotificacion("Error al cargar Estados Operativos ❌");
      console.error("Error al cargar Estados Operativos:", error.message);
      // Incluso en error, la "carga" ha terminado
    } finally {
      setIsFetchingList(false); // <<< AÑADIR ESTA LÍNEA
    }
    // <<< ACTUALIZAR DEPENDENCIAS DE useCallback >>>
  }, [mostrarNotificacion]); 

  // El useEffect que llama a fetchTiposNodo está bien
  useEffect(() => {
    // Opcional: Si quieres mostrar el loader cada vez que se refresca
    // setIsFetchingList(true);
    fetchEstadoOperativo();
  }, [fetchEstadoOperativo]);

  // --- CRUD ---
  // Crear y Actualizar ahora se manejan a través de un submit del modal
  const handleFormSubmit = useCallback(async (datosDelModal) => { // 'datosDelModal' viene del modal
  setIsSubmittingModal(true);

  const idParaActualizar = (modoModal === 'editar' && estadoOperativoActualParaModal)
                            ? estadoOperativoActualParaModal.IdEstadoOperativo
                            : null;

  // El payload para la API debe ser { descripcion: "..." }
  const payload = {
  Nombre: datosDelModal.Nombre,
  Descripcion: datosDelModal.Descripcion || null, 
  Activo: Boolean(datosDelModal.Activo)
  };

  const url = modoModal === 'crear'
    ? "http://localhost:3000/api/estado-operativo"
    : `http://localhost:3000/api/estado-operativo/${idParaActualizar}`; // Usar idParaActualizar

  const method = modoModal === 'crear' ? 'post' : 'put';

  if (modoModal === 'editar' && !idParaActualizar) {
      mostrarNotificacion("Error: ID del estado operativo no encontrado para actualizar.", "error");
      setIsSubmittingModal(false);
      return;
  }

  try {
    await axios[method](url, payload, { withCredentials: true }); // Enviar 'payload'
    await fetchEstadoOperativo();
    mostrarNotificacion(
      modoModal === 'crear' ? "Estado Operativo creado exitosamente ✅" : "Estado actualizado con éxito ✨",
    );
    setIsestadoOperativoModalOpen(false);
  } catch (error) {
    // ... (manejo de error)
  } finally {
    setIsSubmittingModal(false);
  }
}, [modoModal, fetchEstadoOperativo, mostrarNotificacion, estadoOperativoActualParaModal]); // Añadir tiponodoActualParaModal

  // --- Delete Function (Memoizada) ---
  const eliminarEstadoOperativo = useCallback(async (IdEstadoOperativo) => {
    const numericId = parseInt(IdEstadoOperativo);
    setLoading(numericId, 'delete', true);
    try {
      await axios.delete(`http://localhost:3000/api/estado-operativo/${numericId}`, { withCredentials: true });
      await fetchEstadoOperativo();
      mostrarNotificacion("Estado Operativo Eliminado 🗑️");
    } catch (error) {
      console.error("Error al eliminar el Estado Operativo", error);
      mostrarNotificacion(`Error al eliminar el Estado Operativo: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setestadoOperativoAEliminar(null);
      setLoading(numericId, 'delete', false); // Asegurar que se limpie el loading
    }
  }, [fetchEstadoOperativo, mostrarNotificacion, setLoading]);

   // --- Manejadores del Modal ---

const handleAbrirModalEditar = useCallback((EstadoOperativo) => {
  setModoModal('editar');
  setestadoOperativoActualParaModal({
    IdEstadoOperativo: EstadoOperativo.IdEstadoOperativo,
    Nombre: EstadoOperativo.Nombre,
    Descripcion: EstadoOperativo.Descripcion,
    Activo: EstadoOperativo.Activo ?? false
  });
  setIsestadoOperativoModalOpen(true);
}, []);



const handleAbrirModalCrear = useCallback(() => {
  setModoModal('crear');
  // Para el modal, pasamos un objeto con la estructura esperada, pero vacío o con defaults
  setestadoOperativoActualParaModal({ Nombre: "", Descripción: "" }); 
  setIsestadoOperativoModalOpen(true);
}, []);

const handleCerrarModal = useCallback(() => {
  setIsestadoOperativoModalOpen(false);
  setestadoOperativoActualParaModal(null); // Limpiar datos al cerrar
  setIsSubmittingModal(false); // Resetear estado de envío del modal
}, []);


  // --- Sorting Handler (Memoizado) ---
  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  // --- Filtering & Sorting (Memoizados) ---
  const EstadoOperativoFiltrados = useMemo(() => estadoOperativo.filter(tn =>
    tn.Nombre?.toLowerCase().includes(filtro.toLowerCase()) || 
    tn.Descripcion?.toLowerCase().includes(filtro.toLowerCase())      
  ), [estadoOperativo, filtro]);

  const sortedEstadoOperativo = useMemo(() => [...EstadoOperativoFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    // Asumimos que la única columna ordenable es Descripcion (string)
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [EstadoOperativoFiltrados, sortColumn, sortDirection]);
 
  // --- Paginación ---
  const paginatedEstadoOperativo = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedEstadoOperativo.slice(firstPageIndex, lastPageIndex);
  }, [sortedEstadoOperativo, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedEstadoOperativo.length / ITEMS_PER_PAGE), [sortedEstadoOperativo.length]);

// --- Column Definitions (Memoizadas y Refactorizadas) ---
const columns = useMemo(() => [
  { key: "Nombre", label: "Nombre de Estado Operativo", sortable: true, className: "col-20", },
  { key: "Descripcion", label: "Descripción del estado operativo", sortable: true, className: "col-60", },
  { key: "Activo", label: "Activo", className: "col-10", render: (item) => (
      <ToggleSwitch
        checked={item.Activo}
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
          icon={<FaEdit />} 
          onClick={() => handleAbrirModalEditar(item)} 
          size="small"
          variant="subtle" // O 'default', 'outline'
          title="Editar Estado Operativo"
          aria-label={`Editar Estado Operativo ${item.Descripcion}`}
        />
        <FormButton
          icon={<FaTrashAlt />}
          onClick={() => setestadoOperativoAEliminar(item)}
          size="small"
          variant="subtle" 
          title="Eliminar Estado Operativo"
          aria-label={`Eliminar Estado Operativo ${item.Descripcion}`}
          isLoading={loadingStates[`delete-${item.IdEstadoOperativo}`]|| false} 
        />
      </div>
    )
  }
], [handleAbrirModalEditar, setestadoOperativoAEliminar, loadingStates]); 
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
        Administración de Estados Operativos
      </Titulo>

      {/* Toolbar: SearchBar y Botón Crear */}
      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
             <div className="toolbar-left"> {/* <<<< Contenedor para SearchBar */}
               <SearchBar
                 value={filtro}
                 onChange={(e) => setFiltro(e.target.value)}
                 placeholder="Buscar Estados Operativos..."
                 aria-label="Buscar Estados Operativos"
                 className=" .tipos-nodo__search-input"     
               />
             </div>
             <div className="toolbar-right"> {/* <<<< Contenedor para el botón */}
               <FormButton
                  icon={<FaPlus />}
                  label="Crear Estados Operativos"
                  onClick={handleAbrirModalCrear} 
                  size="small"
               />
             </div>
      </Container>

      {/* Tabla y Paginación --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando Estados Operativos..." size="large" />
        ) : paginatedEstadoOperativo.length > 0 ? (
          <>
            <DataTable
              rowIdKey="IdEstadoOperativo" // Asegúrate de que este campo exista en tus datos
              data={paginatedEstadoOperativo}
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
                  totalItems={sortedEstadoOperativo.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo={true}
                />
              </Container>
            )}
          </>
        ) : (
          <Parrafo align="center" margin="2rem 0">
            {filtro ? "No se encontraron Estados Operativos con los criterios de búsqueda." : "No hay Estados Operativos registradas."}
          </Parrafo>
        )}
      </Container>

       {/* Modal de Formulario para Crear/Editar */}
      {isestadoOperativoModalOpen && ( // Renderizar solo si está abierto para evitar manejar estado del form innecesariamente
          <TipoNodoFormModal
            isOpen={isestadoOperativoModalOpen}
            onClose={handleCerrarModal}
            onSubmit={handleFormSubmit}
            initialData={estadoOperativoActualParaModal}
            mode={modoModal}
            isLoading={isSubmittingModal}
          />
      )}

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!estadoOperativoAEliminar}
        title={`¿Eliminar Tipo de Nodo "${estadoOperativoAEliminar?.Nombre || ''}"?`}
        message="Esta acción eliminará permanentemente el  Estado Operativo. Asegúrate de que no esté en uso."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (estadoOperativoAEliminar) eliminarEstadoOperativo(estadoOperativoAEliminar.IdEstadoOperativo); }}
        onCancel={() => setestadoOperativoAEliminar(null)}
        confirmVariant="default"
      />
    </Container>
  );
};

export default EstadoOperativo;