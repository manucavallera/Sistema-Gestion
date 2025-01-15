// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ClienteData {
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona?: string | null; // Asegúrate de que el tipo sea compatible
  telefono?: string;
  email?: string;
  saldo?: number;
}

const validarDatosCliente = (data: ClienteData) => {
  const { razonSocial, direccion, cuit } = data;
  if (!razonSocial || !direccion || !cuit) {
    return "Faltan datos requeridos";
  }
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
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        cuit: data.cuit,
        zona: data.zona || null, // Asignar null si no hay valor
        telefono: data.telefono || null,
        email: data.email || null,
        saldo: data.saldo || 0,
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
