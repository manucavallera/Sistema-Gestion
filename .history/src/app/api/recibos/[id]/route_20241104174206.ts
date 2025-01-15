import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener un recibo por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recibo = await prisma.recibo.findUnique({
      where: { id: Number(params.id) },
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
    return NextResponse.json(
      { error: "Error al obtener el recibo" },
      { status: 500 }
    );
  }
}

// Actualizar un recibo por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const reciboActualizado = await prisma.recibo.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(reciboActualizado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el recibo" },
      { status: 500 }
    );
  }
}

// Eliminar un recibo por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.recibo.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Recibo eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el recibo" },
      { status: 500 }
    );
  }
}
