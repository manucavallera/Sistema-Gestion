// src/lib/remitosApi.ts

const BASE_URL = "/api/remitos";

// Obtener todos los remitos
export async function fetchRemitos() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los remitos");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Obtener un remito por ID
export async function fetchRemitoById(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el remito");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Crear un nuevo remito
export async function createRemito(
  total: number,
  clienteId?: number,
  proveedorId?: number
) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ total, clienteId, proveedorId }),
    });
    if (!response.ok) {
      throw new Error("Error al crear el remito");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Actualizar un remito por ID
export async function updateRemito(
  id: string,
  data: { total?: number; clienteId?: number; proveedorId?: number }
) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el remito");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Eliminar un remito por ID
export async function deleteRemito(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el remito");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
