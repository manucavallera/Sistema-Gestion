// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ClienteData {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona?: string;
  telefono?: string;
  email?: string;
  saldo?: number;
}

// Función para validar datos del cliente
const validarDatosCliente = (data: ClienteData) => {
  const { razonSocial, direccion, cuit } = data;
  if (!razonSocial || !direccion || !cuit) {
    return "Faltan datos requeridos";
  }
  // Aquí podrías agregar más validaciones, como verificar el formato de cuit y email
  return null;
};

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

export async function POST(request: Request) {
  const data: ClienteData = await request.json();

  const error = validarDatosCliente(data);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        ...data,
        saldo: data.saldo || 0, // Asegura que el saldo tenga un valor por defecto
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
