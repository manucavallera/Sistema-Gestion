// src/app/api/clientes/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Manejar solicitudes GET para obtener un cliente
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
    });

    if (!cliente) {
      return NextResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    return NextResponse.json(
      { message: "Error al obtener el cliente", error: error.message },
      { status: 500 }
    );
  }
}

// Manejar solicitudes DELETE para eliminar un cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const clienteEliminado = await prisma.cliente.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Cliente eliminado", cliente: clienteEliminado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);

    return NextResponse.json(
      { message: "Error al eliminar el cliente", error: error.message },
      { status: 500 }
    );
  }
}
