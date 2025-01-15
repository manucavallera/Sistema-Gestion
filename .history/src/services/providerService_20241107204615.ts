import axios from "axios";

// URL base de la API para proveedores
const API_BASE_URL = "http://localhost:3000/api/proveedores"; // Asegúrate de que esta URL sea correcta

// Función para obtener todos los proveedores
export const getAllProviders = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw new Error("Error al obtener los proveedores");
  }
};

// Función para obtener un proveedor específico por ID
export const getProviderById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el proveedor con ID ${id}:`, error);
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
    if (axios.isAxiosError(error)) {
      // Acceder a la respuesta del error
      console.error("Error al crear el proveedor:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al crear el proveedor"
      );
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Error al crear el proveedor");
    }
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
    console.error(`Error al actualizar el proveedor con ID ${id}:`, error);
    throw new Error(`Error al actualizar el proveedor con ID ${id}`);
  }
};

// Función para eliminar un proveedor
export const deleteProvider = async (id: number) => {
  try {
    console.log(`Intentando eliminar el proveedor con ID: ${id}`);
    const provider = await getProviderById(id);
    if (!provider) {
      throw new Error(`Proveedor con ID ${id} no encontrado`);
    }

    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    console.log(`Proveedor con ID ${id} eliminado exitosamente`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el proveedor con ID ${id}:`, error);
    throw new Error(`Error al eliminar el proveedor con ID ${id}`);
  }
};

// Función para obtener proveedores con saldo
export const getProvidersWithBalance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/with-balance`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proveedores con saldo:", error);
    throw new Error("Error al obtener los proveedores con saldo");
  }
};
