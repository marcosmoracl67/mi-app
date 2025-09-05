// src/services/detalleNodeService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
});

// ... (getDetalleFieldsByTipoNodo, getListOptionsByDetalleNodoId se mantienen) ...

/**
 * Obtiene los valores de detalle para un nodo de jerarquía específico.
 * @param {number|string} idNodo ID del nodo de jerarquía.
 * @returns {Promise<Array<Object>>} Array de objetos { NodoDetalleValor_Id, IdNodo, DetalleNodo_Id, Valor, ... }.
 */
export const getNodoDetailValuesByNodoId = async (idNodo) => {
    const response = await fetch(`${API_BASE_URL}/nodo-detalle-valores/by-nodo/${idNodo}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al obtener valores de detalle del nodo.' }));
        throw new Error(errorData.message || 'Error al obtener valores de detalle del nodo.');
    }
    return response.json();
};

/**
 * Crea un nuevo valor de detalle para un nodo.
 * @param {Object} data Objeto con { IdNodo (numérico), DetalleNodo_Id (numérico), Valor (string) }.
 *                       Las propiedades deben ser PascalCase para el payload.
 * @returns {Promise<Object>} La respuesta del backend (ej. { msg: ..., valorDetalle: {...} }).
 */
export const createNodoDetailValue = async (data) => {
    const response = await fetch(`${API_BASE_URL}/nodo-detalle-valores`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data), // Ya data viene con PascalCase
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear valor de detalle.' }));
        throw new Error(errorData.msg || errorData.message || 'Error al crear valor de detalle.');
    }
    return response.json();
};

/**
 * Actualiza un valor de detalle existente.
 * @param {number|string} id NodoDetalleValor_Id.
 * @param {Object} data Objeto con { Valor (string) }. La propiedad Valor debe ser PascalCase.
 * @returns {Promise<Object>} La respuesta del backend (ej. { msg: ..., valorDetalle: {...} }).
 */
export const updateNodoDetailValue = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/nodo-detalle-valores/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data), // data debe ser { Valor: ... }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al actualizar valor de detalle.' }));
        throw new Error(errorData.msg || errorData.message || 'Error al actualizar valor de detalle.');
    }
    return response.json();
};

/**
 * Elimina un valor de detalle.
 * @param {number|string} id NodoDetalleValor_Id.
 * @returns {Promise<Object>} La respuesta del backend.
 */
export const deleteNodoDetailValue = async (id) => {
    const response = await fetch(`${API_BASE_URL}/nodo-detalle-valores/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al eliminar valor de detalle.' }));
        throw new Error(errorData.msg || errorData.message || 'Error al eliminar valor de detalle.');
    }
    return response.json();
};