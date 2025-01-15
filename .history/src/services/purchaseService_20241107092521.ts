import axios from "axios";

// URL base de la API para compras
const API_BASE_URL = "/api/compras";

// Función para obtener todas las compras
export const getAllPurchases = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener las compras");
  }
};

// Función para obtener una compra específica por ID
export const getPurchaseById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener la compra con ID ${id}`);
  }
};

// Función para crear una nueva compra (actualizando saldo del proveedor)
export const createPurchase = async (compra: {
  proveedorId: number;
  monto: number;
  fecha: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, compra);
    return response.data;
  } catch (error) {
    throw new Error("Error al crear la compra");
  }
};

// Función para actualizar una compra existente
export const updatePurchase = async (
  id: number,
  compra: { proveedorId?: number; monto?: number; fecha?: string }
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, compra);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar la compra con ID ${id}`);
  }
};

// Función para eliminar una compra
export const deletePurchase = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar la compra con ID ${id}`);
  }
};
