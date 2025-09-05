// src/pages/inspecciones/InspeccionTabsWrapper.jsx
import { useState, useEffect } from "react";
import JerarquiaPanel from "../../components/JerarquiaPanel";
import Tabs from "../../components/Tabs";
import InspeccionForm from "./InspeccionForm";
import LecturasTab from "./LecturasTab";
import Container from "../../components/Container";
import FormButton from "../../components/FormButton";
import { FaEdit, FaPlus, FaClone, FaPrint } from "react-icons/fa";

import axios from "axios";
import { useAuth } from "../../auth/AuthContext"

// Reproduce un breve sonido de alerta cuando es llamado
const playAlertSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(660, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (err) {
    console.error("Error reproduciendo sonido de alerta", err);
  }
};

const InspeccionTabsWrapper = () => {
  const { user } = useAuth();
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const [inspecciones, setInspecciones] = useState([]);
  const [indexActual, setIndexActual] = useState(0);
  const [modo, setModo] = useState("lectura");
  const [tabActivo, setTabActivo] = useState("inspeccion");
  const [notificacion, setNotificacion] = useState(null);
  const esMedido = Boolean(nodoSeleccionado?.Medido);

  const mostrarNotificacion = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 3000);
  };

  // Carga el historial cuando cambia el nodo seleccionado
    const fetchInspecciones = () => {
      if (!nodoSeleccionado) return Promise.resolve();
    
    const id = nodoSeleccionado?.IdNodo ?? nodoSeleccionado?.id;
    return axios
      .get(`/api/inspecciones/by-nodo/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const normalizar = (item) => ({
          id: item.id ?? item.IdInspeccion,
          nodo_id: item.nodo_id ?? item.IdNodo,
          fecha: item.fecha ?? item.FechaHora,
          usuario_id: item.usuario_id ?? item.UsuarioId,
          estado_operativo_id:
            item.estado_operativo_id ?? item.IdEstadoOperativo,
          observacion: item.observacion ?? item.ObservacionGeneral,
          diagnostico_preliminar:
            item.diagnostico_preliminar ?? item.Diagnostico,
          id_ruta: item.id_ruta ?? item.IdRuta,
        });

        const data = Array.isArray(res.data)
          ? res.data
              .map(normalizar)
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          : [];

        setInspecciones(data);
        setIndexActual(data.length > 0 ? 0 : -1);
        setModo("lectura");
      })
      .catch(err => {
        console.error(err);
        setInspecciones([]);
        setIndexActual(-1);
        setModo("lectura");
      });
      };

  // Carga el historial cuando cambia el nodo seleccionado
  useEffect(() => {
    fetchInspecciones();
  }, [nodoSeleccionado]);

  // Alertar cuando el nodo seleccionado no está medido
  useEffect(() => {
    if (nodoSeleccionado && nodoSeleccionado.Medido === false) {
      playAlertSound();
      mostrarNotificacion("Seleccione un Equipo");
    }
  }, [nodoSeleccionado]);

  // Forzar pestaña activa cuando el nodo no tiene medición
  useEffect(() => {
    if (!esMedido) {
      setTabActivo("inspeccion");
    }
  }, [esMedido]);


  const handleClonar = async () => {
    if (!inspeccionActual || !nodoSeleccionado) return;

    const payload = {
      IdNodo: nodoSeleccionado?.IdNodo ?? nodoSeleccionado?.id,
      UsuarioId: user?.usuario_id,
      IdEstadoOperativo: inspeccionActual.estado_operativo_id,
      ObservacionGeneral: inspeccionActual.observacion,
      Diagnostico: inspeccionActual.diagnostico_preliminar,
      FechaHora: new Date().toISOString(),
    };

    try {
      await axios.post("/api/inspecciones", payload, { withCredentials: true });
      await fetchInspecciones();
      mostrarNotificacion("Inspección clonada correctamente ✅");
    } catch (err) {
      console.error("Error al clonar inspección:", err);
      mostrarNotificacion("Error al clonar la inspección ❌");
    }
  };

  const inspeccionActual = inspecciones[indexActual] || null;

  // Navegación
  const setPrimera = () => setIndexActual(0);
  const setAnterior = () => setIndexActual(i => Math.max(0, i - 1));
  const setSiguiente = () => setIndexActual(i => Math.min(inspecciones.length - 1, i + 1));
  const setUltima = () => setIndexActual(inspecciones.length - 1);

  const handleNueva = () => {
    setIndexActual(-1); // mostrar formulario limpio    setModo("edicion");
  };

  const acciones = [
    { label: "Editar", icon: <FaEdit />, onClick: () => setModo("edicion") },
    { label: "Clonar", icon: <FaClone />, onClick: handleClonar },
    { label: "Nueva", icon: <FaPlus />, onClick: handleNueva },
    { label: "Imprimir", icon: <FaPrint />, onClick: () => alert("Función no disponible aún") },
  ];

  const botonesNavegacion = [
    { label: "«", onClick: setUltima },
    { label: "<", onClick: setSiguiente },
    { label: ">", onClick: setAnterior },
    { label: "»", onClick: setPrimera },
  ];

  const tabsConfig = [
    {
      id: "inspeccion",
      label: "Inspección",
      content: (
        <>
          <InspeccionForm
            key={modo + (inspeccionActual?.id ?? "")}
            nodoSeleccionado={nodoSeleccionado}
            modo={modo}
            inspeccion={inspeccionActual}
          />

          <div className="u-flex u-justify-between u-margin-top-md u-gap-md">
            <div className="u-flex u-gap-xs u-margin-left-sm">
              {botonesNavegacion.map(btn => (
                <FormButton
                  key={btn.label}
                  label={btn.label}
                  size="small"
                  variant="ghost"
                  onClick={btn.onClick}
                  disabled={!inspeccionActual || inspecciones.length === 0}
                />
              ))}
            </div>

            <div className="u-flex u-gap-sm">
              {acciones.map(accion => (
                <FormButton
                  key={accion.label}
                  label={accion.label}
                  icon={accion.icon}
                  variant="primary"
                  size="small"
                  onClick={accion.onClick}
                  disabled={!inspeccionActual && accion.label !== "Nueva"}
                />
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      id: "lecturas",
      label: "Lecturas",
      disabled: !esMedido,
      content: (
        <LecturasTab
          nodoSeleccionado={nodoSeleccionado}
          inspeccion={inspeccionActual}
        />
      ),
    },
    {
      id: "hallazgos",
      label: "Hallazgos",
      disabled: !esMedido,
      content: <p>Hallazgos próximamente...</p>,
    },
  ];

  return (
    <Container className="layout layout--panel" padding="0" as="section">
      <JerarquiaPanel onNodoSeleccionado={setNodoSeleccionado} />

      <Container className="layout__contenido" padding="0" as="main">
        <Container className="u-padding-md">
          {notificacion && (
            <div className="notification-toast">{notificacion}</div>
          )}
          <h2 className="titulo-secundario">Monitoreo de Condiciones</h2>
          <Tabs
            tabsConfig={tabsConfig}
            activeTabId={tabActivo}
            onTabChange={(tabId) => {
              setTabActivo(tabId);
              setModo("lectura");
            }}
            ariaLabel="Inspección Técnica"
          />
        </Container>
      </Container>
    </Container>
  );
};

export default InspeccionTabsWrapper;
