// src/pages/hierarchy/TipoNodoFormModal.jsx
import { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import ToggleSwitch from '../../components/ToggleSwitch';
import { FaSave, FaPlus } from 'react-icons/fa';

const TipoNodoFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    icono: '',
    detalle: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'editar' && initialData) {
        setFormData({
          tiponodoid: initialData.idtiponodo || undefined,
          descripcion: initialData.descripcion || '',
          icono: initialData.icono || '',
          detalle: initialData.detalle ?? false
        });
      } else {
        setFormData({
          descripcion: '',
          icono: '',
          detalle: false
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validataForm = useCallback(() => {
    const newErrors = {};
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (!formData.icono.trim()) {
      newErrors.icono = 'El icono es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (validataForm()) {
      onSubmit(formData);
    }
  }, [validataForm, onSubmit, formData]);

  const modalTitle = mode === 'crear'
    ? 'Crear Nuevo Tipo de Nodo'
    : `Editar Tipo de Nodo: ${initialData?.descripcion || ''}`;

  const submitButtonText = mode === 'crear'
    ? 'Crear Tipo de Nodo'
    : 'Guardar Cambios';

  const submitButtonIcon = mode === 'crear' ? <FaPlus /> : <FaSave />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={60}
      title={modalTitle}
      showCloseButton={false}
      closeOnEscape={false}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmitForm} noValidate>
        <FormInput
          label="Descripcion tipo de Nodo"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          error={errors.descripcion}
          required
          placeholder="Ej: Descripción del Tipo de Nodo"
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Icono"
          name="icono"
          value={formData.icono}
          onChange={handleChange}
          error={errors.icono}
          required
          placeholder="Ej: Icono para el Tipo de Nodo"
          containerClassName="u-margin-bottom-sm"
        />
        <ToggleSwitch
          label="Incluye detalle"
          name="detalle"
          checked={formData.detalle}
          onChange={handleChange}
          containerClassName="u-margin-bottom-sm"
        />
        <div className="modal-form-footer" style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--input-stroke-idle)' }}>
          <FormButton
            label="Cancelar"
            onClick={onClose}
            variant="outline"
            type="button"
            size="small"
            disabled={isLoading}
            style={{ marginRight: '0.5rem' }}
          />
          <FormButton
            label={submitButtonText}
            icon={submitButtonIcon}
            type="submit"
            size="small"
            variant={mode === 'crear' ? 'success' : 'default'}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default TipoNodoFormModal;
