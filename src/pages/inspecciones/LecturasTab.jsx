import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Container from "../../components/Container";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import * as jerarquiaService from "../../services/jerarquiaService";

const opcionesEstado = [
  { value: "verde", label: "Verde" },
  { value: "amarillo", label: "Amarillo" },
  { value: "rojo", label: "Rojo" },
];

const LecturasTab = ({ nodoSeleccionado, inspeccion }) => {
  const [componentes, setComponentes] = useState([]);
  const [lecturas, setLecturas] = useState({});
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 3000);
  };

  // Carga hijos directos del nodo seleccionado
  useEffect(() => {
    if (!nodoSeleccionado) {
      setComponentes([]);
      return;
    }
    const id = nodoSeleccionado.IdNodo ?? nodoSeleccionado.id;
    jerarquiaService
      .obtenerSubarbol(id)
      .then((subtree) => {
        const hijos = Array.isArray(subtree)
          ? subtree.filter((n) => n.IdPadre === id)
          : [];
        setComponentes(hijos);
      })
      .catch((err) => {
        console.error("Error al cargar componentes", err);
        setComponentes([]);
      });
  }, [nodoSeleccionado]);

  // Carga lecturas existentes para la inspeccion
  useEffect(() => {
    if (!inspeccion) {
      setLecturas({});
      return;
    }
    const idInspeccion = inspeccion.id ?? inspeccion.IdInspeccion;
    axios
      .get(`/api/lecturas?IdInspeccion=${idInspeccion}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const porComponente = {};
        data.forEach((l) => {
          const compId = l.IdNodo ?? l.id_nodo;
          const tipo = (l.TipoLectura ?? l.tipo_lectura)?.toLowerCase();
          const lectura = {
            IdLectura: l.IdLectura ?? l.id_lectura ?? l.id,
            IdInspeccion: l.IdInspeccion ?? l.id_inspeccion,
            IdNodo: compId,
            TipoLectura: tipo,
            Valor: l.Valor ?? l.valor ?? "",
            Unidad: l.Unidad ?? l.unidad ?? "",
            EstadoAlerta: l.EstadoAlerta ?? l.estado_alerta ?? "verde",
          };
          if (!porComponente[compId])
            porComponente[compId] = { vibracion: {}, temperatura: {} };
          porComponente[compId][tipo] = lectura;
        });
        setLecturas(porComponente);
      })
      .catch((err) => {
        console.error("Error al obtener lecturas", err);
        setLecturas({});
      });
  }, [inspeccion]);

  const handleChange = (compId, tipo, campo, valor) => {
    setLecturas((prev) => ({
      ...prev,
      [compId]: {
        ...prev[compId],
        [tipo]: {
          ...prev[compId]?.[tipo],
          [campo]: valor,
          IdNodo: compId,
          TipoLectura: tipo,
          IdInspeccion: inspeccion?.id ?? inspeccion?.IdInspeccion,
        },
      },
    }));
  };

  const guardarLecturas = async () => {
    if (!inspeccion) return;
    const lecturasArray = [];
    componentes.forEach((comp) => {
      const compId = comp.IdNodo ?? comp.id;
      ["vibracion", "temperatura"].forEach((tipo) => {
        const l = lecturas[compId]?.[tipo];
        if (l && l.Valor !== undefined && l.Valor !== "") {
          lecturasArray.push({
            ...l,
            Unidad: l.Unidad || (tipo === "vibracion" ? "mm/s" : "°C"),
          });
        }
      });
    });

    if (lecturasArray.length === 0) return;

    setLoading(true);
    try {
      for (const l of lecturasArray) {
        const { IdLectura, Valor, Unidad, EstadoAlerta, ...rest } = l;
        const basePayload = {
          Valor: Valor !== "" ? parseFloat(Valor) : null,
          Unidad,
          EstadoAlerta,
        };

        if (IdLectura) {
          // Solo enviar los campos editables al actualizar
          await axios.put(`/api/lecturas/${IdLectura}`, basePayload, {
            withCredentials: true,
          });
        } else {
          const payload = {
            ...rest,
            ...basePayload,
            IdNodo: parseInt(rest.IdNodo, 10),
            IdInspeccion: parseInt(rest.IdInspeccion, 10),
          };
          await axios.post(`/api/lecturas`, payload, { withCredentials: true });
        }
      }
      mostrarNotificacion("Lecturas guardadas correctamente ✅");
    } catch (err) {
      console.error("Error al guardar lecturas", err);
      mostrarNotificacion("Error al guardar lecturas ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!nodoSeleccionado) return <p>Seleccione un nodo.</p>;

  return (
    <Container as="section" className="u-margin-top-md">
      {notificacion && <div className="notification-toast">{notificacion}</div>}
      {componentes.length === 0 ? (
        <p>No hay componentes.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Componente</th>
              <th>Vibración</th>
              <th>Estado</th>
              <th>Temp.</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {componentes.map((comp) => {
              const compId = comp.IdNodo ?? comp.id;
              const vib = lecturas[compId]?.vibracion || {};
              const temp = lecturas[compId]?.temperatura || {};
              return (
                <tr key={compId}>
                  <td>{comp.Descripcion || comp.descripcion}</td>
                  <td>
                    <FormInput
                      name={`vib-${compId}`}
                      value={vib.Valor ?? ""}
                      onChange={(e) =>
                        handleChange(compId, "vibracion", "Valor", e.target.value)
                      }
                      placeholder="Valor"
                      containerClassName=""
                    />
                  </td>
                  <td>
                    <FormSelect
                      name={`est-vib-${compId}`}
                      value={vib.EstadoAlerta ?? "verde"}
                      onChange={(e) =>
                        handleChange(
                          compId,
                          "vibracion",
                          "EstadoAlerta",
                          e.target.value
                        )
                      }
                      options={opcionesEstado}
                      containerClassName=""
                    />
                  </td>
                  <td>
                    <FormInput
                      name={`temp-${compId}`}
                      value={temp.Valor ?? ""}
                      onChange={(e) =>
                        handleChange(compId, "temperatura", "Valor", e.target.value)
                      }
                      placeholder="Valor"
                      containerClassName=""
                    />
                  </td>
                  <td>
                    <FormSelect
                      name={`est-temp-${compId}`}
                      value={temp.EstadoAlerta ?? "verde"}
                      onChange={(e) =>
                        handleChange(
                          compId,
                          "temperatura",
                          "EstadoAlerta",
                          e.target.value
                        )
                      }
                      options={opcionesEstado}
                      containerClassName=""
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="u-flex u-justify-end u-margin-top-md">
        <FormButton
          label="Guardar Lecturas"
          variant="success"
          onClick={guardarLecturas}
          isLoading={loading}
        />
      </div>
    </Container>
  );
};

LecturasTab.propTypes = {
  nodoSeleccionado: PropTypes.object,
  inspeccion: PropTypes.object,
};

export default LecturasTab;