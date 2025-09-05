import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaCheckCircle, FaTasks, FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";
import '../../styles/index.css'; 

const Dashboard = () => {
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proyectosRes, tareasRes] = await Promise.all([
          axios.get("http://localhost:3000/api/proyectos", { withCredentials: true }),
          axios.get("http://localhost:3000/api/tareas", { withCredentials: true })
        ]);
        setProyectos(proyectosRes.data);
        setTareas(tareasRes.data);
      } catch (error) {
        console.error("Error al cargar métricas del dashboard:", error.message);
      }
    };

    fetchData();
  }, []);

  const contarPorEstado = (array, key) =>
    array.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});

  const calcularPorcentajeCompletadas = () => {
    const completadas = tareas.filter(t => t.estado === "completada").length;
    return tareas.length ? Math.round((completadas / tareas.length) * 100) : 0;
  };

  const proyectosAtrasados = () => {
    const hoy = new Date();
    return proyectos.filter(p => {
      const entrega = new Date(p.fecha_entrega);
      return entrega < hoy && p.estado !== "archivado";
    });
  };

  const proyectosVencenPronto = (dias = 7) => {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);

    return proyectos.filter(p => {
      const entrega = new Date(p.fecha_entrega);
      return entrega >= hoy && entrega <= limite;
    });
  };

  const totalProyectos = proyectos.length;
  const totalTareas = tareas.length;

  const resumenProyectos = contarPorEstado(proyectos, "estado");
  const resumenTareas = contarPorEstado(tareas, "estado");

  const MetricCard = ({ label, value, icon }) => (
    <div className="metric-card">
      {icon && <div className="metric-icon">{icon}</div>}
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );

  return (
    <div className="form-page centered">
      <h2 className="section-title">📊 Dashboard General</h2>

      <div className="form-card">
        <h3>Proyectos</h3>
        <div className="dashboard-metrics">
          <MetricCard label="Total Proyectos" icon={<FaClipboardList />} value={totalProyectos} />
          <MetricCard label="Activos" value={resumenProyectos["activo"] || 0} />
          <MetricCard label="En Progreso" value={resumenProyectos["en progreso"] || 0} />
          <MetricCard label="Archivados" value={resumenProyectos["archivado"] || 0} />
          <MetricCard label="Proyectos próximos a vencer" value={proyectosVencenPronto().length} icon={<FaExclamationTriangle />} className="warning" />
          <MetricCard label="Proyectos Atrasados" value={proyectosAtrasados().length} icon={<FaExclamationCircle />} className="danger" />
        </div>
      </div>

      <div className="form-card">
        <h3>Tareas</h3>
        <div className="dashboard-metrics">
          <MetricCard label="Total Tareas" icon={<FaTasks />} value={totalTareas} />
          <MetricCard label="Pendientes" value={resumenTareas["pendiente"] || 0} />
          <MetricCard label="En Progreso" value={resumenTareas["en progreso"] || 0} />
          <MetricCard label="Completadas" icon={<FaCheckCircle />} value={resumenTareas["completada"] || 0} />
          <MetricCard label="% Tareas Completadas" icon={<FaCheckCircle />} value={`${calcularPorcentajeCompletadas()}%`} />
        </div>

        <h3>Progreso por Proyecto</h3>
        {proyectos.map((p) => {
          const tareasProyecto = tareas.filter(t => t.proyecto_id === p.proyecto_id);
          const completadas = tareasProyecto.filter(t => t.estado === "completada").length;
          const porcentaje = tareasProyecto.length ? Math.round((completadas / tareasProyecto.length) * 100) : 0;

          return (
            <div key={p.proyecto_id} className="progreso-proyecto">
              <div className="proyecto-label">
                {p.nombre} — {porcentaje}%
              </div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar" style={{ width: `${porcentaje}%` }}></div>
              </div>
            </div>
          );
        })}

        <h3>Responsables con más tareas</h3>
        {(() => {
          const tareasPorResponsable = {};
          proyectos.forEach(p => {
            const tareasProyecto = tareas.filter(t => t.proyecto_id === p.proyecto_id);
            if (!tareasPorResponsable[p.responsable]) tareasPorResponsable[p.responsable] = 0;
            tareasPorResponsable[p.responsable] += tareasProyecto.length;
          });

          const ranking = Object.entries(tareasPorResponsable)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);

          return (
            <ul className="ranking-list">
              {ranking.map(([nombre, count]) => (
                <li key={nombre}>
                  <strong>{nombre}</strong>: {count} tarea(s)
                </li>
              ))}
            </ul>
          );
        })()}
      </div>
    </div>
  );
};

export default Dashboard;
