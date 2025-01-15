// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return NextResponse.json(
      {
        message: "Error al obtener los clientes",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Crear un nuevo cliente
export async function POST(request: Request) {
  try {
    const nuevoCliente = await request.json();

    // Validar que se proporcionen todos los campos requeridos
    const { razonSocial, direccion, cuit, zona } = nuevoCliente;
    if (!razonSocial || !direccion || !cuit || !zona) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios: 'razonSocial', 'direccion', 'cuit', y 'zona' son requeridos.",
        },
        { status: 400 }
      );
    }

    // Crear el nuevo cliente en la base de datos
    const clienteCreado = await prisma.cliente.create({
      data: {
        razonSocial,
        direccion,
        cuit,
        zona,
      },
    });

    return NextResponse.json(clienteCreado, { status: 201 });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return NextResponse.json(
      {
        message: "Error al crear el cliente",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
