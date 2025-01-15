import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ClienteData {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
  saldo?: number; // Añadir saldo como opcional
  debe?: number; // Añadir debe como opcional
  haber?: number; // Añadir haber como opcional
}

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
    const nuevoCliente = await prisma.cliente.create({
      data: {
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        cuit: data.cuit,
        zona: data.zona,
        telefono: data.telefono || null,
        email: data.email || null,
        saldo: data.saldo || 0, // Asignar un saldo inicial
        debe: data.debe || 0, // Asignar un debe inicial
        haber: data.haber || 0, // Asignar un haber inicial
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

// Actualizar un cliente existente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const clienteId = parseInt(params.id);
  const data: ClienteData = await request.json();
  const error = validarDatosCliente(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        cuit: data.cuit,
        zona: data.zona,
        telefono: data.telefono || null,
        email: data.email || null,
        // No se deben actualizar debe, haber y saldo aquí
      },
    });
    return NextResponse.json(clienteActualizado);
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar el cliente" },
      { status: 500 }
    );
  }
}

// Eliminar un cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const clienteId = parseInt(params.id);

  try {
    await prisma.cliente.delete({
      where: { id: clienteId },
    });
    return NextResponse.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return NextResponse.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}
