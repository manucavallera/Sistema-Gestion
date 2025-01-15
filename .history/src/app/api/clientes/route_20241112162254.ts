// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  const { razonSocial, direccion, cuit, zona, telefono, email, saldo } =
    await request.json();

  // Validación básica de datos
  if (!razonSocial || !direccion || !cuit) {
    return NextResponse.json(
      { error: "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
        telefono,
        email,
        saldo: saldo || 0,
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
