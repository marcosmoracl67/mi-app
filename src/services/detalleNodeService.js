// src/services/detalleNodeService.js

import { API_BASE_URL } from '../config.js';
const API_URL = `${API_BASE_URL}/api`;

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
});

/**
 * Obtiene la definición de los campos de detalle para un tipo de nodo específico.
 * @param {number|string} idTipoNodo ID del tipo de nodo.
 * @returns {Promise<Array<Object>>} Array de definiciones de campos de detalle.
 */
export const getDetalleFieldsByTipoNodo = async (idTipoNodo) => {
    const response = await fetch(`${API_URL}/detalle-nodo/${idTipoNodo}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al obtener definiciones de detalle.' }));
        throw new Error(errorData.message || 'Error al obtener definiciones de detalle.');
    }
    return response.json();
};

/**
 * Obtiene las opciones de lista para un campo de detalle específico.
 * @param {number|string} detallenodo_id ID de la definición del campo de detalle (detallenodo_id).
 * @returns {Promise<Array<Object>>} Array de opciones de lista ({ descripcion, lista_id }).
 */
export const getListOptionsByDetalleNodoId = async (detallenodo_id) => {
    const response = await fetch(`${API_URL}/listas/by-detallenodo/${detallenodo_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al obtener opciones de lista.' }));
        throw new Error(errorData.message || 'Error al obtener opciones de lista.');
    }
    return response.json();
};

// NOTA: Endpoint para obtener/guardar VALORES de los detalles de un nodo de jerarquía
// NO EXISTE EN EL BACKEND AÚN. ESTO ES SOLO PARA EL LAYOUT DINÁMICO.