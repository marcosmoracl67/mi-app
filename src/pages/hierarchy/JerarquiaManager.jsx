// src/components/jerarquia/JerarquiaManager.jsx
import {
  useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle
} from 'react';
import PropTypes from 'prop-types';
import * as jerarquiaService from '../../services/jerarquiaService';
import NodoArbol from './NodoArbol';
import Loader from '../../components/Loader';
import Alert from '../../components/Alert';
import Parrafo from '../../components/Parrafo';
import Container from '../../components/Container';
import SearchBar from '../../components/SearchBar';

const JerarquiaManager = forwardRef(({
  onArbolCargado,
  onNodoSeleccionado,
  nodoIdSeleccionadoExternamente,
  idNodoAExpandirTrasCarga,
  onExpansionHecha,
}, ref) => {
  const [nodosOriginales, setNodosOriginales] = useState([]);
  const [tiposNodo, setTiposNodo] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const expandirNodo = useCallback((idNodo) => {
    setExpandedNodes(prev => new Set(prev).add(idNodo));
  }, []);

  const cargarDatosIniciales = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nodosData, tiposData] = await Promise.all([
        jerarquiaService.obtenerJerarquiaCompleta(),
        jerarquiaService.obtenerTiposNodo(),
      ]);
      setNodosOriginales(nodosData);
      setTiposNodo(tiposData);
      if (onArbolCargado) {
        const raiz = nodosData.find(n => n.LFT === 1 || n.IdPadre === null);
        if (raiz) {
          onArbolCargado(raiz, tiposData, nodosData);
        } else {
          console.warn("No se encontró un nodo raíz (LFT=1 o IdPadre=null).");
          onArbolCargado(null, tiposData, nodosData);
        }
      }
    } catch (err) {
      setError(err.message || 'Error al cargar jerarquía.');
    } finally {
      setIsLoading(false);
    }
  }, [onArbolCargado]); 

  const actualizarSubarbol = useCallback(async (idNodoRaiz) => {
    try {
      const subTree = await jerarquiaService.obtenerSubarbol(idNodoRaiz);
      setNodosOriginales(prev => {
        const nodoPadre = prev.find(n => n.IdNodo === idNodoRaiz);
        if (!nodoPadre) return prev;
        const nuevosLFT = nodoPadre.LFT;
        const nuevosRGT = nodoPadre.RGT;
        const sinSub = prev.filter(n => n.LFT < nuevosLFT || n.RGT > nuevosRGT);
        return [...sinSub, ...subTree].sort((a, b) => a.LFT - b.LFT);
      });
    } catch (err) {
      setError("No se pudo actualizar parte de la jerarquía.");
    }
  }, []);

  const actualizarNodoLocal = useCallback((nodoActualizado) => {
    setNodosOriginales(prev =>
      prev.map(n =>
        n.IdNodo === nodoActualizado.IdNodo
          ? { ...n, ...nodoActualizado } // Merge all updated properties
          : n
      )
    );
  }, []);

  const actualizarJerarquiaConParcial = useCallback((nuevosNodosParciales, idNodoPadreAfectado) => {
    setNodosOriginales(prevNodos => {
        const padreAfectado = prevNodos.find(n => n.IdNodo === idNodoPadreAfectado);
        if (!padreAfectado) {
            return nuevosNodosParciales.sort((a, b) => a.LFT - b.LFT);
        }
        const lftPadre = padreAfectado.LFT;
        const rgtPadre = padreAfectado.RGT;
        const nodosFueraSubarbolPadre = prevNodos.filter(n => n.LFT < lftPadre || n.RGT > rgtPadre);
        const nuevosNodosTotal = [...nodosFueraSubarbolPadre, ...nuevosNodosParciales];
        return nuevosNodosTotal.sort((a, b) => a.LFT - b.LFT);
    });
  }, []); 

  // EXPOSICIÓN DE FUNCIONES E INFOR MACIÓN A TRAVÉS DE LA REF
  useImperativeHandle(ref, () => ({
    actualizarSubarbol, 
    actualizarNodoLocal, 
    expandirNodo, 
    recargarJerarquiaCompleta: cargarDatosIniciales, 
    actualizarJerarquiaConParcial,
    getNodosOriginales: () => nodosOriginales, // <-- ¡CORRECCIÓN CLAVE AQUÍ!
  }));

  useEffect(() => { cargarDatosIniciales(); }, [cargarDatosIniciales]);

  useEffect(() => {
    if (
      idNodoAExpandirTrasCarga &&
      typeof idNodoAExpandirTrasCarga === 'number' &&
      nodosOriginales.length > 0
    ) {
      setExpandedNodes(prev => {
        if (prev.has(idNodoAExpandirTrasCarga)) return prev;
        const nuevo = new Set(prev);
        nuevo.add(idNodoAExpandirTrasCarga);

        let currentId = idNodoAExpandirTrasCarga;
        let nodo = nodosOriginales.find(n => n.IdNodo === currentId);
        while (nodo && nodo.IdPadre !== null) {
          if (!nuevo.has(nodo.IdPadre)) {
            nuevo.add(nodo.IdPadre);
          }
          nodo = nodosOriginales.find(n => n.IdNodo === nodo.IdPadre);
        }
        return nuevo;
      });
      onExpansionHecha?.(idNodoAExpandirTrasCarga);
    }
  }, [idNodoAExpandirTrasCarga, nodosOriginales, onExpansionHecha]);

  const procesarNodosParaUI = useMemo(() => {
    if (!nodosOriginales.length) return [];

    const busquedaLower = busqueda.trim().toLowerCase();
    const nodosProcesados = [];
    const ancestryStack = [];

    // Identificar coincidencias por búsqueda (lógica existente)
    const idsCoincidentes = new Set(
      nodosOriginales
        .filter(n => n.Descripcion?.toLowerCase().includes(busquedaLower))
        .map(n => n.IdNodo)
    );
    const ancestrosDeCoincidencias = new Set();
    if (busquedaLower) {
      nodosOriginales.forEach(n => {
        if (idsCoincidentes.has(n.IdNodo)) {
          let ancestro = n;
          while (ancestro?.IdPadre) {
            ancestrosDeCoincidencias.add(ancestro.IdPadre);
            ancestro = nodosOriginales.find(x => x.IdNodo === ancestro.IdPadre);
          }
        }
      });
    }

    nodosOriginales.forEach(nodo => {
      while (
        ancestryStack.length > 0 &&
        ancestryStack[ancestryStack.length - 1].RGT < nodo.RGT
      ) {
        ancestryStack.pop();
      }

      const profundidad = ancestryStack.length;
      const tieneHijos = nodo.RGT - nodo.LFT > 1;
      const esCoincidencia = idsCoincidentes.has(nodo.IdNodo);
      const esAncestroDeCoincidencia = ancestrosDeCoincidencias.has(nodo.IdNodo);

      const visible =
        busquedaLower
          ? (esCoincidencia || esAncestroDeCoincidencia)
          : (
              profundidad === 0 ||
              expandedNodes.has(nodo.IdPadre)
            );

      const nodoUI = {
        ...nodo,
        profundidad,
        tieneHijos,
        esVisibleCalculada: visible,
        matchBusqueda: esCoincidencia,
      };
      nodosProcesados.push(nodoUI);
      if (tieneHijos) ancestryStack.push(nodoUI);
    });
    return nodosProcesados.filter(n => n.esVisibleCalculada);
  }, [nodosOriginales, busqueda, expandedNodes]);

  const handleToggleExpand = useCallback((idNodo) => {
    setExpandedNodes(prev => {
      const nuevo = new Set(prev);
      nuevo.has(idNodo) ? nuevo.delete(idNodo) : nuevo.add(idNodo);
      return nuevo;
    });
  }, []);

  const handleSeleccionarNodoLocal = useCallback((nodo) => {
  // 'nodo' aquí es el nodo del 'procesarNodosParaUI' que ya tiene 'tieneHijos'
  onNodoSeleccionado?.(nodo); 
  }, [onNodoSeleccionado]);

  if (isLoading && nodosOriginales.length === 0) {
    return <Loader text="Cargando jerarquía..." />;
  }

  return (
    <Container as="section" className="jerarquia-manager" padding="0">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} showCloseButton />}

      <Container as="div" className="jerarquia-manager__acciones-globales">
        <SearchBar
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar nodo..."
          className="search-bar--jerarquia"
        />
      </Container>

      <Container as="div" className="jerarquia-manager__arbol-container">
        {!isLoading && procesarNodosParaUI.length === 0 && !error && (
          <Parrafo className="jerarquia-manager__mensaje-vacio" align="center">
            No hay nodos para mostrar.
          </Parrafo>
        )}
        {procesarNodosParaUI.map(nodo =>
          nodo.esVisibleCalculada && (
            <NodoArbol
              key={nodo.IdNodo}
              nodo={nodo}
              tiposNodo={tiposNodo}
              isExpanded={expandedNodes.has(nodo.IdNodo)}
              onToggleExpand={handleToggleExpand}
              onSeleccionar={handleSeleccionarNodoLocal}
              estaSeleccionado={nodo.IdNodo === nodoIdSeleccionadoExternamente}
            />
          )
        )}
      </Container>
    </Container>
  );
});

JerarquiaManager.propTypes = {
  onArbolCargado: PropTypes.func,
  onNodoSeleccionado: PropTypes.func,
  nodoIdSeleccionadoExternamente: PropTypes.any,
  idNodoAExpandirTrasCarga: PropTypes.any,
  onExpansionHecha: PropTypes.func,
};

JerarquiaManager.defaultProps = {
  idNodoAExpandirTrasCarga: null,
};

export default JerarquiaManager;
