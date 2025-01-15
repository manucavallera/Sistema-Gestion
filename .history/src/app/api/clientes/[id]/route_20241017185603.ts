import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) }, // Asegúrate de convertir el ID a número
    });
    if (!cliente) {
      return NextResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Error al obtener el cliente:", error); // Imprime el error para depuración
    return NextResponse.error(); // Manejo de errores
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const clienteEliminado = await prisma.cliente.delete({
      where: { id: Number(id) }, // Asegúrate de convertir el ID a número
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
