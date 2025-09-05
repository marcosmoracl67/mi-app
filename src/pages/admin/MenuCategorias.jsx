// src/pages/admin/MenuCategorias.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react"; // Add React import
import axios from "axios";
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa"; // Use FaTrashAlt
import ConfirmDialog from "../../components/ConfirmDialog";
import FormInput from "../../components/FormInput"; // Standardized
import FormButton from "../../components/FormButton"; // Standardized
import SearchBar from "../../components/SearchBar"; // Standardized
import DataTable from "../../components/DataTable"; // Standardized
import Container from "../../components/Container";
import Titulo from "../../components/Titulo";

// Assuming index.css imports necessary styles

const MenuCategorias = () => {
  const [categorias, setCategorias] = useState([]); // Renamed state for clarity
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('nombre'); // Default sort
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null); // Store object
  const [loadingStates, setLoadingStates] = useState({}); // Loading state for buttons

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    icono: "",
    orden: "" // Keep as string initially
  });

  const mostrarNotificacion = useCallback((mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 3000);
  }, []);

  const setLoading = (id, action, isLoading) => {
      setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));
  };


  const fetchCategorias = useCallback(async () => { // useCallback added
    try {
      const res = await axios.get("http://localhost:3000/api/menu/categorias", {
        withCredentials: true
      });
      // Parse data types upon fetching
      const parsedData = res.data.map(cat => ({
          ...cat,
          categoria_id: parseInt(cat.categoria_id),
          orden: cat.orden !== null ? parseInt(cat.orden) : null,
          // activo: Boolean(cat.activo) // Add if 'activo' column exists
      }));
      setCategorias(parsedData);
    } catch (err) {
      mostrarNotificacion("Error al cargar categorías ❌");
      console.error("Error al cargar categorías:", err.message);
    }
  }, [mostrarNotificacion]); // Dependency

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]); // Use fetchCategorias in dependency array

  const crearCategoria = async () => {
    if (!nuevaCategoria.nombre) {
        mostrarNotificacion("El nombre de la categoría es requerido ⚠️");
        return;
    }
    setLoading('new', 'add', true);
    try {
      const payload = {
          ...nuevaCategoria,
          // Parse orden just before sending, default to 0 if empty/invalid
          orden: nuevaCategoria.orden === "" || nuevaCategoria.orden === null ? 0 : parseInt(nuevaCategoria.orden) || 0
      };
      await axios.post("http://localhost:3000/api/menu/categorias", payload, {
        withCredentials: true
      });
      setNuevaCategoria({ nombre: "", icono: "", orden: "" }); // Reset form
      fetchCategorias(); // Refresh list
      mostrarNotificacion("Categoria creada exitosamente ✅");
    } catch (err) {
      mostrarNotificacion(`Error al crear la Categoria: ${err.response?.data?.message || err.message} ❌`);
      console.error("Error al crear Categoria:", err);
    } finally {
        setLoading('new', 'add', false);
    }
  };

  // --- EDIT HANDLER (for inline editing state update) ---
  const handleEdit = useCallback((id, field, value) => {
    setCategorias(prev =>
      prev.map(cat => {
        if (cat.categoria_id === id) {
          let parsedValue = value;
          if (field === 'orden') {
            // Allow empty string, parse to null or number later
            parsedValue = value;
          }
          return { ...cat, [field]: parsedValue };
        }
        return cat;
      })
    );
  }, []); // No dependencies needed

  // --- UPDATE Function (reads from state) ---
  const actualizarCategoria = async (categoria_id) => { // No longer needs 'datosCategoria'
    const datosCategoria = categorias.find(cat => cat.categoria_id === categoria_id); // Find current data in state

    if (!datosCategoria) {
        mostrarNotificacion("Error: No se encontró la categoría para actualizar ❌");
        return;
    }
    setLoading(categoria_id, 'save', true);
    let payload;

    try {
        // Prepare payload from the potentially edited state data
        payload = {
            nombre: datosCategoria.nombre,
            icono: datosCategoria.icono || null, // Send null if empty
            // Parse orden carefully before sending
            orden: datosCategoria.orden === "" || datosCategoria.orden === null ? null : (parseInt(datosCategoria.orden) || 0) // Send null or parsed number (default 0)
        };

        // Optional: Validation before sending
        if (payload.orden !== null && (typeof payload.orden !== 'number' || isNaN(payload.orden))) {
            throw new Error(`Orden inválido para categoría ${categoria_id}: ${payload.orden}`);
        }

      // Use axios PUT for consistency if desired, or keep fetch
      await axios.put(`http://localhost:3000/api/menu/categorias/${categoria_id}`, payload, {
          withCredentials: true
      });

      mostrarNotificacion("Categoría actualizada exitosamente ✅");
      // Optional: fetchCategorias() // Re-fetch for consistency if needed, otherwise rely on optimistic update
    } catch (error) {
      console.error("❌ Error al actualizar la Categoría - ID:", categoria_id, "Payload:", payload, error);
      mostrarNotificacion(`Error al Actualizar la Categoría: ${error.response?.data?.message || error.message} ❌`);
      fetchCategorias(); // Revert optimistic update on error
    } finally {
        setLoading(categoria_id, 'save', false);
    }
  };

  const eliminarCategoria = async (categoria_id) => {
    setLoading(categoria_id, 'delete', true); // Set loading before API call
    try {
      await axios.delete(`http://localhost:3000/api/menu/categorias/${categoria_id}`, {
        withCredentials: true
      });
      fetchCategorias(); // Refresh list
      mostrarNotificacion("Categoría eliminada 🗑️");
    } catch (error) {
      console.error("Error al eliminar Categoría", error);
      mostrarNotificacion(`Error al eliminar la Categoria: ${error.response?.data?.message || error.message} ❌`);
    } finally {
        setCategoriaAEliminar(null); // Close confirmation dialog
       // No need to set loading false if row disappears
    }
  };

  // --- Filtering & Sorting (Keep original logic, ensure it works) ---
  const categoriasFiltradas = useMemo(() => categorias.filter(cat => // Use useMemo
    Object.values(cat).some(val =>
      String(val ?? '').toLowerCase().includes(filtro.toLowerCase()) // Safer check
    )
  ), [categorias, filtro]); // Dependencies

  const sortedCategorias = useMemo(() => [...categoriasFiltradas].sort((a, b) => { // Use useMemo
    if (!sortColumn) return 0;
    // Adjust sorting logic if needed for numbers vs strings
    const aVal = (sortColumn === 'orden') ? (a[sortColumn] ?? -Infinity) : String(a[sortColumn] ?? '').toLowerCase();
    const bVal = (sortColumn === 'orden') ? (b[sortColumn] ?? -Infinity) : String(b[sortColumn] ?? '').toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [categoriasFiltradas, sortColumn, sortDirection]); // Dependencies

  const handleSort = useCallback((column) => { // useCallback
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]); // Dependencies

  // --- Column Definitions (Standardized) ---
  const columns = useMemo(() => [
    { key: "nombre", label: "Nombre", sortable: true, className: "col-50",
      render: (item) => (<FormInput label="" name={`nombre-${item.categoria_id}`} value={item.nombre} onChange={e => handleEdit(item.categoria_id, 'nombre', e.target.value)} aria-label={`Nombre para ${item.nombre}`} />)
    },
    { key: "icono", label: "Icono", sortable: true, className: "col-20",
      render: (item) => (<FormInput label="" name={`icono-${item.categoria_id}`} value={item.icono ?? ''} onChange={e => handleEdit(item.categoria_id, 'icono', e.target.value)} aria-label={`Icono para ${item.nombre}`} />)
    },
    { key: "orden", label: "Orden", sortable: true, className: "col-20 u-text-center", // <<< Centered class
      render: (item) => (<FormInput label="" type="number" name={`orden-${item.categoria_id}`} value={item.orden ?? ''} onChange={e => handleEdit(item.categoria_id, 'orden', e.target.value)} aria-label={`Orden para ${item.nombre}`} className="input-field--align-center" />) // <<< Centered input
    },
    { key: "acciones", label: "Acciones", className: "col-10", // <<< Adjusted width
      render: (item) => (
        <div className="table-actions">
          <FormButton
            icon={<FaSave />}
            onClick={() => actualizarCategoria(item.categoria_id)} // <<< Calls updated function
            size="small"
            variant="default" // Or outline
            title="Guardar Cambios"
            aria-label={`Guardar cambios para ${item.nombre}`}
            isLoading={loadingStates[`save-${item.categoria_id}`]}
            loaderSize="small"
          />
          <FormButton
            icon={<FaTrashAlt />} // <<< Updated Icon
            onClick={() => setCategoriaAEliminar(item)} // <<< Pass item object
            size="small"
            variant="default" // <<< Use danger variant
            title="Eliminar Categoría"
            aria-label={`Eliminar ${item.nombre}`}
            // isLoading={loadingStates[`delete-${item.categoria_id}`]} // Optional loading
            loaderSize="small"
          />
        </div>
      ),
    }
  ], [handleEdit, actualizarCategoria, loadingStates]); // Dependencies for memoization

  return (
    <Container as="main" className="page-container menu-categorias-page" maxWidth="80rem" centered padding="1rem"> {/* Added specific page class */}
      {notificacion && <div className="notification-toast">{notificacion}</div>}

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Categorías
      </Titulo>

      {/* --- Formulario Creación --- */}
      <Container background="var(--background1)" className="form-card" padding="1.5rem 2rem" margin="0 auto 1.5rem auto" bordered maxWidth="80rem">
        <div className="form-row">
            {/* Removed label props as requested */}
          <FormInput name="nombre" placeholder="Nombre Categoría" value={nuevaCategoria.nombre} onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })} required containerClassName="form-col"/>
          <FormInput name="icono" placeholder="Ícono (Ej: FaList)" value={nuevaCategoria.icono} onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, icono: e.target.value })} containerClassName="form-col"/>
          <FormInput name="orden" type="number" placeholder="Orden" value={nuevaCategoria.orden} onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, orden: e.target.value })} containerClassName="form-col u-max-width-xs"/>
           {/* Botón Crear */}
           <FormButton
                icon={<FaPlus />}
                label="Crear Categoría"
                size="small" // Consistent size
                variant="success"
                onClick={crearCategoria}
                isLoading={loadingStates['add-new']}
                loaderSize="small"
                containerClassName="form-col fixed u-self-end" // Align button
            />
        </div>
        {/* Removed separate form-actions div */}
      </Container>

      {/* --- Toolbar --- */}
      <Container className="menu-opciones__toolbar" margin="0 auto 1rem auto" maxWidth="1200px" padding="0" background="transparent" >
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar Categorías..."
          aria-label="Buscar categorías de menú"
          className="menu-categorias__search-input" // Class for width control
        />
      </Container>

      {/* --- Tabla --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        <DataTable
          rowIdKey="categoria_id" // Verify this key
          columns={columns} // Standardized columns
          data={sortedCategorias} // Data source
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort} // Sorting handler
          // editable and onEdit props REMOVED
        />
      </Container>

      {/* --- Confirm Dialog --- */}
      <ConfirmDialog
        isOpen={!!categoriaAEliminar}
        title={`¿Eliminar Categoría "${categoriaAEliminar?.nombre || ''}"?`}
        message="Se eliminarán la categoría y todas las opciones de menú asociadas a ella. Esta acción no se puede deshacer." // More specific message
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => {
          if (categoriaAEliminar) eliminarCategoria(categoriaAEliminar.categoria_id);
        }}
        onCancel={() => setCategoriaAEliminar(null)}
        confirmVariant="danger" // Use correct prop name
      />
    </Container>
  );
};

export default MenuCategorias;