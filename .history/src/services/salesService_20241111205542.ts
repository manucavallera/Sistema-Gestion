import axios from "axios";
import { getClientById } from "./clientService"; // Asegúrate de importar la función para obtener clientes

// Crear una instancia de Axios con configuración predeterminada
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// URL base de la API para ventas
const API_BASE_URL = "/ventas";

// Función para obtener todas las ventas
export const getAllSales = async () => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error al obtener las ventas: ${message}`);
    } else {
      throw new Error("Error desconocido al obtener las ventas");
    }
  }
};

// Función para obtener una venta específica por ID
export const getSaleById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error al obtener la venta con ID ${id}: ${message}`);
    } else {
      throw new Error(`Error desconocido al obtener la venta con ID ${id}`);
    }
  }
};

// Función para crear una nueva venta (actualizando el saldo del cliente)
export const createSale = async (venta: {
  clienteId: number;
  monto: number;
  fecha: string;
}) => {
  // Validación de datos
  if (typeof venta.clienteId !== "number" || venta.clienteId <= 0) {
    throw new Error(
      "El campo 'clienteId' debe ser un número válido y mayor que cero."
    );
  }
  if (typeof venta.monto !== "number" || venta.monto < 0) {
    throw new Error(
      "El campo 'monto' debe ser un número válido y no negativo."
    );
  }

  try {
    const response = await axiosInstance.post(API_BASE_URL, venta);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error al crear la venta: ${message}`);
    } else {
      throw new Error("Error desconocido al crear la venta");
    }
  }
};

// Función para actualizar una venta existente
export const updateSale = async (
  id: number,
  venta: { clienteId?: number; monto?: number; fecha?: string }
) => {
  // Validación de datos
  if (
    venta.clienteId !== undefined &&
    (typeof venta.clienteId !== "number" || venta.clienteId <= 0)
  ) {
    throw new Error(
      "El campo 'clienteId' debe ser un número válido y mayor que cero."
    );
  }
  if (
    venta.monto !== undefined &&
    (typeof venta.monto !== "number" || venta.monto < 0)
  ) {
    throw new Error(
      "El campo 'monto' debe ser un número válido y no negativo."
    );
  }

  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, venta);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error al actualizar la venta con ID ${id}: ${message}`);
    } else {
      throw new Error(`Error desconocido al actualizar la venta con ID ${id}`);
    }
  }
};

// Función para eliminar una venta
export const deleteSale = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error al eliminar la venta con ID ${id}: ${message}`);
    } else {
      throw new Error(`Error desconocido al eliminar la venta con ID ${id}`);
    }
  }
};

// Función para obtener todas las ventas con información del cliente
export const getAllSalesWithClients = async () => {
  try {
    const sales = await getAllSales(); // Obtener todas las ventas
    const salesWithClients = await Promise.all(
      sales.map(async (sale) => {
        const client = await getClientById(sale.clienteId); // Obtener el cliente por ID
        return {
          ...sale,
          razonSocial: client.razonSocial, // Suponiendo que el objeto cliente tiene una propiedad 'razonSocial'
        };
      })
    );
    return salesWithClients;
  } catch (error) {
    throw new Error(`Error al obtener ventas con clientes: ${error.message}`);
  }
};
