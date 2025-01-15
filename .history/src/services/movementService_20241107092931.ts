import axios from "axios";

// URL base de la API para movimientos de cuenta corriente
const MOVEMENTS_API_BASE_URL = "/api/movimientos";

// Obtener todos los movimientos de cuenta corriente
export const getAllMovements = async () => {
  try {
    const response = await axios.get(MOVEMENTS_API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los movimientos de cuenta corriente");
  }
};

// Obtener un movimiento específico por ID
export const getMovementById = async (id: number) => {
  try {
    const response = await axios.get(`${MOVEMENTS_API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el movimiento con ID ${id}`);
  }
};

// Registrar un nuevo movimiento
export const createMovement = async (movimiento: {
  clienteId?: number;
  proveedorId?: number;
  monto: number;
  tipo: string;
  fecha: string;
}) => {
  try {
    const response = await axios.post(MOVEMENTS_API_BASE_URL, movimiento);
    return response.data;
  } catch (error) {
    throw new Error("Error al registrar el movimiento");
  }
};

// Obtener movimientos de un cliente específico
export const getMovementsByClientId = async (clientId: number) => {
  try {
    const response = await axios.get(
      `${MOVEMENTS_API_BASE_URL}/cliente/${clientId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error al obtener los movimientos del cliente con ID ${clientId}`
    );
  }
};

// Obtener movimientos de un proveedor específico
export const getMovementsByProviderId = async (providerId: number) => {
  try {
    const response = await axios.get(
      `${MOVEMENTS_API_BASE_URL}/proveedor/${providerId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error al obtener los movimientos del proveedor con ID ${providerId}`
    );
  }
};
