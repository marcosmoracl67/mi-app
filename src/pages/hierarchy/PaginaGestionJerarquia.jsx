// src/pages/hierarchy/PaginaGestionJerarquia.jsx
import { useState, useCallback, useRef, useEffect } from 'react'; 
import JerarquiaManager from './JerarquiaManager';
import DetalleNodoForm from './DetalleNodoForm';
import ResizablePanel from '../../components/ResizablePanel'; 
import { getDetalleFieldsByTipoNodo }  from '../../services/detalleNodeService';
import Titulo from '../../components/Titulo';
import Parrafo from '../../components/Parrafo';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import ConfirmDialog from '../../components/ConfirmDialog';
import Container from '../../components/Container';
import Tabs from '../../components/Tabs';
import * as jerarquiaService from '../../services/jerarquiaService';
import DynamicDetailForm from './DynamicDetailForm'; 
import DocumentUploader from '../../components/DocumentUploader';

import * as FaIcons from 'react-icons/fa';

const IconComponents = {
  FaArrowDown: FaIcons.FaArrowDown, FaBuilding: FaIcons.FaBuilding, FaSitemap: FaIcons.FaSitemap,
  FaTruck: FaIcons.FaTruck, FaProjectDiagram: FaIcons.FaProjectDiagram, FaLink: FaIcons.FaLink,
  FaAsterisk: FaIcons.FaAsterisk, FaGears: FaIcons.FaCogs, FaCogs: FaIcons.FaCogs, 
  FaCog: FaIcons.FaCog, FaCubes: FaIcons.FaCubes, FaIndustry: FaIcons.FaIndustry,
  FaQuestionCircle: FaIcons.FaQuestionCircle, FaAngleRight: FaIcons.FaAngleRight, FaAngleDown: FaIcons.FaAngleDown,
  FaPlus: FaIcons.FaPlus, FaMinus: FaIcons.FaMinus, FaUser: FaIcons.FaUser, FaBell: FaIcons.FaBell, 
  FaUserAstronaut: FaIcons.FaUserAstronaut, FaEdit: FaIcons.FaEdit, FaTrashAlt: FaIcons.FaTrashAlt, 
  FaChartBar: FaIcons.FaChartBar, FaSave: FaIcons.FaSave, FaClone: FaIcons.FaClone,
  FaInfoCircle: FaIcons.FaInfoCircle, 
  FaPaperclip: FaIcons.FaPaperclip, 
};

