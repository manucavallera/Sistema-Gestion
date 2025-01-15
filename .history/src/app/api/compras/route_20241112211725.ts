// app/api/compras/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener configurada la conexión a Prisma

export async function GET() {
  const compras = await prisma.compra.findMany({
    include: {
      proveedor: true, // Incluye la información del proveedor
    },
  });
  return NextResponse.json(compras);
}

export async function POST(request: Request) {
  const data = await request.json();

  // Buscar el proveedor por razón social
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

  const nuevaCompra = await prisma.compra.create({
    data: {
      fecha: new Date(data.fecha),
      total: data.total,
      proveedorId: proveedor.id, // Usa el ID del proveedor encontrado
    },
    include: {
      proveedor: true, // Incluye la información del proveedor en la respuesta
    },
  });

  return NextResponse.json(nuevaCompra);
}
