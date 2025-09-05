import ReactDOM from "react-dom";
import FormInput from "../../components/FormInput.jsx";
import FormTextarea from "../../components/FormTextarea";
import FormButton from "../../components/FormButton";
import "../../styles/index.css";


const TareaFormModal = ({ isOpen, onClose, onSubmit, tarea = {}, onChange }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...tarea, [name]: value });
  };

  return ReactDOM.createPortal(
    <div className="tarea-modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-form"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="modal-title">
          {tarea.tarea_id ? "Editar Tarea" : "Nueva Tarea"}
        </h2>

        <div className="form-card">
          <div className="form-row row-1">
            <FormInput
              name="titulo"
              placeholder="Título de la tarea"
              value={tarea.titulo || ""}
              onChange={handleChange}
              required
            />
           <div className="form-input-group">
              <label htmlFor="estado"></label>
              <select
                name="estado"
                className="form-input"
                value={tarea.estado || "pendiente"}
                onChange={handleChange}
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

          </div>

          <FormTextarea
            name="descripcion"
            placeholder="Descripción de la tarea"
            value={tarea.descripcion || ""}
            onChange={handleChange}
            rows={2}
          />
          <div className="form-row row-1">
            <FormInput
              name="fecha_inicio"
              type="date"
              value={tarea.fecha_inicio || ""}
              onChange={handleChange}
              placeholder="Fecha de Inicio"
            />
             <FormInput
              name="fecha_termino"
              type="date"
              value={tarea.fecha_termino || ""}
              onChange={handleChange}
              placeholder="Fecha de Termino"
            />
            <FormInput
              name="avance"
              type="number"
              placeholder="Avance (%)"
              value={tarea.avance }
              onChange={handleChange}
              
            />
          </div>
          <div className="form-row form-actions centered">
            <FormButton label="Cerrar" size="small" variant="subtle" onClick={onClose} />
            <FormButton label="Guardar" size="small" variant="confirm" onClick={onSubmit} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TareaFormModal;
