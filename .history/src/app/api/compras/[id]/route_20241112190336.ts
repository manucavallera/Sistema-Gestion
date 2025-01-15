// app/api/compras/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener configurada la conexión a Prisma

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const compra = await prisma.compra.findUnique({
    where: { id: Number(params.id) },
    include: {
      proveedor: true, // Incluye la información del proveedor
    },
  });

  if (!compra) {
    return NextResponse.json(
      { message: "Compra no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(compra);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const compraActualizada = await prisma.compra.update({
    where: { id: Number(params.id) },
    data: {
      fecha: new Date(data.fecha),
      total: data.total,
      proveedorId: data.proveedorId,
    },
  });
  return NextResponse.json(compraActualizada);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.compra.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: "Compra eliminada" });
}
