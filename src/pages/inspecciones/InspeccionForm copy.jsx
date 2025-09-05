// src/pages/inspecciones/InspeccionForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/Container";
import Titulo from "../../components/Titulo";
import FormTextarea from "../../components/FormTextarea";
import FormSelect from "../../components/FormSelect";
import FormDatePicker from "../../components/FormDatePicker";
import FormButton from "../../components/FormButton";
import { useAuth } from "../../auth/AuthContext";

// fila  = adaptación dentro de InspeccionForm.jsx
const InspeccionForm = ({ nodoSeleccionado, modo = "lectura", inspeccion }) => {
  

  const { user } = useAuth();
  const [estadoOperativo, setEstadoOperativo] = useState("");
  const [fecha, setFecha] = useState(() => new Date());
  const [observacion, setObservacion] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const edicion = modo === "edicion";

  useEffect(() => {
    axios
      .get("/api/estado-operativo", { withCredentials: true })
      .then((res) => {
        const opciones = Array.isArray(res.data)
          ? res.data.map((item) => ({
              value: item.id ?? item.IdEstadoOperativo,
              label: item.nombre ?? item.Nombre,
            }))
          : [];
        setEstados(opciones);
      })
      .catch((err) =>
        console.error("Error al cargar Estados Operativos", err)
      );
  }, []);

  const validar = () => {
    const nuevosErrores = {};
    if (!estadoOperativo) nuevosErrores.estadoOperativo = "Seleccione un estado operativo.";
    if (!observacion.trim()) nuevosErrores.observacion = "La observación es obligatoria.";
    if (!diagnostico.trim()) nuevosErrores.diagnostico = "El diagnóstico es obligatorio.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

useEffect(() => {
    if (inspeccion) {
      setEstadoOperativo(inspeccion.estado_operativo_id);
      setFecha(new Date(inspeccion.fecha));
      setObservacion(inspeccion.observacion);
      setDiagnostico(inspeccion.diagnostico_preliminar);
    } else {
      // limpiar para nuevo registro o sin inspección
      setEstadoOperativo("");
      setObservacion("");
      setDiagnostico("");
      setFecha(new Date());
    }
  }, [inspeccion, modo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      IdNodo: nodoSeleccionado?.IdNodo ?? nodoSeleccionado?.id,
      UsuarioId: user?.usuario_id,
      IdEstadoOperativo: parseInt(estadoOperativo, 10),
      ObservacionGeneral: observacion,
      Diagnostico: diagnostico,
      FechaHora: fecha.toISOString(),
    };

    const idInspeccion = inspeccion?.id ?? inspeccion?.IdInspeccion;

    setLoading(true);
    try {
      if (idInspeccion) {
        await axios.put(`/api/inspecciones/${idInspeccion}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post("/api/inspecciones", payload, {
          withCredentials: true,
        });
      }

      alert("Inspección registrada correctamente ✅");
    } catch (error) {
      console.error("Error al guardar inspección:", error);
      alert("Error al guardar la inspección ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container as="section" className="u-margin-bottom-md">
      <Titulo text={edicion ? "Editar Inspección" : "Resumen de Inspección"} />

      <form onSubmit={edicion ? handleSubmit : undefined} noValidate>
        <div className="form-row">
          <div className="form-col">
            <FormSelect
              name="estadoOperativo"
              label="Estado Operativo"
              value={estadoOperativo}
              onChange={(e) => setEstadoOperativo(e.target.value)}
              error={errores.estadoOperativo}
              options={estados}
              disabled={!edicion}
              required={edicion}
            />
          </div>
          <div className="form-col">
            <FormDatePicker
              name="fecha"
              label="Fecha de Inspección"
              value={fecha}
              onChange={setFecha}
              disabled={!edicion}
              required={edicion}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <FormTextarea
              name="observacion"
              label="Observación General"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              error={errores.observacion}
              readOnly={!edicion}
              required={edicion}
              rows={4}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <FormTextarea
              name="diagnostico"
              label="Diagnóstico Preliminar"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              error={errores.diagnostico}
              readOnly={!edicion}
              required={edicion}
              rows={4}
            />
          </div>
        </div>

        {edicion && (
          <div className="form-row u-justify-end">
            <FormButton
              label="Guardar Inspección"
              type="submit"
              variant="success"
              isLoading={loading}
            />
          </div>
        )}
      </form>
    </Container>
  );
};

export default InspeccionForm;
