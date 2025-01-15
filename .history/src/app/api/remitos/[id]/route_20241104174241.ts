import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener un remito por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const remito = await prisma.remito.findUnique({
      where: { id: Number(params.id) },
      include: { cliente: true, proveedor: true, movimientos: true },
    });

    if (!remito) {
      return NextResponse.json(
        { error: "Remito no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(remito, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el remito" },
      { status: 500 }
    );
  }
}

// Actualizar un remito por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const remitoActualizado = await prisma.remito.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(remitoActualizado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el remito" },
      { status: 500 }
    );
  }
}

// Eliminar un remito por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.remito.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Remito eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el remito" },
      { status: 500 }
    );
  }
}
