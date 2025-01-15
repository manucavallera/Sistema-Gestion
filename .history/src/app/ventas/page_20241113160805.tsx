import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener una venta por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const venta = await prisma.venta.findUnique({
      where: { id: Number(id) },
    });
    if (!venta) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(venta);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return NextResponse.json(
      { error: "Error al obtener la venta" },
      { status: 500 }
    );
  }
}

// Actualizar una venta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validación de datos
  const { fecha, total, clienteId } = await req.json();
  if (typeof total !== "number" || total < 0) {
    return NextResponse.json(
      { error: "El total debe ser un número positivo." },
      { status: 400 }
    );
  }

  try {
    const ventaActualizada = await prisma.venta.update({
      where: { id: Number(id) },
      data: {
        fecha,
        total,
        clienteId,
      },
    });
    return NextResponse.json(ventaActualizada);
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return NextResponse.json(
      { error: "Error al actualizar la venta" },
      { status: 500 }
    );
  }
}

// Eliminar una venta por ID (soft delete)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const ventaEliminada = await prisma.venta.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(), // Implementar soft delete
      },
    });
    return NextResponse.json({
      message: "Venta eliminada correctamente",
      ventaEliminada,
    });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return NextResponse.json(
      { error: "Error al eliminar la venta" },
      { status: 500 }
    );
  }
}
