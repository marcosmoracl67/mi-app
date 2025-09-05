// src/pages/hierarchy/DetalleNodoFormModal.jsx
import { useEffect, useState, useCallback } from "react";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import FormButton from "../../components/FormButton";
import { FaSave, FaPlus } from "react-icons/fa";

const opcionesTipoDetalle = [
  { value: "desc", label: "Descripción (desc)" },
  { value: "file", label: "Archivo (file)" },
  { value: "int",  label: "Entero (int)" },
  { value: "img",  label: "Imagen (img)" },
  { value: "obs",  label: "Observación (obs)" },
  { value: "text", label: "Texto (text)" },
  { value: "bool", label: "Booleano (bool)" },
  { value: "date", label: "Fecha (date)" },
  { value: "float", label: "Decimal (float)" },
  { value: "list", label: "Lista (list)" }
];

const DetalleNodoFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, tiposNodo, isLoading }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    tipodetalle: "",
    idtiponodo: "",
    orden: 0
  });


  const [errors, setErrors] = useState({});

  useEffect(() => {
  console.log("Modal useEffect - isOpen:", isOpen, "mode:", mode, "initialData:", initialData); // <<< AÑADE ESTE LOG
  if (isOpen) {
    setErrors({});
    if (mode === "editar" && initialData) { // Aquí 'mode' debe ser 'EDIT' o 'editar' según lo que envíes
      console.log("Modal useEffect - Poblando formulario para EDICIÓN con:", initialData); // <<< AÑADE ESTE LOG
      setFormData({
        descripcion: initialData.descripcion || "",
        tipodetalle: initialData.tipodetalle || "",
        idtiponodo: initialData.idtiponodo?.toString() || "", // Asegúrate que initialData tenga 'idtiponodo'
        orden: initialData.orden || 0
      });
    } else {
      console.log("Modal useEffect - Reseteando formulario para CREACIÓN o initialData no disponible."); // <<< AÑADE ESTE LOG
      setFormData({
        descripcion: "",
        tipodetalle: "",
        idtiponodo: "",
        orden: 0
      });
    }
  }
}, [isOpen, mode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`handleChange - name: ${name}, value: ${value}`); // <<< LOG AQUÍ
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }, [errors]);


  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.descripcion.trim()) newErrors.descripcion = "Campo requerido";
    if (!formData.tipodetalle.trim()) newErrors.tipodetalle = "Campo requerido";
    if (!formData.idtiponodo) newErrors.idtiponodo = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("Modal: handleSubmit - Formulario antes de validar:", formData); // Log para ver formData completo
    if (validateForm()) {
      const dataToSubmit = { // Prepara los datos aquí para loguear
        ...formData,
        idtiponodo: parseInt(formData.idtiponodo), // Parsea ANTES de enviar
        orden: parseInt(formData.orden)
      };
      console.log("Modal: Datos a enviar en onSubmit:", dataToSubmit); // <<< LOG AQUÍ
      onSubmit(dataToSubmit);
    } else {
        console.log("Modal: Validación fallida", errors); // Log si la validación falla
    }
  }, [formData, validateForm, onSubmit, errors]);

  const modalTitle = mode === "crear" ? "Crear Detalle Nodo" : `Editar: ${initialData?.descripcion || ""}`;
  const submitButtonText = mode === "crear" ? "Crear Detalle Nodo" : "Guardar Cambios";
  const submitButtonIcon = mode === "crear" ? <FaPlus /> : <FaSave />;

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
      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          error={errors.descripcion}
          required
          placeholder="Ej: Estado del componente"
        />
         <FormSelect
          label="Tipo Detalle"
          name="tipodetalle" // El mismo 'name' que usaba el FormInput
          value={formData.tipodetalle} // El mismo 'value'
          onChange={handleChange} // El mismo 'onChange'
          options={opcionesTipoDetalle} // Pasa las opciones definidas arriba
          error={errors.tipodetalle} // El mismo 'error'
          required
          placeholder="Seleccione un tipo..." // Opcional: texto para la opción por defecto/vacía
        />
        <FormSelect
          label="Tipo Nodo"
          name="idtiponodo"
          value={formData.idtiponodo}
          onChange={handleChange}
          options={Array.isArray(tiposNodo) ? tiposNodo.map(t => ({ value: t.idtiponodo, label: t.descripcion })) : []}
          error={errors.idtiponodo}
          required
        />
        <FormInput
          label="Orden"
          name="orden"
          type="number"
          value={formData.orden}
          onChange={handleChange}
          required
        />
        <div className="modal-form-footer" style={{ textAlign: "right", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--input-stroke-idle)" }}>
          <FormButton
            label="Cancelar"
            onClick={onClose}
            variant="outline"
            type="button"
            size="small"
            disabled={isLoading}
            style={{ marginRight: "0.5rem" }}
          />
          <FormButton
            label={submitButtonText}
            icon={submitButtonIcon}
            type="submit"
            size="small"
            variant={mode === "crear" ? "success" : "default"}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default DetalleNodoFormModal;
