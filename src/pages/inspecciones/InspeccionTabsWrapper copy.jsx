// src/pages/inspecciones/InspeccionTabsWrapper.jsx
import { useState, useEffect } from "react";
import JerarquiaPanel from "../../components/JerarquiaPanel";
import Tabs from "../../components/Tabs";
import InspeccionForm from "./InspeccionForm";
import Container from "../../components/Container";
import FormButton from "../../components/FormButton";
import { FaEdit, FaPlus, FaClone, FaPrint } from "react-icons/fa";

import axios from "axios";

const InspeccionTabsWrapper = () => {
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const [inspecciones, setInspecciones] = useState([]);
  const [indexActual, setIndexActual] = useState(0);
  const [modo, setModo] = useState("lectura");
  const [tabActivo, setTabActivo] = useState("inspeccion");

  // Carga el historial cuando cambia el nodo seleccionado
  useEffect(() => {
    if (!nodoSeleccionado) return;
    
    const id = nodoSeleccionado?.IdNodo ?? nodoSeleccionado?.id;
    axios
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
  }, [nodoSeleccionado]);

  const inspeccionActual = inspecciones[indexActual] || null;

  // Navegación
  const setPrimera = () => setIndexActual(0);
  const setAnterior = () => setIndexActual(i => Math.max(0, i - 1));
  const setSiguiente = () => setIndexActual(i => Math.min(inspecciones.length - 1, i + 1));
  const setUltima = () => setIndexActual(inspecciones.length - 1);

  const handleNueva = () => {
    setIndexActual(-1); // mostrar formulario limpio
    setModo("edicion");
  };

  const acciones = [
    { label: "Editar", icon: <FaEdit />, onClick: () => setModo("edicion") },
    { label: "Clonar", icon: <FaClone />, onClick: () => alert("Función no disponible aún") },
    { label: "Nueva", icon: <FaPlus />, onClick: handleNueva },
    { label: "Imprimir", icon: <FaPrint />, onClick: () => alert("Función no disponible aún") },
  ];

  const botonesNavegacion = [
    { label: "«", onClick: setPrimera },
    { label: "<", onClick: setAnterior },
    { label: ">", onClick: setSiguiente },
    { label: "»", onClick: setUltima },
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
      content: <p>Lecturas próximamente...</p>,
    },
    {
      id: "hallazgos",
      label: "Hallazgos",
      content: <p>Hallazgos próximamente...</p>,
    },
  ];

  return (
    <Container className="layout layout--panel" padding="0" as="section">
      <JerarquiaPanel onNodoSeleccionado={setNodoSeleccionado} />

      <Container className="layout__contenido" padding="0" as="main">
        <Container className="u-padding-md">
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
