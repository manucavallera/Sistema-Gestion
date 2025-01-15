import axios from "axios";

// URL base de la API para pagos y formas de pago
const PAYMENTS_API_BASE_URL = "/api/pagos";
const PAYMENT_METHODS_API_BASE_URL = "/api/formas-de-pago";

// Funciones para el Historial de Pagos

// Obtener todos los pagos registrados
export const getAllPayments = async () => {
  try {
    const response = await axios.get(PAYMENTS_API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener el historial de pagos");
  }
};

// Obtener un pago específico por ID
export const getPaymentById = async (id: number) => {
  try {
    const response = await axios.get(`${PAYMENTS_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el pago con ID ${id}`);
  }
};

// Registrar un nuevo pago
export const createPayment = async (pago: {
  clienteId: number;
  proveedorId?: number;
  monto: number;
  fecha: string;
}) => {
  try {
    const response = await axios.post(PAYMENTS_API_BASE_URL, pago);
    return response.data;
  } catch (error) {
    throw new Error("Error al registrar el pago");
  }
};

// Obtener pagos vinculados a un cliente específico
export const getPaymentsByClientId = async (clientId: number) => {
  try {
    const response = await axios.get(
      `${PAYMENTS_API_BASE_URL}/cliente/${clientId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener pagos del cliente con ID ${clientId}`);
  }
};

// Obtener pagos vinculados a un proveedor específico
export const getPaymentsByProviderId = async (providerId: number) => {
  try {
    const response = await axios.get(
      `${PAYMENTS_API_BASE_URL}/proveedor/${providerId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error al obtener pagos del proveedor con ID ${providerId}`
    );
  }
};

// Funciones para las Formas de Pago

// Listar todas las formas de pago disponibles
export const getAllPaymentMethods = async () => {
  try {
    const response = await axios.get(PAYMENT_METHODS_API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener las formas de pago");
  }
};

// Agregar una nueva forma de pago
export const createPaymentMethod = async (method: { nombre: string }) => {
  try {
    const response = await axios.post(PAYMENT_METHODS_API_BASE_URL, method);
    return response.data;
  } catch (error) {
    throw new Error("Error al agregar la forma de pago");
  }
};

// Eliminar una forma de pago
export const deletePaymentMethod = async (id: number) => {
  try {
    const response = await axios.delete(
      `${PAYMENT_METHODS_API_BASE_URL}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar la forma de pago con ID ${id}`);
  }
};
