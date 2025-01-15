import axios from "axios";

// URL base de la API para clientes
const API_BASE_URL = "/api/clientes";

// Tipo para un cliente
interface Cliente {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string; // Opcional
  email?: string; // Opcional
}

// Tipo para la respuesta de la API
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Obtener todos los clientes
export const getAllClients = async (): Promise<ApiResponse<Cliente[]>> => {
  try {
    const response = await axios.get<Cliente[]>(API_BASE_URL);
    return { data: response.data };
  } catch (error: unknown) {
    return {
      error:
        "Error al obtener los clientes: " +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
};

// Obtener un cliente específico por ID
export const getClientById = async (
  id: number
): Promise<ApiResponse<Cliente>> => {
  try {
    const response = await axios.get<Cliente>(`${API_BASE_URL}/${id}`);
    return { data: response.data };
  } catch (error: unknown) {
    return {
      error:
        `Error al obtener el cliente con ID ${id}: ` +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
};

// Crear un nuevo cliente
export const createClient = async (
  cliente: Cliente
): Promise<ApiResponse<Cliente>> => {
  try {
    const response = await axios.post<Cliente>(API_BASE_URL, cliente);
    return { data: response.data };
  } catch (error: unknown) {
    return {
      error:
        "Error al crear el cliente: " +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
};

// Actualizar un cliente existente
export const updateClient = async (
  id: number,
  cliente: Partial<Cliente>
): Promise<ApiResponse<Cliente>> => {
  try {
    const response = await axios.put<Cliente>(`${API_BASE_URL}/${id}`, cliente);
    return { data: response.data };
  } catch (error: unknown) {
    return {
      error:
        `Error al actualizar el cliente con ID ${id}: ` +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
};

// Eliminar un cliente
export const deleteClient = async (id: number): Promise<ApiResponse<null>> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return { data: null }; // No hay contenido que devolver al eliminar
  } catch (error: unknown) {
    return {
      error:
        `Error al eliminar el cliente con ID ${id}: ` +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
};

// Obtener clientes con saldo
export const getClientsWithBalance = async (): Promise<
  ApiResponse<Cliente[]>
> => {
  try {
    const response = await axios.get<Cliente[]>(`${API_BASE_URL}/with-balance`);
    return { data: response.data };
  } catch (error: unknown) {
    return {
      error:
        "Error al obtener los clientes con saldo: " +
        (error instanceof Error ? error.message : "Error desconocido"),
    };
  }
};
