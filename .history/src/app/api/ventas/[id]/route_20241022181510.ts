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
  const data = await req.json();
  const updatedVenta = await prisma.venta.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updatedVenta);
}

// DELETE: Eliminar una venta por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.venta.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: "Venta eliminada correctamente" });
}
