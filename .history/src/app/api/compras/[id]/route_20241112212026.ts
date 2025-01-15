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

  // Buscar el proveedor por ID o razón social
  let proveedorId;

  if (data.proveedorId) {
    proveedorId = data.proveedorId; // Si se pasa el ID del proveedor, usarlo directamente
  } else if (data.razonSocial) {
    const proveedor = await prisma.proveedor.findFirst({
      where: {
        razonSocial: data.razonSocial, // Busca por razón social
      },
    });

    if (!proveedor) {
      return NextResponse.json(
        { message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    proveedorId = proveedor.id; // Usa el ID del proveedor encontrado
  } else {
    return NextResponse.json(
      { message: "Se requiere proveedorId o razonSocial" },
      { status: 400 }
    );
  }

  const compraActualizada = await prisma.compra.update({
    where: { id: Number(params.id) },
    data: {
      fecha: new Date(data.fecha),
      total: data.total,
      proveedorId, // Usa el ID del proveedor
    },
    include: {
      proveedor: true, // Incluye la información del proveedor en la respuesta
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
