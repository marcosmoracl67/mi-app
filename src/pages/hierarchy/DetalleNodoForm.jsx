// src/pages/hierarchy/DetalleNodoForm.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormButton from '../../components/FormButton';
import ToggleSwitch from '../../components/ToggleSwitch';
import Container from '../../components/Container';
import Titulo from '../../components/Titulo';
import Parrafo from '../../components/Parrafo';
import { FaSave, FaPlus, FaEdit, FaTrashAlt, FaClone } from 'react-icons/fa';

const DetalleNodoForm = ({
  mode,                 // 'VIEW', 'EDIT', 'CREATE_CHILD'
  initialData,          // Los datos del nodo actual o del padre (para CREATE_CHILD)
  tiposNodo,            // Array de todos los tipos de nodo para el FormSelect
  isLoading,            // Para deshabilitar botones mientras se guarda
  onInputChange,        // (name, value) -> Para actualizar datos en PaginaGestionJerarquia
  onGuardar,            // Función para llamar al servicio de guardar/crear
  onCancelar,           // Función para resetear el modo a VIEW
  onEliminar,           // Función para solicitar eliminación
  onIniciarEdicion,     // Función para cambiar a modo EDIT
  onSolicitarNuevoHijo, // Función para cambiar a modo CREATE_CHILD
  onClonar,             // <-- NUEVA PROP: Función para solicitar clonación
  canClone = false,     // <-- NUEVA PROP: Indica si el nodo actual puede ser clonado (no tiene hijos)
}) => {
  const [errors, setErrors] = useState({});
  const estaDeshabilitado = mode === 'VIEW';
  const descripcionInputRef = useRef(null);

  useEffect(() => {
    if ((mode === 'EDIT' || mode === 'CREATE_CHILD') && descripcionInputRef.current && !isLoading) {
      if (document.activeElement !== descripcionInputRef.current) {
        descripcionInputRef.current.focus();
      }
    }
  }, [mode, isLoading]);
  

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!initialData?.Descripcion?.trim()) {
      newErrors.Descripcion = "La descripción es obligatoria.";
    }
    if ((mode === 'EDIT' || mode === 'CREATE_CHILD') && !initialData?.IdTipoNodo) {
      newErrors.IdTipoNodo = "El tipo de nodo es obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [initialData, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'VIEW') return;

    if (validateForm()) {
      onGuardar();
    } else {
      console.log("DetalleNodoForm: Validación fallida."); // Solo log, el padre ya maneja la alerta
    }
  };

  let formTitle = "Detalles del Nodo";
  if (mode === 'EDIT') {
    formTitle = `Editar: ${initialData?.DescripcionOriginal || initialData?.Descripcion || 'Nodo'}`;
  } else if (mode === 'CREATE_CHILD') {
    formTitle = `Nuevo Hijo para: ${initialData?.DescripcionPadre || 'Nodo Padre'}`;
  } else if (initialData?.Descripcion) { 
    formTitle = `Detalles de: ${initialData.Descripcion}`;
  }

  const renderizarBotonesDeAccion = () => {
    if (mode === 'VIEW') {
      return (
        <>
          <FormButton
            label="Editar Nodo"
            icon={<FaEdit />}
            onClick={onIniciarEdicion}
            disabled={!initialData || isLoading}
            size="small"
            variant="default"
          />
          <FormButton
            label="Añadir Hijo"
            icon={<FaPlus />}
            onClick={onSolicitarNuevoHijo}
            disabled={!initialData || isLoading}
            size="small"
            variant="success"
            style={{ marginLeft: '0.5rem' }}
          />
           {/* BOTÓN CLONAR NODO: visible si canClone es true */}
          {initialData && canClone && (
            <FormButton
              label="Clonar Nodo"
              icon={<FaClone />} // <-- Usar FaClone
              onClick={onClonar} // <-- Nueva prop onClick
              disabled={isLoading}
              size="small"
              variant="info" // O una variante 'default' si prefieres
              style={{ marginLeft: '0.5rem' }}
            />
          )}
          {initialData && (initialData.IdPadre !== null && initialData.LFT !== 1) && (
             <FormButton
                label="Eliminar Nodo"
                icon={<FaTrashAlt />}
                onClick={onEliminar}
                disabled={isLoading}
                size="small"
                variant="danger"
                style={{ marginLeft: '0.5rem' }}
            />
          )}
        </>
      );
    } else {
      return (
        <>
          <FormButton
            label="Cancelar"
            onClick={onCancelar}
            variant="outline"
            type="button"
            size="small"
            disabled={isLoading}
          />
          <FormButton
            label={mode === 'CREATE_CHILD' ? "Crear Hijo" : "Guardar Cambios"}
            icon={mode === 'CREATE_CHILD' ? <FaPlus /> : <FaSave />}
            type="submit"
            size="small"
            variant={mode === 'CREATE_CHILD' ? "success" : "default"}
            isLoading={isLoading}
            style={{ marginLeft: '0.5rem' }}
          />
        </>
      );
    }
  };

  if (!initialData && mode === 'VIEW') {
      return (
        <Parrafo align="center" padding="var(--spacing-lg)">
            Seleccione un nodo para ver sus detalles.
        </Parrafo>
      )
  }

  return (
    <Container className="detalle-nodo-form-container" padding="var(--spacing-md)">
      <Titulo as="h3" className="detalle-nodo-form__titulo-interno">{formTitle}</Titulo>
      <form onSubmit={handleSubmit} noValidate className="detalle-nodo-form-fields">
        <FormInput
          label="Descripción del Nodo"
          name="Descripcion"
          value={initialData?.Descripcion || ''}
          onChange={(e) => onInputChange(e.target.name, e.target.value)}
          error={errors.Descripcion}
          disabled={estaDeshabilitado}
          required={mode !== 'VIEW'} // Descripción siempre requerida en edit/create
          //autoFocus={mode !== 'VIEW'}
        />
        <FormSelect
          label="Tipo de Nodo"
          name="IdTipoNodo"
          value={initialData?.IdTipoNodo?.toString() || ''}
          onChange={(e) => onInputChange(e.target.name, e.target.value)}
          options={tiposNodo.map(tn => ({ value: tn.idtiponodo.toString(), label: tn.descripcion }))}
          error={errors.IdTipoNodo}
          disabled={estaDeshabilitado}
          required={mode !== 'VIEW'} // Tipo de nodo siempre requerido en edit/create
          placeholder="Seleccione tipo..."
        />
       <FormInput
          label="Ubicación Técnica"
          name="UbicacionTecnica"
          value={initialData?.UbicacionTecnica || ''}
          onChange={(e) => onInputChange(e.target.name, e.target.value)}
          error={errors.UbicacionTecnica}
          disabled={estaDeshabilitado}
        />
        <FormInput
          label="Características"
          name="Caracteristicas"
          value={initialData?.Caracteristicas || ''}
          onChange={(e) => onInputChange(e.target.name, e.target.value)}
          error={errors.Caracteristicas}
          disabled={estaDeshabilitado}
        />
        <div className="form-row">
          <ToggleSwitch
              label="Nodo Activo"
              name="Activo"
              checked={initialData?.Activo ?? true} // Default a true si no está definido
              onChange={(e) => onInputChange(e.target.name, e.target.checked)}
              disabled={estaDeshabilitado}
          />
          <ToggleSwitch
              label="Nodo Medido"
              name="Medido"
              checked={Boolean(initialData?.Medido)}
              onChange={(e) => onInputChange(e.target.name, e.target.checked)}
              disabled={estaDeshabilitado}
          />
        </div>

        <div className="detalle-nodo-form__actions-footer">
          {renderizarBotonesDeAccion()}
        </div>
      </form>
    </Container>
  );
};

export default DetalleNodoForm;