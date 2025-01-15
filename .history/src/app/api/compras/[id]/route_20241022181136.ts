import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ajustar la ruta según tu configuración de Prisma

// GET: Obtener una compra por ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const compra = await prisma.compra.findUnique({
    where: { id: Number(params.id) },
  });
  return compra
    ? NextResponse.json(compra)
    : NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
}

// PUT: Actualizar una compra por ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const updatedCompra = await prisma.compra.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updatedCompra);
}

// DELETE: Eliminar una compra por ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.compra.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: "Compra eliminada correctamente" });
}
