// src/services/jerarquiaService.js
import { API_BASE_URL } from '../config.js';
const API_URL = `${API_BASE_URL}/api`;

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    // Si necesitas enviar un token JWT en los headers (además de la cookie HttpOnly):
    // const token = localStorage.getItem('token'); // o donde lo almacenes
    // return token ? { ...baseHeaders, 'Authorization': `Bearer ${token}` } : baseHeaders;
});

/**
 * Obtiene todos los nodos del árbol ordenados jerárquicamente.
 * Corresponde a GET /api/jerarquia
 * @returns {Promise<Array<Object>>} Lista plana de nodos ordenada por LFT.
 */
export const obtenerJerarquiaCompleta = async () => {
    const response = await fetch(`${API_URL}/jerarquia`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include', // Esencial para enviar cookies (como el JWT de sesión)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al obtener la jerarquía de nodos.' }));
        throw new Error(errorData.message || 'Error al obtener la jerarquía de nodos.');
    }
    return response.json();
};

/**
 * Obtiene un subárbol a partir del nodo con el ID especificado.
 * Corresponde a GET /api/jerarquia/:id/subtree
 * @param {number|string} idNodoRaiz ID del nodo raíz del subárbol.
 * @returns {Promise<Array<Object>>} Lista plana de nodos hijos.
 */
