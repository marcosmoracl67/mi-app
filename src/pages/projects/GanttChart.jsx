import '../../styles/index.css'; 

const estadosColores = {
  "pendiente": "#ccc",
  "en progreso": "#3498db",
  "completada": "#2ecc71",
};

const GanttChart = ({ tareas }) => {
  if (!tareas || tareas.length === 0) {
    return <p>No hay tareas para mostrar en el Gantt.</p>;
  }

  // Extraer fechas de inicio y término reales
  const fechas = tareas.map(t => ({
    inicio: new Date(t.fecha_inicio),
    termino: new Date(t.fecha_termino)
  }));

  const fechaMin = new Date(Math.min(...fechas.map(f => f.inicio)));
  const fechaMax = new Date(Math.max(...fechas.map(f => f.termino)));
  const totalDias = Math.ceil((fechaMax - fechaMin) / (1000 * 60 * 60 * 24));

  // Cálculo de porcentaje de inicio y ancho
  const calcularIzquierda = (inicio) =>
    ((new Date(inicio) - fechaMin) / (1000 * 60 * 60 * 24)) * 100 / totalDias;

  const calcularAncho = (inicio, fin) =>
    ((new Date(fin) - new Date(inicio)) / (1000 * 60 * 60 * 24)) * 100 / totalDias;

  return (
    <div className="gantt-container">
      {tareas.map((tarea) => (
        <div key={tarea.tarea_id} className="gantt-row">
          <div className="gantt-label">{tarea.titulo}</div>
          <div className="gantt-bar-wrapper">
            <div
              className="gantt-bar"
              style={{
                left: `${calcularIzquierda(tarea.fecha_inicio)}%`,
                width: `${calcularAncho(tarea.fecha_inicio, tarea.fecha_termino)}%`,
                backgroundColor: estadosColores[tarea.estado] || "#999",
              }}
            >
              <div
                className="gantt-avance"
                style={{
                  width: `${tarea.avance || 0}%`,
                }}
              />
            </div>
          </div>          
        </div>
      ))}
    </div>
  );
};

export default GanttChart;
