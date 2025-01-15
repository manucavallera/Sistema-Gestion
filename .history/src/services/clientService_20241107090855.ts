import axios from "axios";

// URL base de la API (ajusta esta URL según tu configuración)
const API_BASE_URL = "/api/clientes";

// Función para obtener todos los clientes
export const getAllClients = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los clientes");
  }
};

// Función para obtener un cliente específico por ID
export const getClientById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el cliente con ID ${id}`);
  }
};

// Función para crear un nuevo cliente
export const createClient = async (cliente: {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, cliente);
    return response.data;
  } catch (error) {
    throw new Error("Error al crear el cliente");
  }
};

// Función para actualizar un cliente existente
export const updateClient = async (
  id: number,
  cliente: {
    razonSocial?: string;
    direccion?: string;
    cuit?: string;
    zona?: string;
  }
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, cliente);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar el cliente con ID ${id}`);
  }
};

// Función para eliminar un cliente
export const deleteClient = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar el cliente con ID ${id}`);
  }
};

// Función para obtener clientes con saldo
export const getClientsWithBalance = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/with-balance`);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los clientes con saldo");
  }
};
