// src/components/hierarchy/DynamicDetailForm.jsx
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import * as detalleNodeService from '../../services/detalleNodeService'; 
import * as valorDetalleNodeService from '../../services/ValorDetalleNodeService';

import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import ToggleSwitch from '../../components/ToggleSwitch'; 
import FormButton from '../../components/FormButton';
import FormDatePicker from '../../components/FormDatePicker';
import Loader from '../../components/Loader';
import Parrafo from '../../components/Parrafo';
import Alert from '../../components/Alert';
import {FaEdit, FaSave} from 'react-icons/fa';


// Componente para renderizar un campo de detalle dinámico
const DynamicField = ({ fieldDef, value, onChange, disabled, options }) => {
    const { descripcion, tipodetalle, detallenodo_id } = fieldDef; 

    switch (tipodetalle) {
        case 'desc': 
            return (
                <FormInput
                    label={descripcion}
                    name={String(detallenodo_id)} 
                    value={value || ''}
                    onChange={(e) => onChange(String(detallenodo_id), e.target.value)}
                    disabled={disabled}
                />
            );
        case 'int':
            return (
                <FormInput
                    label={descripcion}
                    name={String(detallenodo_id)}
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(String(detallenodo_id), parseInt(e.target.value) || null)} 
                    disabled={disabled}
                />
            );
        case 'list':
            const selectOptions = options.map(opt => ({ value: String(opt.lista_id), label: opt.descripcion }));
            return (
                <FormSelect
                    label={descripcion}
                    name={String(detallenodo_id)}
                    value={value || ''}
                    onChange={(e) => onChange(String(detallenodo_id), e.target.value)}
                    options={selectOptions} 
                    disabled={disabled}
                    placeholder={`Seleccione ${descripcion.toLowerCase()}...`}
                />
            );
        case 'bool': 
            return (
                <ToggleSwitch
                    label={descripcion}
                    name={String(detallenodo_id)}
                    checked={Boolean(value)}
                    onChange={(e) => onChange(String(detallenodo_id), e.target.checked)}
                    disabled={disabled}
                />
            );
        case 'date': // Tipo 'date' para FormDatePicker
            return (
                <FormDatePicker
                    label={descripcion}
                    name={String(detallenodo_id)}
                    selectedDate={value ? new Date(value) : null} // Convertir string a Date object
                    onDateChange={(date) => onChange(String(detallenodo_id), date ? date.toISOString() : null)} // Convertir Date a ISO string
                    disabled={disabled}
                    placeholder={`Seleccione ${descripcion.toLowerCase()}...`}
                />
            );
        case 'float': // Tipo 'float' para FormInput type="number"
            return (
                <FormInput
                    label={descripcion}
                    name={String(detallenodo_id)}
                    type="number" // Usa type="number" para flotantes
                    value={value || ''}
                    onChange={(e) => onChange(String(detallenodo_id), parseFloat(e.target.value) || null)} // Parsear a float
                    disabled={disabled}
                />
            );
        case 'file':
        case 'img':
            return null; 
        default:
            return (
                <Parrafo variant="error">Tipo de detalle "{tipodetalle}" no soportado para "{descripcion}".</Parrafo>
            );
    }
};

DynamicField.propTypes = {
    fieldDef: PropTypes.shape({
        detallenodo_id: PropTypes.number.isRequired,
        descripcion: PropTypes.string.isRequired,
        tipodetalle: PropTypes.string.isRequired,
        orden: PropTypes.number,
    }).isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    options: PropTypes.array, 
};
DynamicField.defaultProps = {
    value: undefined,
    disabled: false,
    options: [],
};


