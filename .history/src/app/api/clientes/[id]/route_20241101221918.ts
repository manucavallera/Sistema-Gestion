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

    return NextResponse.json(
      {
        message: "Error al obtener el cliente",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Manejar solicitudes DELETE para eliminar un cliente
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const clienteActualizado = await request.json();

    // Validar que se proporcionen campos requeridos
    const { razonSocial, direccion, cuit } = clienteActualizado;
    if (!razonSocial || !direccion || !cuit) {
      return NextResponse.json(
        {
          error:
            "Faltan campos obligatorios: 'razonSocial', 'direccion', y 'cuit' son requeridos.",
        },
        { status: 400 }
      );
    }

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
