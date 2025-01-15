import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener un recibo por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID de recibo inválido" },
      { status: 400 }
    );
  }

  try {
    const recibo = await prisma.recibo.findUnique({
      where: { id },
      include: { cliente: true, proveedor: true, movimientos: true },
    });

    if (!recibo) {
      return NextResponse.json(
        { error: "Recibo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(recibo, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el recibo:", error);
    return NextResponse.json(
      { error: "Error al obtener el recibo. Por favor intenta nuevamente." },
      { status: 500 }
    );
  }
}

// Actualizar un recibo por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID de recibo inválido" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    const reciboActualizado = await prisma.recibo.update({
      where: { id },
      data,
    });

    return NextResponse.json(reciboActualizado, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el recibo:", error);
    return NextResponse.json(
      {
        error:
          "Error al actualizar el recibo. Por favor revisa los datos e intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}

// Eliminar un recibo por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID de recibo inválido" },
      { status: 400 }
    );
  }

  try {
    await prisma.recibo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Recibo eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el recibo:", error);
    return NextResponse.json(
      { error: "Error al eliminar el recibo. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