export const obtenerSubarbol = async (idNodoRaiz) => {
     const response = await fetch(`${API_URL}/jerarquia/${idNodoRaiz}/subtree`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al obtener el subárbol del nodo ${idNodoRaiz}.` }));
        throw new Error(errorData.message || `Error al obtener el subárbol del nodo ${idNodoRaiz}.`);
    }
    return response.json();
};

/**
 * Inserta un nuevo nodo como hijo de otro.
 * Corresponde a POST /api/jerarquia
 * @param {Object} datosNuevoNodo Objeto con { descripcion, idPadre, idTipoNodo, activo }.
 * @returns {Promise<Object>} Respuesta del servidor (generalmente un mensaje de éxito).
 */
export const crearNodo = async (datosNuevoNodo) => {
    console.log("[SERVICE] crearNodo - Enviando payload:", datosNuevoNodo); // Buen log para ver qué se envía
    const response = await fetch(`${API_URL}/jerarquia`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(datosNuevoNodo),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear el nuevo nodo.' }));
        throw new Error(errorData.message || 'Error al crear el nuevo nodo.');
    }
    return response.json();
};

/**
 * Renombra un nodo existente.
 * Corresponde a PUT /api/jerarquia/:id
 * @param {number|string} idNodo ID del nodo a renombrar.
 * @param {string} nuevaDescripcion El nuevo nombre para el nodo.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const renombrarNodo = async (idNodo, nuevaDescripcion) => {
     const response = await fetch(`${API_URL}/jerarquia/${idNodo}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ descripcion: nuevaDescripcion }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al renombrar el nodo ${idNodo}.` }));
        throw new Error(errorData.message || `Error al renombrar el nodo ${idNodo}.`);
    }
    return response.json();
};

/**
 * Elimina un nodo y todo su subárbol.
 * Corresponde a DELETE /api/jerarquia/:id
 * @param {number|string} idNodo ID del nodo a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const eliminarNodo = async (idNodo) => {
    const response = await fetch(`${API_URL}/jerarquia/${idNodo}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al eliminar el nodo ${idNodo}.` }));
        throw new Error(errorData.message || `Error al eliminar el nodo ${idNodo}.`);
    }
    return response.json();
};

// --- Endpoints de TipoNodo ---

/**
 * Obtiene todos los tipos de nodo.
 * Corresponde a GET /api/tipos-nodo
 * @returns {Promise<Array<Object>>} Lista de tipos de nodo.
 */
export const obtenerTiposNodo = async () => {
    const response = await fetch(`${API_URL}/tipos-nodo`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al obtener los tipos de nodo.' }));
        throw new Error(errorData.message || 'Error al obtener los tipos de nodo.');
    }
    return response.json();
};

/**
 * Obtiene el detalle de un tipo de nodo específico.
 * Corresponde a GET /api/tipos-nodo/:id
 * @param {number|string} idTipoNodo ID del tipo de nodo.
 * @returns {Promise<Object>} Detalle del tipo de nodo.
 */
export const obtenerTipoNodoPorId = async (idTipoNodo) => {
    const response = await fetch(`${API_URL}/tipos-nodo/${idTipoNodo}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al obtener el tipo de nodo ${idTipoNodo}.` }));
        throw new Error(errorData.message || `Error al obtener el tipo de nodo ${idTipoNodo}.`);
    }
    return response.json();
};

/**
 * Crea un nuevo tipo de nodo.
 * Corresponde a POST /api/tipos-nodo
 * @param {Object} datosTipoNodo Objeto con { descripcion, icono }.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const crearTipoNodo = async (datosTipoNodo) => {
    const response = await fetch(`${API_URL}/tipos-nodo`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(datosTipoNodo),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear el tipo de nodo.' }));
        throw new Error(errorData.message || 'Error al crear el tipo de nodo.');
    }
    return response.json();
};

/**
 * Actualiza un tipo de nodo existente.
 * Corresponde a PUT /api/tipos-nodo/:id
 * @param {number|string} idTipoNodo ID del tipo de nodo a actualizar.
 * @param {Object} datosTipoNodo Objeto con { descripcion, icono }.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const actualizarTipoNodo = async (idTipoNodo, datosTipoNodo) => {
    const response = await fetch(`${API_URL}/tipos-nodo/${idTipoNodo}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(datosTipoNodo),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al actualizar el tipo de nodo ${idTipoNodo}.` }));
        throw new Error(errorData.message || `Error al actualizar el tipo de nodo ${idTipoNodo}.`);
    }
    return response.json();
};

/**
 * Elimina un tipo de nodo.
 * Corresponde a DELETE /api/tipos-nodo/:id
 * @param {number|string} idTipoNodo ID del tipo de nodo a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const eliminarTipoNodo = async (idTipoNodo) => {
    const response = await fetch(`${API_URL}/tipos-nodo/${idTipoNodo}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Error al eliminar el tipo de nodo ${idTipoNodo}.` }));
        throw new Error(errorData.message || `Error al eliminar el tipo de nodo ${idTipoNodo}.`);
    }
    return response.json();
};

/**
 * ACTUALIZADO: Actualiza los detalles de un nodo existente.
 * Corresponde a PUT /api/jerarquia/:id
 * (Asume que el backend en este endpoint ahora puede manejar más campos que solo 'descripcion')
 * @param {number|string} idNodo ID del nodo a actualizar.
 * @param {Object} datosParaActualizar Objeto con los campos a actualizar.
 *        Ej: { Descripcion, UbicacionTecnica, Caracteristicas, Activo }
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const actualizarDetallesNodo = async (idNodo, datosParaActualizar) => {
    // Construir el payload solo con los campos que el backend espera y que tienen valor.
    // Las claves deben coincidir con lo que espera req.body en tu controlador 'actualizarNodo'.
    const payload = {
        Descripcion: datosParaActualizar.Descripcion,
        UbicacionTecnica: datosParaActualizar.UbicacionTecnica,
        Caracteristicas: datosParaActualizar.Caracteristicas,
        Activo: datosParaActualizar.Activo,
        Medido: datosParaActualizar.Medido,
        IdTipoNodo: datosParaActualizar.IdTipoNodo, // <<< AÑADIR ESTO SIEMPRE QUE VENGA
    };

    // Eliminar propiedades undefined para no enviar claves vacías si no se modificaron
    Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
            delete payload[key];
        }
    });

    // Verificar si hay algo que enviar después de filtrar undefined
    if (Object.keys(payload).length === 0) {
        console.warn("actualizarDetallesNodo: No hay datos válidos para enviar en el payload.");
        // Podrías retornar un éxito simulado o lanzar un error si prefieres
        return Promise.resolve({ msg: "No se realizaron cambios (sin datos válidos)." });
    }

    const response = await fetch(`${API_URL}/jerarquia/${idNodo}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorMsg = `Error al actualizar el nodo ${idNodo}.`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.msg || errorData.message || errorMsg;
        } catch (e) { /* No hacer nada si el cuerpo del error no es JSON */ }
        throw new Error(errorMsg);
    }
    return response.json();
};

export const actualizarNodo = actualizarDetallesNodo; // Alias para mantener compatibilidad con el nombre anterior