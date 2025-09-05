// src/pages/admin/EmpresaFormModal.jsx
import { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import { FaSave, FaPlus } from 'react-icons/fa';

const EmpresaFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    nombre_responsable: '',
    telefono_responsable: '',
    correo_responsable: '',
    ciudad: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
        setErrors({});
        if (mode === 'editar' && initialData) {
            setFormData({
                empresa_id: initialData.empresa_id || undefined,
                nombre_empresa: initialData.nombre_empresa || '',
                nombre_responsable: initialData.nombre_responsable || '',
                telefono_responsable: initialData.telefono_responsable || '',
                correo_responsable: initialData.correo_responsable || '',
                ciudad: initialData.ciudad || '',
            });
        } else {
            setFormData({
                nombre_empresa: '',
                nombre_responsable: '',
                telefono_responsable: '',
                correo_responsable: '',
                ciudad: '',
                // Asegúrate de no incluir empresa_id aquí para el modo crear,
                // o que el backend lo ignore si está presente y es undefined/null.
                // Lo mejor es que el backend genere el ID para nuevas entidades.
            });
        }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }
  }, [errors]); // La dependencia 'errors' es correcta aquí

  const validateForm = useCallback(() => { // useCallback para consistencia, aunque podría no ser estrictamente necesario si solo se usa en handleSubmitForm
    const newErrors = {};
    if (!formData.nombre_empresa.trim()) {
      newErrors.nombre_empresa = 'El nombre de la empresa es obligatorio.';
    }
    if (formData.correo_responsable && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_responsable)) {
        newErrors.correo_responsable = 'Ingrese un correo electrónico válido.';
    }
    // Añade más validaciones según necesites
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]); // Dependencia 'formData' es crucial aquí

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) { // validateForm ahora está memoizada, bien
      onSubmit(formData); // Llama a la prop onSubmit pasada desde Empresas.jsx
    }
  }, [validateForm, onSubmit, formData]); // Dependencias correctas

  // --- Declaraciones movidas ANTES del return ---
  const modalTitle = mode === 'crear' ? 'Crear Nueva Empresa' : `Editar Empresa: ${initialData?.nombre_empresa || ''}`;
  const submitButtonText = mode === 'crear' ? 'Crear Empresa' : 'Guardar Cambios';
  const submitButtonIcon = mode === 'crear' ? <FaPlus /> : <FaSave />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={60}
      title={modalTitle} // Ahora definida
      showCloseButton={false}
      closeOnEscape={false}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmitForm} noValidate> {/* Ahora definida */}
          <FormInput
            label="Nombre de la Empresa"
            name="nombre_empresa"
            value={formData.nombre_empresa}
            onChange={handleChange}
            error={errors.nombre_empresa}
            required
            placeholder="Ej: Mi Gran Empresa S.A."
            containerClassName="u-margin-bottom-sm"
          />
          <FormInput
            label="Nombre del Responsable"
            name="nombre_responsable"
            value={formData.nombre_responsable}
            onChange={handleChange}
            error={errors.nombre_responsable}
            placeholder="Ej: Juan Pérez"
            containerClassName="u-margin-bottom-sm"
          />
          <div className="form-row u-margin-bottom-sm">
            <FormInput
              label="Teléfono del Responsable"
              name="telefono_responsable"
              value={formData.telefono_responsable}
              onChange={handleChange}
              error={errors.telefono_responsable}
              placeholder="Ej: +56912345678"
              containerClassName="form-col"
            />
            <FormInput
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad} // Corregido en la respuesta anterior, verificando que sigue aquí
              onChange={handleChange}
              error={errors.ciudad}
              placeholder="Ej: Santiago"
              containerClassName="form-col"
            />
          </div>
          <FormInput
            label="Correo Electrónico del Responsable"
            name="correo_responsable"
            type="email"
            value={formData.correo_responsable}
            onChange={handleChange}
            error={errors.correo_responsable}
            placeholder="Ej: contacto@empresa.com"
            containerClassName="u-margin-bottom-md"
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
            label={submitButtonText} // Ahora definida
            icon={submitButtonIcon} // Ahora definida
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

export default EmpresaFormModal;