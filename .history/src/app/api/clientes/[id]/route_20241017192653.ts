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
  } catch (error: unknown) {
    console.error("Error al obtener el cliente:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error al obtener el cliente", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Error desconocido al obtener el cliente" },
        { status: 500 }
      );
    }
  }
}

// Manejar solicitudes DELETE para eliminar un cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.cliente.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Cliente eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return NextResponse.json(
      {
        message: "Error al eliminar el cliente",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Manejar solicitudes PUT para actualizar un cliente
// Actualizar un cliente existente
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const clienteActualizado = await request.json();

    const updatedCliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: clienteActualizado,
    });

    return NextResponse.json(updatedCliente, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar el cliente",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
