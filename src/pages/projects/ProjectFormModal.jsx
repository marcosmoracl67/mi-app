import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import FormTextarea from "../../components/FormTextarea";
import FormButton from "../../components/FormButton";
import {  FaTrashAlt, FaFile, FaFileDownload } from "react-icons/fa";
import "../../styles/index.css";
import axios from "axios";

const ProjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  proyecto = {},
  onChange
}) => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users", {
          withCredentials: true
        });
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error.message);
      }
    };

    if (isOpen) fetchUsuarios();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...proyecto, [name]: value });
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-form"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
      <h2 className="modal-title">
        {proyecto.proyecto_id ? "Editar Proyecto" : "Nuevo Proyecto"}
      </h2>
      <div className="form-card">
      {/* Nombre (toda la línea) */}
      <div className="form-row single">
        <FormInput
          name="nombre"
          label="Nombre del proyecto"
          placeholder="Ej: Monitor de Infraestructura"
          value={proyecto.nombre || ""}
          onChange={handleChange}
          fullWidth
          required
        />
      </div>

      {/* Estado + Responsable en misma línea */}
      <div className="form-row row-2">
        <div className="form-input-group">
          <label htmlFor="estado"></label>
          <select
            name="estado"
            className="form-input"
            value={proyecto.estado || "activo"}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="en progreso">En Progreso</option>
            <option value="archivado">Archivado</option>
          </select>
        </div>

        <div className="form-input-group">
          <label htmlFor="responsable_id"></label>
          <select
            name="responsable_id"
            className="form-input"
            value={proyecto.responsable_id || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione usuario...</option>
            {usuarios.map((u) => (
              <option key={u.usuario_id} value={u.usuario_id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fechas */}
      <div className="form-row row-2">
        <FormInput
          name="fecha_inicio"
          label="Fecha inicio"
          type="date"
          value={proyecto.fecha_inicio || ""}
          onChange={handleChange}
        />
        <FormInput
          name="fecha_entrega"
          label="Fecha entrega"
          type="date"
          value={proyecto.fecha_entrega || ""}
          onChange={handleChange}
        />
      </div>

      {/* Descripción */}
      <div className="form-row single">
        <FormTextarea
          name="descripcion"
          placeholder="Breve descripción del proyecto"
          value={proyecto.descripcion}
          onChange={handleChange}
          size="small"
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="form-row form-actions centered">
        <FormButton label="Cancelar" onClick={onClose} variant="subtle"  
            size = "small" align = "center" > </FormButton> 
        <FormButton label="Guardar" onClick={onSubmit} variant="confirm" 
          size = "small" align = "center" /> 
      </div>
    </div>
    </div>
  </div>,
  document.body
  );
};

export default ProjectFormModal;
