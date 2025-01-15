// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Tipo para la respuesta de la API
interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Obtener todos los clientes
export async function GET(): Promise<NextResponse<ApiResponse<Cliente[]>>> {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json({ data: clientes }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return NextResponse.json(
      {
        error:
          "Error al obtener los clientes: " +
          (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 }
    );
  }
}

// Crear un nuevo cliente
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<Cliente>>> {
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

    // Validaciones adicionales
    if (typeof cuit !== "string" || cuit.length < 11) {
      return NextResponse.json(
        {
          error:
            "El CUIT debe ser un string válido con al menos 11 caracteres.",
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

    return NextResponse.json({ data: clienteCreado }, { status: 201 });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "El CUIT ya está en uso." },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      {
        error:
          "Error al crear el cliente: " +
          (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 }
    );
  }
}
