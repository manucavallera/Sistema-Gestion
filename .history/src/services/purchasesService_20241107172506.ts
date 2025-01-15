import axios from "axios";

// URL base de la API para compras
const API_BASE_URL = "/api/compras";

// Función para obtener todas las compras
export const getAllPurchases = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    // Manejo de errores mejorado
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al obtener las compras: ${errorMessage}`);
  }
};

// Función para obtener una compra específica por ID
export const getPurchaseById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al obtener la compra con ID ${id}: ${errorMessage}`);
  }
};

// Función para crear una nueva compra (actualizando saldo del proveedor)
export const createPurchase = async (compra: {
  proveedorId: number;
  total: number; // Cambié 'monto' a 'total' para que coincida con tu API
  fecha: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, compra);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(`Error al crear la compra: ${errorMessage}`);
  }
};

// Función para actualizar una compra existente
export const updatePurchase = async (
  id: number,
  compra: { proveedorId?: number; total?: number; fecha?: string } // Cambié 'monto' a 'total'
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, compra);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(
      `Error al actualizar la compra con ID ${id}: ${errorMessage}`
    );
  }
};

// Función para eliminar una compra
export const deletePurchase = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    throw new Error(
      `Error al eliminar la compra con ID ${id}: ${errorMessage}`
    );
  }
};
