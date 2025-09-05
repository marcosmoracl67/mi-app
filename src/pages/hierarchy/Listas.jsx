// src/pages/admin/Listas.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import Container from "../../components/Container";
import SearchBar from "../../components/SearchBar";
import FormButton from "../../components/FormButton";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import DataTable from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import Loader from "../../components/Loader";
import ToggleSwitch from "../../components/ToggleSwitch";
import ListasFormModal from "./ListasFormModal";
import listasService from "../../services/listasService";
import Titulo from "../../components/Titulo";
import Parrafo from "../../components/Parrafo";
import Alert from "../../components/Alert";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 10; // O un valor configurable

export default function Listas() {
  const [listas, setListas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [sortColumn, setSortColumn] = useState('Descripcion'); // Default sort
  const [sortDirection, setSortDirection] = useState("asc");
  const [listaActual, setListaActual] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [loadingStates, setLoadingStates] = useState({});
  const [listaAEliminar, setListaAEliminar] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 15;
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", type: "info", title: "" });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await listasService.obtenerListas();
      setListas(data || []);
    } catch (error) {
      console.error("Error al obtener listas:", error);
    } finally {
      setIsFetchingList(false); 
    }
  };
  fetchData();
}, []);


  useEffect(() => {
    const lower = filtro.toLowerCase();
    const filtrados = listas.filter((item) =>
      item.descripcion?.toLowerCase().includes(lower)
    );
    setListaFiltrada(filtrados);
    setPaginaActual(1);
  }, [filtro, listas]);

    // Estado de carga inicial
  const [isFetchingList, setIsFetchingList] = useState(true); 

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const start = (paginaActual - 1) * itemsPorPagina;
    return listaFiltrada.slice(start, start + itemsPorPagina);
  }, [paginaActual, listaFiltrada]);

  const handleAbrirModalCrear = () => {
    setModoModal("crear");
    setListaActual({ activo: true });
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = useCallback((item) => {
    setModoModal("editar");
    setListaActual(item);
    setModalAbierto(true);
  }, []);

  const handleSubmit = async (datos) => {
    const id = datos.lista_id;
    const isNuevo = modoModal === "crear";
    const key = isNuevo ? "create" : `update-${id}`;
    setLoadingStates((s) => ({ ...s, [key]: true }));
    try {
      if (isNuevo) {
        await listasService.crearLista(datos);
      } else {
        await listasService.actualizarLista(id, datos);
      }
      const data = await listasService.obtenerListas();
      setListas(data || []);
      setModalAbierto(false);
    } catch (e) {
      console.error("Error al guardar lista", e);
    } finally {
      setLoadingStates((s) => ({ ...s, [key]: false }));
    }
  };

  const handleConfirmarEliminar = async () => {
    const id = listaAEliminar?.lista_id;
    if (!id) return;
    setLoadingStates((s) => ({ ...s, [`delete-${id}`]: true }));
    try {
      await listasService.eliminarLista(id);
      const data = await listasService.obtenerListas();
      setListas(data || []);
    } catch (e) {
      console.error("Error al eliminar lista", e);
    } finally {
      setListaAEliminar(null);
      setLoadingStates((s) => ({ ...s, [`delete-${id}`]: false }));
    }
  };

  // --- Filtering & Sorting (Memoizados) ---
  const ListaFiltrados = useMemo(() => listas.filter(tn =>
    tn.descripcion?.toLowerCase().includes(filtro.toLowerCase()) || // <<< usar descripcion
    tn.icono?.toLowerCase().includes(filtro.toLowerCase())      // <<< AÑADIR filtro por icono
  ), [listas, filtro]);

    const sortedLista = useMemo(() => [...ListaFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    // Asumimos que la única columna ordenable es Descripcion (string)
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [ListaFiltrados, sortColumn, sortDirection]);

   // --- Paginación ---
      const paginatedLista = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
        return sortedLista.slice(firstPageIndex, lastPageIndex);
      }, [sortedLista, currentPage]);
    
      const totalPages = useMemo(() => Math.ceil(sortedLista.length / ITEMS_PER_PAGE), [sortedLista.length]);

  const columns = useMemo(() => [
    { key: "descripcion", label: "Descripción", sortable: true, className: "col-40" },
    { key: "orden", label: "Orden", sortable: true, className: "col-10" },
    { key: "detallenodo_id", label: "Detalle Nodo ID", className: "col-20" },
    {
      key: "activo", label: "Activo", className: "col-10",
      render: (item) => (
        <ToggleSwitch checked={item.activo} disabled onChange={() => {}} />
      ),
    },
    {
      key: "acciones", label: "Acciones", className: "col-20",
      render: (item) => (
        <div className="table-actions">
          <FormButton
            icon={<FaEdit />}
            onClick={() => handleAbrirModalEditar(item)}
            size="small"
            variant="subtle"
            title="Editar"
          />
          <FormButton
            icon={<FaTrashAlt />}
            onClick={() => setListaAEliminar(item)}
            size="small"
            variant="subtle"
            title="Eliminar"
            isLoading={loadingStates[`delete-${item.lista_id}`]}
          />
        </div>
      ),
    },
  ], [handleAbrirModalEditar, loadingStates]);

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
       Definición de Listas
      </Titulo>

      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
        <div className="toolbar-left"> {/* <<<< Contenedor para SearchBar */}
          <SearchBar
            placeholder="Buscar lista..."
            value={filtro}
            aria-label="Buscar lista..."
            onChange={(e) => setFiltro(e.target.value)}
            className=" .tipos-nodo__search-input"
          />
        </div> 
        <div className="toolbar-right"> {/* <<<< Contenedor para el botón */}
          <FormButton
            icon={<FaPlus />}
            label="Crear Lista"
            onClick={handleAbrirModalCrear} 
            size="small"
          />
        </div> 
      </Container>

     {/* Tabla y Paginación --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando Listas..." size="large" />
            ) : paginatedLista.length > 0 ? (
          <>
            <DataTable
              rowIdKey="lista_id"
              data={paginatedData}
              columns={columns}
              currentPage={paginaActual}
              totalItems={listaFiltrada.length}
              itemsPerPage={itemsPorPagina}
              onPageChange={setPaginaActual}
            />
            {totalPages > 1 && (
            <Container padding="1rem 0 0 0" background="transparent"> {/* Contenedor para paginación */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={sortedLista.length}
                itemsPerPage={ITEMS_PER_PAGE}
                showPageInfo={true}
              />
            </Container>
            )}
             </>
           ) : (
                    <Parrafo align="center" margin="2rem 0">
                      {filtro ? "No se encontraron Listas con los criterios de búsqueda." : "No hay Listas registradas."}
                    </Parrafo>
                  )}
        </Container>

      <ListasFormModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleSubmit}
        isLoading={loadingStates[modoModal === "crear" ? "create" : `update-${listaActual.lista_id}`]}
        datosLista={listaActual}
        onChange={setListaActual}
        modo={modoModal}
      />

      <ConfirmDialog
        isOpen={!!listaAEliminar}
        title="Eliminar Lista"
        message={`¿Está seguro que desea eliminar la lista "${listaAEliminar?.descripcion}"?`}
        onConfirm={handleConfirmarEliminar}
        onCancel={() => setListaAEliminar(null)}
        isLoadingConfirm={loadingStates[`delete-${listaAEliminar?.lista_id}`]}
      />
    </Container>
  );
}
