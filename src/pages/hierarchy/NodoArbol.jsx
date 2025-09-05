// src/components/jerarquia/NodoArbol.jsx
import React from 'react'; // Añadir import React
import PropTypes from 'prop-types';
import FormButton from '../../components/FormButton';
import * as FaIcons from 'react-icons/fa';
import Parrafo from '../../components/Parrafo';

const IconComponents = {
    FaArrowDown: FaIcons.FaArrowDown, FaBuilding: FaIcons.FaBuilding, FaSitemap: FaIcons.FaSitemap,
    FaTruck: FaIcons.FaTruck, FaProjectDiagram: FaIcons.FaProjectDiagram, FaLink: FaIcons.FaLink,
    FaAsterisk: FaIcons.FaAsterisk, FaGears: FaIcons.FaCogs, FaCogs: FaIcons.FaCogs,
    FaCog: FaIcons.FaCog, FaCubes: FaIcons.FaCubes, FaIndustry: FaIcons.FaIndustry,
    FaQuestionCircle: FaIcons.FaQuestionCircle,
};

const NodoArbol = ({
    nodo,
    tiposNodo,
    isExpanded,
    onToggleExpand,
    onSeleccionar,
    estaSeleccionado,
}) => {
    const tipoNodoActual = tiposNodo.find(tn => tn.idtiponodo === nodo.IdTipoNodo);
    let IconoDelTipo = IconComponents.FaQuestionCircle;
    // console.log("NodoArbol: Renderizando nodo", nodo.Descripcion, "estaSeleccionado:", estaSeleccionado); // DEBUG
    if (tipoNodoActual && tipoNodoActual.icono && IconComponents[tipoNodoActual.icono.trim()]) {
        IconoDelTipo = IconComponents[tipoNodoActual.icono.trim()];
    }

    // Ya no se usa el style de indentación aquí directamente en el item principal.
    // const indentStyle = { paddingLeft: `${nodo.profundidad * 20}px` };

    const handleNodoClick = (e) => {
        if (e.target.closest('.nodo-arbol__toggler .button')) { // Ajustado para apuntar al botón dentro del toggler
            return;
        }
        if (onSeleccionar) {
            onSeleccionar(nodo);
        }
    };

    return (
        <div // Contenedor de la FILA COMPLETA del nodo
            className={`
                nodo-arbol__item
                ${!nodo.Activo ? 'nodo-arbol__item--inactivo' : ''}
                ${nodo.profundidad === 0 ? 'nodo-arbol__item--raiz' : ''}
                ${estaSeleccionado ? 'nodo-arbol__item--seleccionado' : ''}
            `}
            onClick={handleNodoClick}
            role="treeitem"
            aria-expanded={nodo.tieneHijos ? isExpanded : undefined}
            aria-selected={estaSeleccionado}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNodoClick(e);}}
        >
            {/* Contenedor para las líneas guía de indentación */}
            <div className="nodo-arbol__lineas-guia-container">
                {Array.from({ length: nodo.profundidad }).map((_, i) => (
                    <div key={`guia-${nodo.IdNodo}-${i}`} className="nodo-arbol__guia-vertical"></div>
                ))}
            </div>

            {/* Contenedor para el contenido real del nodo (toggler, icono, descripción) */}
            {/* Este div se indentará visualmente por el padding que le demos o por el espacio que ocupen las guías */}
            <div className="nodo-arbol__contenido-wrapper">
                <div className="nodo-arbol__toggler">
                    {nodo.tieneHijos ? (
                        <FormButton
                            icon={isExpanded ? <FaIcons.FaChevronDown /> : <FaIcons.FaChevronRight />}
                            onClick={(e) => { e.stopPropagation(); onToggleExpand(nodo.IdNodo);}}
                            variant="subtle"
                            size="small"
                            aria-label={isExpanded ? `Colapsar ${nodo.Descripcion}` : `Expandir ${nodo.Descripcion}`}
                        />
                    ) : (
                        <span className="nodo-arbol__toggler-placeholder"></span>
                    )}
                </div>
                <div className="nodo-arbol__icono-tipo">
                    <IconoDelTipo title={tipoNodoActual?.descripcion || 'Tipo desconocido'} />
                </div>
                <Parrafo className="nodo-arbol__descripcion" margin="0" size={"1rem"} lineHeight={"1.3"}>
                    {nodo.Descripcion}
                </Parrafo>
            </div>
        </div>
    );
};

NodoArbol.propTypes = {
    nodo: PropTypes.shape({
        IdNodo: PropTypes.any.isRequired,
        Descripcion: PropTypes.string.isRequired,
        profundidad: PropTypes.number.isRequired,
        // ... otras props de nodo
        Activo: PropTypes.bool.isRequired,
        tieneHijos: PropTypes.bool.isRequired,
        LFT: PropTypes.number.isRequired, // Para la condición de eliminación de raíz
        IdPadre: PropTypes.any,           // Para la condición de eliminación de raíz
    }).isRequired,
    tiposNodo: PropTypes.array.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggleExpand: PropTypes.func.isRequired,
    onSeleccionar: PropTypes.func.isRequired,
    estaSeleccionado: PropTypes.bool.isRequired,
};

export default NodoArbol;