const DynamicDetailForm = ({ idTipoNodo, nodoSeleccionado, mode, isLoadingForm, fieldDefinitions }) => {
    // const [fieldDefinitions, setFieldDefinitions] = useState([]); // REMOVED: Now received as prop
    const [detailValues, setDetailValues] = useState({}); // Clave: detallenodo_id (string), Valor: el valor del campo
    const [listOptions, setListOptions] = useState(new Map()); 
    const [isLoadingDetailsData, setIsLoadingDetailsData] = useState(true); // Loading values for the selected node
    const [error, setError] = useState(null);
    const [isEditingDetail, setIsEditingDetail] = useState(false); // Modo de edición para este tab
    const [isSavingDetails, setIsSavingDetails] = useState(false); // Estado de guardado

    const estaDeshabilitado = !isEditingDetail || isLoadingDetailsData || isSavingDetails; // Deshabilitado if not editing or is loading/saving

    // Cargar VALORES del nodo y opciones de lista (fieldDefinitions now passed as prop)
    useEffect(() => {
        const fetchDetailValuesAndListOptions = async () => {
            if (!nodoSeleccionado?.IdNodo || fieldDefinitions.length === 0) { 
                setDetailValues({});
                setListOptions(new Map());
                setIsLoadingDetailsData(false);
                return;
            }
            setIsLoadingDetailsData(true);
            setError(null);
            setIsEditingDetail(false); 
            try {
                // Fetch only detail values and list options, as fieldDefinitions are already passed
                const nodoValues = await valorDetalleNodeService.getNodoDetailValuesByNodoId(nodoSeleccionado.IdNodo);
                
                const listFieldIds = fieldDefinitions.filter(def => def.tipodetalle === 'list').map(def => def.detallenodo_id);
                if (listFieldIds.length > 0) {
                    const optionsPromises = listFieldIds.map(async (id) => ({
                        id,
                        options: await detalleNodeService.getListOptionsByDetalleNodoId(id) // CORRECTO: de detalleNodeService
                    }));
                    const loadedOptions = await Promise.all(optionsPromises);
                    const optionsMap = new Map(loadedOptions.map(item => [item.id, item.options]));
                    setListOptions(optionsMap);
               } else {
                    setListOptions(new Map());
                }

                const initialDetailValues = {};
                const valuesMap = new Map(nodoValues.map(val => [String(val.DetalleNodo_Id), val])); 
                
                fieldDefinitions.forEach(field => {
                    const fieldName = String(field.detallenodo_id);
                    const existingValue = valuesMap.get(fieldName);

                    if (existingValue) {
                        initialDetailValues[fieldName] = existingValue.Valor; 
                        initialDetailValues[`${fieldName}_id`] = existingValue.NodoDetalleValor_Id; 
                    } else {
                        initialDetailValues[fieldName] = ''; 
                    }
                });
                setDetailValues(initialDetailValues);

            } catch (error) {
                setError(error.message || 'Error al cargar los detalles dinámicos del nodo.');
                console.error("❌ Error cargando valores de detalle o list options", error);
            } finally {
                setIsLoadingDetailsData(false);
            }
        };
        fetchDetailValuesAndListOptions();
    }, [nodoSeleccionado?.IdNodo, fieldDefinitions]); // Rerun when selected node or its field definitions change


    const handleDynamicInputChange = useCallback((fieldName, value) => {
        setDetailValues(prev => ({ ...prev, [fieldName]: value }));
    }, []);

    const handleSaveDetails = useCallback(async () => {
        setIsSavingDetails(true);
        setError(null); 
        try {
            const updatesPromises = [];

            fieldDefinitions.forEach(field => {
                const fieldId = String(field.detallenodo_id);
                const currentValue = detailValues[fieldId];
                const existingNodoDetalleValorId = detailValues[`${fieldId}_id`]; 

                const valorGuardar = currentValue != null ? String(currentValue) : null; 

                if (field.tipodetalle !== 'file' && field.tipodetalle !== 'img') {
                    if (existingNodoDetalleValorId) { 
                        updatesPromises.push(
                            // LLAMADA A SERVICIO CORREGIDA
                            valorDetalleNodeService.updateNodoDetailValue(existingNodoDetalleValorId, { Valor: valorGuardar })
                                .then(res => { 
                                    setDetailValues(prev => ({ 
                                        ...prev, 
                                        [fieldId]: res.valorDetalle.Valor, 
                                        [`${fieldId}_id`]: res.valorDetalle.NodoDetalleValor_Id 
                                    }));
                                })
                        );
                    } else if (valorGuardar !== null && valorGuardar !== '') { 
                        updatesPromises.push(
                            // LLAMADA A SERVICIO CORREGIDA
                            valorDetalleNodeService.createNodoDetailValue({
                                IdNodo: nodoSeleccionado.IdNodo,
                                DetalleNodo_Id: field.detallenodo_id,
                                Valor: valorGuardar,
                            })
                            .then(res => { 
                                setDetailValues(prev => ({ 
                                    ...prev, 
                                    [`${fieldId}_id`]: res.valorDetalle.NodoDetalleValor_Id 
                                }));
                            })
                        );
                    }
                }
            });

            await Promise.all(updatesPromises);
            console.log("Detalles guardados exitosamente.");
            setIsEditingDetail(false); 

        } catch (err) {
            setError(err.message || "Error al guardar los detalles.");
            console.error("Error al guardar detalles:", err);
        } finally {
            setIsSavingDetails(false);
        }
    }, [detailValues, fieldDefinitions, nodoSeleccionado]);

    if (isLoadingDetailsData) {
        return <Loader text="Cargando configuración de detalles..." overlay={true} />;
    }

    if (error) {
        return <Alert type="error" message={error} showCloseButton onClose={() => setError(null)} />;
    }

    if (fieldDefinitions.length === 0) {
        return <Parrafo align="center" padding="var(--spacing-lg)">No hay detalles configurados para este tipo de nodo.</Parrafo>;
    }

    const filteredFields = fieldDefinitions.filter(field => 
        field.tipodetalle !== 'file' && field.tipodetalle !== 'img'
    ).sort((a, b) => a.orden - b.orden); 

    if (filteredFields.length === 0) {
        return <Parrafo align="center" padding="var(--spacing-lg)">No hay detalles visualizables configurados para este tipo de nodo.</Parrafo>;
    }

    return (
        <div className="dynamic-detail-form-container" style={{ padding: 'var(--spacing-md)' }}>
            {filteredFields.map(field => (
                <DynamicField
                    key={field.detallenodo_id}
                    fieldDef={field}
                    value={detailValues[String(field.detallenodo_id)]} 
                    onChange={handleDynamicInputChange}
                    disabled={estaDeshabilitado}
                    options={listOptions.get(field.detallenodo_id) || []}
                />
            ))}
            {/* BOTONES DE ACCIÓN PARA EL TAB DETALLE */}
            <div className="dynamic-detail-form__actions-footer" style={{ marginTop: 'var(--spacing-lg)' }}>
                {isEditingDetail ? (
                    <>
                        <FormButton
                            label="Cancelar"
                            onClick={() => setIsEditingDetail(false)}
                            variant="outline"
                            type="button"
                            size="small"
                            disabled={isSavingDetails} 
                        />
                        <FormButton
                            label="Guardar Cambios"
                            onClick={handleSaveDetails} 
                            icon={<FaSave />}
                            type="button" 
                            size="small"
                            variant="default"
                            isLoading={isSavingDetails} 
                            style={{ marginLeft: '0.5rem' }}
                        />
                    </>
                ) : (
                    <FormButton
                        label="Editar Detalles"
                        onClick={() => setIsEditingDetail(true)}
                        icon={<FaEdit />}
                        size="small"
                        variant="default"
                        disabled={!idTipoNodo || isLoadingDetailsData || !nodoSeleccionado || isSavingDetails} 
                    />
                )}
            </div>
        </div>
    );
};

DynamicDetailForm.propTypes = {
    idTipoNodo: PropTypes.number,
    nodoSeleccionado: PropTypes.object,
    mode: PropTypes.string.isRequired, 
    isLoadingForm: PropTypes.bool, 
    fieldDefinitions: PropTypes.array.isRequired, // Field definitions now passed as prop
    // onCamposCargados: PropTypes.func, // REMOVED: No longer needed
};
DynamicDetailForm.defaultProps = {
    idTipoNodo: null,
    nodoSeleccionado: null,
    isLoadingForm: false,
    fieldDefinitions: [], // Provide a default empty array for safety
};

export default DynamicDetailForm;