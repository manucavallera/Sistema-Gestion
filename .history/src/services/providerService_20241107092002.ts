import axios from "axios";

// URL base de la API para proveedores
const API_BASE_URL = "/api/proveedores";

// Función para obtener todos los proveedores
export const getAllProviders = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los proveedores");
  }
};

// Función para obtener un proveedor específico por ID
export const getProviderById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el proveedor con ID ${id}`);
  }
};

// Función para crear un nuevo proveedor
export const createProvider = async (proveedor: {
  nombre: string;
  direccion: string;
  cuit: string;
  zona: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, proveedor);
    return response.data;
  } catch (error) {
    throw new Error("Error al crear el proveedor");
  }
};

// Función para actualizar un proveedor existente
export const updateProvider = async (
  id: number,
  proveedor: {
    nombre?: string;
    direccion?: string;
    cuit?: string;
    zona?: string;
  }
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, proveedor);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar el proveedor con ID ${id}`);
  }
};

// Función para eliminar un proveedor
export const deleteProvider = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar el proveedor con ID ${id}`);
  }
};

// Función para obtener proveedores con saldo
export const getProvidersWithBalance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/with-balance`);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los proveedores con saldo");
  }
};
