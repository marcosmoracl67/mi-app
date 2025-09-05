// src/pages/admin/Logs.jsx
// <<< 1. CORREGIR IMPORTACIONES >>>
import React, { useEffect, useState, useCallback, useMemo } from "react"; // React y Hooks básicos
import axios from "axios";

// Importar TODOS los componentes necesarios
import FormInput from "../../components/FormInput";
import DataTable from "../../components/DataTable";
import Container from "../../components/Container";
import Titulo from "../../components/Titulo";
import FormattedDate from "../../components/FormattedDate";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import FormDatePicker from "../../components/FormDatePicker"; // El nuevo DatePicker
import Parrafo from "../../components/Parrafo"; // Asegúrate que la ruta es correcta
import { es } from 'date-fns/locale'; // Locale para DatePicker

const Logs = () => {
  // --- Estados ---
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState('fecha_acceso');
  const [sortDirection, setSortDirection] = useState("desc");
  const [filtros, setFiltros] = useState({
      usuario: "",
      opcion: "",
      desde: null,
      hasta: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(14); // Puedes ajustar esto

  // --- Fetch Data ---
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/logs", { withCredentials: true });
       const parsedData = res.data.map(log => ({
           ...log,
           log_id: parseInt(log.log_id),
           fecha_acceso: new Date(log.fecha_acceso)
       }));
      setLogs(parsedData);
      setCurrentPage(1); // Resetear página
    } catch (err) {
      console.error("Error al obtener logs:", err.message);
      // Aquí podrías usar showAlert si tuvieras un estado global o local para Alert
    } finally {
        setIsLoading(false);
    }
  }, []); // No olvidar dependencias si se usan (ej: showAlert)

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // --- Handlers Filtros ---
  const handleFilterInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setFiltros(prev => ({ ...prev, [name]: value }));
      setCurrentPage(1);
  }, []);

  const handleDateChange = useCallback((name, date) => {
      const newDate = date instanceof Date && !isNaN(date) ? date : null;
       // Validación cruzada opcional
       if (name === 'desde' && filtros.hasta && newDate && newDate > filtros.hasta) {
           setFiltros(prev => ({ ...prev, [name]: newDate, hasta: null })); // Limpiar 'hasta'
           // Podrías mostrar una alerta aquí
       } else if (name === 'hasta' && filtros.desde && newDate && newDate < filtros.desde) {
            setFiltros(prev => ({ ...prev, [name]: newDate, desde: null })); // Limpiar 'desde'
            // Podrías mostrar una alerta aquí
       } else {
           setFiltros(prev => ({ ...prev, [name]: newDate }));
       }
      setCurrentPage(1);
  }, [filtros.desde, filtros.hasta]); // Dependencias para validación cruzada

  // --- Filtering ---
  const logsFiltrados = useMemo(() => logs.filter((log) => {
      const fechaLog = log.fecha_acceso; // Ya es Date
      // Asegurar que la comparación con 'hasta' incluya todo el día
      const hastaEndOfDay = filtros.hasta ? new Date(filtros.hasta.setHours(23, 59, 59, 999)) : null;

      return (
          (!filtros.usuario || log.user_name?.toLowerCase().includes(filtros.usuario.toLowerCase())) &&
          (!filtros.opcion || log.opcion_nombre?.toLowerCase().includes(filtros.opcion.toLowerCase())) &&
          (!filtros.desde || fechaLog >= filtros.desde) &&
          (!hastaEndOfDay || fechaLog <= hastaEndOfDay)
      );
  }), [logs, filtros]);

  // --- Sorting ---
  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
    setCurrentPage(1);
  }, [sortColumn, sortDirection]);

  const sortedLogs = useMemo(() => [...logsFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    if (sortColumn === 'fecha_acceso') {
        const dateA = a.fecha_acceso?.getTime() ?? 0;
        const dateB = b.fecha_acceso?.getTime() ?? 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [logsFiltrados, sortColumn, sortDirection]);

  // --- Pagination Calculation ---
  const totalItems = sortedLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentLogs = useMemo(() => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const lastItemIndex = firstItemIndex + itemsPerPage;
    return sortedLogs.slice(firstItemIndex, lastItemIndex);
  }, [sortedLogs, currentPage, itemsPerPage]);

  // --- Column Definitions ---
  const columns = useMemo(() => [
    {
      key: "fecha_acceso",
      label: "Fecha y Hora",
      sortable: true,
      render: (row) => <FormattedDate date={row.fecha_acceso} format="larga" />,
      className: "col-20"
    },
    { key: "user_name", label: "Usuario", sortable: true, className: "col-15" },
    { key: "opcion_nombre", label: "Opción Visitada", sortable: true, className: "col-20" },
    { key: "ip", label: "Dirección IP", sortable: false, className: "col-15" },
    { key: "user_agent", label: "Navegador/Dispositivo", sortable: false, className: "col-30" }
  ], []);

  // --- Render ---
  return (
    <Container as="main" className="page-container logs-page" maxWidth="90rem" centered padding="1rem">
      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Logs de Acceso al Sistema
      </Titulo>

      {/* Filtros */}
      <Container className="form-card logs__filters" background="var(--background1)" padding="1rem 1.5rem" margin="0 auto 1.5rem auto" bordered maxWidth="90rem">
        <div className="form-row">
          <FormInput
            name="usuario"
            placeholder="Filtrar por usuario..."
            value={filtros.usuario}
            onChange={handleFilterInputChange}
            containerClassName="form-col"
            aria-label="Filtrar por usuario" // Añadir aria-label si no hay label visible
          />
          <FormInput
            name="opcion"
            placeholder="Filtrar por opción..."
            value={filtros.opcion}
            onChange={handleFilterInputChange}
            containerClassName="form-col"
            aria-label="Filtrar por opción"
          />
          <FormDatePicker
           // label="Desde Fecha"
            name="desde"
            selectedDate={filtros.desde}
            onDateChange={(date) => handleDateChange('desde', date)}
            placeholder="Desde dd-MM-yyyy"
            dateFormat="dd-MM-yyyy"
            containerClassName="form-col"
            locale={es}
            maxDate={filtros.hasta || undefined}
            inputId="filtro-desde-fecha" // Añadir ID explícito para label
          />
           <FormDatePicker
            //label="Hasta Fecha"
            name="hasta"
            selectedDate={filtros.hasta}
            onDateChange={(date) => handleDateChange('hasta', date)}
            placeholder="Hasta dd-MM-yyyy"
            dateFormat="dd-MM-yyyy"
            containerClassName="form-col"
            locale={es}
            minDate={filtros.desde || undefined}
            inputId="filtro-hasta-fecha" // Añadir ID explícito para label
          />
        </div>
      </Container>

      {/* Tabla y Paginación */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader text="Cargando logs..." />
            </div>
          ) : totalItems > 0 ? (
            <>
              <DataTable
                rowIdKey="log_id"
                columns={columns}
                data={currentLogs}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage} // Simplificado si solo necesitas el setter
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                showPageInfo={true}
                showFirstLastButtons={true}
                maxPageNumbersDisplayed={5}
                className="u-margin-top-md" // Asumiendo que tienes esta clase de utilidad
              />
            </>
          ) : (
             <Parrafo align="center" margin="2rem 0">No se encontraron logs con los filtros aplicados.</Parrafo>
          )}
      </Container>
    </Container>
  );
};

export default Logs;