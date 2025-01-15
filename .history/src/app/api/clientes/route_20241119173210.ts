import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ClienteData {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string; // Asegúrate de que esto sea obligatorio
  telefono?: string;
  email?: string;
  saldo?: number; // Mantener el saldo para el cliente
}

// Función para validar los datos del cliente
const validarDatosCliente = (data: ClienteData) => {
  const { razonSocial, direccion, cuit, zona } = data;
  if (!razonSocial || !direccion || !cuit || !zona) {
    return "Faltan datos requeridos";
  }
  return null;
};

// Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

// Crear un nuevo cliente
export async function POST(request: Request) {
  const data: ClienteData = await request.json();

  const error = validarDatosCliente(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    // Crear el nuevo cliente
    const nuevoCliente = await prisma.cliente.create({
      data: {
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        cuit: data.cuit,
        zona: data.zona, // Asegurarse de que siempre se le asigne un valor válido
        telefono: data.telefono || "", // Asignar cadena vacía si no hay valor
        email: data.email || "", // Asignar cadena vacía si no hay valor
        saldo: data.saldo || 0, // Inicializar saldo en 0 si no se proporciona
      },
    });
    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return NextResponse.json(
      { error: "Error al crear el cliente" },
      { status: 500 }
    );
  }
}
