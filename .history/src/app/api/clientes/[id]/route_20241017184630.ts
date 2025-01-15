// src/app/api/clientes/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany(); // Obtiene todos los clientes de la base de datos
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.error(); // Manejo de errores
  }
}

export async function POST(request: Request) {
  try {
    const nuevoCliente = await request.json();

    // Crea un nuevo cliente en la base de datos
    const clienteCreado = await prisma.cliente.create({
      data: nuevoCliente,
    });

    return NextResponse.json(clienteCreado);
  } catch (error) {
    return NextResponse.error(); // Manejo de errores
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...actualizado } = await request.json();

    // Actualiza el cliente en la base de datos
    const clienteActualizado = await prisma.cliente.update({
      where: { id },
      data: actualizado,
    });

    return NextResponse.json(clienteActualizado);
  } catch (error) {
    return NextResponse.error(); // Manejo de errores
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "ID del cliente es requerido" },
      { status: 400 }
    );
  }

  try {
    const clienteEliminado = await prisma.cliente.delete({
      where: { id: Number(id) }, // Asegúrate de convertir el id a número
    });

    return NextResponse.json({
      message: "Cliente eliminado",
      cliente: clienteEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error); // Imprime el error para depuración

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al eliminar el cliente", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error desconocido al eliminar el cliente" },
        { status: 500 }
      );
    }
  }
}
