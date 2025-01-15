import axios from "axios";

// URL base de la API para impresión de documentos
const PRINT_API_BASE_URL = "/api";

// Obtener un recibo para impresión por ID
export const getReceiptById = async (id: number) => {
  try {
    const response = await axios.get(`${PRINT_API_BASE_URL}/recibos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el recibo con ID ${id}`);
  }
};

// Obtener un remito para impresión por ID
export const getRemitById = async (id: number) => {
  try {
    const response = await axios.get(`${PRINT_API_BASE_URL}/remitos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el remito con ID ${id}`);
  }
};
