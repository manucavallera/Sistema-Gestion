import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener una venta por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const venta = await prisma.venta.findUnique({
    where: { id: Number(params.id) },
  });
  return venta
    ? NextResponse.json(venta)
    : NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
}

// PUT: Actualizar una venta por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updatedVenta = await prisma.venta.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updatedVenta);
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return NextResponse.json(
      { error: "Error al actualizar la venta" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una venta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.venta.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return NextResponse.json(
      { error: "Error al eliminar la venta" },
      { status: 500 }
    );
  }
}
