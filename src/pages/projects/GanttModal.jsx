import ModalDialog from "../../components/ModalDialog";
import GanttChart from "./GanttChart";

const GanttModal = ({ isOpen, onClose, tareas = [], proyecto = {} }) => {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      title={`Carta Gantt: ${proyecto?.nombre || "Proyecto"}`}
      msgbtnClose={"Cerrar carta Gantt"}
    >
      <div style={{ maxHeight: "450px", overflowX: "auto", overflowY: "hidden" }}>
        <GanttChart tareas={tareas} />
        <div className="gantt-leyenda">
          <span className="leyenda-item pendiente"></span> Pendiente
          <span className="leyenda-item enprogreso"></span> En Progreso
          <span className="leyenda-item completada"></span> Completada
          <span className="leyenda-item avance"></span> Avance
        </div>
      </div>
    </ModalDialog>
  );
};

export default GanttModal;
