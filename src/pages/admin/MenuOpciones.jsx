// src/pages/admin/MenuOpciones.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

// Import Core Components
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import ToggleSwitch from "../../components/ToggleSwitch";
import SearchBar from "../../components/SearchBar";
import FormSelect from "../../components/FormSelect";
import DataTable from "../../components/DataTable";
import Container from "../../components/Container"; // <<< Importar Container
import Titulo from "../../components/Titulo";     // <<< Importar Titulo
import { FaPlus, FaSave, FaTrashAlt } from "react-icons/fa";

// Import page-specific styles (optional, if Container doesn't cover everything)
import "../../styles/pages/_MenuOpciones.css";

const MenuOpciones = () => {
  // ... (estados: nuevoItem, categorias, opciones, filtro, sort, notificacion, opcionAEliminar, loadingStates) ...
  const [nuevoItem, setNuevoItem] = useState({
    categoria_id: "", padre_id: "", nombre: "", ruta: "", icono: "", orden: "", activo: true
  });
  const [categorias, setCategorias] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [opcionAEliminar, setOpcionAEliminar] = useState(null); // Store the whole object now
  const [loadingStates, setLoadingStates] = useState({});

  const mostrarNotificacion = useCallback((msg) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 3000);
  }, []);

  const setLoading = (id, action, isLoading) => {
      setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));
  };

  // --- Fetch Functions (useCallback) ---
  const fetchCategorias = useCallback(async () => {
    // ... (sin cambios)
     try {
       const res = await axios.get("http://localhost:3000/api/menu/categorias", { withCredentials: true });
       setCategorias(res.data);
     } catch (err) {
       mostrarNotificacion("Error al cargar categorías ❌");
       console.error("Error fetchCategorias:", err);
     }
  }, [mostrarNotificacion]);

  const fetchOpciones = useCallback(async (currentCategorias) => {
    const cats = currentCategorias || categorias;
    if (cats.length === 0) return;
    try {
      const res = await axios.get("http://localhost:3000/api/menu/opciones", { withCredentials: true });
      const opcionesData = res.data;
      const enrichedOpciones = opcionesData.map(op => ({
          ...op,
          // Ensure IDs are numbers coming from API if possible, otherwise parse here
          opcion_id: parseInt(op.opcion_id),
          categoria_id: parseInt(op.categoria_id),
          padre_id: op.padre_id ? parseInt(op.padre_id) : null,
          orden: op.orden !== null ? parseInt(op.orden) : null,
          activo: Boolean(op.activo), // Ensure boolean
          // Enrichment
          nombre_categoria: cats.find(cat => cat.categoria_id === parseInt(op.categoria_id))?.nombre || `Cat ID ${op.categoria_id}`,
          nombre_padre: op.padre_id ? (opcionesData.find(padre => padre.opcion_id === parseInt(op.padre_id))?.nombre || `Padre ID ${op.padre_id}`) : '---'
      }));
      setOpciones(enrichedOpciones);
    } catch (err) {
      mostrarNotificacion("Error al cargar opciones ❌");
      console.error("Error fetchOpciones:", err);
    }
  }, [categorias, mostrarNotificacion]); // Added categorias dependency explicitly


  useEffect(() => { fetchCategorias(); }, [fetchCategorias]);
  useEffect(() => { if (categorias.length > 0) { fetchOpciones(categorias); } }, [categorias, fetchOpciones]);


  // --- Select Options (useMemo) ---
  const opcionesCategorias = useMemo(() => categorias.map(cat => ({
    value: cat.categoria_id.toString(), // Value MUST be string for FormSelect
    label: cat.nombre
  })), [categorias]);

  const opcionesPadre = useMemo(() => [
    { value: "", label: "--- Ninguno ---" }, // value is "" string
    ...opciones
       // Optional: Filter out the item itself from being its own parent
       // .filter(p => p.opcion_id !== itemCurrentlyBeingEditedId) // Needs context if used inline
      .map(op => ({
        value: op.opcion_id.toString(), // Value MUST be string
        label: op.nombre
      }))
  ], [opciones]); // Regenerate when opciones change

  // --- Form Handlers ---
  const handleNuevoItemChange = (e) => {
    const { name, value } = e.target;
    setNuevoItem(prev => ({ ...prev, [name]: value }));
  };
  const handleNuevoToggleChange = (e) => {
    setNuevoItem(prev => ({ ...prev, activo: e.target.checked }));
  };

  // --- CRUD ---
  const addOpcion = async () => {
    // ... (validation) ...
     if (!nuevoItem.categoria_id || !nuevoItem.nombre) {
         mostrarNotificacion("Categoría y Nombre son requeridos ⚠️");
         return;
     }
    setLoading('new', 'add', true);
    try {
      // Parse values just before sending
      const payload = {
          nombre: nuevoItem.nombre,
          ruta: nuevoItem.ruta || null, // Send null if empty
          icono: nuevoItem.icono || null, // Send null if empty
          activo: nuevoItem.activo,
          categoria_id: parseInt(nuevoItem.categoria_id), // Comes as string from select
          padre_id: nuevoItem.padre_id ? parseInt(nuevoItem.padre_id) : null, // Comes as string "" or "id"
          orden: nuevoItem.orden === "" || nuevoItem.orden === null ? 0 : parseInt(nuevoItem.orden) || 0,
      };
      await axios.post("http://localhost:3000/api/menu/opciones", payload, { withCredentials: true });
      // ... (success handling, reset form, fetch) ...
       mostrarNotificacion("Opción creada exitosamente ✅");
       setNuevoItem({ categoria_id: "", padre_id: "", nombre: "", ruta: "", icono: "", orden: "", activo: true });
       await fetchOpciones();
    } catch (err) {
       mostrarNotificacion(`Error al crear opción: ${err.response?.data?.message || err.message} ❌`);
       console.error("Error addOpcion:", err.response?.data || err.message);
    } finally {
       setLoading('new', 'add', false);
    }
  };

  // leerá los datos directamente del estado 'opciones'
  const updateOpcion = async (id) => {
    const datos = opciones.find(op => op.opcion_id === id);
    if (!datos) {
        mostrarNotificacion("Error: No se encontró la opción para actualizar ❌");
        return;
    }

    setLoading(id, 'save', true);
    let payload; // <<< Declarar payload aquí fuera del try para el logging en catch

    try {
        // Los datos del estado YA DEBERÍAN tener los tipos correctos (number/null/boolean)
        // debido a la lógica en fetchOpciones y handleEdit
        payload = { // <<< Definir payload DENTRO del try
            nombre: datos.nombre,
            ruta: datos.ruta || null, // Ensure null if empty
            icono: datos.icono || null, // Ensure null if empty
            activo: datos.activo, // Should be boolean
            categoria_id: datos.categoria_id, // Should be number
            padre_id: datos.padre_id, // Should be number or null
            // Ajuste: Enviar null si el orden es null, o 0 si es undefined/inválido
            orden: datos.orden === null ? null : (Number.isInteger(datos.orden) ? datos.orden : 0),
        };

         // Validación opcional de tipos antes de enviar (si es necesario)
         if (typeof payload.categoria_id !== 'number' || isNaN(payload.categoria_id)) {
             throw new Error(`Categoría ID inválido para opción ${id}: ${payload.categoria_id}`);
          }
         if (payload.padre_id !== null && (typeof payload.padre_id !== 'number' || isNaN(payload.padre_id))) {
             throw new Error(`Padre ID inválido para opción ${id}: ${payload.padre_id}`);
          }
          if (payload.orden !== null && (typeof payload.orden !== 'number' || isNaN(payload.orden))) {
               throw new Error(`Orden inválido para opción ${id}: ${payload.orden}`);
           }


        await axios.put(`http://localhost:3000/api/menu/opciones/${id}`, payload, { withCredentials: true });
        mostrarNotificacion("Opción actualizada ✅");
        // fetchOpciones(); // Opcional: refrescar para asegurar consistencia total
    } catch (err) {
        // <<< Ahora payload está disponible aquí si se definió antes del error
        console.error("Error updateOpcion - ID:", id, "Datos Originales:", datos, "Payload Intentado:", payload);
        mostrarNotificacion(`Error al actualizar: ${err.response?.data?.message || err.message} ❌`);
        await fetchOpciones(); // Revertir cambios optimistas
    } finally {
        setLoading(id, 'save', false);
    }
};

  const deleteOpcion = async (id) => {
      // ... (setLoading true) ...
       setLoading(id, 'delete', true);
      try {
        await axios.delete(`http://localhost:3000/api/menu/opciones/${id}`, { withCredentials: true });
          mostrarNotificacion("Opción eliminada ✅");
          await fetchOpciones();
      } catch (err) {
          mostrarNotificacion(`Error al eliminar: ${err.response?.data?.message || err.message} ❌`);
          console.error("Error deleteOpcion:", err.response?.data || err.message);
      } finally {
          setOpcionAEliminar(null);
          // setLoading(id, 'delete', false); // No needed if row disappears
      }
  };

  const handleEdit = useCallback((id, field, value) => {
      setOpciones(prev =>
          prev.map(opcion => {
              if (opcion.opcion_id === id) {
                  let parsedValue = value; // Valor por defecto

                  // Parsear específicamente según el campo
                  if (field === 'categoria_id') {
                      parsedValue = parseInt(value); // value es string del select
                  } else if (field === 'padre_id') {
                      parsedValue = value === "" ? null : parseInt(value); // value es string "" o "id"
                  } else if (field === 'orden') {
                      parsedValue = value === "" || value === null ? null : parseInt(value) || 0; // value es string/null
                  } else if (field === 'activo') {
                      parsedValue = Boolean(value); // value es boolean del toggle
                  }
                  // Para nombre, ruta, icono, el valor (string) es correcto

                  const updatedItem = { ...opcion, [field]: parsedValue };

                  // --- Actualizar nombres enriquecidos si cambian los IDs ---
                  if (field === 'categoria_id') {
                      updatedItem.nombre_categoria = categorias.find(cat => cat.categoria_id === parsedValue)?.nombre || `Cat ID ${parsedValue}`;
                  }
                  if (field === 'padre_id') {
                      updatedItem.nombre_padre = parsedValue !== null ? (prev.find(padre => padre.opcion_id === parsedValue)?.nombre || `Padre ID ${parsedValue}`) : '---';
                  }
                  // --- Fin Actualizar Nombres ---

                  return updatedItem;
              }
              return opcion;
          })
      );
  }, [categorias]); // Ahora solo depende de categorias para enriquecer

   // --- Filtering & Sorting (useMemo) ---
   const opcionesFiltradas = useMemo(() => opciones.filter((op) => {
     // ... (lógica de filtrado sin cambios) ...
       const search = filtro.toLowerCase();
       return (
         op.nombre?.toLowerCase().includes(search) ||
         op.ruta?.toLowerCase().includes(search) ||
         op.icono?.toLowerCase().includes(search) ||
         String(op.orden ?? '').toLowerCase().includes(search) ||
         op.nombre_categoria?.toLowerCase().includes(search) ||
         op.nombre_padre?.toLowerCase().includes(search)
       );
   }), [opciones, filtro]);

   const sortedOpciones = useMemo(() => [...opcionesFiltradas].sort((a, b) => {
     // ... (lógica de ordenamiento sin cambios) ...
       if (!sortColumn) return 0;
       const getSortValue = (item, column) => {
           const val = item[column];
           if (column === 'orden') { return val === null || val === undefined ? (sortDirection === 'asc' ? -Infinity : Infinity) : Number(val); }
           if (typeof val === 'boolean') { return String(val); }
           return String(val ?? '').toLowerCase();
       };
       const aVal = getSortValue(a, sortColumn);
       const bVal = getSortValue(b, sortColumn);
       if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
       if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
       return 0;
   }), [opcionesFiltradas, sortColumn, sortDirection]);


  const handleSort = useCallback((column) => {
      // ... (sin cambios) ...
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  // --- Column Definitions (useMemo) ---
  const columns = useMemo(() => [
        // ... (Columnas: nombre, ruta, icono - necesitan render con FormInput ahora) ...
        { key: "nombre", label: "Nombre", className: "col-15", sortable: true,
           render: (item) => (<FormInput name={`nombre-${item.opcion_id}`} value={item.nombre} onChange={e => handleEdit(item.opcion_id, 'nombre', e.target.value)} aria-label={`Nombre para ${item.nombre}`}/>)
        },
        { key: "ruta", label: "Ruta", className: "col-15", sortable: true,
           render: (item) => (<FormInput name={`ruta-${item.opcion_id}`} value={item.ruta ?? ''} onChange={e => handleEdit(item.opcion_id, 'ruta', e.target.value)} aria-label={`Ruta para ${item.nombre}`}/>)
        },
        { key: "icono", label: "Ícono", className: "col-10", sortable: true,
           render: (item) => (<FormInput name={`icono-${item.opcion_id}`} value={item.icono ?? ''} onChange={e => handleEdit(item.opcion_id, 'icono', e.target.value)} aria-label={`Ícono para ${item.nombre}`}/>)
        },
        { key: "orden", label: "Orden", className: "col-05 u-text-center", sortable: true,
           render: (item) => (<FormInput type="number" name={`orden-${item.opcion_id}`} value={item.orden ?? ''} onChange={e => handleEdit(item.opcion_id, 'orden', e.target.value)} aria-label={`Orden para ${item.nombre}`} className="input-field--align-center"/>) // Added centering class
        },
        { key: "nombre_categoria", label: "Categoría", className: "col-15", sortable: true,
            render: (item) => (
            <FormSelect
                name={`categoria-${item.opcion_id}`}
                value={item.categoria_id?.toString() ?? ""} // Select necesita string
                options={opcionesCategorias}
                onChange={(e) => handleEdit(item.opcion_id, "categoria_id", e.target.value)} // Pasar string
                aria-label={`Categoría para ${item.nombre}`}
            /> ),
        },
        { key: "nombre_padre", label: "Padre", className: "col-15", sortable: true,
            render: (item) => (
            <FormSelect
                name={`padre-${item.opcion_id}`}
                value={item.padre_id?.toString() ?? ""} // Select necesita string "" para null
                options={opcionesPadre}
                onChange={(e) => handleEdit( item.opcion_id, "padre_id", e.target.value ) } // Pasar string "" o "id"
                aria-label={`Opción padre para ${item.nombre}`}
            /> ),
        },
        { key: "activo", label: "Activo", className: "col-05 u-text-center", sortable: true,
            render: (item) => (
                <div className="u-flex u-justify-center">
                    <ToggleSwitch
                        id={`activo-${item.opcion_id}`}
                        checked={item.activo} // Ya debería ser boolean
                        onChange={(e) => handleEdit(item.opcion_id, "activo", e.target.checked)} // Pasar boolean
                        size="small"
                        label=""
                        aria-label={`Activar/desactivar ${item.nombre}`}
                    />
                </div>
            ),
        },
        { key: "acciones", label: "Acciones", className: "col-10",
            render: (item) => ( 
                <div className="table-actions">
                    <FormButton
                        icon={<FaSave />}
                        onClick={() => updateOpcion(item.opcion_id)}
                        size="small"
                        variant="default"
                        title="Guardar Cambios"
                        aria-label={`Guardar cambios para ${item.nombre}`}
                        isLoading={loadingStates[`save-${item.opcion_id}`]}
                        loaderSize="small"
                    />
                    <FormButton
                        icon={<FaTrashAlt />}
                        onClick={() => setOpcionAEliminar(item)}
                        size="small"
                        variant="default"
                        title="Eliminar Opción"
                        aria-label={`Eliminar ${item.nombre}`}
                        isLoading={loadingStates[`delete-${item.opcion_id}`]}
                        loaderSize="small"
                    />
                </div>
            ),
        }
  ], [categorias, opciones, opcionesCategorias, opcionesPadre, handleEdit, handleSort, sortColumn, sortDirection, loadingStates, updateOpcion]); // Include updateOpcion if needed

  return (
    // Container principal de la página
    <Container as="main" className="page-container menu-opciones-page" maxWidth="80rem" centered padding="1rem 1rem">
      {/* Notificación */}
      {notificacion && <div className="notification-toast">{notificacion}</div>}

      {/* Título de la página */}
      <Titulo as="h2" className="page-title" align="center" margin="0 0 1rem 0">
        Administrador del Menú
      </Titulo>

      {/* --- Formulario de Creación en un Container --- */}
      <Container background="var(--background1)" className="form-card" padding="1.5rem 2rem" margin="0 auto 1rem auto" bordered maxWidth={"80rem"}>

         {/* Filas del formulario (pueden seguir usando divs o Contenedores anidados) */}
         <div className="form-row">
           <FormSelect name="categoria_id" value={nuevoItem.categoria_id} onChange={handleNuevoItemChange} options={opcionesCategorias} placeholder="Seleccione Categoría..." required containerClassName="form-col" />
           <FormSelect name="padre_id" value={nuevoItem.padre_id} onChange={handleNuevoItemChange} options={opcionesPadre} placeholder="Seleccione Opción Padre..." containerClassName="form-col" />
           <FormInput name="nombre" placeholder="Nombre de la opción" value={nuevoItem.nombre} onChange={handleNuevoItemChange} required containerClassName="form-col" />
         </div>
         <div className="form-row u-margin-top-sm"> {/* Añadir espacio entre filas si es necesario */}
            <FormInput name="ruta" placeholder="Ej: /usuarios" value={nuevoItem.ruta} onChange={handleNuevoItemChange} containerClassName="form-col" />
            <FormInput name="icono" placeholder="Ej: FaUsers" value={nuevoItem.icono} onChange={handleNuevoItemChange} containerClassName="form-col" />
            <FormInput name="orden" type="number" placeholder="Ej: 10" value={nuevoItem.orden} onChange={handleNuevoItemChange} containerClassName="form-col u-max-width-xs" />
            <ToggleSwitch name="activo" label="Activo" checked={nuevoItem.activo} onChange={handleNuevoToggleChange} containerClassName="form-col u-flex u-items-center u-self-end" />
            <FormButton icon={<FaPlus />} label="Crear Menú" size="small" variant="success" onClick={addOpcion} isLoading={loadingStates['add-new']} loaderSize="small" />
         </div>

      </Container> {/* <<< Fin Container del formulario */}

      {/* --- Barra de Búsqueda en su propio Container o div --- */}
      {/* Usar Container para controlar layout si es más complejo que un simple div */}
      <Container className="menu-opciones__toolbar" margin="0 auto 1rem auto" maxWidth="1200px" padding="0" background="transparent" >
          <SearchBar
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar Opciones...."
            aria-label="Buscar opciones de menú"
            className="menu-opciones__search-input" // Clase para ancho específico
          />
      </Container> {/* <<< Fin Container del toolbar */}

      {/* --- Tabla en un Container --- */}
      {/* Añadir padding, borde, etc. al contenedor de la tabla si se desea */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1.0rem" margin="0 auto" >
          <DataTable
              rowIdKey="opcion_id"
              data={sortedOpciones}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
          />
      </Container> {/* <<< Fin Container de la tabla */}

      {/* --- Confirm Dialog (no necesita Container propio) --- */}
      <ConfirmDialog
          isOpen={!!opcionAEliminar}
          title={`¿Eliminar Opción "${opcionAEliminar?.nombre || ''}"?`}
          message="Esta acción no se puede deshacer..."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={() => { if(opcionAEliminar) deleteOpcion(opcionAEliminar.opcion_id); }}
          onCancel={() => setOpcionAEliminar(null)}
          variant="danger"
        />
    </Container> // <<< Fin Container principal de página
  );
};

export default MenuOpciones;