const PaginaGestionJerarquia = () => {
  const jerarquiaRef = useRef();

  const [nodoRaizDelArbol, setNodoRaizDelArbol] = useState(null);
  const [tiposNodoGlobal, setTiposNodoGlobal] = useState(new Map()); 
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const [modoFormulario, setModoFormulario] = useState('VIEW'); // MODO DE EDICIÓN DEL TAB 'NODO'
  const [datosFormulario, setDatosFormulario] = useState({});
  const [camposTipoNodo, setCamposTipoNodo] = useState([]);

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: '', type: 'info', title: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isLoading: false });

  const [ultimoPadreEliminadoId, setUltimoPadreEliminadoId] = useState(null); 
  const [forceRefetchTimestamp, setForceRefetchTimestamp] = useState(null); 
  const [idNodoAExpandirTrasCarga, setIdNodoAExpandirTrasCarga] = useState(null);
  const [createFormKey, setCreateFormKey] = useState(0); 
  const [hasDetalle, setHasDetalle] = useState(false);
  const [hasAdjuntos, setHasAdjuntos] = useState(false);
  const [activeTab, setActiveTab] = useState('nodo');

  // Nuevo estado para el ID del nodo a seleccionar después de la eliminación y recarga
  const [idNodoASeleccionarTrasEliminacion, setIdNodoASeleccionarTrasEliminacion] = useState(null);
  // Estado para guardar todos los nodos cargados del árbol
  const [todosLosNodosCargados, setTodosLosNodosCargados] = useState([]);


 // Consolidate field definition loading and calculation of hasDetalle/hasAdjuntos
  useEffect(() => {
    const cargarCamposTipoNodo = async () => {
      // Determine the type node ID, ensuring it's a number for the service call
      const tipoNodoId = parseInt(nodoSeleccionado?.IdTipoNodo ?? nodoSeleccionado?.idtiponodo, 10);
      
      // If no valid type ID, clear fields and flags and return
      if (isNaN(tipoNodoId)) {
        setCamposTipoNodo([]);
        setHasAdjuntos(false);
        setHasDetalle(false);
        return;
      }

      setIsLoadingForm(true); // Indicate loading for form details

      try {
        const data = await getDetalleFieldsByTipoNodo(tipoNodoId); 
        
        if (Array.isArray(data)) {
          setCamposTipoNodo(data);

          // Calculate hasAdjuntos and hasDetalle directly here
          const tiposAdjuntos = data.filter(c => ['file', 'img'].includes(c.tipodetalle));
          const tiposDetalles = data.filter(c =>
            ['desc', 'list', 'int', 'float', 'bool', 'date'].includes(c.tipodetalle)
          );
          setHasAdjuntos(tiposAdjuntos.length > 0);
          setHasDetalle(tiposDetalles.length > 0);
        } else {
          console.warn("⚠️ Respuesta inesperada al cargar campos de detalle (no es un array):", data);
          setCamposTipoNodo([]);
          setHasAdjuntos(false);
          setHasDetalle(false);
        }
      } catch (error) {
        console.error("❌ Error al cargar campos del tipo de nodo:", error);
        setCamposTipoNodo([]);
        setHasAdjuntos(false);
        setHasDetalle(false);
      } finally {
        setIsLoadingForm(false); // Finished loading for form details
      }
    };

    cargarCamposTipoNodo();
  }, [nodoSeleccionado?.IdNodo, nodoSeleccionado?.IdTipoNodo, nodoSeleccionado?.idtiponodo]);


  // --- FUNCIONES PRIMARIAS (DEPENDENCIAS) ---
  const handleNodoSeleccionado = useCallback((nodo) => {
    setNodoSeleccionado(nodo);
    setDatosFormulario({
        ...nodo,
        DescripcionOriginal: nodo.Descripcion,
        IdTipoNodo: nodo.IdTipoNodo != null ? String(nodo.IdTipoNodo) : '',
        Activo: nodo.Activo ?? true,
         Medido: Boolean(nodo.Medido ?? nodo.medido),  // Aceptar tanto 'Medido' como 'medido' desde el backend
        tieneHijos: nodo.tieneHijos ?? false,
        profundidad: nodo.profundidad ?? 0,
    });
    setModoFormulario('VIEW');
    setActiveTab('nodo');      
    setAlertInfo(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleClonar = useCallback(async () => {
    if (!nodoSeleccionado) {
      setAlertInfo({ isOpen: true, message: "No hay un nodo seleccionado para clonar.", type: "warning", title: "Acción Requerida" });
      return;
    }
    if (nodoSeleccionado.tieneHijos) { 
      setAlertInfo({ isOpen: true, message: "Solo se pueden clonar nodos que no tienen hijos.", type: "warning", title: "Acción no permitida" });
      return;
    }

    setIsLoadingForm(true);
    setAlertInfo(prev => ({ ...prev, isOpen: false }));

    try {
      const idPadreParaPayload = typeof nodoSeleccionado.IdPadre === 'number' ? nodoSeleccionado.IdPadre : null;
      const idTipoNodoParaPayload = parseInt(nodoSeleccionado.IdTipoNodo); 

      const payload = {
      descripcion: `${nodoSeleccionado.Descripcion} [Clon]`,
      idPadre: idPadreParaPayload,
      idTipoNodo: idTipoNodoParaPayload,
      activo: Boolean(nodoSeleccionado.Activo),
      ubicacionTecnica: nodoSeleccionado.UbicacionTecnica || null,
      caracteristicas: nodoSeleccionado.Caracteristicas || null,
      medido: nodoSeleccionado.Medido ?? null,
      };
      
      const res = await jerarquiaService.crearNodo(payload);
      const nuevoNodoClonado = res.nodo || res; 
      
      setAlertInfo({ isOpen: true, message: res.msg || "Nodo clonado exitosamente.", type: "success", title: "Clonación Exitosa" });

      if (jerarquiaRef.current?.recargarJerarquiaCompleta) {
        jerarquiaRef.current.recargarJerarquiaCompleta(); 
        if (idPadreParaPayload !== null) {
          setIdNodoAExpandirTrasCarga(idPadreParaPayload);
        }
      } else {
            console.warn("Función 'recargarJerarquiaCompleta' no disponible en jerarquiaRef.");
      }

      if (nuevoNodoClonado && nuevoNodoClonado.IdNodo) {
       handleNodoSeleccionado(nuevoNodoClonado); 
      } else {
          console.warn("No se pudo obtener el nodo clonado completo para seleccionar. Volviendo a modo VIEW.");
          setModoFormulario('VIEW'); 
      }

    } catch (err) {
      console.error("PaginaGestionJerarquia - Error al clonar nodo:", err);
      setAlertInfo({ isOpen: true, message: err.message || "Error al clonar el nodo.", type: "error", title: "Error de Clonación" });
    } finally {
      setIsLoadingForm(false);
    }
  }, [nodoSeleccionado, jerarquiaRef, handleNodoSeleccionado, setIdNodoAExpandirTrasCarga, setAlertInfo, setIsLoadingForm, setModoFormulario]);

  const handleArbolCargado = useCallback((raiz, tipos, todosLosNodos) => {
    setNodoRaizDelArbol(raiz);
    const tiposMap = new Map(tipos.map(t => [t.idtiponodo, t])); 
    setTiposNodoGlobal(tiposMap); 
    setTodosLosNodosCargados(todosLosNodos); // Guarda la lista completa de nodos

    // Lógica para seleccionar el nodo padre después de la eliminación y recarga
    if (idNodoASeleccionarTrasEliminacion && todosLosNodos && todosLosNodos.length > 0) {
      const parentNode = todosLosNodos.find(n => n.IdNodo === idNodoASeleccionarTrasEliminacion);
      if (parentNode) {
        handleNodoSeleccionado(parentNode); // Selecciona el nodo padre
      } else {
        console.warn("⚠️ No se pudo encontrar el nodo padre con ID para seleccionar tras la eliminación:", idNodoASeleccionarTrasEliminacion);
        // Si el padre no se encuentra (ej. el árbol se vació o el padre también fue afectado indirectamente),
        // limpiar la selección actual y volver al modo VIEW.
        setNodoSeleccionado(null);
        setDatosFormulario({});
        setModoFormulario('VIEW');
      }
      setIdNodoASeleccionarTrasEliminacion(null); // Limpia el ID para evitar selecciones repetidas
    }
  }, [idNodoASeleccionarTrasEliminacion, handleNodoSeleccionado, setIdNodoASeleccionarTrasEliminacion]);


  // --- OTRAS FUNCIONES ---
  const handleInputChange = useCallback((name, value) => {
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
    setAlertInfo(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleCancelar = useCallback(() => {
    if (nodoSeleccionado) {
      setDatosFormulario({ 
          ...nodoSeleccionado,
          DescripcionOriginal: nodoSeleccionado.Descripcion,
          IdTipoNodo: nodoSeleccionado.IdTipoNodo != null ? nodoSeleccionado.IdTipoNodo.toString() : '',
          Activo: nodoSeleccionado.Activo ?? true,
          Medido: nodoSeleccionado.Medido ?? false,
      });
      setModoFormulario('VIEW');
    } else {
      setDatosFormulario({});
      setModoFormulario('VIEW'); 
    }
    setAlertInfo(prev => ({ ...prev, isOpen: false }));
  }, [nodoSeleccionado]);

  // Definir handleCancelarEliminacion AQUI, ANTES DE handleConfirmarEliminacion y handleSolicitarEliminar
  const handleCancelarEliminacion = useCallback(() => { 
    setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {}, isLoading: false });
  }, []);

  // Definir handleConfirmarEliminacion AQUI, ANTES DE handleSolicitarEliminar
  const handleConfirmarEliminacion = useCallback(async (idNodoAEliminar, idPadreDelNodoEliminado) => {
    setConfirmDialog(prev => ({ ...prev, isLoading: true }));
    try {
        const res = await jerarquiaService.eliminarNodo(idNodoAEliminar);
        setAlertInfo({ isOpen: true, message: res.msg || "Nodo y sus descendientes eliminados correctamente.", type: "success", title: "Eliminado" });
        
        setUltimoPadreEliminadoId(idPadreDelNodoEliminado); 

        // 1. Prepara la selección del padre después de la recarga
        setIdNodoASeleccionarTrasEliminacion(idPadreDelNodoEliminado);

        // 2. Dispara la recarga completa del árbol
        if (jerarquiaRef.current?.recargarJerarquiaCompleta) {
            jerarquiaRef.current.recargarJerarquiaCompleta(); 
        } else {
            console.warn("Función 'recargarJerarquiaCompleta' no disponible. La selección del padre podría fallar.");
            // Si no se puede recargar, limpiar el estado local y volver a la vista por defecto
            setNodoSeleccionado(null);
            setDatosFormulario({});
            setModoFormulario('VIEW');
            setIdNodoASeleccionarTrasEliminacion(null); // Clear in case of fallback
        }
        
        // No limpiar aquí, ya que la selección se manejará después de la recarga en handleArbolCargado.
        // setNodoSeleccionado(null);
        // setDatosFormulario({});
        // setModoFormulario('VIEW');

    } catch (err) {
        console.error("PaginaGestionJerarquia - Error al eliminar:", err);
        setAlertInfo({ isOpen: true, message: err.message || "Error al eliminar el nodo.", type: "error", title: "Error de Eliminación" });
        // En caso de error, limpiar la selección y volver al modo VIEW
        setNodoSeleccionado(null);
        setDatosFormulario({});
        setModoFormulario('VIEW');
        setIdNodoASeleccionarTrasEliminacion(null); // Clear in case of error
    } finally {
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {}, isLoading: false });
    }
  }, [jerarquiaRef, setUltimoPadreEliminadoId, setAlertInfo, setIdNodoASeleccionarTrasEliminacion, setNodoSeleccionado, setDatosFormulario, setModoFormulario]); 

  const handleIniciarEdicion = useCallback(() => {
    if (!nodoSeleccionado) {
        setAlertInfo({ isOpen: true, message: "No hay un nodo seleccionado para editar.", type: "warning", title: "Acción Requerida" });
        return;
    }
    setModoFormulario('EDIT');
    setAlertInfo(prev => ({ ...prev, isOpen: false }));
  }, [nodoSeleccionado]);

  const handleSolicitarNuevoHijo = useCallback(() => {
    if (!nodoSeleccionado) {
      setAlertInfo({ isOpen: true, message: "Seleccione un nodo padre primero para añadir un hijo.", type: "warning", title: "Acción Requerida" });
      return;
    }
    
    setModoFormulario('CREATE_CHILD');
    setDatosFormulario({ 
      Descripcion: '',
      IdPadre: nodoSeleccionado.IdNodo,
      // Usar Array.from(tiposNodoGlobal.values())[0]?.IdTipoNodo?.toString() para el valor por defecto
      IdTipoNodo: Array.from(tiposNodoGlobal.values())[0]?.IdTipoNodo?.toString() || '', 
      UbicacionTecnica: '',
      Caracteristicas: '',
      Activo: true,
      DescripcionPadre: nodoSeleccionado.Descripcion, 
      Medido: false,
    });
    setAlertInfo(prev => ({ ...prev, isOpen: false }));
    setCreateFormKey(prev => prev + 1); 
  }, [nodoSeleccionado, tiposNodoGlobal, setAlertInfo, setModoFormulario, setDatosFormulario, setCreateFormKey]); 

  // handleGuardar depende de varias, y debe ir después de sus dependencias
  const handleGuardar = useCallback(async () => {
    if (modoFormulario === 'VIEW') {
        console.warn("PaginaGestionJerarquia: Intento de guardar en modo VIEW.");
        return;
    }
    
    if (!datosFormulario.Descripcion?.trim()) {
        setAlertInfo({ isOpen: true, message: "La descripción es obligatoria.", type: "error", title: "Error de Validación" });
        return;
    }
    if ((modoFormulario === 'EDIT' || modoFormulario === 'CREATE_CHILD') && (datosFormulario.IdTipoNodo == null || datosFormulario.IdTipoNodo === '')) {
        setAlertInfo({ isOpen: true, message: "El tipo de nodo es obligatorio.", type: "error", title: "Error de Validación" });
        return;
    }

    setIsLoadingForm(true);
    setAlertInfo(prev => ({ ...prev, isOpen: false }));

    try {
      let mensajeExito = "";
      let nodoCompletoActualizadoOcreado = null; 

      if (modoFormulario === 'EDIT' && nodoSeleccionado) {
        const payload = {
          Descripcion: datosFormulario.Descripcion,
          IdTipoNodo: parseInt(datosFormulario.IdTipoNodo),
          UbicacionTecnica: datosFormulario.UbicacionTecnica || null,
          Caracteristicas: datosFormulario.Caracteristicas || null,
          Activo: Boolean(datosFormulario.Activo),
          Medido: datosFormulario.Medido ?? null,
        };
        const res = await jerarquiaService.actualizarNodo(nodoSeleccionado.IdNodo, payload);
        mensajeExito = res.msg || "Nodo actualizado exitosamente.";
        nodoCompletoActualizadoOcreado = res.nodo || res; 
        if (jerarquiaRef.current?.actualizarNodoLocal) {
            jerarquiaRef.current.actualizarNodoLocal(nodoCompletoActualizadoOcreado);
        }
      } else if (modoFormulario === 'CREATE_CHILD') {
        const payload = {
          descripcion: datosFormulario.Descripcion, 
          idPadre: datosFormulario.IdPadre,
          idTipoNodo: parseInt(datosFormulario.IdTipoNodo),
          activo: Boolean(datosFormulario.Activo),
          ubicacionTecnica: datosFormulario.UbicacionTecnica || null,
          caracteristicas: datosFormulario.Caracteristicas || null,
          medido: datosFormulario.Medido ?? null,
        };
        const res = await jerarquiaService.crearNodo(payload);
        
        mensajeExito = res.msg || "Nodo hijo creado exitosamente.";
        nodoCompletoActualizadoOcreado = res.nodo || res; 

        if (jerarquiaRef.current?.recargarJerarquiaCompleta) {
            
            jerarquiaRef.current.recargarJerarquiaCompleta(); 
            setIdNodoAExpandirTrasCarga(datosFormulario.IdPadre); 
        } else {
            console.warn("Función 'recargarJerarquiaCompleta' no disponible en jerarquiaRef.");
        }
      }
      setAlertInfo({ isOpen: true, message: mensajeExito, type: "success", title: "Éxito" });
      
      if (nodoCompletoActualizadoOcreado && nodoCompletoActualizadoOcreado.IdNodo) {
        const medidoValor =
            nodoCompletoActualizadoOcreado.Medido ??
            nodoCompletoActualizadoOcreado.medido ??
            datosFormulario.Medido ?? null;
         const datosParaSeleccion = {
            ...nodoCompletoActualizadoOcreado,
            Medido: medidoValor,
            medido: medidoValor,
            DescripcionOriginal: nodoCompletoActualizadoOcreado.Descripcion,
            IdTipoNodo: nodoCompletoActualizadoOcreado.IdTipoNodo != null ? nodoCompletoActualizadoOcreado.IdTipoNodo.toString() : '',
            Activo: nodoCompletoActualizadoOcreado.Activo ?? true,
        };
        handleNodoSeleccionado(datosParaSeleccion);
      } else {
          console.warn("No se pudo obtener el nodo completo actualizado/creado para seleccionar. Volviendo a modo VIEW.");
          setModoFormulario('VIEW'); 
      }

    } catch (err) {
      console.error("PaginaGestionJerarquia - Error al guardar:", err);
      setAlertInfo({ isOpen: true, message: err.message || "Error al guardar el nodo.", type: "error", title: "Error" });
    } finally {
      setIsLoadingForm(false);
    }
  }, [modoFormulario, datosFormulario, nodoSeleccionado, handleNodoSeleccionado, jerarquiaRef, setIdNodoAExpandirTrasCarga, setAlertInfo, setIsLoadingForm, setModoFormulario]); 

  const handleSolicitarEliminar = useCallback(() => {
    if (!nodoSeleccionado) { 
        setAlertInfo({ isOpen: true, message: "No hay un nodo seleccionado para eliminar.", type: "warning", title: "Acción Requerida" });
        return;
    }
    if (nodoSeleccionado.IdPadre === null || nodoSeleccionado.LFT === 1) { 
        setAlertInfo({ isOpen: true, message: "El nodo raíz no puede ser eliminado.", type: "warning", title: "Acción no permitida" });
        return;
    }

    setConfirmDialog({
        isOpen: true,
        title: "Confirmar Eliminación del Nodo", 
        message: (
            <>
                <Titulo as="h4" className="confirm-dialog__subtitle"> 
                    ¿Eliminar Nodo "{nodoSeleccionado.Descripcion}"?
                </Titulo>
                <Parrafo> 
                    Se eliminará el nodo "{nodoSeleccionado.Descripcion}" y todos sus hijos asociados. Esta acción no se puede deshacer.
                </Parrafo>
            </>
        ),
        onConfirm: () => handleConfirmarEliminacion(nodoSeleccionado.IdNodo, nodoSeleccionado.IdPadre),
        onCancel: handleCancelarEliminacion, 
        isLoading: false,
    });
  }, [nodoSeleccionado, handleConfirmarEliminacion, setAlertInfo, setConfirmDialog, handleCancelarEliminacion]); 

  const arbolNoCargadoAun = !nodoRaizDelArbol || tiposNodoGlobal.size === 0; 
  
  const formKey = modoFormulario === 'CREATE_CHILD' 
                    ? `create-${datosFormulario.IdPadre || 'root'}-${createFormKey}` 
                    : nodoSeleccionado?.IdNodo || 'no-selection';

 
  // --- CONFIGURACIÓN DE LAS PESTAÑAS ---
  const currentNodoTipo = nodoSeleccionado ? tiposNodoGlobal.get(nodoSeleccionado.IdTipoNodo) : null;
  const shouldEnableDetailTabs = modoFormulario === 'VIEW' && nodoSeleccionado && !isLoadingForm && currentNodoTipo?.detalle === true; 


  const tabsConfig = [
    {
      id: 'nodo',
      label: 'Nodo',
      icon: <FaIcons.FaSitemap />, 
      content: (
        <DetalleNodoForm
            key={formKey}
            mode={modoFormulario}
            initialData={datosFormulario} 
            tiposNodo={Array.from(tiposNodoGlobal.values())} // Pasar los tipos como array
            isLoading={isLoadingForm} 
            onInputChange={handleInputChange}
            onGuardar={handleGuardar}
            onCancelar={handleCancelar}
            onEliminar={handleSolicitarEliminar} 
            onIniciarEdicion={handleIniciarEdicion}
            onSolicitarNuevoHijo={handleSolicitarNuevoHijo}
            onClonar={handleClonar} 
            canClone={nodoSeleccionado ? !nodoSeleccionado.tieneHijos : false} 
        />
      ),
    },
    {
      id: 'detalle',
      label: 'Detalle',
      icon: <FaIcons.FaInfoCircle />,
      content: (
        // Renderizar el nuevo componente DynamicDetailForm
        <DynamicDetailForm
          idTipoNodo={nodoSeleccionado?.IdTipoNodo ? parseInt(nodoSeleccionado.IdTipoNodo, 10) : undefined} // Ensure it's a number
          nodoSeleccionado={nodoSeleccionado}     
          mode={modoFormulario}                     
          isLoadingForm={isLoadingForm}
          fieldDefinitions={camposTipoNodo} // Pass the fetched field definitions to DynamicDetailForm
        />
      ),
      // Tab is disabled if no details are present for the type, or if overall form is loading
      disabled: !hasDetalle || isLoadingForm, 
    },
   {
      id: 'adjuntos',
      label: 'Adjuntos',
      icon: <FaIcons.FaPaperclip />,
      content: (

        <DocumentUploader
          idNodo={nodoSeleccionado?.IdNodo} 
        />
      ),
      // Tab is disabled if no attachments are present for the type, or if overall form is loading
      disabled: !hasAdjuntos || isLoadingForm,
    },
  ];

  return (
    <Container as="div" className="page-layout-with-hierarchy">
      <ResizablePanel initialWidth={320} minWidth={250} maxWidth={700} side="left">
        <JerarquiaManager
          ref={jerarquiaRef}
          onArbolCargado={handleArbolCargado}
          onNodoSeleccionado={handleNodoSeleccionado}
          nodoIdSeleccionadoExternamente={nodoSeleccionado?.IdNodo}
          forceRefetchTimestamp={forceRefetchTimestamp} 
          idNodoAExpandirTrasCarga={idNodoAExpandirTrasCarga}
          onExpansionHecha={() => setIdNodoAExpandirTrasCarga(null)}
        />
      </ResizablePanel>
      <Container as="main" className="main-content-area">
        {nodoRaizDelArbol && (
          <Container as="header" className="panel-principal__cabecera" padding="var(--spacing-md)">
            <Titulo as="h2" className="titulo-panel-principal" margin="0">
              {(() => {
                const tipo = tiposNodoGlobal.get(nodoRaizDelArbol.IdTipoNodo); 
                const Icon = tipo && IconComponents[tipo.icono?.trim()] 
                             ? IconComponents[tipo.icono.trim()] 
                             : FaIcons.FaSitemap; 
                return <Icon className="titulo-panel__icono" style={{ marginRight: 'var(--spacing-sm)'}} />;
              })()}
              {nodoRaizDelArbol.Descripcion}
            </Titulo>
          </Container>
        )}
        <Container as="div" className="panel-principal__formulario-contenedor">
          <Alert 
            isOpen={alertInfo.isOpen}
            message={alertInfo.message}
            type={alertInfo.type}
            title={alertInfo.title}
            onClose={() => setAlertInfo(prev => ({...prev, isOpen: false}))}
            autoCloseDelay={5000}
            showCloseButton
          />
          
          {isLoadingForm && <Loader text="Procesando..." overlay={true} />}

          {arbolNoCargadoAun && !isLoadingForm ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Loader text="Cargando estructura jerárquica..." />
            </div>
          ) : (nodoSeleccionado ? ( 
            <Tabs
              tabsConfig={tabsConfig}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
              variant="boxed" 
              className="tabs-panel-detail-node" 

              
            />
            
          ) : ( 
            <Parrafo className="mensaje-seleccion-nodo" align="center" color="var(--text-muted-color)" padding="var(--spacing-lg)">
              Seleccione un nodo de la jerarquía para ver sus detalles o realizar acciones.
            </Parrafo>
          ))}
        </Container>
      </Container>
      {confirmDialog.isOpen && (
        <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            onCancel={confirmDialog.onCancel}   
            confirmText="Sí, Eliminar" 
            cancelText="No, Cancelar"   
            confirmVariant="danger"
            isLoadingConfirm={confirmDialog.isLoading}
        >
        </ConfirmDialog>
        )}
    </Container>
  );
};

export default PaginaGestionJerarquia;