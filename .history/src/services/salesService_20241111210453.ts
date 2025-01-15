import axios, { AxiosError } from "axios";
import { getClientById } from './clientService'; // Asegúrate de importar la función para obtener clientes

// Definición de la interfaz Sale
interface Sale {
  id: number;
  clienteId: number;
  monto: number;
  fecha: string;
  // Agrega otras propiedades según sea necesario
}

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
export const getAllSales = async (): Promise<Sale[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Error al obtener las ventas");
    return []; // Asegúrate de que se devuelva un valor por defecto
  }
};

// Función para obtener una venta específica por ID
export const getSaleById = async (id: number): Promise<Sale | undefined> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, `Error al obtener la venta con ID ${id}`);
    return undefined; // Asegúrate de que se devuelva un valor por defecto
  }
};

// Función para crear una nueva venta (actualizando el saldo del cliente)
export const createSale = async (venta: {
  clienteId: number;
  monto: number;
  fecha: string;
}): Promise<Sale> => {
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
    handleAxiosError(error, "Error al crear la venta");
    return undefined; // Asegúrate de que se devuelva un valor por defecto
  }
};

// Función para actualizar una venta existente
export const updateSale = async (
  id: number,
  venta: { clienteId?: number; monto?: number; fecha?: string }
): Promise<Sale | undefined> => {
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
    handleAxiosError(error, `Error al actualizar la venta con ID ${id}`);
    return undefined; // Asegúrate de que se devuelva un valor por defecto
  }
};

// Función para eliminar una venta
export const deleteSale = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE URL}/${id}`);
  } catch (error: unknown) {
    handleAxiosError(error, `Error al eliminar la venta con ID ${id}`);
  }
};

// Función para obtener todas las ventas con información del cliente
export const getAllSalesWithClients = async (): Promise<(Sale & { razonSocial: string })[]> => {
  try {
    const sales: Sale[] = await getAllSales(); // Obtener todas las ventas
    const salesWithClients = await Promise.all(
      sales.map(async (sale: Sale) => { // Especificar el tipo de 'sale'
        const client = await getClientById(sale.clienteId); // Obtener el cliente por ID
        return {
          ...sale,
          razonSocial: client.razonSocial, // Suponiendo que el objeto cliente tiene una propiedad 'razonSocial'
        };
      })
    );
    return salesWithClients;
  } catch (error: unknown) {
    throw new Error(`Error al obtener ventas con clientes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Función para manejar errores de Axios
const handleAxiosError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    throw new Error(`${defaultMessage}: ${message}`);
  } else {
    throw new Error(`${defaultMessage}: Error desconocido`);
  }
}; 

