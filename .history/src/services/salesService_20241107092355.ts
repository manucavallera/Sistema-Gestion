import axios from "axios";

// URL base de la API para ventas
const API_BASE_URL = "/api/ventas";

// Función para obtener todas las ventas
export const getAllSales = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener las ventas");
  }
};

// Función para obtener una venta específica por ID
export const getSaleById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener la venta con ID ${id}`);
  }
};

// Función para crear una nueva venta (actualizando el saldo del cliente)
export const createSale = async (venta: {
  clienteId: number;
  monto: number;
  fecha: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, venta);
    return response.data;
  } catch (error) {
    throw new Error("Error al crear la venta");
  }
};

// Función para actualizar una venta existente
export const updateSale = async (
  id: number,
  venta: { clienteId?: number; monto?: number; fecha?: string }
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, venta);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar la venta con ID ${id}`);
  }
};

// Función para eliminar una venta
export const deleteSale = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar la venta con ID ${id}`);
  }
};
