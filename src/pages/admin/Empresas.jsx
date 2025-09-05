// src/pages/admin/Empresas.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FaTrashAlt, FaPlus, FaEdit } from "react-icons/fa";

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
import EmpresaFormModal from "./EmpresaFormModal"; 

const ITEMS_PER_PAGE = 10; // O un valor configurable

const Empresas = () => {
  // --- Estados ---
  const [empresas, setEmpresas] = useState([]);
  const [sortColumn, setSortColumn] = useState("nombre_empresa");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filtro, setFiltro] = useState("");
  
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", type: "info", title: "" });
  const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
  const [loadingStates, setLoadingStates] = useState({}); // Para botones de acción en tabla (guardar modal, eliminar)

  // Estados para el Modal de Formulario
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
  const [empresaActualParaModal, setEmpresaActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState("crear"); // 'crear' o 'editar'
  const [isSubmittingModal, setIsSubmittingModal] = useState(false); // Para el botón de guardar del modal

  // Estado de carga inicial
  const [isFetchingList, setIsFetchingList] = useState(true);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  // --- Utilidades ---
  const mostrarNotificacion = useCallback((message, type = "info", title = "") => {
    setAlertInfo({ isOpen: true, message, type, title });
    // Opcional: auto-cierre si no se usa el botón de cierre del Alert
    // setTimeout(() => setAlertInfo(prev => ({ ...prev, isOpen: false })), 3000);
  }, []);

  // Para botones de acción en tabla (solo eliminar, el guardar ahora es del modal)
  const setLoadingAction = useCallback((id, action, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));
  }, []);

  // --- Fetch Data ---
  const fetchEmpresas = useCallback(async () => {
    setIsFetchingList(true);
    try {
      const response = await axios.get("http://localhost:3000/api/empresas", { withCredentials: true });
      const parsedData = response.data.map(e => ({ ...e, empresa_id: parseInt(e.empresa_id) }));
      setEmpresas(parsedData);
    } catch (error) {
      mostrarNotificacion("Error al obtener empresas ❌", "error");
      console.error("Error fetchEmpresas:", error);
    } finally {
      setIsFetchingList(false);
    }
  }, [mostrarNotificacion]);

  useEffect(() => { fetchEmpresas(); }, [fetchEmpresas]);

  // --- CRUD ---
  // Crear y Actualizar ahora se manejan a través de un submit del modal
  const handleFormSubmit = useCallback(async (datosEmpresa) => {
    setIsSubmittingModal(true);
    const url = modoModal === 'crear'
      ? "http://localhost:3000/api/empresas"
      : `http://localhost:3000/api/empresas/${datosEmpresa.empresa_id}`;
    const method = modoModal === 'crear' ? 'post' : 'put';

    try {
      await axios[method](url, datosEmpresa, { withCredentials: true });
      await fetchEmpresas();
      mostrarNotificacion(
        modoModal === 'crear' ? "Empresa creada exitosamente ✅" : "Empresa actualizada con éxito ✨",
        "success"
      );
      setIsEmpresaModalOpen(false); // Cierra el modal en éxito
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      mostrarNotificacion(
        `Error al ${modoModal === 'crear' ? 'crear' : 'actualizar'} la empresa: ${errorMessage} ❌`,
        "error"
      );
      console.error(`Error ${modoModal}Empresa:`, error.response || error);
    } finally {
      setIsSubmittingModal(false);
    }
  }, [modoModal, fetchEmpresas, mostrarNotificacion]);


  const eliminarEmpresa = useCallback(async (id) => {
    const numericId = parseInt(id);
    setLoadingAction(numericId, 'delete', true);
    try {
      await axios.delete(`http://localhost:3000/api/empresas/${numericId}`, { withCredentials: true });
      await fetchEmpresas();
      mostrarNotificacion("Empresa eliminada 🗑️", "success");
      setCurrentPage(1); // Volver a la primera página después de eliminar
    } catch (error) {
      mostrarNotificacion(`Error al eliminar la empresa: ${error.response?.data?.message || error.message} ❌`, "error");
      console.error("Error eliminarEmpresa:", error.response || error);
    } finally {
      setEmpresaAEliminar(null);
      setLoadingAction(numericId, 'delete', false);
    }
  }, [fetchEmpresas, mostrarNotificacion, setLoadingAction]);

  // --- Manejadores del Modal ---
  const handleAbrirModalCrear = useCallback(() => {
    setModoModal('crear');
    // Para el modal, pasamos un objeto con la estructura esperada, pero vacío o con defaults
    setEmpresaActualParaModal({ nombre_empresa: "", nombre_responsable: "", telefono_responsable: "", correo_responsable: "", ciudad: "" });
    setIsEmpresaModalOpen(true);
  }, []);

  const handleAbrirModalEditar = useCallback((empresa) => {
    setModoModal('editar');
    setEmpresaActualParaModal({ ...empresa }); // Copia para el modal
    setIsEmpresaModalOpen(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setIsEmpresaModalOpen(false);
    // No es estrictamente necesario limpiar empresaActualParaModal aquí,
    // ya que se setea de nuevo al abrir.
  }, []);

  // --- Sorting Handler ---
  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
    setCurrentPage(1); // Resetear a la primera página al cambiar el orden
  }, [sortColumn, sortDirection]);

  // --- Filtering & Sorting ---
  const empresasFiltradas = useMemo(() => {
    setCurrentPage(1); // Resetear a la primera página al cambiar el filtro
    return empresas.filter(emp =>
      Object.values(emp).some(value =>
        String(value ?? '').toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [empresas, filtro]);

  const sortedEmpresas = useMemo(() =>
    [...empresasFiltradas].sort((a, b) => {
      if (!sortColumn) return 0;
      const aVal = String(a[sortColumn] ?? '').toLowerCase();
      const bVal = String(b[sortColumn] ?? '').toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }), [empresasFiltradas, sortColumn, sortDirection]);

  // --- Paginación ---
  const paginatedEmpresas = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedEmpresas.slice(firstPageIndex, lastPageIndex);
  }, [sortedEmpresas, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedEmpresas.length / ITEMS_PER_PAGE), [sortedEmpresas.length]);


  // --- Column Definitions ---
  const columns = useMemo(() => [
    { key: "nombre_empresa", label: "Nombre Empresa", sortable: true, className: "col-25" },
    { key: "nombre_responsable", label: "Responsable", sortable: true, className: "col-20" },
    { key: "telefono_responsable", label: "Teléfono", sortable: true, className: "col-15" },
    { key: "correo_responsable", label: "Correo", sortable: true, className: "col-20" },
    { key: "ciudad", label: "Ciudad", sortable: true, className: "col-10" },
    {
      key: "acciones", label: "Acciones", className: "col-10 actions-column",
      render: (item) => (
        <div className="table-actions">
          <FormButton
            icon={<FaEdit />}
            onClick={() => handleAbrirModalEditar(item)}
            size="small"
            variant="subtle"
            title="Editar Empresa"
            aria-label={`Editar ${item.nombre_empresa}`}
          />
          <FormButton
            icon={<FaTrashAlt />}
            onClick={() => setEmpresaAEliminar(item)}
            size="small"
            variant="subtle" // O 'danger'
            title="Eliminar Empresa"
            aria-label={`Eliminar ${item.nombre_empresa}`}
            isLoading={loadingStates[`delete-${item.empresa_id}`]}
            loaderSize="small"
          />
        </div>
      )
    }
  ], [handleAbrirModalEditar, loadingStates, setLoadingAction]); // Dependencias actualizadas


  // --- Render ---
  return (
    <Container as="main" className="page-container empresas-page" maxWidth="90rem" centered padding="1rem"> 
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
        // autoCloseDelay={3000} // Opcional
      />

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administrador de Empresas
      </Titulo>

      {/* Toolbar: SearchBar y Botón Crear */}
      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
        <div className="toolbar-left"> {/* <<<< Contenedor para SearchBar */}
          <SearchBar
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar empresa..."
            aria-label="Buscar empresas"
            className="empresas__search-input" // Aplicar la clase al SearchBar
          />
        </div>
        <div className="toolbar-right"> {/* <<<< Contenedor para el botón */}
          <FormButton
            icon={<FaPlus />}
            label="Crear Empresa"
            onClick={handleAbrirModalCrear}
            variant="success"
            size="small" // O el tamaño que prefieras
          />
        </div>
      </Container>

      {/* Tabla y Paginación --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando empresas..." size="large" />
        ) : paginatedEmpresas.length > 0 ? (
          <>
            <DataTable
              rowIdKey="empresa_id"
              data={paginatedEmpresas}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            {totalPages > 1 && (
              <Container padding="1rem 0 0 0" background="transparent"> {/* Contenedor para paginación */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={sortedEmpresas.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo={true}
                />
              </Container>
            )}
          </>
        ) : (
          <Parrafo align="center" margin="2rem 0">
            {filtro ? "No se encontraron empresas con los criterios de búsqueda." : "No hay empresas registradas."}
          </Parrafo>
        )}
      </Container>

      {/* Modal de Formulario para Crear/Editar */}
      {isEmpresaModalOpen && ( // Renderizar solo si está abierto para evitar manejar estado del form innecesariamente
          <EmpresaFormModal
            isOpen={isEmpresaModalOpen}
            onClose={handleCerrarModal}
            onSubmit={handleFormSubmit}
            initialData={empresaActualParaModal}
            mode={modoModal}
            isLoading={isSubmittingModal}
          />
      )}

      {/* ConfirmDialog para Eliminar */}
      <ConfirmDialog
        isOpen={!!empresaAEliminar}
        title={`¿Eliminar Empresa "${empresaAEliminar?.nombre_empresa || ''}"?`}
        message="Esta acción eliminará permanentemente la empresa seleccionada. ¿Está seguro?"
        confirmText="Eliminar Definitivamente"
        cancelText="Cancelar"
        onConfirm={() => { if (empresaAEliminar) eliminarEmpresa(empresaAEliminar.empresa_id); }}
        onCancel={() => setEmpresaAEliminar(null)}
        confirmVariant="default"
      />
    </Container>
  );
};

export default Empresas;