import axios from "axios";

const API_BASE = "/api/listas";

const listasService = {
  async obtenerListas() {
    try {
      const response = await axios.get(API_BASE);
      return response.data;
    } catch (error) {
      console.error("[SERVICE] obtenerListas:", error);
      return [];
    }
  },

  async crearLista(data) {
    try {
      const response = await axios.post(API_BASE, data);
      return response.data;
    } catch (error) {
      console.error("[SERVICE] crearLista:", error);
      throw error;
    }
  },

  async actualizarLista(id, data) {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("[SERVICE] actualizarLista:", error);
      throw error;
    }
  },

  async eliminarLista(id) {
    try {
      const response = await axios.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error("[SERVICE] eliminarLista:", error);
      throw error;
    }
  },
};

export default listasService;
